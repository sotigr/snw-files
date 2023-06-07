const read = require("../storage/read")

const mime = require("mime")

// const { Readable } = require('stream'); 

const pathPrefix = require("./helpers/path-prefix");

const readToFile = require("../storage/read-to-file")

const fs = require("fs")
const md5 = require("md5")

const fileDir = "/tmp/files"
const thumbDir = "/tmp/thumbs"

module.exports = async function (req, res) {

    const pathName = pathPrefix() + req.query.path
    const thumb = req.query.thumb == "true"

    const download = req.query.download
    const tempPath = `${fileDir}/tmp-` + md5(pathName)
    const tempPathThumb = `${thumbDir}/tmp-thumb_` + md5(pathName)
    if (!fs.existsSync(fileDir)){
        fs.mkdirSync(fileDir);
    }
    if (!fs.existsSync(thumbDir)){
        fs.mkdirSync(thumbDir);
    }


    const tempExists = fs.existsSync(thumb ? tempPathThumb : tempPath)

    if (!tempExists) {
        await readToFile(pathName, tempPath)
        if (thumb) {
            const sharp = require('sharp');
            await sharp(tempPath).resize({ height: 128 }).toFile(tempPathThumb)
        }
    }


    let extension = pathName.substring(pathName.lastIndexOf(".") + 1)
    let mimeType = mime.getType(extension)

    if (mimeType == "video/mp4") {
        const range = req.header('range');
        if (!range) {
            res.status(400).send("Requires Range header");
            return
        }
        const videoPath = tempPath;
        const videoSize = fs.statSync(videoPath).size;
        const CHUNK_SIZE = 10 ** 6;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
        const contentLength = end - start + 1;

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);
        const videoStream = fs.createReadStream(videoPath, { start, end });
        videoStream.pipe(res);
    } else {

        const readStream = fs.createReadStream(thumb ? tempPathThumb : tempPath)
        if (pathName && download == "true") {
            let newFileName = pathName
            res.setHeader('Content-disposition', 'attachment; filename="' + encodeURIComponent(newFileName) + '"');

        }

        res.setHeader('Content-type', mimeType || "");

        readStream.pipe(res);
    }

}
