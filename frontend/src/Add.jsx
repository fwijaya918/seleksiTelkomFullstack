import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import client from "./client";
import LoadingPage from "./components/LoadingPage";
import handleError from "./util";
import Button from "./components/Button";
import FloatingInput from "./components/FloatingInput";
import ErrorMessage from "./components/ErrorMessage";

/**
 * Add Component
 *
 * Overview:
 * The Add component is a feature within the application that allows users to search for and add friends.
 * It includes functionality for handling user authentication, searching for friends by username, and sending friend requests.
 * The component also integrates with a Socket.IO server for real-time communication.
 *
 * Props:
 * - socket: The Socket.IO instance passed down from a parent component for real-time communication.
 *
 * State Variables:
 * - isLoading (boolean): Manages the loading state when checking if the user is logged in.
 * - username (string | null): Stores the username of the currently logged-in user.
 * - errorMessage (string | null): Stores any error messages to be displayed.
 * - contactCandidate (object | null): Stores the user object returned from the search if a match is found.
 * - listFriends (array | null): Stores the list of friends for the current user.
 * - input (string): The value of the search input field.
 *
 * Refs:
 * - inputRef: A reference to the search input field.
 *
 * Functions:
 *
 * 1. checkLoggedIn()
 *    - Purpose: Checks if the user is currently logged in by making a request to the server.
 *      If logged in, the username is stored in the username state, and a login event is emitted to the Socket.IO server.
 *      If not, the user is redirected to the login page.
 *    - Usage: Called in a useEffect when the component mounts.
 *
 * 2. logout()
 *    - Purpose: Logs the user out by making a request to the server and then redirects to the login page.
 *    - Usage: Triggered when the user clicks the "Sign Out" button.
 *
 * 3. search(e)
 *    - Purpose: Searches for a friend by username. If a match is found, the user object is stored in contactCandidate.
 *      If the input is empty, an error message is displayed.
 *    - Usage: Triggered when the user submits the search form.
 *
 * 4. add()
 *    - Purpose: Sends a friend request to the user found by the search. Upon success, a message is emitted to the Socket.IO server,
 *      and the user is redirected to the home page.
 *    - Usage: Triggered when the user clicks the "Add" button.
 *
 * useEffect Hooks:
 *
 * 1. useEffect(() => { ... }, [])
 *    - Purpose: Runs on component mount to check if the user is logged in and to fetch the current user's friends list.
 *   
 * 2. useEffect(() => { ... }, [input])
 *    - Purpose: Clears the error message whenever the search input changes.
 *
 * JSX Structure:
 *
 * - Navigation Bar: Includes the app logo, app name, and a "Sign Out" button.
 * - Search Form: Contains an input field for the username and a button to trigger the search.
 * - Search Results: Displays the details of the found user and an "Add" button.
 */

function Add({ socket }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [contactCandidate, setContactCandidate] = useState(null);
  const [listFriends, setListFriends] = useState(null);
  const inputRef = useRef();
  const [input, setInput] = useState("");

  // Function to check if the user is logged in
  async function checkLoggedIn() {
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
  }

  // Function to log out the user
  async function logout() {
    try {
      let res = await client.post(
        "api/users/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      let errorObject = handleError(error, navigate);
    }
  }

  // Function to search for a friend by username
  async function search(e) {
    e.preventDefault();
    if (input == "") {
      setErrorMessage("Keyword must be filled");
      return;
    }
    try {
      let res = await client.get(`api/friends/find-friend?username=${input}`, {
        withCredentials: true,
      });
      console.log("ini temen dicarinya " + JSON.stringify(res.data, null, 2));
      setContactCandidate(res.data.friend);
    } catch (error) {
      let errorObject = handleError(error, navigate);
      if (errorObject?.message) {
        setErrorMessage(errorObject.message);
        setContactCandidate(null);
      }
    }
  }

  // Function to send a friend request
  async function add() {
    try {
      let res = await client.post(
        `api/friends/add`,
        { friend_username: contactCandidate.username },
        {
          withCredentials: true,
        }
      );
      socket.emit("message", { username: contactCandidate.username });
      navigate("/home");
    } catch (error) {
      let errorObject = handleError(error, navigate);
      if (errorObject?.message) {
        setErrorMessage(errorObject.message);
        setContactCandidate(null);
      }
    }
  }

  // useEffect to find all current user's friends every time the page is loaded or listFriends is updated
  useEffect(() => {
    async function fetchContact() {
      try {
        let res = await client.get("api/friends/contacts", {
          withCredentials: true,
        });
        console.log(
          "ini daftar temen nya " + JSON.stringify(res.data, null, 2)
        );
        setListFriends(res.data.friends);
      } catch (error) {
        let errorObject = handleError(error, navigate);
      }
    }
    fetchContact();
  }, []);

  // useEffect to check if the user is logged in on component mount
  useEffect(() => {
    setIsLoading(true);
    checkLoggedIn();
    setIsLoading(false);
  }, []);

  // useEffect to clear error message when the search input changes
  useEffect(() => {
    setErrorMessage(null);
  }, [input]);

  // Render loading page if isLoading is true
  if (isLoading) {
    return <LoadingPage></LoadingPage>;
  }

  // Render the main content of the component
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
      <div className="mt-24 text-[#f8f8f8] px-12">
        <div className="flex items-center gap-3">
          <Link to={"/home"}>
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
          <div className="font-bold text-2xl">Add Friend</div>
        </div>
        <div className="mt-4 p-4 w-full rounded bg-[#00A884]">
          <div className="w-full">
            <form onSubmit={search}>
              <FloatingInput
                id={"username"}
                refHook={inputRef}
                onChange={(e) => setInput(e.target.value)}
                type={"text"}
              >
                Username
              </FloatingInput>
              {errorMessage != null && (
                <ErrorMessage>{errorMessage}</ErrorMessage>
              )}
              <Button type={"submit"}>Search</Button>
            </form>
          </div>
        </div>
      </div>
      {contactCandidate != null && (
        <div className="text-[#f8f8f8] px-12">
          <div className="mt-4 p-4 w-full rounded bg-[#00A884]">
            <div className="font-bold">{contactCandidate.message}</div>
            <div className="mb-4 font-bold">
              {"username"} - {contactCandidate.username}
            </div>
            <div onClick={add}>
              <Button type={"button"}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Add;
