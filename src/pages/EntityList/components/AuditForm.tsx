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
import { entityColum as tabColumn } from '../index';
import { TableListItem as EditData } from '../../ModifyList/data';
import MoreAttr, { MoreAttrRefActionType } from '@/components/MyCom/MoreAttr';
import { isnull } from '@/utils/utils';
import { get as getCls, getClsProperties } from '@/pages/KgClassList/service';
import { modifyValueBeforeCommit } from './EditForm';
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
  readonly?: boolean;
}

export interface EditFormData extends Partial<TableListItem> {
  otherdata?: string;
}

const FormItem = Form.Item;


interface actionitem {
  userid: string;
  username: string;
  editdate: string;
  editaction: string;
  dataid: string;
}


const AttrAuditForm: React.FC<EditFormProps> = (props) => {




  const attrRefForm = useRef<MoreAttrRefActionType>();

  const [fmvalue, Setfmvalue] = useState<any>();
  const [InitAttrs, SetInitAttrs] = useState<any>();
  const [NoModifyAttrs, SetNoModifyAttrs] = useState<any>();
  const [fecthingAttrs, SetFectingAttrs] = useState<boolean>(false);

  const [fmvalueOld, SetfmvalueOld] = useState<any>();
  const [InitAttrsOld, SetInitAttrsOld] = useState<any>();
  const [NoModifyAttrsOld, SetNoModifyAttrsOld] = useState<any>();
  const [fecthingAttrsOld, SetFectingAttrsOld] = useState<boolean>(false);
  //保存正式数据初始值，比较是否有修改，进行提示
  const [initValuesOld, setinitValuesOld] = useState<any>({});




  const { modalVisible, onCancel, title, onSubmit, value, readonly } = props;

  const onloadCur = async (values) => {

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

  const onloadReal = async (values) => {

    //SetdisableListReal(data.disableList);
    if (values) {
      SetInitAttrsOld(values?.properties);

      
      setTimeout(async() => {
        const nval = await attrRefForm.current?.validateForm();
        setinitValuesOld(_.cloneDeep( nval));  
      }, 1000);

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

  const onApplyLeft = () => {

    SetInitAttrsOld(InitAttrs);

    SetNoModifyAttrsOld(NoModifyAttrs);

  }

  const beforeCommit = (fmval: any) => {


    return new Promise(async (resolv, reject) => {



      let clsattrs = {};
      if (attrRefForm.current) {
        clsattrs = await attrRefForm.current?.validateForm();

        if (isnull(clsattrs))
          reject();
      }


      const nvalue = modifyValueBeforeCommit(fmval, clsattrs, fmvalue);
      resolv(nvalue);

    });

  }

  
  const checkChange = async (value, initValue) => {

    let change = false;


    //debugger;
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

    let clsattrs = {};
    if (attrRefForm.current) {
      clsattrs = await attrRefForm.current?.validateForm();


      const keys2 = Object.keys(clsattrs);
      for (let index2= 0; index2 < keys2.length; index2++) {
        const key = keys2[index2];
        const vnew2 = clsattrs[key];
        const vold2 = initValuesOld[key];
        if (JSON.stringify(vnew2) !== JSON.stringify(vold2)) {
 
          change = true;
          break;
        }
      }
    }





    return change;
  }



  return (
    <>
      <AuditForm formlabelCol={{ span: 5 }} fname="实体"
        readonly={readonly} title={title}
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

        value={value} onApplyLeft={onApplyLeft}  checkChange={checkChange} beforeCommit={beforeCommit} onloadCur={onloadCur} onloadReal={onloadReal} getSub={getSub} getEditSub={getEditSub} audit={audit} />
    </>
  );
};

export default AttrAuditForm;
