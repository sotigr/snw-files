import getStyles from "./styles"
import Window from "../Window"
import FileExplorer from "../FileExplorer"

export default function Desktop() {

    const s = getStyles()


    return (
        <div style={s.wrapper}>
            <Window title="title" onClose={()=>{alert("close")}}> 
                <FileExplorer />
            </Window>
        </div>
    )
}