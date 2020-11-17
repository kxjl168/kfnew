
import React, { useState, useRef, cloneElement, useEffect } from 'react';


import TextArea from "antd/lib/input/TextArea";
import { Divider, Button, message, Alert, Card, Col, Row } from "antd";
import QueueAnim from 'rc-queue-anim';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditGraphic from '../GraphicO/components/Edit';
import AuditGraphic from '../GraphicO/components/Audit';
import { MyEditObj } from '../ModifyList/data';
import { QDATA } from '../GraphicO/components/KoniMain/KoniPanel';
import _ from 'lodash';
import { isnull } from '@/utils/utils';
import ModelD3 from '../D3/ModelD3';
import './index.less';
import logo from '../../assets/favicon.png';

import showimg from '../../assets/show.png';
import editimg from '../../assets/edit.png';

import linkimg from '../../assets/up22.png';


const PackerIndex: React.FC<{}> = (props) => {


  const [val, setVal] = useState<any>();

  const [data, setdata] = useState<any>(false);

  const tinput = useRef();
  const toutput = useRef();

  const [show, setShow] = useState<boolean>(true);


  const [relationModalVisible, handlerelationModalVisible] = useState<boolean>(false);
  const [relationModalShowinfo, handlerelationModalShowinfo] = useState<boolean>(false);
  const [relationModalvalue, setrelationModalvalue] = useState<MyEditObj>();


  const [frelationModalVisible, handlefrelationModalVisible] = useState<boolean>(false);

  const [frelationModalvalue, setfrelationModalvalue] = useState<QDATA>();

  const [frelationModalVisible3, handlefrelationModalVisible3] = useState<boolean>(false);





  const btnys = () => {
    try {
      setShow(false);
      setTimeout(() => {

        setdata(!data);

        setShow(true);
      }, 310);
    } catch (error) {
      message.error("脚本错误", error);
    } finally {

    }

  }

  const getcontent = (v) => {
    if (v)
      return [

        <PageHeaderWrapper title={' '} key="1"
          content={' '}>
          <TextArea ref={toutput} value="11111111111111" />
        </PageHeaderWrapper>

      ]


    return [

      <PageHeaderWrapper title={' '} key="2"
        content={' '}>
        <TextArea ref={toutput} value="222222222222222" />
      </PageHeaderWrapper>

    ]
  }



  const test2 = () => {

    handlerelationModalShowinfo(false);

    // let edits = [{ "editDataId": "0bdd959dd37c4e6a93cf90cd923c74c6", "editAction": "2", "dataType": "7", "id": "bce40dd83d0445969cfeb659f1a880c1", "auditState": "1" }];
    //let oid = "528dc411fc1f4a1abc75824ea83639d6";

    let edits = "[]";
    let oid = "76f3584974fc4a91b6cc9aaa5b5e0db0";

    if (edits === '[]') {
      //return <>{getLevelOneRelation()}{getLevelTwoRelation()}</>;
      setfrelationModalvalue({ level: 2, id: oid, gtype: 'entity', showEdit: 'true' });

      handlefrelationModalVisible(true);

      return;
    }


    const editObjEntity = _.find(edits, item => {
      return item.dataType === '6'
    })
    const editObjRelation = _.find(edits, item => {
      return item.dataType === '7'
    })

    if (!isnull(editObjRelation) && editObjRelation.auditState === '1') {
      setrelationModalvalue({ id: editObjRelation.id, editDataId: editObjRelation.editDataId, editOriDataId: oid, editAction: editObjRelation.editAction });

      handlerelationModalVisible(true);
    }


  }

  const showkg = () => {

    props.history.push("/s/search");

    //handlefrelationModalVisible3(true);

  }
  const showurl = () => {

    props.history.push("/s/url");

    //handlefrelationModalVisible3(true);

  }
  


  return (<>


    <Alert
      message="你好!这里是喵的测试实验室 -__-"
      description="欢迎随便逛逛~."
      type="info"
      showIcon
    />

    <div style={{ marginBottom: '10px' }}></div>

    <div className="resource-cards" >

<Col span={5}>
      <a className=" resource-card" href="javascript:void(0)" onClick={test2} >

        <div >
          <img className="resource-card-image" src={editimg} alt="" />
        </div>
        <div className="resource-card-title">编辑测试</div>
        <div className="resource-card-description">

        知识图谱的编辑Demo

        </div>

      </a>
      </Col>

      <Col span={5}>
      <a className=" resource-card"  onClick={showkg}>

        <div >
          <img className="resource-card-image" src={showimg} alt="" />
        </div>
        <div className="resource-card-title">个站知识图谱</div>
        <div className="resource-card-description">

          
          基于爬虫获取的个站数据进行知识图谱展现
        </div>


      </a>
      </Col>


      <Col span={5}>
      <a className=" resource-card"  onClick={showurl}>

        <div >
          <img className="resource-card-image" src={linkimg} alt="" />
        </div>
        <div className="resource-card-title">链接检索</div>
        <div className="resource-card-description">

          
         基于爬取的BLOG用户链接及日常常用链接收藏
        </div>


      </a>
      </Col>

      

    </div>


    {/* 
    <TextArea ref={tinput} />
    <Button onClick={btnys}>测试</Button>

   
    <Divider type="horizontal" />
    <TextArea ref={toutput} />



    <QueueAnim className="demo-content" duration={300}>
      {show ? getcontent(data) : null}
    </QueueAnim> */}




    {/* 对比编辑关系 */}
    <AuditGraphic modalVisible={relationModalVisible} showState={relationModalShowinfo ? "toaudit" : "modify"} onCancel={
      () => {
        handlerelationModalVisible(false);
      }} title='编辑改动[关系]' value={relationModalvalue} onSubmit={async (success) => {

        if (success) {

        }
      }}
    />

    {/* 初始编辑关系 */}
    <EditGraphic modalVisible={frelationModalVisible} onCancel={
      () => {
        handlefrelationModalVisible(false);
      }} title='编辑展示' qdata={frelationModalvalue} onSubmit={async (success) => {

        if (success) {

        }
      }}

    />

    <ModelD3 modalVisible={frelationModalVisible3} onCancel={
      () => {
        handlefrelationModalVisible3(false);

      }} title='关系展示' />

  </>);
}

export default PackerIndex;