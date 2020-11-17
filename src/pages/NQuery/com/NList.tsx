import { IconFontNew } from "@/components/MyCom/KIcon";
import { Card, Col, message, Row } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import GSearch from "./GSearch";
import TweenOne from 'rc-tween-one';
import { NQueryProps } from "..";
import { isnull } from "@/utils/utils";

import { search,searchtxt } from '@/services/searchService';
import { query } from '@/services/grapicService';

import {TableListItem as Entity} from '@/pages/EntityList/data';

import {TableListItem as KgClass} from '@/pages/KgClassList/data';
import { withRouter } from "umi";
import { ThemeContext, toKeyword, UrlContext } from "@/pages/KgQuery/KgSearch";
import AttrCom from "./attrCom";

export interface ditem {
  imgurl?: string;
  title: string;
  desc: string;
  linkiconurl: string;
  linkurl: string;
  linkname: string;
}

const NList: React.FC<NQueryProps> = (props) => {


  const [dlist, setDlist] = useState<ditem[]>([]);
  const { qdata } = props;

  const [entity,setentity]=useState<Entity>();

  const [entitylst,setentitylst]=useState<Entity[]>();
  const [cls,setcls]=useState<KgClass>();

  const [desc,setdesc]=useState<string>("");


  const[url,toKeyword]=useContext(UrlContext);


  const[baidulst,setbaidulst]=useState<string>("");

  const[gdata,setgdata]=useState<{}>();

  const spdrefs=useRef();

  const pageref=useRef();

  const[searchrst,setsearchrst]=useState<any>("");
  const[page,setpage]=useState<any>("");


  useEffect(() => {
    

  }, []);

  useEffect(()=>{
    setTimeout(() => {
      loadDetail(qdata);  
    }, 30);
    
  },[qdata])

  const loaditemData=async (qdata1)=>{
    const data = [
      {
        imgurl: 'https://p3.img.cctvpic.com/photoAlbum/page/performance/img/2020/10/8/1602128389131_967.jpg',
        title: '2(自然数之一) - 百度百科',
        desc: '2是一个自然数，同时也是1和3之间的正整数，也是偶数。如果一个整数能被2整除，就是偶数，反之则是奇数。2是最小的质数（也叫素数），也是唯一的偶质数，只有1、2两个因数，是一个有理数。2也是Heegner数',
        linkiconurl: '',
        linkurl: 'https://www.baidu.com/link?url=_6nf0zfInZ-1Zb3H2tM91vAhG-7HfmoBZvmNtltAa6VkLmkz2ITIPoSkQs09AixJ&wd=&eqid=e2cc7889000b3b89000000055f7fbf61',
        linkname: 'baike.baidu.com/',
      },
      {
        imgurl: '',
        title: '[好的配资app]交易盘主动降杠杆 市场情绪整体谨慎-2月...',
        desc: '2019年12月21日 分机构看托管情况,2 月商业银行债券托管量明显增加,其中全国性银行债券托管量增加3294 亿,城市商业银行和农商行债券托管量分别增加394 亿和1291 亿,保...',
        linkiconurl: '',
        linkurl: 'https://www.baidu.com/link?url=_6nf0zfInZ-1Zb3H2tM91vAhG-7HfmoBZvmNtltAa6VkLmkz2ITIPoSkQs09AixJ&wd=&eqid=e2cc7889000b3b89000000055f7fbf61',
        linkname: '开心网',
      },
      {
        imgurl: '',
        title: '[好的配资app]交易盘主动降杠杆 市场情绪整体谨慎-2月...',
        desc: '2019年12月21日 分机构看托管情况,2 月商业银行债券托管量明显增加,其中全国性银行债券托管量增加3294 亿,城市商业银行和农商行债券托管量分别增加394 亿和1291 亿,保...',
        linkiconurl: '',
        linkurl: 'https://www.baidu.com/link?url=_6nf0zfInZ-1Zb3H2tM91vAhG-7HfmoBZvmNtltAa6VkLmkz2ITIPoSkQs09AixJ&wd=&eqid=e2cc7889000b3b89000000055f7fbf61',
        linkname: '开心网',
      }
      ,
      {
        imgurl: 'https://pic4.zhimg.com/80/v2-912e334fb3c8b8f8ff920eebe6599cdf_720w.jpg',
        title: '黑鲨游戏手机 2 - 小米商城',
        desc: '2018年10月1日 传承黑鲨“X”型设计语言,金属机身搭配异形折面玻璃,带来舒适的握持体验和惊艳的折面光影美学。全新打造的冰封银色,如同水银凝聚,浑然天成。',
        linkiconurl: '',
        linkurl: 'https://www.baidu.com/link?url=_6nf0zfInZ-1Zb3H2tM91vAhG-7HfmoBZvmNtltAa6VkLmkz2ITIPoSkQs09AixJ&wd=&eqid=e2cc7889000b3b89000000055f7fbf61',
        linkname: '小米商城',
      },
      {
        imgurl: '',
        title: '[好的配资app]交易盘主动降杠杆 市场情绪整体谨慎-2月...',
        desc: '2019年12月21日 分机构看托管情况,2 月商业银行债券托管量明显增加,其中全国性银行债券托管量增加3294 亿,城市商业银行和农商行债券托管量分别增加394 亿和1291 亿,保...',
        linkiconurl: '',
        linkurl: 'https://www.baidu.com/link?url=_6nf0zfInZ-1Zb3H2tM91vAhG-7HfmoBZvmNtltAa6VkLmkz2ITIPoSkQs09AixJ&wd=&eqid=e2cc7889000b3b89000000055f7fbf61',
        linkname: '开心网',
      } ,
      {
        imgurl: 'https://img-blog.csdnimg.cn/20200414224359980.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzI4ODkzOTQ5,size_16,color_FFFFFF,t_70',
        title: '黑鲨游戏手机 2 - 小米商城',
        desc: '2018年10月1日 传承黑鲨“X”型设计语言,金属机身搭配异形折面玻璃,带来舒适的握持体验和惊艳的折面光影美学。全新打造的冰封银色,如同水银凝聚,浑然天成。',
        linkiconurl: '',
        linkurl: 'https://www.baidu.com/link?url=_6nf0zfInZ-1Zb3H2tM91vAhG-7HfmoBZvmNtltAa6VkLmkz2ITIPoSkQs09AixJ&wd=&eqid=e2cc7889000b3b89000000055f7fbf61',
        linkname: '小米商城',
      },
      {
        imgurl: '',
        title: '[好的配资app]交易盘主动降杠杆 市场情绪整体谨慎-2月...',
        desc: '2019年12月21日 分机构看托管情况,2 月商业银行债券托管量明显增加,其中全国性银行债券托管量增加3294 亿,城市商业银行和农商行债券托管量分别增加394 亿和1291 亿,保...',
        linkiconurl: '',
        linkurl: 'https://www.baidu.com/link?url=_6nf0zfInZ-1Zb3H2tM91vAhG-7HfmoBZvmNtltAa6VkLmkz2ITIPoSkQs09AixJ&wd=&eqid=e2cc7889000b3b89000000055f7fbf61',
        linkname: '开心网',
      } ,
      {
        imgurl: '',
        title: '黑鲨游戏手机 2 - 小米商城',
        desc: '2018年10月1日 传承黑鲨“X”型设计语言,金属机身搭配异形折面玻璃,带来舒适的握持体验和惊艳的折面光影美学。全新打造的冰封银色,如同水银凝聚,浑然天成。',
        linkiconurl: '',
        linkurl: 'https://www.baidu.com/link?url=_6nf0zfInZ-1Zb3H2tM91vAhG-7HfmoBZvmNtltAa6VkLmkz2ITIPoSkQs09AixJ&wd=&eqid=e2cc7889000b3b89000000055f7fbf61',
        linkname: '小米商城',
      },
      {
        imgurl: 'http://pic.rmb.bdstatic.com/a9b0198cb0eed3be5405ff1fc13f50d0.jpeg',
        title: '[好的配资app]交易盘主动降杠杆 市场情绪整体谨慎-2月...',
        desc: '2019年12月21日 分机构看托管情况,2 月商业银行债券托管量明显增加,其中全国性银行债券托管量增加3294 亿,城市商业银行和农商行债券托管量分别增加394 亿和1291 亿,保...',
        linkiconurl: '',
        linkurl: 'https://www.baidu.com/link?url=_6nf0zfInZ-1Zb3H2tM91vAhG-7HfmoBZvmNtltAa6VkLmkz2ITIPoSkQs09AixJ&wd=&eqid=e2cc7889000b3b89000000055f7fbf61',
        linkname: '开心网',
      }
    ];

    const {level,keyword,url,key} = qdata1;


    if(keyword||url)
    {

      
    let  erst = await searchtxt({ url:url,keyword:keyword});

      

    if (erst && erst.data) {
      try {
        
    
      const spdata=JSON.parse(erst.data);
      setbaidulst(spdata.html.replace("style","style1"));
      setTimeout(() => {

        if(!dealhtml())
        {
          setTimeout(() => {
              dealhtml();
          }, 200);
        }
      },250);
    } catch (error) {
      setbaidulst("查询出了一丢丢的问题啊 >_<!")   
    }
    }


     // setDlist(data);

    }
    //列表 todo
    
    else{
      setbaidulst("")
      setDlist([]);
    }
    
  }



  const loaddone=()=>{
    dealhtml();
  }


  const dealhtml=()=>{
    //console.log(spdrefs.current);
    //debugger;

    if(!spdrefs.current)
    return;

    const leftcontent= spdrefs.current.querySelectorAll('#content_left')[0];
    if(!leftcontent)
    return ;

    const stylelst=leftcontent.querySelectorAll("style")


    stylelst.forEach(node => {
      node.parentNode.removeChild(node); 
    }); 
      
    //去广告
    const adlst=leftcontent.querySelectorAll("[cmatchid]")
    adlst.forEach(node => {
      node.parentNode.removeChild(node); 
    }); 
      
 //去广告
 const tplst=leftcontent.querySelectorAll("[tpl=recommend_list]")
 tplst.forEach(node => {
   node.parentNode.removeChild(node); 
 }); 

  //去百度文档
  const wdlst=leftcontent.querySelectorAll("[tpl=wenda_abstract_pc]")
  wdlst.forEach(node => {
    node.parentNode.removeChild(node); 
  }); 
 

 
     //去招聘
 const zplst=leftcontent.querySelectorAll("[tpl=zp_exact_new]")
 zplst.forEach(node => {
   node.parentNode.removeChild(node); 
 }); 


 //翻页
 const page= spdrefs.current.querySelectorAll('#page')[0];
 const stylelst2=page.querySelectorAll("style")


 stylelst2.forEach(node => {
   node.parentNode.removeChild(node); 
 }); 
  

    setsearchrst(leftcontent.outerHTML)
    setpage(page.outerHTML);

    setTimeout(() => {
      
      const alst=pageref.current.querySelectorAll('a');

      for (let i = 0; i < alst.length; i++) {
        alst[i].addEventListener('click', function(e) {
         // message.info(e.currentTarget.href);
         
         
          loadDetail({
            url:e.currentTarget.href
          })

          e.preventDefault();


         // e.nativeEvent.stopImmediatePropagation();
         return false;
        });
      }


    }, 50);


    return true;
    
  }


  const loadDetail=async(qdata1)=>{
 
     loaditemData(qdata1);


      if (!qdata) {
          return;
      }
     
      const {level,keyword,url,key} = qdata1;


      if (isnull(keyword))
          return;

      let data = "";
      let gdata = {};

      //debugger;
      const hide = message.loading('数据加载中...', 600);



      //查询概念

      //概念下的实体集合


      //查询同名实体
      

    let  erst = await search({ keyword:keyword});

      

      if (erst && erst.data) {

        
        if(erst.data.cls)
        setcls(erst.data.cls)

        if(erst.data.entitylst)
        setentitylst(erst.data.entitylst)
        

        let e=erst.data.entity;
        if(e)
        {


          try {

            data = await query({ id: e.id, level: level, showEdit: false });
   
             let gradata = JSON.parse(JSON.stringify(data));
             gdata = JSON.parse(gradata.data);
             setgdata(gdata);
           
         } catch (error) {
             message.error("数据加载失败!");
         }



        if(e.tags)
        e.tags=JSON.parse(e.tags);

        if(e.properties)
        e.attrs=JSON.parse(e.properties);


         e.attrs.forEach(attr => {
            if(attr.name&&attr.name.indexOf('定义')>-1&& !isnull(attr.value))
            setdesc(attr.value.split("\\n").join("\n"))

               if(attr.name&&attr.name.indexOf('说明')>-1 && !isnull(attr.value))
               setdesc(attr.value.split("\\n").join("\n"))
               if(attr.name&&attr.name.indexOf('描述')>-1 && !isnull(attr.value))
               setdesc(attr.value.split("\\n").join("\n"))

               if(attr.name&&attr.name.indexOf('内容')>-1 && !isnull(attr.value))
               setdesc(attr.value.split("\\n").join("\n"))
               
         });


        setentity(e);
      }
       // console.log(e);
        
      }

     

      hide();




     // console.log(gdata);



  }



  const getClsDv=()=>{
    
    if(!cls)
    return <></>;
  
    
    return <>
      <div className="cls">
        <div className="name">{cls.clsName}</div>
        <div className="type">集合</div>
        <div className="nodes">
        
        <div className="centity">
      
        {entitylst&&(
          <>
            <div className="tip">仅显示部分结果</div>
            <Row>{
             entitylst.map((tag)=>{
               return <>
               <div className="entitydv" onClick={()=>{toKeyword(props,tag.name)}}>{tag.name}</div>
               </>
             })
            }
            </Row>
            </>
           )}
        </div>
        </div>

      </div>
    </>
  }


  const getEntityDv=()=>{
    
    if(!entity)
    return <></>;
  
    
    return <>
      <div className="entity">
        <div className="name">{entity.name}</div>
        <div className="type">实体</div>
        <div className="nodes">
     
           {desc&&(
             <>
                <div className="title">描述</div>
             <Row className='ndesc'>{
               `${desc}`
             }
             </Row>
             </>
            )}


     
           {gdata&&gdata.nodes&&gdata.nodes.length>1&&(
             <>
                <div className="title">关联</div>
             <Row>{
             gdata.nodes.map((node)=>{

              if(node.id===entity.id)
              return <></>


               return <>
             
               <span className="node" onClick={()=>{toKeyword(props,node.label)}}>{node.label}</span>
            
               </>
             })
            }
            </Row>
            </>
           )}
        </div>
        <div className="attrs">
            <div className="title">属性</div>
           {entity&&entity.attrs&&(
             <Row>{
            entity.attrs.map((attr)=>{

              if(isnull(attr.value))
              return <></>

              if(attr.name&&attr.name.indexOf('定义')>-1&& !isnull(attr.value))
              return <></>

               if(attr.name&&attr.name.indexOf('说明')>-1 && !isnull(attr.value))
               return <></>
               if(attr.name&&attr.name.indexOf('描述')>-1 && !isnull(attr.value))
               return <></>

               if(attr.name&&attr.name.indexOf('内容')>-1 && !isnull(attr.value))
               return <></>

              //  if(attr.name.indexOf('名称')>-1&& !isnull(attr.value))
              //  return <></>

               if(attr.name&&attr.name.indexOf('编码')>-1&& !isnull(attr.value))
              return <></>
           
               return <AttrCom entity={entity} attr={attr} />
             })
            }
             </Row>
           )}
        </div>

        <div className="tags">
      
        {entity&&entity.tags&&(
          <>
            <div className="title">标签</div>
            <Row>{
             entity.tags.map((tag)=>{
               return <>
               <div className="tag" onClick={()=>{toKeyword(props,tag.label)}}>{tag.label}</div>
               </>
             })
            }
            </Row>
            </>
           )}
        </div>

      </div>
    </>
  }


  return <>
    
  
    {getEntityDv()}

    {getClsDv()}

    {dlist && dlist.map((item) => {

      return <>
        <div className="sdiv">

          <div className="title">{item.title}</div>
          <div className="desc">

            {item.imgurl !== "" && (<img className="descimg" alt="" src={item.imgurl} />)}
            <div className="descblock">
              {item.desc}
              <div className="source">
                {item.linkiconurl !== "" && (<img className="icon" alt="" src={item.linkiconurl} />)}
                <a href={item.linkurl}>{item.linkname}</a>
              </div>
            </div>
          </div>


        </div>
      </>

    })
    }


<iframe className='spd'>

    {baidulst&&(<div ref={spdrefs} dangerouslySetInnerHTML={{__html:`${baidulst}`}}></div> )}
    </iframe>

  
    <div
    className="realspd"   dangerouslySetInnerHTML={{__html:`${searchrst}`}} >
    </div>
    <div
    className="realpage" ref={pageref} dangerouslySetInnerHTML={{__html:`${page}`}} >
    </div>
  



  </>

}

export default  withRouter(NList);