import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Home, Moon, Sun, Eye, EyeOff } from "lucide-react";

export default function Login1() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loginType, setLoginType] = useState("user"); // "user" or "bank"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const userStatus = sessionStorage.getItem("user");
    const bankStatus = sessionStorage.getItem("bank");
    const userToken = localStorage.getItem("token");
    const bankToken = localStorage.getItem("bankToken");

    if (userStatus) navigate("/profile");
    else if (bankStatus) navigate("/bloodBankProfile");
    else if (userToken && !userStatus) {
      sessionStorage.setItem("user", true);
      navigate("/profile");
    } else if (bankToken && !bankStatus) {
      sessionStorage.setItem("bank", true);
      navigate("/bloodBankProfile");
    }
  }, [navigate]);

  // 🔐 Handle login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginType === "bank" && email.length !== 6) {
  alert("Please enter a valid 6-digit Bank ID.");
  return;
}
    setLoading(true);

    const endpoint =
      loginType === "user"
        ? "http://localhost:3000/api/user/login"
        : "http://localhost:3000/api/bloodbank/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      const token = data.token;

      if (token) {
        if (loginType === "user") {
          localStorage.setItem("token", token);
          sessionStorage.setItem("user", true);
          navigate("/profile");
        } else {
          localStorage.setItem("bankToken", token);
          sessionStorage.setItem("bank", true);
          navigate("/bloodBankProfile");
        }
      } else {
        alert(data.message || "Invalid credentials. Please try again.");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please check your network or backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-[#0b0b0f] via-[#141418] to-[#210000]"
          : "bg-gradient-to-br from-[#f5f5f5] via-[#ffeaea] to-[#fff7f7]"
      }`}
    >
      {/* Subtle background animation */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-red-700/20 rounded-full blur-[150px] -z-10"
        animate={{ y: [0, 50, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Home Button */}
      <Link
        to="/home2"
        className={`absolute top-6 left-10 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-md transition ${
          isDarkMode
            ? "bg-white/10 text-white hover:bg-white/20"
            : "bg-[#fff0f0]/70 text-[#3a1d1d] hover:bg-[#ffe1e1]"
        }`}
      >
        <Home size={18} />
        <span className="font-medium">Home</span>
      </Link>

      {/* Dark/Light Toggle */}
      <div className="absolute top-6 right-10 flex items-center gap-3">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`relative w-12 h-6 rounded-full flex items-center justify-between px-1 transition border border-white/10 ${
            isDarkMode ? "bg-gray-600/40" : "bg-gray-300/40"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDarkMode ? (
              <motion.span
                key="moon"
                className="absolute left-1.5 text-yellow-300"
              >
                <Moon size={14} />
              </motion.span>
            ) : (
              <motion.span
                key="sun"
                className="absolute right-1.5 text-yellow-500"
              >
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center mb-8 text-center px-4"
      >
        <h1
          className={`text-3xl font-bold tracking-wide leading-snug ${
            isDarkMode ? "text-white" : "text-[#3a1d1d]"
          }`}
        >
          Welcome Back to{" "}
          <span className="text-red-500">Blood</span>
          <span className={`${isDarkMode ? "text-white" : "text-[#3a1d1d]"}`}>
            Nation
          </span>
        </h1>
        <p
          className={`text-sm mt-2 max-w-md ${
            isDarkMode ? "text-gray-400" : "text-[#5B2A2A]"
          }`}
        >
          Every drop counts — log in to continue your life-saving journey.
        </p>
      </motion.div>

      {/* Login Type Switch */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center mb-6 mt-2 gap-3 select-none"
      >
        <div
          className={`px-5 py-2 rounded-full cursor-pointer transition-all ${
            loginType === "user"
              ? isDarkMode
                ? "bg-red-600 text-white shadow-lg"
                : "bg-[#a84b4b] text-white shadow-md"
              : isDarkMode
              ? "bg-white/10 text-gray-400 hover:text-white"
              : "bg-[#ffe5e5] text-[#3a1d1d] hover:bg-[#ffcccc]"
          }`}
          onClick={() => setLoginType("user")}
        >
          Donor Login
        </div>

        <div
          className={`px-5 py-2 rounded-full cursor-pointer transition-all ${
            loginType === "bank"
              ? isDarkMode
                ? "bg-red-600 text-white shadow-lg"
                : "bg-[#a84b4b] text-white shadow-md"
              : isDarkMode
              ? "bg-white/10 text-gray-400 hover:text-white"
              : "bg-[#ffe5e5] text-[#3a1d1d] hover:bg-[#ffcccc]"
          }`}
          onClick={() => setLoginType("bank")}
        >
          Blood Bank Login
        </div>
      </motion.div>

      {/* Glass Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className={`w-[90%] max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-2xl border transition-all ${
          isDarkMode
            ? "bg-white/10 border-white/10 hover:bg-white/15"
            : "bg-white/70 border-[#e6bdbd]/70 hover:bg-white/80"
        }`}
      >
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          {/* Email or Blood Bank ID */}
          <div className="text-left">
            <label
              className={`text-sm font-semibold mb-2 block ${
                isDarkMode ? "text-gray-300" : "text-[#3a1d1d]"
              }`}
            >
              {loginType === "user" ? "Email" : "Blood Bank ID"}
            </label>
            <input
  type={loginType === "user" ? "text" : "number"}
  value={email}
  onChange={(e) => {
    if (loginType === "bank") {
      // allow only digits, max 6
      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
      setEmail(val);
    } else {
      setEmail(e.target.value);
    }
  }}
  placeholder={
    loginType === "user"
      ? "Enter your email"
      : "Enter 6-digit Bank ID"
  }
  required
  className={`w-full p-3 rounded-xl bg-transparent border transition focus:outline-none focus:ring-2 ${
    isDarkMode
      ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
      : "border-[#a84b4b]/40 text-[#3a1d1d] placeholder-[#a84b4b]/70 focus:ring-[#a84b4b]"
  }`}
/>
          </div>

          {/* Password with Eye */}
          <div className="text-left relative">
            <label
              className={`text-sm font-semibold mb-2 block ${
                isDarkMode ? "text-gray-300" : "text-[#3a1d1d]"
              }`}
            >
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className={`w-full p-3 pr-12 rounded-xl bg-transparent border transition focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
                    : "border-[#a84b4b]/40 text-[#3a1d1d] placeholder-[#a84b4b]/70 focus:ring-[#a84b4b]"
                }`}
              />

              <button
                type="button"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
                className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-400 hover:text-gray-200 transition focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="text-right mt-2">
              <Link
                to="/forgot"
                className="text-xs text-red-400 hover:text-red-300 transition"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-400 text-white font-semibold shadow-lg hover:from-red-700 hover:to-red-500 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        {/* Signup */}
        <div className="text-center mt-6">
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-400" : "text-[#5B2A2A]"
            }`}
          >
            Don’t have an account?{" "}
            <Link
              to="/register1"
              className="text-red-500 hover:underline font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <p
          className={`text-xs ${
            isDarkMode ? "text-gray-500" : "text-[#5B2A2A]"
          }`}
        >
          © {new Date().getFullYear()} BloodNation — Every drop counts.
        </p>
      </div>
    </div>
  );
}