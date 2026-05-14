import axios from "axios";

const API = axios.create({
  baseURL: "https://rentspace-backend-z14a.onrender.com",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;