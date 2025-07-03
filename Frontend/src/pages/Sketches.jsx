import { useEffect, useState } from "react";
import SketchCard from "../components/SketchCard";
import axios from "axios";
import useAuth from "../contexts/useAuth";
import { toast } from "react-toastify";
import AddSketch from "../components/AddSketch";
import SketchForm from "../components/SketchForm";
import JoinSession from "../components/JoinSession";

import { PropagateLoader } from "react-spinners";
import Join from "../components/Join";

const apiUrl = import.meta.env.VITE_API_URL;

function Sketches() {
  const [sketches, setSketches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [writeCode, setWriteCode] = useState(false);

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
          showForm || writeCode ? "blur-xs" : "blur-none"
        }`}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Sketches</h1>
        <div className="mb-4">
          <Join toggleForm={() => setWriteCode(true)} />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <PropagateLoader />
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-10 w-full max-w-6xl  `}
          >
            {sketches.map((sketch) => (
              <SketchCard
                key={sketch.id}
                id={sketch.id}
                picture={sketch.picture}
                date={new Date(sketch.createdAt).toLocaleDateString()}
                name={sketch.name}
              />
            ))}
            {sketches.length < 8 && (
              <AddSketch toggleForm={() => setShowForm(true)} />
            )}
          </div>
        )}
      </div>
      {showForm && (
        <SketchForm
          toggleForm={() => setShowForm(false)}
          setSketches={setSketches}
        />
      )}
      {writeCode && <JoinSession toggleForm={() => setWriteCode(false)} />}
    </div>
  );
}

export default Sketches;
