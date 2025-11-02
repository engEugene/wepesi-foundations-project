import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
//import logo from "/src/images/placeholder.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/opportunities", label: "Opportunities" },
    { path: "/badges", label: "Badges" },
    // { path: "/profile", label: "Profile" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-white shadow-md h-16 flex  sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          {/* <img src={logo} alt="Volunteer Logo" className="w-8 h-8" /> */}
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
        <button onClick={() => navigate("/signup")} className="bg-green-600 text-white py-3 px-3 rounded-lg hover:bg-green-700 transition">
          GET STARTED
        </button>

        {/* <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() =>
            alert("!!!Mobile menu can be added later if needed!!!!")
          }
        >
          ☰
        </button> */}
      </div>
    </nav>
  );
};

export default Navbar;
