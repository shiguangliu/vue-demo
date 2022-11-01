import request from '@/common/js/request'

// 基础服务API路由
const MALL_URL = process.env.VUE_APP_SERVICE_MALL

// 获取列表
export function getListApi(data) {
  return request({
    url: MALL_URL + '/admin/activity/type/list',
    method: 'post',
    data
  })
}

// 获取单个
export function getApi(params) {
  return request({
    url: MALL_URL + '/admin/activity/type/get',
    method: 'post',
    params
  })
}

// 删除
export function deleteApi(params) {
  return request({
    url: MALL_URL + '/admin/activity/type/delete',
    method: 'post',
    params
  })
}

// 修改
export function editApi(data) {
  return request({
    url: MALL_URL + '/admin/activity/type/update',
    method: 'post',
    data
  })
}
