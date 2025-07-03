import React from "react";

function Join({ toggleForm }) {
  return (
    <div>
      <button
        onClick={toggleForm}
        className="p-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors duration-200 cursor-pointer"
      >
        Join Session
      </button>
    </div>
  );
}

export default Join;
