import React, { useEffect, useState } from 'react';

import { Item, ItemPanelProps } from "gg-editor";
import './item.less';
import { omit, merge } from 'lodash';
import uuid from '@/utils/uuid';
import { Tooltip } from 'antd';


export interface GraphicItemProps extends Partial<ItemPanelProps> {
  kclass?: string;
  label?: string;
  id?: string;
  model?: any;
  nodetype?: string | '2' | '1'; //1:entity,2:cls
  item?: any;//data
  keyv?:any;
  uid?:string;
}


const GraphicItem: React.FC<GraphicItemProps> = (props) => {




  const { label: outlabel, shape: outshape, kclass, model, nodetype, keyv } = props;

  const [Inmodel,setInnnerModel]=useState<any>({});

  useEffect(() => {
    let innermodel = {
      type: "node",
      size: "55*55",
      shape: outshape,
      stroke: '#F0CFA4',
      color: "#F0CFA4",
      stroke_left: '#F0CFA4',
      nodeid: '',
      nodetype: '',
      label: outlabel,
      labelOffsetY: 20,
      icon: "//img.alicdn.com/tfs/TB1gXH2ywHqK1RjSZFPXXcwapXa-200-200.svg",
      x: 100,
      y: 100,
      index: 0,
      nodetype: nodetype,
      //id:uuid()
    };

    //    debugger;
    if (nodetype === '2') //cls
      innermodel.attrOk = true;//概念不检查属性




    if (nodetype === '1') //entity
    {
      try {


        if (model.attrs) {
          model.attrs = JSON.parse(model.attrs);
          model.attrs.map(attr => {

            // rule: item.dataTypeRule? JSON.parse(item.dataTypeRule):{},
          })
        }
      } catch (error) {

      }
      try {
        if (model.tags) {
          model.tags = JSON.parse(model.tags);
          model.tags.map(attr => {

            // rule: item.dataTypeRule? JSON.parse(item.dataTypeRule):{},
          })
        }
      } catch (error) {

      }

    }


    innermodel = merge(innermodel, omit(model, ["id"]));
    if (model && model.id) {
      innermodel.nodeid = model.id;
      //innermodel.id=model.id;
    }

    setInnnerModel(innermodel);

  },[])



  //console.log("item:"+JSON.stringify(innermodel));
  return (<Item
    type="node"
    size="50"
    key={Inmodel.id}
    shape={outshape === undefined ? 'circle' : outshape}
    model={Inmodel}
  >
    <Tooltip placement="right" title={(Inmodel.dirName?Inmodel.dirName+":":"")+outlabel}>
    <div  className={`kflow-item ${kclass}`} >{outlabel}</div>
    </Tooltip>
  </Item >)


}

export default GraphicItem;