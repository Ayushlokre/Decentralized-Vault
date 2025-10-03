// utils/ipfs.js
const axios = require("axios");
const FormData = require("form-data");

const IPFS_API_URL = "http://127.0.0.1:5001/api/v0/add";

const uploadToIPFS = async (fileBuffer, fileName) => {
    try {
        console.log("Uploading file buffer to IPFS via HTTP API...");

        const formData = new FormData();
        formData.append("file", fileBuffer, { filename: fileName });

        const response = await axios.post(IPFS_API_URL, formData, {
            headers: formData.getHeaders()
        });

        if (!response.data.Hash) {
            console.error("IPFS returned invalid result:", response.data);
            throw new Error("IPFS returned an invalid CID result.");
        }

        console.log("✅ IPFS upload successful. CID:", response.data.Hash);
        return response.data.Hash;

    } catch (error) {
        console.error("IPFS upload error:", error);
        throw error;
    }
};

module.exports = uploadToIPFS;
