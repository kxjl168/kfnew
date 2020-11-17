import { DownOutlined, PlusOutlined, QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Button, Divider, Dropdown, Menu, message, Input, Select, Tooltip, Popover, Modal } from 'antd';
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
import { TableListItem, TableListPagination, BackPagination, MyEditObj } from './data';
import { get, query, update, add, remove, toaudit } from './service';
import { PaginationProps } from 'antd/lib/pagination';

import ClsSelect from '@/components/MyCom/ClsSelect';
import ProTypeSelect from '@/components/MyCom/ProTypeSelect';
import { get as getDir } from '@/pages/DirList/service';
import { get as getSub } from '@/pages/SubGraList/service';
import { get as getEditSub } from '@/pages/SubGraList/editservice';

import { get as getEntity } from '@/pages/EntityList/service';

import { get as getCls } from '@/pages/KgClassList/service';



import styles from './style.less';
import { Rule } from 'antd/es/form';
import Layout from '@/layouts/BlankLayout';


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

const handleAudit = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在提交');
  if (!selectedRows) return true;
  try {
    let ids = selectedRows.map((row) => row.id);
    // console.log(ids.toString());
    // return;

    await toaudit(
      ids
    );
    hide();
    message.success('提交成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('提交失败，请重试');
    return false;
  }
};

export const attrColumn = (): ProColumns<TableListItem>[] => {

  const [showCls, SetShowCls] = useState<boolean>(false);
  return (
    [{
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: true,
    },


    {
      title: '改动数据',
      dataIndex: 'editDataName',
      rules: [
        {
          required: true,
          message: '名称为必填项',
        },
      ],
  
      renderText: (oval: string, record) => {
        const editObj = record;
        let val=oval;
        if(isnull(val))
          val=record.newDataName;

          if(record.dataType==='7')
          val=val+'的关系';
        

        let typename="";
        //dataType:'1' | '2' | '3' | '4' | '5' | '6' | '7';// "6",// varchar(2) comment '1:领域，2：目录，3概念，4属性，5关系，6实体,7实体关系'，
        if(record.dataType==="1")
          typename="领域";

          if(record.dataType==="2")
          typename="目录";
          if(record.dataType==="3")
          typename="概念";
          if(record.dataType==="4")
          typename="属性";
          if(record.dataType==="5")
          typename="关系";
          if(record.dataType==="6")
          typename="实体";
          if(record.dataType==="7")
          {
          if(editObj.editAction==="1")
          typename="概念关系";
          else
          typename="实体关系";
        }


        
         // console.log(editObj);
          if (editObj.editAction === "1") {

            if(editObj.dataType==='7')
            return <Tooltip title={`${editObj.auditState === "1" ? '本地' : '待审核'}修改${typename}`} placement="topLeft" ><div><IconFontNew type="icon-modify" /> {editObj.auditState === "2" && <IconFontNew type="icon-time" />}{val}</div></Tooltip>;

            return <Tooltip title={`${editObj.auditState === "1" ? '本地' : '待审核'}新增${typename}`} placement="topLeft" ><div><IconFontNew type="icon-btn-add" /> {editObj.auditState === "2" && <IconFontNew type="icon-time" />} {val}</div></Tooltip>;
          }
          if (editObj.editAction === "2") {
            return <Tooltip title={`${editObj.auditState === "1" ? '本地' : '待审核'}修改${typename}`} placement="topLeft" ><div><IconFontNew type="icon-modify" /> {editObj.auditState === "2" && <IconFontNew type="icon-time" />}{val}</div></Tooltip>;
          }
          if (editObj.editAction === "3") {
            return <Tooltip title={`${editObj.auditState === "1" ? '本地' : '待审核'}删除${typename}`} placement="topLeft" ><div><IconFontNew type="icon-btn-modify-close" /> {editObj.auditState === "2" && <IconFontNew type="icon-time" />}{val}</div></Tooltip>;
          }

        

        return <><div >{val}</div></>;
      }

    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      hideInForm: true,
      hideInSearch: true,
      hideInTable: false,
      initialValue: "1",
      valueEnum: {
        //'1:领域，2：目录，3概念，4属性，5关系，6实体,7实体关系'，
        "1": { text: '领域', status: 'Default' },
        "2": { text: '目录', status: 'Default' },
        "3": { text: '概念', status: 'Default' },
        "4": { text: '属性', status: 'Default' },
        "5": { text: '关系', status: 'Default' },
        "6": { text: '实体', status: 'Default' },
        "7": { text: '实体/概念关系', status: 'Default' },
      },

      rules: [
        {
          required: true,
          message: '改动类型为必填项',
        },
      ],

    },
    {
      title: '改动时间',
      hideInSearch: true,
      dataIndex: 'editDate',
      valueType:"dateTime",
    },

    
    // editAction: 2,// varchar(2) comment '编辑操作类型 1:新增，2:修改， 3:删除'

    {
      title: '操作类型',
      hideInSearch: false,
      hideInTable:true,
      dataIndex: 'editAction',
      valueEnum: {
        //'1:领域，2：目录，3概念，4属性，5关系，6实体,7实体关系'，
        "1": { text: '新增', status: 'Default' },
        "2": { text: '修改', status: 'Default' },
        "3": { text: '删除', status: 'Default' },

      },
      renderText: (v, record) => {
        let name = "";
        let iconname = "icon-btn-add";
        if (record.editAction === "1") {
          if(record.dataType==="7")
{
  name="修改";
  iconname="icon-modify";
}
else{
          name="新增";
          iconname="icon-btn-add";
          }
        }

        if (record.editAction === "2") {
          name = "修改";
          iconname = "icon-modify";
        }

        if (record.editAction === "3") {
          name = "删除";
          iconname = "icon-btn-modify-close";
        }


        return <span><IconFontNew type={iconname} /> {name}  </span>
      },

      rules: [
        {
          required: false,
          message: '名称为必填项',
        },
      ],
    },




    ])

}

const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const [pagination, setPagination] = useState<BackPagination>({ pageNo: 1, pageSize: 10 });
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();


  const [checkCls, SetCheckCls] = useState<boolean>(true);

  const [modelvalue, setModelValue] = useState<any>({});
  const [modelvalueOld, setmodelvalueOld] = useState<any>({});
  const [modelshowinfo,setmodelshowinfo]=useState<boolean>(false);
  
  const [clsNameval, setClsNameval] = useState<string>("");

  const getModelData = async (record) => {

    let mval = {};
    if (record.dataType === "1") {
      mval = await   getEditSub(record.editDataId);
    }
    if (record.dataType === "2") {
      mval = await getDir(record.editDataId);
    }
    if (record.dataType === "3") {
      mval = await getCls(record.editDataId);
    }
    if (record.dataType === "6") {
      mval = await getEntity(record.editDataId);
    }

    return mval.data;
  }

  const getModelOldData = async (record) => {

    let mval = {};
    if (record.dataType === "1") {
      mval = await getSub(record.editOriDataId);
    }
    if (record.dataType === "2") {
      mval = await getDir(record.editDataId);
    }
    if (record.dataType === "3") {
      mval = await getCls(record.editDataId);
    }
    if (record.dataType === "6") {
      mval = await getEntity(record.editDataId);
    }

    return mval.data;
  }

  


  const columns: ProColumns<TableListItem>[] = attrColumn().concat([


    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
       
            <>
              <a
                onClick={async () => {


                 // const modeldata = await getModelData(record);
                  setModelValue(record);

                  setStepFormValues(record);

                  handleUpdateModalVisible(true);

                  // console.log('0:'+JSON.stringify(stepFormValues))
                  // console.log(JSON.stringify(data) )
                  // console.log("UpdateModalVisible:"+updateModalVisible);
                }}
              >

{(record.editAction !== "3") && (
    <Tooltip title="编辑">
    <IconFontNew type="icon-btn-edit" title="编辑" />
  </Tooltip>
)}

{record.editAction === "3" && (
      <Tooltip title="查看数据">
      <IconFontNew type="icon-btn-edit"  />
    </Tooltip>
)}

              
              </a>
              <Divider type="vertical" />
            </>
         


          <Popconfirm
            title='提交审核?'
            onConfirm={async () => {


              await toaudit(record.id);
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
              <Tooltip title="提交审核">
                <IconFontNew type="icon-to-audit" title="" />
              </Tooltip>
            </a>
          </Popconfirm>
          <Divider type="vertical" />

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
              <Tooltip title="删除本地改动">
                <IconFontNew type="icon-undo" title="" />
              </Tooltip>
            </a>
          </Popconfirm>

          {/* <Divider type="vertical" />
          <Popconfirm
            title={'确定执行' + (record.enabled === '1' ? '停用' : '启用') + '操作?'}
            onConfirm={async () => {

              const r = deepClone(record) as TableListItem;

              if (r.enabled === "1")
                r.enabled = '0';
              else
                r.enabled = '1';

              await update(r);
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
              {record.enabled === '1' && <span>停用</span>}
              {record.enabled === '0' && <span>启用</span>}
            </a>
          </Popconfirm> */}

        </>
      )
    }]);


  return (
    <PageHeaderWrapper title={' '}
      content={' '}>
      <ProTable<TableListItem>
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

          total: pagination?.total,
          pageSize: pagination?.pageSize,
          current: pagination?.pageNo
        }}
        options={{ reload: true, density: false }}
        toolBarRender={(action, { selectedRows }) => [
          // <Button type="primary" onClick={() => { SetCheckCls(false); handleModalVisible(true); }} >
          //   <PlusOutlined /> 新建
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
                        }

                      });
                    }

                    if (e.key === 'audit') {
                      Modal.confirm({
                        title: '操作确认',
                        icon: <ExclamationCircleOutlined />,
                        content: '确定提交审核数据?',
                        okText: '确认',
                        cancelText: '取消',
                        onOk: async () => {
                          await handleAudit(selectedRows);
                          action.reload();
                        }

                      });
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量撤销</Menu.Item>
                  <Menu.Item key="audit">批量提交审核</Menu.Item>
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
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
            <span>

            </span>
          </div>
        )}
        request={(params) => {
          params.pageSize=20;

          let rst = query({...params,auditState:'1'});
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

      <EditForm modelvalue={modelvalue}  showinfo={modelshowinfo} modelvalueOld={modelvalueOld}   dataType={stepFormValues.dataType} modalVisible={updateModalVisible} onCancel={
        () => {
          handleUpdateModalVisible(false);
        }} title="编辑改动" values={stepFormValues}
        onSubmit={async () => {

          handleUpdateModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }

        }}

      />


    </PageHeaderWrapper>
  );
};

export default TableList;

