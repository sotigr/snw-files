import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";

interface Props {
    paths: string[]
    onNo: () => void
    onChange: () => void
}

export default function DeleteForm({ paths, onNo, onChange }: Props) {


    async function onSubmit() {
        // if (folderName.trim() == "") return
        // let name = folderName.replace("/", "") + "/"
        let promises = []
        for (let path of paths) {
            promises.push(
                axios.post("/api/delete", {
                    path
                })
            )
        }
        await Promise.all(promises)
        onChange()
    }

    return (
        <>
            <Typography variant="h6">
                Delete:
            </Typography>
            <div style={{ maxHeight: "250px", overflowY: "scroll" }}>
                {paths.map(p => <div key={p}>{p}</div>)}
            </div>
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