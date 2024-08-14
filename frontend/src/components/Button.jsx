import React from "react";

/**
 * Button Component
 * 
 * This is a reusable button component that can be used throughout the application. 
 * It accepts props to customize its behavior and appearance.
 * 
 * Props:
 * - `type` (string): Specifies the button's type, such as "button", "submit", or "reset". 
 *   This is passed directly to the HTML `button` element's `type` attribute.
 * 
 * - `children` (ReactNode): The content or elements that will be displayed inside the button. 
 *   This allows you to pass in text, icons, or any other elements to be rendered inside the button.
 * 
 * - `disabled` (boolean): A boolean value that determines whether the button is disabled. 
 *   When `true`, the button is disabled and unclickable.
 * 
 * Styling:
 * - The button is styled with Tailwind CSS classes:
 *   - `w-full`: The button takes up the full width of its container.
 *   - `items-center`: Aligns items in the center vertically.
 *   - `bg-[#202C33]`: Sets the button's background color to a dark shade.
 *   - `flex`: Makes the button a flex container.
 *   - `justify-center`: Centers the children horizontally.
 *   - `gap-3`: Adds a gap between any child elements.
 *   - `hover:bg-[#182229]`: Changes the background color on hover.
 *   - `text-[#f8f8f8]`: Sets the text color to a light shade.
 *   - `rounded`: Rounds the corners of the button.
 *   - `py-2`: Adds vertical padding inside the button.
 * 
 * Example Usage:
 * 
 * ```jsx
 * <Button type="submit" disabled={false}>
 *   Submit
 * </Button>
 * ```
 * 
 * In this example, the `Button` component is used as a submit button with the text "Submit" inside it.
 */

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
