import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 游戏商城BANNERList
export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/gameBanner/list',
    method: 'post',
    data
  })
}

// 游戏商城BANNERList
export function createApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/gameBanner/insert',
    method: 'post',
    params
  })
}
