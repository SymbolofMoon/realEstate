import axios from "axios";

const apiRequest = axios.create({
    baseURL: "https://realestate-1-w8z2.onrender.com/api",//"http://localhost:8080/api",
    withCredentials: true,
})

export default apiRequest;
