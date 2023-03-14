const { Storage } = require("@google-cloud/storage")

module.exports = async function move(from, to) {
    const storage = new Storage({ keyFilename: process.env.KEY_PATH })
    
    const moveDestination = storage.bucket(process.env.BUCKET || "").file(to);

    const moveOptions = {
        preconditionOpts: {
            ifGenerationMatch: 0,
        },
    };

    await storage
        .bucket(process.env.BUCKET || "")
        .file(from)
        .move(moveDestination, moveOptions);
}