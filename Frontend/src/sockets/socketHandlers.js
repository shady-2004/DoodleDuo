const handlers = (socket, setSketchData) => {
  socket.on("draw", (data) => {
    setSketchData((prevSketchData) => {
      const idx = prevSketchData.findIndex(
        (line) => line.id === data.stroke.id
      );
      if (idx !== -1) {
        const updatedLine = {
          ...prevSketchData[idx],
          points: [...prevSketchData[idx].points, ...data.stroke.points],
        };
        return [
          ...prevSketchData.slice(0, idx),
          updatedLine,
          ...prevSketchData.slice(idx + 1),
        ];
      } else {
        return [
          ...prevSketchData,
          {
            id: data.stroke.id,
            points: data.stroke.points,
            stroke: data.stroke.stroke,
            strokeWidth: data.stroke.strokeWidth,
          },
        ];
      }
    });
  });

  socket.on("clear", () => {
    setSketchData([]);
  });
};

export default handlers;
