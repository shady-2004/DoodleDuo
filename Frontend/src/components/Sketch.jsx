import React, { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { FaUndo, FaRedo, FaTrashAlt } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import hash from "object-hash";

function Sketch({ sketchData, setSketchData, saveData }) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("black");
  const lastHash = useRef("");

  const BASE_W = 800;
  const BASE_H = 400;
  const MIN_W = 400; // Minimum display width
  const MIN_H = 200; // Minimum display height
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
    if (sketchData) {
      canvasRef.current.clearCanvas();
      canvasRef.current.loadPaths(sketchData);
    }
  }, [sketchData]);

  useEffect(() => {
    setInterval(checkForChangesAndSave, 1000 * 5);
  }, []);

  useEffect(() => {
    function update() {
      const maxW = window.innerWidth * 0.95;
      const maxH = window.innerHeight * 0.7;

      const sx = maxW / BASE_W;
      const sy = maxH / BASE_H;
      let calculatedScale = Math.min(sx, sy, 1);

      const scaledW = BASE_W * calculatedScale;
      const scaledH = BASE_H * calculatedScale;

      if (scaledW < MIN_W) {
        calculatedScale = MIN_W / BASE_W;
      }
      if (scaledH < MIN_H) {
        calculatedScale = Math.max(calculatedScale, MIN_H / BASE_H);
      }

      setScale(calculatedScale);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Redraw canvas when scale changes to ensure paths are properly displayed
  useEffect(() => {
    if (sketchData && canvasRef.current) {
      canvasRef.current.clearCanvas();
      canvasRef.current.loadPaths(sketchData);
    }
  }, [scale, sketchData]);
  async function checkForChangesAndSave() {
    const sketch = await canvasRef.current?.exportPaths();

    const normalizedData = sketch.map((stroke) => ({
      strokeColor: stroke.strokeColor,
      strokeWidth: stroke.strokeWidth,
      paths: stroke.paths.map((pt) => ({
        x: Math.round(pt.x * 10) / 10,
        y: Math.round(pt.y * 10) / 10,
      })),
    }));

    const currentHash = hash(normalizedData, {
      unorderedObjects: true,
      unorderedArrays: false,
    });

    console.log(lastHash.current, currentHash);
    if (currentHash !== lastHash.current) {
      lastHash.current = currentHash;
      setSketchData(sketch);
      saveData(sketch);
    }
  }

  return (
    <div
      className="flex flex-col items-center p-6 bg-gray-100 min-h-screen"
      style={{ minWidth: MIN_W + 100 }}
    >
      {/* Parent constrains the maximum display area */}
      <div
        className="border-4 border-gray-700 rounded-xl shadow-2xl bg-white mb-6 overflow-hidden"
        style={{
          maxWidth: "95vw",
          maxHeight: "70vh",
          minWidth: MIN_W + 16, // Add padding for border
          minHeight: MIN_H + 16, // Add padding for border
          padding: "0", // no extra padding
        }}
        onClick={() => setShowColorPicker(false)}
      >
        <ReactSketchCanvas
          ref={canvasRef}
          strokeColor={currentColor}
          strokeWidth={4}
          canvasColor="#fff"
          width={BASE_W * scale}
          height={BASE_H * scale}
          style={{
            width: BASE_W * scale,
            height: BASE_H * scale,
            border: "2px solid #e5e7eb",
            borderRadius: "4px",
          }}
        />
      </div>

      <div className="flex space-x-4 relative z-20">
        {/* Undo Button */}
        <div className="relative group">
          <button
            onClick={() => canvasRef.current.undo()}
            className="p-2 hover:scale-110 transition cursor-pointer"
          >
            <FaUndo size={20} />
          </button>
          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
            Undo
          </span>
        </div>

        {/* Redo Button */}
        <div className="relative group">
          <button
            onClick={() => canvasRef.current.redo()}
            className="p-2 hover:scale-110 transition cursor-pointer"
          >
            <FaRedo size={20} />
          </button>
          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
            Redo
          </span>
        </div>

        {/* Clear Button */}
        <div className="relative group">
          <button
            onClick={() => canvasRef.current.clearCanvas()}
            className="p-2 hover:scale-110 transition cursor-pointer"
          >
            <FaTrashAlt size={20} />
          </button>
          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-black text-white rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
            Clear
          </span>
        </div>

        {/* Color Picker Button */}
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

          {/* Color Picker */}
          {showColorPicker && (
            <div
              className="absolute bottom-full mb-10 left-1/2 -translate-x-1/2 bg-white border rounded shadow-lg p-2 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-4 gap-2">
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
