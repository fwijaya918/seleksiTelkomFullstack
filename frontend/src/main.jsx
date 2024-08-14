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
import Pin from "./Pin.jsx";
// function App() {
//   let data = axios.get("http://localhost:3000/api", { withCredentials: true });
//   return (
//     <div>
//       <p>Hello World!</p>
//     </div>
//   );
// }

const socket = io("http://localhost:3000");
socket.on("connection", (err) => console.log(err.message));
socket.on("disconnect", (err) => console.log(err.message));
socket.on("connect_error", (err) => console.log(err.message));
socket.on("connect_failed", (err) => console.log(err.message));
// export default App;
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/login"}></Navigate>,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login socket={socket} />,
    errorElement: <NotFound />,
  },
  { path: "/register", element: <Register />, errorElement: <NotFound /> },
  {
    path: "/home",
    element: <Home socket={socket} />,
    errorElement: <NotFound />,
  },
  {
    path: "/chat/:idFriend",
    element: <Chat socket={socket} />,
    errorElement: <NotFound />,
  },
  {
    path: "/add",
    element: <Add socket={socket} />,
    errorElement: <NotFound />,
  },
  {
    path: "/server-error",
    element: <ServerError />,
    errorElement: <NotFound />,
  },
  {
    path: "/forbidden",
    element: <Forbidden />,
    errorElement: <NotFound />,
  },
  {
    path: "/not-found",
    element: <NotFound />,
    errorElement: <NotFound />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
