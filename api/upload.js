
const multer = require('multer');
const upload = multer();  
const write = require("../storage/write")


module.exports =  [
    upload.single('file'),
    async function (req, res, next) {
        const buffer = req.file.buffer
        const pathName = req.body.path
        
        await write(pathName, buffer)
        
        
        res.end("ok")
    }
]