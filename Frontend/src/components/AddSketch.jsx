import React from "react";
import { IoMdAddCircleOutline } from "react-icons/io";

function AddSketch({ toggleForm }) {
  return (
    <div
      onClick={toggleForm}
      className="w-40 h-40 rounded-xl  flex items-center justify-center  transition duration-200 cursor-pointer"
    >
      <IoMdAddCircleOutline className="text-5xl text-gray-500 hover:text-blue-500 transition-colors duration-200" />
    </div>
  );
}

export default AddSketch;
