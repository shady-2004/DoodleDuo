import React from "react";
import { Link } from "react-router-dom";

function SketchCard({ picture, date, name, id }) {
  return (
    <Link to={`/sketches/${id}`}>
      <div className="w-50 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200 hover:cursor-pointer">
        <div className="w-full h-30 overflow-hidden">
          <img
            src={picture}
            alt={name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-2 text-center">
          <p className="text-[10px] text-gray-500">{date}</p>
          <p className="text-xs font-medium text-gray-800">{name}</p>
        </div>
      </div>
    </Link>
  );
}

export default SketchCard;
