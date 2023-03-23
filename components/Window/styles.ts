
// import { useContext } from "react"
// import ResponsiveContext from "../../context/responsive"
import { StyleMap } from "../../types"

export default function getStyles(): StyleMap {


    // const r = useContext(ResponsiveContext)

    const titleBarHeight = "30px"

    return {
        window: {
            position: "absolute",
            border: "1px solid black",
            overflow: "hidden",
            paddingTop: titleBarHeight
        },
        titleBar: {
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: titleBarHeight,
            borderBottom: "1px solid black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#555",
            userSelect: "none"
        },
        resize: {
            cursor: "nw-resize",
            width: "10px",
            height: "10px",
            position: "absolute",
            bottom: 0,
            right: 0,
            userSelect: "none", 
            zIndex: 1
        },
        closeButton: {
            borderRadius: "50%",
            transform: "scale(.7)",
            position: "absolute",
            right: 0,
            top: 0,
            height: titleBarHeight,
            width: titleBarHeight,
            background: "maroon",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 1
        }
    }
}