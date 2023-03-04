const { Storage } = require("@google-cloud/storage")
 
module.exports = async function remove(path) { 
    const storage = new Storage({ keyFilename: process.env.KEY_PATH })
    const bucket = storage.bucket(process.env.BUCKET || "")  
 
    await bucket.file(path).delete();
}