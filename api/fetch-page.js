
const multer = require('multer');
const upload = multer();  
const write = require("../storage/write");
const { default: axios } = require('axios');


module.exports =  [
    upload.single('file'),
    async function (req, res, next) { 
        const url = req.query.url
        
        const html = await axios.get(url,  {responseType: 'document'})
         
        res.end(html.data)
    }
]