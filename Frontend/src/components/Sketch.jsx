import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import { FaUndo, FaRedo, FaTrashAlt } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import useAuth from "../contexts/useAuth";

function Sketch({
  localLines,
  lines,
  setLines,
  remoteSketchData,
  setRemoteSketchData,
  saveData,
  isGuest,
  sessionCode,
  socket,
}) {
  const isDrawing = useRef(false);
  const stageRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("black");
  const [curLineId, setCurLineId] = useState(null);
  const { user } = useAuth();

  const BASE_W = 800;
  const BASE_H = 400;
  const MIN_W = 400;
  const MIN_H = 200;
  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#FFC0CB",
    "#A52A2A",
    "#808080",
  ];

  useEffect(() => {
    function updateScale() {
      const maxW = window.innerWidth * 0.95;
      const maxH = window.innerHeight * 0.7;

      const sx = maxW / BASE_W;
      const sy = maxH / BASE_H;
      let newScale = Math.min(sx, sy, 1);

      const scaledW = BASE_W * newScale;
      const scaledH = BASE_H * newScale;

      if (scaledW < MIN_W) newScale = MIN_W / BASE_W;
      if (scaledH < MIN_H) newScale = Math.max(newScale, MIN_H / BASE_H);

      setScale(newScale);
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    if (!Array.isArray(remoteSketchData)) return;
    if (remoteSketchData.length === 0) {
      setLines([]);
      localLines.current.clear();
    }
    // setLines((prevLines) => {
    //   const existingIds = new Set(prevLines.map((l) => l.id));
    //   const merged = sketchData.map((stroke) => {
    //     const local = localLines.current.get(stroke.id);
    //     if (!local) return stroke;

    //     return local;
    //   });

    //   const newLocalLines = [...prevLines].filter(
    //     (l) => !existingIds.has(l.id) && localLines.current.has(l.id)
    //   );

    //   return [...merged, ...newLocalLines];
    // });
  }, [remoteSketchData]);

  async function hashLines(data) {
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  useEffect(() => {
    if (isGuest) return; // no auto-save for guests

    let lastHash = "";

    const interval = setInterval(async () => {
      if (getSketchDataToRender().length === 0) return; // skip empty

      const currentHash = await hashLines(getSketchDataToRender());
      if (currentHash !== lastHash) {
        lastHash = currentHash;
        console.log("shady");
        saveData(getSketchDataToRender(), generateThumbnail());
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [lines, saveData, isGuest]);

  function handleMouseDown() {
    isDrawing.current = true;
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    const id = uuidv4();
    setCurLineId(id);
    const newLine = {
      id,
      points: [point.x, point.y],
      stroke: currentColor,
      strokeWidth: 4,
    };

    if (socket && sessionCode) {
      socket.emit("draw", {
        sessionCode,
        stroke: {
          points: [point.x, point.y],
          stroke: newLine.stroke,
          strokeWidth: newLine.strokeWidth,
          id: newLine.id,
          userId: user.id,
        },
      });
    }

    localLines.current.set(id, newLine);

    setLines((prevLines) => {
      const alreadyExist = prevLines.some((line) => line.id === newLine.id);
      if (alreadyExist) return prevLines;
      return [...prevLines, newLine];
    });
  }

  function handleMouseMove() {
    if (!isDrawing.current) return;

    const stage = stageRef.current;
    const point = stage.getPointerPosition();

    setLines((prevLines) => {
      const existingIds = new Set(prevLines.map((l) => l.id));
      const idx = prevLines.findIndex((line) => line.id === curLineId);
      if (idx === -1) return prevLines; // Line not found, no update

      const updatedLine = {
        ...prevLines[idx],
        points: [...prevLines[idx].points, point.x, point.y],
      };

      const updatedLines = [
        ...prevLines.slice(0, idx),
        updatedLine,
        ...prevLines.slice(idx + 1),
      ];

      localLines.current.set(curLineId, updatedLine);

      if (socket && sessionCode) {
        socket.emit("draw", {
          sessionCode,
          stroke: {
            points: [point.x, point.y],
            stroke: updatedLine.stroke,
            strokeWidth: updatedLine.strokeWidth,
            id: updatedLine.id,
            userId: user.id,
          },
        });
      }
      const newLocalLines = [...prevLines].filter(
        (l) => !existingIds.has(l.id) && localLines.current.has(l.id)
      );

      return [...updatedLines, newLocalLines];
    });
  }

  function handleMouseUp() {
    isDrawing.current = false;
  }

  function undo() {
    if (!lines.length) return;
    const last = lines[lines.length - 1];
    console.log(last);
    localLines.current.delete(last.id);
    const updated = lines.slice(0, -1);
    setLines(updated);

    // Emit to socket for real-time sync
    if (socket && sessionCode) {
      socket.emit("undo", { sessionCode });
    }
  }

  function clearCanvas() {
    setLines([]);
    localLines.current.clear();
    setRemoteSketchData([]);
    if (!isGuest) saveData([]);

    // Emit to socket for real-time sync
    if (socket && sessionCode) {
      socket.emit("clear", { sessionCode });
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

  function generateThumbnail() {
    const originalWidth = stageRef.current.width();
    const originalHeight = stageRef.current.height();
    const thumbnailSize = 150;

    const dataURL = stageRef.current.toDataURL({
      pixelRatio: thumbnailSize / Math.max(originalWidth, originalHeight), // scale down proportionally
    });

    return dataURL;
  }

  return (
    <div
      className="flex flex-col items-center p-6 bg-gray-100 min-h-screen"
      style={{ minWidth: MIN_W + 100 }}
    >
      <div
        className="border-4 border-gray-700 rounded-xl shadow-2xl bg-white mb-6 overflow-hidden"
        style={{
          maxWidth: "95vw",
          maxHeight: "70vh",
          minWidth: MIN_W + 16,
          minHeight: MIN_H + 16,
          padding: "0",
        }}
        onClick={() => setShowColorPicker(false)}
      >
        <Stage
          ref={stageRef}
          width={BASE_W * scale}
          height={BASE_H * scale}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            width: BASE_W * scale,
            height: BASE_H * scale,
            border: "2px solid #e5e7eb",
            borderRadius: "4px",
            backgroundColor: "#fff",
          }}
        >
          <Layer>
            {getSketchDataToRender().map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation="source-over"
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <div className="flex space-x-4 relative z-20">
        {/* {socket === null ? (
          <>
            <div className="relative group">
              <button
                onClick={undo}
                className="p-2 hover:scale-110 transition cursor-pointer"
                disabled={getSketchDataToRender().length === 0}
              >
                <FaUndo size={20} />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                Undo
              </span>
            </div>

            <div className="relative group">
              <button
                onClick={() => {}}
                className="p-2 hover:scale-110 transition cursor-pointer opacity-50"
                disabled
              >
                <FaRedo size={20} />
              </button>
              <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                Redo
              </span>
            </div>
          </>
        ) : (
          ""
        )} */}

        <div className="relative group">
          <button
            onClick={clearCanvas}
            className="p-2 hover:scale-110 transition cursor-pointer"
            disabled={getSketchDataToRender().length === 0}
          >
            <FaTrashAlt size={20} />
          </button>
          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
            Clear
          </span>
        </div>

        <div className="relative group">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 hover:scale-110 transition cursor-pointer"
          >
            <IoIosColorPalette size={25} color={currentColor} />
          </button>
          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
            Color
          </span>

          {showColorPicker && (
            <div
              className="absolute bottom-full mb-10 left-1/2 -translate-x-1/2 bg-white border rounded shadow-lg p-2 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-4 gap-4">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    className="w-6 h-6 rounded-full border hover:scale-110 transition"
                    style={{ backgroundColor: c }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentColor(c);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sketch;
