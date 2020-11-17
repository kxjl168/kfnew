import React, { useState, useEffect, useRef } from 'react';
import { Form, Modal, Button, Input, message } from 'antd';
import { TableListItem, TableListPagination, BackPagination } from './data';
import TextArea from 'antd/lib/input/TextArea';
import { ProColumns } from '@ant-design/pro-table/lib/Table';
import ProTable from '@ant-design/pro-table';
import { useForm } from 'antd/lib/form/util';
import { isnull } from '@/utils/utils';
import { attrColumn } from '@/pages/AttrList/index';


import _ from 'lodash';


import SubAuditForm from '@/pages/SubGraList/components/AuditForm';

import DirAuditForm from '@/pages/DirList/components/AuditForm';

import AttrAuditForm from '@/pages/AttrList/components/AuditForm';

import RelationAuditForm from '@/pages/RelationList/components/AuditForm';

import ClsAuditForm from '@/pages/KgClassList/components/AuditForm';

import EntityAuditForm from '@/pages/EntityList/components/AuditForm';


import AuditGraphic from '@/pages/GraphicO/components/Audit';



export interface EditFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: EditFormData) => void;
  title: string;
  values?: Partial<TableListItem>;
  columns: ProColumns<TableListItem>[];

  //    //'1:领域，2：目录，3概念，4属性，5关系，6实体,7实体关系'，
  dataType: '1' | '2' | '3' | '4' | '5' | '6' | '7';
  modelvalue:any;
  modelvalueOld?:any;
  readonly?:boolean;
}

export interface EditFormData extends Partial<TableListItem> {
  otherdata?: string;
}
const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};
const FormItem = Form.Item;





const AuditForm: React.FC<EditFormProps> = (props) => {

  const [form] = Form.useForm();

  //const [modelvalue,setModelValue]=useState<any>({});

  // if (values) {
  //   setFormVals({
  //     clsName: values.clsName,
  //     version: values.version,
  //     sort: values.sort,
  //     id: values.id,
  //   })
  // }
  const { modalVisible, onCancel, title, onSubmit, values, dataType ,modelvalue ,modelvalueOld,readonly} = props;
  //console.log("1:" + JSON.stringify(props))


  //console.log("2:" + JSON.stringify(values))

  const tableref = useRef();
  useEffect(() => {


  }
    , [props.modalVisible]);


  useEffect(() => {

  }, []);

  useEffect(() => {

  }, [props.values]);



  const submit = async () => {
    //const fieldsValue = await form.validateFields();


    onSubmit();
  }


  const renderFooter = () => {

    return (
      <>


      </>
    );
  }

  const handerCancel = () => {

 

    onCancel()
  }



  const getEditModel =  () => {

    let editModel = <></>;

  
    try {

     // debugger;

      if (dataType === "1") {
       // modelvalue = await getSub(values.editDataId);

        editModel = <SubAuditForm modalVisible={modalVisible} readonly={readonly} onCancel={
          handerCancel} title={title} value={modelvalue}
          onSubmit={async (success) => {

            if (success) {
              submit();
            }
          }}
        />;
      }

      if (dataType === "2") {
        // modelvalue = await getSub(values.editDataId);
 
      
          editModel = <DirAuditForm modalVisible={modalVisible} readonly={readonly} onCancel={
            handerCancel} title={title} value={modelvalue}
            onSubmit={async (success) => {
  
              if (success) {
                submit();
              }
            }}
          />;
       }

      if (dataType === "3") {
      //  modelvalue = await getCls(values.editDataId);


      
          editModel = <ClsAuditForm modalVisible={modalVisible} readonly={readonly} onCancel={
            handerCancel} title={title} value={modelvalue}
            onSubmit={async (success) => {
  
              if (success) {
                submit();
              }
            }}
          />;
      }


      if (dataType === "4") {
        // modelvalue = await getSub(values.editDataId);
 
         editModel = <AttrAuditForm modalVisible={modalVisible} readonly={readonly} onCancel={
           handerCancel} title={title} value={modelvalue}
           onSubmit={async (success) => {
 
             if (success) {
               submit();
             }
           }}
         />;
       }

       
      if (dataType === "5") {
        // modelvalue = await getSub(values.editDataId);
 
         editModel = <RelationAuditForm modalVisible={modalVisible} readonly={readonly} onCancel={
           handerCancel} title={title} value={modelvalue}
           onSubmit={async (success) => {
 
             if (success) {
               submit();
             }
           }}
         />;
       }



      if (dataType === "6") {
       // modelvalue = await getEntity(values.editDataId);

      
          editModel = <EntityAuditForm modalVisible={modalVisible} readonly={readonly} onCancel={
            handerCancel} title={title} value={modelvalue}
            onSubmit={async (success) => {
  
              if (success) {
                submit();
              }
            }}
          />;
      }
      if (dataType === "7") {

        editModel=

          <AuditGraphic modalVisible={modalVisible} showState ={readonly?"auditDone":"audit"}   onCancel={
          handerCancel} title={title} value={modelvalue}
          onSubmit={async (success) => {

            if (success) {
              submit();
            }
          
          }}
        />;
      }

    } catch (error) {

    }

    return editModel;
  }


  return <>
    {getEditModel()}
  </>


};

export default AuditForm;
