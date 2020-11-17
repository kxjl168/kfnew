import { DownOutlined, PlusOutlined, ExclamationCircleOutlined, SolutionOutlined, LoadingOutlined } from '@ant-design/icons';
import { Popconfirm, Button, Divider, Dropdown, Menu, message, Input, Row, Col, Tooltip, Modal, Steps, Alert } from 'antd';
import React, { useState, useRef, cloneElement, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import { deepClone, isnull } from '@/utils/utils';
import { IconFontNew } from '@/components/MyCom/KIcon';

import EditForm, { EditFormData } from './components/EditForm';

import TestDom from './components/SelfEditFormtsx';

import DirSelect from '@/components/MyCom/DirSelect';

import DirTree, { TreeActionType } from '@/components/MyCom/DirTree';


import SubGraSelect from '@/components/MyCom/SubGraSelect';

import AttrSelect, { Itemdata } from '@/components/MyCom/AttrSelect';


import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, BackPagination } from './data';
import { get as getDirData, query, update, add, remove } from './service';
import { PaginationProps } from 'antd/lib/pagination';

import styles from './style.less';
import DataImport from '@/components/MyCom/DataImport';
import { values, toNumber } from 'lodash';
import { MyEditObj } from '../ModifyList/data';
import DataLogTable from '@/components/MyCom/DataLogTable';
import EditCompareForm from './components/EditCompareForm';

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

export const clsColumn = (): TableListItem[] => {
  const [querySubId, setQuerySubId] = useState<any>();

  const [disableList, setdisableList] = useState<any>();



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
      title: '语境名称',
      className: 'namewidth',
      dataIndex: 'dirName',
      rules: [
        {
          required: true,
          message: '语境名称为必填项',
        },
      ],

      renderText: (val: string, record) => {

        if (!isnull(record.myEdit)) {
          const editObj = JSON.parse(record.myEdit) as MyEditObj;
          // console.log(editObj);
          if (editObj.editAction === "1") {
            return <Tooltip title={`存在${editObj.auditState === "1" ? '本地' : '待审核'}新增版本`} placement="topLeft" ><div><IconFontNew type="icon-btn-add" /> {editObj.auditState === "2" && <IconFontNew type="icon-time" />} {val}</div></Tooltip>;
          }
          if (editObj.editAction === "2") {
            return <Tooltip title={`存在${editObj.auditState === "1" ? '本地' : '待审核'}修改版本`} placement="topLeft" ><div><IconFontNew type="icon-modify" /> {editObj.auditState === "2" && <IconFontNew type="icon-time" />}{val}</div></Tooltip>;
          }
          if (editObj.editAction === "3") {
            return <Tooltip title={`存在${editObj.auditState === "1" ? '本地' : '待审核'}删除版本`} placement="topLeft" ><div><IconFontNew type="icon-btn-modify-close" /> {editObj.auditState === "2" && <IconFontNew type="icon-time" />}{val}</div></Tooltip>;
          }

        }

        return <><div title={record.remark}>{val}</div></>;
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
                //setdirNameval(selectItem[0].text);

                if (onChange)
                  onChange(v);

              }} />
            </>
          )
        }



        return (
          <>
            {/* config={{ mode: "multiple" }} */}
            <SubGraSelect defaultSelectAll={false} mutiSelect={false} labelInValue={false} selectVal={sval} placeholder="请选择领域" onChange={(v, selectItem) => {

              //console.log(JSON.stringify(selectItem));
              //setdirNameval(selectItem[0].text);

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
      title: '上级语境',
      dataIndex: 'parDirId', //领域
      hideInForm: false,
      hideInSearch: true,
      hideInTable: false,
      rules: [{
        required: false,
        message: '选择上级语境',
      },
      ({ getFieldValue }) => ({
        validator(rule, value) {
          //  debugger;
          if (value && getFieldValue('id') === value.key) {
            return Promise.reject('上级语境不能与自己相同');
          }

          return Promise.resolve();
        },
      }),
      ]
      ,
      renderText: (val, record) => {
        return record.parDirName ? record.parDirName : '-';
      },
      renderFormItem: (_, { value, type, defaultRender, onChange, ...rest }, form) => {
        const ids = form.getFieldValue('parDirId');



        const names = form.getFieldValue('parDirName');
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
          form.setFieldsValue({ "parDirId": sval[0] });

          //  //获取上级语境的所有属性
          //  let clsData = await getDirData(sval[0]);

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
            <DirSelect subKgId={querySubId} labelInValue={true} selectVal={sval} placeholder="请选择上级语境" onChange={async (v, selectItem) => {

              //console.log(JSON.stringify(selectItem));
              //setdirNameval(selectItem[0].text);

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
  const [dirNameval, setdirNameval] = useState<string>("");

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

  const [expandedRowKeys, setexpandedRowKeys] = useState<string[]>([]);
  const getExpandedRow = (record) => {
    return <DataLogTable dataId={record.id} />;
  }


  const [compareModalVisible, handlecompareModalVisible] = useState<boolean>(false);
  const [compareModalShowinfo, handlecompareModalShowinfo] = useState<boolean>(false);
  const [compareModalvalue, setcompareModalvalue] = useState<{ editDataId: string, editOriDataId: string, editAction: string }>();





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

  const columns: ProColumns<TableListItem>[] = clsColumn().concat([
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        let editObj: MyEditObj = {};
        if (record.myEdit)
          editObj = JSON.parse(record.myEdit) as MyEditObj;


        return <>

          {!isnull(editObj) && editObj.auditState === '1' && (editObj.editAction === "1" || editObj.editAction === '2') && (
            <>
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
            </>
          )}
          {!isnull(editObj) && (editObj.editAction === "3" || editObj.auditState === '2') && (
            <>
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
            </>
          )}


          {isnull(editObj) && (
            <>

              <a
                onClick={(e) => {

                  handleModify(record);

                  e.stopPropagation();
                  // console.log('0:'+JSON.stringify(stepFormValues))
                  // console.log(JSON.stringify(data) )
                  // console.log("UpdateModalVisible:"+updateModalVisible);
                }}
              >
                <Tooltip title="编辑语境">
                  <IconFontNew type="icon-btn-edit" title="编辑语境" />
                </Tooltip>

              </a>
              <Divider type="vertical" />
            </>
          )}
          {/* <Divider type="vertical" />
          <a
            onClick={() => {
              handleModifyRelation(record);
            }}
          >
            <Tooltip title="编辑关系">
              <IconFontNew type="icon-btn-relation" title="编辑关系" />
            </Tooltip>

          </a> */}

          {(isnull(editObj) || (!isnull(editObj) && editObj.auditState === '1' && toNumber(editObj.editAction) < 2)) && (
            <Popconfirm
              title='确定删除?'
              onConfirm={
                (e) => {
                  handlerDelete(record);
                  e.stopPropagation();
                }

              }
              onCancel={(e) => { e.stopPropagation(); }}
              okText="确定"
              cancelText="取消"
            >
              <a
                href="#" onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Tooltip title="删除">
                  <IconFontNew type="icon-btn-delete" title="删除" />
                </Tooltip>
              </a>
            </Popconfirm>
          )}


        </>

      }
    }]);


  const handleModify = async (record) => {

    let data = deepClone(record) as FormValueType;
    data.title = "编辑语境";

    setStepFormValues(data);
    handleUpdateModalVisible(true);
  }

  const handleModifyRelation = (record) => {
    props.history?.push('/ontology/graphic?id=' + record.id);
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
        <Col span="6" style={{ paddingRight: '5px' }}>
          <DirTree showSubQuery showNodeAction ref={treeRef}

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


              let clsrst = await getDirData(v.id);
              if (clsrst && clsrst.success && clsrst.data)
                handleModify(clsrst.data);

            }}



            OnTreeNodeAddNewClsClick={async (v) => {
              let clsrst = await getDirData(v.id);
              if (clsrst && clsrst.success && clsrst.data) {
                let clsData = clsrst.data;
                SettreeSelecCls(clsData);

                SetCreateDefaultValues({
                  dirId: clsData.dirId,
                  subName: clsData.subName,

                  subIds: clsData.subIds,
                  subNames: clsData.subNames,


                  parDirId: clsData.id,
                  parDirName: clsData.dirName,

                });
                handleModalVisible(true);
              }


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

                //let clsDetailRst = await getDirData(clsData.id);

                SetCreateDefaultValues({
                  dirId: clsData.dirId,
                  subName: clsData.subName,

                  subIds: clsData.subIds,
                  subNames: clsData.subNames,

                  parDirId: clsData.id,
                  parDirName: clsData.dirName,

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
            headerTitle=""
            className="usetrborder nolefticon"
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
                const editObj = JSON.parse(record.myEdit) as MyEditObj;


                if (editObj && (editObj.auditState === "1"))
                  return "localEdit";
                if (editObj && (editObj.auditState === "2"))
                  return "localAudit";
              }


              return "";
            }}
            pagination={{

              total: pagination?.total,
              pageSize: pagination?.pageSize,
              current: pagination?.pageNo
            }}
            options={{ reload: true, density: false }}
            toolBarRender={(action, { selectedRows }) => [
              <div className="toolbarTip">
                <Alert message="双击行查看修改日志" closable showIcon icon={<IconFontNew type="icon-xiangqing" />} />
              </div>,
              <Button type="primary" onClick={() => handleModalVisible(true)}>
                <PlusOutlined /> 新建
          </Button>,
              //       <Button onClick={() => setuploadVisible(true)}>
              //         <PlusOutlined /> 批量导入
              // </Button>,
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

            expandRowByClick
            expandable={{
              expandedRowRender: (record) => getExpandedRow(record),
              rowExpandable: () => true,
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


      <EditCompareForm showinfo={compareModalShowinfo} modalVisible={compareModalVisible} onCancel={
        () => {
          handlecompareModalVisible(false);
        }} title="编辑改动[领域]" value={compareModalvalue}
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
        title="新建语境" onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible} />


      {stepFormValues && Object.keys(stepFormValues).length ? (

        <div>

          <EditForm modalVisible={updateModalVisible} onCancel={
            () => {
              handleUpdateModalVisible(false);
            }} title="编辑语境" values={stepFormValues}
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
