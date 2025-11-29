const { db, admin } = require("../../firebase.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const saltRounds = 10;

const adminLogin = async (username, password) => {
  try {
    const adminRef = db.collection("admin");
    const snapshot = await adminRef.where("username", "==", username).get();

    if (snapshot.empty) {
      return false;
    } else {
      const docRef = snapshot.docs[0];
      const data = docRef.data();
      const storedHashedPassword = data.password;
      const bcryptResult = await bcrypt.compare(password, storedHashedPassword);

      if (bcryptResult) {
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log(error);
  }

};

const createAdmin = async (username, password) => {
  try {
    // Check if admin already exists
    const adminRef = db.collection("admin");
    const snapshot = await adminRef.where("username", "==", username).get();

    if (!snapshot.empty) {
      return { success: false, message: "Admin already exists" };
    }

    // Hash the password
    let hashedPassword = await bcrypt.hash(password, saltRounds);

    // Add the new admin
    const docRef = await adminRef.add({
      username,
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: "Admin created successfully", id: docRef.id };
  } catch (error) {
    console.log("Error adding admin: ", error);
    return { success: false, message: "Error creating admin" };
  }
};

const fetchUsersService = async () => {
  const snapshot = await db.collection("users").get();
  const users = [];

  snapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });

  return users;
};

const fetchBloodStockService = async (state, city) => {
  try {
    let query = db.collection("bloodstock");

    // Apply filters only when provided
    if (state && city) {
      query = query.where("state", "==", state).where("city", "==", city);
    } else if (state && !city) {
      query = query.where("state", "==", state);
    } else if (!state && city) {
      query = query.where("city", "==", city);
    } else {
      // no filters: return all
      query = query;
    }

    const snapshot = await query.get();
    const bloodStock = [];

    snapshot.forEach((doc) => {
      bloodStock.push({ id: doc.id, ...doc.data() });
    });

    return bloodStock; // may be empty array if no docs
  } catch (error) {
    console.log("Error in fetchBloodStockService:", error);
    return [];
  }
};

const fetchBloodBankService = async (state, city) => {
  try {
    let query = db.collection("bloodbanks");

    // If both state and city are provided, filter by both
    if (state && city) {
      query = query.where("state", "==", state).where("city", "==", city);
    } else if (state && !city) {
      // Only state provided
      query = query.where("state", "==", state);
    } else if (!state && city) {
      // Only city provided
      query = query.where("city", "==", city);
    } else {
      // No filters provided: return all
      query = query;
    }

    const snapshot = await query.get();
    const bloodbanks = [];

    snapshot.forEach((doc) => {
      bloodbanks.push({ id: doc.id, ...doc.data() });
    });

    return bloodbanks;
  } catch (error) {
    console.log("Error in fetchBloodBankService:", error);
    return [];
  }
};

const addBankService = async (
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
  password
) => {
  let bankId;

  const generateUniqueBankID = async () => {
    let exists = true;

    while (exists) {
      bankId = Math.floor(100000 + Math.random() * 900000);
      try {
        const snapshot = await db
          .collection("bloodbanks")
          .where("bloodBankID", "==", bankId)
          .get();

        exists = !snapshot.empty;
      } catch (error) {
        console.log("Error checking bloodBankID: ", error);
        exists = true;
      }
    }
  };

  await generateUniqueBankID();

  let bloodBankPassword = await bcrypt.hash(password, saltRounds);

  const bloodBankData = {
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
    bankId,
    bloodBankPassword,
  };

  try {
    const dbResult = await db.collection("bloodbanks").add(bloodBankData);
    return bankId;
  } catch (error) {
    console.error("Error adding blood bank data: ", error);
    return null;
  }
};

const updateBankService = async (
  id,
  bankId,
  bloodBankName,
  bankEmail,
  bloodBankCategory,
  licenseNumber,
  licenseValidity,
  contactPerson,
  contactNumber,
  address,
  state,
  city
) => {
  const docRef = db.collection("bloodbanks").doc(id);

  const snapshot = await docRef.update({
    bankId,
    bloodBankName,
    bankEmail,
    bloodBankCategory,
    licenseNumber,
    licenseValidity,
    contactPerson,
    contactNumber,
    address,
    state,
    city,
  });

  if (snapshot) {
    return true;
  } else {
    return null;
  }
};

const deleteBankService = async (docId) => {
  const docRef = db.collection("bloodbanks").doc(docId);

  const snapshot = await docRef.delete();

  if (snapshot) {
    return true;
  } else {
    return null;
  }
};

const updateBloodStockService = async (id, bloodGroup, bloodType, quantity) => {
  const docRef = db.collection("bloodstock").doc(id);

  const snapshot = await docRef.update({
    bloodGroup,
    bloodType,
    quantity,
  });

  if (snapshot) {
    return true;
  } else {
    return null;
  }
};

const deleteBloodStockService = async (docId) => {
  const docRef = db.collection("bloodstock").doc(docId);

  const snapshot = await docRef.delete();

  if(snapshot) {
    return true;
  } else {
    return null;
  }
};

const deleteUserService = async (docId) => {
  const docRef = db.collection("users").doc(docId);

  const snapshot = await docRef.delete();

  if(snapshot) {
    return true;
  } else {
    return null;
  }
};

module.exports = {
  adminLogin,
  createAdmin,
  fetchUsersService,
  fetchBloodStockService,
  fetchBloodBankService,
  addBankService,
  updateBankService,
  deleteBankService,
  updateBloodStockService,
  deleteBloodStockService,
  deleteUserService
};
