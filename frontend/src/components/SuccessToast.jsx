import React from "react";

/**
 * SuccessToast Component
 *
 * The `SuccessToast` component provides a success notification that appears as a toast message. This component is used to inform the user about a successful action, such as form submission, data saving, or any other task that completes successfully.
 *
 * Structure:
 * - The component is structured with an icon indicating success, a text message, and a close button that allows the user to dismiss the toast.
 * - The toast is positioned fixed at the bottom-left corner of the screen, making it unobtrusive but noticeable.
 * 
 * Props:
 * - `children`: The content of the toast, typically a success message, passed as children to the component.
 * 
 * Styling:
 * - **Container**: The toast container is styled using Tailwind CSS classes, giving it a modern look with a white background (`bg-white`) and rounded corners (`rounded-lg`).
 * - **Icon**: A green checkmark icon is used to signify success, styled with a green background (`bg-green-100`) and green text (`text-green-500`).
 * - **Message**: The message text is styled to be normal font weight (`font-normal`) and small size (`text-sm`).
 * - **Close Button**: The close button is styled to blend in with the background, becoming more prominent on hover. It is positioned to the right of the toast, allowing easy dismissal.
 * 
 * Accessibility:
 * - The toast includes appropriate `role="alert"` and `aria-label` attributes to ensure it is accessible and recognizable by screen readers.
 * 
 * Usage:
 * - The `SuccessToast` component is typically used to provide feedback to the user after a successful operation. It can be conditionally rendered in a parent component when an operation completes successfully.
 * 
 * Example Usage:
 * 
 * ```jsx
 * function MyComponent() {
 *   const [showToast, setShowToast] = React.useState(false);
 * 
 *   const handleSubmit = () => {
 *     // Perform some action
 *     setShowToast(true);
 *     setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={handleSubmit}>Submit</button>
 *       {showToast && (
 *         <SuccessToast>Operation was successful!</SuccessToast>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 * 
 * In this example, the `SuccessToast` is displayed after the user performs an action. The toast automatically disappears after 3 seconds.
 */

function SuccessToast({ children }) {
  return (
    <div
      id="toast-success"
      className="flex items-center fixed left-5 bottom-5 w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
      </div>
      <div className="ms-3 text-sm font-normal">{children}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target="#toast-success"
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
}

export default SuccessToast;
