import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Opportunities from "./pages/Opportunities";
import EventDetails from "./pages/EventDetails";
import Profile from "./pages/Profile";  // ← ADDED

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Opportunities />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/profile" element={<Profile />} />  {/* ← ADDED */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;