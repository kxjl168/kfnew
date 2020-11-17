import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';

import { fakeAccountLogin } from '@/services/login';
import { setAuthority, setKey } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { setToken } from '@/utils/token';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);


     // debugger;
      // Login successfully
      if (response.status === 'ok') {

      //  console.log(response);
        if(response.data==='用户不存在或密码错误')
  {
    setAuthority("nologin");
    window.location.href = '/';
    return;
  }


        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
      else{
        setAuthority("nologin");
      }
    },

    logout({},{call,put}) {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note

       put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          data:{
            token: ''
          }
        },
      });

      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
     // setAuthority(payload.currentAuthority);
      setToken(payload.data.token);
    //  debugger;
      let authority="user";
      try {
        
    
     //  let roleidstring=payload.data.tokenName.split('_')[1];
       let roleids=payload.data.role_id.split(',');
       for (let index = 0; index < roleids.length; index++) {
         const role = roleids[index];
         if(role==="kg-admin")
         {
          authority="admin";
         }
       }
      } catch (error) {
        
      }

      //console.log(authority);

      setKey("app_key",payload.data.accessKey);
      setKey("app_secret",payload.data.accessSecret);

       setAuthority(authority);
     //  console.log(authority+" "+JSON.stringify( payload));

      return {
        ...state,
     
        status: payload.status,
        type: payload.type,
        currentAuthority: authority
      };
    },
  },
};

export default Model;
