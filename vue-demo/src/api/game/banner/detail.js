import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 游戏商城BANNERList
export function getApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/gameBanner/info',
    method: 'post',
    params
  })
}

// 游戏商城BANNER
export function updateApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/gameBanner/update',
    method: 'post',
    data
  })
}
