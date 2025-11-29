import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Home, Moon, Sun } from "lucide-react";

export default function Register1() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bloodGroup: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    const userStatus = sessionStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (userStatus) navigate("/profile");
    else if (token && !userStatus) {
      sessionStorage.setItem("user", true);
      navigate("/profile");
    }
  }, [navigate]);

  // Password validation
  useEffect(() => {
    if (formData.password.length === 0) {
      setPasswordError("");
      setError(true);
    } else if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long!");
      setError(true);
    } else if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      setError(true);
    } else {
      setPasswordError("");
      setError(false);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!error) {
      try {
        const response = await fetch("http://localhost:3000/api/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.fullName.split(" ")[0] || "",
            lastName: formData.fullName.split(" ")[1] || "",
            fatherName: "N/A",
            age: 0,
            gender: "Other",
            bloodGroup: formData.bloodGroup,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();
        const token = data.token;

        if (token === true) {
          alert(data.message);
        } else if (token) {
          localStorage.setItem("token", token);
          sessionStorage.setItem("user", true);
          navigate("/profile");
        } else {
          alert(data.message || "Registration failed.");
        }
      } catch (err) {
        console.error("Registration error:", err);
        alert("Network or server error. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full overflow-y-auto flex flex-col items-center justify-center relative transition-colors duration-500 py-12 px-4 ${
        isDarkMode
          ? "bg-gradient-to-br from-[#0b0b0f] via-[#141418] to-[#210000]"
          : "bg-gradient-to-br from-[#f5f5f5] via-[#ffeaea] to-[#fff7f7]"
      }`}
    >
      {/* 🔁 Loading Spinner Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
          <div className="w-10 h-10 border-4 border-t-transparent border-red-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Background glow */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-red-700/20 rounded-full blur-[150px] -z-10"
        animate={{ y: [0, 50, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Home button */}
      <Link
        to="/home2"
        className={`absolute top-6 left-8 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-md transition ${
          isDarkMode
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-[#fff0f0]/70 text-[#3a1d1d] hover:bg-[#ffe1e1]"
        }`}
      >
        <Home size={18} />
        <span className="font-medium">Home</span>
      </Link>

      {/* Theme toggle */}
      <div className="absolute top-6 right-8 flex items-center gap-3">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`relative w-12 h-6 rounded-full flex items-center justify-between px-1 transition border border-white/10 ${
            isDarkMode ? "bg-gray-600/40" : "bg-gray-300/40"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDarkMode ? (
              <motion.span key="moon" className="absolute left-1.5 text-yellow-300">
                <Moon size={14} />
              </motion.span>
            ) : (
              <motion.span key="sun" className="absolute right-1.5 text-yellow-500">
                <Sun size={14} />
              </motion.span>
            )}
          </AnimatePresence>
          <motion.div
            className={`w-5 h-5 rounded-full shadow-md absolute transition ${
              isDarkMode ? "bg-red-500 left-6" : "bg-yellow-400 left-1"
            }`}
            layout
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
          />
        </button>
      </div>

      {/* Wrapper */}
      <div className="flex flex-col items-center justify-center w-full max-w-md mt-20 mb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-8 text-center px-4"
        >
          <h1
            className={`text-3xl font-bold tracking-wide ${
              isDarkMode ? "text-white" : "text-[#3a1d1d]"
            }`}
          >
            Become a <span className="text-red-500">Blood</span>
            <span className={`${isDarkMode ? "text-white" : "text-[#3a1d1d]"}`}>
              Nation
            </span>{" "}
            Donor
          </h1>
          <p
            className={`text-sm mt-2 max-w-sm leading-relaxed ${
              isDarkMode ? "text-gray-400" : "text-[#5B2A2A]"
            }`}
          >
            Join thousands of lifesavers who make every drop count.  
            Register to start your donation journey today.
          </p>
        </motion.div>

        {/* Glass Card (form container) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className={`w-full rounded-2xl p-8 shadow-2xl backdrop-blur-2xl border ${
            isDarkMode
              ? "bg-white/10 border-white/10 hover:bg-white/15"
              : "bg-white/70 border-[#e6bdbd]/70 hover:bg-white/80"
          }`}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Full Name */}
            <div>
              <label
                className={`text-sm font-semibold mb-2 block ${
                  isDarkMode ? "text-gray-300" : "text-[#3a1d1d]"
                }`}
              >
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className={`w-full p-3 rounded-xl bg-transparent border transition focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
                    : "border-[#a84b4b]/40 text-[#3a1d1d] placeholder-[#a84b4b]/70 focus:ring-[#a84b4b]"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label
                className={`text-sm font-semibold mb-2 block ${
                  isDarkMode ? "text-gray-300" : "text-[#3a1d1d]"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className={`w-full p-3 rounded-xl bg-transparent border transition focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
                    : "border-[#a84b4b]/40 text-[#3a1d1d] placeholder-[#a84b4b]/70 focus:ring-[#a84b4b]"
                }`}
              />
            </div>

            {/* Blood Group */}
<div>
  <label
    className={`text-sm font-semibold mb-2 block ${
      isDarkMode ? "text-gray-300" : "text-[#3a1d1d]"
    }`}
  >
    Blood Group
  </label>
  <div className="relative">
    <select
      name="bloodGroup"
      value={formData.bloodGroup}
      onChange={handleChange}
      required
      className={`w-full p-3 pr-10 rounded-xl bg-transparent border focus:outline-none focus:ring-2 appearance-none transition ${
        isDarkMode
          ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
          : "border-[#a84b4b]/40 text-[#3a1d1d] placeholder-[#a84b4b]/70 focus:ring-[#a84b4b]"
      } ${!formData.bloodGroup ? (isDarkMode ? "text-gray-400" : "text-[#a84b4b]/70") : ""}`}
    >
      <option value="" disabled hidden>
        Select your blood group
      </option>
      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => (
        <option
          key={type}
          value={type}
          className={
            isDarkMode ? "bg-[#1a1a1a] text-white" : "bg-white text-[#3a1d1d]"
          }
        >
          {type}
        </option>
      ))}
    </select>

    {/* Dropdown arrow */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill={isDarkMode ? "#9ca3af" : "#a84b4b"}
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  </div>
</div>

{/* Password */}
<div className="relative">
  <label
    className={`text-sm font-semibold mb-2 block ${
      isDarkMode ? "text-gray-300" : "text-[#3a1d1d]"
    }`}
  >
    Password
  </label>

  <div className="relative flex items-center">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Create a password"
      required
      className={`w-full p-3 pr-12 rounded-xl bg-transparent border focus:outline-none focus:ring-2 transition ${
        isDarkMode
          ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
          : "border-[#a84b4b]/40 text-[#3a1d1d] placeholder-[#a84b4b]/70 focus:ring-[#a84b4b]"
      }`}
    />

    {/* Eye Icon — Hold to Show Password */}
    <button
      type="button"
      onMouseDown={() => setShowPassword(true)}
      onMouseUp={() => setShowPassword(false)}
      onMouseLeave={() => setShowPassword(false)}
      onTouchStart={() => setShowPassword(true)}
      onTouchEnd={() => setShowPassword(false)}
      className="absolute right-3 flex items-center justify-center h-full text-gray-400 hover:text-gray-200 focus:outline-none"
    >
      {showPassword ? (
        // 👁️ Eye open icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ) : (
        // 🙈 Eye closed icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223A10.451 10.451 0 001.458 12C2.732 16.057 6.523 19 11 19c1.868 0 3.63-.507 5.157-1.387M20.02 15.777A10.451 10.451 0 0022.542 12c-1.274-4.057-5.064-7-9.542-7a9.953 9.953 0 00-3.03.463M9.88 9.88a3 3 0 104.24 4.24"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
        </svg>
      )}
    </button>
  </div>
</div>

{/* Confirm Password */}
<div className="relative">
  <label
    className={`text-sm font-semibold mb-2 block ${
      isDarkMode ? "text-gray-300" : "text-[#3a1d1d]"
    }`}
  >
    Confirm Password
  </label>

  <div className="relative flex items-center">
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      placeholder="Re-enter your password"
      required
      className={`w-full p-3 pr-12 rounded-xl bg-transparent border focus:outline-none focus:ring-2 transition ${
        isDarkMode
          ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
          : "border-[#a84b4b]/40 text-[#3a1d1d] placeholder-[#a84b4b]/70 focus:ring-[#a84b4b]"
      }`}
    />

    {/* Eye Icon — Hold to Show Confirm Password */}
    <button
      type="button"
      onMouseDown={() => setShowConfirmPassword(true)}
      onMouseUp={() => setShowConfirmPassword(false)}
      onMouseLeave={() => setShowConfirmPassword(false)}
      onTouchStart={() => setShowConfirmPassword(true)}
      onTouchEnd={() => setShowConfirmPassword(false)}
      className="absolute right-3 flex items-center justify-center h-full text-gray-400 hover:text-gray-200 focus:outline-none"
    >
      {showConfirmPassword ? (
        // 👁️ Eye open icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ) : (
        // 🙈 Eye closed icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.98 8.223A10.451 10.451 0 001.458 12C2.732 16.057 6.523 19 11 19c1.868 0 3.63-.507 5.157-1.387M20.02 15.777A10.451 10.451 0 0022.542 12c-1.274-4.057-5.064-7-9.542-7a9.953 9.953 0 00-3.03.463M9.88 9.88a3 3 0 104.24 4.24"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
        </svg>
      )}
    </button>
  </div>
</div>

            {/* Password Error */}
            {passwordError && (
              <p className="text-red-400 text-xs text-center -mt-2">
                {passwordError}
              </p>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-400 text-white font-semibold shadow-lg hover:from-red-700 hover:to-red-500 transition"
            >
              Register
            </motion.button>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-6">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-[#5B2A2A]"
              }`}
            >
              Already have an account?{" "}
              <Link
                to="/login1"
                className="text-red-500 hover:underline font-semibold"
              >
                Login here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center mt-auto mb-4">
        <p
          className={`text-xs ${
            isDarkMode ? "text-gray-500" : "text-[#5B2A2A]"
          }`}
        >
          © {new Date().getFullYear()} BloodNation — Together, we save lives.
        </p>
      </div>
    </div>
  );
}