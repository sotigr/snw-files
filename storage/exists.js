const { Storage } = require("@google-cloud/storage")

module.exports = async function exists(path) {
    const storage = new Storage({ keyFilename: process.env.KEY_PATH })
    const bucket = storage.bucket(process.env.BUCKET || "")
    return (await bucket.file(path).exists())[0]
}