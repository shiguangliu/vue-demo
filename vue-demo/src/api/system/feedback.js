import request from '@/common/js/request'

// 基础服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 获取列表
export function getListApi(data) {
  return request({
    url: BASE_URL + '/admin/feedback/list',
    method: 'post',
    data
  })
}

// 删除
export function deleteApi(params) {
  return request({
    url: BASE_URL + '/admin/feedback/delete',
    method: 'post',
    params
  })
}
// 获取详情
export function getDetailApi(params) {
  return request({
    url: BASE_URL + '/admin/feedback/detail/get',
    method: 'post',
    params
  })
}
// 回复反馈
export function replyApi(data) {
  return request({
    url: BASE_URL + '/admin/feedback/reply',
    method: 'post',
    data
  })
}

// 导出报表
export function getRptListApi(data) {
  return request({
    url: BASE_URL + '/admin/feedback/rpt/list',
    method: 'post',
    data
  })
}
