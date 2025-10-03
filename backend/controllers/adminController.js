// backend/controllers/adminController.js
const User = require("../models/User");
const File = require("../models/File");
const { createLog } = require("./logController");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        await createLog({
            action: "Admin Viewed Users",
            user: req.user._id,
            details: "Admin viewed all registered users",
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllFiles = async (req, res) => {
    try {
        const files = await File.find().populate("owner", "name email");
        await createLog({
            action: "Admin Viewed Files",
            user: req.user._id,
            details: "Admin viewed all uploaded files",
        });
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, getAllFiles };
