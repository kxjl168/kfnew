import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, Row, Col, message, Spin, Tooltip, Alert } from 'antd';
import { TableListItem, TableListPagination, BackPagination } from './data.d';




import TextArea from 'antd/lib/input/TextArea';
import { ProColumns } from '@ant-design/pro-table/lib/Table';
import ProTable from '@ant-design/pro-table';
import { useForm, FormInstance } from 'antd/lib/form/util';

import {update } from '../editservice';
import { get as getSub } from '../service';
import { get as getEditSub } from '../editservice';

import {TableListItem as EditData} from '../../ModifyList/data';

import {subCol} from '../index';

import { isnull } from '@/utils/utils';
import EditCompareForm from '@/components/MyCom/EditCompareForm';

export interface EditFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: any) => void;
  title: string;
  
  columns?:ProColumns<TableListItem>[] ;

  // values?: Partial<TableListItem>;
  // valuesOld?: any;
  
  value:EditData
  /**显示详情，不可提交 */
  showinfo?:boolean;
}


export interface EditFormData extends Partial<TableListItem> {
  otherdata?: string;
}




const SubEditCompareForm: React.FC<EditFormProps> = (props) => {


  const { modalVisible, onCancel, title, onSubmit, value, showinfo} = props;


  

  


  return (
    <> 
      <EditCompareForm   formlabelCol={{span:5}} fname="领域"
       showinfo={showinfo} title={title}
        tableCololds={subCol}
        tableCols={subCol}
         modalVisible={modalVisible} 
         onCancel={onCancel} 
         onSubmit={onSubmit}
          
           value={value}   getSub={getSub} getEditSub={getEditSub}  updateEditDataFun={update} />

    </>
  );
}


export default SubEditCompareForm;
