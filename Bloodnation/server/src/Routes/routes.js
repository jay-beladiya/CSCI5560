const express = require("express");
const { db } = require("../../firebase.js");
const {
  loginUser,
  userRegister,
  fetchUser,
  verifyUser,
  verifyBank,
  changeUserPassword,
  updateProfile,
  bloodBankLogin,
  changeBankPassword,
  addBloodStock,
  fetchBloodStock,
  updateBloodStock,
  deleteBloodStock,
} = require("../Models/userModel.js");
const { auth, messaging } = require("firebase-admin");

const router = express.Router();

router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  const token = await loginUser(email, password);

  if (token !== null && token !== false) {
    res.status(200).json({ token });
  } else if (token === null) {
    res.status(401).json({ message: "User not found", token: null });
  } else if (token === false) {
    res.status(403).json({ message: "Invalid Credentials", token: false });
  }
});

router.post("/user/register", async (req, res) => {
  const {
    firstName,
    lastName,
    fatherName,
    age,
    gender,
    bloodGroup,
    email,
    password,
  } = req.body;

  try {
    const token = await userRegister(
      firstName,
      lastName,
      fatherName,
      age,
      gender,
      bloodGroup,
      email,
      password
    );

    if (token == null) {
      const token = await userRegister(
        firstName,
        lastName,
        fatherName,
        age,
        gender,
        bloodGroup,
        email,
        password
      );
    }

    if (token == true) {
      res.json({
        message: "There is a user registered with this email!",
        token: true,
      });
    } else if (token != true || token != null) {
      res.status(200).json({ message: "User Registered!", token });
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/fetch/user", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    const response = await fetchUser(token);

    if (response) {
      res.status(200).json({ response });
    } else if(response == null) {
      res.status(404).json({ message: "Email changed!" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

router.post("/updateProfile", async (req, res) => {
  const authHeader = req.headers.authorization;

  if(authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    const docId = await verifyUser(token);

    if(docId) {
      const {firstName, lastName, fatherName, age, bloodGroup, email} = req.body;

      const response = await updateProfile(docId, firstName, lastName, fatherName, age, bloodGroup, email);

      if(response == true) {
        res.status(200).json({ message: "User data updated!"});
      } else if (response == null) {
        res.status(401).json({ message: "There was some error, please try again!"});
      }
    }
  }
})

router.get("/verify/bloodbank", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    const response = await verifyBank(token);

    if (response) {
      res.status(200).json({ response });
    } else {
      res.status(401).json({ message: "Something is wrong!" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

router.post("/changePassword", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  const result = await changeUserPassword(email, oldPassword, newPassword);

  if (result == 200) {
    res.status(200).json({ message: "Your Password has been Changed!" });
  } else {
    res.status(401).json({
      message: "Invalid Password Change, please enter the correct values!",
    });
  }
});

router.post("/bloodbank/login", async (req, res) => {
  const { bankId, password } = req.body;

  const token = await bloodBankLogin(bankId, password);

  if (token == null) {
    res
      .status(404)
      .json({ message: "There is no blood bank with this ID!", token: null });
  } else if (token == false) {
    res
      .status(401)
      .json({ message: "Please enter the correct password!", token: false });
  } else if (token != null || token != false) {
    res.status(200).json({ message: "Logged Successfully!", token });
  }
});

router.post("/add/bloodstock", async (req, res) => {
  const authHeader = req.headers.authorization;

  const bloodGroup = req.body.bloodGroup;
  const bloodType = req.body.bloodType;
  const quantity = req.body.quantity;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    const bankData = await verifyBank(token);

    const bankName = bankData.bloodBankName;
    const city = bankData.city;
    const state = bankData.state;

    const response = await addBloodStock(
      bankName,
      city,
      state,
      bloodGroup,
      bloodType,
      quantity
    );

    if (response == true) {
      res.status(201).json({ message: "Data added!" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
});

router.post("/update/bloodstock", async (req, res) => {
  const stockId = req.body.editId;

  const newBloodGroup = req.body.newBloodGroup;
  const newBloodType = req.body.newBloodType;
  const newQuantity = req.body.newQuantity;

  const result = await updateBloodStock(
    stockId,
    newBloodGroup,
    newBloodType,
    newQuantity
  );

  if (result == true) {
    res.status(200).json({ message: "Data Updated!" });
  } else {
    res.status(401).json({ message: "There was some error, please try again!" });
  }
});

router.post("/delete/bloodstock", async (req, res) => {
  const stockId = req.body.stockId;

  const response = await deleteBloodStock(stockId);

  if (response == true) {
    res.status(200).json({ message: "Data was deleted!" });
  } else {
    res
      .status(401)
      .json({ message: "There was some error, please try again!" });
  }
});

router.get("/fetch/bloodstock", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    const response = await fetchBloodStock(token);

    if (response) {
      res.status(200).json({ response });
    } else {
      res.status(404).json({ message: "No Data Found!" });
    }
  }
});

router.post("/bloodbank/changePassword", async (req, res) => {
  const { bankId, oldPassword, newPassword } = req.body;
  const result = await changeBankPassword(bankId, oldPassword, newPassword);

  if (result == 200) {
    res.status(200).json({ message: "Your Password has been Changed!" });
  } else {
    res.status(401).json({
      message: "Invalid Password Change, please enter the correct values!",
    });
  }
});

// Public endpoint for client-side availability searches
// Uses the Admin SDK on the server so client doesn't need Firestore read rules
router.post("/public/bloodstock", async (req, res) => {
  try {
    const { state, city, bloodGroup, bloodType } = req.body || {};

    let ref = db.collection("bloodstock");
    if (state) ref = ref.where("state", "==", state);
    if (city) ref = ref.where("city", "==", city);
    if (bloodGroup) ref = ref.where("bloodGroup", "==", bloodGroup);
    if (bloodType) ref = ref.where("bloodType", "==", bloodType);

    const snapshot = await ref.get();
    const results = [];
    snapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error in /public/bloodstock:", error);
    return res.status(500).json({ message: "Server error fetching bloodstock" });
  }
});

module.exports = router;
