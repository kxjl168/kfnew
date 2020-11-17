// @ts-ignore
import cookie from 'react-cookies';
import request from 'umi-request';
import defaultSettings from '../../config/defaultSettings';

export const TOKEN_NAME = 'WZ-Token';

export function getToken(path?: string): string {

  const j=cookie.load("ktoken",{path:"/"});

  return cookie.load(TOKEN_NAME, { path: path || '/' }) ||j|| '';
}

export function setToken(token: string, path?: string): void {
  cookie.remove(TOKEN_NAME, { path: path || '/' });
  if (token) {
    cookie.save(TOKEN_NAME, token || '', { path: path || '/' });
  }
}






export function checkToken() {
  let token = getToken();
  const login = '/user/login';
  const { href } = window.location;
  if (!token && href.indexOf(login) === -1) {
    window.location.href = login;
  }
  token = !token ? 'token' : token;
  request(`/ims/auths/checkToken/${token}`, {
    method: 'GET',
  }).then(res => {
    if (!res && href.indexOf(login) === -1) {
      window.location.href = login;
    }
  });
}
