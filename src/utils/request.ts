/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, message, Modal } from 'antd';
import { getToken, setToken } from './token';
import { DES, mode, pad, enc } from 'crypto-js';

import SignUtil from './signUtil';
import { isnull } from './utils';
import { getKey, setAuthority, setKey } from './authority';



const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): any => {
  const { response } = error;
  //debugger;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    const errorRet = {
      isSuccess: false,
      errorMsg: '请求失败',
      body: [],
    };
  //  debugger;
    if (response.status === 401) {
    //  message.error("您的账号已在其他地方登录或者登录信息已过期!");
      notification.error({
        message: `请求错误`,
        description: `您的账号已在其他地方登录或者登录信息已过期!`,
      });
     
      setTimeout(() => {
        const login = '/user/login';
      const { href } = window.location;
      if (href.indexOf(login) === -1) {
        window.location.href = login;
      }
      }, 1000);
    //  return errorRet;
      
    } else if (response.status === 500) {
      message.error(`数据请求失败 ${response.statusText}`);
      return errorRet;
    } else if (response.status === 504) {
      message.error(`服务不可用，请刷新页面或联系管理员`);
      return errorRet;
    } else {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
      return errorRet;
    }
  }
  else{
   // setAuthority("nologin");
  }
};


/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
 credentials: 'include', // 默认请求是否带上cookie
  timeout: 15000,
  requestType: 'form',
  params: {
   // Token: "xxx" // 所有请求默认带上 token 参数
  },
});

//const host = "http://localhost:8080/";


const HMACSHA256 = "HMAC-SHA256";
const FIELD_SIGN = "sign";
const FIELD_SIGN_TYPE = "sign_type";
const KEY_FILED = "AccessKeyId";
const LOCAL_KEY_FILED = "key";

//配置的admin的key信息
let app_key = getKey("app_key")|| "test";
let app_secret =  getKey("app_secret")|| "922233ce10fa47a1af8491d2fbd20ac6";


/**
 * 增加签名
 * @param {} config
 */
function addSign(config) {

  //console.log(config.params);
   app_key = getKey("app_key")|| "test";
   app_secret =  getKey("app_secret")|| "922233ce10fa47a1af8491d2fbd20ac6";
  
  //debugger;
  if (config.params) {
    if (isnull(config.data))
      config.data = config.params;
  }

  if (isnull(config.data)){
    config.data = {}
  }

    delete config.data[FIELD_SIGN];


  //增加签名，
  config.data[KEY_FILED] = app_key;
  config.data[FIELD_SIGN_TYPE] = HMACSHA256;
  config.data[LOCAL_KEY_FILED] = app_secret;

  var random = SignUtil.createNonceStr();
  config.data["random"] = random;

  config.data = SignUtil.formatParam(config.data);

  var data = SignUtil.HMACSHA256(config.data)

  //format json -> string
  //

  config.data[FIELD_SIGN] = data;
  delete config.data[LOCAL_KEY_FILED];

  if (config.params)
    config.params={};

    if(config.method==="get")
    config.params=config.data;
  // config.data = qs.stringify(config.data) // 转为formdata数据格式

  return config;

}



const host = "";
/**
 * 处理header
 */
request.interceptors.request.use(async (url, options) => {
  let c_token = getToken();

 // debugger;
  // console.log("request c_token:"+c_token);

  

 // let newoption=options;//addSign(options);
 //debugger;
  let newoption=options;

  //debugger;
  if(options.data&&options.data.get&&options.data.get('file')!=null)
  {
    //上传不加密
  }
  else
    newoption=addSign(options);

//debugger;
  const headers = newoption.headers ? newoption.headers : {};
  if (c_token) {
    headers['authorization'] = c_token;
  }
  if (!headers['rt']) {
    headers['rt'] = new Date().getTime();
  }




  //console.log(newoption);
  return (
    {
      url: host + url,
      options: {  ...newoption,headers: headers},
    }
  );
})





request.interceptors.response.use(async (response, options) => {

  //debugger;
  const proResponse: ProResponseType = {};
  const res: WZResponseType = await response.clone().json();

  if (response.status === 200) {


    if(res.errorCode==="-1") //token失效
    {
      setToken("");
    setAuthority("nologin");
  
    setKey("app_key","");
    setKey("app_secret","");
    }


    


    // if (!res.isSuccess && res.errorMsg && res.errorMsg != '') {
    //   message.error(res.errorMsg)
    // }



    proResponse.status = 'ok';
    proResponse.success = res.isSuccess;
    proResponse.data = res.body||res.data;
    proResponse.errorMsg = res.errorMsg;
    

    if(res.pagination)
    {
      proResponse.pagination=res.pagination;

    }



  }
  else if(response.status === 401) {
    
    setToken("");
    setAuthority("nologin");
  
    setKey("app_key","");
    setKey("app_secret","");
   // window.location.href = "/Welcome";
  }
   else {
    proResponse.status = response.status;
    proResponse.success =false;
    proResponse.msg = res.errorMsg;
  }

  return proResponse;
})



export default request;

export interface WZResponseType {
  isSuccess: boolean;
  errorCode: string;
  errorMsg: string;
  body: any;
  
}

export interface ProResponseType {
  success?: boolean;
  msg?: string;
  data?: any;
  status:any;
  total?: number;
  current?: number;
  pageSize?: number;
  pagination?:any;
  errorMsg?:string;
}


export function handleResponse(res: WZResponseType, doSuccess?: Function, doFailure?: Function) {
  if (!res) return;
  if (res.isSuccess) {
    if (doSuccess) {
      doSuccess();
    }
    message.success('操作成功');
  } else {
    let { errorMsg } = res;
    if (!errorMsg) {
      errorMsg = '';
    }

    if (doFailure) {
      doFailure();
    }
    message.error(`操作失败 ${errorMsg}`);
  }
}
