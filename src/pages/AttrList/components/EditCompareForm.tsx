import React, { useState, useEffect, useRef } from 'react';



import { isnull } from '@/utils/utils';


import EditCompareForm from '@/components/MyCom/EditCompareForm';


import { get as getSub } from '../service';
import {update, get as getEditSub } from '../editservice';
import { TableListItem as EditData } from '../../ModifyList/data';
import { attrColumn } from '../index';



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


  
  const [showCls, SetShowCls] = useState<boolean>(false);
  const [showCls1, SetShowCls1] = useState<boolean>(false);


  const { modalVisible, onCancel, title, onSubmit, value, showinfo } = props;

  const onloadCur=(data)=>{
    
    const ruleTypedata = JSON.parse(data.dataTypeRule);

    const id = ruleTypedata.id;

    if (id === "2")//实体选择
      SetShowCls(true)
    else
      SetShowCls(false);
  }

  const onloadReal=(data)=>{
      
    const ruleTypedata = JSON.parse(data.dataTypeRule);

    const id = ruleTypedata.id;

    if (id === "2")//实体选择
      SetShowCls1(true)
    else
      SetShowCls1(false);

  }



  

  return (
    <>
      <EditCompareForm  formlabelCol={{span:5}}  fname="属性"
       showinfo={showinfo} title={title}
        tableCololds={attrColumn(false, showCls1, SetShowCls1)}
        tableCols={attrColumn(showinfo?false:true, showCls, SetShowCls)}
         modalVisible={modalVisible} 
         onCancel={onCancel} 
         onSubmit={onSubmit}
          
           value={value} onloadCur={onloadCur}   getSub={getSub} getEditSub={getEditSub} onloadReal={onloadReal}  updateEditDataFun={update} />

    </>
  );
};

export default AttrEditCompareForm;
