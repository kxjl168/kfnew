export interface TableListItem {


  id: string;

 
  kgEditDataId:string; //"2",// varchar(64) comment '提交的编辑数据id',
  dataType:'1' | '2' | '3' | '4' | '5' | '6' | '7';// "6",// varchar(2) comment '1:领域，2：目录，3概念，4属性，5关系，6实体,7实体关系'，
  editAction: '1' | '2' | '3';//"1",// varchar(2) comment '编辑操作类型 1:新增，2:修改， 3:删除'
  editDataId: string;//"1",// varchar(64) comment '编辑数据的id',
  editDataName:string;// "测试实体",// varchar(64) comment '编辑数据的id',
  newDataName:string;

  auditUser:string;// "1",// varchar(64) comment '审核人',
  auditUserName:string;

  auditRst:string;// 0,// varchar(2) comment '审核结果 1:通过， 2：合并通过，3:未通过',
  auditInfo:string;// '',// varchar(500) comment '审核意见，不通过时使用',

  auditDate:string;// '',// timestamp comment '审核时间',

  editOriDataId:string;

  auditState:'1'|'2'|'3'|'4'|'5',

  
  editUserDate:string;
  editUserName:string;
  editUser:string;
/**审核后的数据快照id */
  auditRstId:string;

/**
 * 显示模式，日志，其他
 */
  modelType:'log'|undefined;

}

/**
 * 表示修改数据
 */
export interface MyEditObj
{
  id?:any;
  auditState:"1"|'2';
  editAction:"1"|'2'|'3';
  editDataId:string;
  /** varchar(2) comment '1:领域，2：目录，3概念，4属性，5关系，6实体,7实体关系'， */
  dataType?:'1' | '2' | '3' | '4' | '5' | '6' | '7';// "6",// varchar(2) comment '1:领域，2：目录，3概念，4属性，5关系，6实体,7实体关系'，
}


//后台分页
export interface BackPagination {
  pageSize: number;
  pageNo: number;
  total:number;
}

//前台组件分页
export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}


export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  // sorter?: string;
  // status?: string;
  name?: string;
  // desc?: string;
  // key?: number;
  pageSize?: number;
  currentPage?: number;
}
