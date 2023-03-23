import { useEffect, useRef, useState } from "react"
import { Point, Size } from "../../types"
import getStyles from "./styles"
import { Close } from "@mui/icons-material"
import React from "react"

type Props = {
    children: React.ReactNode,
    onClose: () => void,
    title: string
}

const WindowContext = React.createContext(null)
export { WindowContext }

export default function Window(props: Props) {

    const [position, setPosition] = useState<Point>({ x: 0, y: 0 })
    const [titleBarInitPos, setTitleBarInitPos] = useState<Point>({ x: 0, y: 0 })
    const [size, setSize] = useState<Size>({ width: 800, height: 600 })
    const [mouseDown, setMouseDown] = useState<boolean>(false)
    const [mouseResizeDown, setMouseResizeDown] = useState<boolean>(false)


    const titleBarRef = useRef<HTMLDivElement>(null)
    const windowRef = useRef<HTMLDivElement>(null)

    const s = getStyles()

    function updateMouseDown(e) {

        const boundingRect = titleBarRef.current.getBoundingClientRect()
        setTitleBarInitPos({
            x: e.clientX - boundingRect.x,
            y: e.clientY - boundingRect.y
        })
        setMouseDown(true)
    }

    function moveWindow(e) {
        if (mouseDown) {

            let pos: Point = {
                x: e.clientX - titleBarInitPos.x,
                y: (e.clientY - titleBarRef.current?.clientHeight / 2)
            }

            if (
                pos.x > 0 && pos.y > 0
            ) {
                setPosition(pos)
            }

        }
    }

    function resizeWindow(e) {
        if (mouseResizeDown) {
            const boundingRect = titleBarRef.current.getBoundingClientRect()

            setSize({
                width: e.clientX - boundingRect.left,
                height: e.clientY - boundingRect.top,
            })
        }
    }


    useEffect(() => {

        function cancelMove() {
            setMouseDown(false)
        }

        window.addEventListener("mousemove", moveWindow)

        window.addEventListener("mouseup", cancelMove)

        return () => {
            window.removeEventListener("mousemove", moveWindow)

            window.removeEventListener("mouseup", cancelMove)
        }

    }, [mouseDown])

    useEffect(() => {

        function cancelMove(e) {
            setMouseResizeDown(false)
        }

        window.addEventListener("mousemove", resizeWindow)
        window.addEventListener("mouseup", cancelMove)

        return () => {
            window.removeEventListener("mousemove", resizeWindow)
            window.removeEventListener("mouseup", cancelMove)
        }

    }, [mouseResizeDown])

    return (
        <div
            ref={windowRef}
            style={{
                ...s.window,
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height
            }}>
            <div
                ref={titleBarRef}
                onMouseDown={updateMouseDown}
                onMouseUp={() => setMouseDown(false)}
                style={s.titleBar}>
                {props.title}
                <div style={s.closeButton} onClick={props.onClose}>
                    <Close />
                </div>
            </div>

            <div style={{ height: "100%", overflow: 'hidden' }}>
                <WindowContext.Provider value={{
                    close: props.onClose
                }}>
                    {props.children}
                </WindowContext.Provider>
            </div>
            <div
                onMouseDown={() => setMouseResizeDown(true)}
                onMouseUp={() => setMouseResizeDown(false)}
                style={s.resize}
            />
        </div>
    )
}