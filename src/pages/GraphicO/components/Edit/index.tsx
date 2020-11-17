import { Col, Row, Drawer, Modal, Button, Spin } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import GGEditor, { Koni, RegisterCommand, withPropsAPI } from 'gg-editor';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage,Dispatch, connect } from 'umi';

import EditMainPanel from '../../index';
import { TableListItem as EditData } from '@/pages/ModifyList/data';

import { query as queryEntity } from '@/pages/EntityList/service';

import { query as queryCls } from '@/pages/KgClassList/service';

import './index.less';
import { QDATA } from '../KoniMain/KoniPanel';
import { IconFontNew } from '@/components/MyCom/KIcon';
import TextArea from 'antd/lib/input/TextArea';
import { AuditAction } from '../../cmd/SaveCmd';

import AuditDv from './AuditDv';
import CompareEdit from '../Audit/CompareEdit';

import _ from 'lodash';
import { getAuthority } from '@/utils/authority';
import { ConnectState } from '@/models/connect';

GGEditor.setTrackable(false);

export interface AuditGraphicProp {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: boolean) => void;
  title: string;

  qdata: QDATA;

  dispatch: Dispatch;
}


const EditGraphic: React.FC<AuditGraphicProp> = (props) => {

  const { title, modalVisible, onCancel, onSubmit, qdata } = props;


  const [showMode, setShowMode] = useState<'modify' | 'compare'>('modify');
  const [value, SetValue] = useState<EditData>();

  const curMainRef = useRef<AuditAction>();


  const [changing, setChanging] = useState<boolean>(false);


  useEffect(()=>{
    if(!modalVisible)
    {
      setShowMode('modify');
    }
  },[modalVisible])

  const saveFirst = async (rst2) => {

    let isadmin = false;
    const roles = getAuthority();
    if (roles != null) {

      isadmin = _.find(roles, r => {
        return r === 'admin';
      });
      if (isadmin)
        return;//审核管理员无需切换
    }


    //保存第一次，切换为对比内容

    //刷新父窗口状态
    onSubmit(true);

    setChanging(true);



    //查询实体
    let rst =null;
    if(qdata.gtype==="entity")
    rst=await queryEntity({ id: qdata.id });
    else 
    rst=await queryCls({ id: qdata.id });

    if (rst && rst.success && rst.data) {

      const record = rst.data[0];
      let edits = '[]';
      if (record.myEdit !== '[]') {
        edits = JSON.parse(record.myEdit);
      }

      const editObjEntity = _.find(edits, item => {
        return item.dataType === '6'
      })
      const editObjRelation = _.find(edits, item => {
        return item.dataType === '7'
      })

      if (editObjRelation) {
        //切换显示对比编辑
        SetValue({ id: editObjRelation.id, editDataId: editObjRelation.editDataId, editOriDataId: record.id, editAction: editObjRelation.editAction });
        setShowMode("compare");
      }


    }

    //SetValue()

    setChanging(false);
  }

  useEffect(() => {
    // setqdata({
    //   id: value.id,
    //   level: 1,
    //   gtype: value.editAction === "1" ? 'cls' : 'entity',
    //   iseditData: true,
    // })

    props.dispatch({
      type: 'graphic/cleandata',
      payload: {
        
      }
    })

    props.dispatch({
      type: 'graphic/setqueryname',
      payload: {
        name: ""
      }
    });



  }, [])


  const getdom = () => {


    if (showMode === "modify") {
      return <EditMainPanel onSaveOrAudit={saveFirst} ref={curMainRef} qdata={qdata} hidemini showLeftDiv showRightDiv showBar autofit ggstyle={{ width: '100%', height: 'calc(100vh - 25px)' }} >
        <>

        </>
      </EditMainPanel>;
    }

    return <>
      <CompareEdit value={value} onSubmit={onSubmit} showState='modify' />
    </>
  }

  const renderFooter = () => {
    return <></>
  }

  return (
    <>
      <Modal
        className="ownProFoot  afullscreen padding5"
        maskClosable={false}
        keyboard={false}
        destroyOnClose
        title={title}
        visible={modalVisible}
        onCancel={() => onCancel()}
        footer={renderFooter()}
      >
        {changing && <Spin style={{ minHeight: '100vh' }} />}
        {!changing && getdom()}

      </Modal>

    </>
  );

}

 
export default connect(({ graphic, loading }: ConnectState) => ({
  graphicModel: graphic,
  initFun: loading.effects['graphic/init'],
}))(EditGraphic);