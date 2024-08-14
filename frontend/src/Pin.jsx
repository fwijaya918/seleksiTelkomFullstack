import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import client from "./client";
import LoadingPage from "./components/LoadingPage";
import handleError from "./util";

function Pin({ socket }) {
  let { idChat } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState(null);
  async function checkLoggedIn() {
    try {
      let res = await client.get("api/current-user", { withCredentials: true });
      setUsername(res.data.username);
      socket.emit("login", {
        username: res.data.username,
        socketID: socket.id,
      });
    } catch (error) {
      navigate("/login");
    }
  }
  async function logout() {
    try {
      let res = await client.post("api/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      let errorObject = handleError(error, navigate);
    }
  }
  async function pin(idx) {
    try {
      let res = await client.post(
        `/api/chat/${idChat}/pin`,
        { idx },
        { withCredentials: true }
      );
      fetchData();
    } catch (error) {
      let errorObject = handleError(error, navigate);
    }
  }
  async function send(e) {
    e.preventDefault();
    if (input == "") {
      return;
    }
    try {
      setInput("");
      let res = await client.post(
        `/api/chat/${idChat}/send`,
        { body: input },
        { withCredentials: true }
      );
      await fetchData();
      scrollRef.current?.scrollIntoView();
    } catch (error) {
      let errorObject = handleError(error, navigate);
    }
  }

  async function unsend(idx) {
    try {
      let res = await client.post(
        `/api/chat/${idChat}/unsend`,
        { idx },
        { withCredentials: true }
      );
      fetchData();
    } catch (error) {
      let errorObject = handleError(error, navigate);
    }
  }
  async function fetchData() {
    try {
      let chat = await client.get(`api/chat/${idChat}`, {
        withCredentials: true,
      });
      setChats(chat.data);
    } catch (error) {
      let errorObject = handleError(error, navigate);
      if (errorObject.status == "403") {
        navigate("/forbidden");
      }
      if (errorObject.status == "404") {
        navigate("/not-found");
      }
    }
  }
  useEffect(() => {
    socket.on("update", () => {
      fetchData();
    });
  }, [socket]);
  useEffect(() => {
    setIsLoading(true);
    checkLoggedIn();
    fetchData();
    setIsLoading(false);
    scrollRef.current?.scrollIntoView();
  }, []);
  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [idChat, chats]);
  useEffect(() => {
    fetchData();
    scrollRef.current?.scrollIntoView();
  }, [idChat]);
  if (isLoading) {
    return <LoadingPage></LoadingPage>;
  }
  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b bg-[#121b21] border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <div className="flex">
                <a
                  href="http://localhost:5173/home"
                  className="flex items-center ms-2 md:me-24"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    className="h-8 me-3"
                  />
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-[#f8f8f8]">
                    APP-A-KABAR
                  </span>
                </a>
              </div>
            </div>
            <div
              onClick={() => logout()}
              className="text-[#f8f8f8] cursor-pointer rounded bg-red-500 py-1 px-2 items-center gap-2 flex"
            >
              <div className="font-semibold">Sign Out</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </div>
          </div>
        </div>
      </nav>
      <div className="mt-24 text-[#f8f8f8] px-12">
        <div className="flex items-center gap-3">
          <Link to={`/chat/${idChat}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </Link>
          <div className="font-bold text-2xl">
            Pinned Message from {chats?.opposing}
          </div>
        </div>
        <div className="mt-4 p-4 w-full rounded">
          {chats != null &&
            chats.messages.map((m) => {
              if (m.pinned) {
                return (
                  <div className="w-fit cursor-pointer max-w-1/2 bg-[#00A884] text-justify mb-4 rounded-xl p-3">
                    {m.type == "img" && (
                      <img className="w-[24rem]" src={m.body} alt="" />
                    )}
                    {m.type == "text" && (
                      <div className="break-all max-w-[55vw]"> {m.body}</div>
                    )}
                  </div>
                );
              }
            })}
        </div>
      </div>
    </>
  );
}

export default Pin;
