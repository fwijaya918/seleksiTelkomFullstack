import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import FloatingInput from "./components/FloatingInput";
import ErrorMessage from "./components/ErrorMessage";
import Button from "./components/Button";
import { Link, useNavigate } from "react-router-dom";
import client from "./client";
import handleError from "./util";
import LoadingPage from "./components/LoadingPage";

/**
 * Register component handles user registration.
 * This component includes a form for users to create a new account.
 * It checks if the user is already logged in, displays a loading indicator,
 * and handles form submission with validation.
 *
 * @component
 */
function Register() {
  // Refs for form fields
  const usernameRef = useRef();
  const passwordRef = useRef();
  const conPasswordRef = useRef();

  // React Router hook to navigate programmatically
  const navigate = useNavigate();

  // State hooks for form data and UI status
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Checks if the user is already logged in and navigates to the home page if so.
   * Sets loading state while checking.
   */
  async function checkLoggedIn() {
    setIsLoading(true);
    try {
      let res = await client.get("api/users/current-user", {
        withCredentials: true,
      });
      navigate("/home");
    } catch (error) {
      // Handle errors silently for now
    }
    setIsLoading(false);
  }

  /**
   * Handles form submission for user registration.
   * Validates form inputs, checks if passwords match, and submits the data.
   * Displays appropriate error messages and updates submission state.
   *
   * @param {React.FormEvent} e - The form submit event.
   */
  async function handleSubmit(e) {
    e.preventDefault();

    // Validate form fields
    if (username === "") {
      usernameRef.current.focus();
      setErrorMessage("All fields must be filled");
      return;
    }
    if (password === "") {
      passwordRef.current.focus();
      setErrorMessage("All fields must be filled");
      return;
    }
    if (confirmPassword === "") {
      conPasswordRef.current.focus();
      setErrorMessage("All fields must be filled");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Password confirmation does not match");
      return;
    }

    try {
      setIsSubmitting(true);
      await client.post(
        "/api/users/register",
        { username, password },
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      // Handle errors and set error message
      let errorObject = handleError(error, navigate);
      setErrorMessage(errorObject.message);
      setIsSubmitting(false);
    }
  }

  // Check if the user is logged in on component mount
  useEffect(() => {
    checkLoggedIn();
  }, []);

  // Clear error messages when input fields change
  useEffect(() => {
    setErrorMessage(null);
  }, [username, password, confirmPassword]);

  // Display loading indicator if the checkLoggedIn request is in progress
  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <div className="flex justify-center h-screen items-center text-[#f8f8f8]">
      <div className="w-1/2 bg-[#00A884] rounded-lg py-8 px-4">
        <form onSubmit={handleSubmit}>
          <div className="text-2xl mb-4 font-semibold w-full text-center text-[#f8f8f8]">
            APP-A-KABAR
          </div>
          <FloatingInput
            id={"username"}
            type={"text"}
            refHook={usernameRef}
            onChange={(e) => setUsername(e.target.value)}
          >
            Username
          </FloatingInput>
          <FloatingInput
            id={"password"}
            type={"password"}
            refHook={passwordRef}
            onChange={(e) => setPassword(e.target.value)}
          >
            Password
          </FloatingInput>
          <FloatingInput
            id={"confirm_password"}
            type={"password"}
            refHook={conPasswordRef}
            onChange={(e) => setConfirmPassword(e.target.value)}
          >
            Confirm Password
          </FloatingInput>
          {errorMessage !== null && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <div className="mb-2 text-xs flex gap-1">
            <div>Already have an account? </div>
            <div className="text-blue-700 hover:underline">
              <Link to={"/login"}>Sign In</Link>
            </div>
          </div>
          <Button type={"submit"} disabled={isSubmitting}>
            <div>Sign Up</div>
            {isSubmitting && (
              <svg
                aria-hidden="true"
                className="w-[1em] h-[1em] text-gray-200 animate-spin fill-[#f8f8f8]"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Register;
