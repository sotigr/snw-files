import { Button, LinearProgress, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import openFile from "../storage/open-file";
import { ContentPaste } from "@mui/icons-material";

interface Props {
    path: string
    onChange: () => void
}

export default function UploadForm({ path, onChange }: Props) {

    const [fileName, setFileName] = useState("")
    const [files, setFiles] = useState<FileList | File[]>(null)
    const [finalName, setFinalName] = useState("")
    const [status, setStatus] = useState(null)
    function getFileFromPasteEvent(event) {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (let index in items) {
            const item = items[index];
            if (item.kind === 'file') {
                return item.getAsFile();
            }
        }
    }
    // useEffect(() => {
 
    //     document.onpaste = function (event) {
    //         const file = getFileFromPasteEvent(event);
    //         if (!file) { return; }

    //         setFiles([file])
    //         setFileName(file.name)
    //     }
    //     return () => {
    //         document.onpaste = () => { }
    //     }
    // }, [])
    function onClipboard (event) {
        const file = getFileFromPasteEvent(event);
        if (!file) { return; }

        setFiles([file])
        setFileName(file.name)
    }
 
    useEffect(() => {
        let name = fileName.replace("/", "")
        setFinalName((path == "/" ? "" : path) + name)
    }, [files, fileName])

    async function uploadFiles(files: FileList) {
        let len = files.length
        let cn = 0
        for (let cfile of files as any) {
            const file: File = cfile
            const name = file.name
            cn += 1

            let data = new FormData()
            data.append("path", (path == "/" ? "" : path) + name)
            data.append("file", cfile, name)

            const onUploadProgress = (event) => {
                const percentage = Math.round((100 * event.loaded) / event.total);
                setStatus(<div><span> Uploading: {name} {cn}/{len}</span> <LinearProgress variant="determinate" value={percentage} /> </div>)
            };

            await axios.postForm("/api/upload", data, {
                onUploadProgress
            })

        }

        setStatus(null)
    }

    async function onSubmit() {
        let files = await openFile(null, true)

        if (files.length == 0) return;

        if (files.length == 1) {
            setFiles(files)
            setFileName(files[0].name)
        } else {
            uploadFiles(files)
            onChange()
        }

    }

    async function upload() {

        let name = fileName.replace("/", "")
        let data = new FormData()
        data.append("path", (path == "/" ? "" : path) + name)
        data.append("file", files[0], name)
        const onUploadProgress = (event) => {
            const percentage = Math.round((100 * event.loaded) / event.total);

            setStatus(<div> <LinearProgress variant="determinate" value={percentage} /> </div>)
        };

        await axios.postForm("/api/upload", data, {
            onUploadProgress
        })

        setStatus(null)
        onChange()
    }

    return (
        <>
            <Typography variant="h6">
                Upload
            </Typography>

            {
                !status && (
                    <div style={{
                        paddingTop: "20px",
                    }}>
                        <Button size="large" onClick={() => onSubmit()}>
                            Select File
                        </Button>
                        <Button contentEditable size="large" onPaste={onClipboard}>
                            <ContentPaste />
                        </Button>
                    </div>
                )
            }

            {
                files && files.length == 1 && !status && (
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
            {
                status && (
                    <div>
                        {status}
                    </div>
                )
            }

        </>
    )
}