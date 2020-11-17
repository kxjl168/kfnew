import request from '@/utils/request';
import { TableListParams, TableListItem } from './data.d';

const urlpre:string = "/kb/kg/kg-sub-group";

const listfun:string = "/list";
const auditfun:string = "/audit";

const getfun:string = "/get";
const addfun :string= "/add";
const modifyfun:string = "/modify";
const delfun:string = "/del";





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
 


export async function query(params?: TableListItem) {
 // console.log(JSON.stringify(params));
    
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
