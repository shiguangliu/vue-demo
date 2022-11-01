import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取列表
export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/userCars/list',
    method: 'post',
    data
  })
}

// 获取单条数据
export function getApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/userCars/info',
    method: 'post',
    params
  })
}

// 批量认证
export function updateBatchAuthentication(data) {
  return request({
    url: SOCIAL_URL + '/admin/userCars/batchAuthentication',
    method: 'post',
    data
  })
}

// 单个认证
export function updateAuthentication(data) {
  return request({
    url: SOCIAL_URL + '/admin/userCars/authentication',
    method: 'post',
    data
  })
}
