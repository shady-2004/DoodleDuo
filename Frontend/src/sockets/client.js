import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
console.log(URL);

export function connect() {
  const socket = io(URL, {
    autoConnect: false,
  });
  return socket;
}

export default connect;
