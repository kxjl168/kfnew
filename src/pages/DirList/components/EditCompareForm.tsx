import React, { useState, useEffect, useRef } from 'react';



import { isnull } from '@/utils/utils';


import EditCompareForm from '@/components/MyCom/EditCompareForm';


import { get as getSub } from '../service';
import {update, get as getEditSub } from '../editservice';
import { TableListItem as EditData } from '../../ModifyList/data';
import { clsColumn as tabColumn } from '../index';
import { modifyValueBeforeCommit } from './EditForm';

export interface EditFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: boolean) => void;
  title: string;


  value: EditData
  /**显示详情，不可提交 */
  showinfo?: boolean;
}



const AttrEditCompareForm: React.FC<EditFormProps> = (props) => {




  const { modalVisible, onCancel, title, onSubmit, value, showinfo } = props;

  
  const beforeCommit = (fmval:any) => {


    return new Promise(async (resolv, reject) => {



      const nvalue = modifyValueBeforeCommit(fmval);
      resolv(nvalue);

    });

  }


  

  return (
    <>
      <EditCompareForm  formlabelCol={{span:5}}  fname="语境"
       showinfo={showinfo} title={title}
       tableCololds={tabColumn()}
       tableCols={tabColumn()}

         modalVisible={modalVisible} 
         onCancel={onCancel} 
         onSubmit={onSubmit}
          
           value={value} beforeCommit={beforeCommit} getSub={getSub} getEditSub={getEditSub}  updateEditDataFun={update} />

    </>
  );
};

export default AttrEditCompareForm;
