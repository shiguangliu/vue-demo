import request from '@/common/js/request'

// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 报表：15-启程使用情况
export function getReportTripSummary(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/trip/tripSummary',
    method: 'post',
    data
  })
}
