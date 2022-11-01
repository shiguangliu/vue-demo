import request from '@/common/js/request'

const BASE_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取列表
export function getSellOutListForPageApi(data) {
  return request({
    url: BASE_URL + '/admin/gameSku/sellOut/list',
    method: 'post',
    data
  })
}

// 获取导出数据
export function getSellOutListForExcelApi(data) {
  return request({
    url: BASE_URL + '/admin/gameSku/sellOut/listForExcel',
    method: 'post',
    data
  })
}
