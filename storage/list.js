const { Storage } = require("@google-cloud/storage")
const pathPrefix = require("../api/helpers/path-prefix")

module.exports = async function list(inDirectory) {
    const storage = new Storage({ keyFilename: process.env.KEY_PATH })
    const bucket = storage.bucket(process.env.BUCKET || "")
    const directory = inDirectory.endsWith("/") || inDirectory == "" ? inDirectory : inDirectory + "/"
  
    const options = {
        prefix: directory,
        delimiter: "/",
        includeTrailingDelimiter: true
    }
    const [files] = await bucket.getFiles(options)

    let filesOut = []
    let foldersOut = []

    for (let file of files) {

        let fileName = file.name.substring(pathPrefix().length)
        let name = fileName
        
        if (file.name == directory || name == pathPrefix()) {
            continue;
        }

        if (name.endsWith("/")) {
            name = name.substring(0, name.length - 1)
            name = name.substring(name.lastIndexOf("/")).replace("/","")

            foldersOut.push({
                name: name,
                fullName: fileName
            })
        } else {
            name = name.substring(name.lastIndexOf("/")).replace("/","")
            filesOut.push({
                name: name,
                fullName: fileName
            })
        }

    }

    return {
        files: filesOut,
        folders: foldersOut
    }
}