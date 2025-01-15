import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
});

export default axiosInstance;
