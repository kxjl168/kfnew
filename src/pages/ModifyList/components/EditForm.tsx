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


import SubCompEditForm from '@/pages/SubGraList/components/EditCompareForm';


import DirEditForm from '@/pages/DirList/components/EditForm';
import DirCompEditForm from '@/pages/DirList/components/EditCompareForm';
import { handleUpdate as handleDirUpdate } from '@/pages/DirList/index';


import AttrCompEditForm from '@/pages/AttrList/components/EditCompareForm';


import ClsEditForm from '@/pages/KgClassList/components/EditCompareForm';

import RelationCompEditForm from '@/pages/RelationList/components/EditCompareForm';


import EntityEditForm from '@/pages/EntityList/components/EditCompareForm';

import AuditGraphic from '@/pages/GraphicO/components/Audit/index';



export interface EditFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onSubmit: (data: EditFormData) => void;
  title: string;


  //    //'1:领域，2：目录，3概念，4属性，5关系，6实体,7实体关系'，
  dataType: '1' | '2' | '3' | '4' | '5' | '6' | '7';
  modelvalue:any;
 
  showinfo?:boolean;
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

  //const [modelvalue,setModelValue]=useState<any>({});

  // if (values) {
  //   setFormVals({
  //     clsName: values.clsName,
  //     version: values.version,
  //     sort: values.sort,
  //     id: values.id,
  //   })
  // }
  const { modalVisible, onCancel, title, onSubmit,  dataType ,modelvalue ,showinfo} = props;
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

        editModel = <SubCompEditForm modalVisible={modalVisible} showinfo={showinfo} onCancel={
          handerCancel} title={title} value={modelvalue }
          onSubmit={async (success) => {

            if (success) {
              submit();
            }
          }}
        />;
      }

      if (dataType === "2") {
        // modelvalue = await getSub(values.editDataId);
 
      
          editModel = <DirCompEditForm modalVisible={modalVisible} showinfo={showinfo} onCancel={
            handerCancel} title={title} value={modelvalue }
            onSubmit={async (success) => {
  
              if (success) {
                submit();
              }
            }}
          />;
       }

      if (dataType === "3") {
      //  modelvalue = await getCls(values.editDataId);


     
          editModel = <ClsEditForm modalVisible={modalVisible} showinfo={showinfo} onCancel={
            handerCancel} title={title} value={modelvalue }
            onSubmit={async (success) => {
  
              if (success) {
                submit();
              }
            }}
          />;
      }


      if (dataType === "4") {
        //  modelvalue = await getCls(values.editDataId);
  
  
         
        editModel = <AttrCompEditForm modalVisible={modalVisible} showinfo={showinfo} onCancel={
          handerCancel} title={title} value={modelvalue }
          onSubmit={async (success) => {

            if (success) {
              submit();
            }
          }}
        />;
        }

        if(dataType==="5")
        {
          
          editModel = <RelationCompEditForm modalVisible={modalVisible} showinfo={showinfo} onCancel={
            handerCancel} title={title} value={modelvalue }
            onSubmit={async (success) => {
  
              if (success) {
                submit();
              }
            }}
          />;
        }



      if (dataType === "6") {
       // modelvalue = await getEntity(values.editDataId);

     
          editModel = <EntityEditForm modalVisible={modalVisible} showinfo={showinfo} onCancel={
            handerCancel} title={title} value={modelvalue }
            onSubmit={async (success) => {
  
              if (success) {
                submit();
              }
            }}
          />;
      }


      if (dataType === "7") {
        // modelvalue = await getEntity(values.editDataId);
 
      
           editModel = <AuditGraphic modalVisible={modalVisible} showState ={showinfo?"toaudit":"modify"} onCancel={
             handerCancel} title={title} value={modelvalue }
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

export default EditForm;
