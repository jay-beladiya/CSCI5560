import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  LogOut,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Droplet,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";

function Profile() {
  // ---------------- State (same data as old file) ----------------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);

  const [loading, setLoading] = useState(false);
  const [totalDonations, setTotalDonations] = useState(0);
const [lastDonation, setLastDonation] = useState("");
const [eligibility, setEligibility] = useState("");
const [donorId, setDonorId] = useState("");

  // UI/Theme & Modals
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [modalErrorStatus, setModalErrorStatus] = useState(false);

  // Password field visibility (press/hold)
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();


  // ---------------- Effects ----------------
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New Password didn't match!");
      setErrorStatus(true);
    } else {
      setPasswordError("");
      setErrorStatus(false);
    }
  }, [newPassword, confirmNewPassword]);

  // ---------------- API Calls (same endpoints) ----------------
  const fetchUser = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");
    const bankToken = localStorage.getItem("bankToken");
    if (token) {
      try {
        const response = await fetch("http://localhost:3000/api/fetch/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const status = response.status;
        if (status === 200) {
          const responseJSON = await response.json();
          const data = responseJSON.response;

          console.log("API USER DATA ===>", data);
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setFatherName(data.fatherName || "");
          setGender(data.gender || "");
          setAge(data.age || "");
          setBloodGroup(data.bloodGroup || "");
          setEmail(data.email || "");
          setTotalDonations(data.numberOfDonations || 0);
          setLastDonation(data.lastDonation || "--");
          setEligibility(data.eligibility || "Unknown");
          setDonorId(data.donorId || "N/A");
        } else if (status === 404) {
          alert("Email changed, please login again!");
          localStorage.clear();
          sessionStorage.clear();
          navigate("/login1");
        } else if (bankToken) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("user");
          navigate("/bloodBankProfile");
        } else {
          localStorage.clear();
          sessionStorage.clear();
          navigate("/");
        }
      } catch (error) {
        console.log("Fetching /api/verify/user Error: ", error);
        navigate("/home2");
        localStorage.clear();
        sessionStorage.clear();
      } finally {
        setLoading(false);
      }
    } else {
      localStorage.clear();
      navigate("/home2");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (modalErrorStatus === false) {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:3000/api/updateProfile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        });

        if (response.status === 200) {
          // updated
        } else if (response.status === 401) {
          const responseData = await response.json();
          alert(responseData.message);
        }
      } catch (error) {
        console.log("Error updating profile:", error);
      } finally {
        setLoading(false);
        fetchUser();
        handleCloseModal();
      }
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    if (errorStatus === false) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/changePassword",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email,
              oldPassword: oldPassword,
              newPassword: newPassword,
            }),
          }
        );

        const data = await response.json();
        alert(data.message);

        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } catch (error) {
        console.log("Fetch Error: ", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  // ---------------- Handlers ----------------
  const handleEdit = () => {
    setEditData({
      firstName,
      lastName,
      fatherName,
      age,
      bloodGroup,
      email,
      gender,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditData({});
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login1");
  };

  // ---------------- UI Helpers ----------------
  const cardVariants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-black/20">
          <div className="flex flex-col items-center justify-center bg-white/20 p-8 rounded-2xl shadow-2xl border border-white/30 backdrop-blur-xl">
            <div className="w-10 h-10 border-4 border-t-transparent border-red-500 rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Page background & wrapper */}
      <div
        className={`min-h-screen w-full relative overflow-x-hidden ${
          isDarkMode
            ? "bg-gradient-to-br from-[#0b0b0f] via-[#141418] to-[#210000]"
            : "bg-gradient-to-br from-[#f8dcdc] via-[#ffe2e2] to-[#fff0f0]"
        }`}
      >
        {/* Subtle animated glow */}
        <motion.div
          className="absolute w-[520px] h-[520px] bg-red-700/20 rounded-full blur-[150px] -z-10 top-10 left-10"
          animate={{ y: [0, 40, 0], opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Glassy Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10"
          style={{
            background:
              isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.6)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="w-6 h-6 text-red-500" />
              <span
                className={`text-lg font-semibold tracking-wide ${
                  isDarkMode ? "text-white" : "text-[#1a0000]"
                }`}
              >
                BloodNation Donor Dashboard
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/home2"
                className={`px-3 py-2 rounded-xl transition border ${
                  isDarkMode
                    ? "border-white/10 text-white hover:bg-white/10"
                    : "border-[#a84b4b]/30 text-[#1a0000] hover:bg-white/80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home size={16} /> <span className="text-sm">Home</span>
                </div>
              </Link>

              {/* Theme toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative w-12 h-6 rounded-full flex items-center justify-between px-1 transition border ${
                  isDarkMode
                    ? "bg-gray-600/40 border-white/10"
                    : "bg-gray-300/60 border-[#a84b4b]/20"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDarkMode ? (
                    <motion.span
                      key="moon"
                      initial={{ opacity: 0, rotate: -90, y: -2 }}
                      animate={{ opacity: 1, rotate: 0, y: 0 }}
                      exit={{ opacity: 0, rotate: 90, y: 2 }}
                      transition={{ duration: 0.25 }}
                      className="absolute left-1.5 text-yellow-300"
                    >
                      <Moon size={14} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="sun"
                      initial={{ opacity: 0, rotate: 90, y: 2 }}
                      animate={{ opacity: 1, rotate: 0, y: 0 }}
                      exit={{ opacity: 0, rotate: -90, y: -2 }}
                      transition={{ duration: 0.25 }}
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

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2"
              >
                <LogOut size={16} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-20">
          {/* Title */}
          <div className="flex items-center justify-center mb-8">
            <span
              className={`font-bold text-2xl md:text-3xl tracking-wide border-b-4 pb-1 ${
                isDarkMode ? "text-white border-red-500" : "text-[#1a0000] border-[#a84b4b]"
              }`}
            >
              Dashboard
            </span>
          </div>

          {/* Top: Profile Summary + Donation Stats */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Profile Summary */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="show"
              className={`rounded-2xl p-6 backdrop-blur-2xl border shadow-[0_0_15px_rgba(160,30,30,0.1)] ${
                isDarkMode
                  ? "bg-white/10 border-white/10"
                  : "bg-[#fff5f5] border-[#d38f8f]/80"
              }`}
            >
              <h2
                className={`text-xl font-semibold mb-4 border-b pb-2 ${
                  isDarkMode ? "text-white border-white/10" : "text-[#1a0000] border-[#a84b4b]/30"
                }`}
              >
                Your Details
              </h2>

              <div className="flex flex-col gap-3 text-sm md:text-base">
  <div className="flex justify-between">
    <span className={isDarkMode ? "text-gray-300" : "text-[#2e0000]"}>First Name:</span>
    <span className={isDarkMode ? "text-white" : "text-[#1a0000]"}>{firstName}</span>
  </div>
  <div className="flex justify-between">
    <span className={isDarkMode ? "text-gray-300" : "text-[#2e0000]"}>Last Name:</span>
    <span className={isDarkMode ? "text-white" : "text-[#1a0000]"}>{lastName}</span>
  </div>
  <div className="flex justify-between">
    <span className={isDarkMode ? "text-gray-300" : "text-[#2e0000]"}>Father's Name:</span>
    <span className={isDarkMode ? "text-white" : "text-[#1a0000]"}>{fatherName}</span>
  </div>
  <div className="flex justify-between">
    <span className={isDarkMode ? "text-gray-300" : "text-[#2e0000]"}>Gender:</span>
    <span className={isDarkMode ? "text-white" : "text-[#1a0000]"}>{gender}</span>
  </div>
  <div className="flex justify-between">
    <span className={isDarkMode ? "text-gray-300" : "text-[#2e0000]"}>Age:</span>
    <span className={isDarkMode ? "text-white" : "text-[#1a0000]"}>{age}</span>
  </div>
  <div className="flex justify-between">
    <span className={isDarkMode ? "text-gray-300" : "text-[#2e0000]"}>Blood Group:</span>
    <span
  className={`px-2 py-0.5 rounded-md border font-semibold ${
    isDarkMode
      ? "bg-red-600/30 text-red-200 border-red-500/40"
      : "bg-[#ffd7d7] text-[#7a0000] border-[#ff8a8a]"
  }`}
>
  {bloodGroup || "--"}
</span>
  </div>
  <div className="flex justify-between">
    <span className={isDarkMode ? "text-gray-300" : "text-[#2e0000]"}>Email:</span>
    <span className={isDarkMode ? "text-white" : "text-[#1a0000]"}>{email}</span>
  </div>
  <div className="flex justify-between">
    <span className={isDarkMode ? "text-gray-300" : "text-[#2e0000]"}>Phone Number:</span>
    <span className={isDarkMode ? "text-white" : "text-[#1a0000]"}>+1 (615) 555-9823</span>
  </div>
  <div className="flex justify-between">
    <span className={isDarkMode ? "text-gray-300" : "text-[#2e0000]"}>Address:</span>
    <span className={isDarkMode ? "text-white" : "text-[#1a0000]"}>Murfreesboro, TN</span>
  </div>
  <div className="flex justify-between">
    <span className={isDarkMode ? "text-gray-300" : "text-[#2e0000]"}>Registration Date:</span>
    <span className={isDarkMode ? "text-white" : "text-[#1a0000]"}>2024-11-21</span>
  </div>
  <div className="flex justify-between">
  <span className={isDarkMode ? "text-gray-300" : "text-[#2e0000]"}>Donor ID:</span>
  <span
  className={`px-2 py-0.5 rounded-md border font-semibold ${
    isDarkMode
      ? "bg-red-600/30 text-red-200 border-red-500/40"
      : "bg-[#ffd7d7] text-[#7a0000] border-[#ff8a8a]"
  }`}
>
  {donorId}
</span>
</div>
  <div className="flex justify-between">
    <span className={isDarkMode ? "text-gray-300" : "text-[#2e0000]"}>Last Login:</span>
    <span className={isDarkMode ? "text-white" : "text-[#1a0000]"}>2025-11-10 10:42 PM</span>
  </div>

  <button
    onClick={handleEdit}
    className="mt-6 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition self-end"
  >
    Edit Details
  </button>
</div>
            </motion.div>
{/* Right-Side Dashboard (Circles + Panels) */}
<div className="flex flex-col items-center gap-0">
{/* Donation Stats – Neon Halo Style */}
<motion.div
  variants={cardVariants}
  initial="hidden"
  animate="show"
  className="flex flex-wrap justify-center gap-10 py-6"
>
  {/* Stat 1 – Total Donations */}
  <motion.div
    whileHover={{ scale: 1.08 }}
    className="relative w-40 h-40 rounded-full flex flex-col items-center justify-center border-2 border-red-500/40 shadow-[0_0_25px_rgba(255,0,0,0.35)] hover:shadow-[0_0_40px_rgba(255,0,0,0.6)] transition-all duration-300"
  >
    <Droplet className="w-6 h-6 text-red-400 mb-2" />
    <span
  className={`text-3xl font-bold ${
    isDarkMode ? "text-white" : "text-[#1a0000]"
  }`}
>
  {totalDonations}
</span>
<p
  className={`text-sm mt-1 ${
    isDarkMode ? "text-gray-400" : "text-[#4a1f1f]"
  }`}
>
  Total Donations
</p>

    {/* soft halo animation */}
    <motion.div
      className="absolute inset-0 rounded-full bg-red-500/10 blur-2xl"
      animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.div>

  {/* Stat 2 – Last Donation */}
  <motion.div
    whileHover={{ scale: 1.08 }}
    className="relative w-40 h-40 rounded-full flex flex-col items-center justify-center border-2 border-red-500/40 shadow-[0_0_25px_rgba(255,0,0,0.35)] hover:shadow-[0_0_40px_rgba(255,0,0,0.6)] transition-all duration-300"
  >
    <CalendarClock className="w-6 h-6 text-red-400 mb-2" />
    <span
  className={`text-sm font-semibold ${
    isDarkMode ? "text-white" : "text-[#1a0000]"
  }`}
>
  {lastDonation}
</span>
<p
  className={`text-sm mt-1 ${
    isDarkMode ? "text-gray-400" : "text-[#4a1f1f]"
  }`}
>
  Last Donation
</p>

    <motion.div
      className="absolute inset-0 rounded-full bg-red-500/10 blur-2xl"
      animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.05, 1] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.div>

  {/* Stat 3 – Eligibility */}
  <motion.div
    whileHover={{ scale: 1.08 }}
    className="relative w-40 h-40 rounded-full flex flex-col items-center justify-center border-2 border-red-500/40 shadow-[0_0_25px_rgba(255,0,0,0.35)] hover:shadow-[0_0_40px_rgba(255,0,0,0.6)] transition-all duration-300"
  >
    <CheckCircle2
      className={`w-6 h-6 ${
        eligibility === "Eligible" ? "text-green-400" : "text-yellow-400"
      } mb-2`}
    />
    <span
  className={`text-lg font-semibold ${
    eligibility === "Eligible"
      ? isDarkMode
        ? "text-green-400"
        : "text-green-700"
      : isDarkMode
      ? "text-yellow-300"
      : "text-yellow-700"
  }`}
>
  {eligibility}
</span>
<p
  className={`text-sm mt-1 ${
    isDarkMode ? "text-gray-400" : "text-[#4a1f1f]"
  }`}
>
  Eligibility
</p>

    <motion.div
      className={`absolute inset-0 rounded-full ${
        eligibility === "Eligible" ? "bg-green-400/10" : "bg-yellow-400/10"
      } blur-2xl`}
      animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.05, 1] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.div>
</motion.div>
{/* Health Panel + Notifications */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 w-full">
  {/* Health Panel */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className={`p-6 rounded-2xl backdrop-blur-2xl border shadow-[0_0_15px_rgba(160,30,30,0.1)] ${
      isDarkMode ? "bg-white/10 border-white/10" : "bg-[#fff5f5] border-[#d38f8f]/80"
    }`}
  >
    <h3
      className={`text-lg font-semibold mb-4 ${
        isDarkMode ? "text-white" : "text-[#1a0000]"
      }`}
    >
      Health & Readiness
    </h3>

    <div className="grid grid-cols-2 gap-4">
      {[
        { label: "Hemoglobin", value: "14.5 g/dL", icon: "🩸" },
        { label: "Weight", value: "72 kg", icon: "⚖️" },
        { label: "Last Check-up", value: "2025-08-12", icon: "🏥" },
        { label: "Eligible In", value: "28 days", icon: "⏳" },
      ].map((item, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.03 }}
          className={`p-3 rounded-xl text-center transition ${
            isDarkMode
              ? "bg-white/5 hover:bg-white/15"
              : "bg-[#fff4f4]/70 hover:bg-[#ffecec]"
          }`}
        >
          <div className="text-2xl mb-1">{item.icon}</div>
          <div
            className={`font-semibold ${
              isDarkMode ? "text-white" : "text-[#1a0000]"
            }`}
          >
            {item.value}
          </div>
          <div
            className={`text-xs ${
              isDarkMode ? "text-gray-400" : "text-[#2e0000]"
            }`}
          >
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>

  {/* Notifications */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.9 }}
    className={`p-6 rounded-2xl backdrop-blur-2xl border shadow-[0_0_15px_rgba(160,30,30,0.1)] ${
      isDarkMode ? "bg-white/10 border-white/10" : "bg-[#fff5f5] border-[#d38f8f]/80"
    }`}
  >
    <h3
      className={`text-lg font-semibold mb-4 ${
        isDarkMode ? "text-white" : "text-[#1a0000]"
      }`}
    >
      Notifications
    </h3>

    <div className="flex flex-col gap-3">
      {[
        {
          icon: "📅",
          text: "Upcoming blood drive — Nov 22 2025 @ Downtown Center",
        },
        {
          icon: "📢",
          text: "Urgent O+ request from City Hospital — 5 donors needed",
        },
        {
          icon: "🎉",
          text: "Congrats! You’ve completed 5 successful donations 🎖️",
        },
      ].map((note, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          className={`p-3 rounded-xl flex items-start gap-3 transition ${
            isDarkMode
              ? "bg-white/5 hover:bg-white/15"
              : "bg-[#fff4f4]/70 hover:bg-[#ffecec]"
          }`}
        >
          <span className="text-xl">{note.icon}</span>
          <p
            className={`text-sm leading-snug ${
              isDarkMode ? "text-gray-300" : "text-[#2e0000]"
            }`}
          >
            {note.text}
          </p>
        </motion.div>
      ))}
    </div>
  </motion.div>
</div>
</div>
          </div>

          {/* Change Password */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="show"
            className={`rounded-2xl p-6 mt-8 backdrop-blur-2xl border shadow-[0_0_15px_rgba(160,30,30,0.1)] ${
              isDarkMode ? "bg-white/10 border-white/10" : "bg-[#fff5f5] border-[#d38f8f]/80"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-4 border-b pb-2 ${
                isDarkMode ? "text-white border-white/10" : "text-[#1a0000] border-[#a84b4b]/30"
              }`}
            >
              Change Password
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Old Password */}
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  placeholder="Old Password"
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`w-full p-3 pr-12 rounded-xl bg-transparent border focus:outline-none focus:ring-2 transition ${
                    isDarkMode
                      ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
                      : "border-[#a84b4b]/40 text-[#1a0000] placeholder-[#944343]/90 focus:ring-[#a84b4b]"
                  }`}
                />
                <button
                  type="button"
                  onMouseDown={() => setShowOld(true)}
                  onMouseUp={() => setShowOld(false)}
                  onMouseLeave={() => setShowOld(false)}
                  onTouchStart={() => setShowOld(true)}
                  onTouchEnd={() => setShowOld(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showOld ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  placeholder="New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full p-3 pr-12 rounded-xl bg-transparent border focus:outline-none focus:ring-2 transition ${
                    isDarkMode
                      ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
                      : "border-[#a84b4b]/40 text-[#1a0000] placeholder-[#944343]/90 focus:ring-[#a84b4b]"
                  }`}
                />
                <button
                  type="button"
                  onMouseDown={() => setShowNew(true)}
                  onMouseUp={() => setShowNew(false)}
                  onMouseLeave={() => setShowNew(false)}
                  onTouchStart={() => setShowNew(true)}
                  onTouchEnd={() => setShowNew(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showNew ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmNewPassword}
                  placeholder="Confirm New Password"
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className={`w-full p-3 pr-12 rounded-xl bg-transparent border focus:outline-none focus:ring-2 transition ${
                    isDarkMode
                      ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
                      : "border-[#a84b4b]/40 text-[#1a0000] placeholder-[#944343]/90 focus:ring-[#a84b4b]"
                  }`}
                />
                <button
                  type="button"
                  onMouseDown={() => setShowConfirm(true)}
                  onMouseUp={() => setShowConfirm(false)}
                  onMouseLeave={() => setShowConfirm(false)}
                  onTouchStart={() => setShowConfirm(true)}
                  onTouchEnd={() => setShowConfirm(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showConfirm ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {passwordError && (
              <p className="text-sm mt-3 text-red-400">{passwordError}</p>
            )}

            <div className="mt-5">
              <button
                onClick={handleChangePassword}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-400 text-white font-semibold shadow-lg hover:from-red-700 hover:to-red-500 transition"
              >
                Update Password
              </button>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="px-6 md:px-10 pb-8 text-center">
          <p className={`${isDarkMode ? "text-gray-500" : "text-[#2e0000]"} text-xs`}>
            © {new Date().getFullYear()} BloodNation — Together, we save lives.
          </p>
        </footer>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className={`w-full max-w-2xl rounded-2xl p-6 backdrop-blur-2xl border shadow-2xl ${
                isDarkMode ? "bg-white/10 border-white/10" : "bg-white/90 border-[#e6bdbd]/70"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 border-b pb-2 ${
                  isDarkMode ? "text-white border-white/10" : "text-[#1a0000] border-[#a84b4b]/30"
                }`}
              >
                Edit Profile Details
              </h3>

              <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={editData.firstName || ""}
                  onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  placeholder="First Name"
                  className={`p-3 rounded-xl bg-transparent border focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
                      : "border-[#a84b4b]/40 text-[#1a0000] placeholder-[#944343]/90 focus:ring-[#a84b4b]"
                  }`}
                />
                <input
                  type="text"
                  value={editData.lastName || ""}
                  onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                  placeholder="Last Name"
                  className={`p-3 rounded-xl bg-transparent border focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
                      : "border-[#a84b4b]/40 text-[#1a0000] placeholder-[#944343]/90 focus:ring-[#a84b4b]"
                  }`}
                />
                <input
                  type="text"
                  value={editData.fatherName || ""}
                  onChange={(e) => setEditData({ ...editData, fatherName: e.target.value })}
                  placeholder="Father's Name"
                  className={`md:col-span-2 p-3 rounded-xl bg-transparent border focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
                      : "border-[#a84b4b]/40 text-[#1a0000] placeholder-[#944343]/90 focus:ring-[#a84b4b]"
                  }`}
                />
                <input
                  type="number"
                  value={editData.age || ""}
                  onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                  placeholder="Age"
                  className={`p-3 rounded-xl bg-transparent border focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
                      : "border-[#a84b4b]/40 text-[#1a0000] placeholder-[#944343]/90 focus:ring-[#a84b4b]"
                  }`}
                />

                <select
                  value={editData.gender || ""}
                  onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                  className={`p-3 rounded-xl bg-transparent border focus:outline-none focus:ring-2 appearance-none ${
                    isDarkMode
                      ? "border-white/20 text-white focus:ring-red-500"
                      : "border-[#a84b4b]/40 text-[#1a0000] focus:ring-[#a84b4b]"
                  }`}
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option className={isDarkMode ? "bg-[#1a1a1a]" : ""} value="Male">
                    Male
                  </option>
                  <option className={isDarkMode ? "bg-[#1a1a1a]" : ""} value="Female">
                    Female
                  </option>
                  <option className={isDarkMode ? "bg-[#1a1a1a]" : ""} value="Other">
                    Other
                  </option>
                </select>

                <select
                  value={editData.bloodGroup || ""}
                  onChange={(e) => setEditData({ ...editData, bloodGroup: e.target.value })}
                  className={`p-3 rounded-xl bg-transparent border focus:outline-none focus:ring-2 appearance-none ${
                    isDarkMode
                      ? "border-white/20 text-white focus:ring-red-500"
                      : "border-[#a84b4b]/40 text-[#1a0000] focus:ring-[#a84b4b]"
                  }`}
                >
                  <option value="" disabled>
                    Select Blood Group
                  </option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((g) => (
                    <option key={g} value={g} className={isDarkMode ? "bg-[#1a1a1a]" : ""}>
                      {g}
                    </option>
                  ))}
                </select>

                <input
                  type="email"
                  value={editData.email || ""}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  placeholder="Email"
                  className={`md:col-span-2 p-3 rounded-xl bg-transparent border focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "border-white/20 text-white placeholder-gray-400 focus:ring-red-500"
                      : "border-[#a84b4b]/40 text-[#1a0000] placeholder-[#944343]/90 focus:ring-[#a84b4b]"
                  }`}
                />

                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className={`px-4 py-2 rounded-xl transition ${
                      isDarkMode
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : "bg-white text-[#1a0000] border border-[#e6bdbd] hover:bg-[#fff0f0]"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Profile;