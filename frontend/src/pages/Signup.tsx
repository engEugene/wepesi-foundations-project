import React, { useState } from "react";

const Auth: React.FC = () => {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [role, setRole] = useState<"student" | "organisation">("student");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === "signup") {
      console.log("Signing up:", { name, username, email, phone, role });
    } else {
      console.log("Logging in:", { email, password });
    }

    setTimeout(() => {
      setIsLoading(false);
      alert("Success! Check console.");
    }, 1000);
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {mode === "signup" ? "Join ConnectSphere today" : "Sign in to continue"}
        </p>

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

        {mode === "signup" && (
          <div className="flex mb-6 -mt-2">
            <button
              onClick={() => setRole("student")}
              className={`flex-1 py-2 text-sm rounded-t-lg transition ${
                role === "student" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole("organisation")}
              className={`flex-1 py-2 text-sm rounded-t-lg transition ${
                role === "organisation" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Organisation
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder={role === "student" ? "Full Name" : "Organisation Name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </>
          )}

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
            disabled={isLoading}
            className={`bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading
              ? "Please wait..."
              : mode === "signup"
              ? `Sign Up as ${role === "student" ? "Student" : "Organisation"}`
              : "Sign In"}
          </button>
        </form>

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