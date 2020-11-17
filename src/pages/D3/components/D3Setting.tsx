import { IconFontNew } from "@/components/MyCom/KIcon";
import { Card, Checkbox } from "antd";
import React, { useRef, useState } from "react";
import GSearch from "./GSearch";
import TweenOne from 'rc-tween-one';

export interface D3Props {


  //点击自动展开关联
  clickAutoExpand: boolean;
  setclickAutoExpand:(e:any)=>void;
 

  //点击或者拖动自动锁定
  clickAutoLock: boolean;
  setclickAutoLock:(e:any)=>void;

  //点击节点自动打开属性面板
  clickAutoAttrPanel: boolean;
  setclickAutoAttrPanel:(e:any)=>void;


}

//设置面板
const D3Setting: React.FC<D3Props> = (props) => {

  const { clickAutoExpand, setclickAutoLock,clickAutoLock, clickAutoAttrPanel,setclickAutoExpand,setclickAutoAttrPanel } = props;


  const rtoolbar=useRef();

  return <></>

  return <>
    {/* <TweenOne
      //   animation={animation}
      //   paused={paused}
      // // demo 演示需要，时间轴循环
      //   style={{position:"fixed",bottom:'-38px',width:'100%'}}

      className="code-box-shape"
    > */}
      <div className="dtoolbar">

        <div className="items toggle"  ref={rtoolbar}>
        <div className="item"><Checkbox checked={clickAutoLock} onChange={(e)=>{
        //  console.log("change to:"+e.target.checked)
          setclickAutoLock(e.target.checked)
          }} />拖动固定</div>
        <div className="item"><Checkbox checked={clickAutoExpand}  onChange={(e)=>{
         // console.log("change to:"+e.target.checked)
          setclickAutoExpand(e.target.checked)
          }}/>自动加载周边节点</div>
        <div className="item"><Checkbox checked={clickAutoAttrPanel}   onChange={(e)=>{
         // console.log("change to:"+e.target.checked)
          setclickAutoAttrPanel(e.target.checked)
          }}/>自动打开节点属性</div>
      
      </div>
      <span>
          <IconFontNew type="icon-setting" title="打开/关闭设置" onClick={()=>{
            //debugger;
            if(rtoolbar.current.className.indexOf('toggle')>-1)
            rtoolbar.current.className="  items ";
            else
            rtoolbar.current.className="  items toggle";
          }} />
        </span>

      </div>
      
    {/* </TweenOne> */}

  </>

}

export default D3Setting;