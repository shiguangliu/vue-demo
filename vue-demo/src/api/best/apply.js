import request from '@/common/js/request'

// 基础服务API路由
const MALL_URL = process.env.VUE_APP_SERVICE_MALL

// 申请列表-分页
export function listApi(data) {
  return request({
    url: MALL_URL + '/admin/best/apply/list',
    method: 'post',
    data
  })
}

// 申请列表-不分页
export function listAllApi(data) {
  return request({
    url: MALL_URL + '/admin/best/apply/listAll',
    method: 'post',
    data
  })
}
