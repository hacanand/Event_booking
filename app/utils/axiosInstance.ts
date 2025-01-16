import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://localhost:${process.env.PORT || 8080}`,
});

export default axiosInstance;
