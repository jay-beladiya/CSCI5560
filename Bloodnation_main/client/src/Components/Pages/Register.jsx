import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [age, setAge] = useState();
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");

  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setFatherName('');
    setAge('');
    setGender('');
    setBloodGroup('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  useEffect(() => {
    const userStatus = sessionStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (userStatus) {
      navigate("/profile");
    } else if (token && !userStatus) {
      sessionStorage.setItem("user", true);
      navigate("/home");
    }
  }, []);

  useEffect(() => {
    if (password.length == 0) {
      setPasswordError("");
      setError(true);
    } else if (password.length < 6) {
      setPasswordError("Password must contain more than 6 characters!");
      setError(true);
    } else if (confirmPassword === "") {
      setPasswordError("");
      setError(true);
    } else if (password !== confirmPassword) {
      setPasswordError("Both Passwords didn't match!");
      setError(true);
    } else {
      setPasswordError("");
      setError(false);
    }
  }, [password, confirmPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if(error == false) {
      try {
        const response = await fetch("http://localhost:3000/api/user/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            fatherName: fatherName,
            age: age,
            gender: gender,
            bloodGroup: bloodGroup,
            email: email,
            password: password,
          }),
      });
      
      const data = await response.json();
      const token = data.token;
      
      if (token == true) {
        const message = data.message;
        alert(message);
      } else {
        localStorage.setItem("token", token);
        sessionStorage.setItem("user", true);
        navigate("/profile");
      }
    } catch (error) {
      console.log("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  } else if(error == true) {
    setLoading(false);
  }
  };
  
  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-red-200/30">
          <div className="flex flex-col items-center justify-center bg-white/30 p-8 rounded-2xl shadow-2xl border border-white/40 backdrop-blur-lg">
            <div className="w-10 h-10 border-4 border-t-transparent border-red-400 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <section className=" h-screen bg-red-50 flex justify-center items-center">
        <span className=" absolute text-2xl font-sans font-bold top-3 left-3">
          <Link to="/" className="hover:underline">
            &larr; Home
          </Link>
          /
          <Link to="/login" className="hover:underline">
            {" "}
            Login
          </Link>
        </span>
        <h1 className=" absolute top-10 font-extrabold font-sans text-4xl">
          Donor Sign-up
        </h1>
        <div className=" flex justify-center items-center h-2/3 w-1/2 bg-green-200/80 backdrop-saturate-150 backdrop-blur-md shadow-lg">
          <div className="flex justify-center items-center w-3/4 h-full">
            <form
              onSubmit={handleRegister}
              className="h-full flex flex-col justify-center align-center"
            >
              <div className="h-3/6 overflow-x-scroll w-max scrollbar-hide-x">
                <div className="grid grid-cols-2">
                  <input
                    type="text"
                    className=" p-2 m-2 ml-0 rounded-2xl bg-white"
                    value={firstName}
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    type="text"
                    className=" p-2 m-2 mr-0 rounded-2xl bg-white"
                    value={lastName}
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <input
                    type="text"
                    className=" p-2 m-2 ml-0 rounded-2xl bg-white"
                    value={fatherName}
                    placeholder="Father's Name"
                    onChange={(e) => setFatherName(e.target.value)}
                  />
                  <input
                    type="number"
                    className=" p-2 m-2 mr-0 rounded-2xl bg-white"
                    value={age}
                    placeholder="Age"
                    onChange={(e) => setAge(e.target.value)}
                  />
                  <select
                    className=" p-2 m-2 ml-0 rounded-2xl bg-white"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="" selected disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <select
                    className=" p-2 m-2 mr-0 rounded-2xl bg-white"
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="" selected disabled>
                      Select Blood Group
                    </option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="flex justify-center items-center flex-col">
                  <input
                    type="email"
                    className=" w-full p-2 m-2 rounded-2xl bg-white"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 m-2 rounded-2xl bg-white"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 m-2 rounded-2xl bg-white"
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {passwordError && (
                    <p className=" text-red-500 text-xs">{passwordError}</p>
                  )}
                </div>
              </div>
              <span className="mt-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword((prev) => !prev)}
                  className=" self-center size-3"
                />
                <span className=" hover:cursor-default font-medium text-sm ml-2">
                  Show Password
                </span>
              </span>
              <button
                type="submit"
                className=" mt-4 w-30 h-10 self-center rounded-2xl bg-red-200 hover:shadow-xl hover:cursor-pointer hover:bg-red-300"
              >
                Register
              </button>
              <span className="text-sm font-medium text-center mt-4">
                Already have an account?{" "}
                <span className="underline hover:text-red-600">
                  <Link to="/login">Login</Link>
                </span>
              </span>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;
