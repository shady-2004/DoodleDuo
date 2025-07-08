import { v1 as uuidv4 } from "uuid";
import { Server } from "socket.io";

type SketchData = Stroke[];

export type Stroke = {
  id: string;
  stroke: string;
  strokeWidth: number;
  points: number[];
  userId?: string;
};

type SessionData = {
  ownerId: string;
  ownerName: string;
  ownerSocketId: string;
  sketchId: string;
  users: Map<string, { userId: string; userName: string }>;
  sketchData: SketchData;
  sessionInterval?: NodeJS.Timeout;
  updatedStrokes: Map<number, Stroke>;
};

function createSession(
  sessionCode: string,
  userId: string,
  userName: string,
  socketId: string,
  sketchId: string,
  sketchData: SketchData,
  io: Server
) {
  sessions.set(sessionCode, {
    ownerId: userId,
    ownerName: userName,
    users: new Map([[socketId, { userId, userName }]]),
    sketchId,
    sketchData,
    ownerSocketId: socketId,
    updatedStrokes: new Map(),
  });
  const interval: NodeJS.Timeout = setInterval(() => {
    const session = sessions.get(sessionCode);
    const batch = session
      ? Array.from(session.updatedStrokes).map(([id, stroke]) => {
          session.updatedStrokes.delete(id);
          return stroke;
        })
      : [];
    if (batch.length > 0) io.to(sessionCode).emit("draw", batch);
  }, 50);
  socketIdToSessionCode.set(socketId, sessionCode);
}

function joinSession(
  sessionCode: string,
  userId: string,
  userName: string,
  socketId: string
) {
  const session = sessions.get(sessionCode);
  if (!session) return 0;

  if (session.users.size === 2) return -1;

  session.users.set(socketId, { userId, userName });
  socketIdToSessionCode.set(socketId, sessionCode);
  return true;
}
function leaveSession(socket: any): boolean {
  const sessionCode = socketIdToSessionCode.get(socket.id);
  if (!sessionCode) return false;

  const session = sessions.get(sessionCode);
  if (!session) {
    socketIdToSessionCode.delete(socket.id);
    return false;
  }

  // Remove socket ID from the session
  const user = session.users.get(socket.id);

  const userName = user ? user.userName : undefined;
  session.users.delete(socket.id);

  socketIdToSessionCode.delete(socket.id);
  // If the owner left, delete the whole session
  if (session.ownerSocketId === socket.id) {
    sessions.delete(sessionCode);
    socket.to(sessionCode).emit("player-left", { userName, role: "owner" });

    return false;
  }
  socket.to(sessionCode).emit("player-left", { userName, role: "user" });

  return true;
}

function generateSessionCode(length = 10): string {
  return uuidv4();
}

const sessions = new Map<string, SessionData>();
const socketIdToSessionCode = new Map<string, string>();

export default {
  createSession,
  joinSession,
  generateSessionCode,
  sessions,
  leaveSession,
};
