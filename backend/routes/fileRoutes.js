// routes/fileRoutes.js
const express = require("express");
const multer = require("multer");
const { uploadFile, getFiles, listFiles, downloadFile } = require("../controllers/fileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer(); // Using multer memory storage

router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/", protect, listFiles);
router.get("/:cid/download", protect, downloadFile);

module.exports = router;
