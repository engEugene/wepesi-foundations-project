import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Opportunities from "../pages/Opportunities";
import Profile from "../pages/Profile";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import OrganizationProfilePage from "../pages/OrganizationProfilePage";
import VolunteerProfilePage from "../pages/VolunteerProfilePage";
import OrganizationOnboardingForm from "./components/OrganizationOnboardingForm";
import EventCreationForm from "./components/EventCreationForm";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/opportunities" element={<Opportunities />} />
    <Route path="/organizations/:id" element={<OrganizationProfilePage />} />
    <Route path="/volunteers/:id" element={<VolunteerProfilePage />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/onboard" element={<OrganizationOnboardingForm />} />
    <Route path="/create-event" element={<EventCreationForm />} />
  </Routes>
);

export default AppRoutes;
