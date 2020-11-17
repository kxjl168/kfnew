import { useEffect } from "react";
import React from "react";


const RedirectQuery:React.FC<{}>=(props)=>{

    useEffect(()=>{
        props.history.push("/s/search3test");
    },[])

    return <></>
}

export default RedirectQuery;