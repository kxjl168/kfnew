import { IconFontNew } from "@/components/MyCom/KIcon";
import { Card } from "antd";
import React, { useEffect, useState } from "react";
import GSearch from "./GSearch";
import TweenOne from 'rc-tween-one';
import { ditem } from "./NList";
import { NQueryProps } from "..";

export interface RListCop {

  onChange?: (v: any) => void;
  queryHandler?: (qobj: any) => any;
}


const RList: React.FC<NQueryProps> = (props) => {


  const [dlist, setDlist] = useState<ditem[]>([]);
  const { qdata } = props;


  const loadDetail = (qdata1) => {


    const data = [
      {
        imgurl: '',
        title: '广告位-虚位以待',
        desc: '[--------------]',
        linkiconurl: '',
        linkurl: 'https://www.baidu.com/link?url=_6nf0zfInZ-1Zb3H2tM91vAhG-7HfmoBZvmNtltAa6VkLmkz2ITIPoSkQs09AixJ&wd=&eqid=e2cc7889000b3b89000000055f7fbf61',
        linkname: '[-_-]',
      },
      {
        imgurl: '',
        title: '广告位-虚位以待',
        desc: '[--------------]',
        linkiconurl: '',
        linkurl: 'https://www.baidu.com/link?url=_6nf0zfInZ-1Zb3H2tM91vAhG-7HfmoBZvmNtltAa6VkLmkz2ITIPoSkQs09AixJ&wd=&eqid=e2cc7889000b3b89000000055f7fbf61',
        linkname: '联系邮件:kxjl168#foxmail.com',
      }
    ];


    if (qdata1.keyword)
      //列表 todo
      setDlist(data);
    else
      setDlist([]);

  }

  useEffect(() => {
    setTimeout(() => {
      loadDetail(qdata);
    }, 30);

  }, [qdata])


  return <>

    {dlist &&dlist.length>0&& (
      <div className="type">热门数据</div>
    )}
    {dlist && dlist.map((item) => {

      return <>
        <div className="sdiv">

          <div className="title">{item.title}</div>
          <div className="desc">{item.desc}</div>
          <div className="source">
            {item.linkiconurl !== "" && (<img className="icon" alt="" src={item.linkiconurl} />)}
            <a target="_blank" href={item.linkurl}>{item.linkname}</a>
          </div>

        </div>
      </>

    })
    }




  </>

}

export default RList;