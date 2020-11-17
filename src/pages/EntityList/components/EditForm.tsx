import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, Divider } from 'antd';
import { TableListItem, TableListPagination, BackPagination } from '../data';
import TextArea from 'antd/lib/input/TextArea';
import { ProColumns } from '@ant-design/pro-table/lib/Table';
import ProTable from '@ant-design/pro-table';
import { useForm } from 'antd/lib/form/util';
import { entityColum } from '@/pages/EntityList/index';
import { isnull } from '@/utils/utils';
import MoreAttr, { MoreAttrRefActionType } from '@/components/MyCom/MoreAttr';
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
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};
const FormItem = Form.Item;


export const getFullName = (dirname,name) => {

  if(dirname&&name)
  return dirname + ":" +name;
  else if(dirname)
  return dirname;
  else if(name)
  return name;
  // return record.dirName+":"+record.name;
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

    value.fullName=getFullName(dirname,value.name);


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
  const attrRefForm = useRef<MoreAttrRefActionType>();
  const [InitAttrs, SetInitAttrs] = useState<any>();
  const [NoModifyAttrs, SetNoModifyAttrs] = useState<any>();
  const [fecthingAttrs, SetFectingAttrs] = useState<boolean>(false);


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


      SetInitAttrs(values?.properties);
      SetNoModifyAttrs(values?.clsProperties);

    }
  }, [props.values]);



  const submit = async (shouldclose) => {
    //const fieldsValue = await form.validateFields();

    const value = await form.current?.validateFields();


    const clsattrs = await attrRefForm.current?.validateForm();

    if (!clsattrs)
      return;


   const nvalue=   modifyValueBeforeCommit(value,clsattrs,values);
  

    onSubmit({ id: values.id, ...nvalue });
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

  const HandlerClsDataChange = (clsData) => {



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

    const exsitAttrs = JSON.parse(values?.properties);
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
  const HandlerFecting = (data) => {
    SetFectingAttrs(data);
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
        {/* <Form
          onSubmitCapture={submit}
          {...formLayout}
          form={form}

        >
          {renderContent()}
        </Form> */}

        <>
          <ProTable<TableListItem, TableListItem>
            className='editTable'

            onReset={() => onCancel()}

            type="form"
            // request={(params) => {
            //   //let rst = query(params);

            //   return new Promise((resolve)=>{
            //     resolve  (values);

            //   })
            // }}
            form={{ initialValues: { ...values }, labelCol: { span: 5 } }}
            /// <reference path="" />
            formRef={form}
            columns={entityColum(HandlerClsDataChange, HandlerFecting)}
            rowSelection={{}}

            onLoad={() => {
              document.querySelectorAll(".editTable .ant-btn")[2].innerHTML = '取消';

            }}
          />
      
          <MoreAttr showsplit onlyShow={false} ref={attrRefForm} showAddDom={false} labelCol={{ span: 5 }} loading={fecthingAttrs} DefaultNoModifyAttrs={NoModifyAttrs} InitAttrs={InitAttrs} BtnTitle="添加实体额外属性" />

        </>

      </Modal>
    </div>
  );
};

export default EditForm;
