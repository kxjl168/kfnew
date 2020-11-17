import { useEffect } from "react";
import React from "react";


const RedirectQuery:React.FC<{}>=(props)=>{

    useEffect(()=>{
        props.history.push("/s/search3");
    },[])

    return <></>
}

export default RedirectQuery;