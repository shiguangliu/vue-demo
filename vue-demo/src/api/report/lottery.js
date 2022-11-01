import request from '@/common/js/request'

// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 报表：19-转盘奖励情况
export function getReportLotteryBonusList(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/lottery/bonusList',
    method: 'post',
    data
  })
}
