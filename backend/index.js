'use strict';

/**
 * This script sets up an Express.js server with various features including user authentication,
 * friend management, and chat functionalities. It also configures WebSocket connections for real-time communication.
 * The server utilizes Sequelize as the ORM for database interactions and uses JWT for authentication.
 */

//#region DEPENDENCIES
// Importing necessary dependencies for the server setup
const express = require("express"); // Framework for handling HTTP requests
const { Server } = require("http"); // Core HTTP module to create the server
const cors = require("cors"); // Middleware for enabling CORS (Cross-Origin Resource Sharing)
const cookieParser = require("cookie-parser"); // Middleware to parse cookies
require("dotenv").config(); // Load environment variables from a .env file
const db = require("./models"); // Import the database models
const { Op } = require("sequelize"); // Sequelize operators for complex queries
const bcrypt = require("bcrypt"); // Library for hashing passwords
const jwt = require("jsonwebtoken"); // Library for JSON Web Token (JWT) creation and verification

// Extract configuration values from environment variables
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS); // Salt rounds for bcrypt
const JWT_KEY = process.env.JWT_SECRET; // JWT secret key
const PORT = process.env.PORT; // Server port

// Create an instance of the Express application and HTTP server
const app = express();
const server = Server(app);

// Middleware configuration for handling requests and enabling features
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
//#endregion

//#region TEST ROUTE
// A simple test route to check if the server is running correctly
app.get("/api", (req, res) => {
  return res.sendStatus(200);
});
//#endregion

//#region AUTHENTICATION ROUTES
/**
 * Routes for user registration, login, and logout.
 * These routes handle creating new users, authenticating existing users, 
 * issuing JWT tokens, and clearing tokens on logout.
 */

app.post("/api/users/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const user = await db.User.findOne({ where: { username: username } });
  if (user) {
    return res.status(400).json({
      status: "error",
      message: "Username already exists",
    });
  }

  // Hash the password and create a new user in the database
  const hashedPassword = await bcrypt.hashSync(password, SALT_ROUNDS);
  await db.User.create({
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

  // Find the user by username
  const user = await db.User.findOne({ where: { username: username } });
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  // Validate the password
  const isPasswordValid = await bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      status: "error",
      message: "Invalid password",
    });
  }

  // Create a JWT token and send it as a cookie
  const token = jwt.sign(
    { username: user.username },
    JWT_KEY,
    { expiresIn: "1h" }
  );
  res.cookie("appakabar_token", token, {
    httpOnly: true,
    maxAge: 3 * 3600 * 1000, // 3 hours
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

//#region FRIEND MANAGEMENT ROUTES
/**
 * Routes for managing friends within the application.
 * Users can search for friends, add new friends, and view their list of friends.
 */

app.get("/api/friends/find-friend", auth, async (req, res) => {
  const findUsername = req.query.username;

  // Prevent users from adding themselves as friends
  if (findUsername === req.username) {
    return res.status(400).send({ message: "You can't add yourself" });
  }

  // Search for the friend in the database
  const friend = await db.User.findOne({ where: { username: findUsername } });
  if (!friend) {
    return res.status(404).json({
      status: "error",
      message: "Friend not found",
    });
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

  // Prevent users from adding themselves as friends
  if (friend_username === user) {
    return res.status(400).json({
      status: "error",
      message: "You cannot add yourself as a friend",
    });
  }

  // Check if the friendship already exists
  const isFriend = await db.Friend.findOne({
    where: {
      [Op.or]: [
        { id: `${user}_${friend_username}` },
        { id: `${friend_username}_${user}` },
      ],
    },
  });

  if (isFriend) {
    return res.status(400).json({
      status: "error",
      message: "Friend already added",
    });
  }

  // Create a new friend relationship
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

  // Retrieve all friends related to the user
  const friends = await db.Friend.findAll({
    where: {
      [Op.or]: [
        { id: { [Op.startsWith]: `${username}_` } },
        { id: { [Op.endsWith]: `_${username}` } },
      ],
    },
  });

  res.status(200).json({
    status: "success",
    message: "All contacts retrieved",
    friends: friends,
  });
});
//#endregion

//#region CHAT ROUTES
/**
 * Routes for handling chat functionality between users.
 * Users can send and retrieve messages in a one-on-one chat.
 */

app.get("/api/chat/:friend_id", auth, async (req, res) => {
  const user = req.username;
  const friendId = req.params.friend_id;
  const friendUsername = friendId.split("_").find((f) => f !== user);

  // Retrieve all chats between the user and the friend
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
    message: "All chats retrieved",
    data: chats,
    receiver: friendUsername,
  });
});

app.post("/api/chat/:friend_id/send", auth, async (req, res) => {
  const user = req.username;
  const friendId = req.params.friend_id;
  const friendUsername = friendId.split("_").find((f) => f !== user);
  const { body } = req.body;

  // Create a new chat message
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
/**
 * Authentication middleware to protect routes.
 * Verifies the JWT token and attaches the authenticated username to the request object.
 */
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

//#region SOCKET CONFIGURATION
/**
 * WebSocket configuration using Socket.IO to enable real-time communication.
 * This handles events such as user connection, login, message sending, and disconnection.
 */

const socketIO = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("login", async (data) => {
    console.log(`${data.username} just logged in with ${socket.id} user just connected!`);
    try {
      let userlogin = await db.User.findOne({ where: { username: data.username } });
      if (userlogin) {
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
        console.log(`Sending message to ${data.username} with socket ${calledUser.socket_id}`);
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
//#endregion

// Start the server on the specified port
server.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
});
