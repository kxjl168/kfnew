import { useEffect } from "react";
import React from "react";


const RedirectQuery:React.FC<{}>=(props)=>{

    useEffect(()=>{
       window.location.href="http://test.256kb.cn/op/#/test/regex";
    },[])

    return <></>
}

export default RedirectQuery;