// config/solana.js
require("dotenv").config();
const { Connection, Keypair } = require("@solana/web3.js");

const SOLANA_NETWORK = process.env.SOLANA_NETWORK || "https://api.devnet.solana.com";

// Create connection to Solana devnet
const connection = new Connection(SOLANA_NETWORK, "confirmed");

if (!process.env.SOLANA_PRIVATE_KEY) {
    throw new Error("Missing SOLANA_PRIVATE_KEY in .env");
}

let secretKey;
try {
    secretKey = JSON.parse(process.env.SOLANA_PRIVATE_KEY);
} catch (error) {
    console.error("Failed to parse SOLANA_PRIVATE_KEY from .env:", error);
    process.exit(1);
}

const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));

console.log("🔗 Solana connection established.");
console.log("🆔 Wallet Public Key:", wallet.publicKey.toBase58());

module.exports = { connection, wallet };
