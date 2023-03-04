import { CopyOptions, Storage } from "@google-cloud/storage";

export default async function copy(from: string, to: string) {
    const storage = new Storage({ keyFilename: process.env.KEY_PATH })
    
    const copyDestination = storage.bucket(process.env.BUCKET || "").file(to);

    const copyOptions: CopyOptions = {
        preconditionOpts: {
            ifGenerationMatch: 0,
        },
    };

    await storage
        .bucket(process.env.BUCKET || "")
        .file(from)
        .copy(copyDestination, copyOptions);
}