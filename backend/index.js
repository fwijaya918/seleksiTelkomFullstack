const express = require("express");
const { Server } = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const db = require("./models");
const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

const { send } = require("process");
const { receiveMessageOnPort } = require("worker_threads");
const app = express();
const PORT = process.env.PORT;
const JWT_KEY = process.env.JWT_SECRET;
const server = Server(app);

//#region DEPENDENCIES
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//#endregion

//#region TEST
app.get("/api", (req, res) => {
  return res.sendStatus(200);
});
//#endregion

//#region AUTH
app.post("/api/users/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.User.findOne({ where: { username: username } });
  if (user) {
    res.status(400).json({
      status: "error",
      message: "Username already exists",
    });
    return;
  }
  const hashedPassword = await bcrypt.hashSync(password, SALT_ROUNDS);
  const newUser = await db.User.create({
    username: username,
    password: hashedPassword,
  });
  res.status(201).json({
    status: "success",
    message: "User created",
  });
});
app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.User.findOne({ where: { username: username } });
  if (!user) {
    res.status(404).json({
      status: "error",
      message: "User not found",
    });
    return;
  }
  const isPasswordValid = await bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    res.status(400).json({
      status: "error",
      message: "Invalid password",
    });
    return;
  }
  //give it expiration time
  const token = jwt.sign(
    { username: user.username },
    JWT_KEY,
    { expiresIn: "1h" } // Token will expire in 1 hour
  );
  res.cookie("appakabar_token", token, {
    httpOnly: true,
    maxAge: 3 * 3600 * 1000, // 3jam
    sameSite: "strict",
  });
  res.status(200).json({
    status: "success",
    message: "User logged in",
    token: token,
  });

});
app.post("/api/users/logout", async (req, res) => {
  res.clearCookie("appakabar_token");
  return res.status(200).send({ message: "Logout success" });
});
app.get("/api/users/current-user", auth, async (req, res) => {
  return res.status(200).send({ username: req.username });
});
//#endregion

//#region FEATURES
app.get("/api/friends/find-friend", auth, async (req, res) => {
  //req.username = username yang login
  let findUsername = req.query.username; //temen yang dicari
  if (findUsername === req.username) {
    return res.status(400).send({ message: "You can't add yourself" });
  }
  const friend = await db.User.findOne({
    where: { username: findUsername },
  });
  if (!friend) {
    res.status(404).json({
      status: "error",
      message: "Friend not found",
    });
    return;
  }
  res.status(200).json({
    status: "success",
    message: "Friend found",
    friend: friend,
  });

});
app.post("/api/friends/add", auth, async (req, res) => {
  const { friend_username } = req.body;
  const user = req.username;
  //if he adds himself
  if (friend_username === user) {
    res.status(400).json({
      status: "error",
      message: "You cannot add yourself as a friend",
    });
    return;
  }
  const isFriend = await db.Friend.findOne({
    where: {
      [Op.or]: [
        { id: `${user}_${friend_username}` },
        { id: `${friend_username}_${user}` },
      ],
    },
  });
  if (isFriend) {
    res.status(400).json({
      status: "error",
      message: "Friend already added",
    });
    return;
  }
  await db.Friend.create({
    id: `${user}_${friend_username}`,
  });
  res.status(200).json({
    status: "success",
    message: "Friend added",
  });

});
app.get("/api/friends/contacts", auth, async (req, res) => {
  const username = req.username;
  console.log(username);
  //find user in db based on username
  const userDB = await db.User.findOne({ where: { username: username } });
  const friends = await db.Friend.findAll({
    where: {
      [Op.or]: [
        { id: { [Op.startsWith]: `${username}_` } },
        { id: { [Op.endsWith]: `_${username}` } },
      ],
    },
  });
  console.log("aaaaa " + friends);
  res.status(200).json({
    status: "success",
    message: "All chats",
    friends: friends,
  });

});

app.get("/api/chat/:friend_id", auth, async (req, res) => {
  const user = req.username;
  const friendId = req.params.friend_id;
  //split the friend id to get the user's friend username
  const friendUsername = friendId.split("_").find((f) => f !== user);
  //find the chat between the user and the friend
  const chats = await db.Chat.findAll({
    where: {
      [Op.or]: [
        { sender: user, receiver: friendUsername },
        { sender: friendUsername, receiver: user },
      ],
    },
  });

  res.status(200).json({
    status: "success",
    message: "All chats",
    data: chats,
    receiver: friendUsername,
  });
  
});
app.post("/api/chat/:friend_id/send", auth, async (req, res) => {
  const user = req.username;
  const friendId = req.params.friend_id;
  const friendUsername = friendId.split("_").find((f) => f !== user);
  const { body } = req.body;
  const newChat = await db.Chat.create({
    sender: user,
    receiver: friendUsername,
    message: body,
  });
  res.status(200).json({
    status: "success",
    message: "Message sent",
    data: newChat,
  });
  
});

//#endregion

//#region MIDDLEWARE(S)
function auth(req, res, next) {
  try {
    const token = req.cookies.appakabar_token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const verified = jwt.verify(token, JWT_KEY);
    req.username = verified.username;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
//#endregion

//#region SOCKET CONFIG
const socketIO = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("login", async (data) => {
    console.log(
      `${data.username} just logged in with ${socket.id} user just connected!`
    );
    try {
      let userlogin = await db.User.findOne({ where: { username: data.username } });
      if (userlogin) {
        // Assuming you have a method to set the socket ID in your User model
        await userlogin.update({ socket_id: socket.id });
        console.log(`Socket ID for ${data.username} updated to ${socket.id}`);
      } else {
        console.log(`User ${data.username} not found.`);
      }
    } catch (error) {
      console.error("Error finding user during login:", error);
    }
  });

  socket.on("message", async (data) => {
    try {
      let calledUser = await db.User.findOne({ where: { username: data.username } });
      if (calledUser && calledUser.socket_id) {
        console.log(
          `Sending message to ${data.username} with socket ${calledUser.socket_id}`
        );
        socket.to(calledUser.socket_id).emit("update");
      } else {
        console.log(`User ${data.username} not found or socket ID is missing.`);
      }
    } catch (error) {
      console.error("Error finding user during message event:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});


server.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
});
//#endregion
