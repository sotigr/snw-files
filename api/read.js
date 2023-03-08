const read = require("../storage/read")

const mime = require("mime")

const { Readable } = require('stream');


const pathPrefix = require("./helpers/path-prefix");
 
const readToFile = require("../storage/read-to-file")

const fs = require("fs")
const md5 = require("md5")

module.exports = async function (req, res) {

    const pathName = pathPrefix() + req.query.path
    const download = req.query.download
    const tempPath = "/tmp/tmp-" + md5(pathName)

    const tempExists = fs.existsSync(tempPath)

    if (!tempExists) {
        await readToFile(pathName, tempPath) 
    } 

    // const readStream = Readable.from(contents);
    const readStream = fs.createReadStream(tempPath)
    let extension = pathName.substring(pathName.lastIndexOf(".") + 1)
    let mimeType = mime.getType(extension)
    if (pathName && download == "true") {
        let newFileName = pathName
        res.setHeader('Content-disposition', 'attachment; filename="' + encodeURIComponent(newFileName) + '"');
    }

    res.setHeader('Content-type', mimeType || ""); 

    readStream.pipe(res);
}
