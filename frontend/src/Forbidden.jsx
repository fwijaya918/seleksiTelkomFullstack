//Component for 403 Forbidden page
import React from "react";
import { Link } from "react-router-dom";
import Button from "./components/Button";

function Forbidden() {
  return (
    <div className="grid place-items-center bg-[#00A884] h-screen text-[#f8f8f8] select-none">
      <div>
        <div className="text-7xl font-bold">{": ("} </div>
        <br />
        <div>403 Forbidden</div>
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

export default Forbidden;
