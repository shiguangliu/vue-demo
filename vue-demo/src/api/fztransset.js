import request from '@/common/js/request'

// 登录账号相关服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

export function getTransSetListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/transSet/list',
    method: 'post',
    data
  })
}

export function getTransSetApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/transSet/get',
    method: 'post',
    params
  })
}

export function getTransSetDetailListApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/transSetDetail/list',
    method: 'post',
    params
  })
}

export function getTransSetPayListApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/transSetPay/list',
    method: 'post',
    params
  })
}
