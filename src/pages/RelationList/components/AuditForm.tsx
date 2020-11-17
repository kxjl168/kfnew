import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, Row, Timeline, Steps, message, Spin, Tooltip, Alert } from 'antd';
import { TableListItem, TableListPagination, BackPagination } from '../data';
import TextArea from 'antd/lib/input/TextArea';
import { ProColumns } from '@ant-design/pro-table/lib/Table';
import ProTable from '@ant-design/pro-table';
import { useForm } from 'antd/lib/form/util';

import Icon, { UserOutlined, LoadingOutlined, SolutionOutlined, CloseOutlined, FormOutlined, ReadOutlined, PlusOutlined, ArrowDownOutlined, ArrowUpOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { get as getSub, update, audit } from '../service';
import { get as getEditSub } from '../editservice';

import AuditForm from '@/components/MyCom/AuditForm';
import { relationColum as tabColumn } from '../index';
import {TableListItem as EditData} from '../../ModifyList/data';
import { isnull } from '@/utils/utils';
import _ from 'lodash';


export interface EditFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: EditFormData) => void;
  title: string;

  value: EditData;
  /**
   * 只读，已审核的只能看
   */
  readonly?:boolean;
}

export interface EditFormData extends Partial<TableListItem> {
  otherdata?: string;
}

const FormItem = Form.Item;


interface actionitem {
  userid:string;
  username:string;
  editdate:string;
  editaction:string;
  dataid:string;
}


const AttrAuditForm: React.FC<EditFormProps> = (props) => {



  const [disableListReal, SetdisableListReal] = useState<any[]>([]);
  const [disableListCur, SetdisableListCur] = useState<any[]>([]);


  const { modalVisible, onCancel, title, onSubmit, value,readonly } = props;

  
  const onloadCur=(data)=>{
    
    SetdisableListCur(data.disableList);
  }

  const onloadReal=(data)=>{
      
    SetdisableListReal(data.disableList);
  }


  const onApplyLeft = (data) => {

    onloadReal(data);
  }


  const checkChange =async (value, initValue) => {

    let change = false;

    const keys = Object.keys(value);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let vnew = value[key];
        let vold = initValue[key];
        if(vnew instanceof Object)
        {
          vnew=JSON.stringify(vnew);
        }
        if(vold instanceof Object)
        {
          vold=JSON.stringify(vold);
        }

      if (vnew !== vold) {

        change = true;
        break;
      }

    }


    return change;
  }


  
const beforeCommit = (fmval: any) => {


  return new Promise(async (resolv, reject) => {

    const nvalue=_.cloneDeep(fmval);

  

    if (!isnull(nvalue.equivalence)&& (nvalue.equivalence instanceof Object))
    nvalue.equivalence = JSON.stringify(nvalue.equivalence);//.toString();
  if (!isnull(nvalue.reverse) && (nvalue.reverse instanceof Object))
  nvalue.reverse = JSON.stringify(nvalue.reverse);//.toString();


  if (!isnull(nvalue.attrs)  && (nvalue.attrs instanceof Object))
  nvalue.attrs = nvalue.attrs.toString();

  
    resolv(nvalue);

  });

}

  return (
      <>
      <AuditForm   formlabelCol={{span:5}} fname="关系"
       readonly={readonly} title={title}
       tableCololds={tabColumn}
       tableCols={tabColumn}
         modalVisible={modalVisible} 
         onCancel={onCancel} 
         onSubmit={onSubmit}
       
           value={value} beforeCommit={beforeCommit} checkChange={checkChange} onApplyLeft={onApplyLeft}  onloadCur={onloadCur} onloadReal={onloadReal}  getSub={getSub} getEditSub={getEditSub} audit={audit}   />
      </>
    );
};

export default AttrAuditForm;
