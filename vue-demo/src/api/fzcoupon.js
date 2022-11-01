import request from '@/common/js/request'

// 登录账号相关服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzCoupon/list',
    method: 'post',
    data
  })
}

export function createApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzCoupon/add',
    method: 'post',
    data
  })
}

export function updateApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzCoupon/save',
    method: 'post',
    data
  })
}

export function deleteMaxApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzCoupon/delete',
    method: 'post',
    data
  })
}

export function getApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/fzCoupon/get',
    method: 'post',
    params
  })
}

export function getCouponRecordListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzCouponRecord/list',
    method: 'post',
    data
  })
}

export function createCouponRecordApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzCouponRecord/add',
    method: 'post',
    data
  })
}

export function updateCouponRecordApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzCouponRecord/save',
    method: 'post',
    data
  })
}

export function getCouponRecordApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/fzCouponRecord/get',
    method: 'post',
    params
  })
}

export function importCouponRecordApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzCouponRecord/import',
    method: 'post',
    data
  })
}

export function getAllCouponRecordListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/fzCouponRecord/listAll',
    method: 'post',
    data
  })
}

export function getRptListApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/coupon/rpt/list',
    method: 'post',
    params
  })
}
