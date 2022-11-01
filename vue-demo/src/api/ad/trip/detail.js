import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const MALL_URL = process.env.VUE_APP_SERVICE_MALL

// 启程动态图片里动态图片详情详情
export function getInfoApi(params) {
  return request({
    url: MALL_URL + '/admin/advert/trip/getInfo',
    method: 'post',
    params
  })
}

// 新增启程动态图片里动态图片详情详情
export function tripMaterialInsert(data) {
  return request({
    url: MALL_URL + '/admin/advert/trip/material/insert',
    method: 'post',
    data
  })
}

// 删除启程动态图片里动态图片详情
export function tripMaterialdelete(params) {
  return request({
    url: MALL_URL + '/admin/advert/trip/material/datele',
    method: 'post',
    params
  })
}

// 删除启程动态图片里动态图片详情
export function tripMaterialUPdate(data) {
  return request({
    url: MALL_URL + '/admin/advert/trip/material/update',
    method: 'post',
    data
  })
}

// 启程动态图片里动态图片详情
export function tripGetMaterialInfo(params) {
  return request({
    url: MALL_URL + '/admin/advert/trip/material/getInfo',
    method: 'post',
    params
  })
}

// 修改启程动态图片详情
export function tripUpdate(data) {
  return request({
    url: MALL_URL + '/admin/advert/trip/update',
    method: 'post',
    data
  })
}
