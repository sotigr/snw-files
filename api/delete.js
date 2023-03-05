const remove = require("../storage/remove")
const pathPrefix = require("./helpers/path-prefix")

 


module.exports =  async function (req, res) { 
        const pathName = pathPrefix() + req.body.path
         
        await remove(pathName)
        
        
        res.end("ok")
    }
