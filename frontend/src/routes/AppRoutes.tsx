import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Opportunities from "../pages/Opportunities";
import Profile from "../pages/Profile";
import Contact from "../pages/Contact";
import OrganizationProfilePage from "../pages/OrganizationProfilePage";
import VolunteerProfilePage from "../pages/VolunteerProfilePage";
import OrganizationOnboardingPage from "../pages/OrganizationOnboardingPage";
import EventCreationPage from "../pages/EventCreationPage";
import EventDetails from "../pages/EventDetails";
import VolunteerDashboard from "../pages/VolunteerDashboard";
import OrganizationDashboard from "../pages/OrganizationDashboard";
import useAuthStore from "../lib/auth-store";
import Auth from "../pages/Auth";
import ManageVolunteers from "../pages/ManageVolunteers";

function PublicRoutes({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, isAuthenticated } = useAuthStore();

  if (!user || !isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "volunteer":
        return <Navigate to="/volunteer/dashboard" replace />;
      case "organization":
        if (!user.is_org_onboarded) {
          return <Navigate to="/organization/onboard" replace />;
        } else {
          return <Navigate to="/organization/dashboard" replace />;
        }
      default:
        return <Navigate to="/" replace />;
    }
  }

  if (
    user.role === "organization" &&
    !user.is_org_onboarded &&
    window.location.pathname !== "/organization/onboard"
  ) {
    return <Navigate to="/organization/onboard" replace />;
  }

  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PublicRoutes>
          <Home />
        </PublicRoutes>
      }
    />
    <Route
  path="/organization/manage-volunteers"
  element={
      <ProtectedRoute allowedRoles={["organization"]}>
        <ManageVolunteers />
      </ProtectedRoute>
      }
/>

    <Route path="/opportunities" element={<Opportunities />} />
    <Route path="/event/:id" element={<EventDetails />} />
    <Route path="/organizations/:id" element={<OrganizationProfilePage />} />
    <Route path="/volunteers/:id" element={<VolunteerProfilePage />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/contact" element={<Contact />} />

    <Route path="/organization/create-event" element={<EventCreationPage />} />
    <Route
      path="/signup"
      element={
        <PublicRoutes>
          <Auth />
        </PublicRoutes>
      }
    />
    <Route
      path="/volunteer/dashboard"
      element={
        <ProtectedRoute allowedRoles={["volunteer"]}>
          <VolunteerDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/organization/dashboard"
      element={
        <ProtectedRoute allowedRoles={["organization"]}>
          <OrganizationDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/organization/onboard"
      element={
        <ProtectedRoute allowedRoles={["organization"]}>
          <OrganizationOnboardingPage />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
