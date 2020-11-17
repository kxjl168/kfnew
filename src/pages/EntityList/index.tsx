import { DownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Button, Divider, Dropdown, Menu, message, Input, Row, Col, Tooltip, Modal, Checkbox, Alert } from 'antd';
import React, { useState, useRef, cloneElement } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import { deepClone, isnull, GetRandomLightColor } from '@/utils/utils';
import { IconFontNew } from '@/components/MyCom/KIcon';


import EditForm, { EditFormData } from './components/EditForm';
import { get as getCls, getClsProperties } from '@/pages/KgClassList/service';

import TestDom from './components/SelfEditFormtsx';

import ClsSelect from '@/components/MyCom/ClsSelect';

import ClsTree, { TreeActionType } from '@/components/MyCom/ClsTree';


import SubGraSelect from '@/components/MyCom/SubGraSelect';

import AttrSelect, { Itemdata } from '@/components/MyCom/AttrSelect';
import TagSelect from '@/components/MyCom/TagSelect';
import { get as getAttr } from '@/pages/AttrList/service';


import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, BackPagination } from './data';
import { get, query, update, add, remove } from './service';
import { PaginationProps } from 'antd/lib/pagination';
import KScroll from '@/components/MyCom/KScrollBar';


import styles from './style.less';
import DataImport from '@/components/MyCom/DataImport';
import DirSelect from '@/components/MyCom/DirSelect';
import DirTree, { DirTreeActionType } from '@/components/MyCom/DirTree';
import { MyEditObj } from '../ModifyList/data';
import DataLogTable from '@/components/MyCom/DataLogTable';
import EditCompareForm from './components/EditCompareForm';
import _, { toNumber, random, uniqBy } from 'lodash';

import { QDATA } from '../GraphicO/components/KoniMain/KoniPanel';
import  EditGraphic from '../GraphicO/components/Edit';
import AuditGraphic from '../GraphicO/components/Audit';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    let rst = await add({ ...fields });
    if (rst && rst.success) {
      hide();
      message.success('添加成功');
      return true;
    }
    else
      return false;
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
    else
      return false;
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

export const entityColum = (OnClsChanged, OnFecthChanged): ProColumns<TableListItem>[] => {

  const [querySubId, setQuerySubId] = useState<any>();

  const getFullName = (dirname, name) => {

    if (dirname && name)
      return dirname + ":" + name;
    else if (dirname)
      return dirname;
    else if (name)
      return name;
    // return record.dirName+":"+record.name;
  }

  return (
    [
      {
        title: 'id',
        dataIndex: 'id',
        hideInForm: true,
        hideInSearch: true,
        hideInTable: true,
      },

      {

        index: 4,
        title: '名称',
        dataIndex: 'name',

        className: 'namewidth',
        hideInSearch: true,
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
        renderText: (val: string, record) => {

          if (!isnull(record.myEdit)) {

            const edits = JSON.parse(record.myEdit);

            const dom = edits.map((editObj: MyEditObj) => {
              // console.log(editObj);
              if (editObj.editAction === "1") {
                return <Tooltip title={`存在${editObj.auditState === "1" ? '本地' : '待审核'}新增版本`} placement="topLeft">
  <span>
    <IconFontNew type="icon-btn-add" />
 {editObj.auditState === "2" && <IconFontNew type="icon-time" />
} </span>
</Tooltip>;
              }
              if (editObj.editAction === "2") {

                if (editObj.dataType === '7')
                  return <Tooltip title={`存在${editObj.auditState === "1" ? '本地' : '待审核'}关系修改`} placement="topLeft">
<span>
  <IconFontNew type="icon-btn-relation" />
 {editObj.auditState === "2" && <IconFontNew type="icon-time" />
}</span>
</Tooltip>;

                return <Tooltip title={`存在${editObj.auditState === "1" ? '本地' : '待审核'}修改版本`} placement="topLeft">
<span>
<IconFontNew type="icon-modify" />
 {editObj.auditState === "2" && <IconFontNew type="icon-time" />
}</span>
</Tooltip>;
              }
              if (editObj.editAction === "3") {
                return <Tooltip title={`存在${editObj.auditState === "1" ? '本地' : '待审核'}删除版本`} placement="topLeft">
<span>
<IconFontNew type="icon-btn-modify-close" />
 {editObj.auditState === "2" && <IconFontNew type="icon-time" />
}</span>
</Tooltip>;
              }
              return <></>;
            });
            return <> {dom}{val}</>;

          }

          return <>{val}</>;
        },

        renderFormItem: (_, { value, type, defaultRender, onChange, ...rest }, form) => {

          // if (!type) {//query
          //  return <>
          //<Input placeholder="请输入实体全名" onChange={(v) => {

          //         if (onChange)
          //           onChange(v);
          //       }}
          //       />

          //     </>
          // }



          const val = form.getFieldValue('name');

          return (
            <>
<Input value={val} placeholder="请输入展示名称" onChange={(v) => {

                if (onChange) {
                  onChange(v);



                  let dirname = "";
                  if (form.getFieldValue('dirId') instanceof Object)
                    dirname = form.getFieldValue('dirId').text || form.getFieldValue('dirId').label;
                  else
                    dirname = form.getFieldValue('dirName');


                  form.setFieldsValue({ fullName: getFullName(dirname, v.target.value) });

                }

              }}
              />
</>
          )


        },
      },

      {
        index: 1,
        title: '实体全名',
        dataIndex: 'fullName',
        hideInForm: true,
        hideInTable: true,
        rules: [
          {
            required: false,
            message: '名称为必填项',
          },
        ],
        renderFormItem: (_, { value, type, defaultRender, onChange, ...rest }, form) => {

          if (!type) {//query
            return <>
<Input placeholder="请输入实体全名" onChange={(v) => {

                if (onChange)
                  onChange(v);
              }}
              />

</>
          }



          const val = form.getFieldValue('fullName');

          return (
            <>
<Input disabled value={val} placeholder="请输入实体全名" onChange={(v) => {

                if (onChange)
                  onChange(v);
              }}
              />
</>
          )


        },

      },
      {
        index: 2,
        order: 1,
        title: '所属概念',
        dataIndex: 'clsName',
        hideInForm: true,
        hideInSearch: true,
        hideInTable: false,
        rules: [
          {
            required: false,
            message: '概念名称为必填项',
          },
        ],
      },
      {
        index: 1,
        order: 2,
        title: '所属领域',
        className: 'subwidth',
        dataIndex: 'subKgId', //领域
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
          // console.log(record);
          return record.subNames;
        },
        renderFormItem: (_, config, form) => {

          const { type, defaultRender, onChange, ...rest } = config;

          // const ids = form.getFieldValue('subKgId');

          // const names = form.getFieldValue('subKgName');

          // let sval:any[]=[];
          // if(ids instanceof Object)
          // {
          // sval=[ids];
          // }
          // else if(!isnull(ids)){

          //      sval.push({label:names,text:names,value:ids,key:ids});
          //      form.setFieldsValue({"subKgId":sval[0]});
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

            form.setFieldsValue({ "subKgId": ids, "subIds": sval });
            setQuerySubId(ids);
          }



          if (!type) {//query
            return (
              <>
<SubGraSelect labelInValue={false} selectVal={sval} placeholder="请选择领域" onChange={(v, selectItem) => {

                  //console.log(JSON.stringify(selectItem));
                  //setClsNameval(selectItem[0].text);

                  if (onChange) {
                    onChange(v);

                  }




                }} />
</>
            )
          }

          //  console.log(config);
          return (
            <>
<SubGraSelect config={{ mode: "multiple" }} mutiSelect={true} labelInValue={false} selectVal={sval} placeholder="请选择领域" onChange={(v, selectItem) => {

                //console.log(JSON.stringify(selectItem));
                // setClsNameval(selectItem[0].text);

                if (onChange)
                  onChange(v);

                //debugger;
                setQuerySubId(v);

              }} />
</>
          )

        }
      },
      {
        index: 1,
        order: 2,
        title: '所属语境',
        dataIndex: 'dirId', //领域
        hideInForm: false,
        hideInSearch: true,
        hideInTable: false,
        rules: [{
          required: true,
          message: '选择所属语境',
        }
        ],
        renderText: (val, record) => {
          return record.dirName ? record.dirName : '-';
        },

        renderFormItem: (_, { type, defaultRender, onChange, ...rest }, form) => {
          const ids = form.getFieldValue('dirId');
          const names = form.getFieldValue('dirName');
          /// console.log(ids)

          let sval: any[] = [];
          if (ids instanceof Object) {
            sval = [ids];
          }
          else if (!isnull(ids)) {

            // let idlist: string[] = ids.split(",");
            // let namelist: string[] = names.split(",");
            // for (let index = 0; index < idlist.length; index++) {
            //   sval.push({ text: namelist[index], value: idlist[index] });
            // }

            sval.push({ text: names, value: ids });
            form.setFieldsValue({ "dirId": sval[0] });

          }

          let ishiddenAddBtn = false;
          if (!type)
            ishiddenAddBtn = true;


          return (
            <>
<DirSelect labelInValue={true} mutiSelect={false} ishiddenAddBtn={ishiddenAddBtn} selectVal={sval} placeholder="请选择语境" onChange={(v, selectItem) => {

                //console.log(JSON.stringify(selectItem));
                //setClsNameval(selectItem[0].text);

                if (onChange) {
                  onChange(v);

                  form.setFieldsValue({ fullName: getFullName(v ? v.label : "", form.getFieldValue("name")) });
                }


              }} />
</>
          )

        }

      }
      ,
      {
        index: 1,
        order: 2,
        title: '所属概念',
        dataIndex: 'clsId', //领域
        hideInForm: false,
        hideInSearch: true,
        hideInTable: true,
        rules: [{
          required: true,
          message: '选择所属概念',
        },
          // ({ getFieldValue }) => ({
          //   validator(rule, value) {

          //     if (value && getFieldValue('id') === value) {
          //       return Promise.reject('上级概念不能与自己相同'); 
          //     }

          //     return Promise.resolve();
          //   },
          // }),
        ]
        ,
        renderText: (val, record) => {
          return record.parentName ? record.parentName : '-';
        },
        renderFormItem: (_, { value, type, defaultRender, onChange, ...rest }, form) => {
          const ids = form.getFieldValue('clsId');



          const names = form.getFieldValue('clsName');

          let sval = {};
          if (ids instanceof Object) {
            sval = ids;
          }
          else if (!isnull(ids)) {

            if (ids !== "0") {
              sval = { label: names, text: names, value: ids, key: ids };
              form.setFieldsValue({ "clsId": sval });
            }
          }

          if (!type) {
            //query
            // form.setFieldsValue({'parentId':queryParent}); //value=queryParent;
          }

          return (
            <>
<ClsSelect subKgId={querySubId} hideAddMore={true} labelInValue={true} mutiSelect={false} selectVal={sval} hiddenAddBtn={false} placeholder="请选择所属概念" onChange={async (v, selectItem) => {


                if (onChange) {
                  onChange(v);

                  if (v) {
                    if (OnFecthChanged)
                      OnFecthChanged(true);

                    let clsProperties = [];
                    //获取选择概念上的所有属性
                    let clsData = await getClsProperties(v.key);

                    if (clsData && clsData.success && clsData.data) {

                      if (OnClsChanged)
                        OnClsChanged(clsData.data);

                    }
                    if (OnFecthChanged)
                    OnFecthChanged(false);
                  }






                }
              }} />

</>


          )

        }
      },


      {
        index: 2,
        title: '属性',
        dataIndex: 'attrs', //领域
        hideInForm: true,
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
<AttrSelect labelInValue={false} ishiddenAddBtn={ishiddenAddBtn} selectVal={sval} placeholder="请选择查询属性" onChange={(v, selectItem) => {

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
        title: '标签',
        dataIndex: 'tags',
      
        hideInSearch: true,
        hideInTable: true,
        hideInForm: false,
        renderFormItem: (_, { type, defaultRender, onChange, ...rest }, form) => {
          const tagstrs = form.getFieldValue('tags');
        
          let sval=[];
          
          try {
            if(!isnull(tagstrs)) sval=JSON.parse( tagstrs);  
          } catch (error) {
            
          }
          

          return (
            <>
<TagSelect config={{ mode: 'tags' }} className="width100" labelInValue selectVal={sval} placeholder="请选择或输入新标签" onChange={(v) => {

            
                let uniqTags = uniqBy(v, (tag) => {
                  return tag.label
                })
          
          
                uniqTags.map(tag => {
                  try {
                    
                 
                  if (tag.value.indexOf('-') < 0) {
                    let color = "#";
          
                    for (let index = 0; index < 6; index++) {
                      color += random(15).toString(16);
                    }
                    tag.value += "-" + color;
                  }
                  tag.text = tag.label;
                } catch (error) {
                   // continue;
                }
              })


                if (onChange)
                  onChange(JSON.stringify(uniqTags));

              }} />
</>
          )

        }
      },


      {
        title: '排序',
        dataIndex: 'sort',
        sorter: false,
        hideInSearch: true,
        hideInForm: true,
        hideInTable: true,
        rules: [
          {
            required: true,
            message: '序号为数字',
            pattern: /^\d+$/g,
          },
        ],

        renderText: (val: string) => val,
      },
      {
        title: '状态',
        dataIndex: 'enabled',
        hideInSearch: true,
        hideInForm: true,
        hideInTable: true,
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
        dataIndex: 'versionId',
        // initialValue:'1.0.0',
        hideInSearch: true,
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
    ]);

}

const TableList: React.FC<{}> = (props) => {
  const [sorter, setSorter] = useState<string>('');
  const [pagination, setPagination] = useState<BackPagination>({ pageNo: 1, pageSize: 10 });
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>(); //const[clsNameval,setClsNameval]=useState<string>("");

  const [uploadVisible, setuploadVisible] = useState<boolean>(false);

  const [queryClsId, SetqueryClsId] = useState<string>("");

  const [loadAttrs, SetLoadAttrs] = useState<boolean>(false);

  const [createDefaultValues, SetCreateDefaultValues] = useState<TableListItem>({});
  const treeRef = useRef<TreeActionType>();

  const dirtreeRef = useRef<DirTreeActionType>();

  const [querySubId, SetquerySubId] = useState<string>("");

  const [queryDirId, SetqueryDirId] = useState<string>("");


  const [expandedRowKeys, setexpandedRowKeys] = useState<string[]>([]);
  const getExpandedRow = (record) => {
    return <DataLogTable dataId={record.id} />;
  }


  const [compareModalVisible, handlecompareModalVisible] = useState<boolean>(false);
  const [compareModalShowinfo, handlecompareModalShowinfo] = useState<boolean>(false);
  const [compareModalvalue, setcompareModalvalue] = useState<{ editDataId: string, editOriDataId: string, editAction: string }>();



  const [relationModalVisible, handlerelationModalVisible] = useState<boolean>(false);
  const [relationModalShowinfo, handlerelationModalShowinfo] = useState<boolean>(false);
  const [relationModalvalue, setrelationModalvalue] = useState<MyEditObj>();


  const [frelationModalVisible, handlefrelationModalVisible] = useState<boolean>(false);
  
  const [frelationModalvalue, setfrelationModalvalue] = useState<QDATA>();




  const getAction = (record, edits:string|MyEditObj[]) => {
    let dom = <></>;

    const editModify = (editObj) =><>
<a onClick={(e) => {

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

    const showeditDetail = (editObj) =><>
<a onClick={(e) => {

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

    const normalEditAttr = () =><>

<a onClick={async (e) => {
          e.stopPropagation();
          await handleEditAction(record);

        }}
      >
<Tooltip title="编辑属性">
<IconFontNew type="icon-btn-edit" title="编辑属性" />
</Tooltip>
</a>
<Divider type="vertical" />

</>;

    const getAttrDom = (edits:string|MyEditObj[]) => {

      if (edits === '[]')
        return normalEditAttr();

      const editObjEntity = _.find(edits, item => {
        return item.dataType === '6'
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
<a onClick={(e) => {
   
            //页面跳转
           // props.history.push('/kg/graphic?graphicType=entity&level=1&id=' + record.id);

    //全屏model

           setfrelationModalvalue({ level:1,id:record.id,gtype:'entity',showEdit:true });
         
           handlefrelationModalVisible(true);

            e.stopPropagation();
          }}
        >
<Tooltip title="编辑关系(一层关系)">
<IconFontNew type="icon-btn-relation" title="编辑关系" />
</Tooltip>
</a>
<Divider type="vertical" />
</>

    const getLevelTwoRelation = () =>
<>
<a onClick={(e) => {


          // props.history.push('/kg/graphic?graphicType=entity&level=2&id=' + record.id);

          setfrelationModalvalue({ level:2,id:record.id,gtype:'entity',showEdit:true });
         
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

    const editRelation = (editObj) =><>
<a onClick={(e) => {

          handlerelationModalShowinfo(false);

        //  debugger;
          setrelationModalvalue({ id:editObj.id, editDataId: editObj.editDataId, editOriDataId: record.id, editAction: editObj.editAction });
         
          handlerelationModalVisible(true);

          e.stopPropagation();
        }}
      >
<Tooltip title="编辑关系改动">
<IconFontNew type="icon-btn-relation" />
</Tooltip>
</a>
<Divider type="vertical" />
</>;

    const showRelationDetail = (editObj) =><>
<a onClick={(e) => {
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


    const getRelationDom = (edits:string|MyEditObj[]) => {

      if (edits === '[]')
        return <>{getLevelOneRelation()}{getLevelTwoRelation()}</>;

      const editObjEntity = _.find(edits, item => {
        return item.dataType === '6'
      })
      const editObjRelation = _.find(edits, item => {
        return item.dataType === '7'
      })

      let dom = <></>;

      //编辑中的新增，需要审核后才能编辑关系
      if(!isnull(editObjEntity)&&(editObjEntity.editAction==="1"))
      return dom;

      if (!isnull(editObjRelation) && editObjRelation.auditState === '1' )
        dom = <>{editRelation(editObjRelation)}</>;


      if (!isnull(editObjRelation) && (editObjRelation.auditState === '2'))
        dom = <>{showRelationDetail(editObjRelation)}</>;

      if (isnull(editObjRelation) && !isnull(editObjEntity))
        dom = <>{getLevelOneRelation()}{getLevelTwoRelation()}</>;

      return dom;


    }





    const deletedom = () =><>
<Popconfirm title='确定删除?' onConfirm={async (e) => {


          await remove(record.id);
          if (actionRef.current) {
            actionRef.current.reload();
          }

          e.stopPropagation();

        }} onCancel={(e) => { e.stopPropagation(); }} okText="确定" cancelText="取消">
<a href="javascript:void(0)" onClick={(e) => { e.stopPropagation(); }}
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


  const columns: ProColumns<TableListItem>[] = entityColum().concat([


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



      }
    }]);

  //树上选中的cls
  const [treeSelecCls, SettreeSelecCls] = useState<TableListItem>({});

  const refreshTree = (id) => {
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

  const uploadComplete = (rst) => {
    if (rst) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  }

  //编辑
  const handleEditAction = async (record: TableListItem) => {


    const data = deepClone(record) as TableListItem;
    data.title = "编辑概念";

    let hide = message.loading("加载中...");

    let noModifyAttr = [];
    //获取上级概念的所有属性
    let clsData = await getCls(record.clsId);

    if (clsData && clsData.success && clsData.data) {

      if (!isnull(clsData.data.attrs)) {
        const attrids = clsData.data.attrs.split(",");
        const attrNames = clsData.data.attrNames.split(",");


        for (let index = 0; index < attrids.length; index++) {
          noModifyAttr.push({
            id: attrids[index]
          })
        }
      }
    }
    data.clsProperties = noModifyAttr;

    setStepFormValues(data);

    handleUpdateModalVisible(true);

    hide();

  }

  return (
    <PageHeaderWrapper title={' '} content={' '}>
<Row>
{/* 
    <div style={{background:GetRandomLightColor("f00",0)}}>1</div>
<div style={{background:GetRandomLightColor("f00",30)}}>1</div>
<div style={{background:GetRandomLightColor("f00",60)}}>1</div>
<div style={{background:GetRandomLightColor("f00",90)}}>1</div>
<div style={{background:GetRandomLightColor("f00",120)}}>1</div>
<div style={{background:GetRandomLightColor("f00",150)}}>1</div>
<div style={{background:GetRandomLightColor("f00",180)}}>1</div>
<div style={{background:GetRandomLightColor("f00",210)}}>1</div>
<div style={{background:GetRandomLightColor("f00",250)}}>1</div>
     */}


        <Col span="6" style={{ paddingRight: '5px' }} >

<Row style={{ height: '500px', paddingBottom: '40px' }}>
<ClsTree ref={treeRef} OnSubKgIdChange={(subid, subname) => {
                SetquerySubId(subid);
                if (actionRef.current)
                  actionRef.current.reload();

                if (dirtreeRef.current)
                  dirtreeRef.current.setSubKgData(subid, subname);


                SetCreateDefaultValues({
                  ...createDefaultValues,
                  subIds: subid,
                  subNames: subname,

                });
              }} OnTreeNodeClick={async (key, subid, subname, clsData) => {




                SetqueryClsId(key);
                SetquerySubId(subid);

                SettreeSelecCls(clsData);

                SetCreateDefaultValues({
                  ...createDefaultValues,
                  subIds: subid,
                  subNames: subname,

                });

                // let hide = message.loading("加载中...");

                if (clsData) {

                  let noModifyAttr = [];
                  let InitAttr = [];
                  //获取上级概念的所有属性
                  //获取选择概念上的所有属性
                  let clsAttrrst = await getClsProperties(clsData.id);

                  if (clsAttrrst && clsAttrrst.success && clsAttrrst.data) {
                    InitAttr = clsAttrrst.data;
                    noModifyAttr = clsAttrrst.data;

                  }


                  SetCreateDefaultValues({
                    ...createDefaultValues,
                    subKgId: clsData.dirId,
                    subKgName: clsData.subName,
                    clsId: clsData.id,
                    clsName: clsData.clsName,

                    subIds: clsData.subIds,
                    subNames: clsData.subNames,
                    clsProperties: noModifyAttr,
                    properties: InitAttr,
                    //  attrNames:clsData.attrNames,
                    //  attrs:clsData.attrs
                  });
                }



                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }

              } />
</Row>
<Row style={{ height: '400px', marginTop: '5px' }}>
<KScroll autohide>
<DirTree showSubQuery={false} ref={dirtreeRef}


                 OnSubKgIdChange={(subid, subname) => {
                   SetquerySubId(subid);
                   if (actionRef.current)
                     actionRef.current.reload();


                   SetCreateDefaultValues({

                   dirId: subid,
                     dirName: subname,

                   });
                 }} OnTreeNodeClick={async (key, subid, subname, clsData) => {




                  // SetqueryClsId(key);
                  SetqueryDirId(key);

                  // SettreeSelecCls(clsData);
                  if (clsData)
                    SetCreateDefaultValues({
                      ...createDefaultValues,
                      dirId: clsData.id,
                      dirName: clsData.dirName,

                    });


                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }

                } />
</KScroll>
</Row>
</Col>
<Col span="18">
<ProTable<TableListItem> headerTitle="" className="usetrborder nolefticon" actionRef={actionRef} rowKey="id" onChange={(_pagination, _filter, _sorter) => {
              const sorterResult = _sorter as SorterResult<TableListItem>;
              if (sorterResult.field) {
                setSorter(`${sorterResult.field}_${sorterResult.order}`);
              }

              setPagination({
                pageNo: _pagination.current,
                pageSize: _pagination.pageSize
              })

            }} rowClassName={(record, index) => {
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


            expandRowByClick expandable={{
              expandedRowRender: (record) => getExpandedRow(record),
              rowExpandable: () => true,
            }} expandedRowKeys={expandedRowKeys} onRow={record => {
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
            } params={{
              sorter,
              pageNo: pagination?.pageNo,
              pageSize: pagination?.pageSize,


            }} pagination={{

              total: pagination?.total,
              pageSize: pagination?.pageSize,
              current: pagination?.pageNo
            }} options={{ reload: true, density: false }} toolBarRender={(action, { selectedRows }) => [
<div className="toolbarTip">
<Alert message="双击行查看修改日志" closable showIcon icon={<IconFontNew type="icon-xiangqing" />
} />
</div>,
<Button type="primary" onClick={() => handleModalVisible(true)}>
<PlusOutlined /> 新建
          </Button>,
              <Button onClick={() => setuploadVisible(true)}>
<PlusOutlined /> 批量导入
         </Button>,
              selectedRows && selectedRows.length > 0 && (
                <Dropdown overlay={


                    <Menu onClick={async (e) => {
                        // message.info(2)
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
                            }

                          });


                        }
                      }} selectedKeys={[]}
                    >

<Menu.Item key="remove">批量删除</Menu.Item>

                      {/*<Menu.Item key="approval">批量审批</Menu.Item> */}
</Menu>

                  }
                >
<Button>
                    批量操作<DownOutlined />
</Button>
</Dropdown>
              ),
            ]} tableAlertRender={({ selectedRowKeys, selectedRows }) => (
              false
              //<div>
              //   已选择<a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
              //   <span>

              //   </span>
              // </div>
            )} request={(params) => { params.pageSize=20;

              if (queryClsId)
                params.clsId = queryClsId;


              if (querySubId)
                params.subKgId = querySubId;

              if (queryDirId)
                params.dirId = queryDirId;


              if (!isnull(params.fullName))
                params.fullNameFirst = "true";
              else
                params.fullNameFirst = undefined;



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
            }} columns={columns} rowSelection={{}}
          />
</Col>
</Row >


<DataImport title="文件上传" curfileType="2" onComplete={uploadComplete} onCancel={() => { setuploadVisible(false) }} modalVisible={uploadVisible} />

{/* 对比编辑关系 */}
      <AuditGraphic modalVisible={relationModalVisible} showState={relationModalShowinfo ? "toaudit" : "modify"} onCancel={
        () => {
          handlerelationModalVisible(false);
        }} title='编辑改动[关系]' value={relationModalvalue} onSubmit={async (success) => {

          if (success) {
            handlecompareModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />;

{/* 初始编辑关系 */}
<EditGraphic modalVisible={frelationModalVisible} onCancel={
        () => {
          handlefrelationModalVisible(false);
        }} title='编辑关系' qdata={frelationModalvalue} onSubmit={async (success) => {

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
        }} title="编辑改动[实体]" value={compareModalvalue} onSubmit={async (success) => {

          if (success) {
            handlecompareModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}

      />



<CreateForm values={createDefaultValues} loading={loadAttrs} onSubmit={async (value, callback) => {



          // if(!isnull(value.attrs))
          // value.attrs=value.attrs.toString();


          const success = await handleAdd(value);
          if (success) {

            if (value.shouldclose) {
              handleModalVisible(false);

            }
            else
              message.info("可以修改数据继续添加!");



            if (actionRef.current) {
              //  SetqueryClsId("");
              actionRef.current.reload();
            }

            if (callback)
              callback();

            // if (treeRef.current)
            //   treeRef.current.reloadTree("0");

          }
        }} title="新建实体" onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible} />


      {
        stepFormValues && Object.keys(stepFormValues).length ? (

          <div>

<EditForm modalVisible={updateModalVisible} onCancel={
              () => {
                handleUpdateModalVisible(false);
              }} title="编辑实体" values={stepFormValues} onSubmit={async (value) => {

                let postdata = deepClone(value) as EditFormData;


                // if(!isnull(postdata.clsId))
                // postdata.clsId=postdata.clsId.value;

                // if(!isnull(postdata.attrs))
                // postdata.attrs=postdata.attrs.toString();

                const success = await handleUpdate(postdata);
                if (success) {
                  handleUpdateModalVisible(false);
                  if (actionRef.current) {
                    //  SetqueryClsId("");
                    actionRef.current.reload();
                  }

                  // if (treeRef.current)
                  //   treeRef.current.reloadTree("0");

                }
              }}


            />


</div>
        ) : null
      }
    </PageHeaderWrapper >
  );
};

export default TableList;
