import React from "react";
/**
 * ServerError component displays an error message when the server encounters an issue.
 * This component is shown to the user when a server error occurs, informing them to try again later.
 * 
 
 */
function ServerError() {
  return (
    <div className="grid place-items-center bg-[#00A884] h-screen text-[#f8f8f8] select-none">
      <div>
        <div className="text-7xl font-bold">{": ("} </div>
        <br />
        <div>We're experiencing server error. Come back later...</div>
      </div>
    </div>
  );
}

export default ServerError;
