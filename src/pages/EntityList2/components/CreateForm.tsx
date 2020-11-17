import React, { useRef, useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import ProTable from '@ant-design/pro-table';

import { entityColum } from '@/pages/EntityList/index';
import { isnull } from '@/utils/utils';
import MoreAttr, { MoreAttrRefActionType } from '@/components/MyCom/MoreAttr';
import { FormInstance } from 'antd/lib/form';
import { TableListItem } from '../data';

interface CreateFormProps {
  title: string;
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: any,callback:((rst:any)=>void)) => void;
  hideAddMore?: boolean;
  values?: Partial<TableListItem>;
  loading?: boolean;//自定义属性加载中...
}




const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, title, onSubmit, hideAddMore, values, loading } = props;

  const form = useRef<FormInstance>();
  const attrRefForm = useRef<MoreAttrRefActionType>();


  const [InitAttrs, SetInitAttrs] = useState<any>();
  const [NoModifyAttrs, SetNoModifyAttrs] = useState<any>();

  const [fecthingAttrs, SetFectingAttrs] = useState<boolean>(false);

  useEffect(() => {

    SetInitAttrs(values?.properties);
    SetNoModifyAttrs(values?.clsProperties);

  }, [values]);

  useEffect(() => {

    SetFectingAttrs(loading);

  }, [loading]);



  const HandlerClsDataChange = (clsData) => {

    //保留当前实体已有同名属性



    SetInitAttrs(clsData);



    SetNoModifyAttrs(clsData);
  }
  const HandlerFecting = (data) => {
    SetFectingAttrs(data);
  }


  const submit = async (shouldclose) => {
    const value = await form.current?.validateFields();

    const clsattrs = await attrRefForm.current?.validateForm();



    if (!clsattrs)
      return;

    //debugger;
    if (!isnull(value.clsId)) {
      value.clsName = value.clsId.label;
      value.clsId = value.clsId.value;

    }

    //  if (!isnull(value.subKgId)) {
    //   value.subKgName = value.subKgId.label; 
    //   value.subKgId = value.subKgId.value;

    //  }


    value.fullName=getFullName(value.dirId.label,value.name);

    if (!isnull(value.subKgId)) {
      value.subKgId = value.subKgId.toString();

    }

    if (!isnull(value.dirId)) {
      value.dirId = value.dirId.value;

    }

    //填充编码，名称

    value.properties = JSON.stringify(clsattrs);

   



    onSubmit({ ...value, shouldclose: shouldclose },()=>{
      if(!shouldclose)
      {
        //保存并继续，清空 展示名称，实体名称，概念属性
        form.current?.setFieldsValue({name:'',fullName:''});
        attrRefForm.current?.resetFields();
      }
  
    });


    
  }

  const getFullName = (dirname,name) => {

    if(dirname&&name)
    return dirname + ":" +name;
    else if(dirname)
    return dirname;
    else if(name)
    return name;
    // return record.dirName+":"+record.name;
  }


  const renderFooter = () => {

    return (
      <>
        {!hideAddMore &&
          <Button type="primary" onClick={() => submit(false)}>
            保存并继续
        </Button>
        }
        <Button type="dashed"  onClick={() => submit(true)}>
          保存
        </Button>
        <Button onClick={() => onCancel()}>取消</Button>

      </>
    );
  };



  return (
    <Modal
      maskClosable={false}
      keyboard={false}
      className="ownProFoot"
      destroyOnClose
      title={title}
      visible={modalVisible}
      onCancel={() => onCancel()}

      footer={renderFooter()}
    >

      <>
        <ProTable

          form={{ initialValues: { ...values }, labelCol: { span: 5 } }}
          formRef={form}

          rowKey="key"
          type="form"

          columns={entityColum(HandlerClsDataChange, HandlerFecting)}
          rowSelection={{}}
        />
        <MoreAttr showsplit ref={attrRefForm} labelCol={{ span: 5 }} showAddDom={false} DefaultNoModifyAttrs={NoModifyAttrs} loading={fecthingAttrs} InitAttrs={InitAttrs} BtnTitle="添加实体额外属性" />

      </>


    </Modal>
  );






};





export default CreateForm;
