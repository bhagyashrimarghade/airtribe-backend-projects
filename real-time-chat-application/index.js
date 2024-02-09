const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);
const socketio = require("socket.io");
const {
  newUser,
  getIndividualRoomUsers,
  formatMessage,
  getActiveUser,
  exitRoom,
} = require("./helpers/helpers");

const io = socketio(server);
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = newUser(socket.id, username, room);
    socket.join(user.room);

    socket.emit(
      "message",
      formatMessage("Airtribe", "Message are limited to this room")
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("Airtribe", `${user.username} has joined the room`)
      );
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getIndividualRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getActiveUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = exitRoom(socket.id);
    if (user.room) {
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getIndividualRoomUsers(user.room),
      });
      io.to(user.room).emit(
        "message",
        formatMessage("Airtribe", `${user.username} has left the room.`)
      );
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log("server is running");
});
