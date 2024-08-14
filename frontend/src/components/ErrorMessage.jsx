import React from "react";

/**
 * ErrorMessage Component
 * 
 * This component is used to display error messages in your application. 
 * It accepts `children` as a prop, which will be the content of the error message.
 * 
 * Props:
 * - `children` (ReactNode): The content of the error message. This can be text or any other 
 *   elements that you want to display as an error message.
 * 
 * Styling:
 * - The paragraph (`<p>`) element is styled with the following Tailwind CSS classes:
 *   - `text-red-600`: Sets the text color to a medium red, indicating an error.
 *   - `font-bold`: Makes the text bold to ensure it stands out.
 *   - `mb-2`: Adds a margin at the bottom to provide spacing between this and subsequent elements.
 *   - `text-xs`: Sets the font size to extra small, suitable for error messages below form fields or inputs.
 * 
 * Example Usage:
 * 
 * ```jsx
 * <ErrorMessage>
 *   Username is required.
 * </ErrorMessage>
 * ```
 * 
 * In this example, the `ErrorMessage` component is used to display an error message indicating that the username is required.
 */

function ErrorMessage({ children }) {
  return <p className="text-red-600 font-bold mb-2 text-xs">{children}</p>;
}

export default ErrorMessage;
