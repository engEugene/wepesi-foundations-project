import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Opportunities from "../pages/Opportunities";
import Profile from "../pages/Profile";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Signup from "../pages/Signup";


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/opportunities" element={<Opportunities />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
  </Routes>
);

export default AppRoutes;
