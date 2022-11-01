import request from '@/common/js/request'

// 登录账号相关服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL
// const BASE_URL = process.env.VUE_APP_SERVICE_BASE
const MALL_URL = process.env.VUE_APP_SERVICE_MALL

// 装备列表
export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzTripLotteryPool/list',
    method: 'post',
    data
  })
}

export function createApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzTripLotteryPool/add',
    method: 'post',
    data
  })
}

export function updateApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzTripLotteryPool/save',
    method: 'post',
    data
  })
}

export function deleteMaxApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzTripLotteryPool/delete',
    method: 'post',
    data
  })
}

export function getApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/fzTripLotteryPool/get',
    method: 'post',
    params
  })
}

// 获取单个
export function getGroupApi(params) {
  return request({
    url: MALL_URL + '/admin/group/getGroupInfo',
    method: 'post',
    params
  })
}

// 取得单条明细
export function getGameItemApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/game/item/get',
    method: 'post',
    params
  })
}

// 取得优选
export function getBestApi(params) {
  return request({
    url: MALL_URL + '/admin/best/get',
    method: 'post',
    params
  })
}

export function getH5Api(params) {
  return request({
    url: MALL_URL + '/admin/h5/detail/get',
    method: 'post',
    params
  })
}

export function getCouponApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/fzCoupon/get',
    method: 'post',
    params
  })
}
