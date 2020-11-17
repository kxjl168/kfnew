import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Input } from 'antd';
import { TableListItem, TableListPagination, BackPagination } from './data.d';

export interface EditFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: EditFormData) => void;
  title: string;
  values: Partial<TableListItem>;
}

export interface EditFormData extends Partial<TableListItem> {
  otherdata?: string;
}
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};
const FormItem = Form.Item;



const renderContent = () => {
  // if (currentStep === 1) {
  return (
    <>
    
    
      <FormItem name="clsName" label="概念名称" rules={[{ required: true, message: '名称不能为空' }]}>
        <Input placeholder="请输入" />
      </FormItem>
      <FormItem name="version" label="版本" rules={[{ required: true, message: '版本示例1.0.0', pattern: /^\d+\.\d+.\d+$/g }]}>
        <Input placeholder="请输入" />
      </FormItem>
      <FormItem name="sort" label="序号" rules={[
        {
          required: true,
          message: '序号为数字',
          pattern: /^\d+$/g,
        },
      ]} >
        <Input placeholder="请输入" />
      </FormItem>
    </>
  );
};




const EditForm: React.FC<EditFormProps> = (props) => {

  const [form] = Form.useForm();

  // if (values) {
  //   setFormVals({
  //     clsName: values.clsName,
  //     version: values.version,
  //     sort: values.sort,
  //     id: values.id,
  //   })
  // }
  const { modalVisible, onCancel, title, onSubmit, values } = props;
  console.log("1:" + JSON.stringify(props))
  

  console.log("2:" + JSON.stringify(values))


  useEffect(() => {

    if (form && !modalVisible) {
      console.log("reset form");
      form.resetFields();
    }
  }, [props.modalVisible]);

  useEffect(() => {
    if (values) {

      console.log('3'+JSON.stringify(values));
      form.setFieldsValue({
        ...values,

      });
    }
  }, [props.values]);



  const submit = async () => {
    const fieldsValue = await form.validateFields();

    //setFormVals({ ...formVals, ...fieldsValue });

    onSubmit({ id:values.id, ...fieldsValue });
  }


  const renderFooter = () => {

    return (
      <>

        <Button onClick={() => onCancel()}>取消</Button>
        <Button type="primary" onClick={() => submit()}>
          保存
           </Button>
      </>
    );
  }

  return (
    <div>
      <div>MYMYMY</div>
      <Modal
        destroyOnClose
        title={title}
        visible={modalVisible}
        onCancel={() => onCancel()}
        footer={renderFooter()}
      >
        <Form
          onSubmitCapture={submit}
          {...formLayout}
          form={form}

        >
          {renderContent()}
        </Form>

      </Modal>
    </div>
  );
};

export default EditForm;
