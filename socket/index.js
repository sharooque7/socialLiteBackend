const PORT = process.env.PORT || 8000;

const io = require("socket.io")(PORT, {
  cors: { origin: "https://sociallite.netlify.app/", Credential: true },
});
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeuser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getuser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("A user connected");

  //userID and socketid
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getuser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });
  //when disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeuser(socket.id);
    io.emit("getUsers", users);
  });
});
