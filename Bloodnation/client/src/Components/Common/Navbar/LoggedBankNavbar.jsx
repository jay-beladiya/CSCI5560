import React, { useState, useRef, useEffect, use } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { UserCircle, LogOut } from "lucide-react"; // or use emoji/icon as fallback

function LoggedBankNavbar() {
  const navigate = useNavigate();
  const [profileDivStatus, setProfileDivStatus] = useState(false);
  const dropdownRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("bankToken");
    sessionStorage.removeItem("bank");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDivStatus(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex h-[11vh] bg-primary text-on-primary justify-between items-center text-xl shadow-sm sticky top-0 px-10 z-50 slide-down">
      <div className="text-xl font-medium">
        <Link to="/">Blood Nation</Link>
      </div>

      <div className="flex items-center gap-8 relative font-medium text-xl">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `p-1 ${isActive ? "underline" : "hover:underline"}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/bankAvailability"
          className={({ isActive }) =>
            `p-1 ${isActive ? "underline" : "hover:underline"}`
          }
        >
          Blood Availability Details
        </NavLink>

        <button
          onClick={() => setProfileDivStatus((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-1 rounded-full hover-bg-primary-100 cursor-pointer transition duration-200"
        >
          <UserCircle className="w-6 h-6 text-black" />
          <span className=" text-xl font-medium">Blood Bank</span>
        </button>

        {/* Dropdown menu starts here */}
        <div
          ref={dropdownRef}
          className={`absolute top-16 right-0 w-52 bg-white rounded-lg shadow-lg text-base z-50 transition-all duration-150 ease-out transform ${
            profileDivStatus
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="py-2">
            <Link
              to="/bloodBankProfile"
              onClick={() => setProfileDivStatus(false)}
              className="block px-4 py-2 hover-bg-primary-100 text-gray-800 transition-colors"
            >
              View Profile
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 w-full text-left text-primary hover-bg-primary-100 hover:cursor-pointer font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default LoggedBankNavbar;
