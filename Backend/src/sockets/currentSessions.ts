type SketchData = Stroke[];

type Stroke = {
  id: string;
  stroke: string;
  strokeWidth: number;
  points: number[];
};

type SessionData = {
  ownerId: string;
  ownerName: string;
  sketchId: string;
  users: Map<string, { userId: string; userName: string }>;
  sketchData: SketchData;
};

function createSession(
  sessionCode: string,
  userId: string,
  userName: string,
  socketId: string,
  sketchId: string,
  sketchData: SketchData
) {
  sessions.set(sessionCode, {
    ownerId: userId,
    ownerName: userName,
    users: new Map([[socketId, { userId, userName }]]),
    sketchId,
    sketchData,
  });
}

function joinSession(
  sessionCode: string,
  userId: string,
  userName: string,
  socketId: string
) {
  const session = sessions.get(sessionCode);
  if (!session) return false;

  session.users.set(socketId, { userId, userName });
  return true;
}

function generateSessionCode(length = 10): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstxyz";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const sessions = new Map<string, SessionData>();

export default { createSession, joinSession, generateSessionCode, sessions };
