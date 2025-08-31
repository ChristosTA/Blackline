// frontend/src/lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "/api",          // dev: περνάει από Vite proxy, prod: ίδιο origin
	withCredentials: true,    // για httpOnly cookies (access/refresh)
});

export default axiosInstance;
export { axiosInstance };
