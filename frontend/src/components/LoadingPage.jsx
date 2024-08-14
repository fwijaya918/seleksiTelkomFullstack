import React from "react";

/**
 * LoadingPage Component
 *
 * The `LoadingPage` component provides a full-screen loading indicator, typically used during asynchronous operations where content is being loaded, such as fetching data or waiting for a process to complete. This component centers a spinner in the middle of the screen and can be used as a placeholder while loading content.
 *
 * Structure:
 * - The spinner is rendered inside a `div` element with an SVG representing the loading animation. The SVG is styled to spin indefinitely, indicating a loading process.
 * 
 * Styling:
 * - The component uses Tailwind CSS classes to style the page and the spinner. The spinner is centered both vertically and horizontally using a CSS grid layout.
 * - The spinner has a default size of 12x12 (`w-12 h-12`), and it is animated with the `animate-spin` class to provide a rotating effect.
 * - The spinner color is blue, with gray as the background color of the spinning circle.
 * 
 * Usage:
 * - The `LoadingPage` component is typically used in scenarios where the user needs to wait for data to load or an operation to complete.
 * - It can be rendered conditionally, for instance, based on a loading state in a parent component.
 * 
 * Example Usage:
 * 
 * ```jsx
 * function MyComponent() {
 *   const [loading, setLoading] = React.useState(true);
 *   
 *   React.useEffect(() => {
 *     fetchData().then(() => setLoading(false));
 *   }, []);
 *   
 *   if (loading) {
 *     return <LoadingPage />;
 *   }
 * 
 *   return <div>Data has loaded!</div>;
 * }
 * ```
 * 
 * In this example, `LoadingPage` is shown while `fetchData()` is in progress. Once the data has been fetched, the loading spinner disappears and the main content is displayed.
 */
function LoadingPage() {
  return (
    <div className="grid place-items-center h-screen text-[#f8f8f8] select-none">
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    </div>
  );
}

export default LoadingPage;
