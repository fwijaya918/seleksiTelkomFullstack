const express = require("express");
const { Server } = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const db = require("./models");
const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");
// const { findUserByUsername, registerUser, users } = require("./db/users");
// const User = require("./model/User");
// const ChatRoom = require("./model/ChatRoom");
const jwt = require("jsonwebtoken");
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
// const {
//   chats,
//   findChatsByParticipant,
//   addChat,
//   findAllChatRoom,
//   findChatByID,
// } = require("./db/chats");
// const ChatMessage = require("./model/ChatMessage");
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
  // let findUser = findUserByUsername(req.body.username);
  // if (findUser === undefined) {
  //   return res.status(400).send({ message: "Username not found" });
  // }
  // let matchPassword = findUser.matchPassword(req.body.password);
  // if (!matchPassword) {
  //   return res.status(400).send({ message: "Invalid password" });
  // }
  // const token = jwt.sign({ username: findUser.username }, JWT_KEY);
  // res.cookie("appakabar_token", token, {
  //   httpOnly: true,
  //   maxAge: 3 * 3600 * 1000, // 3jam
  //   sameSite: "strict",
  // });
  // return res.status(200).send({ message: "Login success" });
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
  // let findUser = findUserByUsername(findUsername);
  // if (findUser === undefined) {
  //   return res.status(404).send({ message: "No user found" });
  // }
  // let findChatRoom = findChatsByParticipant([req.username, findUser.username]);
  // if (findChatRoom !== undefined) {
  //   return res
  //     .status(400)
  //     .send({ message: `User ${findUser.username} is already your friend.` });
  // }
  // return res.status(200).send({
  //   message: `Found user with username ${findUsername}`,
  //   username: findUser.username,
  //   phone_number: findUser.phone_number,
  // });
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
  // let { username } = req.body;
  // if (username === req.username) {
  //   return res.status(400).send({ message: "You can't add yourself" });
  // }
  // let findUser = findUserByUsername(username);
  // if (findUser === undefined) {
  //   return res.status(404).send({ message: "No user found" });
  // }
  // let findChatRoom = findChatsByParticipant([req.username, findUser.username]);
  // if (findChatRoom !== undefined) {
  //   return res
  //     .status(400)
  //     .send({ message: `User ${findUser.username} is already your friend.` });
  // }
  // addChat(new ChatRoom([req.username, findUser.username]));
  // return res
  //   .status(200)
  //   .send({ message: `Successfully added ${findUser.username} as friend` });
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
  // let contacts = findAllChatRoom(req.username);
  // let displayContact = [];
  // contacts.forEach((element) => {
  //   displayContact.push({
  //     contact: element.participant.find((p) => p !== req.username),
  //     ...element,
  //     unread: element.messages.filter(
  //       (message) => message.receiver == req.username && message.read == false
  //     ).length,
  //     last_message:
  //       element.messages.length > 0
  //         ? element.messages[element.messages.length - 1].body
  //         : "",
  //   });
  // });
  // return res.status(200).send(displayContact);
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
  // const chats = await db.Chat.findAll({
  //   where: {
  //     [Op.or]: [{ sender: user.username }, { receiver: user.username }],
  //   },
  // });
  res.status(200).json({
    status: "success",
    message: "All chats",
    data: chats,
    receiver: friendUsername,
  });
  // let findChat = findChatByID(req.params.friend_id);
  // if (findChat === undefined) {
  //   return res.status(404).send({ message: "Chat not found" });
  // }
  // if (!findChat.participant.includes(req.username)) {
  //   return res.status(403).send({ message: "Unauthorized" });
  // }
  // findChat.messages.forEach((message) => {
  //   if (message.receiver == req.username) {
  //     message.readMessage();
  //   }
  // });
  // let result = {
  //   _id: findChat._id,
  //   opposing: findChat.participant.find((p) => p != req.username),
  //   messages: findChat.messages,
  // };
  // return res.status(200).send(result);
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
  // let findChat = findChatByID(req.params.friend_id);
  // if (findChat === undefined) {
  //   return res.status(404).send({ message: "Chat not found" });
  // }
  // if (!findChat.participant.includes(req.username)) {
  //   return res.status(403).send({ message: "Unauthorized" });
  // }
  // let opposing = findChat.participant.find((p) => p != req.username);
  // let { body } = req.body;
  // if (body.startsWith("SENDPICTURE|")) {
  //   let newMessage = new ChatMessage(
  //     body.replace("SENDPICTURE|", ""),
  //     "img",
  //     req.username,
  //     opposing
  //   );
  //   findChat.addMessage(newMessage);
  //   return res.status(200).send(findChat);
  // }
  // let newMessage = new ChatMessage(body, "text", req.username, opposing);
  // findChat.addMessage(newMessage);
  // return res.status(200).send(findChat);
});
// app.post("/api/chat/:chat_id/pin", auth, async (req, res) => {
//   let findChat = findChatByID(req.params.chat_id);
//   if (findChat === undefined) {
//     return res.status(404).send({ message: "Chat not found" });
//   }
//   if (!findChat.participant.includes(req.username)) {
//     return res.status(403).send({ message: "Unauthorized" });
//   }
//   let { idx } = req.body;
//   findChat.messages[idx].togglePin();
//   return res.status(200).send(findChat);
// });
// app.post("/api/chat/:chat_id/unsend", auth, async (req, res) => {
//   let findChat = findChatByID(req.params.chat_id);
//   if (findChat === undefined) {
//     return res.status(404).send({ message: "Chat not found" });
//   }
//   if (!findChat.participant.includes(req.username)) {
//     return res.status(403).send({ message: "Unauthorized" });
//   }
//   let { idx } = req.body;
//   if (findChat.messages[idx].sender != req.username) {
//     return res.status(403).send({ message: "Unauthorized" });
//   }
//   findChat.deleteMessage(idx);
//   return res.status(200).send(findChat);
// });
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

// socketIO.on("connection", (socket) => {
//   console.log(`⚡: ${socket.id} user just connected!`);
//   socket.on("login", (data) => {
//     console.log(
//       `${data.username} just logged in with ${socket.id} user just connected!`
//     );
//     let userlogin = db.User.findOne({ where: { username: data.username } });
//     // let userlogin = findUserByUsername(data.username);
//     // if (userlogin !== undefined) {
//     //   userlogin.setSocketID(data.socketID);
//     // }
//   });
//   socket.on("message", (data) => {
//     let calledUser = db.User.findOne({ where: { username: data.username } });
//     console.log(
//       `Sending message to ${data.username} with socket ${calledUser.socket_id}`
//     );
//     socket.to(calledUser.socket_id).emit("update");
//   });
//   socket.on("disconnect", () => {
//     console.log("🔥: An user disconnected");
//   });
// });

server.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
});
//#endregion
