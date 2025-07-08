const handlers = (socket, setSketchData, user) => {
  socket.on("draw", (data) => {
    setSketchData((prevSketchData) => {
      // const newStrokes = data.filter((stroke) => stroke.userId !== user.id);
      const newStrokes = data;

      const toAppend = newStrokes.slice(0);

      const finalData = prevSketchData.map((el) => {
        const idx = newStrokes.findIndex((stroke) => el.id === stroke.id);
        if (idx === -1) return el;
        else {
          toAppend.splice(idx, 1);
          return newStrokes[idx];
        }
      });
      finalData.push(...toAppend);
      return finalData;
    });
  });

  socket.on("clear", () => {
    setSketchData([]);
  });
};

export default handlers;
