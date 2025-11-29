import React, { useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function AdminPanel() {

  const navigate = useNavigate();
  

  useEffect(() => {
    const status = sessionStorage.getItem("admin");

    if (status == null) {
      navigate('/admin')
    }
  }, [])

  return (
    <>
      <div className="flex h-screen">
      <Sidebar />
        <div className="flex-1 bg-app">
          <div className="flex items-center justify-between p-4 border-b shadow">
            <h1 className="text-2xl font-semibold text-secondary">
              Main Content
            </h1>

            
          </div>
          <div className="p-6 text-gray-800">
            <p>Details about website server uptime, users interaction, api calls, etcetra will be available here soon.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPanel;
