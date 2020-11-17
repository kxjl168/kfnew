import request from '@/utils/request';
import { TableListParams, TableListItem } from './data';

//const urlpre:string = "/test/kg-audit-data"; //mock
const urlpre:string = "/kb/kg/kg-edit-data";


const listfun:string = "/list";
const listAuditfun:string = "/listAudit";

const listAuditDonefun:string = "/listAuditDone";



const getfun:string = "/get";
const addfun :string= "/add";
const modifyfun:string = "/modify";
const delfun:string = "/del";

const toauditfun:string = "/toaudit";
const tolocalfun:string = "/tolocal";




export async function listAuditDone(params?: TableListParams) {

  return request(urlpre + listAuditDonefun, {
    method: 'POST',
    requestType: 'form',
    data: {
             ...params,
           },
  });
}



export async function listAudit(params?: TableListParams) {

  return request(urlpre + listAuditfun, {
    method: 'POST',
    requestType: 'form',
    data: {
             ...params,
           },
  });
}


export async function query(params?: TableListParams) {

  return request(urlpre + listfun, {
    method: 'POST',
    requestType: 'form',
    data: {
             ...params,
           },
  });
}


// export async function query(params?: TableListItem) {
//   //console.log(JSON.stringify(params));
    
//   return request(urlpre + listfun, {
//     method: 'POST',
//     // headers: {
//     //   'Content-Type': 'application/x-www-form-urlencoded'
//     // },
    
//   //  requestType: 'form',
//     data: {
//       ...params,
//     },
//   });
// }


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



export async function tolocal( id: string ) {
  return request(urlpre + tolocalfun + "/" + id, {
    method: 'POST',
  
  });
}

export async function toaudit( id: string ) {
  return request(urlpre + toauditfun + "/" + id, {
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

console.log(JSON.stringify( params));

  
  return request(urlpre + modifyfun, {
    method: 'PUT',
    data: {
      ...params,

    },
  });
}
