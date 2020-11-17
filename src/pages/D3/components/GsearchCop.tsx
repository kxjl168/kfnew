import { IconFontNew } from "@/components/MyCom/KIcon";
import { Card } from "antd";
import React, { useState } from "react";
import GSearch from "./GSearch";
import TweenOne from 'rc-tween-one';

export interface GSearchCop{

    onChange:(v:any)=>void;
    queryHandler:(qobj:any)=>any;
}

const GSearchCop: React.FC<GSearchCop> = (props) => {

    const {onChange,queryHandler}=props;

    const [animation,setanimation]=useState<any>({
        bottom:"-15px",
            //bottom: getbottom(), 
            position: "fixed",
             //bottom: 5px;
              width: '100%',
           // scale: 0.5, 
           // rotate: 120, 
           // yoyo: true, // demo 演示需要
           repeat: 0, // demo 演示需要
            duration: 500,
            onComplete:()=>{
                if((state==='hide'))
                setstate('show');

                if((state==='show'))
                setstate('hide');
            }
         
    });

    const getanimate=()=>{
      return  {
        
            bottom: getbottom(), 
            position: "fixed",
             //bottom: 5px;
              width: '100%',
              
           // scale: 0.5, 
           // rotate: 120, 
           // yoyo: true, // demo 演示需要
           repeat: 0, // demo 演示需要
            duration: 300,
            onComplete:()=>{
                if((state==='hide'))
                setstate('show');

                if((state==='show'))
                setstate('hide');
            }
         
    }
    }

    const getbottom=()=>{
      return  state==="hide"?'10px':'-25px'
    }

    const[state,setstate]=useState<'hide'|'show'>('hide');

    const [paused,setpaused]=useState<boolean>(true);
    const [repeat,setrepeat]=useState<number>(-1);
    const [yoyo,setyoyo]=useState<boolean>(false);
    const [showicon,setshowicon]=useState<boolean>(true);

    return <></>

return <>
 <TweenOne
        animation={animation}
        paused={paused}
      // demo 演示需要，时间轴循环
        style={{position:"fixed",bottom:'-38px',width:'100%'}}
     
        className="code-box-shape"
      >
    <div onMouseEnter={()=>{
      //  console.log(getanimate())
        setanimation({...getanimate(),bottom:'5px' })
      setpaused(false);
      setshowicon(false);
    }} 
    onMouseLeave={()=>{
        setshowicon(true);
        setanimation({...getanimate(),bottom:'-38px' })
        setpaused(false);
       
    }}
  
  >
    <div style={{position:'relative',width:'300px',margin:'0 auto'}}>
    {showicon&&( 
    <TweenOne
        animation={{
           y:6,
            repeat:-1,
            duration:650,
        }}
        
        paused={false}
        >
            
           
        <IconFontNew  type="icon-showup" style={{position:'relative',width:'300px',margin:'0 auto'}} / >
          
        </TweenOne>
        )}
    <Card className="searchCard"
                >
                    <span className="searchIcon" title="数据查询" onClick={() => {
                       // props.history.push("/");
                    }}>
                        {/* <Avatar size="small"
                            alt="数据查询" src={logo}
                        /> */}
                        <IconFontNew type="icon-search" style={{marginTop:'5px'}}/>
                    </span>
                    <GSearch query={queryHandler} className="width100" labelInValue  placeholder="搜索当前数据" onChange={onChange} />
                    <span className="searchIcon" title="隐藏" onClick={() => {
    setshowicon(true);
    setanimation({...getanimate(),bottom:'-38px' })
    setpaused(false);
                    }}> 
                    <IconFontNew type="icon-hide" style={{marginTop:'5px',marginLeft:'5px'}} />
                    
                    </span>
                </Card>
        </div>
        </div>
        </TweenOne>
        </>

}

export default GSearchCop;