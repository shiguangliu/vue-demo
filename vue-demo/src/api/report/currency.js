import request from '@/common/js/request'

// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 报表：04-平台间货币流通总览（金币、钻石）
export function getReportCurrencyTransWithPlat(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/currency/transWithPlat',
    method: 'post',
    data
  })
}

// 报表：05-用户间货币流通总览（金币、钻石）
export function getReportCurrencyTransWithUsers(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/currency/transWithUsers',
    method: 'post',
    data
  })
}

// 报表：06-用户与马甲&陪玩间货币流通总览（金币、钻石）
export function getReportCurrencyTransWithRobot(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/currency/transWithRobot',
    method: 'post',
    data
  })
}

// 报表：07-用户账户总览（金币、钻石）
export function getReportCurrencyAccountSummary(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/currency/accountSummary',
    method: 'post',
    data
  })
}
