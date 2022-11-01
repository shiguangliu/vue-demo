import request from '@/common/js/request'

// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取列表
export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/map/list',
    method: 'post',
    data
  })
}
// 创建
export function createApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/map/create',
    method: 'post',
    params
  })
}
// 获取详情
export function getDetailApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/map/detail/get',
    method: 'post',
    params
  })
}
// 删除
export function deleteApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/map/delete',
    method: 'post',
    params
  })
}
// 更新
export function updateDetailApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/map/detail/update',
    method: 'post',
    data
  })
}
// 路径列表
export function getMapDataList(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/map/data/list',
    method: 'post',
    params
  })
}
// 地图路径属性详情
export function getMapDataDetail(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/map/data/detail/get',
    method: 'post',
    params
  })
}
// 地图路径属性更新
export function updateMapDataDetail(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/map/data/update',
    method: 'post',
    data
  })
}
// 地图路径属性删除
export function deleteMapData(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/map/data/delete',
    method: 'post',
    params
  })
}
