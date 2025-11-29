import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("admin");
    try { localStorage.removeItem("bankToken"); } catch (e) {}
    navigate("/");
  };

  return (
    <>
      <div
        className={`${isOpen ? "w-64" : "w-0"} sidebar-bg text-white transition-all duration-300 h-full relative`}
      >
        <div className="p-4 text-xl font-bold border-b border-white/10">
          Admin Panel
        </div>
        <nav className="flex flex-col gap-4 p-4">
          <NavLink
            to="/panel/users"
            className={({ isActive }) =>
              `${isActive ? "bg-white/10" : ""} hover:bg-white/10 p-2 rounded`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/panel/bloodbanks"
            className={({ isActive }) =>
              `${isActive ? "bg-white/10" : ""} hover:bg-white/10 p-2 rounded`
            }
          >
            Blood Banks
          </NavLink>
          <NavLink
            to="/panel/stock"
            className={({ isActive }) =>
              `${isActive ? "bg-white/10" : ""} hover:bg-white/10 p-2 rounded`
            }
          >
            Availability Data
          </NavLink>
          <NavLink
            to="/panel/addBank"
            className={({ isActive }) =>
              `${isActive ? "bg-white/10" : ""} hover:bg-white/10 p-2 rounded`
            }
          >
            Add Blood Bank
          </NavLink>
        </nav>
        {/* Universal logout button fixed at bottom-left of the sidebar */}
        <div className="absolute left-4 bottom-4">
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md btn-primary btn-animate text-on-primary"
            title="Logout and return to home"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
