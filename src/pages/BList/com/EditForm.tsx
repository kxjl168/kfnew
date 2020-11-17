import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, Divider } from 'antd';

import ProTable from '@ant-design/pro-table';

import { isnull } from '@/utils/utils';


import {  UrlItemData as TableListItem } from '../data';
import {procols} from "../index";


import _ from 'lodash';


export interface EditFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: EditFormData) => void;
  title: string;
  values: Partial<TableListItem>;
  loading?: boolean;//自定义属性加载中...
}

export interface EditFormData extends Partial<TableListItem> {
  otherdata?: string;
}

/**
 * 实体提交前的修改
 * @param valueinput 
 * @param clsattrs 
 * @param values 
 */
export const modifyValueBeforeCommit=(valueinput:any,clsattrs:any,values:any)=>{

  if(!valueinput)
  return {};

   const value=_.cloneDeep(valueinput);
    //  debugger;
    if (!isnull(value.clsId)) {
      value.clsName = value.clsId.label;
      value.clsId = value.clsId.value;

    }


    let dirname = "";
    if (value.dirId instanceof Object)
      dirname = value.dirId.text||value.dirId.label;
    else
      dirname =value.dirName;

    //value.fullName=getFullName(dirname,value.name);


    // if (!isnull(value.subKgId)) {
    //   value.subKgName = value.subKgId.label;
    //   value.subKgId = value.subKgId.value;

    // }

    if (!isnull(value.subKgId)) {
      value.subKgId = value.subKgId.toString();

    }

    if (!isnull(value.dirId)) {
      value.dirId = value.dirId.value;
    }


    value.properties = JSON.stringify(clsattrs);

    try {
     // debugger;
      //修改概念类型  标签，替换默认的ClsName 标签
      if (value.clsName !== values.clsName) {
        let jtags = JSON.parse(values?.tags);

        let newtags=[];

       jtags.map(tag => {

          if (tag.label === values?.clsName)//原始标签
            {}
          else
            newtags.push(tag);
        })
        newtags.splice(0, 0, { label: value.clsName, text: value.clsName, key: value.clsName, value: value.clsName+"-#111" });

      //  debugger;
        value.tags = JSON.stringify(newtags);
      }
    } catch (error) {

    }

    return value;

}


const EditForm: React.FC<EditFormProps> = (props) => {

  const form = useRef<FormInstance>();


  // if (values) {
  //   setFormVals({
  //     clsName: values.clsName,
  //     version: values.version,
  //     sort: values.sort,
  //     id: values.id,
  //   })
  // }
  const { modalVisible, onCancel, title, onSubmit, values, columns, loading } = props;
  //console.log("1:" + JSON.stringify(props))


  //console.log("2:" + JSON.stringify(values))


  useEffect(() => {

    if (form && !modalVisible) {
      //s console.log("reset form");
      //  form.resetFields();
    }
  }, [props.modalVisible]);

  useEffect(() => {
    if (values) {

    //  debugger;
  
    }
  }, [props.values]);



  const submit = async (shouldclose) => {
    //const fieldsValue = await form.validateFields();

    const value = await form.current?.validateFields();



   // const nvalue=   modifyValueBeforeCommit(value,clsattrs,values);
  

    onSubmit({ id: values.id, ...value,isshow:values.isshow });
  }


  const renderFooter = () => {

    return (
      <>
        <Button type="primary" onClick={() => submit(true)}>
          保存
        </Button>
        <Button onClick={() => onCancel()}>取消</Button>


      </>
    );
  }


  return (
    <div>
      <div></div>
      <Modal
        className="ownProFoot"
        maskClosable={false}
        keyboard={false}
        destroyOnClose
        title={title}
        visible={modalVisible}
        onCancel={() => onCancel()}
        footer={renderFooter()}
      >
    

        <>
          <ProTable<TableListItem, TableListItem>
            className='editTable'

            onReset={() => onCancel()}

            type="form"

            form={{ initialValues: { ...values }, labelCol: { span: 5 } }}
            /// <reference path="" />
            formRef={form}
            columns={procols()}
            rowSelection={{}}

            onLoad={() => {
             // document.querySelectorAll(".editTable .ant-btn")[2].innerHTML = '取消';

            }}
          />
      
        
        </>

      </Modal>
    </div>
  );
};

export default EditForm;
