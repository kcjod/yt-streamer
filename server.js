import http from "http";
import app from "./app.js";
import { Server as SocketIO } from "socket.io";
import options from "./options.js";
import { spawn } from "child_process";
import dotenv from "dotenv/config";

const ffmpeg = spawn("ffmpeg", options);

const server = http.createServer(app);
const io = new SocketIO(server);

ffmpeg.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

ffmpeg.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

ffmpeg.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("stream", (data) => {
    ffmpeg.stdin.write(data, (error) => {
      console.log("Error:", error);
    });
  });
});

io.on("disconnect", (socket) => {
  console.log("Disconnected:", socket.id);
});

server.listen(process.env.PORT, () => console.log("Server is running on port 3000"));
