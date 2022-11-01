import request from '@/common/js/request'

// 登录账号相关服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE
const MALL_URL = process.env.VUE_APP_SERVICE_MALL
// const USER_URL = process.env.VUE_APP_SERVICE_USER
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 装备列表
export function getGameItemListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/game/item/list',
    method: 'post',
    data
  })
}

// 商户列表
export function getMerchantListApi(data) {
  return request({
    url: BASE_URL + '/admin/merchant/list',
    method: 'post',
    data
  })
}

// h5列表
export function getH5ListApi(data) {
  return request({
    url: MALL_URL + '/admin/h5/list',
    method: 'post',
    data
  })
}

// 优选列表
export function getBestListApi(data) {
  return request({
    url: MALL_URL + '/admin/best/list',
    method: 'post',
    data
  })
}

// 优选标签列表
export function getBestTagListApi(data) {
  return request({
    url: MALL_URL + '/admin/best/list',
    method: 'post',
    data
  })
}

// 拼团列表
export function getGroupListApi(data) {
  return request({
    url: MALL_URL + '/admin/group/getGroupList',
    method: 'post',
    data
  })
}

export function getCouponListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzCoupon/list',
    method: 'post',
    data
  })
}

export function getGameSkuListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/gameSku/sku/popup/list',
    method: 'post',
    data
  })
}

