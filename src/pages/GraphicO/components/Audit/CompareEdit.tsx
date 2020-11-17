import React, { useRef, useState, useEffect } from "react";
import { Button, message, Row, Col, Spin, Alert } from "antd";
import { IconFontNew } from "@/components/MyCom/KIcon";
import { withPropsAPI } from "gg-editor";
import TextArea from "antd/lib/input/TextArea";

import EditMainPanel from '../../index';
import { AuditAction } from "../../cmd/SaveCmd";
import { QDATA } from "../KoniMain/KoniPanel";
import { TableListItem as EditData } from '@/pages/ModifyList/data';
import AuditDv from "./AuditDv";
import { query, saveOrUpdate } from '@/services/grapicService';

import { query as querySub } from '@/services/grapicEditService';



export interface AuditDvProps {
  propsAPI?: any;
}

export interface CompareEditProp {


  onSubmit: (data: boolean) => void;


  value: EditData;


  /**
   * 对应四种状态
   */
  showState: 'modify' | 'toaudit' | 'audit' | 'auditDone';
}


const CompareEdit: React.FC<CompareEditProp> = (props) => {

  const { value, onSubmit, showState } = props;

  const [qdataOld, setqdataOld] = useState<QDATA>();
  const [qdata, setqdata] = useState<QDATA>();

  const [titleOld, SettitleOld] = useState<string>('原有关系');
  const [titleNew, SettitleNew] = useState<string>('修改后的关系');

  const curMainRef = useRef<AuditAction>();

  const [tags, settags] = useState<any[]>();


  const [changing, setChanging] = useState<boolean>(false);



  const submit = async (rst) => {

    onSubmit(rst);
  }

  //加载实际图谱数据
  const loadOneData=async(qd:QDATA)=>{
    let gdata=null;
    let data=null;
    if (qd.iseditData)
    data = await querySub({ id: qd.id, level: qd.level,showEdit:false });
    else
    data = await query({ id: qd.id, level: qd.level,showEdit: (qd.showEdit?true:false)  });
  


    if(data&&data.success&&data.data)
    {

      try {
        const gradata = JSON.parse(JSON.stringify(data));
        gdata = JSON.parse(gradata.data);
      } catch (error) {
        message.error("数据加载失败!");
      }

      return gdata
    }

    return null;

  }


  const loadData=async(vvalue:EditData)=>{


    setChanging(true);
    const hide = message.loading('数据加载中...', 6000);

    if (showState === "modify") {

      const tpqdata:QDATA={
        id: vvalue.id,
        level: 1,
        gtype: vvalue.editAction === "1" ? 'cls' : 'entity',
        iseditData: true,

      }
      const gdata=await loadOneData(tpqdata);
      tpqdata.graphicData=gdata;

      const tpqdataOld:QDATA={
        id: vvalue.editOriDataId,
        level: 1,
        gtype: vvalue.editAction === "1" ? 'cls' : 'entity',
        showEdit: false
      }
      const gdataOld=await loadOneData(tpqdataOld);
      tpqdataOld.graphicData=gdataOld;

      

      setqdata(tpqdata)

      setqdataOld(tpqdataOld)

      SettitleOld("原有关系")
      SettitleNew("修改后的关系")
    }

    if (showState === "toaudit") {

      const tpqdata:QDATA={
        id: vvalue.id,
        level: 1,
        gtype: vvalue.editAction === "1" ? 'cls' : 'entity',
        iseditData: true,
      }
      const gdata=await loadOneData(tpqdata);
      tpqdata.graphicData=gdata;

      const tpqdataOld:QDATA={
        id: vvalue.auditRstId ? vvalue.auditRstId : vvalue.editOriDataId,
        level: 1,
        gtype: vvalue.editAction === "1" ? 'cls' : 'entity',
        iseditData: vvalue.auditRstId ? true : false,
        showEdit: false
      }
      const gdataOld=await loadOneData(tpqdataOld);
      tpqdataOld.graphicData=gdataOld;

      

      setqdata(tpqdata)

      setqdataOld(tpqdataOld)


      if (vvalue.auditRstId)
        SettitleOld("审核快照")
      else
        SettitleOld("原有关系")

      SettitleNew("我的改动")
    }


    if (showState === "audit") {

      const tpqdata:QDATA={
        id: vvalue.id,
        level: 1,
        gtype: vvalue.editAction === "1" ? 'cls' : 'entity',
        iseditData: true,
      }
      const gdata=await loadOneData(tpqdata);
      tpqdata.graphicData=gdata;

      const tpqdataOld:QDATA={
        id: vvalue.editOriDataId,
        level: 1,
        gtype: vvalue.editAction === "1" ? 'cls' : 'entity',
        showEdit: false
      }
      const gdataOld=await loadOneData(tpqdataOld);
      tpqdataOld.graphicData=gdataOld;

      

      setqdata(tpqdata)

      setqdataOld(tpqdataOld)



      SettitleOld("原有关系")

      SettitleNew("改动关系")
    }


    if (showState === "auditDone") {


      const tpqdata:QDATA={
        id: vvalue.editOriDataId,
        level: 1,
        gtype: vvalue.editAction === "1" ? 'cls' : 'entity',
        iseditData: true,
      }
      const gdata=await loadOneData(tpqdata);
      tpqdata.graphicData=gdata;

      const tpqdataOld:QDATA={
        id: vvalue.auditRstId,
        level: 1,
        gtype: vvalue.editAction === "1" ? 'cls' : 'entity',
        iseditData: true,

      }
      const gdataOld=await loadOneData(tpqdataOld);
      tpqdataOld.graphicData=gdataOld;

      

      setqdata(tpqdata)

      setqdataOld(tpqdataOld)



      SettitleOld("审核数据快照")

      SettitleNew("用户修改的关系")


    }




    setTimeout(() => {
      setChanging(false)
      hide();
    }, 50);


  }

  useEffect(() => {

    if (!value)
      return;

      loadData(value);
   

  }, [value]);



  const getDvOld = () => {
    return <>
      <EditMainPanel reloadColorTime={4000} outtags={tags} qdata={qdataOld} hidemini autofit readonly showLeftDiv={false} showRightDiv showBar={false} ggstyle={{ width: '100%', height: '400px' }} />
    </>;
  }



  const getDvMy = () => {
    if (showState === "modify")
      return <>
        <EditMainPanel ontagInited={(tg) => {
          settags(tg);
        }} onSaveOrAudit={submit} ref={curMainRef} qdata={qdata} hidemini showLeftDiv showRightDiv showBar autofit ggstyle={{ width: '100%', height: 'calc(100vh - 25px)' }} >
          <>

          </>
        </EditMainPanel>
      </>;
    if (showState === "audit")
      return <>
        <EditMainPanel ontagInited={(tg) => {
          settags(tg);
        }} onSaveOrAudit={submit} hidesave ref={curMainRef} qdata={qdata} hidemini showLeftDiv showRightDiv showBar autofit ggstyle={{ width: '100%', height: 'calc(100vh - 25px)' }} >
          <>
            <AuditDv />
          </>
        </EditMainPanel>
      </>;



    if (showState === "toaudit")
      return <>
        <EditMainPanel ontagInited={(tg) => {
          settags(tg);
        }} ref={curMainRef} qdata={qdata} hidemini readonly showLeftDiv={false} showRightDiv showBar={false} autofit ggstyle={{ width: '100%', height: 'calc(100vh - 25px)' }} >
          <>

          </>
        </EditMainPanel>
      </>;

    if (showState === "auditDone") {
      const msg = value.auditState === "5" ? `审核未通过:${value.auditInfo||''}` : (`审核通过:${value.auditInfo||''}`);

      return <>
        <EditMainPanel ontagInited={(tg) => {
          settags(tg);
        }} ref={curMainRef} qdata={qdata} hidemini showLeftDiv={false} showRightDiv showBar={false} autofit ggstyle={{ width: '100%', height: 'calc(100vh - 25px)' }} >
          <>
            <Alert style={{margin:'0 auto',marginBottom:'5px'}} message={`${msg}`} />

          </>
        </EditMainPanel>
      </>;

    }
  }


  return <>
    <Row className="oriPanel">
      <Col span="24">
        <span className="compTitle">{titleOld}</span>
        <div >

          {changing && <Spin />}
          {!changing && getDvOld()}


        </div>
      </Col>
    </Row>

    <Row className="curPanel">
      <Col span="24">
        <Row style={{ margin: '5px;' }} > <span className="compTitle">{titleNew}   </span>

        </Row>

        {changing && <Spin />}
        {!changing && getDvMy()}

      </Col>
    </Row>
  </>;


}

export default withPropsAPI(CompareEdit);