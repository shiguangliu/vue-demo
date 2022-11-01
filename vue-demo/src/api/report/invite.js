import request from '@/common/js/request'

// 登录账号相关服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

export function getReportInviteListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/invite/inviteList',
    method: 'post',
    data
  })
}

export function getReportInviteSummaryApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/invite/inviteSummary',
    method: 'post',
    data
  })
}

export function getReportInviteTopListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/invite/topList',
    method: 'post',
    data
  })
}
