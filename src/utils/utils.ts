import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';
import _ from 'lodash';


export function isnull(obj) {
  return !obj || obj == null || JSON.stringify(obj) == "{}";
 }

 export  function formatDate(num,fmt) {

  const d=new Date(num);

  let o = {
  "M+": d.getMonth() + 1, //月份
  "d+": d.getDate(), //日
  "h+": d.getHours(), //小时
  "m+": d.getMinutes(), //分
  "s+": d.getSeconds(), //秒
  "q+": Math.floor((d.getMonth() + 3) / 3), //季度
  "S": d.getMilliseconds() //毫秒
  };
  fmt = fmt || "yyyy-MM-dd hh:mm:ss";
  if (/(y+)/.test(fmt))
  fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
  }


  /**
   * 随机较亮颜色
   */
export function GetRandomLightColor(icolor,add){

let color="";//#fff

  for (let index = 0; index < 6; index++) {
    color += _.random(15).toString(16);
}

if(!isnull(icolor))
color=icolor;


let num = parseInt(color,16);

let R = (num >> 16) ;

let G = ((num >> 8) & 0x00FF) ;

let B = (num & 0x0000FF) ;



  //转换为YUV

  let Y = ( (  66 * R + 129 * G +  25 * B + 128) >> 8) +  16;
  let U = ( ( -38 * R -  74 * G + 112 * B + 128) >> 8) + 128;
  let V = ( ( 112 * R -  94 * G -  18 * B + 128) >> 8) + 128;

  if(add)
  Y=Y+add;
  else{
  //Y +亮度
  if(Y<150)
  Y=160;
}



let C = Y - 16
let D = U - 128
let E = V - 128

R = clip(( 298 * C           + 409 * E + 128) >> 8)
G = clip(( 298 * C - 100 * D - 208 * E + 128) >> 8)
B = clip(( 298 * C + 516 * D           + 128) >> 8)

let rstcolor= "#"+ (G | (B << 8) | (R << 16)).toString(16);
if(rstcolor==='#000'||rstcolor==='#000000')
rstcolor='#8aa';

return rstcolor;

}

export function clip(v)
{
  

  let rst=v;
  if(v<0)
  rst=30;
  if(v>255)
  rst=205;
  return rst;
}


 /**
  * 获取更亮或者更暗的颜色 
  * @zj
  * @param col 
  * @param amt 
  */
 export function  LightenDarkenColor(col, amt) {
  
  var usePound = false;

  if(isnull(col))
  return "#999";


  if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
  }

  var num = parseInt(col,16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255-50;
  else if  (r < 0) r = 0+50;

  var b = ((num >> 8) & 0x00FF) + amt;

  if (b > 255) b = 255-50;
  else if  (b < 0) b = 0+50;

  var g = (num & 0x0000FF) + amt;

  if (g > 255) g = 255-50;
  else if (g < 0) g = 0+50;

  return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

 }

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}


/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/', target = '_self' }) =>
      (path && target !== '_blank' && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};
