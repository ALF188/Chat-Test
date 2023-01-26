const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

var userList = {};

var htmlPath = path.join(__dirname, "src");
app.use(express.static(htmlPath));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(io, {
  namespaceName: "/custom",
  auth: {
    type: "basic",
    username: "ALF1",
    password: process.env.AdminPwd,
  },
});

httpServer.listen(3000, "0.0.0.0", function () {});

io.on("connection", (socket) => {
  userList[socket.id] = {};
  userList[socket.id]["username"] = "Guest";
  userList[socket.id]["profilePic"] =
    "https://www.pngitem.com/pimgs/m/421-4212617_person-placeholder-image-transparent-hd-png-download.png";
  socket.broadcast.emit(
    "newUser",
    "Guest",
    socket.id,
    userList[socket.id]["profilePic"]
  );
  socket.emit("startUserList", userList);
  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg);
  });
  socket.on("disconnect", () => {
    io.emit("removeUser", socket.id);
    delete userList[socket.id];
  });
  socket.on("updateUserList", (username, id, img) => {
    userList[id]["username"] = username;
    userList[id]["profilePic"] = img;
    io.emit("updateUserList", username, id, img);
  });
  socket.on("private message", (msg, to) => {
    io.to(to).emit("private message", msg);
  });
  socket.on("ajax", (msg) => {
    console.log(msg);
  });
  socket.on("redoUserList", () => {
    delete userList[socket.id];
    socket.emit("redoUserList", userList);
  });
  socket.on("newFile", (file, title) => {
    fs.writeFile(title, file, function (err) {
      if (err) throw err;
    });
    fs.rename(title, "src/sound/" + title, () => {});
  });
  socket.on("listPlay", () => {
    let list = [];
    fs.readdirSync(__dirname + "/src/sound").forEach((file) => {
      list.push(file);
    });
    socket.emit("listPlay", list);
  });
  socket.on("new video", (message2) => {
    socket.broadcast.emit("new video", message2);
  });
  socket.on("consolelog", (msg) => {
    console.log(msg);
  });
  setInterval(function () {
    io.emit("pleaseUpdateUsers");
  }, 20000);
});
