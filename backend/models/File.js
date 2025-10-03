const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Required
    ipfsHash: { type: String, required: true },
    size: { type: Number },
    mimeType: { type: String },
    solanaTxHash: { type: String }, // Added field
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Added field
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("File", fileSchema);
