import React, { useEffect, useRef, useState } from "react";

const DataTable = () => {
  const [formData, setFormData] = useState({ name: "", gender: "", age: "" });
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("data");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [editId, setEditId] = useState(false);
  const outsideClick = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 5;
  const lastItem = currentPage * itemPerPage;
  const indexOfFirstItem = lastItem - itemPerPage;

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);
  
  let filteredItems = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredData = filteredItems.slice(indexOfFirstItem, lastItem);

  useEffect(() => {
    if (!editId) return;
    let selectedItem = document.querySelectorAll(`[id='${editId}']`);
    selectedItem[0].focus();
  }, [editId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (outsideClick.current && !outsideClick.current.contains(event.target))
        setEditId(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    if (formData.name && formData.gender && formData.age) {
      const newData = {
        id: Date.now(),
        name: formData.name,
        gender: formData.gender,
        age: formData.age,
      };
      setData([...data, newData]);
      setFormData({ name: "", gender: "", age: "" });
    }
  };

  const handleDelete = (id) => {
    if (filteredData.length === 1 && currentPage != 1)
      setCurrentPage((prev) => prev - 1);

    const updatedData = data.filter((item) => item.id != id);
    setData(updatedData);
  };

  const handleEdit = (id, updatedData) => {
    if (!editId && editId != id) return;
    const updatedList = data.map((item) =>
      item.id === id ? { ...item, ...updatedData } : item
    );
    setData(updatedList);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container md:w-1/2 w-full p-5 mx-auto">
      <div className="add-contaienr flex items-center flex-col gap-4">
        <div className="flex gap-6 mb-3 flex-wrap items-center justify-center text-black">
          <input
            className="p-2 rounded-lg"
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleFormData}
          />
          <input
            className="p-2 rounded-lg"
            type="text"
            placeholder="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleFormData}
          />
          <input
            className="p-2 rounded-lg"
            type="text"
            placeholder="Age"
            name="age"
            value={formData.age}
            onChange={handleFormData}
          />
        </div>
        <button
          className="bg-green-700 cursor-pointer px-4 py-2 rounded-lg hover:bg-green-800 transition duration-300 ease-in-out "
          onClick={handleAddClick}
        >
          Add
        </button>
      </div>

      <div className="table-container max-w-1/2 md:w-full mt-6 flex flex-col justify-start">
        <input
          className="p-2 rounded-lg mb-4 w-fit text-black"
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <table
          ref={outsideClick}
          className="border-collapse table-auto border-slate-200"
        >
          <thead className=" bg-green-600">
            <tr>
              <td>Name</td>
              <td>Gender</td>
              <td>Age</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td
                  id={item.id}
                  contentEditable={editId === item.id}
                  onBlur={(e) => {
                    handleEdit(item.id, { name: e.target.innerText });
                  }}
                >
                  {item.name}
                </td>
                <td
                  id={item.id}
                  contentEditable={editId === item.id}
                  onBlur={(e) => {
                    handleEdit(item.id, { gender: e.target.innerText });
                  }}
                >
                  {item.gender}
                </td>
                <td
                  id={item.id}
                  contentEditable={editId === item.id}
                  onBlur={(e) => {
                    handleEdit(item.id, { age: e.target.innerText });
                  }}
                >
                  {item.age}
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
        <div className="pagination mt-3 mx-auto flex gap-2">
          {Array.from(
            { length: Math.ceil(filteredItems.length / itemPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                className={`${
                  currentPage === index + 1 ? "bg-green-800" : ""
                }    bg-green-400 w-6 text-center rounded-sm hover:bg-green-500 transition duration-300 cursor-pointer`}
                onClick={() => {
                  paginate(index + 1);
                }}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
