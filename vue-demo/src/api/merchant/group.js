import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取列表
export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/carBrandGroup/list',
    method: 'post',
    data
  })
}

// 新增
export function createApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/carBrandGroup/insert',
    method: 'post',
    params
  })
}

// 修改
export function updateApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/carBrandGroup/update',
    method: 'post',
    data
  })
}

// 删除
export function deleteApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/carBrandGroup/delete',
    method: 'post',
    data
  })
}
