import { request } from '@umijs/max';

interface ISaveData {
  router: string;
  code: string;
  method: 'post' | 'get' | 'delete' | 'put';
}

interface IDeleteData {
  router: string;
  method: 'post' | 'get' | 'delete' | 'put';
}

interface IKV {
  key: string;
  value: any
}


export async function saveFuncService(data: ISaveData,) {
  return request('/api/saveFunction', {
    method: 'POST',
    data,
  });
}

export async function getFuncListService() {
  return request('/api/listFunctions', {
    method: 'GET',
  });
}

export async function deleteFuncService(data: IDeleteData,) {
  return request('/api/deleteFunction', {
    method: 'POST',
    data,
  });
}

export async function getFunctionDetailService(data: IDeleteData,) {
  return request('/api/getFunctionDetail', {
    method: 'POST',
    data,
  });
}



export async function getAllKVService() {
  return request('/api/getAllKV', {
    method: 'GET',
  });
}
export async function getDetailByKeyService(key: string) {
  return request(`/api/getKV/${key}`, {
    method: 'GET',
  });
}

export async function saveKVService(data: IKV) {
  return request('/api/saveKV', {
    method: 'POST',
    data
  });
}

export async function deleteKVService(key: string) {
  return request(`/api/deleteKV/${key}`, {
    method: 'DELETE',
  });
}
