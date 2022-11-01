import request from '@/common/js/request'

// 登录账号相关服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 员工管理
export function getListApi(data) {
  return request({
    url: BASE_URL + '/admin/sysStaff/list',
    method: 'post',
    data
  })
}

export function createApi(data) {
  return request({
    url: BASE_URL + '/admin/sysStaff/add',
    method: 'post',
    data
  })
}

export function updateApi(data) {
  return request({
    url: BASE_URL + '/admin/sysStaff/save',
    method: 'post',
    data
  })
}

export function resetPwdApi(params) {
  return request({
    url: BASE_URL + '/admin/sysStaff/resetPwd',
    method: 'post',
    params
  })
}

export function deleteApi(data) {
  return request({
    url: BASE_URL + '/admin/sysStaff/save',
    method: 'post',
    data
  })
}

export function getApi(params) {
  return request({
    url: BASE_URL + '/admin/sysStaff/get',
    method: 'post',
    params
  })
}

// 导出报表
export function getRptListApi(data) {
  return request({
    url: BASE_URL + '/admin/staff/rpt/list',
    method: 'post',
    data
  })
}
