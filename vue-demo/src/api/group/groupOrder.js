import request from '@/common/js/request'

const BASE_URL = process.env.VUE_APP_SERVICE_MALL

// 获取列表
export function getGroupOrderListForPageApi(data) {
  return request({
    url: BASE_URL + '/admin/group/order/getGroupOrderListForPage',
    method: 'post',
    data
  })
}

// 获取导出数据
export function getGroupOrderListForExcelApi(data) {
  return request({
    url: BASE_URL + '/admin/group/order/getGroupOrderListForExcel',
    method: 'post',
    data
  })
}

// 获取单个
export function getGroupOrderInfoApi(params) {
  return request({
    url: BASE_URL + '/admin/group/order/getGroupOrderInfo',
    method: 'post',
    params
  })
}

// 更新
export function updateGroupOrderApi(data) {
  return request({
    url: BASE_URL + '/admin/group/order/updateGroupOrder',
    method: 'post',
    data
  })
}

// 获取商户列表
export function getMerchantListApi(params) {
  return request({
    url: BASE_URL + '/admin/sys/merchant/getMerchantList',
    method: 'post',
    params
  })
}
