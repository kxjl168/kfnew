import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, message } from 'antd';
import { TableListItem, TableListPagination, BackPagination } from './data';
import TextArea from 'antd/lib/input/TextArea';
import { ProColumns } from '@ant-design/pro-table/lib/Table';
import ProTable from '@ant-design/pro-table';
import { useForm, FormInstance } from 'antd/lib/form/util';
import { isnull } from '@/utils/utils';
import { attrColumn } from '@/pages/AttrList/index';

export interface EditFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: EditFormData) => void;
  title: string;
  values: Partial<TableListItem>;
  columns:ProColumns<TableListItem>[] ;
}

export interface EditFormData extends Partial<TableListItem> {
  otherdata?: string;
}
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};
const FormItem = Form.Item;





const EditForm: React.FC<EditFormProps> = (props) => {

  const [form] = Form.useForm();

  const [showCls, SetShowCls] = useState<boolean>(false);

  // if (values) {
  //   setFormVals({
  //     clsName: values.clsName,
  //     version: values.version,
  //     sort: values.sort,
  //     id: values.id,
  //   })
  // }
  const { modalVisible, onCancel, title, onSubmit, values,columns} = props;
  //console.log("1:" + JSON.stringify(props))
  

  //console.log("2:" + JSON.stringify(values))

  const tableref = useRef<FormInstance>();
  useEffect(() => {

    if (form && !modalVisible) {
     //s console.log("reset form");
      form.resetFields();
    }
  }, [props.modalVisible]);


  useEffect(() => {

    if (form) {
     //s console.log("reset form");
      form.resetFields();
    // form.initialValues=values;
    form.setFieldsValue({
      ...values,

   });
    }
  }, []);

  useEffect(() => {
    if (values) {

  
   
      const ruleTypedata = JSON.parse(values.dataTypeRule);

      const id = ruleTypedata.id;

      if (id === "2")//实体选择
      SetShowCls(true)
     else
      SetShowCls(false);


    }
  }, [props.values]);



  const submit = async () => {
    const value = await tableref.current?.validateFields();

    if (!isnull(value.clsId)) {
      value.clsId = JSON.stringify( value.clsId);

     }
    onSubmit({ id:values.id, ...value});
  }


  const renderFooter = () => {

    return (
      <>
    <Button type="primary" onClick={() => submit()}>
          保存
        </Button>
        <Button onClick={() => onCancel()}>取消</Button>


      
      </>
    );
  }

  const handerCancel=(e)=>{

  //  debugger;
   // console.log(e.type);
    if(e.type!=='click')
    {
      
      return;
    }

    onCancel()
  }

  return (
    <div>
      <div></div>
      <Modal
      className="ownProFoot"
      //  maskClosable={false}
      //  keyboard={false}
        destroyOnClose
        title={title}
        visible={modalVisible}
        onCancel={handerCancel}
        footer={renderFooter()}
      >
        {/* <Form
          onSubmitCapture={submit}
          {...formLayout}
          form={form}

        >
          {renderContent()}
        </Form> */}

        <ProTable<TableListItem, TableListItem>
          className='editTable'
          // onSubmit={submit}
          // onReset={() => onCancel()}
         
          type="form"
          // request={(params) => {
          //   //let rst = query(params);
            
          //   return new Promise((resolve)=>{
          //     resolve  (values);
              
          //   })
          // }}
          form={{ initialValues: {...values} , labelCol: {span: 5}  } }
         /// <reference path="" />
          formRef={tableref}
          columns={attrColumn(true,showCls, SetShowCls)}
          rowSelection={{}}

          onLoad={()=>{
          //  document.querySelectorAll(".editTable .ant-btn")[1].innerHTML='取消';  
            
          }}
        />

      </Modal>
    </div>
  );
};

export default EditForm;
