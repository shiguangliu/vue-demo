import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 交易所管理List
export function getApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/game/market/list',
    method: 'post',
    data
  })
}

// 交易所管理导出
export function getGameMarketExcel(data) {
  return request({
    url: SOCIAL_URL + '/admin/game/market/excel',
    method: 'post',
    data
  })
}
