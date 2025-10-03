const { create } = require("ipfs-http-client");

const projectId = process.env.IPFS_PROJECT_ID || ""; // if using Infura or similar
const projectSecret = process.env.IPFS_PROJECT_SECRET || "";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

// Connect to IPFS node
const ipfs = create({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization: auth,
  },
});

async function uploadToIPFS(fileBuffer, fileName) {
  try {
    const result = await ipfs.add(
      { path: fileName, content: fileBuffer },
      { 
        wrapWithDirectory: false,
        // ⚡ Fix for Node.js 22+
        duplex: "half"
      }
    );
    return result;
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw error;
  }
}

module.exports = uploadToIPFS;
