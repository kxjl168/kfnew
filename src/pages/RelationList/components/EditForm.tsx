import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input } from 'antd';
import { TableListItem, TableListPagination, BackPagination } from './data.d';
import TextArea from 'antd/lib/input/TextArea';
import { ProColumns } from '@ant-design/pro-table/lib/Table';
import ProTable from '@ant-design/pro-table';
import { useForm } from 'antd/lib/form/util';
import { isnull } from '@/utils/utils';
import { relationColum } from '@/pages/RelationList/index';
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

 // const [form] = Form.useForm();

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

  const tableref = useRef();
  // useEffect(() => {

  //   if (form && !modalVisible) {
  //    //s console.log("reset form");
  //     form.resetFields();
  //   }
  // }, [props.modalVisible]);

  useEffect(() => {
    if (values) {

    //   console.log('3'+JSON.stringify(values));
     
    //   form.setFieldsValue({
    //     ...values,

    //   });
    //  // debugger;
    //   if(formRef.current)
    //   {
    //     console.log(formRef.current);
    //   }
      // if(forminner.current)
      // forminner.current.setFieldsValue({
      //   ...values,

      // });
    }
  }, [props.values]);



  const submit = async (value) => {
   // const fieldsValue = await form.validateFields();

    //setFormVals({ ...formVals, ...fieldsValue });

    if (!isnull(value.equivalence)&& (value.equivalence instanceof Object))
    value.equivalence = JSON.stringify(value.equivalence);//.toString();
  if (!isnull(value.reverse) && (value.reverse instanceof Object))
    value.reverse = JSON.stringify(value.reverse);//.toString();


  if (!isnull(value.attrs)  && (value.attrs instanceof Object))
    value.attrs = value.attrs.toString();

    onSubmit({ id:values.id, ...value });
  }


  const renderFooter = () => {

    return (
      <>

      
      </>
    );
  }

  return (
    <div>
      <div></div>
      <Modal
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

        <ProTable<TableListItem, TableListItem>
          className='editTable'
          onSubmit={submit}
          onReset={() => onCancel()}
         
          type="form"
          // request={(params) => {
          //   //let rst = query(params);
            
          //   return new Promise((resolve)=>{
          //     resolve  (values);
              
          //   })
          // }}
          form={{ initialValues: {...values} , labelCol: {span: 4}  } }
         /// <reference path="" />
          formRef={tableref}
          columns={relationColum}
          rowSelection={{}}

          onLoad={()=>{
            document.querySelectorAll(".editTable .ant-btn")[2].innerHTML='取消';  

            document.querySelector('.hidecolumn').parentElement.parentElement.parentElement.parentElement.parentElement.hidden=true
            
          }}
        />

      </Modal>
    </div>
  );
};

export default EditForm;
