
 
const folder = require("../storage/folder")


module.exports =  async function (req, res) { 
        const pathName = req.body.path
        
        // console.log({pathName} )

        await folder(pathName)
        
        
        res.end("ok")
    }
