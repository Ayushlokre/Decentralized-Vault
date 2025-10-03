// config/solana.js
const { Connection, clusterApiUrl } = require("@solana/web3.js");

const QUICKNODE_URL = "https://little-bold-star.solana-devnet.quiknode.pro/fe227d058325399c9cf511ad1a5302d367a28ddf/";

const connection = new Connection(QUICKNODE_URL, "confirmed");

module.exports = connection;
