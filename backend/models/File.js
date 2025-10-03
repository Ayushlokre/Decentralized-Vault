// models/File.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ipfsHash: { type: String, required: true },
    size: { type: Number },
    mimeType: { type: String },
    solanaTxHash: { type: String, default: null },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("File", fileSchema);
