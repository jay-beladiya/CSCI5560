import React, { useEffect, useState } from 'react'
import Navbar from '../Common/Navbar/Navbar'
import LoggedNavbar from '../Common/Navbar/LoggedNavbar'
import { Link } from 'react-router-dom'
import LoggedBankNavbar from '../Common/Navbar/LoggedBankNavbar';
function Home() {   
  
  const [navComponent, setNavComponent] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {

      const token = localStorage.getItem("token");
      const bankToken = localStorage.getItem("bankToken");
      if (token) {
        setNavComponent(<LoggedNavbar />)
        try {
          const response = await fetch('http://localhost:3000/api/fetch/user', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });

          const data = await response.json();

          if (data) {
            setNavComponent(<LoggedNavbar />)
            sessionStorage.setItem("user", true);
          } else {
            localStorage.removeItem("token");
            sessionStorage.removeItem("user");
            setNavComponent(<Navbar />)
          }

        } catch (error) {
          console.log("Fetching /api/verify/user Error: ", error);
          setNavComponent(<Navbar />)
        }
      } else if (bankToken) {
        setNavComponent(<LoggedBankNavbar />);
        try {
          const response = await fetch('http://localhost:3000/api/verify/bloodbank', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${bankToken}`
            }
          });
          
          const data = await response.json();

          if (data) {
            setNavComponent(<LoggedBankNavbar />);
            sessionStorage.setItem("bank", true);
          } else {
            localStorage.removeItem("bankToken");
            sessionStorage.removeItem("bank");
            setNavComponent(<Navbar />)
          }
        } catch (error) {
          console.log("Fetching /api/verify/bloodbank Error: ", error);
          setNavComponent(<Navbar />)
        }
      } else {
        localStorage.clear();
        sessionStorage.clear();
        setNavComponent(<Navbar />)
      } 
    }
    fetchUser();
    }, []);

  return (
    <>
        {navComponent}
        <section className=' h-[89vh] flex justify-center items-center bg-red-50'>
            <div className='w-2/3 h-2/4 flex flex-col justify-center items-center'>
                <h1 className=' text-center mb-10 text-4xl font-bold'>Welcome to Blood Nation!</h1>
                <p className=' text-center text-lg'>Blood Nation is a nationwide platform for those who need assistance related to Blood donation or for the ones who needs Blood.
                We are here to connect Donors and Recipient.</p>
                <div className=' flex justify-center items-center mt-10 w-24 h-14 shadow-lg bg-green-400 rounded-2xl hover:shadow-2xl hover:cursor-pointer'><Link to="/about">About Us</Link></div>
            </div>
        </section>
    </>
  )
}

export default Home