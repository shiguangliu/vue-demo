import request from '@/common/js/request'

// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取列表
export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/tips/list',
    method: 'post',
    data
  })
}
// 删除 和批量删除
export function deleteApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/tips/delete',
    method: 'post',
    params
  })
}
// 获取详情
export function getDetailApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/tips/detail/get',
    method: 'post',
    params
  })
}
// 更新详情
export function updateDetailApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/tips/detail/update',
    method: 'post',
    data
  })
}
// 列表导出
export function exportList(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/tips/list/export',
    method: 'post',
    data
  })
}
