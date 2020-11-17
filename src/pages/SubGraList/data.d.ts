export interface TableListItem {


  id: string;
  clsName: string;
  sort: number;
  dirId?: string;
  enabled: string;
  deleted: string;
  version?: string;
  createdTime?: string;
  updatedTime?: string;

  sorter?: string;

  myEdit?:string;

  myEditObj?:{
    auditState:"1"|'2',
    editAction:"1"|'2'|'3',
    editDataId:string,
  }

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
