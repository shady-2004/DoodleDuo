import Sketch from "../components/Sketch";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../contexts/useAuth";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";

const apiUrl = import.meta.env.VITE_API_URL;

function Session() {
  const [isLoading, setIsLoading] = useState(true);
  const [sketchData, setSketchData] = useState([]);

  const { id } = useParams();
  const { token, logout } = useAuth();

  useEffect(() => {
    async function fetchSketch() {
      try {
        console.log("loading");
        const response = await axios.get(apiUrl + `/users/sketch/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.data.sketch.data) {
          setSketchData(JSON.parse(response.data.data.sketch.data));
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          toast.error("Session expired, please log in again", {
            position: "top-center",
            autoClose: 3000,
            toastId: "session expired",
          });
          logout();
        } else {
          toast.error("Failed to fetch sketch", {
            position: "top-center",
            autoClose: 3000,
            toastId: "fetch error",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchSketch();
  }, [id, token]);

  async function saveData(sketch) {
    try {
      const response = await axios.patch(
        apiUrl + `/users/sketch/${id}`,
        { sketchData: JSON.stringify(sketch) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // toast.success("Sketch saved successfully", {
      //   position: "top-center",
      //   autoClose: 3000,
      //   toastId: "save success",
      // });
    } catch (err) {
      if (err.status === 401) {
        toast.error("Session expired, please log in again", {
          position: "top-center",
          autoClose: 3000,
          toastId: "session expired",
        });
        logout();
      } else {
        toast.error("Failed to save sketch", {
          position: "top-center",
          autoClose: 3000,
          toastId: "save error",
        });
      }
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <PropagateLoader />
        </div>
      ) : (
        <Sketch
          sketchData={sketchData}
          setSketchData={setSketchData}
          saveData={saveData}
        />
      )}
    </>
  );
}

export default Session;
