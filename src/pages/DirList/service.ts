import request from '@/utils/request';
import { TableListParams, TableListItem } from './data';

const urlpre:string = "/kb/kg/kg-dir-tree";

const listfun:string = "/list";
const getfun:string = "/get";
const addfun :string= "/add";
const modifyfun:string = "/modify";
const delfun:string = "/del";

const getTreefun:string = "/getTreeData";


const auditfun:string = "/audit";



export async function audit(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + auditfun, {
     method: 'POST',
     // headers: {
     //   'Content-Type': 'application/x-www-form-urlencoded'
     // },
     
     requestType: 'form',
     data: {
       ...params,
     },
   });
 }
 

export async function getTree(params?:any ) {
  //console.log(JSON.stringify(params));
    
  return request(urlpre + getTreefun, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
    
    requestType: 'form',
    data: {
      ...params
    }
  });
}

export async function query(params?: TableListItem) {
  //console.log(JSON.stringify(params));
    
  return request(urlpre + listfun, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
    
    requestType: 'form',
    data: {
      ...params,
    },
  });
}


export async function get(id: string) {
  return request(urlpre + getfun + "/" + id, {
    method: 'GET',
  
  });
}


export async function remove( id: string ) {
  return request(urlpre + delfun + "/" + id, {
    method: 'POST',
  
  });
}

export async function add(params: TableListItem) {
  return request(urlpre + addfun, {
    method: 'POST',
    data: {
      ...params,
      method: 'add',
    },
  });
}

export async function update(params: TableListItem) {


  
  return request(urlpre + modifyfun, {
    method: 'PUT',
    data: {
      ...params,

    },
  });
}
