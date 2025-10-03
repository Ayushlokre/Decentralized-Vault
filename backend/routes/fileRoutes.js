// fileRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const { uploadFile, getFiles } = require("../controllers/fileController");

// Explicit memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file
router.post("/upload", protect, upload.single("file"), uploadFile);

// Get all files of the user
router.get("/", protect, getFiles);

module.exports = router;