const express = require("express");
const {
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
  deleteUserService,
} = require("../Models/adminModel");
const { updateBloodStock } = require("../Models/userModel");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const response = await adminLogin(username, password);

  res.json({ response });
});

// Create a new admin account
router.post("/create", async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Username and password are required" 
    });
  }

  // Password strength validation
  if (password.length < 8) {
    return res.status(400).json({ 
      success: false, 
      message: "Password must be at least 8 characters long" 
    });
  }

  const result = await createAdmin(username, password);
  
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});

router.get("/fetchUsers", async (req, res) => {
  const response = await fetchUsersService();

  if (response) {
    res.status(200).json(response);
  } else {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.post("/fetchBloodStock", async (req, res) => {
  const state = req.body.state;
  const city = req.body.city;

  const response = await fetchBloodStockService(state, city);

  // Always return the array (may be empty). Frontend will handle empty lists.
  if (Array.isArray(response)) {
    res.status(200).json(response);
  } else {
    // Unexpected response; return empty array to frontend
    res.status(200).json([]);
  }
});

router.post("/fetchBloodBank", async (req, res) => {
  const state = req.body.state;
  const city = req.body.city;
  const response = await fetchBloodBankService(state, city);

  if (response) {
    res.status(200).json(response);
  } else {
    res.status(500).json({ message: "Failed to fetch blood banks!" });
  }
});

router.post("/addBank", async (req, res) => {
  try {
    const {
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
    } = req.body;

    const response = await addBankService(
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
    );

    if (response) {
      res.status(200).json({ message: "Uploaded", response });
    } else {
      res.status(500);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/update/bloodbank", async (req, res) => {
  const {
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
    city,
  } = req.body;

  const response = await updateBankService(
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
  );

  if (response == true) {
    res.status(200).json({ message: "Data updated!" });
  } else {
    res
      .status(401)
      .json({ message: "There was some error, please try again!" });
  }
});

router.post("/delete/bloodbank", async (req, res) => {
  const docId = req.body.docId;

  const response = await deleteBankService(docId);

  if (response == true) {
    res.status(200).json({ message: "Blood Bank was deleted!" });
  } else {
    res
      .status(401)
      .json({ message: "There was some error, please try again!" });
  }
});

router.post("/update/bloodstock", async (req, res) => {
  const { id, bloodGroup, bloodType, quantity } = req.body;

  const response = await updateBloodStockService(
    id,
    bloodGroup,
    bloodType,
    quantity
  );

  if (response == true) {
    res.status(200).json({ message: "Data updated!" });
  } else {
    res
      .status(401)
      .json({ message: "There was some error, please try again!" });
  }
});

router.post("/delete/bloodstock", async (req, res) => {
  const docId = req.body.docId;

  const response = await deleteBloodStockService(docId);

  if (response == true) {
    res.status(200).json({ message: "Data Deleted!" });
  } else {
    res.status(401).json({ message: "There was some error, please try again!" });
  }
});

router.post("/delete/user", async (req, res) => {
  const docId = req.body.docId;

  const response = await deleteUserService(docId);

  if (response == true) {
    res.status(200).json({ message: "Data Deleted!" });
  } else {
    res.status(401).json({ message: "There was some error, please try again!" });
  }
});

module.exports = router;
