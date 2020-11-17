import { IconFontNew } from "@/components/MyCom/KIcon";
import { Card, Col, message, Row } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import GSearch from "./GSearch";
import TweenOne from 'rc-tween-one';
import { ditem } from "./NList";
import { UrlContext } from "@/pages/KgQuery/KgSearch";
import { TableListItem as Entity } from '@/pages/EntityList/data';


export interface AttrComCop {

  entity: Entity;
  attr: any;
}


const AttrCom: React.FC<AttrComCop> = (props) => {


  const [dlist, setDlist] = useState<ditem[]>([]);

  const [url, toKeyword] = useContext(UrlContext);

  const { entity, attr } = props;

  const refattr = useRef();
  const refdetail = useRef();

  useEffect(() => {



  }, []);



  const getattrDetail = (entity: Entity, attr: any) => {

    return <>
      <div className="detail">
        <Row>
          <Col span={10}>
            <div className="dname">{entity.name}</div>
          </Col>
          <Col span={12}>
            <div className="dname">{attr.name}</div>
          </Col>
          <Col span={2}>
            <div className="close">
              <IconFontNew type="icon-btn-close" onClick={() => {

                refattr.current.className = "attr ";
                refdetail.current.className = "attrdetail hide";

              }} />

            </div>
          </Col>
        </Row>
        <Row>

          <Col span={24}>
            <div className="ddesc">
              {
                getAttrVal(attr, true)
              }
            </div>
          </Col>

        </Row>

        <Row>
          <Col span={24} >
            <div className="next">
              <span className="tt">进一步搜索:</span> <div className="val" onClick={() => { toKeyword(props, `${entity.name} ${attr.label}`) }}>{`${entity.name} ${attr.label}`}</div>
              <div className="val" onClick={() => { toKeyword(props, `${attr.label}`) }}>{`${attr.label}`}</div>
            </div>
          </Col>
        </Row>
      </div>
    </>

  }

  //entity 存储的属性值，普通为文本，可能为json，
  const getAttrVal = (attr, showmore) => {
    const val = attr.value;

    try {


     

      if ((typeof (attr.rule) != "object"))
        attr.rule = JSON.parse(attr.rule);

      if (attr.rule.id === '4' || attr.rule.id === '5') //附件类型
      {
        if (!showmore)
          return `文件[${attr.rule.id === '4' ? "文档" : '图片'}]...`;


        //显示图片
        let detaildom = <></>;

        if (attr.rule.id === '5') {
          detaildom = attr.value.map(f => {
            return <>
              <a className="detailimg" href={f.FileUrl} target="_blank"><img alt={f.oldname} src={f.FileUrl}></img></a>
            </>
          });
        }

        else{
        detaildom = attr.value.map(f => {
          return <>
            <a className="detailfile" href={f.FileUrl} target="_blank"><IconFontNew type="icon-detail" />{f.oldname}</a>
          </>
        });
       }

        return <>{detaildom}</>


      }

      if (val.label)
        return val.label

      if (attr.rule.id === '1')//cls
      {
        if (!showmore)
        return attr.value[0].label;

        let detaildom = <></>;

     
          detaildom = attr.value.map(f => {
            return <>
             {f.label}&nbsp;
            </>
          });
     

        return <>{detaildom}</>;

      }
       // return '概念...';
       

      if (attr.rule.id === '2') //entity
        //return '实体...';
        return attr.value.name;

      return val;
    } catch (error) {
      // debugger;
      return val;
    }

  }

  const getdom = () => {
    if (entity && attr) {
      // debugger;
      // console.log(attr);
      return <>

        <Col span={11}  >
          <div ref={refattr} className="attr">
            <div ><span className='aname' >{attr.name ? attr.name : attr.label}</span> <span className='val' onClick={() => {
              // debugger;
              refattr.current.className = "attr  hide";
              refdetail.current.className = "attrdetail";

            }} >{getAttrVal(attr)}</span></div>
          </div>
        </Col>

        <div className="attrdetail hide" ref={refdetail}>
          <Col span={24} >

            {getattrDetail(entity, attr)}

          </Col>
        </div>
      </>
    }

    return <></>
  }


  return <>
    {getdom()}
  </>

}

export default AttrCom;