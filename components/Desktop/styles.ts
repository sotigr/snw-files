
import { useContext } from "react"
import ResponsiveContext from "../../context/responsive"
import { StyleMap } from "../../types"

export default function getStyles(): StyleMap {


    const r = useContext(ResponsiveContext)
    return {
        wrapper: {
            // backgroundColor: r.desktop? "blue": "red",
            position: "fixed",
            top: "0",
            left: "0",
            bottom: "0",
            right: "0"
        }
    }
}