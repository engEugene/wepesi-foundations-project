import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, isAuthenticated } = {
    user: { role: "organization" },
    isAuthenticated: true,    
  };



  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    // Connect to backend API here
  };

  return user && isAuthenticated && user.role === "volunteer" 
  ? <Navigate to="/volunteer/dashboard" replace />
  : user && isAuthenticated && user.role === "organization"
  ? <Navigate to="/organization/dashboard" replace />
  : (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
