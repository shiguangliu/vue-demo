import request from '@/common/js/request'

// 基础服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 获取列表
export function getListApi(data) {
  return request({
    url: BASE_URL + '/admin/app-about/list',
    method: 'post',
    data
  })
}
// 初步创建，返回id
export function createApi(params) {
  return request({
    url: BASE_URL + '/admin/app-about/create',
    method: 'post',
    params
  })
}
// 删除协议
export function deleteApi(params) {
  return request({
    url: BASE_URL + '/admin/app-about/delete',
    method: 'post',
    params
  })
}
// 获取详情
export function getDetailApi(params) {
  return request({
    url: BASE_URL + '/admin/app-about/detail/get',
    method: 'post',
    params
  })
}
// 更新状态
export function updateStatusApi(params) {
  return request({
    url: BASE_URL + '/admin/app-about/status/update',
    method: 'post',
    params
  })
}
// 更新detail
export function updateDetailApi(data) {
  return request({
    url: BASE_URL + '/admin/app-about/detail/update',
    method: 'post',
    data
  })
}

