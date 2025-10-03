// backend/models/Log.js
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    action: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    file: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
    timestamp: { type: Date, default: Date.now },
    details: { type: String },
});

module.exports = mongoose.model("Log", logSchema);
