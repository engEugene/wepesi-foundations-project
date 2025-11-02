import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"student" | "organisation">("student");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPassword, setOrgPassword] = useState("");

  const { user, isAuthenticated } = {
    user: { role: "organization" },
    isAuthenticated: true,    
  };


  const handleStudentSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Student Signup:", { studentEmail, studentPassword });
  };

  const handleOrgSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Organisation Signup:", { orgEmail, orgPassword });
  };

  return user && isAuthenticated && user.role === "volunteer" 
  ? <Navigate to="/volunteer/dashboard" replace />
  : user && isAuthenticated && user.role === "organization"
  ? <Navigate to="/organization/dashboard" replace />
  : (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab("student")}
            className={`flex-1 py-2 text-center ${
              activeTab === "student" ? "border-b-2 border-green-600 font-semibold" : "text-gray-500"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setActiveTab("organisation")}
            className={`flex-1 py-2 text-center ${
              activeTab === "organisation" ? "border-b-2 border-green-600 font-semibold" : "text-gray-500"
            }`}
          >
            Organisation
          </button>
        </div>

        {activeTab === "student" ? (
          <form onSubmit={handleStudentSignup} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Sign Up as Student
            </button>
          </form>
        ) : (
          <form onSubmit={handleOrgSignup} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Organisation Email"
              value={orgEmail}
              onChange={(e) => setOrgEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={orgPassword}
              onChange={(e) => setOrgPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Sign Up as Organisation
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Signup;
