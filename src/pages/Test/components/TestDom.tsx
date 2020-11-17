
import React from 'react';

const TestDom : React.FC<> =(props)=>{

    return (<div>TestDom
        <div>{props.children}</div>
    </div>);
}

export default TestDom;