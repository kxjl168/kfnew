import React, { useRef, useState } from 'react';
import { Modal, Button } from 'antd';
import ProTable from '@ant-design/pro-table';

import { attrColumn } from '@/pages/AttrList/index';
import { isnull } from '@/utils/utils';
import { values } from 'lodash';

interface CreateFormProps {
  title: string;
  modalVisible: boolean;
  onCancel: () => void;
  hideAddMore?:boolean;
  values?:any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel,title,onSubmit,hideAddMore,values } = props;

const form =useRef();


const [showCls, SetShowCls] = useState<boolean>(false);

  const submit = async (shouldclose) => {
    const value = await form.current.validateFields();
  
  
  
     if (!isnull(value.clsId)) {
       value.clsId = JSON.stringify( value.clsId);

      }
   
    //  if (!isnull(value.subKgId)) {
    //   value.subKgName = value.subKgId.label; 
    //   value.subKgId = value.subKgId.value;
       
    //  }
    onSubmit({  ...value,shouldclose:shouldclose });
  }
  
  const renderFooter = () => {
  
    return (
      <>
      {!hideAddMore &&
       <Button type="primary" onClick={() => submit(false)}>
         保存并继续
        </Button>
  }
        <Button type="dashed" onClick={() => submit(true)}>
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
     <ProTable
          
        
          formRef={form}
         
          
          form={{initialValues:{...values}, labelCol: {span: 5} }}
          rowKey="key"
          type="form"
          title="新建属性"
          columns={attrColumn(true,showCls, SetShowCls)}
          rowSelection={{}}
        />
    </Modal>
  );
};

export default CreateForm;
