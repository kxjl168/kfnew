import React, { useState, useEffect, useRef } from 'react';



import { isnull } from '@/utils/utils';


import EditCompareForm from '@/components/MyCom/EditCompareForm';


import { get as getSub } from '../service';
import { update, get as getEditSub } from '../editservice';
import { TableListItem as EditData } from '../../ModifyList/data';
import { entityColum as tabColumn } from '../index';
import MoreAttr, { MoreAttrRefActionType } from '@/components/MyCom/MoreAttr';
import { modifyValueBeforeCommit } from './EditForm';
import { get as getCls, getClsProperties } from '@/pages/KgClassList/service';

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


  const attrRefForm = useRef<MoreAttrRefActionType>();

  const [fmvalue, Setfmvalue] = useState<any>();
  const [InitAttrs, SetInitAttrs] = useState<any>();
  const [NoModifyAttrs, SetNoModifyAttrs] = useState<any>();
  const [fecthingAttrs, SetFectingAttrs] = useState<boolean>(false);

  const [fmvalueOld, SetfmvalueOld] = useState<any>();
  const [InitAttrsOld, SetInitAttrsOld] = useState<any>();
  const [NoModifyAttrsOld, SetNoModifyAttrsOld] = useState<any>();
  const [fecthingAttrsOld, SetFectingAttrsOld] = useState<boolean>(false);



  const { modalVisible, onCancel, title, onSubmit, value, showinfo } = props;

  const onloadCur =async (values) => {

    //SetdisableListCur(data.disableList);

    if (values) {
      SetInitAttrs(values?.properties);



      let noModifyAttr = [];
      //获取上级概念的所有属性
      let clsData = await getCls(values.clsId);
  
      if (clsData && clsData.success && clsData.data) {
  
        if (!isnull(clsData.data.attrs)) {
          const attrids = clsData.data.attrs.split(",");
          const attrNames = clsData.data.attrNames.split(",");
  
  
          for (let index = 0; index < attrids.length; index++) {
            noModifyAttr.push({
              id: attrids[index]
            })
          }
        }
      }
      SetNoModifyAttrs(noModifyAttr);
    }

    Setfmvalue(values);


  }

  const onloadReal =async (values) => {

    //SetdisableListReal(data.disableList);
    if (values) {
      SetInitAttrsOld(values?.properties);
   
      let noModifyAttr = [];
      //获取上级概念的所有属性
      let clsData = await getCls(values.clsId);
  
      if (clsData && clsData.success && clsData.data) {
  
        if (!isnull(clsData.data.attrs)) {
          const attrids = clsData.data.attrs.split(",");
          const attrNames = clsData.data.attrNames.split(",");
  
  
          for (let index = 0; index < attrids.length; index++) {
            noModifyAttr.push({
              id: attrids[index]
            })
          }
        }
      }
      SetNoModifyAttrsOld(noModifyAttr);


    }
    SetfmvalueOld(values);

  }


  const HandlerClsDataChangeCur = (clsData) => {



    //保留已有同名属性值
    let initAttrs = [];
    if (clsData && clsData.length > 0) {
      if (clsData instanceof Object)
        initAttrs = clsData;
      else {
        const defaultAttrs = JSON.parse(clsData);
        initAttrs = defaultAttrs;
      }
    }

    const exsitAttrs = JSON.parse(fmvalue?.properties);
    for (let index = 0; index < initAttrs.length; index++) {
      let attr = initAttrs[index];

      for (let k = 0; k < exsitAttrs.length; k++) {
        const eattr = exsitAttrs[k];
        if (attr.id === eattr.id) {
          attr.value = eattr.value;
          break;
        }
      }

    }


    SetInitAttrs(initAttrs);


    SetNoModifyAttrs(clsData);
  }
  const HandlerFectingCur = (data) => {
    SetFectingAttrs(data);
  }


  const beforeCommit = (fmval:any) => {


    return new Promise(async (resolv, reject) => {

      const clsattrs = await attrRefForm.current?.validateForm();

      if (!clsattrs)
        reject();

      const nvalue = modifyValueBeforeCommit(fmval, clsattrs, fmvalue);
      resolv(nvalue);

    });

  }





  return (
    <>
      <EditCompareForm formlabelCol={{ span: 5 }} fname="实体"
        showinfo={showinfo} title={title}
        tableCololds={tabColumn()}

        oldAddtionDom={
          <>
          <span className="moredv">
            <MoreAttr showsplit onlyShow={false} showAddDom={false} labelCol={{ span: 5 }} loading={fecthingAttrsOld} DefaultNoModifyAttrs={NoModifyAttrsOld} InitAttrs={InitAttrsOld} BtnTitle="添加实体额外属性" />
            </span>
          </>
        }

        tableCols={tabColumn(HandlerClsDataChangeCur, HandlerFectingCur)}
        curAddtionDom={
          <>
             <span className="moredv">
            <MoreAttr showsplit onlyShow={false} ref={attrRefForm} showAddDom={false} labelCol={{ span: 5 }} loading={fecthingAttrs} DefaultNoModifyAttrs={NoModifyAttrs} InitAttrs={InitAttrs} BtnTitle="添加实体额外属性" />
            </span>
          </>
        }


        modalVisible={modalVisible}
        onCancel={onCancel}
        onSubmit={onSubmit}

        value={value}  beforeCommit={beforeCommit}  onloadCur={onloadCur} getSub={getSub} getEditSub={getEditSub} onloadReal={onloadReal} updateEditDataFun={update} />

    </>
  );
};

export default AttrEditCompareForm;
