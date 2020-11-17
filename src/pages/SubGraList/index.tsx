import { DownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Button, Divider, Dropdown, Menu, message, Input, Tooltip, Modal, Alert } from 'antd';
import React, { useState, useRef, cloneElement } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import { deepClone, isnull } from '@/utils/utils';

import { IconFontNew } from '@/components/MyCom/KIcon';

import EditForm, { EditFormData } from './components/EditForm';
import {MyEditObj} from '../ModifyList/data';
import TestDom from './components/SelfEditFormtsx';

import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem, TableListPagination, BackPagination } from './data.d';
import { get, query, update, add, remove } from './service';
import { PaginationProps } from 'antd/lib/pagination';

import  './style.less';
import DataToNeo4jForm from './components/DataToNeo4jForm';
import EditCompareForm from './components/EditCompareForm';
import { toNumber } from 'lodash';
import DataLogTable from '@/components/MyCom/DataLogTable';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await add({ ...fields });
    hide();
    message.success('添加成功');
    return true;
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
export const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await update(fields);
    hide();

    message.success('配置成功');
    return true;
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

export  const subCol:ProColumns<TableListItem>[]=[
  {
    title: 'id',
    dataIndex: 'id',
    hideInForm: true,
    hideInSearch: true,
    hideInTable: true,
  },
  {
    title: '名称',
    className:'namewidth',
    dataIndex: 'name',
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



      return <div>{val}</div>;
    }
  },
  {
    title: '描述',
    dataIndex: 'remark',
    valueType: 'textarea',
    hideInSearch: false,
    hideInTable: false,
    hideInForm: false,
  },
  {
    title: 'IRI',
    dataIndex: 'iri',

    rules: [
      {
        required: false,
        message: '格式:http开始url地址',
        pattern: /^http.*$/g,
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

    //  initialValue:'1.0.0',
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

  }]

const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const [pagination, setPagination] = useState<BackPagination>({ pageNo: 1, pageSize: 10 });
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<FormValueType>({});
  const actionRef = useRef<ActionType>();

  const [neoFormvisible, setneoFormvisible] = useState<boolean>(false);
  const [nsubkgId, setNsubkgId] = useState<string>("");
  const [nsubkgName, setNsubkgName] = useState<string>("");


  const [compareModalVisible, handlecompareModalVisible] = useState<boolean>(false);
  const [compareModalShowinfo, handlecompareModalShowinfo] = useState<boolean>(false);
  const [compareModalvalue,setcompareModalvalue]=useState<{editDataId:string,editOriDataId:string,editAction:string}>();


  const [expandedRowKeys,setexpandedRowKeys]=useState<string[]>([]);


  const columns: ProColumns<TableListItem>[] = subCol.concat(

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        let editObj: MyEditObj = {};
        if (record.myEdit)
          editObj = JSON.parse(record.myEdit) as MyEditObj;

       return  <>


          <a
            onClick={() => {

              setNsubkgId(record.id);
              setNsubkgName(record.name);
              setneoFormvisible(true);
            }}
          >
            <Tooltip title="同步领域数据至Neo4j">
              <IconFontNew type="icon-save-neo4j" />
            </Tooltip>
          </a>
          <Divider type="vertical" />

          {!isnull(editObj) && editObj.auditState==='1'&&(editObj.editAction === "1" || editObj.editAction === '2') && (
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
            onClick={(e) => {
              handleUpdateModalVisible(true);
              const data = deepClone(record) as FormValueType;
              data.title = "编辑概念";
              setStepFormValues(data);


              e.stopPropagation();
              // console.log('0:'+JSON.stringify(stepFormValues))
              // console.log(JSON.stringify(data) )
              // console.log("UpdateModalVisible:"+updateModalVisible);
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
          <Popconfirm 
            title='确定删除?'
            onConfirm={async (e) => {


              await remove(record.id);
              if (actionRef.current) {
                actionRef.current.reload();
              }

           
              e.stopPropagation();
            }}


              

            onCancel={(e) => {  e.stopPropagation(); }}
            okText="确定"
            cancelText="取消"
          >
            <a
              href="#"
              onClick={(e)=>{
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
    });


    const getExpandedRow=(record)=>{
      return <DataLogTable dataId={record.id} />;
    }


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

          total: pagination?.total,
          pageSize: pagination?.pageSize,
          current: pagination?.pageNo
        }}

        rowClassName={(record,index)=>{


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
          <Button type="primary" onClick={() => handleModalVisible(true)}>
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

      <DataToNeo4jForm modalVisible={neoFormvisible} subkgName={nsubkgName} subkgId={nsubkgId} onCancel={() => {
        setneoFormvisible(false)
      }} onComplete={() => { }} title="数据同步" />


      <CreateForm title="新建领域" onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}

      />

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


      {stepFormValues && Object.keys(stepFormValues).length ? (

        <div>

          <EditForm modalVisible={updateModalVisible} onCancel={
            () => {
              handleUpdateModalVisible(false);
            }} title="编辑领域" values={stepFormValues}
            onSubmit={async (value) => {
              const success = await handleUpdate(value);
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
