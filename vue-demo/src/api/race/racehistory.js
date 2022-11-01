import request from '@/common/js/request'

// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取列表
export function getRaceHistoryDetail(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/history/detail/get',
    method: 'post',
    params
  })
}
