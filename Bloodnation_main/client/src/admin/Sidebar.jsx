import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <div
        className={`${
          isOpen ? "w-64" : "w-0"
        } bg-blue-900 text-white transition-all duration-300 h-full`}
      >
        <div className="p-4 text-xl font-bold border-b border-blue-700">
          Admin Panel
        </div>
        <nav className="flex flex-col gap-4 p-4">
          <NavLink
            to="/panel/users"
            className={({ isActive }) =>
              `${
                isActive ? "bg-blue-800" : "bg-none"
              } hover:bg-blue-800 p-2 rounded`
            }
          >
            Users
          </NavLink>
          <NavLink
            to="/panel/bloodbanks"
            className={({ isActive }) =>
              `${
                isActive ? "bg-blue-800" : "bg-none"
              } hover:bg-blue-800 p-2 rounded`
            }
          >
            Blood Banks
          </NavLink>
          <NavLink
            to="/panel/stock"
            className={({ isActive }) =>
              `${
                isActive ? "bg-blue-800" : "bg-none"
              } hover:bg-blue-800 p-2 rounded`
            }
          >
            Availability Data
          </NavLink>
          <NavLink
            to="/panel/addBank"
            className={({ isActive }) =>
              `${
                isActive ? "bg-blue-800" : "bg-none"
              } hover:bg-blue-800 p-2 rounded`
            }
          >
            Add Blood Bank
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
