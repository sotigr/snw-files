
 
const folder = require("../storage/folder")
const pathPrefix = require("./helpers/path-prefix")


module.exports =  async function (req, res) { 
        const pathName = pathPrefix() + req.body.path
         
        await folder(pathName)
        
        
        res.end("ok")
    }
