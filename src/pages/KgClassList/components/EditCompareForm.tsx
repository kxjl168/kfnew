import React, { useState, useEffect, useRef } from 'react';



import { isnull } from '@/utils/utils';


import EditCompareForm from '@/components/MyCom/EditCompareForm';


import { get as getSub } from '../service';
import {update, get as getEditSub } from '../editservice';
import { TableListItem as EditData } from '../../ModifyList/data';
import { clsColumn as tabColumn } from '@/pages/KgClassList/index';
import { modifyValueBeforeCommit } from './EditForm';
import MoreAttr, { MoreAttrRefActionType } from '@/components/MyCom/MoreAttr';


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


  const attrRefForm = useRef<MoreAttrRefActionType>();

  const [fmvalue, Setfmvalue] = useState<any>();
  const [InitAttrs, SetInitAttrs] = useState<any>();
  const [NoModifyAttrs, SetNoModifyAttrs] = useState<any>();
  const [fecthingAttrs, SetFectingAttrs] = useState<boolean>(false);

  const [fmvalueOld, SetfmvalueOld] = useState<any>();
  const [InitAttrsOld, SetInitAttrsOld] = useState<any>();
  const [NoModifyAttrsOld, SetNoModifyAttrsOld] = useState<any>();
  const [fecthingAttrsOld, SetFectingAttrsOld] = useState<boolean>(false);


  const [disableListReal, SetdisableListReal] = useState<any[]>([]);
  const [disableListCur, SetdisableListCur] = useState<any[]>([]);


  const { modalVisible, onCancel, title, onSubmit, value, showinfo } = props;

  const onloadCur=(values)=>{
    
    SetdisableListCur(values.disableList);

    if (values) 
      SetInitAttrs(values?.properties);

  }

  const onloadReal=(values)=>{
      
    SetdisableListReal(values.disableList);

    if (values) 
      SetInitAttrsOld(values?.properties);

  }


  
  const beforeCommit = (fmval:any) => {


    return new Promise(async (resolv, reject) => {

      const clsattrs = await attrRefForm.current?.validateForm();

      if (!clsattrs)
        reject();

      const nvalue = modifyValueBeforeCommit(fmval, clsattrs);
      resolv(nvalue);

    });

  }


  

  return (
    <>
      <EditCompareForm  formlabelCol={{span:5}}  fname="概念"
       showinfo={showinfo} title={title}
       tableCololds={tabColumn(disableListReal)}
        tableCols={tabColumn(disableListCur)}

        oldAddtionDom={
          <>
          <span className="moredv">
            <MoreAttr showsplit onlyShow={false} showAddDom={false} labelCol={{ span: 4 }} loading={fecthingAttrsOld}  InitAttrs={InitAttrsOld} BtnTitle="添加概念额外属性" />
          
            </span>
          </>
        }

     
        curAddtionDom={
          <>
             <span className="moredv">
            <MoreAttr showsplit onlyShow={false} ref={attrRefForm} showAddDom={showinfo?false:true} labelCol={{ span: 4 }} loading={fecthingAttrs}  InitAttrs={InitAttrs} BtnTitle="添加概念额外属性" />
            </span>
          </>
        }




         modalVisible={modalVisible} 
         onCancel={onCancel} 
         onSubmit={onSubmit}
          
           value={value}  beforeCommit={beforeCommit} onloadCur={onloadCur}   getSub={getSub} getEditSub={getEditSub} onloadReal={onloadReal}  updateEditDataFun={update} />

    </>
  );
};

export default AttrEditCompareForm;
