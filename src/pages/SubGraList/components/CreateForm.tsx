import React, { useRef } from 'react';
import { Modal, Button } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { FormInstance } from 'antd/lib/form';
import { TableListItem } from '../data';
import {subCol} from '../index';

interface CreateFormProps {
  title: string;
  modalVisible: boolean;
  onCancel: () => void;
  columns:ProColumns<TableListItem>[] ;
  onSubmit: (data) => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel,title,columns,onSubmit } = props;

  const tableref=useRef<FormInstance>();


  const submit = async () => {
    const data = await tableref.current?.validateFields();

    //setFormVals({ ...formVals, ...fieldsValue });

    onSubmit({ ...data });
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
     <ProTable
         
         formRef={tableref}
         form={{  labelCol: {span: 4}  } }
         rowKey="key"
         type="form"
      
         columns={subCol}
         rowSelection={{}}
       />
    </Modal>
  );
};

export default CreateForm;
