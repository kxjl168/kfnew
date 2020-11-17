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
import D3Panel from './D3Panel';

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


   
    return <>
      <D3Panel qdata={
        {
 gtype: "entity",
 id: '76f3584974fc4a91b6cc9aaa5b5e0db0',
 level: 1,
 iseditData: false,
}
      } />
    </>
  }

  const renderFooter = () => {
    return <></>
  }

  return (
    <>
      <Modal
        className="ownProFoot  afullscreen padding5 searchDv2"
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