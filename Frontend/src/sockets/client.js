import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL;

export function connect() {
  console.log(URL);

  const socket = io(URL, {
    autoConnect: false,
  });
  return socket;
}

export default connect;
