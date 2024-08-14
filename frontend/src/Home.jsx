import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import client from "./client";  // Axios instance for making HTTP requests
import LoadingPage from "./components/LoadingPage";  // Component to show a loading spinner/page
import handleError from "./util";  // Utility function to handle errors
import Button from "./components/Button";  // Custom Button component

// Home component which is the main dashboard after user logs in
function Home({ socket }) {
  const navigate = useNavigate();  // React Router hook for navigation
  const [isLoading, setIsLoading] = useState(false);  // State to manage loading state
  const [username, setUsername] = useState(null);  // State to store the current user's username
  const [contacts, setContacts] = useState(null);  // State to store the user's contact list
  const skeleton = [1, 2, 3, 4, 5, 6, 7];  // Skeleton structure used while loading contacts

  // Function to check if the user is logged in
  async function checkLoggedIn() {
    try {
      // Making a request to check the current user
      let res = await client.get("api/users/current-user", {
        withCredentials: true,  // Ensures cookies are sent with the request
      });
      setUsername(res.data.username);  // Set the username state with the retrieved username
      // Emit a login event with username and socket ID to the server
      socket.emit("login", {
        username: res.data.username,
        socketID: socket.id,
      });
    } catch (error) {
      // If there's an error (e.g., not logged in), navigate to the login page
      navigate("/login");
    }
  }

  // Function to log the user out
  async function logout() {
    try {
      // Request to log out the current user
      let res = await client.post(
        "api/users/logout",
        {},
        { withCredentials: true }  // Include credentials in the request
      );
      navigate("/login");  // Navigate back to the login page after logout
    } catch (error) {
      let errorObject = handleError(error, navigate);  // Handle any errors
    }
  }

  // Function to fetch the user's contacts
  async function fetchContact() {
    try {
      // Request to get the contact list
      let res = await client.get("api/friends/contacts", {
        withCredentials: true,
      });
      console.log("ini list friend nya " + JSON.stringify(res.data, null, 2));  // Log the contacts for debugging
      setContacts(res.data.friends);  // Set the contacts state with the retrieved data
    } catch (error) {
      let errorObject = handleError(error, navigate);  // Handle any errors
    }
  }

  // useEffect to listen for socket updates and refresh contacts when necessary
  useEffect(() => {
    socket.on("update", () => {
      fetchContact();  // Fetch contacts again when an update event is received
    });
  }, [socket]);  // Dependencies array includes socket to ensure the effect runs when socket changes

  // useEffect to check if the user is logged in and fetch contacts when the component mounts
  useEffect(() => {
    setIsLoading(true);  // Set loading state to true
    checkLoggedIn();  // Check if the user is logged in
    fetchContact();  // Fetch the user's contacts
    setIsLoading(false);  // Set loading state to false after operations are done
  }, []);  // Empty dependencies array to run this effect only once on component mount

  // If the component is in loading state, display a loading page
  if (isLoading) {
    return <LoadingPage></LoadingPage>;
  }

  return (
    <>
    {/* Top navigation  */}
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
                  className="inline-flex items-center p-2 text-sm rounded-lg sm:hidden focus:outline-none focus:ring-2  text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
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
                <a
                  href="http://localhost:5173/home"
                  className="flex items-center ms-2 md:me-24"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    className="h-8 me-3"
                    alt="FlowBite Logo"
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
      {/* Side navigation */}
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
              <Link to={"/add"}>
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
          {/* list of contacts */}
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
              {/* Loading for data fetching */}
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
      {/* Main content */}
      <div className="p-4 sm:ml-96 text-[#f8f8f8]">
        <div className="p-4 relative py-14 border-[#f8f8f8] rounded-lg h-[37.5rem] mt-14">
          <div className="w-full h-full text-2xl font-semibold flex items-center justify-center">
            Make new conversation!
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
