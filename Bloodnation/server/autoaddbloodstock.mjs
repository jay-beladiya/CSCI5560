// autoAddBloodStock.js
import fetch from "node-fetch";

// Replace this with the actual token from your logged-in bank (see below)
const BANK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkJQSUo1UDdjSWNLdDFFcVJtdm9nIiwiYmFua0lkIjozOTg5NjEsImlhdCI6MTc2MTY5NDE5MCwiZXhwIjoxNzYxNjk3NzkwfQ.j_pXyh7uSJi8tZ3vZ4l7Zto6clIepkxcc38JjwjQKBU";

// Generate mock blood stock data
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const bloodTypes = [
  "Whole Blood",
  "Single Donor Platelet",
  "Single Donor Plasma",
  "Sagm Packed Red Blood Cells",
  "Random Donor Platelets",
  "Platelet Rich Plasma",
  "Platelet Concentrate",
  "Plasma",
  "Packed Red Blood Cells",
  "Leukoreduced RBC",
  "Irradiated RBC",
  "Fresh Frozen Plasma",
  "Cryoprecipitate",
  "Cryo Poor Plasma",
];

// Create 50 random stock entries (adjust as needed)
const mockStock = Array.from({ length: 50 }).map(() => ({
  bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
  bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
  quantity: String(Math.floor(Math.random() * 10) + 1), // 1–10 units
}));

async function uploadStock() {
  console.log(`🚀 Uploading ${mockStock.length} mock blood stock entries...`);
  let success = 0;

  for (const stock of mockStock) {
    try {
      const response = await fetch("http://localhost:3000/api/add/bloodstock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BANK_TOKEN}`,
        },
        body: JSON.stringify(stock),
      });

      if (response.ok) {
        success++;
        console.log(`✅ Added ${stock.bloodGroup} | ${stock.bloodType} | ${stock.quantity}`);
      } else {
        const text = await response.text();
        console.log(`❌ Failed: ${response.status} - ${text}`);
      }
    } catch (err) {
      console.log("⚠️ Error:", err.message);
    }
  }

  console.log(`\n🎉 Completed! ${success}/${mockStock.length} stocks added.`);
}

uploadStock();