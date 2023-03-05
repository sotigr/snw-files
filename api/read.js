const read = require("../storage/read")

const mime = require("mime")

const { Readable } = require('stream');

const NodeCache = require("node-cache");
const pathPrefix = require("./helpers/path-prefix");
const mediaCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const maxCacheSizeBytes = 30 * 1024 * 1024

module.exports = async function (req, res) {

    const pathName = pathPrefix() +  req.query.path 
    const download = req.query.download


    let contents = mediaCache.get(pathName)
    if (!contents) {
        contents = await read(pathName)
        if (mediaCache.stats.vsize < maxCacheSizeBytes && contents) {
            mediaCache.set(pathName, contents, 1000);
        }
    }

    if (!contents) {
        res.statusCode = 404
        res.end(JSON.stringify({ message: "FILE_NOT_FOUND" }))
        return
    }

    const readStream = Readable.from(contents);

    let extension = pathName.substring(pathName.lastIndexOf(".") + 1)
    let mimeType = mime.getType(extension)
    if (pathName && download == "true") {
        let newFileName = pathName  
        res.setHeader('Content-disposition', 'attachment; filename="' + encodeURIComponent(newFileName) + '"');
    }

    res.setHeader('Content-type', mimeType || "");

    readStream.pipe(res);
}
