import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Opportunities from "../pages/Opportunities";
import Profile from "../pages/Profile";
import Contact from "../pages/Contact";
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
  const { user, isAuthenticated } = useAuthStore()

  if (!user || !isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "volunteer":
        return <Navigate to="/volunteer/dashboard" replace />;
      case "organization":
        return <Navigate to="/organization/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
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
    <Route path="/profile" element={<Profile />} />
    <Route path="/contact" element={<Contact />} />
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
  </Routes>
);

export default AppRoutes;
