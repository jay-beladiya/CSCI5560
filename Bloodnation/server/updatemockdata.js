const { db } = require("./firebase.js");

// Helper for random values
function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomPhone() {
  return `+1 (615) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
}

function randomDatePast(days) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * days));
  return d.toISOString().split("T")[0];
}

function randomDateFuture(days) {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * days));
  return d.toISOString().split("T")[0];
}

async function addMockFields() {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      console.log("No user documents found!");
      return;
    }

    snapshot.forEach(async (doc) => {
      const data = doc.data();

      const mockAddressList = [
        "Murfreesboro, TN",
        "Nashville, TN",
        "Franklin, TN",
        "Antioch, TN",
        "Smyrna, TN",
      ];

      const patch = {
        phoneNumber: data.phoneNumber || randomPhone(),
        address: data.address || randomFrom(mockAddressList),

        donorId: data.donorId || `DNR-${Math.floor(1000 + Math.random() * 9000)}`,

        registrationDate:
          data.registrationDate ||
          randomDatePast(600), // last 2 years

        lastLogin: data.lastLogin || randomDatePast(30), // last 30 days

        hemoglobin: data.hemoglobin || `${(12 + Math.random() * 5).toFixed(1)} g/dL`,
        weight: data.weight || `${50 + Math.floor(Math.random() * 45)} kg`,
        nextCheckupDate: data.nextCheckupDate || randomDateFuture(120),
        eligibleInDays: data.eligibleInDays || Math.floor(Math.random() * 60),
      };

      await usersRef.doc(doc.id).update(patch);
      console.log(`Mock fields added → ${doc.id}`);
    });

    console.log("All mock fields successfully added!");
  } catch (error) {
    console.error("Error adding mock fields:", error);
  }
}

addMockFields();