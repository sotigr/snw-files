import { MoveOptions, Storage } from "@google-cloud/storage";

export default async function move(from: string, to: string) {
    const storage = new Storage({ keyFilename: process.env.KEY_PATH })
    
    const moveDestination = storage.bucket(process.env.BUCKET || "").file(to);

    const moveOptions: MoveOptions = {
        preconditionOpts: {
            ifGenerationMatch: 0,
        },
    };

    await storage
        .bucket(process.env.BUCKET || "")
        .file(from)
        .move(moveDestination, moveOptions);
}