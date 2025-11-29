import React, { useState, useEffect } from "react";
import Navbar from "../Common/Navbar/Navbar";
import LoggedNavbar from "../Common/Navbar/LoggedNavbar";
import LoggedBankNavbar from "../Common/Navbar/LoggedBankNavbar";

function About() {
  const [navComponent, setNavComponent] = useState(null);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      const bankToken = localStorage.getItem("bankToken");
      if (token) {
        setNavComponent(<LoggedNavbar />);
        try {
          const response = await fetch(
            "http://localhost:3000/api/verify/user",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (data) {
            setNavComponent(<LoggedNavbar />);
            sessionStorage.setItem("user", true);
          } else {
            setNavComponent(<Navbar />);
          }
        } catch (error) {
          console.log("Fetching /api/verify/user Error: ", error);
          setNavComponent(<Navbar />);
        }
      } else if (bankToken) {
        setNavComponent(<LoggedBankNavbar />);
        try {
          const response = await fetch(
            "http://localhost:3000/api/verify/bloodbank",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${bankToken}`,
              },
            }
          );

          const data = await response.json();

          if (data) {
            setNavComponent(<LoggedBankNavbar />);
            sessionStorage.setItem("bank", true);
          } else {
            localStorage.removeItem("bankToken");
            sessionStorage.removeItem("bank");
            setNavComponent(<Navbar />);
          }
        } catch (error) {
          console.log("Fetching /api/verify/bloodbank Error: ", error);
          setNavComponent(<Navbar />);
        }
      } else {
        setNavComponent(<Navbar />);
      }
    };

    verifyUser();
  }, []);

  return (
    <>
      {navComponent}
  <section className=" flex justify-center h-max bg-app">
        <div className="w-[90vw] mt-16 mb-16 flex flex-col items-center">
          <p className=" font-semibold text-justify text-lg">
            At Blood Nation, we believe in the power of giving and saving lives.
            Our mission is simple yet profound: to connect donors with those in
            need, ensuring a steady and reliable supply of life-saving blood
            products for patients across the nation.
          </p>
          <hr className="mt-8 w-full" />
          <h2 className="w-full font-bold text-3xl mt-8">Who we are?</h2>
          <p className="mt-4 text-lg text-justify">
            Blood Nation is a dedicated team of healthcare professionals,
            volunteers, and donors who are passionate about making a difference
            in the world. With years of experience in blood donation services
            and a deep understanding of the critical need for blood products, we
            work tirelessly to promote donation awareness, organize donation
            drives, and support blood banks and hospitals in their efforts to
            save lives.
          </p>
          <hr className="w-1/2 self-baseline mt-8" />
          <h2 className="w-full font-bold text-3xl mt-8">What we do?</h2>
          <p className="mt-4 text-lg text-justify">
            Facilitate Blood Donation: We provide a platform for donors to
            easily register, find donation centers, and schedule appointments.
            Through our efforts, we aim to increase blood donations and ensure
            that hospitals have an ample supply of blood for emergencies and
            medical procedures.
          </p>
          <p className="mt-4 text-lg text-justify">
            Educate and Raise Awareness: We believe that knowledge is key to
            fostering a culture of donation. That's why we actively engage in
            educational campaigns, outreach programs, and community events to
            raise awareness about the importance of donating blood and its
            impact on patient care.
          </p>
          <p className="mt-4 text-lg text-justify">
            Healthcare Institutions: Blood Nation collaborates with blood banks,
            hospitals, and healthcare organizations to streamline donation
            processes, improve blood collection and storage practices, and
            enhance patient outcomes through timely access to blood products.
          </p>
          <hr className="w-1/2 self-baseline mt-8" />
          <h2 className="w-full font-bold text-3xl mt-8">Our Commitment</h2>
          <p className="mt-4 text-lg text-justify">
            At Blood Nation, we are committed to transparency, integrity, and
            excellence in everything we do. We adhere to strict quality
            standards and ethical practices to ensure the safety of donors and
            the reliability of blood products delivered to patients in need.
          </p>
          <hr className="w-1/2 self-baseline mt-8" />
          <h2 className="w-full font-bold text-3xl mt-8">Join Us</h2>
          <p className="mt-4 text-lg text-justify">
            Whether you're a potential donor, a healthcare partner, or someone
            looking to support our cause, we invite you to join us in our
            mission to save lives and make a lasting impact on the health and
            well-being of our communities.
          </p>
          <p className=" w-full mt-4 text-lg text-justify">
            Together, we are Blood Nation—a community of caring individuals
            dedicated to ensuring that no patient goes without the life-saving
            blood they need.
          </p>
          <p className="w-full mt-4 text-lg text-justify">
            Thank you for visiting Blood Nation!
          </p>
        </div>
      </section>
    </>
  );
}

export default About;
