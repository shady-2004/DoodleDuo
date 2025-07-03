import Session from "./currentSessions";
import { Server, Socket } from "socket.io";

function socketHandlers(io: Server, socket: Socket) {
  socket.on("create-session", ({ userId, userName, sketchId, sketchData }) => {
    const sessionCode = Session.generateSessionCode();
    Session.createSession(
      sessionCode,
      userId,
      userName,
      socket.id,
      sketchId,
      sketchData
    );
    socket.join(sessionCode);
    socket.emit("session-created", sessionCode);
  });

  socket.on("join-session", ({ sessionCode, userId, userName }) => {
    const joined = Session.joinSession(
      sessionCode,
      userId,
      userName,
      socket.id
    );
    if (!joined) {
      socket.emit("session-join-failed", "Session not found or full");
      return;
    }
    const session = Session.sessions.get(sessionCode);

    socket.join(sessionCode);

    socket.emit("session-joined", {
      sessionCode,
      sketchId: session?.sketchId,
      sketchData: session?.sketchData,
    });
  });

  socket.on("draw", ({ sessionCode, stroke }) => {
    const session = Session.sessions.get(sessionCode);
    if (!session) return;
    session.sketchData.strokes.push(stroke);
    socket.to(sessionCode).emit("draw", stroke);
  });

  socket.on("clear", ({ sessionCode }) => {
    const session = Session.sessions.get(sessionCode);
    if (!session) return;
    session.sketchData.strokes.splice(0);
    socket.to(sessionCode).emit("clear");
  });
}
export default socketHandlers;
