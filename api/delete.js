const remove = require("../storage/remove")

 


module.exports =  async function (req, res) { 
        const pathName = req.body.path
        
        // console.log({pathName} )
        await remove(pathName)
        
        
        res.end("ok")
    }
