import request from '@/utils/request';
import { TableListParams, TableListItem } from './data';

//关系存储

const urlpre:string = "/kb/kg/kurl";


const searchtxtfun:string = "/searchurl";

const searchtipfun:string = "/searchtip";

const levelfun:string = "/level";

const showurlfun:string = "/showurl";
const hideurlfun:string = "/hideurl";
const updateurlfun:string = "/updateurl";
const deleteurlfun:string = "/deleteurl";
const asyncEntityRelationfun:string = "/asyncEntityRelation";


const startspiderfun:string = "/startspider";
const stopSpiderfun:string = "/stopspider";
const passallurlfun:string = "/passallurl";





export async function level(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + levelfun, {
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



export async function passallurl(params?: TableListItem) {
  // console.log(JSON.stringify(params));
  
  params.id=parseInt(params.id);

   return request(urlpre + passallurlfun, {
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


export async function showurl(params?: TableListItem) {
  // console.log(JSON.stringify(params));
  
  params.id=parseInt(params.id);

   return request(urlpre + showurlfun, {
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

 

export async function hideurl(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + hideurlfun, {
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


 

 

 
export async function startSpider(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + startspiderfun, {
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
 

 
export async function stopSpider(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + stopSpiderfun, {
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
 
 
export async function asyncEntityRelation(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + asyncEntityRelationfun, {
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
 
 

export async function updateurl(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + updateurlfun, {
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


 

export async function deleteurl(params?: TableListItem) {
  // console.log(JSON.stringify(params));
     
   return request(urlpre + deleteurlfun, {
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
