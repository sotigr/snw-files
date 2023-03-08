const { Storage } = require("@google-cloud/storage")

module.exports = async function readToFile(path, savePath) { 
    const options = {
        destination: savePath
    }; 

    const storage = new Storage({ keyFilename: process.env.KEY_PATH })
    await storage.bucket(process.env.BUCKET || "").file(path).download(options);
}