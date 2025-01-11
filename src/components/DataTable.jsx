import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  Phone,
  Ticket,
  CreditCard,
  Calendar,
  Trash2,
  Edit2,
  Plus,
  AlertCircle,
  TrendingUp 
} from "lucide-react";
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
    dob: "",
  });
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 10;
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
          dob: data.dob ? data.dob.toDate().toLocaleDateString() : "",
        };
      });
      setData(firebaseData);
    };
    fetchData();
  }, []);

  const totalEntries = data.length;
  const todayEntries = data.filter(
    (item) => new Date(item.dob).toDateString() === new Date().toDateString()
  ).length;
  const recentEntries = data.slice(-5);

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
      // Check if Aadhaar number already exists
      const isDuplicate = data.some(item => item.aadhaar === formData.aadhaar);
      if (isDuplicate) {
        alert("This Aadhaar number already exists. Please check and try again.");
        return;
      }

      const newData = {
        customId: getNextId(),
        name: formData.name,
        mobile: formData.mobile,
        coupon: formData.coupon,
        aadhaar: formData.aadhaar,
        dob: new Date(formData.dob),
      };
      const docRef = await addDoc(collection(db, "pandetails"), newData);
      setData([
        ...data,
        { id: docRef.id, ...newData, dob: newData.dob.toLocaleDateString() },
      ]);
      setFormData({ name: "", mobile: "", coupon: "", aadhaar: "", dob: "" });
      setShowForm(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleAddClick();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      if (filteredData.length === 1 && currentPage !== 1)
        setCurrentPage((prev) => prev - 1);
      await deleteDoc(doc(db, "pandetails", id));
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
    }
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

  return (
    <div className="container min-h-screen py-8 w-full">
      <div className="max-w-5xl w-full mx-auto px-4">
        {/* Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 rounded-xl shadow-md hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Entries</p>
                <h3 className="text-3xl font-bold text-blue-700">
                  {totalEntries}
                </h3>
              </div>
              <Users className="h-12 w-12 text-orange-500" />
            </div>
          </div>
          <div className="card p-6 rounded-xl shadow-md hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Today's Entries</p>
                <h3 className="text-3xl font-bold text-blue-700">
                  {todayEntries}
                </h3>
              </div>
              <TrendingUp className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <div className="card p-6 rounded-xl shadow-md hover:shadow-2xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Completion Rate</p>
                <h3 className="text-3xl font-bold text-blue-700">
                  {Math.round((totalEntries / (totalEntries + 1)) * 100)}%
                </h3>
              </div>
              <AlertCircle className="h-12 w-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Add Section */}
        <div className="card rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <input
                className="w-full pl-10 pr-4 py-2 rounded-lg border bg-zinc-800 border-gray-300 caret-blue-900 focus:ring-gray-400 transition-colors"
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showForm ? "Cancel" : "Add New Entry"}
              {!showForm && <Plus className="h-5 w-5" />}
            </button>
          </div>

          {/* Add Form */}
          {showForm && (
            <form
              onSubmit={handleFormSubmit}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
            >
              <div className="relative">
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-zinc-800 border-gray-300 caret-blue-900 focus:ring-gray-400 "
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormData}
                />
                <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-zinc-800 border-gray-300 caret-blue-900 focus:ring-gray-400"
                  type="text"
                  placeholder="Mobile No."
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleFormData}
                />
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-zinc-800 border-gray-300 caret-blue-900 focus:ring-gray-400"
                  type="text"
                  placeholder="Coupon No."
                  name="coupon"
                  value={formData.coupon}
                  onChange={handleFormData}
                />
                <Ticket className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-zinc-800 border-gray-300 caret-blue-900 focus:ring-gray-400"
                  type="text"
                  placeholder="Aadhaar No."
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleFormData}
                />
                <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-zinc-800 border-gray-300 caret-blue-900 focus:ring-gray-400 placeholder:text-black"
                  type="date"
                  placeholder="Date of Birth"
                  name="dob"
                  value={formData.dob}
                  onChange={handleFormData}
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                type="submit"
                className="col-span-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Entry
              </button>
            </form>
          )}

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="card w-full border-collapse rounded-xl mb-6 min-w-[800px]">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coupon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aadhaar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DOB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-700 cursor-pointer">
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-50"
                      contentEditable={editId === item.id}
                      onBlur={(e) =>
                        handleEdit(item.id, { name: e.target.innerText })
                      }
                    >
                      {item.name}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-50"
                      contentEditable={editId === item.id}
                      onBlur={(e) =>
                        handleEdit(item.id, { mobile: e.target.innerText })
                      }
                    >
                      {item.mobile}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-50"
                      contentEditable={editId === item.id}
                      onBlur={(e) =>
                        handleEdit(item.id, { coupon: e.target.innerText })
                      }
                    >
                      {item.coupon}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-50"
                      contentEditable={editId === item.id}
                      onBlur={(e) =>
                        handleEdit(item.id, { aadhaar: e.target.innerText })
                      }
                    >
                      {item.aadhaar}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-50"
                      contentEditable={editId === item.id}
                      onBlur={(e) =>
                        handleEdit(item.id, { dob: e.target.innerText })
                      }
                    >
                      {item.dob}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditId(item.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1 ? "bg-gray-300" : "bg-blue-600 text-white"
              }`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of{" "}
              {Math.ceil(filteredItems.length / itemsPerPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredItems.length / itemsPerPage)
                  )
                )
              }
              disabled={
                currentPage === Math.ceil(filteredItems.length / itemsPerPage)
              }
              className={`px-4 py-2 rounded-lg ${
                currentPage === Math.ceil(filteredItems.length / itemsPerPage)
                  ? "bg-gray-300"
                  : "bg-blue-600 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
