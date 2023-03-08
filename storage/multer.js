const pathPrefix = require("../api/helpers/path-prefix")
const { Storage } = require("@google-cloud/storage")
module.exports = {
    _handleFile: async (req, file, cb) => {

        const path = pathPrefix() + req.body.path
        
        const storage = new Storage({ keyFilename: process.env.KEY_PATH })
       
        const bucket = storage.bucket(process.env.BUCKET || "")
    
        // await bucket.file(path).save(buffer))
        const blob = bucket.file(path);
        const blobStream = blob.createWriteStream();
    
        blobStream.on('error', cb);
    
        blobStream.on('finish',  function () {
            cb(null, {
                path: path,
                size: blobStream.bytesWritten
            })
        });
     
        file.stream.pipe(blobStream); 
    }
}