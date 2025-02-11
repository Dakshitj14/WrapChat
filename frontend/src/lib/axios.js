import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api", // Change according to your backend
    withCredentials: true, // If using authentication tokens or sessions
});
