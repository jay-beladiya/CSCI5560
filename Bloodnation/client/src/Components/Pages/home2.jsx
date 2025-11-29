import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";

/** ---------- Shared Animations ---------- **/
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  exit: { opacity: 0, y: 18, transition: { duration: 0.5, ease: "easeIn" } },
};

const Section = ({ className = "", children }) => (
  <motion.section
    initial="hidden"
    whileInView="show"
    viewport={{ amount: 0.25, once: false }}
    exit="exit"
    variants={fadeUp}
    className={className}
  >
    {children}
  </motion.section>
);

// Glass card with adaptive theme
const GlassCard = ({ children, isDarkMode, className = "" }) => (
  <div
    className={`rounded-2xl shadow-xl transition-colors duration-700 border ${
      isDarkMode
        ? "bg-white/8 backdrop-blur-xl border-white/10 hover:bg-white/10"
        : "bg-[#fff9f9]/70 backdrop-blur-md border-[#e6bdbd]/50 hover:bg-[#fff5f5]/90"
    } ${className}`}
  >
    {children}
  </div>
);

/** ---------- Images ---------- **/
const heroImage =
  "https://images.unsplash.com/photo-1615461065624-21b562ee5566?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2540";
const dropIcon = "https://cdn-icons-png.flaticon.com/512/3102/3102613.png";

export default function Home2() {
  /** ---------- Scroll & Theme ---------- **/
  const { scrollY } = useScroll();
  const navBgOpacity = useTransform(scrollY, [0, 200], [0.08, 0.2]);
  const navBorderOpacity = useTransform(scrollY, [0, 200], [0.1, 0.2]);
  const heroImgY = useTransform(scrollY, [0, 400], [0, -30]);
  const glowOpacity = useTransform(scrollY, [0, 400], [0.6, 0.35]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <div
      className={`min-h-screen overflow-x-hidden relative transition-colors duration-700 ${
        isDarkMode
          ? "bg-gradient-to-br from-[#0b0b0f] via-[#141418] to-[#210000] text-white"
          : "bg-gradient-to-br from-[#fff5f5] via-[#ffecec] to-[#ffdada] text-[#3a1d1d]"
      }`}
    >
      {/* ---------- NAVBAR ---------- */}
      <motion.nav
        className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl"
        style={{
          backgroundColor: navBgOpacity.get()
            ? `rgba(255,255,255,${navBgOpacity.get()})`
            : "rgba(255,255,255,0.1)",
          borderBottom: `1px solid rgba(255,255,255,${
            navBorderOpacity.get ? navBorderOpacity.get() : 0.1
          })`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
          {/* LOGO */}
          <motion.div
            className="relative flex items-center gap-3 cursor-pointer select-none"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.div
              className="absolute -z-10 left-0 w-12 h-12 rounded-full bg-red-600/30 blur-xl"
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.h1
              className="text-2xl md:text-3xl font-kanit font-semibold tracking-wider"
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <span className="bg-gradient-to-r from-red-500 to-red-300 text-transparent bg-clip-text">
                Blood
              </span>
              <span className={isDarkMode ? "text-white" : "text-[#3a1d1d]"}>
                Nation
              </span>
            </motion.h1>
          </motion.div>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/about" className="hover:text-red-400 transition font-medium">
              About
            </Link>
            <Link to="/login1" className="hover:text-red-400 transition font-medium">
              Login
            </Link>
            <Link
              to="/register1"
              className={`px-4 py-2 rounded-full font-semibold transition ${
                isDarkMode
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-[#7B3A3A] text-[#FFF5F5] hover:bg-[#5B2A2A]"
              }`}
            >
              Join Now
            </Link>
          </div>

          {/* THEME SWITCH */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`ml-4 w-14 h-8 rounded-full flex items-center px-1 transition-colors duration-500 ${
              isDarkMode ? "bg-red-600/60" : "bg-gray-300/70"
            }`}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                isDarkMode
                  ? "translate-x-6 bg-black text-yellow-400"
                  : "translate-x-0 bg-white text-gray-700"
              }`}
            >
              {isDarkMode ? <FaMoon size={12} /> : <FaSun size={12} />}
            </motion.div>
          </motion.button>
        </div>
      </motion.nav>

      {/* ---------- HERO ---------- */}
      <div className="pt-28 md:pt-32" />
      <section className="relative flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6 max-w-2xl"
        >
          <h1
            className={`text-4xl md:text-6xl font-bold leading-tight ${
              isDarkMode ? "text-white" : "text-[#3a1d1d]"
            }`}
          >
            <span className="text-red-500">Donate Blood,</span>
            <br />
            Save Lives. Inspire Hope.
          </h1>
          <p
            className={`text-lg leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-[#5B2A2A]"
            }`}
          >
            Every drop counts. Join a life-saving community connecting donors
            and recipients nationwide.
          </p>

          <div className="flex gap-3 mt-2">
            <Link to="/register1">
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className="bg-red-600 px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:bg-red-700 transition"
  >
    Donate Now
  </motion.button>
</Link>
            <Link to="/about">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`border px-6 py-3 rounded-full transition ${
                isDarkMode
                  ? "border-red-500/70 text-red-300 hover:bg-red-600/15"
                  : "border-[#7B3A3A] text-[#7B3A3A] hover:bg-[#E8A0A0]/40"
              }`}
            >
              Learn More
            </motion.button>
            </Link>
          </div>
        </motion.div>

        <div className="mt-10 md:mt-0 relative">
          <motion.img
                src={heroImage}
                alt="Blood Donation"
                className="w-[650px] max-w-full rounded-3xl shadow-2xl border border-white/15"
                style={{
                  y: heroImgY,
                  scale: 1.05, // ✅ adds smooth scale
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
          <motion.div
            className="absolute -z-10 top-4 left-4 right-4 bottom-4 bg-red-600/35 blur-3xl rounded-3xl"
            style={{ opacity: glowOpacity }}
          />
        </div>
      </section>

      {/* ---------- WHY DONATE ---------- */}
      <Section className="mt-24 px-8 md:px-16 lg:px-28">
        <h2 className="text-2xl md:text-4xl font-semibold mb-6">
          Why Donate?
        </h2>
        <p
          className={`mb-10 max-w-3xl ${
            isDarkMode ? "text-gray-300" : "text-[#5B2A2A]"
          }`}
        >
          Your contribution powers emergency care, surgeries, and chronic
          treatments. These are three ways you make an impact:
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Save Lives",
              desc: "A single donation can help multiple patients in critical need.",
            },
            {
              title: "Support Hospitals",
              desc: "Keep blood banks prepared for emergencies and planned procedures.",
            },
            {
              title: "Build Community",
              desc: "Join a nationwide network of donors and compassionate caregivers.",
            },
          ].map((card, idx) => (
            <motion.div
              key={card.title}
              className="group"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3, once: false }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
            >
              <GlassCard isDarkMode={isDarkMode} className="p-6 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={dropIcon}
                    alt="drop"
                    className="w-6 h-6 opacity-80"
                  />
                  <h3 className="text-lg font-semibold text-red-400">
                    {card.title}
                  </h3>
                </div>
                <p
                  className={
                    isDarkMode ? "text-gray-300" : "text-[#3a1d1d]/80"
                  }
                >
                  {card.desc}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ---------- THE JOURNEY OF YOUR DONATION (Straight Line Layout) ---------- */}
<Section className="relative mt-32 px-6 md:px-16 lg:px-28 text-center overflow-visible">
  {/* Background glow */}
  <motion.div
    className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-red-900/10 to-transparent blur-3xl"
    animate={{ opacity: [0.4, 0.7, 0.4] }}
    transition={{ duration: 6, repeat: Infinity }}
  />

  {/* Title */}
  <div className="mb-14">
    <h2
      className={`text-2xl md:text-4xl font-semibold mb-4 ${
        isDarkMode ? "text-white" : "text-[#3a1d1d]"
      }`}
    >
      The Journey of Your Donation
    </h2>
    <p
      className={`max-w-3xl mx-auto ${
        isDarkMode ? "text-gray-300" : "text-[#5B2A2A]"
      }`}
    >
      Every drop of blood takes a meaningful path — through testing, storage,
      and care — until it becomes someone’s second chance at life.
    </p>
  </div>

  {/* Steps aligned in one straight horizontal line */}
  <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 flex-wrap md:flex-nowrap">
    {[
      {
        title: "Donation",
        desc: "Your blood donation begins the journey that saves lives.",
        icon: "https://cdn-icons-png.flaticon.com/512/1053/1053175.png",
      },
      {
        title: "Testing",
        desc: "Every unit is tested to ensure safety and compatibility.",
        icon: "https://cdn-icons-png.flaticon.com/512/2927/2927990.png",
      },
      {
        title: "Storage",
        desc: "Stored in controlled environments to maintain quality.",
        icon: "https://cdn-icons-png.flaticon.com/512/4315/4315445.png",
      },
      {
        title: "Saving Lives",
        desc: "Delivered to hospitals where it restores hope and health.",
        icon: "https://cdn-icons-png.flaticon.com/512/924/924874.png",
      },
    ].map((step, idx) => (
      <motion.div
        key={step.title}
        className="flex flex-col items-center text-center w-60"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.4, once: false }}
        transition={{ duration: 0.8, delay: idx * 0.25 }}
      >
        <motion.div
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 250, damping: 15 }}
          className={`relative w-32 h-32 rounded-full flex items-center justify-center border-2 cursor-pointer ${
            isDarkMode
              ? "bg-white/10 border-white/20 hover:shadow-[0_0_30px_rgba(255,0,0,0.5)]"
              : "bg-[#fff9f9]/70 border-[#e6bdbd]/70 hover:shadow-[0_0_25px_rgba(123,58,58,0.5)]"
          }`}
        >
          {/* Pulsing glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-500/30"
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: idx * 0.4 }}
          />
          {/* Icon */}
          <motion.img
            src={step.icon}
            alt={step.title}
            className="w-12 h-12 z-10"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}
          />
        </motion.div>

        {/* Labels */}
        <h3 className="text-lg font-semibold text-red-400 mt-5">
          {step.title}
        </h3>
        <p
          className={`text-sm mt-2 ${
            isDarkMode ? "text-gray-300" : "text-[#3a1d1d]/80"
          }`}
        >
          {step.desc}
        </p>
      </motion.div>
    ))}
  </div>
</Section>

      {/* ---------- CTA BANNER ---------- */}
      <Section className="mt-24 mb-28 px-8 md:px-16 lg:px-28">
        <GlassCard
          isDarkMode={isDarkMode}
          className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">
              Join the Movement
            </h3>
            <p
              className={`max-w-xl ${
                isDarkMode ? "text-gray-300" : "text-[#5B2A2A]"
              }`}
            >
              Become a donor today. Together we can ensure hospitals never run
              out of life-saving blood.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/register1"
              className={`px-6 py-3 rounded-full font-semibold transition ${
                isDarkMode
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-[#7B3A3A] text-[#FFF5F5] hover:bg-[#5B2A2A]"
              }`}
            >
              Get Started
            </Link>
            <Link
              to="/login1"
              className={`px-6 py-3 rounded-full transition ${
                isDarkMode
                  ? "border border-white/20 text-white/90 hover:bg-white/10"
                  : "border border-[#7B3A3A]/30 text-[#5B2A2A] hover:bg-[#E8A0A0]/40"
              }`}
            >
              I’m already a donor
            </Link>
          </div>
        </GlassCard>
      </Section>

      <div className="h-10" />
    </div>
  );
}