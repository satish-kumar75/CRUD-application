/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import AddForm from "./AddForm";
import Table from "./Table";
import Pagination from "./Pagination";
import "./DataTable.css"; // Import the CSS file
import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const DataTable = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    coupon: "",
    aadhaar: "",
    dob: "", // Ensure dob is a string
  });
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const lastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = lastItem - itemsPerPage;

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "pandetails"));
      const firebaseData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dob: data.dob ? data.dob.toDate().toLocaleDateString() : "", // Convert Firestore timestamp to date string
        };
      });
      setData(firebaseData);
    };
    fetchData();
  }, []);

  const getNextId = () => {
    if (data.length === 0) return 1;
    const ids = data.map((item) => item.customId || 0);
    return Math.max(...ids) + 1;
  };

  const filteredItems = data.filter((item) =>
    item.name
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false
  );

  const filteredData = filteredItems.slice(indexOfFirstItem, lastItem);

  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = async () => {
    if (
      formData.name &&
      formData.mobile &&
      formData.coupon &&
      formData.aadhaar &&
      formData.dob
    ) {
      const newData = {
        customId: getNextId(), // Add custom ID here
        name: formData.name,
        mobile: formData.mobile,
        coupon: formData.coupon,
        aadhaar: formData.aadhaar,
        dob: new Date(formData.dob), // Convert date string to Date object
      };
      const docRef = await addDoc(collection(db, "pandetails"), newData);
      setData([
        ...data,
        { id: docRef.id, ...newData, dob: newData.dob.toLocaleDateString() },
      ]);
      setFormData({ name: "", mobile: "", coupon: "", aadhaar: "", dob: "" });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleAddClick();
  };

  const handleDelete = async (id) => {
    if (filteredData.length === 1 && currentPage !== 1)
      setCurrentPage((prev) => prev - 1);
    await deleteDoc(doc(db, "pandetails", id));
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
  };

  const handleEdit = async (id, updatedData) => {
    if (editId === null || editId !== id) return;
    if (updatedData.dob) {
      updatedData.dob = new Date(updatedData.dob);
    }
    await updateDoc(doc(db, "pandetails", id), updatedData);
    const updatedList = data.map((item) =>
      item.id === id
        ? { ...item, ...updatedData, dob: updatedData.dob.toLocaleDateString() }
        : item
    );
    setData(updatedList);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container md:w-10/12 w-full p-5 mx-auto">
      <AddForm
        formData={formData}
        handleFormData={handleFormData}
        handleFormSubmit={handleFormSubmit}
      />
      <input
        className="p-2 rounded-lg mb-4 w-fit text-black"
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table
        data={data}
        filteredData={filteredData}
        editId={editId}
        setEditId={setEditId}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredItems.length}
        paginate={paginate}
      />
    </div>
  );
};

export default DataTable;
