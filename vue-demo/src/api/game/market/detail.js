import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 交易所管理详情
export function getGameMarketInfo(params) {
  return request({
    url: SOCIAL_URL + '/admin/game/market/info',
    method: 'post',
    params
  })
}
