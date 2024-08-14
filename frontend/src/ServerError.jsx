import React from "react";

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
