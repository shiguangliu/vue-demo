import request from '@/common/js/request'

const BASE_URL = process.env.VUE_APP_SERVICE_SOCIAL
// 获取列表
export function getRechargeListApi(data) {
  return request({
    url: BASE_URL + '/admin/gameSku/recharge/list',
    method: 'post',
    data
  })
}

// 获取导出数据
export function getRechargeListForExcelApi(data) {
  return request({
    url: BASE_URL + '/admin/gameSku/recharge/listForExcel',
    method: 'post',
    data
  })
}

// 获取单个
export function getRechargeInfoApi(params) {
  return request({
    url: BASE_URL + '/admin/gameSku/recharge/get',
    method: 'post',
    params
  })
}
