const { Storage } = require("@google-cloud/storage")

module.exports = async function read(path) {
    const storage = new Storage({ keyFilename: process.env.KEY_PATH })
    const contents = await storage.bucket(process.env.BUCKET || "").file(path).download();
    return contents
}