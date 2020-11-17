import request from '@/utils/request';
import { TableListParams, TableListItem } from './data';

//关系存储

const urlpre:string = "/kb/kg/kg-graphic-edit";

const listfun:string = "/getontology";

const modifyfun:string = "/saveontology";
const toNeo4jfun:string = "/dataToNeo4j";


const getSubKgRelationfun:string = "/getSubKgRelation";
const testDbConncetfun:string = "/testDbConncet";




export async function getSubKgRelation(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + getSubKgRelationfun, {
     method: 'POST',
     // headers: {
     //   'Content-Type': 'application/x-www-form-urlencoded'
     // },
     requestType: 'form',
     timeout:30000,
     data: {
       ...params,
     },
   });
 }
 
export async function TestNeo4jDb(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + testDbConncetfun, {
     method: 'POST',
     // headers: {
     //   'Content-Type': 'application/x-www-form-urlencoded'
     // },
     requestType: 'form',
     timeout:30000,
     data: {
       ...params,
     },
   });
 }


export async function toNeo4j(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + toNeo4jfun, {
     method: 'POST',
     // headers: {
     //   'Content-Type': 'application/x-www-form-urlencoded'
     // },
     requestType: 'form',
     timeout:30000,
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
    timeout:30000,
    requestType: 'form',
    data: {
      ...params,
    },
  });
}


export async function saveOrUpdate(params: TableListItem) {


  
  return request(urlpre + modifyfun, {
    method: 'POST',
    requestType: 'form',
    timeout: 35000,
    data: {
      ...params,

    },
  });
}
