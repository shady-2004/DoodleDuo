import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../contexts/useAuth";
import { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

function SketchForm({ toggleForm, setSketches }) {
  const [name, setName] = useState("");
  const { token, logout } = useAuth();
  async function handleSubmit(event) {
    event.preventDefault();

    if (name.trim() === "") {
      toast.error("Sketch name cannot be empty", {
        position: "top-center",
        autoClose: 3000,
        toastId: "empty name",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/users/sketch`,
        { name }, // <-- Send the sketch name here
        {
          headers: {
            Authorization: `Bearer ${token}`, // <-- Correct placement
          },
        }
      );

      // Optional: handle success
      toast.success("Sketch added successfully!");

      setSketches((prevSketches) => [
        ...prevSketches,
        response.data.data.sketch,
      ]);
    } catch (err) {
      console.log(err);
      if (err.status === 401) {
        toast.error("Session expired, please log in again", {
          position: "top-center",
          autoClose: 3000,
          toastId: "session expired",
        });
        logout();
      } else {
        toast.error(err.response.data.message, {
          position: "top-center",
          autoClose: 3000,
          toastId: "fetch error",
        });
      }
    } finally {
      toggleForm();
      setName("");
    }
  }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 w-80">
      {/* Close button */}
      <button
        onClick={toggleForm}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Sketch</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="text-sm text-gray-600 block mb-1">
            Sketch Name
          </label>
          <input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            placeholder="My Sketch"
            className="p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 rounded-md hover:cursor-pointer hover:bg-indigo-600 transition-colors duration-200"
        >
          Add Sketch
        </button>
      </form>
    </div>
  );
}

export default SketchForm;
