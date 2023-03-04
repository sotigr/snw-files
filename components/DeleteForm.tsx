import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";

interface Props { 
    path: string
    onNo: () => void
    onChange: () => void
}

export default function DeleteForm({ path, onNo, onChange }: Props) {
 

    async function onSubmit() {
        // if (folderName.trim() == "") return
        // let name = folderName.replace("/", "") + "/"

        await axios.post("/api/delete", {
            path
        })
        onChange()
    }

    return (
        <>
            <Typography variant="h6">
                Delete {path}?
            </Typography>
            <div style={{
                display: "flex",
                gap: "10px",
                paddingTop: "20px",
                justifyContent: "end"
            }}>
                <Button size="large" onClick={() => onNo()}>
                    No
                </Button>
                <Button size="large" onClick={() => onSubmit()}>
                    Yes
                </Button>
            </div>
        </>
    )
}