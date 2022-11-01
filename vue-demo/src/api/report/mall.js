import request from '@/common/js/request'

// 登录账号相关服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

export function getReportMallTransListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/mall/transList',
    method: 'post',
    data
  })
}
