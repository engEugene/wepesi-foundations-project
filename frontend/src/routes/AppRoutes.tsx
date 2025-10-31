import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Opportunities from "../pages/Opportunities";
import Profile from "../pages/Profile";
import Contact from "../pages/Contact";
import VolunteerProfilePage from "../pages/VolunteerProfilePage";
import OrganizationProfilePage from "../pages/OrganizationProfilePage";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/opportunities" element={<Opportunities />} />
    <Route path="/organizations/:id" element={<OrganizationProfilePage />} />
    <Route path="/volunteers/:id" element={<VolunteerProfilePage />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/contact" element={<Contact />} />
  </Routes>
);

export default AppRoutes;
