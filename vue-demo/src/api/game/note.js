import request from '@/common/js/request'

const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 取得单条数据
export function getApi(params) {
  return request({
    url: BASE_URL + '/admin/sysNote/get',
    method: 'post',
    params
  })
}

// 更新数据
export function updateApi(data) {
  return request({
    url: BASE_URL + '/admin/sysNote/update',
    method: 'post',
    data
  })
}
