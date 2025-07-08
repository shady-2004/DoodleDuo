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
  }, 100);
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

  console.log(session.users);

  console.log(session.users.size, socketId);
  if (session.users.size === 2) return -1;

  session.users.set(socketId, { userId, userName });
  socketIdToSessionCode.set(socketId, sessionCode);
  return true;
}
function leaveSession(socketId: string): boolean {
  const sessionCode = socketIdToSessionCode.get(socketId);
  if (!sessionCode) return false;

  const session = sessions.get(sessionCode);
  if (!session) {
    socketIdToSessionCode.delete(socketId);
    return false;
  }

  // Remove socket ID from the session
  session.users.delete(socketId);
  socketIdToSessionCode.delete(socketId);

  // If the owner left, delete the whole session
  if (session.ownerSocketId === socketId) {
    sessions.delete(sessionCode);
    return false;
  }

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
