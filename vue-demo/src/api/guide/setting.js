import request from '@/common/js/request'

// 基础服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

// 获取列表
export function getListApi(data) {
  return request({
    url: USER_URL + '/admin/guide/list',
    method: 'post',
    data
  })
}
// 创建
export function createApi(params) {
  return request({
    url: USER_URL + '/admin/guide/create',
    method: 'post',
    params
  })
}
// 详情
export function getDetailApi(params) {
  return request({
    url: USER_URL + '/admin/guide/detail/get',
    method: 'post',
    params
  })
}
// 更新详情
export function updateDetailApi(data) {
  return request({
    url: USER_URL + '/admin/guide/detail/update',
    method: 'post',
    data
  })
}
// 删除
export function deleteApi(params) {
  return request({
    url: USER_URL + '/admin/guide/delete',
    method: 'post',
    params
  })
}

// 更新状态
export function updateStatusApi(params) {
  return request({
    url: USER_URL + '/admin/guide/status/update',
    method: 'post',
    params
  })
}

