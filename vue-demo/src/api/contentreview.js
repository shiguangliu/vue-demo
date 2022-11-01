import request from '@/common/js/request'

// 登录账号相关服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_MALL

// 评论管理
export function getCommentListApi(data) {
  return request({
    url: BASE_URL + '/admin/comment/list',
    method: 'post',
    data
  })
}

export function getCommentApi(params) {
  return request({
    url: BASE_URL + '/admin/comment/get',
    method: 'post',
    params
  })
}

export function createCommentApi(data) {
  return request({
    url: BASE_URL + '/admin/comment/add',
    method: 'post',
    data
  })
}

export function updateCommentApi(data) {
  return request({
    url: BASE_URL + '/admin/comment/save',
    method: 'post',
    data
  })
}

export function getListApi(data) {
  return request({
    url: BASE_URL + '/admin/fzArticleComment/list',
    method: 'post',
    data
  })
}

export function createApi(data) {
  return request({
    url: BASE_URL + '/admin/fzArticleComment/add',
    method: 'post',
    data
  })
}

export function updateApi(data) {
  return request({
    url: BASE_URL + '/admin/fzArticleComment/save',
    method: 'post',
    data
  })
}

export function deleteApi(data) {
  return request({
    url: BASE_URL + '/admin/fzArticleComment/save',
    method: 'post',
    data
  })
}

export function getApi(params) {
  return request({
    url: BASE_URL + '/admin/fzArticleComment/get',
    method: 'post',
    params
  })
}
