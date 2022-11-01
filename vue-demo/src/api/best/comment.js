import request from '@/common/js/request'

// 基础服务API路由
const MALL_URL = process.env.VUE_APP_SERVICE_MALL

// 评价列表-分页
export function listApi(data) {
  return request({
    url: MALL_URL + '/admin/best/comment/list',
    method: 'post',
    data
  })
}

// 评论 新增
export function createCommentApi(data) {
  return request({
    url: MALL_URL + '/admin/best/comment/create',
    method: 'post',
    data
  })
}

// 评论审批通过
export function approveApi(data) {
  return request({
    url: MALL_URL + '/admin/best/comment/approve',
    method: 'post',
    data
  })
}

// 评论审批NG
export function approveNGApi(data) {
  return request({
    url: MALL_URL + '/admin/best/comment/approveNG',
    method: 'post',
    data
  })
}

// 评论删除
export function deleteApi(data) {
  return request({
    url: MALL_URL + '/admin/best/comment/delete',
    method: 'post',
    data
  })
}
