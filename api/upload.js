
const multer = require('multer');
const upload = multer();  
const write = require("../storage/write");
const pathPrefix = require('./helpers/path-prefix');


module.exports =  [
    upload.single('file'),
    async function (req, res, next) {
        const buffer = req.file.buffer
        const pathName = pathPrefix() + req.body.path
        
        await write(pathName, buffer)
        
        
        res.end("ok")
    }
]