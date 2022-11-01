import request from '@/common/js/request'

// 登录账号相关服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 地区管理
export function getAreaList(data) {
  return request({
    url: BASE_URL + '/admin/sysArea/list',
    method: 'post',
    data
  })
}

// 地区管理
export function getAreaSelectByList(data) {
  return request({
    url: BASE_URL + '/admin/sysArea/selectByList',
    method: 'post',
    data
  })
}

export function createApi(data) {
  return request({
    url: BASE_URL + '/admin/sysArea/add',
    method: 'post',
    data
  })
}

export function updateApi(data) {
  return request({
    url: BASE_URL + '/admin/sysArea/save',
    method: 'post',
    data
  })
}

export function deleteApi(data) {
  return request({
    url: BASE_URL + '/admin/sysArea/save',
    method: 'post',
    data
  })
}

export function getApi(params) {
  return request({
    url: BASE_URL + '/admin/sysArea/get',
    method: 'post',
    params
  })
}
