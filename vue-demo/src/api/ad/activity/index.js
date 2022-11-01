import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const MALL_URL = process.env.VUE_APP_SERVICE_MALL

// 获取列表
export function getAdActivityList(data) {
  return request({
    url: MALL_URL + '/admin/ad/activity/list',
    method: 'post',
    data
  })
}

// 新增
export function adActivityInsert(params) {
  return request({
    url: MALL_URL + '/admin/ad/activity/insert',
    method: 'post',
    params
  })
}

// 删除
export function adActivityDel(params) {
  return request({
    url: MALL_URL + '/admin/ad/activity/del',
    method: 'post',
    params
  })
}

// 活动管理导出
export function getAdActivityExport(data) {
  return request({
    url: MALL_URL + '/admin/ad/activity/export',
    method: 'post',
    data
  })
}
