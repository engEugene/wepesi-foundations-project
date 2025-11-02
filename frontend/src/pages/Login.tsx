import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import API from "../lib/api-client";
import useAuthStore from "../lib/auth-store";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser} = useAuthStore();

  const { user, isAuthenticated } = useAuthStore()



  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try{
        setLoading(true);
        setError(null);
        const response = await API.post("api/auth/login/", { username, password });
        console.log(response);
        
        if(response.status === 200){
            const data = await API.get("api/user/");
            setUser(data.data);
            navigate(user?.role === "volunteer" ? "/volunteer/dashboard" : "/organization/dashboard");
        }
    }
    catch(err){
        setError(err.response?.data.detail || "Invalid credentials");
    }
    finally{
        setLoading(false);
    }
  }

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
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
