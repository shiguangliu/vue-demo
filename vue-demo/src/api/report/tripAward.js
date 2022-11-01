import request from '@/common/js/request'

// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 报表：16-启程奖励情况-报表1
export function getReportTripAwardList1(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/trip/awardList1',
    method: 'post',
    data
  })
}
// 报表：16-启程奖励情况-报表2
export function getReportTripAwardList2(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/trip/awardList2',
    method: 'post',
    data
  })
}
