import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
 
export default function LoginForm() {
 
    const router = useRouter()
    const [pass, setPass] = useState("")

    async function onSubmit() {
       await axios.post("/api/login", { password: pass })
       router.reload()
    }

    return (
        <Box style={{padding: "20px"}}>
            <Typography variant="h6">
                Password
            </Typography>
            <TextField type="password" value={pass} onChange={v => setPass(v.target.value)} style={{ paddingTop: "20px" }} fullWidth size="small" />
            <div style={{ 
                paddingTop: "20px"
            }}>
                <Button size="large" onClick={() => onSubmit()}>
                    Login
                </Button>
            </div>
        </Box>
    )
}