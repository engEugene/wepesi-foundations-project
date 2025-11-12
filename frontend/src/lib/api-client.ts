import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true, // for httpOnly cookies
});

export default API;