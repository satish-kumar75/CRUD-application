/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from "react";

const Table = ({
  data,
  filteredData,
  editId,
  setEditId,
  handleEdit,
  handleDelete,
}) => {
  const outsideClick = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (outsideClick.current && !outsideClick.current.contains(event.target))
        setEditId(null); // Use `null` instead of `false`
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setEditId]);

  useEffect(() => {
    if (!editId) return;
    let selectedItem = document.querySelector(`[data-id='${editId}']`);
    if (selectedItem) selectedItem.focus();
  }, [editId]);

  return (
    <div className="table-container w-full mt-6 flex flex-col justify-start">
      <table
        ref={outsideClick}
        className="border-collapse table-auto border-slate-200"
      >
        <thead className="bg-green-600">
          <tr>
            <th>Name</th>
            <th>Mobile No.</th>
            <th>Coupon No.</th>
            <th>Aadhaar No.</th>
            <th>DOB</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td
                data-id={item.id}
                contentEditable={editId === item.id}
                onBlur={(e) => {
                  handleEdit(item.id, { name: e.target.innerText });
                }}
              >
                {item.name}
              </td>
              <td
                data-id={item.id}
                contentEditable={editId === item.id}
                onBlur={(e) => {
                  handleEdit(item.id, { mobile: e.target.innerText });
                }}
              >
                {item.mobile}
              </td>
              <td
                data-id={item.id}
                contentEditable={editId === item.id}
                onBlur={(e) => {
                  handleEdit(item.id, { coupon: e.target.innerText });
                }}
              >
                {item.coupon}
              </td>
              <td
                data-id={item.id}
                contentEditable={editId === item.id}
                onBlur={(e) => {
                  handleEdit(item.id, { aadhaar: e.target.innerText });
                }}
              >
                {item.aadhaar}
              </td>
              <td
                data-id={item.id}
                contentEditable={editId === item.id}
                onBlur={(e) => {
                  handleEdit(item.id, { dob: e.target.innerText });
                }}
              >
                {item.dob}
              </td>
              <td className="actions flex justify-evenly flex-wrap">
                <button
                  className="px-4 py-2 bg-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out"
                  onClick={() => {
                    setEditId(item.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="p-2 bg-red-500 rounded-lg cursor-pointer hover:bg-red-600 transition duration-300 ease-in-out"
                  onClick={() => {
                    handleDelete(item.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
