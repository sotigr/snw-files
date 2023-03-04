const { Storage } = require("@google-cloud/storage")

const exists = require("./exists")

module.exports = async function write(path, buffer, replace ) {
    const storage = new Storage({ keyFilename: process.env.KEY_PATH })
    if (!replace) {
        const fileExists = await exists(path)
        if (fileExists) {
            return false
        }
    }
    const bucket = storage.bucket(process.env.BUCKET || "")
     
    await bucket.file(path).save(buffer)
    return true
}