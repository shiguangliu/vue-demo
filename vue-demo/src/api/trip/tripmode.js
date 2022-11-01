import request from '@/common/js/request'

// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取列表
export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/trip/mode/list',
    method: 'post',
    data
  })
}
// 创建
export function createApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/trip/mode/create',
    method: 'post',
    params
  })
}
// 删除 和批量删除
export function deleteBatchApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/trip/mode/delete',
    method: 'post',
    data
  })
}
// 获取详情
export function getDetailApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/trip/mode/detail/get',
    method: 'post',
    params
  })
}
// 更新详情
export function updateDetailApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/trip/mode/detail/update',
    method: 'post',
    data
  })
}
