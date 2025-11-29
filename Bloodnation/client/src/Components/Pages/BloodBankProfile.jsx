import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoggedNavbar from "../Common/Navbar/LoggedNavbar";
import LoggedBankNavbar from "../Common/Navbar/LoggedBankNavbar";

function BloodBankProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [bloodBankName, setBloodBankName] = useState();
  const [bankId, setBankId] = useState();
  const [bankEmail, setBankEmail] = useState();
  const [bloodBankCategory, setBloodBankCategory] = useState();
  const [licenseNumber, setLicenseNumber] = useState();
  const [licenseValidity, setLicenseValidity] = useState();
  const [contactPerson, setContactPerson] = useState();
  const [contactNumber, setContactNumber] = useState();
  const [address, setAddress] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      const token = localStorage.getItem("bankToken");
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:3000/api/verify/bloodbank",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const responseJSON = await response.json();
          const data = responseJSON.response;

          if (data) {
            setBloodBankName(data.bloodBankName);
            setBankId(data.bankId);
            setBankEmail(data.bankEmail);
            setBloodBankCategory(data.bloodBankCategory);
            setLicenseNumber(data.licenseNumber);
            setLicenseValidity(data.licenseValidity);
            setContactPerson(data.contactPerson);
            setContactNumber(data.contactNumber);
            setAddress(data.address);
            setState(data.state);
            setCity(data.city);
          } else {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/bloodBankLogin");
          }
        } catch (error) {
          console.log("Fetching /api/verify/bloodbank Error: ", error);
          navigate("/home");
          localStorage.clear();
          sessionStorage.clear();
        } finally {
          setLoading(false);
        }
      } else {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/home");
      }
    };

    verifyUser();
  }, []);

  useEffect(() => {
    if(oldPassword && newPassword && confirmNewPassword == "") {
      setErrorStatus(true);
    } else if (newPassword !== confirmNewPassword) {
      setPasswordError("New Password didn't match!");
      setErrorStatus(true);
    } else {
      setPasswordError("");
      setErrorStatus(false);
    }
  }, [oldPassword, newPassword, confirmNewPassword]);

  const handleChangePassword = async () => {
    if (errorStatus === false) {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3000/api/bloodbank/changePassword",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bankId,
              oldPassword,
              newPassword,
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
      <LoggedBankNavbar />
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-primary-100">
          <div className="flex flex-col items-center justify-center bg-white/30 p-8 rounded-2xl shadow-2xl border border-white/40 backdrop-blur-lg">
            <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <section className="min-h-[89vh] bg-app">
        {/* Dashboard Header */}
        <div className="flex justify-center items-center pt-8 pb-6 card">
          <span className="font-bold text-3xl text-gray-800 tracking-wide border-b-4 border-primary pb-1">
            DASHBOARD
          </span>
        </div>

        {/* Profile Details Section */}
        <div className="flex justify-center items-start gap-10 px-6 py-10 flex-wrap">
          {/* Your Details Card */}
          <div className="card p-6 rounded-2xl max-w-3xl w-full">
            <h2 className="text-xl font-semibold text-primary mb-4 text-center border-b-2 border-primary pb-2">
              Bank Details
            </h2>
            <div className="flex flex-col gap-3 text-gray-700 text-base">
              <div className="flex justify-between">
                <span className="font-medium">Blood Bank Name:</span>
                <span>{bloodBankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Bank ID:</span>
                <span>{bankId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{bankEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Blood Bank Category:</span>
                <span>{bloodBankCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">License Number:</span>
                <span>{licenseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">License Validity:</span>
                <span>{licenseValidity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Contact Person:</span>
                <span>{contactPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Contact Number:</span>
                <span>{contactNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Address:</span>
                <span>{address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">State:</span>
                <span>{state}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">City:</span>
                <span>{city}</span>
              </div>
            </div>
          </div>

          {/* Additional Details Card */}
          <div className="card p-6 rounded-2xl max-w-lg w-full">
            <h2 className="text-xl font-semibold text-primary mb-4 text-center border-b-2 border-primary pb-2">
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
                <p className=" text-primary text-xs">{passwordError}</p>
              )}
              <button
                onClick={handleChangePassword}
                className="p-2 w-1/4 btn-primary btn-animate text-on-primary rounded-2xl"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BloodBankProfile;
