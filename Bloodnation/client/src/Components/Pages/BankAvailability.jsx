import React, { useEffect, useState } from "react";
import LoggedBankNavbar from "../Common/Navbar/LoggedBankNavbar";

function BankAvailability() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [newBloodGroup, setNewBloodGroup] = useState("");
  const [newBloodType, setNewBloodType] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [editId, setEditId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [bloodStockList, setBloodStockList] = useState([]);
  const [filteredBloodStockList, setFilteredBloodStockList] = useState([]);
  const [filterBloodGroup, setFilterBloodGroup] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [errorStatus1, setErrorStatus1] = useState(false);
  const [errorStatus2, setErrorStatus2] = useState(false);

  const [modalErrorStatus, setModalErrorStatus] = useState(false);

  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setBloodGroup("");
    setBloodType("");
    setQuantity("");
    setEditId(null);
    setShowModal(false);
  };

  const fetchStockList = async () => {
    setLoading(true);
    try {
      const bankToken = localStorage.getItem("bankToken");
      const response = await fetch(
        "http://localhost:3000/api/fetch/bloodstock",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bankToken}`,
          },
        }
      );

      const object = await response.json();
      const data = object.response;
      setBloodStockList(data);
    } catch (error) {
      console.log("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockList();
  }, []);

  useEffect(() => {
    // Apply filters to bloodStockList
    let filtered = [...bloodStockList];
    
    if (filterBloodGroup) {
      filtered = filtered.filter(stock => stock.bloodGroup === filterBloodGroup);
    }
    
    if (filterBloodType) {
      filtered = filtered.filter(stock => stock.bloodType === filterBloodType);
    }
    
    setFilteredBloodStockList(filtered);
  }, [bloodStockList, filterBloodGroup, filterBloodType]);

  useEffect(() => {
    const duplicateExists = bloodStockList.some(
      (item) => item.bloodGroup === bloodGroup && item.bloodType === bloodType
    );
    if (duplicateExists) {
      setErrorMessage(
        "This blood group and type already exists, please update instead."
      );
      setErrorStatus1(true);
    } else {
      setErrorMessage("");
      setErrorStatus1(false);
    }
  }, [bloodGroup, bloodType, bloodStockList]);

  useEffect(() => {
    if(bloodGroup == "" || bloodType == "" || quantity == "") {
      setErrorStatus2(true);
    } else {
      setErrorStatus2(false);
    }
  }, [bloodGroup, bloodType, quantity])

  useEffect(() => {
    if (newBloodGroup == "" || newBloodType == "" || newQuantity == "") {
      setModalErrorStatus(true);
    } else {
      setModalErrorStatus(false);
    }
  }, [bloodGroup, bloodType, quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bankToken = localStorage.getItem("bankToken");

    if (errorStatus1 == false && errorStatus2 == false) {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3000/api/add/bloodstock",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${bankToken}`,
            },
            body: JSON.stringify({ bloodGroup, bloodType, quantity }),
          }
        );

        resetForm();
        fetchStockList();
      } catch (error) {
        console.log("Error submitting the bank data: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (stock) => {
    setNewBloodGroup(stock.bloodGroup);
    setNewBloodType(stock.bloodType);
    setNewQuantity(stock.quantity);
    setEditId(stock.id);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const bankToken = localStorage.getItem("bankToken");
    try {
      const response = await fetch(
        "http://localhost:3000/api/update/bloodstock",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            editId,
            newBloodGroup,
            newBloodType,
            newQuantity,
          }),
        }
      );

      const responseData = await response.json();
      const message = responseData.message;

      resetForm();
      fetchStockList();
    } catch (error) {
      console.log("Error fetching /update/bloodstock: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (stockId) => {
    if (window.confirm("Do you want to delete this bloodstock?")) {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3000/api/delete/bloodstock",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ stockId }),
          }
        );

        const responseData = await response.json();
        const message = responseData.message;

        resetForm();
        fetchStockList();
      } catch (error) {
        console.log("Error fetching /delete/bloodstock: ", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <LoggedBankNavbar />
      {loading && (
        <div className="fixed inset-0 z-51 flex items-center justify-center backdrop-blur-md bg-primary-100">
          <div className="flex flex-col items-center justify-center bg-white/30 p-8 rounded-2xl shadow-2xl border border-white/40 backdrop-blur-lg">
            <div className="w-10 h-10 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <section className="min-h-[89vh] bg-app px-6 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Form Section */}
          <div className="card card-animate p-6 mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-primary">
                Add Blood Stock
              </h2>
              <div className="flex gap-4 items-center">
                <select
                  className="p-2 border border-gray-300 rounded-md hover:cursor-pointer text-sm"
                  value={filterBloodGroup}
                  onChange={(e) => setFilterBloodGroup(e.target.value)}
                >
                  <option value="">All Blood Groups</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>

                <select
                  className="p-2 border border-gray-300 rounded-md hover:cursor-pointer text-sm"
                  value={filterBloodType}
                  onChange={(e) => setFilterBloodType(e.target.value)}
                >
                  <option value="">All Blood Types</option>
                  <option value="Whole Blood">Whole Blood</option>
                  <option value="Single Donor Platelet">Single Donor Platelet</option>
                  <option value="Single Donor Plasma">Single Donor Plasma</option>
                  <option value="Sagm Packed Red Blood Cells">Sagm Packed Red Blood Cells</option>
                  <option value="Random Donor Platelets">Random Donor Platelets</option>
                  <option value="Platelet Rich Plasma">Platelet Rich Plasma</option>
                  <option value="Platelet Concentrate">Platelet Concentrate</option>
                  <option value="Plasma">Plasma</option>
                  <option value="Packed Red Blood Cells">Packed Red Blood Cells</option>
                  <option value="Leukoreduced RBC">Leukoreduced RBC</option>
                  <option value="Irradiated RBC">Irradiated RBC</option>
                  <option value="Fresh Frozen Plasma">Fresh Frozen Plasma</option>
                  <option value="Cryoprecipitate">Cryoprecipitate</option>
                  <option value="Cryo Poor Plasma">Cryo Poor Plasma</option>
                </select>

                <button
                  onClick={() => {
                    setFilterBloodGroup("");
                    setFilterBloodType("");
                  }}
                  className="px-3 py-2 bg-app text-secondary rounded-md btn-animate text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">
                    Blood Group
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md hover:cursor-pointer"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="" disabled>
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

                <div>
                  <label className="block text-sm font-medium text-muted mb-1">
                    Blood Type
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md hover:cursor-pointer"
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Blood Type
                    </option>
                    <option value="Whole Blood">Whole Blood</option>
                    <option value="Single Donor Platelet">
                      Single Donor Platelet
                    </option>
                    <option value="Single Donor Plasma">
                      Single Donor Plasma
                    </option>
                    <option value="Sagm Packed Red Blood Cells">
                      Sagm Packed Red Blood Cells
                    </option>
                    <option value="Random Donor Platelets">
                      Random Donor Platelets
                    </option>
                    <option value="Platelet Rich Plasma">
                      Platelet Rich Plasma
                    </option>
                    <option value="Platelet Concentrate">
                      Platelet Concentrate
                    </option>
                    <option value="Plasma">Plasma</option>
                    <option value="Packed Red Blood Cells">
                      Packed Red Blood Cells
                    </option>
                    <option value="Leukoreduced RBC">Leukoreduced RBC</option>
                    <option value="Irradiated RBC">Irradiated RBC</option>
                    <option value="Fresh Frozen Plasma">
                      Fresh Frozen Plasma
                    </option>
                    <option value="Cryoprecipitate">Cryoprecipitate</option>
                    <option value="Cryo Poor Plasma">Cryo Poor Plasma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 5"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>
                <div className="text-center">
                {errorMessage && (
                  <p className=" text-primary text-md mb-2">{errorMessage}</p>
                )}
                <button
                  type="submit"
                  className="btn-primary btn-animate text-on-primary font-semibold px-6 py-2 rounded-md transition hover:cursor-pointer"
                >
                  {editId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>

          {/* Table Section */}
          <div className="card p-6 rounded-2xl">
            <h2 className="text-xl font-semibold text-center text-primary mb-4">
              Current Blood Stock
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm shadow-sm">
                <thead className="bg-primary text-on-primary">
                  <tr>
                    <th className="border px-4 py-3 text-center">
                      Blood Group
                    </th>
                    <th className="border px-4 py-3 text-center">Blood Type</th>
                    <th className="border px-4 py-3 text-center">Quantity</th>
                    <th className="border px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bloodStockList.length === 0 ? (
                    <tr>
                      <td
                          colSpan="4"
                          className="text-center py-4 text-muted"
                        >
                        No blood stock available.
                      </td>
                    </tr>
                    ) : (
                    filteredBloodStockList.map((bank) => (
                      <tr key={bank.id} className="hover:bg-primary-100 transition row-appear">
                        <td className="border px-4 py-2 text-center">
                          {bank.bloodGroup}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {bank.bloodType}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {bank.quantity}
                        </td>
                          <td className="border px-4 py-2 text-center">
                          <button
                            onClick={() => handleEdit(bank)}
                            className="text-primary hover:underline mr-4 hover:cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(bank.id)}
                            className="text-primary hover:underline hover:cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="card card-animate border border-gray-200 shadow-xl rounded-xl p-6 w-[90%] max-w-lg">
              <h3 className="text-lg font-semibold text-primary mb-4 text-center">
                Edit Blood Stock
              </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  className="p-2 border border-gray-300 rounded-md hover:cursor-pointer"
                  value={newBloodGroup}
                  onChange={(e) => setNewBloodGroup(e.target.value)}
                >
                  <option value="" disabled>
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

                <select
                  className="p-2 border border-gray-300 rounded-md hover:cursor-pointer"
                  value={newBloodType}
                  onChange={(e) => setNewBloodType(e.target.value)}
                >
                  <option value="" disabled>
                    Select Blood Type
                  </option>
                  <option value="Whole Blood">Whole Blood</option>
                  <option value="Single Donor Platelet">
                    Single Donor Platelet
                  </option>
                  <option value="Single Donor Plasma">
                    Single Donor Plasma
                  </option>
                  <option value="Sagm Packed Red Blood Cells">
                    Sagm Packed Red Blood Cells
                  </option>
                  <option value="Random Donor Platelets">
                    Random Donor Platelets
                  </option>
                  <option value="Platelet Rich Plasma">
                    Platelet Rich Plasma
                  </option>
                  <option value="Platelet Concentrate">
                    Platelet Concentrate
                  </option>
                  <option value="Plasma">Plasma</option>
                  <option value="Packed Red Blood Cells">
                    Packed Red Blood Cells
                  </option>
                  <option value="Leukoreduced RBC">Leukoreduced RBC</option>
                  <option value="Irradiated RBC">Irradiated RBC</option>
                  <option value="Fresh Frozen Plasma">
                    Fresh Frozen Plasma
                  </option>
                  <option value="Cryoprecipitate">Cryoprecipitate</option>
                  <option value="Cryo Poor Plasma">Cryo Poor Plasma</option>
                </select>

                <input
                  type="number"
                  className="p-2 border border-gray-300 rounded-md"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  placeholder="Quantity"
                />
              </div>

                <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-md bg-app text-secondary btn-animate"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 btn-primary text-on-primary rounded-md btn-animate"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default BankAvailability;
