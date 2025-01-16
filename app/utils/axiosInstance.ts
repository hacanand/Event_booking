// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
// });

// export default axiosInstance;


import axios from "axios";

// Create and configure Axios instance
const axiosInstance = axios.create({
  timeout: 10000, // Set a timeout (10 seconds)
  withCredentials: true, // Send cookies with requests
  headers: {
    "Content-Type": "application/json", // Default content type
    Accept: "application/json", // Accept JSON responses
  },
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 8080}`, // Fallback to localhost with default port
  // baseURL: `http://localhost:${process.env.PORT || 8080}`,
});

// Add a request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // You can attach an authentication token to each request
//     const token = localStorage.getItem("authToken"); // Or any other method to get the token
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     // Handle request errors
//     console.error("Request error:", error);
//     return Promise.reject(error);
//   }
// );

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
