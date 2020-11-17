import request from '@/utils/request';
import { TableListParams, TableListItem } from './data';

//关系存储

const urlpre:string = "/kb/kg/kg-search";

const searchfun:string = "/search";
const searchtipfun:string = "/searchtip";
const searchtxtfun:string = "/searchContext";



export async function searchtxt(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + searchtxtfun, {
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


export async function searchtip(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + searchtipfun, {
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

export async function search(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + searchfun, {
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
 