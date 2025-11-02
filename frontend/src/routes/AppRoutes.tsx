import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Opportunities from "../pages/Opportunities";
import Profile from "../pages/Profile";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import VolunteerDashboard from "../pages/VolunteerDashboard";
import OrganizationDashboard from "../pages/OrganizationDashboard";

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
  const { user, isAuthenticated } = {
    user: { role: "organization" },
    isAuthenticated: true,    
  };

  if (!user || !isAuthenticated) {
    return <Navigate to="/login" replace />;
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
    <Route path="/opportunities" element={<Opportunities />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/contact" element={<Contact />} />
    <Route
      path="/login"
      element={
        <PublicRoutes>
          <Login />
        </PublicRoutes>
      }
    />
    <Route
      path="/signup"
      element={
        <PublicRoutes>
          <Signup />
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
