import React, { useState, useEffect } from "react";
import LoggedNavbar from "../Common/Navbar/LoggedNavbar";
import { useNavigate } from "react-router-dom";

function Profile() {
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

  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const [modalErrorStatus, setModalErrorStatus] = useState(false);

  const handleEdit = () => {
    setEditData({
      firstName,
      lastName,
      fatherName,
      age,
      bloodGroup,
      email,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditData({});
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (modalErrorStatus == false) {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:3000/api/updateProfile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(editData),
          }
        );

        if (response.status == 200) {
          return;
        } else if (response.status == 401) {
          const responseData = await response.json();
          alert(responseData.message);
        }
      } catch (error) {
        console.log("Error updating profile:", error);
        setLoading(false);
        handleCloseModal();
      } finally {
        setLoading(false);
        fetchUser();
        handleCloseModal();
      }
    }
  };

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

        if (status == 200) {
          const responseJSON = await response.json();
          const data = responseJSON.response;

          setFirstName(data.firstName);
          setLastName(data.lastName);
          setFatherName(data.fatherName);
          setGender(data.gender);
          setAge(data.age);
          setBloodGroup(data.bloodGroup);
          setEmail(data.email);
        } else if(status == 404) {
          alert("Email changed, please login again!");
          localStorage.clear();
          sessionStorage.clear();
          navigate('/login');
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
        navigate("/home");
        localStorage.clear();
        sessionStorage.clear();
      } finally {
        setLoading(false);
      }
    } else {
      localStorage.clear();
      navigate("/home");
    }
  };

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
  }, [oldPassword, newPassword, confirmNewPassword]);

  const handleChangePassword = async () => {
    setLoading(true);
    if (errorStatus == false) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/changePassword",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              oldPassword: oldPassword,
              newPassword: newPassword,
            }),
          }
        );

        const data = await response.json();
        const message = data.message;

        alert(message);

        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } catch (error) {
        console.log("Fetch Error: ", error);
      } finally {
        setLoading(false);
      }
    } else if (errorStatus == true) {
      setLoading(false);
    }
  };

  return (
    <>
      <LoggedNavbar />
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-red-200/30">
          <div className="flex flex-col items-center justify-center bg-white/30 p-8 rounded-2xl shadow-2xl border border-white/40 backdrop-blur-lg">
            <div className="w-10 h-10 border-4 border-t-transparent border-red-400 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <section className="min-h-[89vh] bg-red-50">
        {/* Dashboard Header */}
        <div className="flex justify-center items-center pt-8 pb-6 bg-white shadow-md">
          <span className="font-bold text-3xl text-gray-800 tracking-wide border-b-4 border-red-400 pb-1">
            DASHBOARD
          </span>
        </div>

        {/* Profile Details Section */}
        <div className="flex justify-center items-start gap-10 px-6 py-10 flex-wrap">
          {/* Your Details Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold text-red-600 mb-4 text-center border-b-2 border-red-400 pb-2">
              Your Details
            </h2>
            <div className="flex flex-col gap-3 text-gray-700 text-base">
              <div className="flex justify-between">
                <span className="font-medium">First Name:</span>
                <span>{firstName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Name:</span>
                <span>{lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Father's Name:</span>
                <span>{fatherName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Gender:</span>
                <span>{gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Age:</span>
                <span>{age}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Blood Group:</span>
                <span>{bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{email}</span>
              </div>
              <button
                onClick={handleEdit}
                className="mt-6 px-4 py-2 bg-red-400 text-white font-medium rounded-lg shadow hover:bg-red-500 transition-all hover:cursor-pointer"
              >
                Edit Details
              </button>
            </div>
          </div>

          {/* Additional Details Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold text-red-600 mb-4 text-center border-b-2 border-red-400 pb-2">
              Change Password
            </h2>
            <div className="flex flex-col items-center gap-3 text-gray-700 text-base">
              <input
                type="text"
                value={oldPassword}
                placeholder="Old Password"
                onChange={(e) => setOldPassword(e.target.value)}
                className="border p-2 rounded-md w-full"
              />
              <input
                type="text"
                value={newPassword}
                placeholder="New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 rounded-md w-full"
              />
              <input
                type="text"
                value={confirmNewPassword}
                placeholder="Confirm New Password"
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="border p-2 rounded-md w-full"
              />
              {passwordError && (
                <p className=" text-red-500 text-xs">{passwordError}</p>
              )}
              <button
                onClick={handleChangePassword}
                className="p-2 w-1/4 bg-red-300 rounded-2xl shadow-sm shadow-black/20 hover:bg-red-400 hover:shadow-md cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal section */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center overflow-auto">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full shadow-xl">
            <h2 className="text-xl text-center font-semibold text-red-600 mb-4 border-b pb-2">
              Edit Profile Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={editData.firstName}
                  onChange={(e) =>
                    setEditData({ ...editData, firstName: e.target.value })
                  }
                  className="w-full border p-2 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editData.lastName}
                  onChange={(e) =>
                    setEditData({ ...editData, lastName: e.target.value })
                  }
                  className="w-full border p-2 rounded-md"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Name
                </label>
                <input
                  type="text"
                  value={editData.fatherName}
                  onChange={(e) =>
                    setEditData({ ...editData, fatherName: e.target.value })
                  }
                  className="w-full border p-2 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  value={editData.age}
                  onChange={(e) =>
                    setEditData({ ...editData, age: e.target.value })
                  }
                  className="w-full border p-2 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group
                </label>
                <select
                  value={editData.bloodGroup}
                  onChange={(e) =>
                    setEditData({ ...editData, bloodGroup: e.target.value })
                  }
                  className="w-full border p-2 rounded-md hover:cursor-pointer"
                >
                  <option value="">Select Blood Group</option>
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

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="w-full border p-2 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 hover:cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
