import request from '@/common/js/request'

// 登录账号相关服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL
const MALL_URL = process.env.VUE_APP_SERVICE_MALL

// 装备列表
export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzGameLottery/list',
    method: 'post',
    data
  })
}

export function createApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzGameLottery/add',
    method: 'post',
    data
  })
}

export function updateApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzGameLottery/save',
    method: 'post',
    data
  })
}

export function deleteMaxApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzGameLottery/delete',
    method: 'post',
    data
  })
}

export function getApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/fzGameLottery/get',
    method: 'post',
    params
  })
}
export function getDetailApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/fzGameLottery/getDetail',
    method: 'post',
    params
  })
}

export function getPoolListApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/fzGameLotteryPool/list',
    method: 'post',
    params
  })
}

export function createPoolApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzGameLotteryPool/add',
    method: 'post',
    data
  })
}

export function updatePoolApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzGameLotteryPool/save',
    method: 'post',
    data
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

export function getHistoryListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzGameLotteryHistory/list',
    method: 'post',
    data
  })
}
