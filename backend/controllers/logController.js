// backend/controllers/logController.js
const Log = require("../models/Log");

const createLog = async ({ action, user, file = null, details = "" }) => {
    try {
        const log = await Log.create({ action, user, file, details });
        return log;
    } catch (error) {
        console.error("Error creating log:", error.message);
    }
};

const getAllLogs = async (req, res) => {
    try {
        const logs = await Log.find()
            .populate("user", "name email")
            .populate("file", "fileName ipfsHash");
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createLog, getAllLogs };
