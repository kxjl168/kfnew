import { DownOutlined, PlusOutlined, QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Button, Divider, Dropdown, Menu, message, Input, Select, Tooltip, Popover, Modal, Alert } from 'antd';
import React, { useState, useRef, cloneElement, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import { deepClone, isnull } from '@/utils/utils';

import { IconFontNew } from '@/components/MyCom/KIcon';

import EditForm, { EditFormData } from './components/EditForm';

import TestDom from './components/SelfEditFormtsx';

import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, BackPagination } from './data';

import {MyEditObj} from '../ModifyList/data';

import { get, query, update, add, remove } from './service';
import { PaginationProps } from 'antd/lib/pagination';

import ClsSelect from '@/components/MyCom/ClsSelect';
import ProTypeSelect from '@/components/MyCom/ProTypeSelect';


import styles from './style.less';
import { Rule } from 'antd/es/form';
import Layout from '@/layouts/BlankLayout';
import EditCompareForm from './components/EditCompareForm';

import { toNumber } from 'lodash';
import DataLogTable from '@/components/MyCom/DataLogTable';


const { Option } = Select;


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

      console.log(rst);

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
const handleUpdate = async (fields: FormValueType) => {
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

export const attrColumn = (showhelp, showCls, SetShowCls): ProColumns<TableListItem>[] => {

  //const [showCls, SetShowCls] = useState<boolean>(false);
  return (
    [{
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },



    {
      title: '名称',
      dataIndex: 'name',
      className:'namewidth',
      rules: [
        {
          required: true,
          message: '名称为必填项',
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



        return val;
      }
    },

    {
      title: '属性类型',
      dataIndex: 'attrType',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
      initialValue: "1",
      valueEnum: {
        "1": { text: '通用属性', status: 'Default' },
        "2": { text: '特有属性', status: 'Default' },
      },

      rules: [
        {
          required: true,
          message: '属性类型为必填项',
        },
      ],
      renderText: (val, record) => {
        //  console.log(record.clsId);
        if (record.clsId !== undefined && record.clsId !== "" && record.clsId !== null)
          return "特有属性";
        else
          return "通用属性";
      },
      renderFormItem: (_, { type, defaultRender, onChange, ...rest }, form) => {
        let id = form.getFieldValue('clsId');
        let sval = "1";
        if (id !== undefined && id !== "" & id !== null)
          sval = "2"
        else
          sval = "1";

        // sval=form.getFieldValue('attrType');
        //console.log("attrType:"+sval);
        return (
          <>
            <Select placeholder="请选择" defaultValue={sval} onChange={(v) => {

              console.log(v);
              if (v === "1") {
                SetCheckCls(false);
                form.setFieldsValue({ clsId: '' });
              }
              else
                SetCheckCls(true);

              form.validateFields(['clsId']);

              if (onChange)
                onChange(v);
            }}>
              <Option value="1">通用属性</Option>
              <Option value="2">特有属性</Option>
            </Select>
          </>
        )

      }
    },



    {

      //   <Tooltip title="数据类型说明xxxx">
      //    <QuestionCircleOutlined />
      //  </Tooltip>
      title: '数据类型',

      label: (<>
        <span>
          数据类型
      {showhelp && (
            <Popover title="数据类型说明" content={

              <>
                <div>概念类型:属性为一种关联的其他概念</div>
                <div>实体类型:属性为选定的实体概念的一个实体,在概念属性中将表现了一种关系</div>
              </>

            }>

              <QuestionCircleOutlined />
            </Popover>
          )}
        </span>
      </>),

      dataIndex: 'dataTypeId',
      hideInForm: false,
      hideInSearch: true,
      hideInTable: false,
      rules: [{
        required: true,
        message: '数据类型为必填项',
      }
      ]
      ,
      renderText: (val, record) => {

        try {
          const ruleTypedata = JSON.parse(record.dataTypeRule);

          return ruleTypedata.name;
        } catch (error) {
          return "";
        }

      },
      renderFormItem: (_, { type, defaultRender, onChange, ...rest }, form) => {
        let id = "";
        try {

          const ruleTypedata = JSON.parse(form.getFieldValue('dataTypeRule'));

          id = ruleTypedata.id;


          const oldval=form.getFieldValue("dataTypeId");
          if(isnull(oldval))
          form.setFieldsValue({dataTypeId:id})

        } catch (error) {
          //return "";
        }

        if (id === null)
          id = "";
        //  console.log("clsId:"+id);
        // console.log( form.getFieldValue('groupId'))

        return (
          <>
            <ProTypeSelect placeholder="请选择" selectVal={id} onChange={
              (v) => {

                onChange(v)
                if (v === "2")//实体选择
                  SetShowCls(true)
                else
                  SetShowCls(false);
              }
            } />
          </>
        )

      }
    },

    {
      title: '实体概念',
      dataIndex: 'clsId',
      hideInForm: !showCls,
      hideInSearch: true,
      hideInTable: true,
      rules: [{
        required: showCls,//checkCls,
        message: '选择实体归属的概念',
      }
      ]
      ,
      renderText: (val, record) => {
        return record.clsName;
      },
      renderFormItem: (_, { type, defaultRender, onChange, ...rest }, form) => {
        let sval = "";
        try {

          const ruleTypedata = JSON.parse(form.getFieldValue('dataTypeRule'));

          sval = ruleTypedata.clsId;
          form.setFieldsValue({ clsId: JSON.parse(sval) });
        } catch (error) {
          //return "";
        }

        return (
          <>
            <ClsSelect labelInValue={true} mutiSelect={false} selectVal={sval} placeholder="请选择概念" onChange={(v, selectItem) => {


              if (onChange)
                onChange(v);

            }} />
          </>
        )

      }
    },
    {
      title: '可否为空',
      dataIndex: 'cannull',
      hideInForm: false,
      hideInSearch: true,
      hideInTable: false,

      valueEnum: {
        "1": { text: '可以为空', status: 'Default' },
        "2": { text: '不能为空', status: 'Default' },
      },

      rules: [
        {
          required: false,
          message: '可否为空为必填项',
        },
      ],
      renderText: (val, record) => {

        try {
          if (record.cannull === "1")
            return "可以为空";
          else
            return "不能为空";
        } catch (error) {
          return "";
        }

      },
      renderFormItem: (_, { type, defaultRender, onChange, ...rest }, form) => {
        let id = form.getFieldValue('cannull');

        if (id == null || id === "") {
          id = "1";
          if (onChange)
            onChange(id);
        }
        // sval=form.getFieldValue('attrType');
        //console.log("cannull:" + id);
        return (
          <>
            <Select placeholder="请选择" defaultValue={id} onChange={(v) => {


              if (onChange)
                onChange(v);
            }}>
              <Option value="1">可以为空</Option>
              <Option value="2">不能为空</Option>
            </Select>
          </>
        )

      }

    },

    {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      sorter: true,
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
      hideInForm: true,
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

    }])

}

const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const [pagination, setPagination] = useState<BackPagination>({ pageNo: 1, pageSize: 10 });
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();

  const [compareModalVisible, handlecompareModalVisible] = useState<boolean>(false);
  const [compareModalShowinfo, handlecompareModalShowinfo] = useState<boolean>(false);
  const [compareModalvalue, setcompareModalvalue] = useState<{ editDataId: string, editOriDataId: string, editAction: string }>();



  const [checkCls, SetCheckCls] = useState<boolean>(true);


  const [clsNameval, setClsNameval] = useState<string>("");

  const [expandedRowKeys,setexpandedRowKeys]=useState<string[]>([]);
  const getExpandedRow=(record)=>{
    return <DataLogTable dataId={record.id} />;
  }


  const columns: ProColumns<TableListItem>[] = attrColumn().concat([


    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {

        let editObj: MyEditObj = {};
        if (record.myEdit)
          editObj = JSON.parse(record.myEdit) as MyEditObj;

        return <>


          {!isnull(editObj) &&editObj.auditState==='1'&& (editObj.editAction === "1" || editObj.editAction === '2') && (
            <>
              <a
                onClick={() => {

                  setcompareModalvalue({ editDataId: editObj.editDataId, editOriDataId: record.id, editAction: editObj.editAction });
                  handlecompareModalShowinfo(false);

                  handlecompareModalVisible(true);


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
                onClick={() => {

                  setcompareModalvalue({ editDataId: editObj.editDataId, editOriDataId: record.id, editAction: editObj.editAction });
                  handlecompareModalShowinfo(true);
                  handlecompareModalVisible(true);

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
                onClick={() => {
                  handleUpdateModalVisible(true);
                  const data = deepClone(record) as FormValueType;
                  data.title = "编辑";



                  let id = data.clsId;
                  let sval = "1";
                  if (id !== undefined && id != null && id !== "") {
                    SetCheckCls(true);
                    sval = "2"
                  }
                  else {
                    sval = "1";
                    SetCheckCls(false);
                  }

                  data.attrType = sval;
                  if (!data.dataTypeId)
                    data.dataTypeId = "";



                  setStepFormValues(data);

                }}
              >
                <Tooltip title="编辑">
                  <IconFontNew type="icon-btn-edit" title="编辑" />
                </Tooltip>
              </a>
              <Divider type="vertical" />
            </>
          )}

          {(isnull(editObj) || (!isnull(editObj)&& editObj.auditState==='1'&&toNumber(editObj.editAction)<2) ) && (
            <>

              <Popconfirm
                title='确定删除?'
                onConfirm={async () => {


                  await remove(record.id);
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }

                }}
                onCancel={() => { }}
                okText="确定"
                cancelText="取消"
              >
                <a
                  href="#"
                >
                  <Tooltip title="删除">
                    <IconFontNew type="icon-btn-delete" title="删除" />
                  </Tooltip>
                </a>
              </Popconfirm>
            </>
          )}


        </>
      }
    }]);


  return (
    <PageHeaderWrapper title={' '}
      content={' '}>
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
        pagination={{
          defaultPageSize:20,
          total: pagination?.total,
          pageSize: pagination?.pageSize||20,
          current: pagination?.pageNo
        }}

        rowClassName={(record, index) => {
          if (!isnull(record.myEdit)) {
            const editObj = JSON.parse(record.myEdit) as MyEditObj;

            
          if(editObj&&(editObj.auditState==="1"))
          return "localEdit";
          if(editObj&&(editObj.auditState==="2"))
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

        options={{ reload: true, density: false }}
        toolBarRender={(action, { selectedRows }) => [
          <div className="toolbarTip">
          <Alert message="双击行查看修改日志"  closable showIcon icon={<IconFontNew type="icon-xiangqing" />}/>
          </div>,
          <Button type="primary" onClick={() => { SetCheckCls(false); handleModalVisible(true); }} >
            <PlusOutlined /> 新建
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

      <EditCompareForm showinfo={compareModalShowinfo} modalVisible={compareModalVisible} onCancel={
        () => {
          handlecompareModalVisible(false);
        }} title="编辑改动[属性]" value={compareModalvalue}
        onSubmit={async (success) => {

          if (success) {
            handlecompareModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}

      />


      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}

        onSubmit={async (data) => {

          const clsIdVal = data.clsId;
          // debugger;
          //console.log(JSON.stringify(clsIdVal));

          const success = await handleAdd({ ...data, clsName: clsNameval });
          if (success) {


            if (data.shouldclose) {
              handleModalVisible(false);

            }
            else
              message.info("可以修改数据继续添加!");




            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}


      />


      {stepFormValues && Object.keys(stepFormValues).length ? (

        <div>

          <EditForm modalVisible={updateModalVisible} onCancel={
            () => {
              handleUpdateModalVisible(false);
            }} title="编辑属性" values={stepFormValues}
            onSubmit={async (data) => {
              const success = await handleUpdate({ ...data, clsName: clsNameval });
              // const success = await handleUpdate(value);
              if (success) {
                handleUpdateModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
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

