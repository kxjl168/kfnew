import React, { useState, useEffect, useRef } from 'react';



import { isnull } from '@/utils/utils';


import EditCompareForm from '@/components/MyCom/EditCompareForm';


import { get as getSub } from '../service';
import {update, get as getEditSub } from '../editservice';
import { TableListItem as EditData } from '../../ModifyList/data';
import { relationColum as tabColumn } from '../index';

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


  
  const [disableListReal, SetdisableListReal] = useState<any[]>([]);
  const [disableListCur, SetdisableListCur] = useState<any[]>([]);


  const { modalVisible, onCancel, title, onSubmit, value, showinfo } = props;

  const onloadCur=(data)=>{
    
    SetdisableListCur(data.disableList);
  }

  const onloadReal=(data)=>{
      
    SetdisableListReal(data.disableList);
  }



  

  return (
    <>
      <EditCompareForm  formlabelCol={{span:5}}  fname="关系"
       showinfo={showinfo} title={title}
       tableCololds={tabColumn}
        tableCols={tabColumn}
         modalVisible={modalVisible} 
         onCancel={onCancel} 
         onSubmit={onSubmit}
          
           value={value} onloadCur={onloadCur}   getSub={getSub} getEditSub={getEditSub} onloadReal={onloadReal}  updateEditDataFun={update} />

    </>
  );
};

export default AttrEditCompareForm;
