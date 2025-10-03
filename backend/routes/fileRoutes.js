// routes/fileRoutes.js
const express = require("express");
const multer = require("multer");
const { uploadFile, getFiles, listFiles, downloadFile } = require("../controllers/fileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer(); // Using multer memory storage

// Upload file
router.post("/upload", protect, upload.single("file"), uploadFile);

// List files for user
router.get("/", protect, listFiles);

// Download file by CID
router.get("/download/:cid", protect, downloadFile);

module.exports = router;
