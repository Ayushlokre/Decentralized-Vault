// controllers/fileController.js
const File = require("../models/File");
const uploadToIPFS = require("../utils/ipfs");
const { createLog } = require("../controllers/logController");
const { logTransactionOnBlockchain } = require("../utils/blockchain");
const axios = require("axios");

const uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file provided" });

        const file = req.file;

        console.log("Uploading file:", file.originalname);
        console.log("MIME type:", file.mimetype);
        console.log("File size:", file.size);

        if (!file.buffer) throw new Error("File buffer is missing");

        const ipfsHash = await uploadToIPFS(file.buffer, file.originalname);
        console.log("✅ IPFS upload successful. CID:", ipfsHash);

        const blockchainMessage = `File uploaded: ${file.originalname}, CID: ${ipfsHash}`;
        let solanaTxHash = "blockchain_error";

        try {
            solanaTxHash = await logTransactionOnBlockchain(blockchainMessage);
            if (solanaTxHash !== "blockchain_error") console.log("✅ Blockchain log successful:", solanaTxHash);
        } catch (err) {
            console.warn("⚠️ Blockchain logging error:", err.message);
        }

        const newFile = await File.create({
            name: file.originalname,
            ipfsHash,
            size: file.size,
            mimeType: file.mimetype,
            solanaTxHash,
            owner: req.user._id,
        });

        await createLog({
            action: "File Upload",
            user: req.user._id,
            file: newFile._id,
            details: blockchainMessage,
        });

        res.status(201).json(newFile);
    } catch (error) {
        console.error("Upload Error:", error);

        let errorMessage = "An unexpected error occurred during file upload.";
        if (error.message && (error.message.includes("ECONNREFUSED") || error.message.includes("Failed to fetch"))) {
            errorMessage = "Service Unavailable: Could not connect to the IPFS node.";
            return res.status(503).json({ message: errorMessage });
        } else if (error.message) {
            errorMessage = error.message;
        }

        res.status(500).json({ message: errorMessage });
    }
};

const getFiles = async (req, res) => {
    try {
        const files = await File.find({ owner: req.user._id });
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const listFiles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const files = await File.find({ owner: req.user._id })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await File.countDocuments({ owner: req.user._id });

        res.json({ page, totalPages: Math.ceil(total / limit), files });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const downloadFile = async (req, res) => {
    try {
        const { cid } = req.params;
        if (!cid) return res.status(400).json({ message: "CID is required" });

        const response = await axios.get(`https://ipfs.io/ipfs/${cid}`, { responseType: "arraybuffer" });
        res.setHeader("Content-Disposition", `attachment; filename="${cid}"`);
        res.send(response.data);
    } catch (error) {
        console.error("Download Error:", error);
        res.status(500).json({ message: "Failed to download file from IPFS" });
    }
};

module.exports = { uploadFile, getFiles, listFiles, downloadFile };
