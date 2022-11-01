import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 新手礼包列表
export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/gift/pack/list',
    method: 'post',
    data
  })
}

// 新手礼包列表
export function giftPackInsert(params) {
  return request({
    url: SOCIAL_URL + '/admin/gift/pack/insert',
    method: 'post',
    params
  })
}
