import { Server as SocketIOServer } from "socket.io";
import http from "http";
import app from "./app";
import dotenv from "dotenv";
import connect from "./client/client";
import "./sockets/socketHandlers";
import socketHandlers from "./sockets/socketHandlers";

dotenv.config({ path: "./config.env" });

const run = async () => {
  await connect();

  const port = process.env.PORT || 3000;

  const server = http.createServer(app);

  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socketHandlers(io, socket);
  });

  server.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
};

run().catch(console.dir);
