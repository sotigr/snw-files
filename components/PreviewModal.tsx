
import { Box, IconButton, Modal } from '@mui/material';



import CodeMirror from '@uiw/react-codemirror';
import { oneDark, oneDarkTheme } from '@codemirror/theme-one-dark';
import { useState } from "react";
import Close from '@mui/icons-material/Close';

interface Props {
    open: boolean
    text?: string
    onClose?: () => void
}

const modalStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    bottom: '0',
    right: '0',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
};


export default function PreviewModal({ open, onClose, text }: Props) {
    return (
        <Modal open={open} onClose={() => onClose()}>
            <Box sx={modalStyle}>
                <IconButton onClick={() => onClose()} style={{ position: "absolute", top: "5px", right: "5px", zIndex: 2 }}>
                    <Close />
                </IconButton>
                <CodeMirror
                    editable={false}
                    value={text || "The file is empty"}
                    height="calc(100vh)"

                    theme={oneDarkTheme}
                    extensions={[oneDark, oneDarkTheme]}
                // onChange={() => setValue(value)}
                />
            </Box>
        </Modal>
    )
}