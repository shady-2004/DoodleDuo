import React, { useRef } from "react";
import CanvasDraw from "react-canvas-draw";
function Sketch() {
  const canvas = useRef(null);
  canvas;
  return (
    <div>
      <CanvasDraw
        ref={canvas}
        brushColor="#000"
        brushRadius={4}
        lazyRadius={0}
        canvasWidth={1000}
        canvasHeight={500}
      />
      <div className="flex flex-row space-x-10">
        <button onClick={() => canvas.current.undo()}>Undo</button>
        <button onClick={() => canvas.current.clear()}>Clear</button>
      </div>
    </div>
  );
}

export default Sketch;
