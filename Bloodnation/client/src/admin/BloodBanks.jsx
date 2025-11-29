import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function BloodBanks() {
  const [bloodBank, setBloodBank] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [tableInfo, setTableInfo] = useState("Search for Blood Stock!");

  const navigate = useNavigate();

  

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const [errorStatus, setErrorStatus] = useState(false);

  const handleEdit = (bank) => {
    setEditData(bank);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    if (errorStatus == false) {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3000/admin/update/bloodbank",
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
            },
            body: JSON.stringify(editData),
          }
        );

        if(response.status == 200) {
          setIsEditModalOpen(false);
          fetchBloodBank();
        } else if(response.status == 401) {
          const responseBody = await response.json();
          const errorMessage = responseBody.message;
          alert(message);
        }
      } catch (error) {
        console.log("Error fetching /update/bloodbank: ", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

const stateCityMap = {
    "Alabama": ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"],
    "Alaska": ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
    "Arizona": ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"],
    "Arkansas": ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
    "California": ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno"],
    "Colorado": ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Boulder"],
    "Connecticut": ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury"],
    "Delaware": ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"],
    "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee"],
    "Georgia": ["Atlanta", "Savannah", "Augusta", "Macon", "Columbus"],
    "Hawaii": ["Honolulu", "Hilo", "Kailua", "Kapolei", "Kaneohe"],
    "Idaho": ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello"],
    "Illinois": ["Chicago", "Aurora", "Naperville", "Joliet", "Springfield"],
    "Indiana": ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Bloomington"],
    "Iowa": ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"],
    "Kansas": ["Wichita", "Overland Park", "Kansas City", "Topeka", "Olathe"],
    "Kentucky": ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"],
    "Louisiana": ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"],
    "Maine": ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"],
    "Maryland": ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Annapolis"],
    "Massachusetts": ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge"],
    "Michigan": ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing", "Flint"],
    "Minnesota": ["Minneapolis", "Saint Paul", "Rochester", "Duluth", "Bloomington"],
    "Mississippi": ["Jackson", "Gulfport", "Biloxi", "Hattiesburg", "Tupelo"],
    "Missouri": ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence"],
    "Montana": ["Billings", "Missoula", "Great Falls", "Bozeman", "Helena"],
    "Nebraska": ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
    "Nevada": ["Las Vegas", "Reno", "Henderson", "Carson City", "Sparks"],
    "New Hampshire": ["Manchester", "Nashua", "Concord", "Dover", "Rochester"],
    "New Jersey": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison"],
    "New Mexico": ["Albuquerque", "Santa Fe", "Las Cruces", "Roswell", "Farmington"],
    "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse"],
    "North Carolina": ["Charlotte", "Raleigh", "Durham", "Greensboro", "Wilmington"],
    "North Dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot", "Williston"],
    "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
    "Oklahoma": ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Lawton"],
    "Oregon": ["Portland", "Eugene", "Salem", "Gresham", "Medford"],
    "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Scranton"],
    "Rhode Island": ["Providence", "Warwick", "Cranston", "Pawtucket", "Newport"],
    "South Carolina": ["Charleston", "Columbia", "Greenville", "Myrtle Beach", "Spartanburg"],
    "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
    "Tennessee": ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"],
    "Texas": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"],
    "Utah": ["Salt Lake City", "Provo", "West Valley City", "Ogden", "St. George"],
    "Vermont": ["Burlington", "South Burlington", "Rutland", "Barre", "Montpelier"],
    "Virginia": ["Virginia Beach", "Norfolk", "Richmond", "Arlington", "Chesapeake"],
    "Washington": ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
    "West Virginia": ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
    "Wisconsin": ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Appleton"],
    "Wyoming": ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"],
    "District of Columbia": ["Washington D.C."]
  };

  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [citiesList, setCitiesList] = useState([]);

  const [editCitiesList, setEditCitiesList] = useState([]);

  useEffect(() => {
    setCitiesList(stateCityMap[state] || []);
  }, [state]);

  useEffect(() => {
    setEditCitiesList(stateCityMap[editData.state] || []);
  }, [editData.state]);

  useEffect(() => {
    const status = sessionStorage.getItem("admin");
    if (status == null) {
      navigate("/admin");
    }
  }, []);

  useEffect(() => {
    if (editData.bloodBankName == "" || editData.bankId == "" || editData.bankEmail == "" || editData.bloodBankCategory == "" || editData.licenseNumber == "" || editData.licenseValidity == "" || editData.contactPerson == "" || editData.contactNumber == "" || editData.address == "" || editData.state == "" || editData.city == "") {
      setErrorStatus(true);
    } else {
      setErrorStatus(false);
    }
  }, [editData]);

  const fetchBloodBank = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/admin/fetchBloodBank",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            state,
            city,
          }),
        }
      );
      const result = await response.json();
      if (result.length == 0) {
        setBloodBank([]);
        setTableInfo("No data available!");
      } else {
        setBloodBank(result);
        setTableInfo("");
      }
    } catch (error) {
      console.log("Fetch Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(bloodBank);
  }, [bloodBank])

  // On mount, load all banks (no state/city filters) so the table shows all by default
  useEffect(() => {
    fetchBloodBank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (docId) => {
    if (window.confirm("Do you want to delete this blood bank?")) {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3000/admin/delete/bloodbank",
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
            },
            body: JSON.stringify({ docId }),
          }
        );

        const responseStatus = response.status;
        if (responseStatus == 200) {
          return;
        } else if (responseStatus == 401) {
          const responseData = await response.json();
          alert(responseData.message);
        }
      } catch (error) {
        console.log("Error fetching /delete/bloodbank: ", error);
        setLoading(false);
      } finally {
        setLoading(false);
        fetchBloodBank();
      }
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
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 bg-app overflow-auto">
          <div className="flex items-center justify-between p-4 shadow">
            <h1 className="text-2xl font-semibold text-secondary">
              Blood Banks
            </h1>

            
          </div>

          {/* Search removed — showing all banks by default; keep the Filter section below */}

          {/* Filter Section (state & city filters only) */}
          <div className="px-6 pt-6">
            <div className="card card-animate p-4 mb-4">
              <h2 className="font-semibold text-secondary mb-4">Filter</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">State</label>
                  <select
                    value={state}
                    onChange={(e) => { setState(e.target.value); setCity(''); }}
                    className="w-full border p-2 rounded-md shadow hover:cursor-pointer"
                  >
                    <option value="" disabled>Select State</option>
                    {Object.keys(stateCityMap).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border p-2 rounded-md shadow hover:cursor-pointer"
                    disabled={!citiesList.length}
                  >
                    <option value="" disabled>Select City</option>
                    {citiesList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <button
                    className="btn-primary btn-animate px-4 py-2 rounded-md"
                    onClick={fetchBloodBank}
                  >
                    Apply
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-app text-secondary btn-animate"
                    onClick={() => { setFilterName(''); setFilterCategory(''); setState(''); setCity(''); fetchBloodBank(); }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-6 text-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-primary text-on-primary">
                  <tr>
                    <th className="px-4 py-2 border">Actions</th>
                    <th className="px-4 py-2 border">Blood Bank Name</th>
                    <th className="px-4 py-2 border">Bank ID</th>
                    <th className="px-4 py-2 border">Bank Email</th>
                    <th className="px-4 py-2 border">Blood Bank Category</th>
                    <th className="px-4 py-2 border">License Number</th>
                    <th className="px-4 py-2 border">License Validity</th>
                    <th className="px-4 py-2 border">Contact Person</th>
                    <th className="px-4 py-2 border">Contact Number</th>
                    <th className="px-4 py-2 border">Address</th>
                    <th className="px-4 py-2 border">State</th>
                    <th className="px-4 py-2 border">City</th>
                  </tr>
                </thead>
                <tbody>
                  {bloodBank.length === 0 ? (
                    <tr>
                      <td
                        colSpan="12"
                        className="text-center py-4 font-semibold text-primary"
                      >
                        {tableInfo}
                      </td>
                    </tr>
                  ) : (
                    bloodBank
                      .filter(
                        (bank) =>
                          (!filterName || bank.bloodBankName === filterName) &&
                          (!filterCategory ||
                            bank.bloodBankCategory === filterCategory)
                      )
                      .map((bank, index) => (
                        <tr key={bank.id || index} className="border-t row-appear">
                          <td className="px-4 py-2 border">
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
                          <td className="px-4 py-2 border">
                            {bank.bloodBankName}
                          </td>
                          <td className="px-4 py-2 border">{bank.bankId}</td>
                          <td className="px-4 py-2 border">{bank.bankEmail}</td>
                          <td className="px-4 py-2 border">
                            {bank.bloodBankCategory}
                          </td>
                          <td className="px-4 py-2 border">
                            {bank.licenseNumber}
                          </td>
                          <td className="px-4 py-2 border">
                            {bank.licenseValidity}
                          </td>
                          <td className="px-4 py-2 border">
                            {bank.contactPerson}
                          </td>
                          <td className="px-4 py-2 border">
                            {bank.contactNumber}
                          </td>
                          <td className="px-4 py-2 border">{bank.address}</td>
                          <td className="px-4 py-2 border">{bank.state}</td>
                          <td className="px-4 py-2 border">{bank.city}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex items-center justify-center z-30 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-center text-secondary mb-6">
              Edit Blood Bank Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Blood Bank Name
                </label>
                <input
                  type="text"
                  value={editData.bloodBankName}
                  onChange={(e) =>
                    setEditData({ ...editData, bloodBankName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Bank ID
                </label>
                <input
                  type="number"
                  value={editData.bankId}
                  onChange={(e) =>
                    setEditData({ ...editData, bankId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={editData.bankEmail}
                  onChange={(e) =>
                    setEditData({ ...editData, bankEmail: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={editData.bloodBankCategory}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 hover:cursor-pointer"
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      bloodBankCategory: e.target.value,
                    })
                  }
                >
                  <option value="">Select Blood Bank Category</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="NGO">NGO</option>
                  <option value="Hospital-based">Hospital-based</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  License Number
                </label>
                <input
                  type="number"
                  value={editData.licenseNumber}
                  onChange={(e) =>
                    setEditData({ ...editData, licenseNumber: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  License Validity
                </label>
                <input
                  type="date"
                  value={editData.licenseValidity}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      licenseValidity: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={editData.contactPerson}
                  onChange={(e) =>
                    setEditData({ ...editData, contactPerson: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="number"
                  value={editData.contactNumber}
                  onChange={(e) =>
                    setEditData({ ...editData, contactNumber: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  value={editData.address}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                ></textarea>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  State
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 hover:cursor-pointer"
                  value={editData.state}
                  onChange={(e) =>
                    setEditData({ ...editData, state: e.target.value })
                  }
                >
                  <option value="" disabled>
  Select State
</option>
<option value="Alabama">Alabama</option>
<option value="Alaska">Alaska</option>
<option value="Arizona">Arizona</option>
<option value="Arkansas">Arkansas</option>
<option value="California">California</option>
<option value="Colorado">Colorado</option>
<option value="Connecticut">Connecticut</option>
<option value="Delaware">Delaware</option>
<option value="Florida">Florida</option>
<option value="Georgia">Georgia</option>
<option value="Hawaii">Hawaii</option>
<option value="Idaho">Idaho</option>
<option value="Illinois">Illinois</option>
<option value="Indiana">Indiana</option>
<option value="Iowa">Iowa</option>
<option value="Kansas">Kansas</option>
<option value="Kentucky">Kentucky</option>
<option value="Louisiana">Louisiana</option>
<option value="Maine">Maine</option>
<option value="Maryland">Maryland</option>
<option value="Massachusetts">Massachusetts</option>
<option value="Michigan">Michigan</option>
<option value="Minnesota">Minnesota</option>
<option value="Mississippi">Mississippi</option>
<option value="Missouri">Missouri</option>
<option value="Montana">Montana</option>
<option value="Nebraska">Nebraska</option>
<option value="Nevada">Nevada</option>
<option value="New Hampshire">New Hampshire</option>
<option value="New Jersey">New Jersey</option>
<option value="New Mexico">New Mexico</option>
<option value="New York">New York</option>
<option value="North Carolina">North Carolina</option>
<option value="North Dakota">North Dakota</option>
<option value="Ohio">Ohio</option>
<option value="Oklahoma">Oklahoma</option>
<option value="Oregon">Oregon</option>
<option value="Pennsylvania">Pennsylvania</option>
<option value="Rhode Island">Rhode Island</option>
<option value="South Carolina">South Carolina</option>
<option value="South Dakota">South Dakota</option>
<option value="Tennessee">Tennessee</option>
<option value="Texas">Texas</option>
<option value="Utah">Utah</option>
<option value="Vermont">Vermont</option>
<option value="Virginia">Virginia</option>
<option value="Washington">Washington</option>
<option value="West Virginia">West Virginia</option>
<option value="Wisconsin">Wisconsin</option>
<option value="Wyoming">Wyoming</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  City
                </label>
                <select
                  name="city"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 hover:cursor-pointer"
                  value={editData.city}
                  onChange={(e) =>
                    setEditData({ ...editData, city: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select City
                  </option>
                  {editCitiesList.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-md bg-app text-secondary btn-animate"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 rounded-md btn-primary btn-animate text-on-primary"
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

export default BloodBanks;
