import axios from "axios";

// Create an Axios instance with a predefined base URL
const client = axios.create({
  baseURL: "http://localhost:3000", // Base URL for API requests
});

// Export the Axios instance to use in other parts of the application
export default client;
