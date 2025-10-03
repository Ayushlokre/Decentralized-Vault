// backend/app.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get("/", (req, res) => {
    res.send("Decentralized Data Vault API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("💡 Tip: Ensure 'ipfs daemon' is running for uploads to work.");
});
