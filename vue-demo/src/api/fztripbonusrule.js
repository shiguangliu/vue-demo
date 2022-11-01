import request from '@/common/js/request'

// 登录账号相关服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 列表
export function getBonusRuleListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzTripBonusRule/list',
    method: 'post',
    data
  })
}
// 列表
export function getBonusDiscountRuleListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzTripBonusDiscountRule/list',
    method: 'post',
    data
  })
}

export function createBonusRuleApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzTripBonusRule/add',
    method: 'post',
    data
  })
}

export function createBonusDiscountRuleApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzTripBonusDiscountRule/add',
    method: 'post',
    data
  })
}

export function updateBonusRuleApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzTripBonusRule/save',
    method: 'post',
    data
  })
}

export function updateBonusDiscountRuleApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzTripBonusDiscountRule/save',
    method: 'post',
    data
  })
}
