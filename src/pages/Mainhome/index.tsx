import { useEffect } from "react";
import React from "react";


const Mainhome:React.FC<{}>=()=>{

    useEffect(()=>{
        window.location.href="http://256kb.cn";
    },[])

    return <></>
}

export default Mainhome;