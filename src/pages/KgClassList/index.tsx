import { DownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Button, Divider, Dropdown, Menu, message, Input, Row, Col, Tooltip, Modal, Alert } from 'antd';
import React, { useState, useRef, cloneElement, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import { deepClone, isnull } from '@/utils/utils';
import { IconFontNew } from '@/components/MyCom/KIcon';

import EditForm, { EditFormData } from './components/EditForm';

import TestDom from './components/SelfEditFormtsx';

import ClsSelect from '@/components/MyCom/ClsSelect';

import ClsTree, { TreeActionType } from '@/components/MyCom/ClsTree';


import SubGraSelect from '@/components/MyCom/SubGraSelect';

import AttrSelect, { Itemdata } from '@/components/MyCom/AttrSelect';


import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, BackPagination } from './data.d';
import { get as getCls, query, update, add, remove } from './service';
import { PaginationProps } from 'antd/lib/pagination';

import styles from './style.less';
import DataImport from '@/components/MyCom/DataImport';
import { values } from 'lodash';
import MergeForm from './components/MergeForm';
import { MyEditObj } from '../ModifyList/data';
import DataLogTable from '@/components/MyCom/DataLogTable';
import EditCompareForm from './components/EditCompareForm';

import  EditGraphic from '../GraphicO/components/Edit';
import AuditGraphic from '../GraphicO/components/Audit';
import { QDATA } from '../GraphicO/components/KoniMain/KoniPanel';


/**
 * 添加节点
 * @param fields
 */
export const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    let rst = await add({ ...fields });
    if (rst && rst.success) {
      hide();
      message.success('添加成功');
      return true;
    }
    else {
      return false;
    }
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
export const handleUpdate = async (fields: TableListItem) => {
  const hide = message.loading('正在配置');
  try {
    let rst = await update(fields);
    if (rst && rst.success) {
      hide();

      message.success('配置成功');
      return true;
    }
    else {
      return false;
    }
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    let ids = selectedRows.map((row) => row.id);
    // console.log(ids.toString());
    // return;

    await remove(
      ids
    );
    hide();
    message.success('删除成功，即将刷新');

    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

export const clsColumn = (dislist): TableListItem[] => {
  const [querySubId, setQuerySubId] = useState<any>();

  const [disableList, setdisableList] = useState<any>();

  // useEffect(() => {

  //   setTimeout(() => {
  //     setdisableList(dislist);
  //   }, 50);

  // }, [dislist])

  return ([
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },
    {
      index: 3,
      title: '概念名称',
      className:'namewidth',
      dataIndex: 'clsName',
      rules: [
        {
          required: true,
          message: '概念名称为必填项',
        },
      ],

      renderText: (val: string, record) => {

        if (!isnull(record.myEdit)) {

          const edits = JSON.parse(record.myEdit);

          const dom = edits.map((editObj: MyEditObj) => {
            // console.log(editObj);
            if (editObj.editAction === "1") {

              if (editObj.dataType === '7')
              return <Tooltip title={`存在${editObj.auditState === "1" ? '本地' : '待审核'}关系修改`} placement="topLeft" ><span><IconFontNew type="icon-btn-relation" /> {editObj.auditState === "2" && <IconFontNew type="icon-time" />}</span></Tooltip>;


              return <Tooltip title={`存在${editObj.auditState === "1" ? '本地' : '待审核'}新增版本`} placement="topLeft" ><span><IconFontNew type="icon-btn-add" /> {editObj.auditState === "2" && <IconFontNew type="icon-time" />} </span></Tooltip>;
            }
            if (editObj.editAction === "2") {

              if (editObj.dataType === '7')
                return <Tooltip title={`存在${editObj.auditState === "1" ? '本地' : '待审核'}关系修改`} placement="topLeft" ><span><IconFontNew type="icon-btn-relation" /> {editObj.auditState === "2" && <IconFontNew type="icon-time" />}</span></Tooltip>;

              return <Tooltip title={`存在${editObj.auditState === "1" ? '本地' : '待审核'}修改版本`} placement="topLeft" ><span><IconFontNew type="icon-modify" /> {editObj.auditState === "2" && <IconFontNew type="icon-time" />}</span></Tooltip>;
            }
            if (editObj.editAction === "3") {
              return <Tooltip title={`存在${editObj.auditState === "1" ? '本地' : '待审核'}删除版本`} placement="topLeft" ><span><IconFontNew type="icon-btn-modify-close" /> {editObj.auditState === "2" && <IconFontNew type="icon-time" />}</span></Tooltip>;
            }
            return <></>;
          });
          return <> {dom}{val}</>;

        }

        return <>{val}</>;
      }


    },
    {
      index: 1,
      title: '所属领域',
      className: 'subwidth',
      dataIndex: 'dirId', //领域
      hideInForm: false,
      hideInSearch: true,
      hideInTable: false,
      rules: [{
        required: true,
        message: '选择归属领域',
      }
      ]
      ,
      renderText: (val, record) => {
        return record.subNames;
      },
      renderFormItem: (_, config, form) => {

        const { type, defaultRender, onChange, ...rest } = config;

        // const ids = form.getFieldValue('dirId');
        // const names = form.getFieldValue('subName');




        // let sval:any[]=[];
        // if(ids instanceof Object)
        // {
        //   sval=[ids];
        // }
        // else if(!isnull(ids)){

        //      sval.push({label:names,text:names,value:ids,key:ids});
        //      form.setFieldsValue({"dirId":sval[0]});
        // }

        const ids = form.getFieldValue('subIds');
        const names = form.getFieldValue('subNames');
        /// console.log(ids)


        let sval: any[] = [];
        if (ids instanceof Array) {
          sval = ids;
        }
        else if (!isnull(ids)) {

          let idlist: string[] = ids.split(",");
          let namelist: string[] = names.split(",");
          for (let index = 0; index < idlist.length; index++) {
            sval.push({ text: namelist[index], value: idlist[index] });
          }

          form.setFieldsValue({ "dirId": ids, "subIds": sval });
          setQuerySubId(ids);
        }


        if (!type) {//query
          return (
            <>
              <SubGraSelect labelInValue={false} selectVal={sval} placeholder="请选择领域" onChange={(v, selectItem) => {

                //console.log(JSON.stringify(selectItem));
                //setClsNameval(selectItem[0].text);

                if (onChange)
                  onChange(v);

              }} />
            </>
          )
        }



        return (
          <>
            <SubGraSelect defaultSelectAll config={{ mode: "multiple" }} mutiSelect={true} labelInValue={false} selectVal={sval} placeholder="请选择领域" onChange={(v, selectItem) => {

              //console.log(JSON.stringify(selectItem));
              //setClsNameval(selectItem[0].text);

              if (onChange)
                onChange(v);

              setQuerySubId(v);

            }} />
          </>
        )

      }
    },
   
    {
      index: 2,
      title: '上级概念',
      dataIndex: 'parentId', //领域
      hideInForm: false,
      hideInSearch: true,
      hideInTable: false,
      rules: [{
        required: false,
        message: '选择上级概念',
      },
      ({ getFieldValue }) => ({
        validator(rule, value) {
          //  debugger;
          if (value && getFieldValue('id') === value.key) {
            return Promise.reject('上级概念不能与自己相同');
          }

          return Promise.resolve();
        },
      }),
      ]
      ,
      renderText: (val, record) => {
        return record.parentName ? record.parentName : '-';
      },
      renderFormItem: (_, { value, type, defaultRender, onChange, ...rest }, form) => {
        const ids = form.getFieldValue('parentId');



        const names = form.getFieldValue('parentName');
        /// console.log(ids)

        let sval: any[] = [];
        if (ids instanceof Object) {
          sval = [ids];
        }
        else if (!isnull(ids)) {

          if (ids !== "0")
            // let idlist:string[] = ids.split(",");
            // let namelist:string[] = names.split(",");
            // for (let index = 0; index < idlist.length; index++) {
            sval.push({ label: names, text: names, value: ids, key: ids });
          // }
          form.setFieldsValue({ "parentId": sval[0] });

          //  //获取上级概念的所有属性
          //  let clsData = await getCls(sval[0]);

          //  if (clsData && clsData.success && clsData.data) {

          //    setdisableList(clsData.data.attrs);

          //  }
        }

        if (!type) {
          //query
          // form.setFieldsValue({'parentId':queryParent});
          //value=queryParent;
        }

        return (
          <>
            <ClsSelect subKgId={querySubId} labelInValue={true} selectVal={sval} placeholder="请选择上级概念" onChange={async (v, selectItem) => {

              //console.log(JSON.stringify(selectItem));
              //setClsNameval(selectItem[0].text);

              if (onChange)
                onChange(v);

              if(v)
              {
              //获取上级概念的所有属性
              let clsData = await getCls(v.key);

              if (clsData && clsData.success && clsData.data) {
                form.setFieldsValue({
                  attrs: clsData.data.attrs,
                  attrNames: clsData.data.attrNames,
                })

                setdisableList(clsData.data.attrs);

              }
            }
            else{
              // form.setFieldsValue({
              //   attrs: "",
              //   attrNames: "",
              // })
              // setdisableList([]);
            }


            }} />
          </>
        )

      }
    },


    {
      index: 2,
      title: '实体属性',
      dataIndex: 'attrs', //领域
      hideInForm: false,
      hideInSearch: true,
      hideInTable: true,
      rules: [{
        required: false,
        message: '选择属性',
      },

      ]
      ,

      renderFormItem: (_, { type, defaultRender, onChange, ...rest }, form) => {
        const ids = form.getFieldValue('attrs');
        const names = form.getFieldValue('attrNames');
        /// console.log(ids)

        let sval: any[] = [];
        if (ids instanceof Array) {
          sval = ids;
        }
        else if (!isnull(ids)) {

          let idlist: string[] = ids.split(",");
          let namelist: string[] = names.split(",");
          for (let index = 0; index < idlist.length; index++) {
            sval.push({ text: namelist[index], value: idlist[index] });
          }

        }

        let ishiddenAddBtn = false;
        if (!type)
          ishiddenAddBtn = true;

        //const label = form.getFieldValue('clsName');
        //  console.log("clsId:"+id);
        // console.log( form.getFieldValue('groupId'))

        return (
          <>
            <AttrSelect disableAttrList={disableList} config={{ mode: "multiple" }} mutiSelect={true} labelInValue={false} ishiddenAddBtn={ishiddenAddBtn} selectVal={sval} placeholder="请选择或输入查询属性" onChange={(v, selectItem) => {

              //console.log(JSON.stringify(selectItem));
              //setClsNameval(selectItem[0].text);

              if (onChange)
                onChange(v);

            }} />
          </>
        )

      }
    },



    {
      title: '描述',
      dataIndex: 'remark',
      valueType: 'textarea',
      hideInSearch: false,
      hideInTable: true,
      hideInForm: false,
      rules: [
        {
          required: false,
          max: 500,
          message: '描述超长',

        },
      ],
      renderText: (val: string) => {
        if (val && val.length > 20)
          return <><div title={val}>{val.substr(0, 20) + "..."}</div></>;
        else return val;
      }
    },


    {
      title: '排序',
      dataIndex: 'sort',
      // sorter: false,
      hideInSearch: true,
      hideInForm: false,
      initialValue: '1',
      rules: [
        {
          required: false,
          message: '序号为数字',
          pattern: /^\d+$/g,
        },
      ],

      renderText: (val: string) => val,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      hideInForm: true,
      hideInSearch: true,
      hideIntable: true,
      valueEnum: {
        0: { text: '停用', status: 'Error' },
        1: { text: '启用', status: 'Default' },

      },
    },
    {
      title: '删除状态',
      dataIndex: 'deleted',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
      valueEnum: {
        0: { text: '正常', status: 'Error' },
        1: { text: '已删除', status: 'Default' },

      },
    },
    {
      title: '版本',
      hideInSearch: true,
      dataIndex: 'versionId',
      //initialValue:'1.0.0',
      rules: [
        {
          required: true,
          message: '版本示例1.0.0',
          pattern: /^\d+\.\d+.\d+$/g
        },
      ],
      renderFormItem: (_, { type, defaultRender, onChange, ...rest }, form) => {
        const versionId = form.getFieldValue('versionId');

        let dval = "1.0.0";
        if (!isnull(versionId)) {
          dval = versionId
        }
        else {
          //初始空值
          form.setFieldsValue({ versionId: dval });
        }

        return (<>
          <Input defaultValue={dval} onChange={onChange} />
        </>)
      }

    },
  ])
};

const TableList: React.FC<{}> = (props) => {
  const [sorter, setSorter] = useState<string>('');
  const [pagination, setPagination] = useState<BackPagination>({ pageNo: 1, pageSize: 10 });
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();
  const [clsNameval, setClsNameval] = useState<string>("");

  //新建默认值
  const [createDefaultValues, SetCreateDefaultValues] = useState<TableListItem>({});

  const [uploadVisible, setuploadVisible] = useState<boolean>(false);

  const [mergeVisible, setmergeVisible] = useState<boolean>(false);
  const [mergeDefaultValues, setmergeDefaultValues] = useState<any>({});


  const [queryParent, SetQueryParent] = useState<string>("");
  const [querySubId, SetquerySubId] = useState<string>("");

  //树上选中的cls
  const [treeSelecCls, SettreeSelecCls] = useState<TableListItem>({});

  const treeRef = useRef<TreeActionType>();

  const [expandedRowKeys,setexpandedRowKeys]=useState<string[]>([]);
  const getExpandedRow=(record)=>{
    return <DataLogTable dataId={record.id} />;
  }


  const [frelationModalVisible, handlefrelationModalVisible] = useState<boolean>(false);
  
  const [frelationModalvalue, setfrelationModalvalue] = useState<QDATA>();


  const [relationModalVisible, handlerelationModalVisible] = useState<boolean>(false);
  const [relationModalShowinfo, handlerelationModalShowinfo] = useState<boolean>(false);
  const [relationModalvalue, setrelationModalvalue] = useState<MyEditObj>();

    
  const [compareModalVisible, handlecompareModalVisible] = useState<boolean>(false);
  const [compareModalShowinfo, handlecompareModalShowinfo] = useState<boolean>(false);
  const [compareModalvalue,setcompareModalvalue]=useState<{editDataId:string,editOriDataId:string,editAction:string}>();





  const refreshTree = (id?: string) => {
    if (treeRef.current) {

      if (!isnull(id)) {
        treeRef.current.refreshNode(id);
        return;
      }

      if (!isnull(treeSelecCls)) {
        treeRef.current.refreshNode(treeSelecCls.id);
      }
      else
        treeRef.current.reloadTree("0");
    }


  }





  const getAction = (record, edits) => {
    let dom = <></>;

    const editModify = (editObj) => <>
      <a
        onClick={(e) => {

          setcompareModalvalue({ editDataId: editObj.editDataId, editOriDataId: record.id, editAction: editObj.editAction });
          handlecompareModalShowinfo(false);

          handlecompareModalVisible(true);

          e.stopPropagation();
        }}
      >
        <Tooltip title="编辑改动">
          <IconFontNew type="icon-btn-edit" title="编辑" />
        </Tooltip>
      </a>
      <Divider type="vertical" />
    </>;

    const showeditDetail = (editObj) => <>
      <a
        onClick={(e) => {

          setcompareModalvalue({ editDataId: editObj.editDataId, editOriDataId: record.id, editAction: editObj.editAction });
          handlecompareModalShowinfo(true);
          handlecompareModalVisible(true);

          e.stopPropagation();

        }}
      >
        <Tooltip title="查看改动">
          <IconFontNew type="icon-detail" />
        </Tooltip>
      </a>
      <Divider type="vertical" />
    </>;

    const normalEditAttr = () => <>

      <a
        onClick={async (e) => {
          e.stopPropagation();
          await handleModify(record);

        }}
      >
        <Tooltip title="编辑属性">
          <IconFontNew type="icon-btn-edit" title="编辑属性" />
        </Tooltip>
      </a>
      <Divider type="vertical" />

    </>;

    const getAttrDom = (edits) => {

      if (edits === '[]')
        return normalEditAttr();

      const editObjEntity = _.find(edits, item => {
        return item.dataType === '3'
      })
      const editObjRelation = _.find(edits, item => {
        return item.dataType === '7'
      })

      let dom = <></>;



      if (!isnull(editObjEntity) && editObjEntity.auditState === '1' && (editObjEntity.editAction === "1" || editObjEntity.editAction === '2'))
        dom = editModify(editObjEntity);


      if (!isnull(editObjEntity) && (editObjEntity.editAction === "3" || editObjEntity.auditState === '2'))
        dom = showeditDetail(editObjEntity)

      if (isnull(editObjEntity) && !isnull(editObjRelation))
        dom = normalEditAttr();

      return dom;
    }


    const getLevelOneRelation = () =>
      <>
        <a
          onClick={(e) => {
   
            //页面跳转
           // props.history.push('/kg/graphic?graphicType=entity&level=1&id=' + record.id);

    //全屏model

           setfrelationModalvalue({ level:1,id:record.id,gtype:'cls',showEdit:true });
         
           handlefrelationModalVisible(true);

            e.stopPropagation();
          }}
        >
          <Tooltip title="编辑关系">
            <IconFontNew type="icon-btn-relation" title="编辑关系" />
          </Tooltip>
        </a>
        <Divider type="vertical" />
      </>

    const getLevelTwoRelation = () =>
      <>
        <a
          onClick={(e) => {


          //  props.history.push('/kg/graphic?graphicType=entity&level=2&id=' + record.id);

          setfrelationModalvalue({ level:2,id:record.id,gtype:'cls',showEdit:true });
         
          handlefrelationModalVisible(true);


            e.stopPropagation();
          }}
        >
          <Tooltip title="编辑关系(二层关系)">
            <IconFontNew type="icon-btn-more-node" title="编辑关系" />
          </Tooltip>
        </a>
        <Divider type="vertical" />
      </>

    const editRelation = (editObj) => <>
      <a
        onClick={(e) => {

          handlerelationModalShowinfo(false);

        //  debugger;
          setrelationModalvalue({ id:editObj.id, editDataId: editObj.editDataId, editOriDataId: record.id, editAction: editObj.editAction });
         
          handlerelationModalVisible(true);

          e.stopPropagation();
        }}
      >
        <Tooltip title="编辑关系改动">
          <IconFontNew type="icon-btn-relation"  />
        </Tooltip>
      </a>
      <Divider type="vertical" />
    </>;

    const showRelationDetail = (editObj) => <>
      <a
        onClick={(e) => {
          handlerelationModalShowinfo(true);
          setrelationModalvalue({ id:editObj.id, editDataId: editObj.editDataId, editOriDataId: record.id, editAction: editObj.editAction });
       
          handlerelationModalVisible(true);

          e.stopPropagation();

        }}
      >
        <Tooltip title="查看关系改动">
          <IconFontNew type="icon-btn-relation" />
        </Tooltip>
      </a>
      <Divider type="vertical" />
    </>;


    const getRelationDom = (edits) => {

      if (edits === '[]')
        return <>{getLevelOneRelation()}</>;

      const editObjEntity = _.find(edits, item => {
        return item.dataType === '3'
      })
      const editObjRelation = _.find(edits, item => {
        return item.dataType === '7'
      })

      let dom = <></>;

      if (!isnull(editObjRelation) && editObjRelation.auditState === '1' )
        dom = <>{editRelation(editObjRelation)}</>;


      if (!isnull(editObjRelation) && (editObjRelation.auditState === '2'))
        dom = <>{showRelationDetail(editObjRelation)}</>;

      if (isnull(editObjRelation) && !isnull(editObjEntity))
        dom = <>{getLevelOneRelation()}</>;

      return dom;


    }





    const deletedom = () => <>
      <Popconfirm
        title='确定删除?'
        onConfirm={async (e) => {


          await remove(record.id);
          if (actionRef.current) {
            actionRef.current.reload();
          }

          e.stopPropagation();

        }}
        onCancel={(e) => { e.stopPropagation(); }}
        okText="确定"
        cancelText="取消"
      >
        <a
          href="javascript:void(0)" onClick={(e) => { e.stopPropagation(); }}
        >
          <Tooltip title="删除">
            <IconFontNew type="icon-btn-delete" title="删除" />
          </Tooltip>
        </a>
      </Popconfirm>
    </>


    return <>


      {getAttrDom(edits)}

      {getRelationDom(edits)}


      {deletedom()}


    </>
  }



  const columns: ProColumns<TableListItem>[] = clsColumn().concat([
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {


        let edits = '[]';
        if (record.myEdit !== '[]') {
          edits = JSON.parse(record.myEdit);
        }


        return <>{getAction(record, edits)} </>;




   //     let editObj: MyEditObj = {};
   //     if (record.myEdit)
    //      editObj = JSON.parse(record.myEdit) as MyEditObj;

      
//       return   <>
      
// {!isnull(editObj) && editObj.auditState==='1'&&(editObj.editAction === "1" || editObj.editAction === '2') && (
//             <>
//               <a
//                 onClick={(e) => {

//                   setcompareModalvalue({ editDataId: editObj.editDataId, editOriDataId: record.id, editAction: editObj.editAction });
//                   handlecompareModalShowinfo(false);

//                   handlecompareModalVisible(true);

//                   e.stopPropagation();
//                 }}
//               >
//                 <Tooltip title="编辑改动">
//                   <IconFontNew type="icon-btn-edit" title="编辑" />
//                 </Tooltip>
//               </a>
//               <Divider type="vertical" />
//             </>
//           )}
//           {!isnull(editObj) && (editObj.editAction === "3" || editObj.auditState === '2') && (
//             <>
//               <a
//                 onClick={(e) => {

//                   setcompareModalvalue({ editDataId: editObj.editDataId, editOriDataId: record.id, editAction: editObj.editAction });
//                   handlecompareModalShowinfo(true);
//                   handlecompareModalVisible(true);

//                   e.stopPropagation();

//                 }}
//               >
//                 <Tooltip title="查看改动">
//                   <IconFontNew type="icon-detail" />
//                 </Tooltip>
//               </a>
//               <Divider type="vertical" />
//             </>
//           )}


// {isnull(editObj) && (
//   <>
//           <a
//             onClick={(e) => {

//               handleModify(record);
              

//               e.stopPropagation();
//             }}
//           >
//             <Tooltip title="编辑概念">
//               <IconFontNew type="icon-btn-edit" title="编辑概念" />
//             </Tooltip>

//           </a>
//           <Divider type="vertical" />
//           </>
// )}

//           <a
//             onClick={(e) => {
//               handleModifyRelation(record);

//               e.stopPropagation();
//             }}
//           >
//             <Tooltip title="编辑关系">
//               <IconFontNew type="icon-btn-relation" title="编辑关系" />
//             </Tooltip>

//           </a>
//           <Divider type="vertical" />

//           <Popconfirm
//             title='确定删除?'
//             onConfirm={
//               (e) => {
//                 handlerDelete(record); 

//                 e.stopPropagation();
//               }

//             }
//             onCancel={(e) => { e.stopPropagation(); }}
//             okText="确定"
//             cancelText="取消"
//           >
//             <a
//               href="#" onClick={(e)=>{   e.stopPropagation();}}
//             >
//               <Tooltip title="删除">
//                 <IconFontNew type="icon-btn-delete" title="删除" />
//               </Tooltip>
//             </a>
//           </Popconfirm>



//         </>
      }
    }]);


  const handleModify = async (record) => {

    let data = deepClone(record) as FormValueType;
    data.title = "编辑概念";


    const hide = message.loading("加载中...");


    let clsrstdata = await getCls(record.id);
    if (clsrstdata && clsrstdata.success && clsrstdata.data)
      data = clsrstdata.data;

    let clsrst = await getCls(record.parentId);
    if (clsrst && clsrst.success && clsrst.data)
      data.disableList = clsrst.data.attrs;




    hide();


    setStepFormValues(data);
    handleUpdateModalVisible(true);
  }

  const handleModifyRelation = (record) => {
   // props.history?.push('/ontology/graphic?id=' + record.id);


    setfrelationModalvalue({ level:1,id:record.id,gtype:'cls',showEdit:true });
         
           handlefrelationModalVisible(true);

  }

  const handlerDelete = async (record) => {



    await remove(record.id);
    if (actionRef.current) {
      actionRef.current.reload();
    }
    refreshTree(record.parentId);



  }


  const uploadComplete = (rst) => {
    if (rst) {
      if (actionRef.current) {
        actionRef.current.reload();
      }

      refreshTree();
    }
  }

  const mergeComplete = (rst, source, target) => {
    if (rst) {
      if (actionRef.current) {
        actionRef.current.reload();
      }

      refreshTree(source);
      refreshTree(target);

      setmergeVisible(false);
    }
    else {
      message.error("操作失败!");
    }
  }


  return (
    <PageHeaderWrapper title={' '}
      content={' '}>
      <Row>
        <Col span="6"  style={{paddingRight:'5px'}}>
          <ClsTree showNodeAction={true} ref={treeRef}

            OnSubKgIdChange={(subid, subname) => {
              SetquerySubId(subid);
              if (actionRef.current)
                actionRef.current.reload();


              SetCreateDefaultValues({

                subIds: subid,
                subNames: subname,

              });
            }}

            OnTreeNodeModifyClsClick={async (v) => {


              let clsrst = await getCls(v.id);
              if (clsrst && clsrst.success && clsrst.data)
                handleModify(clsrst.data);

            }}

            OnTreeMergeClick={(v) => {
              setmergeDefaultValues({
                source: {
                  ...v,
                  name: v.clsName,
                  label: v.clsName,
                  key: v.id,
                  value: v.id
                }
              });
              setmergeVisible(true);

            }
            }

            OnTreeNodeAddNewClsClick={async (v) => {
              let clsrst = await getCls(v.id);
              if (clsrst && clsrst.success && clsrst.data) {
                let clsData = clsrst.data;
                SettreeSelecCls(clsData);

                SetCreateDefaultValues({
                  dirId: clsData.dirId,
                  subName: clsData.subName,

                  subIds: clsData.subIds,
                  subNames: clsData.subNames,

                  disableList: clsData.attrs,


                  parentId: clsData.id,
                  parentName: clsData.clsName,
                  attrNames: clsData.attrNames,
                  attrs: clsData.attrs
                });
                handleModalVisible(true);
              }


            }}

            OnTreeNodeModifyRelationClick={async (v) => {
              let clsrst = await getCls(v.id);
              if (clsrst && clsrst.success && clsrst.data)
                handleModifyRelation(clsrst.data);

            }}

            OnTreeNodeDeleteClsClick={(v) => {
              handlerDelete(v)
            }
            }

            OnTreeNodeClick={async (key, subid, subname, clsData) => {

              SetQueryParent(key);
              SetquerySubId(subid);
              SettreeSelecCls(clsData);
              SetCreateDefaultValues({

                subIds: subid,
                subNames: subname,

              });




              if (clsData) {

                //let clsDetailRst = await getCls(clsData.id);

                SetCreateDefaultValues({
                  dirId: clsData.dirId,
                  subName: clsData.subName,

                  subIds: clsData.subIds,
                  subNames: clsData.subNames,

                  disableList: clsData.attrs,


                  parentId: clsData.id,
                  parentName: clsData.clsName,
                  attrNames: clsData.attrNames,
                  attrs: clsData.attrs
                });

              }


              if (actionRef.current) {
                actionRef.current.reload();
              }
            }

            } />
        </Col>
        <Col span="18">
          <ProTable<TableListItem>
              className="usetrborder nolefticon"
            headerTitle=""
            actionRef={actionRef}
            rowKey="id"
            onChange={(_pagination, _filter, _sorter) => {
              const sorterResult = _sorter as SorterResult<TableListItem>;
              if (sorterResult.field) {
                setSorter(`${sorterResult.field}_${sorterResult.order}`);
              }

              setPagination({
                pageNo: _pagination.current,
                pageSize: _pagination.pageSize
              })

            }}
            params={{
              sorter,
              pageNo: pagination?.pageNo,
              pageSize: pagination?.pageSize,


            }}

            rowClassName={(record, index) => {
              if (!isnull(record.myEdit)) {


                const edits = JSON.parse(record.myEdit);


                const editObj = edits[0] as MyEditObj;


                if (editObj && (editObj.auditState === "1"))
                  return "localEdit";
                if (editObj && (editObj.auditState === "2"))
                  return "localAudit";
              }


              return "";
            }}


            expandRowByClick
            expandable={{
              expandedRowRender: (record)=>getExpandedRow(record),
              rowExpandable: ()=>true,
            }}
            expandedRowKeys={expandedRowKeys}
            onRow={record => {
              return {
                onDoubleClick: event => {
                  if (expandedRowKeys.indexOf(record.id) > -1)
                    setexpandedRowKeys([]);
                  else
                    setexpandedRowKeys([record.id])
                } // 点击行
                ,
                onClick: (event,a) => {
                 if(!event.isTrusted)
                 {
//关闭代码触发的点击

                  if (expandedRowKeys.indexOf(record.id) > -1)
                  setexpandedRowKeys([]);
                else
                  setexpandedRowKeys([record.id])
                 }
                }
              }
            }
          }


            pagination={{

              total: pagination?.total,
              pageSize: pagination?.pageSize,
              current: pagination?.pageNo
            }}
            options={{ reload: true, density: false }}
            toolBarRender={(action, { selectedRows }) => [
              <div className="toolbarTip">
              <Alert message="双击行查看修改日志"  closable showIcon icon={<IconFontNew type="icon-xiangqing" />}/>
              </div>,
              <Button type="primary" onClick={() => handleModalVisible(true)}>
                <PlusOutlined /> 新建
          </Button>,
              <Button onClick={() => setuploadVisible(true)}>
                <PlusOutlined /> 批量导入
        </Button>,
              selectedRows && selectedRows.length > 0 && (
                <Dropdown
                  overlay={
                    <Menu
                      onClick={async (e) => {
                        if (e.key === 'remove') {
                          Modal.confirm({
                            title: '操作确认',
                            icon: <ExclamationCircleOutlined />,
                            content: '确定删除数据?',
                            okText: '确认',
                            cancelText: '取消',
                            onOk: async () => {
                              await handleRemove(selectedRows);
                              action.reload();
                              refreshTree();
                            }

                          });


                        }
                      }}
                      selectedKeys={[]}
                    >
                      <Menu.Item key="remove">批量删除</Menu.Item>
                      {/* <Menu.Item key="approval">批量审批</Menu.Item> */}
                    </Menu>
                  }
                >
                  <Button>
                    批量操作 <DownOutlined />
                  </Button>
                </Dropdown>
              ),
            ]}
            tableAlertRender={({ selectedRowKeys, selectedRows }) => (
              false
              // <div>
              //   已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
              //   <span>

              //   </span>
              // </div>
            )}



            request={(params) => {
              params.pageSize=20;

              if (queryParent)
                params.parentId = queryParent;

              if (querySubId)
                params.dirId = querySubId;



              let rst = query(params);
              rst.then((a) => {
                //  console.log(JSON.stringify(a));

                if (a && a.pagination) {

                  setPagination({
                    pageNo: a.pagination.pageNo,
                    pageSize: a.pagination.pageSize,
                    total: a.pagination.totalCount,
                  })
                }
                // debugger;
                //  actionRef.current.pagination. total=20;
                // actionRef.current.pagination. pageSize=1;
                // actionRef.current.pagination. current=1;
              }
              );
              return rst;
            }}
            columns={columns}
            rowSelection={{}}
          />
        </Col>
      </Row>


      <DataImport title="文件上传" curfileType="1" onComplete={uploadComplete} onCancel={() => { setuploadVisible(false) }} modalVisible={uploadVisible} />

      <MergeForm title="概念合并" values={mergeDefaultValues} onComplete={mergeComplete} onCancel={() => { setmergeVisible(false) }} modalVisible={mergeVisible} />

      <AuditGraphic modalVisible={relationModalVisible} showState={relationModalShowinfo ? "toaudit" : "modify"} onCancel={
        () => {
          handlerelationModalVisible(false);
        }} title='编辑改动[关系]' value={relationModalvalue}
        onSubmit={async (success) => {

          if (success) {
            handlecompareModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />;

      <EditGraphic modalVisible={frelationModalVisible}  onCancel={
        () => {
          handlefrelationModalVisible(false);
        }} title='编辑关系' qdata={frelationModalvalue}
        onSubmit={async (success) => {

          if (success) {
            handlecompareModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />;





      <EditCompareForm showinfo={compareModalShowinfo} modalVisible={compareModalVisible} onCancel={
            () => {
              handlecompareModalVisible(false);
            }} title="编辑改动[概念]" value={compareModalvalue}
            onSubmit={async (success) => {
             
              if (success) {
                handlecompareModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}

          />
  


      <CreateForm
        values={createDefaultValues}
        onSubmit={async (value) => {


          const success = await handleAdd(value);
          if (success) {
            if (value.shouldclose) {
              handleModalVisible(false);

            }
            else
              message.info("可以修改数据继续添加!");





            if (actionRef.current) {
              //  SetQueryParent("");
              actionRef.current.reload();
            }

            refreshTree();

          }
        }}
        title="新建概念" onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible} />


      {stepFormValues && Object.keys(stepFormValues).length ? (

        <div>

          <EditForm modalVisible={updateModalVisible} onCancel={
            () => {
              handleUpdateModalVisible(false);
            }} title="编辑概念" values={stepFormValues}
            onSubmit={async (value) => {

              let postdata = deepClone(value) as EditFormData;


              const success = await handleUpdate(postdata);
              if (success) {
                handleUpdateModalVisible(false);
                if (actionRef.current) {
                  //  SetQueryParent("");
                  actionRef.current.reload();
                }

                refreshTree();
              }
            }}

            columns={columns}
          />


        </div>
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
