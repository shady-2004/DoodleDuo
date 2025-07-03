import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinSession({ toggleForm }) {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  function join(e) {
    e.preventDefault();
    if (code.trim() === "") {
      toast.error("Provid session code", {
        position: "top-center",
        autoClose: 3000,
        toastId: "empty code",
      });
      return;
    }
    navigate(`/sketches/session/${code}`);
  }

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 w-80">
      {/* Close button */}
      <button
        onClick={toggleForm}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Join Session</h2>
      <form className="space-y-4" onSubmit={join}>
        <div>
          <label htmlFor="name" className="text-sm text-gray-600 block mb-1">
            Session code
          </label>
          <input
            id="code"
            type="text"
            onChange={(e) => setCode(e.target.value)}
            placeholder="Session code"
            className="p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 rounded-md hover:cursor-pointer hover:bg-indigo-600 transition-colors duration-200"
        >
          Join
        </button>
      </form>
    </div>
  );
}

export default JoinSession;
