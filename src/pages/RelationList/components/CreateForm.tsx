import React, { useRef } from 'react';
import { Modal, Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import { isnull } from '@/utils/utils';
import { relationColum } from '@/pages/RelationList/index';
interface CreateFormProps {
  title: string;
  modalVisible: boolean;
  onCancel: () => void;

  onSubmit: (data: EditFormData) => void;
  hideAddMore?:boolean;
  values?:any;
}

export interface EditFormData extends Partial<TableListItem> {
  otherdata?: string;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, title, onSubmit ,hideAddMore,values} = props;


  const form = useRef();


  const submit = async (shouldclose) => {
    const value = await form.current.validateFields();





    if (!isnull(value.equivalence) && (value.equivalence instanceof Object))
      value.equivalence = JSON.stringify(value.equivalence);//.toString();
    if (!isnull(value.reverse) && (value.reverse instanceof Object))
      value.reverse = JSON.stringify(value.reverse);//.toString();


    if (!isnull(value.attrs) && (value.attrs instanceof Object))
      value.attrs = value.attrs.toString();


    onSubmit({ ...value, shouldclose: shouldclose });
  }

  const renderFooter = () => {

    return (
      <>
        {!hideAddMore &&
        <Button type="dashed" onClick={() => submit(false)}>
          保存并继续
        </Button>
  }
        <Button  type="primary" onClick={() => submit(true)}>
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
      {props.children}
      <ProTable
           formRef={form}
        
        onSubmit={submit}
        form={{initialValues:{...values}, labelCol: { span: 4 } }}
        rowKey="key"
        type="form"
        onReset={() => onCancel()}
        columns={relationColum}
        rowSelection={{}}
        onLoad={() => {


          document.querySelector('.hidecolumn').parentElement.parentElement.parentElement.parentElement.parentElement.hidden = true

        }}
      />
    </Modal>
  );
};

export default CreateForm;
