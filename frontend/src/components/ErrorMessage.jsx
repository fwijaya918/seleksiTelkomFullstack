import React from "react";

function ErrorMessage({ children }) {
  return <p className="text-red-600 font-bold mb-2 text-xs">{children}</p>;
}

export default ErrorMessage;
