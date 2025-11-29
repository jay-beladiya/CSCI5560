import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../Components/Pages/Home";
import Home1 from "../Components/Pages/Home1";
import Home2 from "../Components/Pages/home2";
import About from "../Components/Pages/About";
import Login from "../Components/Pages/Login";
import Login1 from "../Components/Pages/Login1";
import Register from "../Components/Pages/Register";
import Register1 from "../Components/Pages/register1";
import Availability from "../Components/Pages/Availability";
import Profile from "../Components/Pages/Profile";
import BloodBankLogin from "../Components/Pages/BloodBankLogin";
import BloodBankProfile from "../Components/Pages/BloodBankProfile";
import BankAvailability from "../Components/Pages/BankAvailability";

import AdminLogin from "../admin/AdminLogin";
import AdminPanel from "../admin/AdminPanel";
import Users from "../admin/Users";
import BloodBanks from "../admin/BloodBanks";
import AdminAvailability from "../admin/AdminAvailability";
import AddBank from "../admin/AddBank";
import CreateAdmin from "../admin/CreateAdmin";

function AllRoutes() {
  return (
    <>
      <Routes>
        {/* User-facing routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login1" element={<Login1 />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register1" element={<Register1 />} />
        <Route path="/home1" element={<Home1 />} />
        <Route path="/home2" element={<Home2 />} />

        {/* Blood bank and profile routes */}
        <Route path="/bloodAvailability" element={<Availability />} />
        <Route path="/bloodBankLogin" element={<BloodBankLogin />} />
        <Route path="/bloodBankProfile" element={<BloodBankProfile />} />
        <Route path="/bankAvailability" element={<BankAvailability />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/panel" element={<AdminPanel />} />
        <Route path="/panel/users" element={<Users />} />
        <Route path="/panel/bloodbanks" element={<BloodBanks />} />
        <Route path="/panel/stock" element={<AdminAvailability />} />
        <Route path="/panel/addBank" element={<AddBank />} />
        <Route path="/admin/create" element={<CreateAdmin />} />
      </Routes>
    </>
  );
}

export default AllRoutes;