const { initializeApp, cert, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// ✅ OPTION 1: If you have serviceAccountKey.json (recommended)
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

// ✅ OPTION 2 (alternative): use gcloud CLI auth
// initializeApp({ credential: applicationDefault() });

const db = getFirestore();

// 🩸 Random date within last 2–8 months
function randomLastDonationDate() {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 180) + 60; // 60–240 days ago
  const donationDate = new Date(today);
  donationDate.setDate(today.getDate() - daysAgo);
  return donationDate.toISOString().split("T")[0]; // format: YYYY-MM-DD
}

// 🧠 Eligibility logic (if last donation ≥45 days ago)
function getEligibility(lastDonation) {
  const donationDate = new Date(lastDonation);
  const today = new Date();
  const diffDays = (today - donationDate) / (1000 * 60 * 60 * 24);
  return diffDays >= 45 ? "Eligible" : "Not Eligible";
}

// 🔁 Update all users
async function updateUserStats() {
  const usersSnapshot = await db.collection("users").get();

  for (const doc of usersSnapshot.docs) {
    const numberOfDonations = Math.floor(Math.random() * 12) + 1; // 1–12
    const lastDonation = randomLastDonationDate();
    const eligibility = getEligibility(lastDonation);

    await db.collection("users").doc(doc.id).update({
      numberOfDonations,
      lastDonation,
      eligibility,
    });

    console.log(
      `✅ Updated ${doc.id} → Donations: ${numberOfDonations}, Last: ${lastDonation}, Eligible: ${eligibility}`
    );
  }
}

updateUserStats()
  .then(() => console.log("🎯 All users updated successfully!"))
  .catch((err) => console.error("❌ Error updating users:", err));