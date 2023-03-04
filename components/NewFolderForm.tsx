import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";

interface Props {
    path: string,
    onChange: () => void
}

export default function NewFolderForm({ path, onChange }: Props) {

    const [folderName, setFolderName] = useState("")

    async function onSubmit() {
        if (folderName.trim() == "") return
        let name = folderName.replace("/", "") + "/"
 
        await axios.post("/api/folder", {
            path: "root/"+(path=="/"?"":path)+name
        })

         onChange()
    }

    return (
        <>
            <Typography variant="h6">
                Folder Name
            </Typography>
            <TextField value={folderName} onChange={v => setFolderName(v.target.value)} style={{ paddingTop: "20px" }} fullWidth size="small" />
            <div style={{
                display: "flex",
                justifyContent: "end",
                paddingTop: "20px"
            }}>
                <Button size="large" onClick={() => onSubmit()}>
                    Create
                </Button>
            </div>
        </>
    )
}