import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取列表
export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/carBrand/list',
    method: 'post',
    data
  })
}

// 新增
export function createApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/carBrand/insert',
    method: 'post',
    params
  })
}

// 删除
export function deleteApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/carBrand/delete',
    method: 'post',
    data
  })
}

// 修改
export function updateApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/carBrand/update',
    method: 'post',
    data
  })
}
