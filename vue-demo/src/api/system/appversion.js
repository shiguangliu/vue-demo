import request from '@/common/js/request'

// 基础服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 获取列表
export function getListApi(data) {
  return request({
    url: BASE_URL + '/admin/appversion/list',
    method: 'post',
    data
  })
}

// 新增
export function createApi(params) {
  return request({
    url: BASE_URL + '/admin/appversion/add',
    method: 'post',
    params
  })
}

// 更新
export function updateApi(data) {
  return request({
    url: BASE_URL + '/admin/appversion/update',
    method: 'post',
    data
  })
}
// 获取详情
export function getAppVerApi(params) {
  return request({
    url: BASE_URL + '/admin/appversion/detail',
    method: 'post',
    params
  })
}

// 更新状态
export function updateAppVerStatusApi(params) {
  return request({
    url: BASE_URL + '/admin/appversion/update/status',
    method: 'post',
    params
  })
}
// 获取详情
export function deleteAppVerApi(params) {
  return request({
    url: BASE_URL + '/admin/appversion/delete',
    method: 'post',
    params
  })
}

