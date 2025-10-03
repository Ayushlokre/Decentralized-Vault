// controllers/fileController.js
const File = require("../models/File");
const uploadToIPFS = require("../utils/ipfsUploader"); // Updated import
const { createLog } = require("./logController");

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file provided" });
        }

        const file = req.file;

        console.log("Uploading file:", file.originalname);

        if (!file.buffer || file.buffer.length === 0) {
            throw new Error("File buffer is missing or empty");
        }

        const ipfsHash = await uploadToIPFS(file.buffer, file.originalname);

        const solanaTxHash = "dummy_solana_tx_hash_" + Date.now();

        const newFile = await File.create({
            fileName: file.originalname,
            ipfsHash,
            solanaTxHash,
            owner: req.user._id,
        });

        await createLog({
            action: "File Upload",
            user: req.user._id,
            file: newFile._id,
            details: `Uploaded file ${file.originalname} with IPFS hash ${ipfsHash} and Solana TX ${solanaTxHash}`,
        });

        res.status(201).json({
            message: "File uploaded successfully",
            file: newFile
        });

    } catch (error) {
        console.error("Upload Error:", error);

        const errorMessage = error.message || "Unexpected error during file upload";
        res.status(500).json({ message: errorMessage });
    }
};

const getFiles = async (req, res) => {
    try {
        const files = await File.find({ owner: req.user._id }).populate('owner', 'username email');
        res.json({
            message: "Files fetched successfully",
            files
        });
    } catch (error) {
        console.error("Get Files Error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadFile, getFiles };
