import request from '@/common/js/request'

// 基础服务API路由
const MALL_URL = process.env.VUE_APP_SERVICE_MALL

// 获取列表
export function getListApi(data) {
  return request({
    url: MALL_URL + '/admin/h5/list',
    method: 'post',
    data
  })
}

// 获取列表-导出
export function getFzH5ListForExport(data) {
  return request({
    url: MALL_URL + '/admin/h5/listForExport',
    method: 'post',
    data
  })
}

// 创建
export function createApi(params) {
  return request({
    url: MALL_URL + '/admin/h5/create',
    method: 'post',
    params
  })
}

// 删除
export function deleteApi(params) {
  return request({
    url: MALL_URL + '/admin/h5/delete',
    method: 'post',
    params
  })
}
// 删除
export function getDetailApi(params) {
  return request({
    url: MALL_URL + '/admin/h5/detail/get',
    method: 'post',
    params
  })
}
// 更新状态
export function updateStatusApi(params) {
  return request({
    url: MALL_URL + '/admin/h5/status/update',
    method: 'post',
    params
  })
}
// 更新状态
export function updateDetailApi(data) {
  return request({
    url: MALL_URL + '/admin/h5/detail/update',
    method: 'post',
    data
  })
}
