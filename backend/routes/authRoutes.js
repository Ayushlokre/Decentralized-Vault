// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, authUser } = require("../controllers/authController");

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", authUser);

module.exports = router;
