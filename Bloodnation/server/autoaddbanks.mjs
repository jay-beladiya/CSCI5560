import fetch from 'node-fetch';

// Script to auto-create 50 blood banks using the server's /admin/addBank endpoint.
// Password rule: lowercase bank name (alphanumeric characters only) + '5560'
// Example: "Nashville Blood Bank" -> password: "nashvillebloodbank5560"

const BASE_URL = 'http://localhost:3000/admin/addBank';

const bankList = [
  { city: 'Nashville', state: 'Tennessee' },
  { city: 'Memphis', state: 'Tennessee' },
  { city: 'Knoxville', state: 'Tennessee' },
  { city: 'Chattanooga', state: 'Tennessee' },
  { city: 'Clarksville', state: 'Tennessee' },
  { city: 'Birmingham', state: 'Alabama' },
  { city: 'Montgomery', state: 'Alabama' },
  { city: 'Mobile', state: 'Alabama' },
  { city: 'Huntsville', state: 'Alabama' },
  { city: 'Tuscaloosa', state: 'Alabama' },
  { city: 'Phoenix', state: 'Arizona' },
  { city: 'Tucson', state: 'Arizona' },
  { city: 'Mesa', state: 'Arizona' },
  { city: 'Chandler', state: 'Arizona' },
  { city: 'Scottsdale', state: 'Arizona' },
  { city: 'Los Angeles', state: 'California' },
  { city: 'San Diego', state: 'California' },
  { city: 'San Jose', state: 'California' },
  { city: 'San Francisco', state: 'California' },
  { city: 'Fresno', state: 'California' },
  { city: 'Denver', state: 'Colorado' },
  { city: 'Colorado Springs', state: 'Colorado' },
  { city: 'Aurora', state: 'Colorado' },
  { city: 'Fort Collins', state: 'Colorado' },
  { city: 'Boulder', state: 'Colorado' },
  { city: 'Atlanta', state: 'Georgia' },
  { city: 'Savannah', state: 'Georgia' },
  { city: 'Augusta', state: 'Georgia' },
  { city: 'Macon', state: 'Georgia' },
  { city: 'Columbus', state: 'Georgia' },
  { city: 'Miami', state: 'Florida' },
  { city: 'Orlando', state: 'Florida' },
  { city: 'Tampa', state: 'Florida' },
  { city: 'Jacksonville', state: 'Florida' },
  { city: 'Tallahassee', state: 'Florida' },
  { city: 'Houston', state: 'Texas' },
  { city: 'San Antonio', state: 'Texas' },
  { city: 'Dallas', state: 'Texas' },
  { city: 'Austin', state: 'Texas' },
  { city: 'Fort Worth', state: 'Texas' },
  { city: 'Chicago', state: 'Illinois' },
  { city: 'Naperville', state: 'Illinois' },
  { city: 'Joliet', state: 'Illinois' },
  { city: 'Springfield', state: 'Illinois' },
  { city: 'Minneapolis', state: 'Minnesota' },
  { city: 'Saint Paul', state: 'Minnesota' },
  { city: 'Rochester', state: 'Minnesota' },
  { city: 'Duluth', state: 'Minnesota' },
  { city: 'Bloomington', state: 'Minnesota' },
  { city: 'Providence', state: 'Rhode Island' },
];

const makePasswordFromName = (name) => {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // remove non-alphanumeric
      + '5560'
  );
};

const randomPhone = () => {
  // US-style 10 digit
  const n = Math.floor(100000000 + Math.random() * 900000000);
  return '1' + String(n); // simple
};

const makeBankPayload = (cityName, stateName, i) => {
  const bankName = `${cityName} Blood Bank`;
  const password = makePasswordFromName(bankName);
  const state = stateName;
  const city = cityName;
  const address = `${i + 1} ${cityName} Center Rd`;
  const contactPerson = `${cityName} Admin`;
  const contactNumber = randomPhone();
  const bankEmail = `${cityName.toLowerCase().replace(/[^a-z0-9]/g, '')}@bloodbank.example.com`;
  const licenseNumber = `LIC-${Math.floor(100000 + Math.random() * 900000)}`;
  const licenseValidity = '2028-12-31';
  const bloodBankCategory = 'Private';

  return {
    bloodBankName: bankName,
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
  };
};

async function createBanks() {
  console.log('Starting creation of 50 blood banks...');
  let success = 0;
  const results = [];

  for (let i = 0; i < 50; i++) {
    const entry = bankList[i % bankList.length];
    const payload = makeBankPayload(entry.city, entry.state, i);

    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.text();
      let json;
      try { json = JSON.parse(body); } catch (e) { json = { raw: body }; }

      if (res.ok) {
        success++;
        const bankId = json.response || json.id || null;
        results.push({ index: i + 1, name: payload.bloodBankName, password: payload.password, bankId });
        console.log(`✅ [${i + 1}] Created: ${payload.bloodBankName} (password: ${payload.password}) -> bankId: ${bankId}`);
      } else {
        console.log(`❌ [${i + 1}] Failed (${res.status}): ${payload.bloodBankName} - ${JSON.stringify(json)}`);
        results.push({ index: i + 1, name: payload.bloodBankName, password: payload.password, error: json });
      }
    } catch (err) {
      console.log(`⚠️ [${i + 1}] Error creating ${payload.bloodBankName}: ${err.message}`);
      results.push({ index: i + 1, name: payload.bloodBankName, password: payload.password, error: err.message });
    }

    // Small delay to avoid hammering the server
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nCompleted: ${success}/50 created successfully.`);
  // Optionally write results to a file — but we won't add FS here unless you want it.
  return results;
}

createBanks().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
