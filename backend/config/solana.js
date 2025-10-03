// config/solana.js
require("dotenv").config();
const { Connection, clusterApiUrl, Keypair } = require("@solana/web3.js");

// Create connection to Solana devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const secretKey = JSON.parse(process.env.SOLANA_SECRET_KEY_JSON);
const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));

console.log("🔗 Solana connection established.");
console.log("🆔 Wallet Public Key:", wallet.publicKey.toBase58());

module.exports = { connection, wallet };
