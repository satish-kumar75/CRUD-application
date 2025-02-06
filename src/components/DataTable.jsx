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
  flexRender,
} from "@tanstack/react-table";

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

  useEffect(() => {
    const fetchData = async () => {
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

  // Add this custom dialog component
  const DeleteDialog = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-zinc-800 rounded-lg p-6 max-w-sm w-full mx-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            Confirm Delete
          </h2>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete this record? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
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

  // Add this debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Update the SearchBar component
  const SearchBar = () => {
    const handleSearch = useCallback(
      debounce((value) => {
        setGlobalFilter(value);
      }, 1000),
      []
    );

    return (
      <div className="relative w-full md:w-64">
        <input
          className="w-full pl-10 pr-4 py-2 rounded-lg border bg-zinc-800 border-gray-300 caret-blue-900 focus:ring-gray-400 transition-colors"
          type="text"
          placeholder="Search by name or mobile"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={globalFilter}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    );
  };

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

  // Replace the table section with this
  const TableComponent = () => (
    <div className="w-full overflow-x-auto">
      <table className="card w-full border-collapse rounded-xl mb-6 min-w-[800px]">
        <thead className="bg-gray-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-zinc-700">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  data-cell-id={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-50"
                  contentEditable={
                    editId === row.original.id &&
                    !["actions"].includes(cell.column.id)
                  }
                  suppressContentEditableWarning={true}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Replace the pagination section with this
  const Pagination = () => (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <select
          className="bg-zinc-800 border border-gray-300 rounded-lg px-2 py-1"
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        <span className="text-gray-400">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={`px-4 py-2 rounded-lg ${
            !table.getCanPreviousPage()
              ? "bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <ChevronLeft className="h-5 w-5 md:hidden" />
          <span className="hidden md:inline">Previous</span>
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={`px-4 py-2 rounded-lg ${
            !table.getCanNextPage()
              ? "bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <ChevronRight className="h-5 w-5 md:hidden" />
          <span className="hidden md:inline">Next</span>
        </button>
      </div>
    </div>
  );

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
            <SearchBar />
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
                  placeholder="Coupon No."
                  name="coupon"
                  value={formData.coupon}
                  onChange={handleFormData}
                />
                <Ticket className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
              <div className="relative">
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-zinc-800 border-gray-300 caret-blue-900 focus:ring-gray-400"
                  type="text"
                  placeholder="Mobile No."
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleFormData}
                  pattern="\d*"
                  maxLength="10"
                  title="Please enter a valid 10-digit mobile number"
                />
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-lg border bg-zinc-800 border-gray-300 caret-blue-900 focus:ring-gray-400"
                  type="text"
                  placeholder="Aadhaar No."
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleFormData}
                  pattern="\d*"
                  maxLength="12"
                  title="Please enter a valid 12-digit Aadhaar number"
                />
                <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
          <TableComponent />

          {/* Pagination */}
          <Pagination />
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
