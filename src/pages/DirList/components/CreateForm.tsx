import React, { useRef, useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { clsColumn as tabColumn } from '../index';
import { isnull } from '@/utils/utils';
import { MinusOutlined } from '@ant-design/icons';
import { get as getAttr } from '@/pages/AttrList/service';

import _ from 'lodash';
import AttrSelect from '@/components/MyCom/AttrSelect';
import MoreAttr, { MoreAttrRefActionType } from '@/components/MyCom/MoreAttr';
import { FormInstance } from 'antd/lib/form';

interface CreateFormProps {
  title: string;
  modalVisible: boolean;
  onCancel: () => void;
  values?: any;//默认值
  hideAddMore?: boolean;
}

const { Item } = Form;

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, title, onSubmit, values, hideAddMore } = props;


  const [attrModalvisible, setattrModalvisible] = useState<boolean>(false);

  const [attrs, setAttrs] = useState<any[]>([]);

  const [attrSval, setattrSval] = useState<any>();

  const form = useRef<FormInstance>();
  const attrRefForm = useRef<MoreAttrRefActionType>();

  const submit = async (shouldclose) => {
    const value = await form.current?.validateFields();

   // const clsattrs = await attrRefForm.current?.validateForm();

   // if (!clsattrs)
   //   return;

    if (!isnull(value.parDirId))
      value.parDirId = value.parDirId.value;

    if (!isnull(value.attrs))
      value.attrs = value.attrs.toString();

    if (!isnull(value.dirId)) {
      value.dirId = value.dirId.toString();

    }

    onSubmit({ ...value, shouldclose: shouldclose });
  }

  // useEffect(()=>{

  //   if(!isnull(values))
  //   console.log(values.disableList);
  // },[values])

  const renderFooter = () => {

    return (
      <>
        {!hideAddMore &&
          <Button type="dashed" onClick={() => submit(false)}>
            保存并继续
        </Button>
        }
        <Button type="primary" onClick={() => submit(true)}>
          保存
        </Button>
        <Button onClick={() => onCancel()}>取消</Button>

      </>
    );
  };




  return (
    <>
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


            formRef={form}
            form={{ initialValues: { ...values }, labelCol: { span: 4 } }}
            rowKey="key"
            type="form"
            title="新建语境"
            columns={tabColumn(values?values.disableList:[])}
            rowSelection={{}}
          />

          {/* <MoreAttr  showAddDom={true} ref={attrRefForm} labelCol={ { span: 4 }} BtnTitle="添加语境额外属性" /> */}

        </>

      </Modal>





    </>

  );
};

export default CreateForm;
