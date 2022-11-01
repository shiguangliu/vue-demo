import request from '@/common/js/request'

// 登录账号相关服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 角色管理
export function getListApi(data) {
  return request({
    url: BASE_URL + '/admin/sysRole/list',
    method: 'post',
    data
  })
}

export function createApi(data) {
  return request({
    url: BASE_URL + '/admin/sysRole/add',
    method: 'post',
    data
  })
}

export function updateApi(data) {
  return request({
    url: BASE_URL + '/admin/sysRole/save',
    method: 'post',
    data
  })
}

export function deleteApi(data) {
  return request({
    url: BASE_URL + '/admin/sysRole/save',
    method: 'post',
    data
  })
}

export function getApi(params) {
  return request({
    url: BASE_URL + '/admin/sysRole/get',
    method: 'post',
    params
  })
}

export function getMenuListApi(params) {
  return request({
    url: BASE_URL + '/admin/sysRole/getMenuList',
    method: 'post',
    params
  })
}

export function updateRoleRightApi(data) {
  return request({
    url: BASE_URL + '/admin/sysRole/saveRoleRight',
    method: 'post',
    data
  })
}

export function updateAllRoleRightApi(data) {
  return request({
    url: BASE_URL + '/admin/sysRole/saveAllRoleRight',
    method: 'post',
    data
  })
}
