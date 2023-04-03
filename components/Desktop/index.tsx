import getStyles from "./styles"
import Window from "../Window"
import FileExplorer from "../FileExplorer" 
import { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"

type Props = {
    children: React.ReactNode
}

function Shadow ({children} : Props) {

    const [shadowRoot, setShadowRoot] = useState(null)
    const node  = useRef<HTMLDivElement>(null)
    useEffect(()=>{ 
        setShadowRoot( node.current.attachShadow({ mode: "open" }) )
    }, [])
 
   
      return (
        <div ref={node} style={{width: "100%", height: "100%"}}>
          {shadowRoot && ReactDOM.createPortal(children, shadowRoot)}
        </div>  
      )
  }
export default function Desktop() {

    const s = getStyles()


    return (
        <div style={s.wrapper}>
            <Window title="title" onClose={() => { alert("close") }}> 
                <FileExplorer /> 
            </Window>
        </div>
    )
}