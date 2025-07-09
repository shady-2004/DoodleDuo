import { set } from "mongoose";
import Session from "./currentSessions";
import { Server, Socket } from "socket.io";

function socketHandlers(io: Server, socket: Socket) {
  socket.on("disconnect", () => {
    Session.leaveSession(io, socket);
  });

  socket.on("create-session", ({ userId, userName, sketchId, sketchData }) => {
    const sessionCode = Session.generateSessionCode();

    if (!sketchData) sketchData = {};
    if (!sketchData.strokes) sketchData.strokes = [];

    Session.createSession(
      sessionCode,
      userId,
      userName,
      socket.id,
      sketchId,
      sketchData,
      io,
      socket
    );

    socket.emit("session-created", sessionCode);
  });

  socket.on("join-session", ({ sessionCode, userId, userName }) => {
    const joined = Session.joinSession(
      io,
      sessionCode,
      userId,
      userName,
      socket.id
    );
    if (joined === 0 || joined === -1) {
      socket.emit("session-join-failed", "Session not found or full");
      return;
    }
    if (joined === -2) {
      socket.emit("session-join-failed", "User already joined the session");
      return;
    }
    const session = Session.sessions.get(sessionCode);
    if (!session) return;
    socket.join(sessionCode);
    socket.emit("session-joined", {
      sessionCode,
      sketchId: session?.sketchId,
      sketchData: session?.sketchData || [],
    });
    const users = Array.from(session.users.values());

    io.to(sessionCode).emit("session-users", users);
    socket.to(sessionCode).emit("player-joined", userName);
  });

  socket.on("draw", ({ sessionCode, stroke }) => {
    const session = Session.sessions.get(sessionCode);
    if (!session) return;

    const idx = session.sketchData.findIndex((s) => s.id === stroke.id);
    let updatedStroke;
    if (idx === -1) {
      session.sketchData.push({
        id: stroke.id,
        stroke: stroke.stroke,
        strokeWidth: stroke.strokeWidth,
        points: [...stroke.points],
        userId: stroke.userId,
      });
      updatedStroke = {
        id: stroke.id,
        stroke: stroke.stroke,
        strokeWidth: stroke.strokeWidth,
        points: [...stroke.points],
        userId: stroke.userId,
      };
    } else {
      session.sketchData[idx].points.push(...stroke.points);
      updatedStroke = session.sketchData[idx];
    }
    session.updatedStrokes.set(stroke.id, updatedStroke);
  });

  socket.on("clear", ({ sessionCode }) => {
    const session = Session.sessions.get(sessionCode);
    if (!session) return;
    session.sketchData.splice(0);
    io.to(sessionCode).emit("clear");
  });
}
export default socketHandlers;
