import React, { useState, useRef } from 'react';


import _ from 'lodash';



import './comstyle.less';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { SorterResult } from 'antd/lib/table/interface';
import { Button, Tooltip, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {query }from '@/services/dataLogService';
import { IconFontNew } from './KIcon';
import { BackPagination } from '@/pages/KgClassList/data';
import { formatDate } from '@/utils/utils';
import EditForm from '@/pages/ModifyList/components/EditForm';

import {TableListItem as EditData} from '@/pages/ModifyList/data';

export interface DataLogTableProps {

    dataId:string;
}
export interface DataHis {


    id: string;
    editUserName:string;
    dataId: string;//"1",// varchar(64) comment '编辑数据的id',
    editDataPre:string;
    editDataNext:string;
    editAction:string;
   
    dataType:'1' | '2' | '3' | '4' | '5' | '6' | '7';// "6",// varchar(2) comment '1:领域，2：目录，3概念，4属性，5关系，6实体,7实体关系'，
    
  
  }


// 更多属性，自定义添加，多层嵌套纯显示
const DataLogTable:  React.FC<DataLogTableProps> = (props) => {

    const [sorter, setSorter] = useState<string>('');

    const[modelvalue,setmodelvalue]=useState<EditData>({});
    const[updateModalVisible,handleUpdateModalVisible]=useState<boolean>(false);
    const [pagination, setPagination] = useState<BackPagination>({ pageNo: 1, pageSize: 10 });

    const dvref=useRef();

    const {dataId}=props;


    
     const cols:ProColumns<DataHis>[]=[
        {
          title: 'id',
          dataIndex: 'id',
          hideInForm: true,
          hideInSearch: true,
          hideInTable: true,
        },
        {
          title: '名称',
          dataIndex: 'editUserName',
          rules: [
            {
              required: true,
              message: '名称为必填项',
            },
          ],
          renderText: (val: string, record) => {
      
            

            let name="";
            let iconname="icon-btn-add";
    
            if(record.editUserName&&record.editUserName.indexOf(',')>-1)
            {
              name="多人修改";
              iconname="icon-modify";
            }
    else{
            if(record.editAction==="1")
            {
              name="新增";
              iconname="icon-btn-add";
            }
            
            if(record.editAction==="2")
            {
              name="修改";
              iconname="icon-modify";
            }
            
            if(record.editAction==="3")
            {
              name="删除";
              iconname="icon-btn-modify-close";
            }
          }
            
     
            return <>
                {record.editUserName} 于 {formatDate(record.editDate)} <span><IconFontNew type={iconname} /> {name}  </span>了数据 <a href='javascript:void(0);' onClick={
                    ()=>{

                        let detail:EditData={
                            editAction:record.editAction,
                            dataType:record.dataType,
                            editOriDataId:record.editDataNext,
                            editDataId:record.editDataPre,
                            auditRstId:record.editDataNext,
                            modelType:"log",
                        }
                       // debugger;
                        setmodelvalue(detail);
                        handleUpdateModalVisible(true);

                    }
                }>查看详情</a> 
            </>;
          }
        },
        {
            title: '操作',
            dataIndex: 'option',
            hideInTable:true,
            valueType: 'option',
            render: (_, record) => {
            
             return  <>
      
      
                <a
                  onClick={() => {
      
                  }}
                >
                  <Tooltip title="显示修改">
                    <IconFontNew type="icon-detail" />
                  </Tooltip>
                </a>
                  </>
            }
        }
    ];


  return <>
  <div className="logdv" ref={dvref}>
      <Row className="fstrow">
  <Button onClick={()=>{
      if(dvref.current)
      {
      //dvref.current.parentElement.parentElement.style="display:none"
     // debugger;
      dvref.current.parentElement.parentElement.previousElementSibling.click("test")

    }
      
  }}>关闭日志</Button>
  </Row>
  <Row >
      <Col span='24'>
<ProTable
        className="usetrborder nohead nolefticon"
        headerTitle=""
       
        rowKey="id"
        onChange={(_pagination, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<any>;
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

        search={false}
        toolBarRender={false}
        options={false}
        // toolBarRender={(action, { selectedRows }) => [
        //   <Button type="primary" onClick={() => {}}>
        //     <PlusOutlined /> 新建
        //   </Button>,
         
        // ]}
        // tableAlertRender={({ selectedRowKeys, selectedRows }) => (
        //   <div>
        //     已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
        //     <span>

        //     </span>
        //   </div>
        // )}
        request={(params) => {


          
            params.dataId = dataId;


          const rst = query(params);
          rst.then((a) => {
            //  console.log(JSON.stringify(a));

            if (a && a.pagination) {

              setPagination({
                pageNo: a.pagination.pageNo,
                pageSize: a.pagination.pageSize,
                total: a.pagination.totalCount,
              })
            }
           
          }
          );
          return rst;
        }}
        columns={cols}
        // rowSelection={{}}
      />
      </Col>
</Row>
</div>


<EditForm modelvalue={modelvalue}  showinfo={true}    dataType={modelvalue.dataType} modalVisible={updateModalVisible} onCancel={
        () => {
          handleUpdateModalVisible(false);
        }} title="详情" 
        onSubmit={async () => {

          handleUpdateModalVisible(false);
         
        }}

      />
  </>

}



export default DataLogTable;