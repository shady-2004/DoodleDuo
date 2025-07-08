import Sketch from "../components/Sketch";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../contexts/useAuth";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { PropagateLoader } from "react-spinners";
import connect from "../sockets/client";

const apiUrl = import.meta.env.VITE_API_URL;

import handlers from "../sockets/socketHandlers";

function Session() {
  const [isLoading, setIsLoading] = useState(true);
  const [sketchData, setSketchData] = useState([]);
  const socket = useRef(null);
  const [sessionCode, setSessionCode] = useState(null);
  const { id, code } = useParams();

  const isGuest = code ? true : false;
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

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
          setTimeout(() => {
            navigate("/sketches");
          }, 1000);
        }
      } finally {
        setIsLoading(false);
      }
    }
    async function fetchGuestSketch() {
      const s = connect();

      s.on("connect", () => {
        console.log("✅ Socket connected:", s.id);
        socket.current = s; // Save to state or context

        // Now it's safe to emit join-session
        s.emit("join-session", {
          userId: user.id,
          userName: `${user.firstName} ${user.lastName}`,
          sessionCode: code,
        });

        s.on("session-joined", (data) => {
          setSketchData(data.sketchData || []);
          setIsLoading(false);

          handlers(s, setSketchData, user, navigate);
        });

        s.on("session-join-failed", (message) => {
          console.log(message);
          toast.error(message, {
            position: "top-center",
            autoClose: 3000,
            toastId: "join error",
          });
          navigate("/sketches");
          s.disconnect();
        });
      });

      s.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err);
        toast.error("Socket connection failed", {
          position: "top-center",
          autoClose: 3000,
          toastId: "socket error",
        });
        navigate("/sketches");
      });

      s.connect();
    }

    if (isGuest) fetchGuestSketch();
    else fetchSketch();

    return () => {
      console.log(socket);
      if (socket.current !== null) {
        console.log("bye bye");

        socket.current.disconnect();
      }
    };
  }, [id, token, isGuest, navigate, logout]);

  async function createSession() {
    const s = connect();
    s.connect();

    s.on("connect", () => {
      console.log("✅ Socket connected:", s.id);

      socket.current = s;

      s.emit("create-session", {
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        sketchId: id,
        sketchData: sketchData,
      });
      s.on("session-created", (data) => {
        console.log("Session created:", data);
        toast.success("Session created successfully", {
          position: "top-center",
          autoClose: 3000,
          toastId: "session created",
        });
        setSessionCode(data);

        handlers(s, setSketchData, user, navigate);
      });
    });
    s.on("connect_error", (err) => {
      console.error("❌ Session creation failed:", err);
      toast.error("Session creation failed", {
        position: "top-center",
        autoClose: 3000,
        toastId: "session error",
      });
      // navigate("/sketches");
    });
  }

  async function saveData(sketch) {
    try {
      await axios.patch(
        apiUrl + `/users/sketch/${id}`,
        { sketchData: JSON.stringify(sketch) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
        <div>
          {!isGuest &&
            (!sessionCode ? (
              <div className="flex justify-center p-4 bg-white border-b shadow-sm">
                <button
                  onClick={createSession}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                >
                  Create Session
                </button>
              </div>
            ) : (
              <h3 className="text-center text-gray-600 mt-4">
                Session Code:{" "}
                <span className="font-semibold">{sessionCode}</span>
              </h3>
            ))}
          <Sketch
            sketchData={sketchData}
            setSketchData={setSketchData}
            saveData={saveData}
            isGuest={isGuest}
            sessionCode={isGuest ? code : sessionCode}
            socket={socket.current}
          />
        </div>
      )}
    </>
  );
}

export default Session;
