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
  const [remoteSketchData, setRemoteSketchData] = useState([]);
  const localLines = useRef(new Map());
  const [lines, setLines] = useState([]);

  const socket = useRef(null);
  const [sessionCode, setSessionCode] = useState(null);
  const { id, code } = useParams();
  const isGuest = code ? true : false;
  const { token, logout, user } = useAuth();
  const [sessionMembers, setSessionMembers] = useState([]);
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
          setRemoteSketchData(JSON.parse(response.data.data.sketch.data));
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
        setSessionMembers([
          {
            userName: `${user.firstName} ${user.lastName}`,
            userId: user.id,
          },
        ]);
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
          setRemoteSketchData(data.sketchData || []);
          setIsLoading(false);

          handlers(s, setRemoteSketchData, user, navigate, setSessionMembers);
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
        sketchData: getSketchDataToRender(),
      });
      s.on("session-created", (data) => {
        console.log("Session created:", data);
        toast.success("Session created successfully", {
          position: "top-center",
          autoClose: 3000,
          toastId: "session created",
        });
        setSessionCode(data);

        handlers(s, setRemoteSketchData, user, navigate, setSessionMembers);
      });
    });
    s.on("connect_error", (err) => {
      setSessionCode(null);
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

  function getSketchDataToRender() {
    const data = remoteSketchData.map((line) => {
      return localLines.current.get(line.id) || line;
    });
    const ids = new Set(data.map((l) => l.id));
    localLines.current.forEach((val, key) => {
      if (!ids.has(key)) {
        data.push(val);
      }
    });
    return data;
  }

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <PropagateLoader />
        </div>
      ) : (
        <div>
          <div className="bg-white border-b shadow-sm px-6 py-4 flex flex-row items-center justify-between flex-wrap gap-4">
            {/* Avatars */}
            <div className="flex flex-wrap gap-3">
              {sessionMembers.map((member, i) => (
                <div className="relative group" key={i}>
                  <div
                    key={member.userId}
                    className={`w-10 h-10 flex items-center justify-center rounded-full 
                     text-white font-semibold text-sm`}
                    style={{
                      backgroundColor: member.avatarColor || "#F87171",
                    }}
                  >
                    {member.userName
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    {member.userName}
                  </span>
                </div>
              ))}
            </div>

            {/* Session Button or Code */}
            {!isGuest &&
              (!sessionCode ? (
                <button
                  onClick={createSession}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                >
                  Create Session
                </button>
              ) : (
                <h3 className="text-gray-700 text-sm">
                  <span className="text-gray-500">Session Code:</span>{" "}
                  <span className="font-semibold text-blue-600">
                    {sessionCode}
                  </span>
                </h3>
              ))}
          </div>

          <Sketch
            getSketchDataToRender={getSketchDataToRender}
            localLines={localLines}
            lines={lines}
            setLines={setLines}
            remoteSketchData={remoteSketchData}
            setRemoteSketchData={setRemoteSketchData}
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
