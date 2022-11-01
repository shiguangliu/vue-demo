import request from '@/common/js/request'

// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 报表：01-票券详情-领取券码人数统计
export function getReportAdvCouponList(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/adv/couponList',
    method: 'post',
    data
  })
}

// 报表：02霸屏红包=>红包领取人数及领取金币统计
export function getReportAdvBonusList(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/adv/bonusList',
    method: 'post',
    data
  })
}
