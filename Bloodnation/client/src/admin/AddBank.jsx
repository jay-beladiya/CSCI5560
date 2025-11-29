import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function AddBank() {
  const [bloodBankName, setBloodBankName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [citiesList, setCitiesList] = useState([]);
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState();
  const [bankEmail, setBankEmail] = useState("");
  const [licenseNumber, setLicenseNumber] = useState();
  const [licenseValidity, setLicenseValidity] = useState();
  const [bloodBankCategory, setBloodBankCategory] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const status = sessionStorage.getItem("admin");

    if (status == null) {
      navigate("/admin");
    }
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

  useEffect(() => {
    setCitiesList(stateCityMap[state] || []);
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/admin/addBank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bloodBankName,
          state,
          city,
          address,
          contactPerson,
          contactNumber,
          bankEmail,
          licenseNumber,
          licenseValidity,
          bloodBankCategory,
          password,
        }),
      });

      const data = await response.json();
      const bankId = data.response;

      if (bankId) {
        navigator.clipboard.writeText(password);
        navigator.clipboard.writeText(bankId);
        alert(
          `Bank Id is ${bankId} and password - ${password}, both are copied to clipboard, just paste it!`
        );
        setBloodBankName("");
        setState("");
        setCity("");
        setAddress("");
        setContactPerson("");
        setContactNumber("");
        setBankEmail("");
        setLicenseNumber("");
        setLicenseValidity("");
        setBloodBankCategory("");
        setPassword("");
      }
    } catch (error) {
      console.log("Fetch Error", error);
      setLoading(false);
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
      <div className=" flex h-screen">
        <Sidebar />
        <div className=" flex-1 bg-app">
          <div className="flex items-center justify-between p-4 shadow">
            <h1 className="text-2xl font-semibold text-secondary">
              Add Blood Bank
            </h1>
          </div>
          <form className="p-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Blood Bank Name"
                className="border p-2 rounded w-full"
                value={bloodBankName}
                onChange={(e) => setBloodBankName(e.target.value)}
                required
              />
              <select
                name="state"
                className="border p-2 rounded w-full"
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
                className="border p-2 rounded w-full"
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
              <input
                type="text"
                name="address"
                placeholder="Full Address (with PIN code)"
                className="border p-2 rounded w-full"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <input
                type="text"
                name="contactPerson"
                placeholder="Authorized Contact Person Name"
                className="border p-2 rounded w-full"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                required
              />
              <input
                type="tel"
                name="contactNumber"
                placeholder="Official Contact Number"
                className="border p-2 rounded w-full"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Official Email Address"
                className="border p-2 rounded w-full"
                value={bankEmail}
                onChange={(e) => setBankEmail(e.target.value)}
                required
              />
              <input
                type="text"
                name="licenseNumber"
                placeholder="License Number"
                className="border p-2 rounded w-full"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required
              />
              <input
                type="date"
                name="licenseValidity"
                placeholder="License Validity Date"
                value={licenseValidity}
                onChange={(e) => setLicenseValidity(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
              <select
                name="category"
                className="border p-2 rounded w-full"
                value={bloodBankCategory}
                onChange={(e) => setBloodBankCategory(e.target.value)}
                required
              >
                <option value="">Select Blood Bank Category</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="NGO">NGO</option>
                <option value="Hospital-based">Hospital-based</option>
              </select>
              <div className="col-span-1 md:col-span-2">
                <input
                  type="password"
                  name="password"
                  placeholder="Blood Bank Password"
                  className="border p-2 rounded w-full"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 btn-primary btn-animate px-4 py-2 rounded cursor-pointer"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddBank;
