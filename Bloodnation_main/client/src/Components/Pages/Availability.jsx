import React, { useState, useEffect } from "react";
import Navbar from "../Common/Navbar/Navbar";
import LoggedNavbar from "../Common/Navbar/LoggedNavbar";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function Availability() {
  const [navComponent, setNavComponent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setNavComponent(<LoggedNavbar />);
        try {
          const response = await fetch(
            "http://localhost:3000/api/fetch/user",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (data) {
            setNavComponent(<LoggedNavbar />);
            sessionStorage.setItem("user", true);
          } else {
            setNavComponent(<Navbar />);
          }
        } catch (error) {
          console.log("Fetching /api/verify/user Error: ", error);
          setNavComponent(<Navbar />);
        }
      } else {
        setNavComponent(<Navbar />);
      }
    };

    fetchUser();
  }, []);

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

  const [bloodGroup, setBloodGroup] = useState("");
  const [bloodType, setBloodType] = useState("");

  const [stockData, setStockData] = useState([]);

  const [tableInfo, setTableInfo] = useState("Search for Blood Stock Availability.");

  useEffect(() => {
    setCitiesList(stateCityMap[state] || []);
  }, [state]);

  const handleStockSearch = async () => {
    setLoading(true);

    try {
      const q = query(
        collection(db, "bloodstock"),
        where("state", "==", state),
        where("city", "==", city),
        where("bloodGroup", "==", bloodGroup),
        where("bloodType", "==", bloodType)
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (docs.length === 0) {
        setTableInfo("No Blood Stock Available.")
        setStockData([]);
      } else {
        setStockData(docs);
      }
    } catch (error) {
      console.log("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {navComponent}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-red-200/30">
          <div className="flex flex-col items-center justify-center bg-white/30 p-8 rounded-2xl shadow-2xl border border-white/40 backdrop-blur-lg">
            <div className="w-10 h-10 border-4 border-t-transparent border-red-400 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <section className=" min-h-[89vh] max-h-fit flex justify-center bg-red-50 overflow-auto">
        <div className=" flex justify-start flex-col mt-8 w-[90vw]">
          <h2 className="font-sans text-3xl text-left font-semibold">
            Blood Stock Availability
          </h2>
          <hr className="w-[90vw] mt-6" />
          <div className="w-[90vw] mt-10 flex items-center pl-2 h-12 rounded-t-md bg-green-700 text-white font-semibold shadow-md shadow-black/20">
            Search Blood Stock
          </div>
          <div className="w-[90vw] h-30 bg-white rounded-b-md shadow-md shadow-black/20 flex justify-around items-center">
            <div className="w-[90vw] h-30 bg-white rounded-b-md shadow-md shadow-black/20 flex justify-around items-center">
              <select
                name="state"
                className=" bg-green-200 p-2 rounded-md shadow-sm shadow-black/20 w-1/6"
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
                className=" bg-green-200 p-2 rounded-md shadow-sm shadow-black/20 w-1/6"
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
              <select
                name="bloodGroup"
                className=" bg-green-200 p-2 rounded-md shadow-sm shadow-black/20 w-1/6"
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
              <select
                name="bloodType"
                className=" bg-green-200 p-2 rounded-md shadow-sm shadow-black/20 w-1/6"
                onChange={(e) => setBloodType(e.target.value)}
              >
                <option value="" selected disabled>
                  Select Blood Type
                </option>
                <option value="Whole Blood">Whole Blood</option>
                <option value="Single Donor Platelet">
                  Single Donor Platelet
                </option>
                <option value="Single Donor Plasma">Single Donor Plasma</option>
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
                <option value="Fresh Frozen Plasma">Fresh Frozen Plasma</option>
                <option value="Cryoprecipitate">Cryoprecipitate</option>
                <option value="Cryo Poor Plasma">Cryo Poor Plasma</option>
              </select>
              <button
                className=" p-2 pl-4 pr-4 bg-green-700 text-white rounded-md hover:cursor-pointer hover:shadow-sm shadow-black/20"
                onClick={handleStockSearch}
              >
                Search
              </button>
            </div>
          </div>
          <div className="mt-6 mb-8 max-h-80 overflow-y-auto border border-gray-200 rounded-md">
            <table className="w-full table-fixed border-collapse">
              <thead className="sticky top-0 z-10 bg-green-100">
                <tr>
                  <th className="px-4 py-2 text-center font-semibold text-black border border-gray-300">
                    Blood Bank Name
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-black border border-gray-300">
                    Blood Group
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-black border border-gray-300">
                    Blood Type
                  </th>
                  <th className="px-4 py-2 text-center font-semibold text-black border border-gray-300">
                    Availability
                  </th>
                </tr>
              </thead>
              <tbody>
                {stockData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-4 font-semibold text-red-500"
                    >
                      {tableInfo}
                    </td>
                  </tr>
                ) : (
                  stockData.map((stock, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-center border border-gray-300">
                        {stock.bloodBankName}
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-300">
                        {stock.bloodGroup}
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-300">
                        {stock.bloodType}
                      </td>
                      <td className="px-4 py-2 text-center border border-gray-300">
                        {stock.quantity}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default Availability;
