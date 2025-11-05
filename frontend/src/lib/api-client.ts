import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:5000",
  withCredentials: true, // for httpOnly cookies
});

export default API;