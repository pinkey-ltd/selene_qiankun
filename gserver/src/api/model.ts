import request from './request'

//#region list
export function requestList(page: number, index: number) {
  return request({
    url: '/api/model/list?page=' + page + '&index=' + index,
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
