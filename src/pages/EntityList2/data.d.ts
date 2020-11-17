export interface TableListItem {


  id: string;
  clsName: string;
  clsId:string;
  sort?: number;
  dirId?: string;
  enabled?: string;
  deleted?: string;
  version?: string;
  createdTime?: string;
  updatedTime?: string;

  sorter?: string;

  subKgId:string;
  subKgName:string;

  attrs?:any;

  /**
   * 实体属性
   */
  properties?:any;

  /**
   * cls属性，不可修改
   */
  clsProperties?:any;
  /**是否有本地修改 1未提交，2待审核 */
  myEdit?:string;


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
