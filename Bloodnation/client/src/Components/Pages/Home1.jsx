import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Common/Navbar/Navbar";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

function Home1() {
  // initialize AOS animations
  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <>
      {/* Navigation bar */}
      <Navbar />

      {/* Main section */}
      <section className="h-[89vh] flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-red-100">
        {/* Decorative floating blobs */}
        <motion.div
          className="absolute top-0 left-0 w-72 h-72 bg-red-300 opacity-30 blur-3xl rounded-full"
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-red-200 opacity-40 blur-3xl rounded-full"
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 7 }}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="z-10 flex flex-col justify-center items-center text-center w-4/5 md:w-3/5"
        >
          {/* Animated blood drop */}
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
            alt="Blood Drop"
            className="w-20 h-20 mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          />

          {/* Heading */}
          <h1
            data-aos="fade-down"
            className="text-4xl md:text-5xl font-bold text-red-700 mb-6"
          >
            Welcome to <span className="text-red-800">Blood Nation</span>!
          </h1>

          {/* Subheading / Description */}
          <p
            data-aos="fade-up"
            className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8"
          >
            A nationwide network connecting{" "}
            <span className="text-red-600 font-semibold">donors</span> and{" "}
            <span className="text-red-600 font-semibold">recipients</span> to
            save lives. Join our mission and make a difference today.
          </p>

          {/* Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="shadow-xl rounded-full bg-red-600 px-8 py-3 cursor-pointer text-white font-medium hover:bg-red-700 transition duration-300"
          >
            <Link to="/about">About Us</Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

export default Home1;