import React from "react";

function FloatingInput({
  type,
  children,
  id,
  onChange,
  refHook,
  defaultValue = "",
}) {
  return (
    <>
      <div className="relative border rounded mb-2 text-[#f8f8f8]">
        <input
          type={type}
          id={id}
          className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          autoComplete="true"
          defaultValue={defaultValue}
          onChange={onChange}
          ref={refHook}
        />
        <label
          htmlFor={id}
          className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:bg-[#00A884] bg-[#00A884] peer-focus:text-[#f8f8f8] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
        >
          {children}
        </label>
      </div>
    </>
  );
}

export default FloatingInput;
