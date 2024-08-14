import React from "react";

/**
 * FloatingInput Component
 * 
 * A reusable input field component with a floating label. The label animates and "floats" above the input field when the user interacts with it, providing a modern and clean UI experience. This component is highly customizable through props.
 * 
 * Props:
 * - `type` (string): Specifies the input type, such as "text", "password", "email", etc.
 * - `children` (ReactNode): The content for the label, typically a string that describes the input field (e.g., "Username", "Email").
 * - `id` (string): The unique identifier for the input field and the associated label. This is necessary for linking the input and label.
 * - `onChange` (function): A callback function that is triggered whenever the input value changes. It accepts the event object as an argument.
 * - `refHook` (React.RefObject): A ref passed to the input element for direct DOM manipulation or for integration with libraries like `React Hook Form`.
 * - `defaultValue` (string) (optional): The initial value of the input field. Default is an empty string.
 * 
 * Styling:
 * - The component uses Tailwind CSS classes to style both the input and label. The input field is designed with a border and padding for a clean look, and it transitions smoothly when focused. 
 * - The label animates its position and size when the input is focused or when it contains a value, providing a "floating" effect.
 * 
 * Example Usage:
 * 
 * ```jsx
 * <FloatingInput
 *   type="text"
 *   id="username"
 *   onChange={(e) => setUsername(e.target.value)}
 *   refHook={usernameRef}
 *   defaultValue="JohnDoe"
 * >
 *   Username
 * </FloatingInput>
 * ```
 * 
 * In this example, the `FloatingInput` component is used to create a text input field with a floating label that says "Username". The `onChange` handler updates the state with the input value, and the `refHook` allows direct interaction with the input element.
 */

function FloatingInput({
  type,
  children,
  id,
  onChange,
  refHook,
  defaultValue = "",
}) {
  return (
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
        className="absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:bg-[#00A884] bg-[#00A884] peer-focus:text-[#f8f8f8] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
      >
        {children}
      </label>
    </div>
  );
}

export default FloatingInput;
