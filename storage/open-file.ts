


export default function openFile(filter?: string[], multiple?: boolean): Promise<FileList> {
    const input: HTMLInputElement = document.createElement("input")
    input.type = "file"
    if (filter) {
        input.accept = filter.join(", ")
    }
    input.multiple = multiple ? true : false
    input.click()
    return new Promise((resolve: Function, reject: Function) => {
       
        input.onchange = function() {
            if (!input.files) {
                reject(null)
            }
 
            const files = Array.from(input.files)
            if (filter) {
                for (let file of files) {
                    if (!filter.includes(file.type)) {
                        reject(null)
                        return
                    }
                }
            }
                
            resolve(input.files)
        }
        
    })
}