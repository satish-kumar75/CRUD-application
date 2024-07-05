/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const AddForm = ({ formData, handleFormData, handleFormSubmit }) => {
  return (
    <div className="add-container flex items-center flex-col sm:gap-4 gap-2 mb-3">
      <form
        onSubmit={handleFormSubmit}
        className="flex sm:gap-6 gap-1 mb-3 flex-wrap items-center justify-center text-black"
      >
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
          placeholder="Mobile No."
          name="mobile"
          value={formData.mobile}
          onChange={handleFormData}
        />
        <input
          className="p-2 rounded-lg"
          type="text"
          placeholder="Coupon No."
          name="coupon"
          value={formData.coupon}
          onChange={handleFormData}
        />
        <input
          className="p-2 rounded-lg"
          type="text"
          placeholder="Aadhaar No."
          name="aadhaar"
          value={formData.aadhaar}
          onChange={handleFormData}
        />
        <input
          className="p-2 rounded-lg"
          type="date"
          placeholder="DOB"
          name="dob"
          value={formData.dob}
          onChange={handleFormData}
        />
        <button
          type="submit"
          className="hidden"
        >
          Add
        </button>
      </form>
      <button
        className="bg-green-700 cursor-pointer px-4 py-2 rounded-lg hover:bg-green-800 transition duration-300 ease-in-out"
        onClick={handleFormSubmit}
      >
        Add
      </button>
    </div>
  );
};

export default AddForm;
