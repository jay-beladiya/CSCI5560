import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function BloodBankLogin() {
  const [bankId, setBankId] = useState("");
  const [bankIdErr, setBankIdErr] = useState("");

  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userStatus = sessionStorage.getItem("user");
    const bankStatus = sessionStorage.getItem("bank");
    const userToken = localStorage.getItem("token");
    const bankToken = localStorage.getItem("bankToken");
    if (userStatus) {
      navigate("/profile");
    } else if (bankStatus) {
      navigate("/bloodBankProfile");
    } else if (userToken && !userStatus) {
      sessionStorage.setItem("user", true);
      navigate("/home");
    } else if (bankToken && !bankToken) {
      sessionStorage.setItem("bank", true);
      navigate("/home");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/bloodbank/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bankId, password }),
        }
      );
      const data = await response.json();
      const token = data.token;
      const message = data.message;

      if (token && token !== false) {
        localStorage.setItem("bankToken", token);
        sessionStorage.setItem("bank", true);
        navigate("/bloodBankProfile");
      } else {
        alert(message);
        if (token === null) {
          setBankId("");
          setPassword("");
          navigate("/");
        } else if (token === false) {
          setPassword("");
        }
      }
    } catch (error) {
      console.log("Fetch api/bloodbank/login error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-primary-100">
          <div className="flex flex-col items-center justify-center bg-white/30 p-8 rounded-2xl shadow-2xl border border-white/40 backdrop-blur-lg">
            <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
          </div>
        </div>
      )}
  <section className="h-screen bg-primary-100 flex justify-center items-center">
        <span className="absolute text-2xl font-sans font-bold top-3 left-3 hover:underline">
          <Link to="/">&larr; Home</Link>
        </span>
        <h1 className="absolute top-20 font-extrabold font-sans text-4xl">
          Blood Bank Login
        </h1>
  <div className="flex justify-center items-center h-1/2 w-1/3 bg-app backdrop-saturate-150 backdrop-blur-md shadow-lg">
          <form
            onSubmit={handleLogin}
            className="flex flex-col justify-around h-4/5 w-2/3"
          >
            <input
              type="text"
              value={bankId}
              onChange={(e) => setBankId(e.target.value)}
              required
              placeholder="Blood Bank ID"
              className="p-2 rounded-2xl bg-white"
            />
            {bankIdErr && <p className="text-primary text-xs">{bankIdErr}</p>}
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="p-2 rounded-2xl bg-white"
            />
            {passwordErr && (
              <p className="text-primary text-xs">{passwordErr}</p>
            )}
            <div className="flex justify-between">
              <span>
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword((prev) => !prev)}
                  className="size-4"
                />
                <span className="hover:cursor-default font-medium text-sm ml-2 items-center">
                  Show Password
                </span>
              </span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-30 h-10 self-center rounded-2xl btn-primary btn-animate ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              Login
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default BloodBankLogin;
