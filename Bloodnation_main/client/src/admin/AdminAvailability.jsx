import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function AdminAvailability() {
  const [bloodStock, setBloodStock] = useState([]);

  const [loading, setLoading] = useState(false);
  const [tableInfo, setTableInfo] = useState("Search for Blood Stock!");

  const [filterName, setFilterName] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterType, setFilterType] = useState("");

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
          "http://localhost:3000/admin/update/bloodstock",
          {
            method: "POST",
            headers: {
              "Content-Type": "Application/json",
            },
            body: JSON.stringify(editData),
          }
        );

        if (response.status == 200) {
          setIsEditModalOpen(false);
          fetchBloodStock();
        } else if (response.status == 401) {
          const responseData = await response.json();
          const errorMessage = responseData.message;
          alert(message);
        }
      } catch (error) {
        console.log("Error fetching /update/bloodstock: ", error);
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

  useEffect(() => {
    setCitiesList(stateCityMap[state] || []);
  }, [state]);

  useEffect(() => {
    if (
      editData.bloodGroup == "" ||
      editData.bloodType == "" ||
      editData.quantity == ""
    ) {
      setErrorStatus(true);
    } else {
      setErrorStatus(false);
    }
  }, [editData]);

  useEffect(() => {
    const status = sessionStorage.getItem("admin");
    if (status == null) {
      navigate("/admin");
    }
  }, []);

  const fetchBloodStock = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/admin/fetchBloodStock",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state,
            city,
          }),
        }
      );
      const result = await response.json();
      if (result.length == 0) {
        setBloodStock([]);
        setTableInfo("No data available!");
      } else {
        setBloodStock(result);
        setTableInfo("");
      }
    } catch (error) {
      console.log("Fetch Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (window.confirm("Do you want to delete this blood stock?")) {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3000/admin/delete/bloodstock",
          {
            method: "post",
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
        console.log("Error fetching /delete/bloodstock: ", error);
        setLoading(false);
      } finally {
        setLoading(false);
        fetchBloodStock();
      }
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-blue-200">
          <div className="flex flex-col items-center justify-center bg-white/30 p-8 rounded-2xl shadow-2xl border border-white/40 backdrop-blur-lg">
            <div className="w-10 h-10 border-4 border-t-transparent border-blue-400 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 bg-white overflow-auto">
          <div className="flex items-center justify-between p-4 border-b shadow">
            <h1 className="text-2xl font-semibold text-blue-900">
              Blood Availability Details
            </h1>
          </div>

          {/* Search Section */}
          <div className="px-6 pt-6">
            <div className="border p-4 rounded-lg shadow-md bg-white mb-4">
              <h2 className="font-semibold text-blue-800 mb-4">Search</h2>
              <div className="flex flex-wrap gap-4">
                <select
                  name="state"
                  className="border p-2 rounded-md shadow w-52 hover:cursor-pointer"
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="" selected disabled>
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
                <select
                  name="city"
                  className="border p-2 rounded-md shadow w-52 hover:cursor-pointer"
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="" selected disabled>
                    Select City
                  </option>
                  {citiesList.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <button
                  className="bg-blue-900 text-white px-4 py-2 rounded-md shadow hover:bg-blue-800 cursor-pointer"
                  onClick={fetchBloodStock}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="px-6">
            <div className="border p-4 rounded-lg shadow-md bg-white mb-4">
              <h2 className="font-semibold text-blue-800 mb-4">Filter</h2>
              <div className="flex flex-wrap gap-4">
                <select
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="border p-2 rounded-md shadow w-52 hover:cursor-pointer"
                >
                  <option value="">All Bank Names</option>
                  {[...new Set(bloodStock.map((b) => b.bloodBankName))].map(
                    (name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    )
                  )}
                </select>

                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="border p-2 rounded-md shadow w-52 hover:cursor-pointer"
                >
                  <option value="">All Blood Groups</option>
                  {[...new Set(bloodStock.map((b) => b.bloodGroup))].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    )
                  )}
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border p-2 rounded-md shadow w-52 hover:cursor-pointer"
                >
                  <option value="">All Blood Types</option>
                  {[...new Set(bloodStock.map((b) => b.bloodType))].map(
                    (type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="p-6 text-gray-800">
            <div className="overflow-x-auto">
              <div className="overflow-y-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead className="bg-blue-900 text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-2 border">Blood Bank Name</th>
                      <th className="px-4 py-2 border">Blood Group</th>
                      <th className="px-4 py-2 border">Blood Type</th>
                      <th className="px-4 py-2 border">Quantity</th>
                      <th className="px-4 py-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bloodStock.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-4 font-semibold text-red-500"
                        >
                          {tableInfo}
                        </td>
                      </tr>
                    ) : (
                      bloodStock
                        .filter(
                          (bank) =>
                            (!filterName ||
                              bank.bloodBankName === filterName) &&
                            (!filterGroup || bank.bloodGroup === filterGroup) &&
                            (!filterType || bank.bloodType === filterType)
                        )
                        .map((bank, index) => (
                          <tr key={bank.id || index} className="border-t">
                            <td className="px-4 py-2 border">
                              {bank.bloodBankName}
                            </td>
                            <td className="px-4 py-2 border">
                              {bank.bloodGroup}
                            </td>
                            <td className="px-4 py-2 border">
                              {bank.bloodType}
                            </td>
                            <td className="px-4 py-2 border">
                              {bank.quantity}
                            </td>
                            <td className="px-4 py-2 border">
                              <button
                                onClick={() => handleEdit(bank)}
                                className="text-blue-600 hover:underline mr-4 hover:cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(bank.id)}
                                className="text-red-600 hover:underline hover:cursor-pointer"
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
        </div>
      </div>

      {/* Modal section */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex items-center justify-center z-30 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-center text-blue-900 mb-6">
              Edit Blood Stock Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Blood Type
                </label>
                <select
                  value={editData.bloodType}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 hover:cursor-pointer"
                  onChange={(e) =>
                    setEditData({ ...editData, bloodType: e.target.value })
                  }
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
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Blood Group
                </label>
                <select
                  value={editData.bloodGroup}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 hover:cursor-pointer"
                  onChange={(e) =>
                    setEditData({ ...editData, bloodGroup: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select Blood Type
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
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  value={editData.quantity}
                  onChange={(e) =>
                    setEditData({ ...editData, quantity: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 rounded-md bg-blue-900 hover:bg-blue-800 text-white hover:cursor-pointer"
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

export default AdminAvailability;
