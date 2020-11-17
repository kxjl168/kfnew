import { Col, Row, Drawer, Modal, Button } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import GGEditor, { Koni, RegisterCommand, withPropsAPI } from 'gg-editor';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { formatMessage,Dispatch, connect } from 'umi';

import EditMainPanel from '../../index';
import { TableListItem as EditData } from '@/pages/ModifyList/data';


import './index.less';
import { QDATA } from '../KoniMain/KoniPanel';
import { IconFontNew } from '@/components/MyCom/KIcon';
import TextArea from 'antd/lib/input/TextArea';
import { AuditAction } from '../../cmd/SaveCmd';

import AuditDv from './AuditDv';
import CompareEdit from './CompareEdit';
import { ConnectState } from '@/models/connect';

GGEditor.setTrackable(false);

export interface AuditGraphicProp {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: boolean) => void;
  title: string;


  value: EditData;
  dispatch: Dispatch;

  /**
   * 对应四种状态
   */
  showState:'modify'|'toaudit'|'audit'|'auditDone';
}


const AuditGraphic: React.FC<AuditGraphicProp> = (props) => {

  const { title, modalVisible, onCancel, value, onSubmit,showState } = props;


 
  const renderFooter=()=>{
    return <></>
  }

  useEffect(()=>{

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


  },[])

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
        <CompareEdit  value={value} onSubmit={onSubmit} showState={showState} />

      </Modal>

    </>
  );

}


export default connect(({ graphic, loading }: ConnectState) => ({
  graphicModel: graphic,
  initFun: loading.effects['graphic/init'],
}))(AuditGraphic);