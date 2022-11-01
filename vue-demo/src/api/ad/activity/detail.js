import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const MALL_URL = process.env.VUE_APP_SERVICE_MALL

// 获取详情
export function getAdActivityInfo(params) {
  return request({
    url: MALL_URL + '/admin/ad/activity/info',
    method: 'post',
    params
  })
}

// 获取活动类型列表管理 下拉框用
export function listAll(data) {
  return request({
    url: MALL_URL + '/admin/activity/type/list/all',
    method: 'post',
    data
  })
}

// 修改状态
export function adActivityUpdStatus(params) {
  return request({
    url: MALL_URL + '/admin/ad/activity/upd/status',
    method: 'post',
    params
  })
}

// 修改
export function adActivityUpd(data) {
  return request({
    url: MALL_URL + '/admin/ad/activity/upd',
    method: 'post',
    data
  })
}
