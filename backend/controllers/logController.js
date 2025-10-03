// controllers/logController.js
const Log = require("../models/Log");

// Create a log entry
const createLog = async ({ action, user, file, details }) => {
    try {
        await Log.create({ action, user, file, details });
    } catch (error) {
        console.error("Error creating log:", error);
    }
};

// Get all logs (Admin)
const getAllLogs = async (req, res) => {
    try {
        const logs = await Log.find().populate("user file");
        res.status(200).json(logs);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createLog, getAllLogs };
