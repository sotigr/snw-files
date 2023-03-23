import React, { useEffect, useState } from "react"

export type ResponsiveContextPayload = {
    desktop: boolean
    mobile: boolean
    width: number
}

const ResponsiveContext = React.createContext<ResponsiveContextPayload>(null)

export function getResponsive() {
    
    const [resp, setResp] = useState<ResponsiveContextPayload>({
        desktop: false,
        mobile: true,
        width: 600
    })

    useEffect(()=>{

        const width = window.innerWidth
        if (width>=1024) {
            setResp({
                desktop: true,
                mobile: false,
                width: window.innerWidth
            })
        } else {
            setResp({
                desktop: false,
                mobile: true,
                width: window.innerWidth
            })
        }
        const mediaQueryList = window.matchMedia('(max-width: 1024px)'); 
        mediaQueryList.addEventListener("change", e=> { 
          if (e.matches) { 
            setResp({
                desktop: false,
                mobile: true,
                width: window.innerWidth
            })
          } else { 
            setResp({
                desktop: true,
                mobile: false,
                width: window.innerWidth
            })
          }
        });
    },[]) 

    return resp
}

export default ResponsiveContext