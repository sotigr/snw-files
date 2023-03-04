const { Storage } = require("@google-cloud/storage")

module.exports = async function list(inDirectory) {
    const storage = new Storage({ keyFilename: process.env.KEY_PATH })
    const bucket = storage.bucket(process.env.BUCKET || "")
    const directory = inDirectory.endsWith("/") ? inDirectory : inDirectory + "/"
    const options = {
        prefix: directory,
        delimiter: "/",
        includeTrailingDelimiter: true
    }
    const [files] = await bucket.getFiles(options)

    let filesOut = []
    let foldersOut  = [] 
 
    for (let file of files) {
        let name = file.name 
     
        if (name == directory) {
            continue;
        }

        if (name.endsWith("/")) {
            name = name.substring(0, name.length - 1)
            name = name.substring(name.lastIndexOf("/")).substring(1)
            foldersOut.push({
                name: name,
                fullName: file.name
            })
        } else {
            name = name.substring(name.lastIndexOf("/")).substring(1)
            filesOut.push({
                name: name,
                fullName: file.name
            })
        }

    }

    return {
        files: filesOut,
        folders: foldersOut
    }
}