// utils/blockchain.js
const { connection, wallet } = require("../config/solana");
const { SystemProgram, Transaction } = require("@solana/web3.js");

async function ensureWalletHasSol() {
    try {
        const balance = await connection.getBalance(wallet.publicKey);
        console.log("💰 Wallet balance:", balance / 1e9, "SOL");

        if (balance > 1e7) return; // skip airdrop if > 0.01 SOL

        console.log("⚡ Airdropping 1 SOL...");
        const airdropSignature = await connection.requestAirdrop(wallet.publicKey, 1e9);
        await connection.confirmTransaction(airdropSignature, "confirmed");

        console.log("✅ Airdrop completed.");
    } catch (error) {
        console.warn("⚠️ Airdrop failed:", error.message);
    }
}

async function logTransactionOnBlockchain(message) {
    try {
        await ensureWalletHasSol();

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: wallet.publicKey, // self-transfer acts as a log
                lamports: 0,
            })
        );

        const signature = await connection.sendTransaction(transaction, [wallet]);
        await connection.confirmTransaction(signature, "confirmed");

        console.log("✅ Blockchain log hash:", signature);
        return signature;
    } catch (error) {
        console.warn("⚠️ Blockchain logging failed:", error.message);
        return "blockchain_error";
    }
}

module.exports = { logTransactionOnBlockchain };
