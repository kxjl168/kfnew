import React, { useRef, useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import ProTable from '@ant-design/pro-table';


import { isnull } from '@/utils/utils';

import { FormInstance } from 'antd/lib/form';
import {  UrlItemData as TableListItem } from '../data';
import {procols} from "../index";

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


  useEffect(() => {

 
  }, [values]);

  useEffect(() => {


  }, [loading]);




  const submit = async (shouldclose) => {
    const value = await form.current?.validateFields();


//    value.fullName=getFullName(value.dirId.label,value.name);


    onSubmit({ ...value, shouldclose: shouldclose },()=>{
      if(!shouldclose)
      {
        //保存并继续，清空 展示名称，实体名称，概念属性
       // form.current?.setFieldsValue({name:'',fullName:''});
      //  attrRefForm.current?.resetFields();
      }
  
    });


    
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

          rowKey="id"
          type="form"

    //   columns={
    //     [{
    //       title: 'ID',
    //       dataIndex: 'id',
    //       hideInForm: true,
    //       hideInSearch: true,
    //       hideInTable: true,
    //   },
    //   {
    //      index:1,
    //       title: '链接名称',
    //       dataIndex: 'url_name',
    //       hideInForm: false,
    //       hideInSearch: true,
    //       hideInTable: false,
    //       rules: [
    //         {
    //           required: true,
    //           message: '语境名称为必填项',
    //         },
    //       ]
    //   }
    //  ]




    //   }

           columns={procols()}
       //   rowSelection={{}}
        />
      
      </>


    </Modal>
  );






};





export default CreateForm;
