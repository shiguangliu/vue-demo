import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const MALL_URL = process.env.VUE_APP_SERVICE_MALL

// 获取列表
export function getListApi(data) {
  return request({
    url: MALL_URL + '/admin/advert/pop/list',
    method: 'post',
    data
  })
}

// 新增
export function createApi(params) {
  return request({
    url: MALL_URL + '/admin/advert/pop/insert',
    method: 'post',
    params
  })
}

// 删除
export function daleteApi(data) {
  return request({
    url: MALL_URL + '/admin/advert/pop/delete',
    method: 'post',
    data
  })
}

// 批量删除
export function batchDaleteApi(data) {
  return request({
    url: MALL_URL + '/admin/advert/pop/multipleDelete',
    method: 'post',
    data
  })
}

// 霸屏列表导出
export function getAdminAdvertPopExport(data) {
  return request({
    url: MALL_URL + '/admin/advert/pop/export',
    method: 'post',
    data
  })
}

// 闪屏列表导出
export function getAdvertFlashExport(data) {
  return request({
    url: MALL_URL + '/admin/advert/flash/export',
    method: 'post',
    data
  })
}

// 启程列表导出
export function getAdvertTripExport(data) {
  return request({
    url: MALL_URL + '/admin/advert/trip/export',
    method: 'post',
    data
  })
}
