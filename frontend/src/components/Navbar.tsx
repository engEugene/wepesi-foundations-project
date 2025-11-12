import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../lib/auth-store";
import API from "../lib/api-client";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, clearUser} = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/opportunities", label: "Opportunities" },
    { path: "/badges", label: "Badges" },
    { path: "/contact", label: "Contact" },
  ];

  const handleLogout = async () => {
    const res = await API.post("/auth/logout",{});
    if (res.status === 200) {
      clearUser();
      navigate("/signup");
    } else if (res.status === 401) {
      console.error("Failed to logout");
    }
  };

  return (
    <nav className="bg-white shadow-md h-16 flex sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold text-green-700">
            VolunteerConnect
          </span>
        </Link>

        <ul className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `text-gray-700 hover:text-green-600 transition ${
                    isActive ? "font-semibold text-green-700" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-600 focus:outline-none"
            >
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 border border-gray-100">
                <button
                  onClick={() => navigate("/profile")}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/signup")}
            className="bg-green-600 text-white py-3 px-3 rounded-lg hover:bg-green-700 transition"
          >
            GET STARTED
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
