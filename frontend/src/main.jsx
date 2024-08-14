import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { io } from "socket.io-client";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Home from "./Home.jsx";
import ServerError from "./ServerError.jsx";
import Chat from "./Chat.jsx";
import Forbidden from "./Forbidden.jsx";
import NotFound from "./NotFound.jsx";
import Add from "./Add.jsx";

// Initialize a WebSocket connection to the server using Socket.IO
const socket = io("http://localhost:3000");

// Handling different socket events
socket.on("connection", (err) => console.log(err.message)); // On connection event
socket.on("disconnect", (err) => console.log(err.message)); // On disconnection event
socket.on("connect_error", (err) => console.log(err.message)); // On connection error
socket.on("connect_failed", (err) => console.log(err.message)); // On connection failure

// Create a router with different routes
const router = createBrowserRouter([
  {
    path: "/", // Root path redirects to login
    element: <Navigate to={"/login"} />,
    errorElement: <NotFound />, // Custom 404 component
  },
  {
    path: "/login", // Login route
    element: <Login socket={socket} />, // Passing socket instance to Login component
    errorElement: <NotFound />, // Custom 404 component
  },
  {
    path: "/register", // Register route
    element: <Register />,
    errorElement: <NotFound />, // Custom 404 component
  },
  {
    path: "/home", // Home route
    element: <Home socket={socket} />, // Passing socket instance to Home component
    errorElement: <NotFound />, // Custom 404 component
  },
  {
    path: "/chat/:idFriend", // Chat route with dynamic friend ID
    element: <Chat socket={socket} />, // Passing socket instance to Chat component
    errorElement: <NotFound />, // Custom 404 component
  },
  {
    path: "/add", // Add friend route
    element: <Add socket={socket} />, // Passing socket instance to Add component
    errorElement: <NotFound />, // Custom 404 component
  },
  {
    path: "/server-error", // Server error route
    element: <ServerError />,
    errorElement: <NotFound />, // Custom 404 component
  },
  {
    path: "/forbidden", // Forbidden route
    element: <Forbidden />,
    errorElement: <NotFound />, // Custom 404 component
  },
  {
    path: "/not-found", // Not found route
    element: <NotFound />,
    errorElement: <NotFound />, // Custom 404 component
  },
]);

// Render the application with RouterProvider and StrictMode
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
