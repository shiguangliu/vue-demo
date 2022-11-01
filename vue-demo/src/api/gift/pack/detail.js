import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 新手礼包详情
export function getGiftPackInfo(params) {
  return request({
    url: SOCIAL_URL + '/admin/gift/pack/info',
    method: 'post',
    params
  })
}

// 新手礼包删除
export function giftPackDel(params) {
  return request({
    url: SOCIAL_URL + '/admin/gift/pack/del',
    method: 'post',
    params
  })
}

// 新手礼包修改状态
export function giftPackUpdateStatus(params) {
  return request({
    url: SOCIAL_URL + '/admin/gift/pack/update/status',
    method: 'post',
    params
  })
}

// 新手礼包新增或修改
export function giftPackUpdate(data) {
  return request({
    url: SOCIAL_URL + '/admin/gift/pack/update',
    method: 'post',
    data
  })
}
