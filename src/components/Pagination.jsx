/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const Pagination = ({ currentPage, itemsPerPage, totalItems, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination mt-3 mx-auto flex gap-2">
      {pageNumbers.map((number) => (
        <button
          key={number}
          className={`${
            currentPage === number ? "bg-green-800" : ""
          } bg-green-400 w-6 text-center rounded-sm hover:bg-green-500 transition duration-300 cursor-pointer`}
          onClick={() => paginate(number)}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
