import React, { useState, useEffect, useCallback } from "react";
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
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Check,
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
import toast from "react-hot-toast";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import DeleteDialog from "./UI/DeleteDialog";
import Pagination from "./UI/Pagination";
import SearchBar from "./UI/SearchBar";
import Table from "./UI/Table";
import Button from "./UI/Button";
import Insights from "./Insights";
import AddForm from "./AddForm";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(collection(db, "pandetails"));
        const firebaseData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            dob: data.dob ? data.dob.toDate().toLocaleDateString("en-GB") : "",
          };
        });
        setData(firebaseData);
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
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
    const { name, value } = e.target;

    if (name === "aadhaar") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 12);
      setFormData({ ...formData, [name]: sanitizedValue });
    } else if (name === "mobile") {
      // Only allow digits and limit to 10 characters for mobile
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: sanitizedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddClick = async () => {
    if (
      formData.name &&
      formData.mobile &&
      formData.coupon &&
      formData.aadhaar &&
      formData.dob
    ) {
      // Validate Aadhaar number
      if (!/^\d{12}$/.test(formData.aadhaar)) {
        toast.error("Please enter a valid 12-digit Aadhaar number");
        return;
      }

      // Validate mobile number
      if (!/^\d{10}$/.test(formData.mobile)) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }

      // Check if Aadhaar number already exists
      const isDuplicate = data.some(
        (item) => item.aadhaar === formData.aadhaar
      );
      if (isDuplicate) {
        toast.error("This Aadhaar number already exists");
        return;
      }

      try {
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
          {
            id: docRef.id,
            ...newData,
            dob: newData.dob.toLocaleDateString("en-GB"),
          },
        ]);
        setFormData({ name: "", mobile: "", coupon: "", aadhaar: "", dob: "" });
        setShowForm(false);
        toast.success("Record added successfully!");
      } catch (error) {
        toast.error("Failed to add record");
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleAddClick();
  };

  const handleDelete = async (id) => {
    try {
      if (filteredData.length === 1 && currentPage !== 1)
        setCurrentPage((prev) => prev - 1);
      await deleteDoc(doc(db, "pandetails", id));
      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
      setShowDeleteDialog(false);
      toast.success("Record deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  const handleEdit = async (id, updatedData) => {
    if (!id) return;

    try {
      // Add Aadhaar validation for edit mode
      if (updatedData.aadhaar) {
        if (!/^\d{12}$/.test(updatedData.aadhaar)) {
          toast.error("Please enter a valid 12-digit Aadhaar number");
          return;
        }

        // Check for duplicate Aadhaar, excluding the current record
        const isDuplicate = data.some(
          (item) => item.id !== id && item.aadhaar === updatedData.aadhaar
        );
        if (isDuplicate) {
          toast.error("This Aadhaar number already exists");
          return;
        }
      }

      if (updatedData.dob) {
        updatedData.dob = new Date(updatedData.dob);
      }

      await updateDoc(doc(db, "pandetails", id), updatedData);
      const updatedList = data.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedData,
              dob: updatedData.dob?.toLocaleDateString("en-GB") || item.dob,
            }
          : item
      );
      setData(updatedList);
    } catch (error) {
      toast.error("Failed to update record");
      throw error;
    }
  };

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Mobile",
      accessorKey: "mobile",
    },
    {
      header: "Coupon",
      accessorKey: "coupon",
    },
    {
      header: "Aadhaar",
      accessorKey: "aadhaar",
    },
    {
      header: "DOB",
      accessorKey: "dob",
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const isEditing = editId === row.original.id;

        const handleSave = async () => {
          try {
            // Get all edited values from the row
            const editedData = {};
            const cells = row.getVisibleCells();
            cells.forEach((cell) => {
              if (!["actions"].includes(cell.column.id)) {
                const element = document.querySelector(
                  `[data-cell-id="${cell.id}"]`
                );
                if (element) {
                  editedData[cell.column.id] = element.innerText;
                }
              }
            });

            // Validate edited data
            if (editedData.aadhaar && !/^\d{12}$/.test(editedData.aadhaar)) {
              toast.error("Please enter a valid 12-digit Aadhaar number");
              return;
            }
            if (editedData.mobile && !/^\d{10}$/.test(editedData.mobile)) {
              toast.error("Please enter a valid 10-digit mobile number");
              return;
            }

            await handleEdit(row.original.id, editedData);
            setEditId(null);
            toast.success("Record updated successfully!");
          } catch (error) {
            toast.error("Failed to update record");
          }
        };

        return (
          <div className="flex gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Check className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => setEditId(row.original.id)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => {
                setDeleteId(row.original.id);
                setShowDeleteDialog(true);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const searchValue = filterValue.toLowerCase();
      const name = String(row.getValue("name") || "").toLowerCase();
      const mobile = String(row.getValue("mobile") || "").toLowerCase();

      return name.includes(searchValue) || mobile.includes(searchValue);
    },
  });

  return (
    <div className="container min-h-screen py-4 w-full">
      <div className="max-w-7xl w-full mx-auto px-0 sm:px-4">
        {/* Insights Section */}
        <div className="px-3 sm:px-6 mb-4">
          <Insights totalEntries={totalEntries} todayEntries={todayEntries} />
        </div>

        {/* Main card with updated styling */}
        <div className="card rounded-xl shadow-lg p-3 sm:p-6 mb-8 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50">
          {/* Search and Add Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <SearchBar
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
            <Button
              onClick={() => setShowForm(!showForm)}
              icon={!showForm ? <Plus className="h-5 w-5" /> : null}
              iconPosition="right"
            >
              {showForm ? "Cancel" : "Add New Entry"}
            </Button>
          </div>

          {/* Add Form */}
          {showForm && (
            <AddForm
              formData={formData}
              handleFormData={handleFormData}
              handleFormSubmit={handleFormSubmit}
            />
          )}

          {/* Table */}
          <Table
            table={table}
            editId={editId}
            setEditId={setEditId}
            handleEdit={handleEdit}
            onDeleteClick={(id) => {
              setDeleteId(id);
              setShowDeleteDialog(true);
            }}
            isLoading={isLoading}
          />

          {/* Pagination */}
          <Pagination table={table} />
        </div>

        {/* Delete Dialog */}
        <DeleteDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={() => handleDelete(deleteId)}
        />
      </div>
    </div>
  );
};

export default DataTable;
