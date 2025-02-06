import React from "react";
import PropTypes from "prop-types";
import { flexRender } from "@tanstack/react-table";
import { Check, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import TableSkeleton from "./TableSkeleton";

const Table = ({
  table,
  editId,
  setEditId,
  handleEdit,
  onDeleteClick,
  isLoading,
}) => {
  const handleSave = async (row) => {
    try {
      const editedData = {};
      const cells = row.getVisibleCells();
      cells.forEach((cell) => {
        if (!["actions"].includes(cell.column.id)) {
          const element = document.querySelector(`[data-cell-id="${cell.id}"]`);
          if (element) {
            editedData[cell.column.id] = element.innerText;
          }
        }
      });

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

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="w-full overflow-x-auto mb-6 border border-slate-700/50 rounded-xl bg-slate-800/50">
      <table className="w-full border-collapse rounded-xl min-w-[800px]">
        <thead className="bg-slate-800">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider border-b border-slate-700"
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
        <tbody className="divide-y divide-slate-700/50">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-slate-700/50 transition-colors"
            >
              {row.getVisibleCells().map((cell) => {
                if (cell.column.id === "actions") {
                  const isEditing = editId === row.original.id;
                  return (
                    <td key={cell.id} className="px-3 sm:px-6 py-2 sm:py-4">
                      <div className="flex gap-2">
                        {isEditing ? (
                          <button
                            onClick={() => handleSave(row)}
                            className="p-2 text-teal-400 hover:bg-teal-400/10 rounded-lg transition-colors"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditId(row.original.id)}
                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteClick(row.original.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  );
                }
                return (
                  <td
                    key={cell.id}
                    data-cell-id={cell.id}
                    className="px-3 sm:px-6 py-1 sm:py-4 uppercase whitespace-nowrap text-[11px] sm:text-sm text-slate-300"
                    contentEditable={
                      editId === row.original.id &&
                      !["actions"].includes(cell.column.id)
                    }
                    suppressContentEditableWarning={true}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  table: PropTypes.object.isRequired,
  editId: PropTypes.string,
  setEditId: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default Table;
