import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import openFile from "../storage/open-file";

interface Props {
    path: string
    onChange: () => void
}

export default function UploadForm({ path, onChange }: Props) {

    const [fileName, setFileName] = useState("")
    const [file, setFile] = useState(null)
    const [finalName, setFInalName] = useState("")

    useEffect(()=> {
        let name = fileName.replace("/", "") 
        setFInalName("root/" + (path == "/" ? "" : path) + name)
    }, [file, fileName])

    async function onSubmit() { 
        let files = await openFile()

        if (!files[0]) return;

        setFile(files[0])
        setFileName(files[0].name)
    }

    async function upload() {
        
        let name = fileName.replace("/", "") 
        let data = new FormData()
        data.append("path", "root/" + (path == "/" ? "" : path) + name)
        data.append("file", file, name)

        await axios.postForm("/api/upload", data)

        onChange()
    }

    return (
        <>
            <Typography variant="h6">
                Upload
            </Typography>

            <div style={{
                paddingTop: "20px",
            }}>
                <Button size="large" onClick={() => onSubmit()}>
                    Select File
                </Button>
            </div>
            {
                file && (
                    <>
                        <TextField value={fileName} onChange={v => setFileName(v.target.value)} style={{ paddingTop: "20px" }} fullWidth size="small" />
                        <Typography>
                            {finalName}
                        </Typography>
                        <div style={{
                            paddingTop: "20px",
                        }}>
                            <Button size="large" onClick={() => upload()}>
                                Upload
                            </Button>
                        </div>
                    </>
                )
            }

        </>
    )
}