// autoaddusers.js
// Script to bulk-add random users to Firestore using the Admin SDK.
// Usage: node autoaddusers.js [count]

const { db } = require("./firebase.js");
const bcrypt = require("bcryptjs");

const count = Number(process.argv[2]) || 50;
const saltRounds = 10;

const firstNames = ["Alex", "Jordan", "Taylor", "Casey", "Riley", "Morgan", "Jamie", "Cameron", "Avery", "Quinn", "Sam", "Drew", "Kai", "Noah", "Liam", "Emma", "Olivia", "Ava", "Sophia", "Isabella"];
const lastNames = ["Smith", "Johnson", "Brown", "Williams", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez"];
const genders = ["Male", "Female", "Other"];
const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

function rand(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function randomAge(){
  return Math.floor(Math.random()*60) + 18; // 18-77
}

async function createUser(i){
  const first = rand(firstNames);
  const last = rand(lastNames);
  const father = rand(firstNames) + ' ' + rand(lastNames);
  const age = randomAge();
  const gender = rand(genders);
  const bloodGroup = rand(bloodGroups);
  const email = `${first.toLowerCase()}.${last.toLowerCase()}.${Date.now().toString().slice(-5)}${i}@gmail.com`;
  // Password format: lowercase firstname + '1' (e.g., Alex -> alex1)
  const passwordPlain = `${first.toLowerCase()}1`;
  const hashed = await bcrypt.hash(passwordPlain, saltRounds);

  const userData = {
    firstName: first,
    lastName: last,
    fatherName: father,
    age,
    gender,
    bloodGroup,
    email,
    password: hashed,
    createdAt: new Date().toISOString()
  };

  try{
    const docRef = await db.collection('users').add(userData);
    console.log(`Created user ${email} -> doc ${docRef.id} (password: ${passwordPlain})`);
    return { email, password: passwordPlain, id: docRef.id };
  } catch(err){
    console.error('Failed to create user', email, err);
    return null;
  }
}

(async ()=>{
  console.log(`Adding ${count} users to Firestore...`);
  const created = [];
  for(let i=0;i<count;i++){
    // small delay to avoid bursts
    // eslint-disable-next-line no-await-in-loop
    const res = await createUser(i);
    if(res) created.push(res);
  }

  console.log(`Done. Created ${created.length}/${count} users.`);
  console.log('Sample credentials (first 10):');
  created.slice(0,10).forEach((c)=> console.log(c));
  process.exit(0);
})().catch((e)=>{ console.error('Script error:', e); process.exit(1); });
