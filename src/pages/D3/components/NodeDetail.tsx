


import { IconFontNew } from "@/components/MyCom/KIcon";
import { Card } from "antd";
import React, { useEffect, useState } from "react";
import GSearch from "./GSearch";
import TweenOne from 'rc-tween-one';
import { ditem } from "./NList";
import MoreAttr from "@/components/MyCom/MoreAttr";
import { isnull } from "@/utils/utils";
import KScrollBar from "@/components/MyCom/KScrollBar";

export interface NodeDetailProps {

    model: any;

}


const NodeDetail: React.FC<NodeDetailProps> = (props) => {

    const { model } = props;

    const [show, setshow] = useState<boolean>(false);




    useEffect(() => {


        if (isnull(model))
            setshow(false)
        else
        {
          //  debugger;
            setshow(true);
        }

    }, [model]);



    return <>
     
  
   
        <div className={`ndetail ${show?"block":'hided' }`}>
        <KScrollBar autohide className="scrollc">
            { model && (
                <MoreAttr showEmpty={false} onlyShow showAddDom={false} InitAttrs={model.attrs} />
            )}
      </KScrollBar>
        </div>
   
    </>

}

export default NodeDetail;

