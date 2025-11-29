import React from 'react'
import { NavLink, Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className='flex h-[11vh] bg-primary text-on-primary justify-between items-center text-xl shadow-sm sticky top-0 px-10 z-50 slide-down'>
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
              isActive ? "underline font-semibold text-on-primary" : "text-on-primary"
            }`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/bloodAvailability"
            className={({ isActive }) =>
            `p-1 hover:underline transition duration-150 ${
              isActive ? "underline font-semibold text-on-primary" : "text-on-primary"
            }`
          }
        >
          Blood Availability
        </NavLink>

        <NavLink
          to="/login"
            className={({ isActive }) =>
            `p-1 hover:underline transition duration-150 ${
              isActive ? "underline font-semibold text-on-primary" : "text-on-primary"
            }`
          }
        >
          User Login
        </NavLink>

        <NavLink
          to="/bloodBankLogin"
            className={({ isActive }) =>
            `p-1 hover:underline transition duration-150 ${
              isActive ? "underline font-semibold text-on-primary" : "text-on-primary"
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
