const { db } = require("../../firebase.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const e = require("express");
dotenv.config();

const SECRET_KEY = process.env.JWT_KEY;

const saltRounds = 10;

const loginUser = async (email, password) => {
  try {
    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return null;
    } else {
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data(); // .data() is used to separate the data from snapshot document that came back in response.

      const storedHashedPassword = userData.password;

      const compareResult = await bcrypt.compare(
        password,
        storedHashedPassword
      );

      if (compareResult) {
        const token = jwt.sign(
          { id: userDoc.id, email: userData.email },
          SECRET_KEY,
          { expiresIn: "1h" }
        );
        return token;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.error("Error posting message:", error);
  }
};

const userRegister = async (
  firstName,
  lastName,
  fatherName,
  age,
  gender,
  bloodGroup,
  email,
  password
) => {
  let hashedPassword = await bcrypt.hash(password, saltRounds);

  const userRef = db.collection("users");
  const snapshot = await userRef.where("email", "==", email).get();

  if (snapshot.empty) {
    try {
      const docRef = await db.collection("users").add({
        firstName,
        lastName,
        fatherName,
        age,
        gender,
        bloodGroup,
        email,
        password: hashedPassword,
      });

      if (docRef) {
        try {
          const registeredUser = await userRef
            .where("email", "==", email)
            .get();

          if (registeredUser.empty) {
            return null;
          } else {
            const registeredUserDoc = registeredUser.docs[0];
            const registeredUserData = registeredUserDoc.data();

            try {
              const token = jwt.sign(
                { id: registeredUserDoc.id, email: registeredUserData.email },
                SECRET_KEY,
                { expiresIn: "1h" }
              );
              return token;
            } catch (error) {
              console.log("Error generating token: ", error);
            }
          }
        } catch (error) {
          console.log("Error fetching the registered user: ", error);
        }
      }
    } catch (error) {
      console.log("user Model Data sending:", error);
    }
  } else {
    return true;
  }
};

const fetchUser = async (token) => {
  const payload = jwt.decode(token, SECRET_KEY);
  const email = payload.email;
  const docId = payload.id;

  const docRef = db.collection("users").doc(docId);
  const doc = await docRef.get();

  const data = doc.data();

  if (data.email == email) {
    return data;
  } else {
    return null;
  }
};

const verifyUser = async (token) => {
  const payload = jwt.decode(token, SECRET_KEY);
  const docId = payload.id;

  const docRef = db.collection("users").doc(docId);
  const doc = await docRef.get();

  const data = doc.data();

  if (data) {
    return docId;
  } else {
    return null;
  }
};

const verifyBank = async (token) => {
  const payload = jwt.decode(token, SECRET_KEY);
  const docId = payload.id;
  const bankId = payload.bankId;

  const docRef = db.collection("bloodbanks").doc(docId);
  const doc = await docRef.get();

  const data = doc.data();

  if (data.bankId == bankId) {
    return data;
  } else {
    return null;
  }
};

const changeUserPassword = async (email, oldPassword, newPassword) => {
  try {
    const userRef = db.collection("users");
    const snapshot = await userRef.where("email", "==", email).get();

    const docRef = snapshot.docs[0];
    const data = docRef.data();

    const storedHashedPassword = data.password;
    let newHashedPassword;
    let comparedResult;
    try {
      comparedResult = await bcrypt.compare(oldPassword, storedHashedPassword);

      if (comparedResult) {
        try {
          newHashedPassword = await bcrypt.hash(newPassword, saltRounds);
        } catch (error) {
          console.log("Error hashing passwords: ", error);
        }
      } else {
        console.log("The Password didn't match!");
      }

      try {
        const updateDocRef = db.collection("users").doc(docRef.id);

        const updatingDocResult = await updateDocRef.update({
          password: newHashedPassword,
        });

        if (updateDocRef) {
          return "200";
        }
      } catch (error) {
        console.log("Updating Doc Error: ", error);
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log("userModel changePassword Error: ", error);
  }
};

const updateProfile = async (docId, firstName, lastName, fatherName, age, bloodGroup, email) => {
  const docRef = db.collection("users").doc(docId);

  const snapshot = await docRef.update({
    firstName,
    lastName,
    fatherName,
    age,
    bloodGroup,
    email
  });

  if(snapshot) {
    return true;
  } else {
    return null;
  }
};

const changeBankPassword = async (bankId, oldPassword, newPassword) => {
  try {
    const bankRef = db.collection("bloodbanks");
    const snapshot = await bankRef.where("bankId", "==", bankId).get();

    const docRef = snapshot.docs[0];
    const data = docRef.data();

    const storedHashedPassword = data.bloodBankPassword;
    let newHashedPassword;
    let comparedResult;
    try {
      comparedResult = await bcrypt.compare(oldPassword, storedHashedPassword);

      if (comparedResult) {
        try {
          newHashedPassword = await bcrypt.hash(newPassword, saltRounds);
        } catch (error) {
          console.log("Error hashing passwords: ", error);
        }
      } else {
        console.log("The Password didn't match!");
      }

      try {
        const updateDocRef = db.collection("bloodbanks").doc(docRef.id);

        const updatingDocResult = await updateDocRef.update({
          bloodBankPassword: newHashedPassword,
        });

        if (updateDocRef) {
          return 200;
        }
      } catch (error) {
        console.log("Updating Doc Error: ", error);
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log("userModel changePassword Error: ", error);
  }
};

const bloodBankLogin = async (bankId, password) => {
  try {
    const bankRef = db.collection("bloodbanks");
    const snapshot = await bankRef.where("bankId", "==", Number(bankId)).get();

    if (snapshot.empty) {
      return null;
    } else {
      const bankDoc = snapshot.docs[0];
      const bankData = bankDoc.data();

      const storedHashedPassword = bankData.bloodBankPassword;

      const compareResult = await bcrypt.compare(
        password,
        storedHashedPassword
      );

      if (compareResult) {
        const token = jwt.sign(
          { id: bankDoc.id, bankId: bankData.bankId },
          SECRET_KEY,
          { expiresIn: "1h" }
        );
        return token;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log("MAIN ERROR: ", error);
  }
};

const addBloodStock = async (
  bankName,
  city,
  state,
  bloodGroup,
  bloodType,
  quantity
) => {
  try {
    const docRef = await db.collection("bloodstock").add({
      bloodBankName: bankName,
      city,
      state,
      bloodGroup,
      bloodType,
      quantity,
    });

    if (docRef) {
      return true;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Adding Bank Data Error: ", error);
  }
};

const fetchBloodStock = async (token) => {
  try {
    const bloodStock = [];
    const bankData = await verifyBank(token);

    const bloodBankName = bankData.bloodBankName;

    const snapshot = await db
      .collection("bloodstock")
      .where("bloodBankName", "==", bloodBankName)
      .get();

    snapshot.forEach((doc) => {
      bloodStock.push({ id: doc.id, ...doc.data() });
    });

    return bloodStock;
  } catch (error) {
    console.log("Error fetching blood stock: ", error);
  }
};

const updateBloodStock = async (
  stockId,
  newBloodGroup,
  newBloodType,
  newQuantity
) => {
  const docRef = db.collection("bloodstock").doc(stockId);

  const snapshot = await docRef.update({
    bloodGroup: newBloodGroup,
    bloodType: newBloodType,
    quantity: newQuantity,
  });

  if (snapshot) {
    return true;
  } else {
    return null;
  }
};

const deleteBloodStock = async (stockId) => {
  const docRef = db.collection("bloodstock").doc(stockId);

  const snapshot = await docRef.delete();

  if (snapshot) {
    return true;
  } else {
    return null;
  }
};

module.exports = {
  loginUser,
  userRegister,
  fetchUser,
  verifyUser,
  changeUserPassword,
  updateProfile,
  bloodBankLogin,
  changeBankPassword,
  verifyBank,
  addBloodStock,
  fetchBloodStock,
  updateBloodStock,
  deleteBloodStock,
};
