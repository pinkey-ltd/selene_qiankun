import request from './request'

//#region list
export function requestList(page: number, index: number) {
  return request({
    url: '/api/model/list?page=' + page + '&index=' + index,
    method: 'get'
  })
}

export function searchList(page: number, index: number, params: Map<string, string>) {
  let paramsStr = ''
  if (params.get('name')) {
    paramsStr += '&name=' + params.get('name')
  }
  if (params.get('type')) {
    paramsStr += '&type=' + params.get('type')
  }
  if (params.get('code')) {
    paramsStr += '&code=' + params.get('code')
  }
  return request({
    url: '/api/model/list?page=' + page + '&index=' + index + paramsStr,
    method: 'get'
  })
}

export function preloadModel(path: string) {
  const url = path
  return request({
    url: url.replace('prod-api/', ''),
    method: 'get'
  })
}
export function updateModel(data: any) {
  return request({
    url: '/api/model/' + data.id,
    method: 'put',
    data
  })
}

export function createModel(data: any) {
  return request({
    url: '/api/model',
    method: 'post',
    data
  })
}

export function deleteModel(id: string | number) {
  return request({
    url: '/api/model/' + id,
    method: 'delete'
  })
}

export function requestRoleList() {
  return request({
    url: '/api/model/role',
    method: 'get'
  })
}

export function requestSubTypeList() {
  return request({
    url: '/api/model/sub_type',
    method: 'get'
  })
}

export function multiUpdateModel(data: any) {
  return request({
    url: '/api/model/roles',
    method: 'put',
    data
  })
}
