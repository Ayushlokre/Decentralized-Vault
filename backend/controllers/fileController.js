const File = require("../models/File");
const uploadToIPFS = require("../utils/ipfs");
const { createLog } = require("./logController");
const connection = require("../config/solana");

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file provided" });
        }

        const file = req.file;

        console.log("Uploading file:", file.originalname);
        console.log("MIME type:", file.mimetype);
        console.log("File size:", file.size);
        console.log("Buffer length:", file.buffer?.length);

        if (!file.buffer) {
            throw new Error("File buffer is missing");
        }

        const ipfsHash = await uploadToIPFS(file.buffer);

        const solanaTxHash = "dummy_solana_tx_hash_" + Date.now();

        const newFile = await File.create({
            name: file.originalname, // fixed: matches schema
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
            details: `Uploaded file ${file.originalname} with IPFS hash ${ipfsHash} and Solana TX ${solanaTxHash}`,
        });

        res.status(201).json(newFile);
    } catch (error) {
        console.error("Upload Error (Detail):", error);

        let errorMessage = "An unexpected error occurred during file upload.";

        if (error.message && (error.message.includes("ECONNREFUSED") || error.message.includes("Failed to fetch"))) {
            errorMessage = "Service Unavailable: Could not connect to the IPFS node. Please ensure IPFS Desktop is running.";
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

module.exports = { uploadFile, getFiles };
