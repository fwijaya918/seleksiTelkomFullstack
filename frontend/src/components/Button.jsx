import React from "react";

function Button({ type, children, disabled }) {
  return (
    <button
      disabled={disabled}
      type={type}
      className="w-full items-center bg-[#202C33] flex justify-center gap-3 hover:bg-[#182229] text-[#f8f8f8] rounded py-2"
    >
      {children}
    </button>
  );
}

export default Button;
