
import { Box, IconButton, Modal } from '@mui/material';



import CodeMirror from '@uiw/react-codemirror';
import { oneDark, oneDarkTheme } from '@codemirror/theme-one-dark';
import { useState } from "react";
import Close from '@mui/icons-material/Close';

interface Props {
    open: boolean
    onClose?: () => void
    onNext?: () => void
    onPrevious?: () => void
    mediaType?: string
    mediaPath?: string
}


export default function MediaModal({ open, onClose, mediaPath, mediaType, onNext, onPrevious }: Props) {

    function renderImage() {
        return <img
            style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
            }}
            src={mediaPath} />
    }
    function renderVideo() {
        return <video
            style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
            }}
            controls
            src={mediaPath} />
    }

    return (
        <Modal open={open} onClose={() => onClose()}>
            <div style={{
                position: "absolute",
                top: '0px',
                left: '0px',
                bottom: '0px',
                right: '0px',
                userSelect: "none"
            }}>
                <IconButton onClick={() => onClose()}
                    style={{ position: "absolute", top: "5px", right: "5px", zIndex: 2 }}>
                    <Close />
                </IconButton>

                {mediaType == "image" && renderImage()}
                {mediaType == "video" && renderVideo()}
                {
                    mediaType == "image" && (
                        <>
                            <div onClick={() => onPrevious()} style={{
                                position: "absolute",
                                top: "0",
                                left: "0",
                                bottom: "0",
                                width: "20%",
                                cursor: "pointer"
                            }} />
                            <div onClick={() => onNext()} style={{
                                position: "absolute",
                                top: "0",
                                right: "0",
                                bottom: "0",
                                width: "20%",
                                cursor: "pointer"
                            }} />
                        </>
                    )
                }
            </div>
        </Modal>
    )
}