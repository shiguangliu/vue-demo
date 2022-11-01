import request from '@/common/js/request'

// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

export function getReportEquipmentUserHold(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/equipment/userHold',
    method: 'post',
    data
  })
}
export function getReportEquipmentUserHoldRate(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/equipment/userHoldRate',
    method: 'post',
    data
  })
}
