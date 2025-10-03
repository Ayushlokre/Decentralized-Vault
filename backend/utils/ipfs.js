const { create } = require("ipfs-http-client");
const fetch = require("node-fetch");

const IPFS_API_URL = "http://127.0.0.1:5001";

const customFetch = (url, options = {}) => {
    if (options.body) {
        options.duplex = "half";
    }
    options.signal = options.signal || AbortSignal.timeout(30000);
    return fetch(url, options);
};

const ipfs = create({
    url: IPFS_API_URL,
    fetch: customFetch
});

const uploadToIPFS = async (fileBuffer, fileName = "unnamed") => {
    try {
        if (!fileBuffer || fileBuffer.length === 0) {
            throw new Error("Invalid file buffer: empty or missing");
        }

        console.log(`Uploading file buffer to IPFS (size: ${fileBuffer.length} bytes)...`);

        const addResult = await ipfs.add(
            { path: fileName, content: fileBuffer },
            { pin: true }
        );

        if (!addResult || !addResult.cid) {
            throw new Error("IPFS returned invalid result");
        }

        return addResult.cid.toString();
    } catch (error) {
        console.error(`❌ IPFS Upload Failed for ${fileName}:`, error.message || error);
        throw error;
    }
};

module.exports = uploadToIPFS;
