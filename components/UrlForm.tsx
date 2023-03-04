import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import openFile from "../storage/open-file";

interface Props {
    path: string
    onChange: () => void
}

export default function UrlForm({ path, onChange }: Props) {

    const [fileName, setFileName] = useState("")
    const [url, setUrl] = useState("")

    async function upload() {

        let name = fileName.replace("/", "")
        let data = new FormData()
        let fullName = "root/" + (path == "/" ? "" : path) + name
        if (!fullName.endsWith(".url")) {
            fullName += ".url"
        }
        data.append("path", fullName)

        const urlBuffer = Buffer.from(url);

        data.append("file", new Blob([urlBuffer]), name)

        await axios.postForm("/api/upload", data)

        onChange()
    }

    return (
        <>
            <Typography variant="h6">
                Add url
            </Typography>

            <div style={{ paddingTop: "20px" }} >
                Url
            </div>
            <TextField value={url} onChange={v => setUrl(v.target.value)} fullWidth size="small" />
            <div style={{ paddingTop: "20px" }}>
                File name
            </div>
            <TextField value={fileName} onChange={v => setFileName(v.target.value)} fullWidth size="small" />

            <div style={{
                paddingTop: "20px",
            }}>
                <Button size="large" onClick={() => upload()}>
                    Save
                </Button>
            </div>
        </>
    )
}