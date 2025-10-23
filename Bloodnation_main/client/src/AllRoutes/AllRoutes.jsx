import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Components/Pages/Home'
import About from '../Components/Pages/About';
import Login from '../Components/Pages/Login';
import Register from '../Components/Pages/Register';
import Availability from '../Components/Pages/Availability';
import Profile from '../Components/Pages/Profile';
import AdminLogin from '../admin/AdminLogin';
import AdminPanel from '../admin/AdminPanel';
import Users from '../admin/Users';
import BloodBanks from '../admin/BloodBanks';
import AdminAvailability from '../admin/AdminAvailability';
import BloodBankLogin from '../Components/Pages/BloodBankLogin';
import AddBank from '../admin/AddBank';
import BloodBankProfile from '../Components/Pages/BloodBankProfile';
import BankAvailability from '../Components/Pages/BankAvailability';

function AllRoutes() {
  return (
    <>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />


            <Route path='/bloodAvailability' element={<Availability />} />
            <Route path='/bloodBankLogin' element={<BloodBankLogin />} />
            <Route path='/bloodBankProfile' element={<BloodBankProfile />} />
            <Route path='/bankAvailability' element={<BankAvailability />} />

            
            <Route path='/profile' element={<Profile />} />
            <Route path='/admin' element={<AdminLogin />} />
            <Route path='/panel' element={<AdminPanel />} />
            <Route path='/panel/users' element={<Users />} />
            <Route path='/panel/bloodbanks' element={<BloodBanks />} />
            <Route path='/panel/stock' element={<AdminAvailability />} />
            <Route path='/panel/addBank' element={<AddBank />} />
        </Routes>
    </>
  );
}

export default AllRoutes
