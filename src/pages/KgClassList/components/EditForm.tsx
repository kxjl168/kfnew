import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input } from 'antd';
import { TableListItem, TableListPagination, BackPagination } from '../data.d';
import TextArea from 'antd/lib/input/TextArea';
import { ProColumns } from '@ant-design/pro-table/lib/Table';
import ProTable from '@ant-design/pro-table';
import { useForm } from 'antd/lib/form/util';
import { clsColumn as tabColumn } from '@/pages/KgClassList/index';
import { isnull } from '@/utils/utils';
import MoreAttr from '@/components/MyCom/MoreAttr';


export interface EditFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: EditFormData) => void;
  title: string;
  values: Partial<TableListItem>;
  columns: ProColumns<TableListItem>[];
}

export interface EditFormData extends Partial<TableListItem> {
  otherdata?: string;
}
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};
const FormItem = Form.Item;


/**
 * 实体提交前的修改
 * @param valueinput 
 * @param clsattrs 
 * @param values 
 */
export const modifyValueBeforeCommit=(valueinput:any,clsattrs:any)=>{
  const value=_.cloneDeep(valueinput);
  if (!isnull(value.parentId))
  value.parentId = value.parentId.value;

if (!isnull(value.attrs))
  value.attrs = value.attrs.toString();

if (!isnull(value.dirId)) {
  value.dirId = value.dirId.toString();

}

value.properties = JSON.stringify(clsattrs);

return value;
}


const EditForm: React.FC<EditFormProps> = (props) => {

  const form = useRef<FormInstance>();
  const attrRefForm = useRef<MoreAttrRefActionType>();

  // if (values) {
  //   setFormVals({
  //     clsName: values.clsName,
  //     version: values.version,
  //     sort: values.sort,
  //     id: values.id,
  //   })
  // }
  const { modalVisible, onCancel, title, onSubmit, values, columns } = props;
  //console.log("1:" + JSON.stringify(props))


  //console.log("2:" + JSON.stringify(values))

 
  useEffect(() => {

    if (form && !modalVisible) {
      //s console.log("reset form");
     // form.resetFields();
    }
  }, [props.modalVisible]);

  useEffect(() => {
    if (values) {

      
     
    }
  }, [props.values]);



  const submit = async (shoulclose) => {
    const value = await form.current?.validateFields();

    const clsattrs = await attrRefForm.current?.validateForm();

    if (!clsattrs)
      return;

      const nval=modifyValueBeforeCommit(value,clsattrs);


    onSubmit({ id: values.id, ...nval });
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
            onSubmit={submit}
            onReset={() => onCancel()}

            type="form"
            // request={(params) => {
            //   //let rst = query(params);

            //   return new Promise((resolve)=>{
            //     resolve  (values);

            //   })
            // }}
            form={{ initialValues: { ...values }, labelCol: { span: 4 } }}
            /// <reference path="" />
            formRef={form}
            columns={tabColumn(values.disableList)}
            rowSelection={{}}

            onLoad={() => {
              document.querySelectorAll(".editTable .ant-btn")[3].innerHTML = '取消';

            }}
          />

          <MoreAttr  showAddDom={true} ref={attrRefForm} labelCol={ { span: 4 }} InitAttrs={values.properties} BtnTitle="添加概念额外属性"  />
        </>

      </Modal>
    </div>
  );
};

export default EditForm;
