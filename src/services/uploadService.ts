import request from '@/utils/request';
import { TableListParams, TableListItem } from './data';

//关系存储

const urlpre:string = "/kb/kgdataImport";

const importClsRelationDataByExcelfun:string = "/importClsRelationDataByExcel";

const importEntityRelationDataByExcelfun:string = "/importEntityRelationDataByExcel";







export async function uploadImg(params:any) {
  // console.log(JSON.stringify(params));
     
   return request("/kb/kg/FileSvr/UploadFile", {
     method: 'POST',
     // headers: {
     //   'Content-Type': 'application/x-www-form-urlencoded'
     // },
     timeout: 60000,
 
     data:params,
   });
 }
 



export async function importClsRelationDataByExcel(params:any) {
 // console.log(JSON.stringify(params));
    
  return request(urlpre + importClsRelationDataByExcelfun, {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
    timeout: 60000,

    data:params,
  });
}


export async function importEntityRelationDataByExcel(params:any) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + importEntityRelationDataByExcelfun, {
     method: 'POST',
     // headers: {
     //   'Content-Type': 'application/x-www-form-urlencoded'
     // },
     timeout: 60000,
 
     data:params,
   });
 }
 