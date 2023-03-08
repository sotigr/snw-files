
const multer = require('multer');
var storage = require("../storage/multer")
const upload = multer({storage: storage});   
const pathPrefix = require('./helpers/path-prefix');
const writeFile   = require('../storage/write-file');

module.exports =  [
    upload.single('file'),
    async function (req, res, next) { 
        // const pathName = pathPrefix() + req.body.path
         
        
        res.end("ok")
    }
]