import request from '@/common/js/request'

// 登录账号相关服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 员工管理
export function getListApi(data) {
  return request({
    url: BASE_URL + '/admin/sysNotice/list',
    method: 'post',
    data
  })
}

export function createApi(data) {
  return request({
    url: BASE_URL + '/admin/sysNotice/add',
    method: 'post',
    data
  })
}

export function updateApi(data) {
  return request({
    url: BASE_URL + '/admin/sysNotice/save',
    method: 'post',
    data
  })
}

export function deleteApi(data) {
  return request({
    url: BASE_URL + '/admin/sysNotice/save',
    method: 'post',
    data
  })
}

export function getApi(params) {
  return request({
    url: BASE_URL + '/admin/sysNotice/get',
    method: 'post',
    params
  })
}

// 导出报表
export function getRptListApi(data) {
  return request({
    url: BASE_URL + '/admin/notice/rpt/list',
    method: 'post',
    data
  })
}
