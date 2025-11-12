import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "../lib/auth-store";
import API from "../lib/api-client";

const Auth: React.FC = () => {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [role, setRole] = useState<"volunteer" | "organization">("volunteer");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, isAuthenticated, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const response = await API.post("/auth/login", { username, password });
      if (response.status === 200) {
        const user = response.data.user;
        setUser(user);
        console.log("Full user object:", user);
        console.log("is_org_onboarded value:", user.is_org_onboarded);
        console.log("Type:", typeof user.is_org_onboarded);

        if (user.role === "volunteer") {
          navigate("/volunteer/dashboard");
        } else if (user.role === "organization") {
          console.log('User is organization');
          console.log('is_org_onboarded:', user.is_org_onboarded);
          
          if (!user.is_org_onboarded) {
            console.log('Navigating to onboarding...');
            navigate("/organization/onboard");
          } else {
            console.log('Navigating to dashboard...');
            navigate("/organization/dashboard");
          }
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      const payload = { name, username, email, phone_number, password, role };

      const response = await API.post("/auth/register", payload);

      if (response.status === 201) {
        alert("Account created successfully. You can now sign in.");
        setName("");
        setUsername("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setRole("volunteer");
        setMode("signin");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (user && isAuthenticated) {
    if (user.role === "volunteer") {
      return <Navigate to="/volunteer/dashboard" replace />;
    } else if (user.role === "organization") {
      return <Navigate to="/organization/dashboard" replace />;
    }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {mode === "signup"
            ? "Join ConnectSphere today"
            : "Sign in to continue"}
        </p>

        {/* Mode Switch */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 text-center transition ${
              mode === "signup"
                ? "border-b-2 border-green-600 font-semibold text-green-600"
                : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => setMode("signin")}
            className={`flex-1 py-2 text-center transition ${
              mode === "signin"
                ? "border-b-2 border-green-600 font-semibold text-green-600"
                : "text-gray-500"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Role switch only for signup */}
        {mode === "signup" && (
          <div className="flex mb-6 -mt-2">
            <button
              onClick={() => setRole("volunteer")}
              className={`flex-1 py-2 text-sm rounded-t-lg transition ${
                role === "volunteer"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Volunteer
            </button>
            <button
              onClick={() => setRole("organization")}
              className={`flex-1 py-2 text-sm rounded-t-lg transition ${
                role === "organization"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Organization
            </button>
          </div>
        )}

        {/* Auth Form */}
        <form
          onSubmit={mode === "signup" ? handleSignup : handleLogin}
          className="flex flex-col gap-4"
        >
          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder={
                  role === "volunteer" ? "Full Name" : "Organization Name"
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </>
          )}

          {mode === "signin" && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          )}

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading
              ? "Please wait..."
              : mode === "signup"
              ? `Sign Up as ${
                  role === "volunteer" ? "Volunteer" : "Organization"
                }`
              : "Sign In"}
          </button>
        </form>

        {/* Bottom Switch */}
        <p className="text-center mt-6 text-sm text-gray-600">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("signin")}
                className="text-green-600 font-semibold hover:underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-green-600 font-semibold hover:underline"
              >
                Create Account
              </button>
            </>
          )}
        </p>
      </div>
    </section>
  );
};

export default Auth;
