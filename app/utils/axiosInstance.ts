import axios from "axios";

// Create and configure Axios instance
const axiosInstance = axios.create({
  timeout: 20000, // Set a timeout (20 seconds)
  withCredentials: true, // Send cookies with requests
  headers: {
    "Content-Type": "application/json", // Default content type
    Accept: "application/json", // Accept JSON responses
  },
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 8080}`, // Fallback to localhost with default port
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Process and return successful responses
    return response;
  },
  (error) => {
    // Handle response errors globally
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error("Response error:", error.response.data);
    } else if (error.request) {
      // No response received from the server
      console.error("No response from server:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;