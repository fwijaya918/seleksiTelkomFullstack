import React from "react";
import { Link } from "react-router-dom";
import Button from "./components/Button";
/**
 * NotFound component displays a 404 error page.
 * This page is shown when the user navigates to a non-existent route.
 * It includes a message indicating the page was not found and a button to navigate back to the home page.
 * 
 * 
 */
function NotFound() {
  return (
    <div className="grid place-items-center bg-[#00A884] h-screen text-[#f8f8f8] select-none">
      <div>
        <div className="text-7xl font-bold">{": ("} </div>
        <br />
        <div>404 Not Found</div>
        <br />
        <Link to="/home" replace={true}>
          <Button disabled={false} type={"button"}>
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
