import request from '@/common/js/request'

const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取列表
export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/trip/history/list',
    method: 'post',
    data
  })
}
// 获取奖励列表
export function getBonusApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/trip/bonus/get',
    method: 'post',
    params
  })
}
// 获取启程记录详情
export function getDetailApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/trip/detail/get',
    method: 'post',
    params
  })
}
// 获取启程轨迹
export function getTripTrackApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/trip/track/get',
    method: 'post',
    params
  })
}
// 导出启程记录列表
export function exportTripHistory(data) {
  return request({
    url: SOCIAL_URL + '/admin/trip/history/export',
    method: 'post',
    data
  })
}
