// delete_state_banks.js
// Usage: node delete_state_banks.js
// Deletes all documents in the 'bloodbanks' collection where the `state` field === 'State'

const { db } = require('./firebase.js');
const fs = require('fs');

async function deleteStateBanks() {
  try {
    console.log("Querying bloodbanks where state === 'State'...");
    const snapshot = await db.collection('bloodbanks').where('state', '==', 'State').get();

    if (snapshot.empty) {
      console.log("No blood banks found with state === 'State'. Nothing to delete.");
      return;
    }

    console.log(`Found ${snapshot.size} document(s). Deleting...`);

    const results = [];
    let deleted = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      try {
        await db.collection('bloodbanks').doc(doc.id).delete();
        console.log(`Deleted: ${doc.id} - ${data.bloodBankName || '<no name>'}`);
        results.push({ id: doc.id, name: data.bloodBankName || null, success: true });
        deleted++;
      } catch (err) {
        console.error(`Failed to delete ${doc.id}:`, err.message || err);
        results.push({ id: doc.id, name: data.bloodBankName || null, success: false, error: String(err) });
      }
    }

    console.log(`\nCompleted. Deleted ${deleted}/${snapshot.size} document(s).`);

    // Save a record of what was deleted/attempted
    const outPath = 'deleted_state_banks_report.json';
    fs.writeFileSync(outPath, JSON.stringify({ timestamp: new Date().toISOString(), totalFound: snapshot.size, deleted, results }, null, 2));
    console.log(`Report written to ${outPath}`);
  } catch (err) {
    console.error('Error while deleting documents:', err);
    process.exitCode = 1;
  }
}

// Run
deleteStateBanks().then(() => process.exit()).catch((err) => { console.error(err); process.exit(1); });
