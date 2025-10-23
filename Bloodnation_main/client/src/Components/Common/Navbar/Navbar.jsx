import React from 'react'
import { NavLink, Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className='flex h-[11vh] bg-red-300 justify-between items-center text-xl shadow-sm border-b-4 border-green-400 sticky top-0 px-10 z-50'>
      {/* Brand */}
      <div className='text-xl font-medium'>
        <Link to="/">Blood Nation</Link>
      </div>

      {/* Navigation Links */}
      <div className='flex items-center gap-8 relative font-medium text-xl'>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `p-1 hover:underline transition duration-150 ${
              isActive ? "underline font-semibold text-black" : "text-black"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/bloodAvailability"
          className={({ isActive }) =>
            `p-1 hover:underline transition duration-150 ${
              isActive ? "underline font-semibold text-black" : "text-black"
            }`
          }
        >
          Blood Availability
        </NavLink>

        <NavLink
          to="/login"
          className={({ isActive }) =>
            `p-1 hover:underline transition duration-150 ${
              isActive ? "underline font-semibold text-black" : "text-black"
            }`
          }
        >
          User Login
        </NavLink>

        <NavLink
          to="/bloodBankLogin"
          className={({ isActive }) =>
            `p-1 hover:underline transition duration-150 ${
              isActive ? "underline font-semibold text-black" : "text-black"
            }`
          }
        >
          Blood Bank Login
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
