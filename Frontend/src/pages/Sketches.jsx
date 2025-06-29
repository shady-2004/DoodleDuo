import { useEffect, useState } from "react";
import Sketch from "../components/Sketch";
import axios from "axios";
import useAuth from "../contexts/useAuth";
import { toast } from "react-toastify";
import AddSketch from "../components/AddSketch";
import SketchForm from "../components/SketchForm";
const apiUrl = import.meta.env.VITE_API_URL;

function Sketches() {
  console.log(apiUrl);
  const [sketches, setSketches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const toggleForm = () => setShowForm(!showForm);
  const [isLoading, setIsLoading] = useState(false);
  const { token, logout } = useAuth();
  useEffect(() => {
    async function fetchSketches() {
      setIsLoading(true);
      try {
        const res = await axios.get(`${apiUrl}/users/sketch`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSketches(res.data.data.sketches);
        console.log(res.data.data.sketches);
      } catch (err) {
        if (err.status === 401) {
          toast.error("Session expired, please log in again", {
            position: "top-center",
            autoClose: 3000,
            toastId: "session expired",
          });
          logout();
        } else {
          toast.error("Failed to fetch sketches", {
            position: "top-center",
            autoClose: 3000,
            toastId: "fetch error",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchSketches();
  }, []);
  return (
    <div
      className={`min-h-lg bg-gray-50 flex items-center justify-center px-4 relative`}
    >
      <div
        className={`flex flex-col items-center ${
          showForm ? "blur-xs" : "blur-none"
        }`}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Sketches</h1>

        {isLoading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10 w-full max-w-6xl  `}
          >
            {sketches.map((sketch) => (
              <Sketch
                key={sketch.id}
                id={sketch.id}
                picture={sketch.picture}
                date={new Date(sketch.createdAt).toLocaleDateString()}
                name={sketch.name}
              />
            ))}
            {sketches.length < 8 && <AddSketch toggleForm={toggleForm} />}
          </div>
        )}
      </div>
      {showForm && (
        <SketchForm toggleForm={toggleForm} setSketches={setSketches} />
      )}
    </div>
  );
}

export default Sketches;
