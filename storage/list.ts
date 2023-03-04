import { GetFilesOptions, Storage } from "@google-cloud/storage"
import { CreateOptions } from "@google-cloud/storage/build/src/nodejs-common/service-object"

export type File = {
    name: string,
    fullName: string
}

export type Directory = {
    files: File[],
    folders: File[]
}

export default async function list(inDirectory: string): Promise<Directory> {
    const storage = new Storage({ keyFilename: process.env.KEY_PATH })
    const bucket = storage.bucket(process.env.BUCKET || "")
    const directory = inDirectory.endsWith("/") ? inDirectory : inDirectory + "/"
    const options: GetFilesOptions = {
        prefix: directory,
        delimiter: "/",
        includeTrailingDelimiter: true
    }
    const [files] = await bucket.getFiles(options)

    let filesOut: File[] = []
    let foldersOut: File[] = [] 
 
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