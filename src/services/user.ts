import request from '@/utils/request';

export async function query(): Promise<any> {
  console.log("user/fetchuser...");
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/kb/kg/auths/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
