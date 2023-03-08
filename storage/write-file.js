const { Storage } = require("@google-cloud/storage")

const exists = require("./exists")
const streamifier = require('streamifier');

module.exports = function writeFile(path, file, replace) {

    return new Promise(async (resolve, reject) => {

        const storage = new Storage({ keyFilename: process.env.KEY_PATH })
        if (!replace) {
            const fileExists = await exists(path)
            if (fileExists) {
                resolve(false)
            }
        }
        const bucket = storage.bucket(process.env.BUCKET || "")

        // await bucket.file(path).save(buffer))
        const blob = bucket.file(path);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', err => {
            reject(err);
        });

        blobStream.on('finish', () => {
            resolve(true)
        });

        // blobStream.end(file.buffer);

        file.stream.pipe(blobStream);

    })
}