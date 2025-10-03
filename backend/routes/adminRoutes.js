// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { getAllUsers, getAllFiles } = require("../controllers/adminController");
const { getAllLogs } = require("../controllers/logController");

// Admin gets all users
router.get("/users", protect, admin, getAllUsers);

// Admin gets all files
router.get("/files", protect, admin, getAllFiles);

// Admin gets all logs
router.get("/logs", protect, admin, getAllLogs);

module.exports = router;
