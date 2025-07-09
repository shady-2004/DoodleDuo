import { toast } from "react-toastify";

const handlers = (socket, setSketchData, user, navigate, setSessionMembers) => {
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
  socket.on("player-joined", (name) => {
    toast.dark(`${name} joined the session`, { autoClose: 2000 });
  });
  socket.on("player-left", ({ userName, role }) => {
    console.log(role);
    if (role !== "owner")
      toast.dark(`${userName} left the session`, { autoClose: 2000 });
    else {
      toast.dark(`${userName} the owner of the sketch left`);
      setTimeout(() => {
        navigate("/sketches");
      }, 2000);
    }
  });
  socket.on("session-users", (users) => {
    console.log(users);
    setSessionMembers(users);
  });
};

export default handlers;
