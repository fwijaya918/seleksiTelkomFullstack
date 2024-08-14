import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import client from "./client";
import LoadingPage from "./components/LoadingPage";
import handleError from "./util";

function Chat({ socket }) {
  let { idFriend } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef();

  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);
  const [showFAQ, setShowFAQ] = useState(false);
  const [replyError, setReplyError] = useState(null);

  const [faqOptions, setFAQOptions] = useState([
    "Apa kabar ?",
    "Sudah makan belum?",
    "Lagi apa kamu?",
    "Kamu lagi dimana?",
  ]);
  const skeleton = [1, 2, 3, 4, 5, 6, 7];

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        let res = await client.get("api/users/current-user", {
          withCredentials: true,
        });
        setUsername(res.data.username);
        socket.emit("login", {
          username: res.data.username,
          socketID: socket.id,
        });
      } catch (error) {
        navigate("/login");
      }
    };

    const fetchData = async () => {
      try {
        let chat = await client.get(`api/chat/${idFriend}`, {
          withCredentials: true,
        });
        setChats(chat.data.data); // Directly update the chats with the fetched data
        let res = await client.get("api/friends/contacts", {
          withCredentials: true,
        });
        setContacts(res.data.friends);
      } catch (error) {
        let errorObject = handleError(error, navigate);
        if (errorObject.status === "403") {
          navigate("/forbidden");
        } else if (errorObject.status === "404") {
          navigate("/not-found");
        }
      } finally {
        setIsLoading(false); // Hide loading screen after data is fetched
      }
    };

    checkLoggedIn();
    fetchData();
    scrollRef.current?.scrollIntoView();
  }, [idFriend, navigate, socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [chats]);

  useEffect(() => {
    const handleUpdate = async () => {
      // Fetch new chat data and update the state
      await fetchData();
    };

    socket.on("update", handleUpdate);

    return () => {
      socket.off("update", handleUpdate);
    };
  }, [socket]);

  const send = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    // Find the last message from the other person
    const lastMessageFromFriend = chats
      .slice()
      .reverse()
      .find((chat) => chat.sender !== username);

    // i want to make sure that the message i send contains a word from other person last message
    let messageToSend = input;
    if (lastMessageFromFriend) {
      const lastMessageWords = lastMessageFromFriend.message.split(" ");
      const inputWords = input.split(" ");
      const commonWords = lastMessageWords.filter((word) =>
        inputWords.includes(word)
      );
      if (commonWords.length > 0) {
        messageToSend = `${input} `;
      } else {
        setReplyError("Please reply to a message from the other person");
        return;
      }
    }
    
    try {
      let res = await client.post(
        `/api/chat/${idFriend}/send`,
        { body: messageToSend },
        { withCredentials: true }
      );
      socket.emit("message", { username: res.data.receiver });
      setInput(""); // Clear the input field after sending
      scrollRef.current?.scrollIntoView();
      window.location.reload();
    } catch (error) {
      let errorObject = handleError(error, navigate);
    }
  };

  const handleFAQClick = (faq) => {
    setInput(faq); // Set the selected FAQ text to the input field
    setShowFAQ(false); // Hide FAQ options after selection
  };

  const logout = async () => {
    try {
      await client.post("api/users/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      let errorObject = handleError(error, navigate);
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b bg-[#121b21] border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <div className="flex">
                <button
                  data-drawer-target="logo-sidebar"
                  data-drawer-toggle="logo-sidebar"
                  aria-controls="logo-sidebar"
                  type="button"
                  className="inline-flex items-center p-2 text-sm rounded-lg sm:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
                >
                  <span className="sr-only">Open sidebar</span>
                  <svg
                    className="w-6 h-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    />
                  </svg>
                </button>
                <a href="/home" className="flex items-center ms-2 md:me-24">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    className="h-8 me-3"
                    alt="App Logo"
                  />
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-[#f8f8f8]">
                    APP-A-KABAR
                  </span>
                </a>
              </div>
            </div>
            <div
              onClick={logout}
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
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-full sm:w-96 h-screen pt-20 transition-transform -translate-x-full border-r sm:translate-x-0 bg-[#121b21] border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-[#121b21]">
          {username !== null && (
            <div className="flex items-center p-1 mb-4 justify-between">
              <div className="text-[#f8f8f8] text-xl font-semibold">
                Welcome, {username}
              </div>
              <Link to="/add">
                <button className="text-[#f8f8f8] bg-[#00A884] rounded py-1 px-2">
                  Add Friend
                </button>
              </Link>
            </div>
          )}
          {username === null && (
            <div role="status" className="max-w-sm animate-pulse">
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4" />
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5" />
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
              <span className="sr-only">Loading...</span>
            </div>
          )}
          <ul className="space-y-2 font-medium">
            {contacts != null &&
              contacts.map((c) => (
                <NavLink
                  key={c.id}
                  to={`/chat/${c.id}`}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center p-2 text-[#f8f8f8] bg-[#1C2D35] rounded-lg"
                      : "flex items-center p-2 text-[#f8f8f8] rounded-lg hover:bg-gray-700"
                  }
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    className="w-10 h-10 rounded-full"
                    alt={c.name}
                  />
                  <span className="ml-3">{c.id}</span>
                </NavLink>
              ))}
            {contacts === null &&
              skeleton.map((s) => (
                <li key={s}>
                  <div
                    role="status"
                    className="max-w-sm animate-pulse space-y-2.5"
                  >
                    <div className="flex items-center w-full space-x-2">
                      <div className="h-10 bg-gray-200 rounded-full dark:bg-gray-700 aspect-square" />
                      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32" />
                    </div>
                    <span className="sr-only">Loading...</span>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </aside>
      <div className="sm:ml-96 pt-20 pb-6 px-2">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#1C2D35] px-5 py-3 h-[80vh] sm:h-[75vh] overflow-y-scroll rounded-t-lg">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-2 my-1 max-w-lg rounded ${
                  chat.sender === username
                    ? "bg-[#005C4B] ml-auto"
                    : "bg-[#966919] mr-auto"
                }`}
              >
                <div className="text-gray-400 text-sm mb-1">
                  {chat.sender === username ? "You" : chat.sender}
                </div>
                <div className="text-white">{chat.message}</div>
              </div>
            ))}

            <div ref={scrollRef} />
          </div>
          {replyError && (
            <div className="text-red-500 text-sm mt-2">{replyError}</div>
          )}
          <form
            onSubmit={send}
            className="bg-[#1C2D35] rounded-b-lg flex items-center relative"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 text-sm bg-[#2B3B45] outline-none text-[#f8f8f8] border-none rounded-bl-lg"
              placeholder="Type a message"
            />
            <button
              type="button"
              onClick={() => setShowFAQ(!showFAQ)}
              className="absolute right-14 top-2 p-2 text-[#f8f8f8] bg-[#005C4B] rounded-lg"
            >
              FAQ
            </button>
            {showFAQ && (
              <div className="absolute right-0 bottom-12 bg-[#2B3B45] p-2 rounded-lg shadow-lg z-10">
                {faqOptions.map((faq, index) => (
                  <div
                    key={index}
                    onClick={() => handleFAQClick(faq)}
                    className="p-2 text-[#f8f8f8] cursor-pointer hover:bg-[#1C2D35]"
                  >
                    {faq}
                  </div>
                ))}
              </div>
            )}
            <button
              type="submit"
              className="p-3 text-[#f8f8f8] text-xl rounded-br-lg bg-[#005C4B]"
            >
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
                  d="M4.5 12l15-8.25v16.5L4.5 12z"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Chat;
