import { reloadAuthorized } from './Authorized';

//检查是否为管理员
export function isAdmin() {
  let isadmin = false;
  const roles = getAuthority();
  if (roles != null) {

    isadmin = _.find(roles, r => {
      return r === 'admin';
    });

  }
  return isadmin
}


// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {


  //debugger;

  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority="nologin";
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  // if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
  //   return ['admin'];
  // }
  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}

export function getKey(str:string):any{
  let data=localStorage.getItem(str)==="undefined"?null:localStorage.getItem(str);
  return data;
}
export function setKey(str:string,val:string):any{
   localStorage.setItem(str,val)
  
}
