import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

// Admin用户发起的好友邀请List
export function robotInviteList(data) {
  return request({
    url: USER_URL + '/admin/robot/invite/list',
    method: 'post',
    data
  })
}

// Admin接受对方的加好友邀请，成为好友
export function agreeFriends(params) {
  return request({
    url: USER_URL + '/admin/agree/friends',
    method: 'post',
    params
  })
}

// Admin拒绝对方的加好友邀请
export function friendRefuse(params) {
  return request({
    url: USER_URL + '/admin/friend/refuse',
    method: 'post',
    params
  })
}

// Admin接受对方的加好友邀请，成为好友批量
export function agreeFriendsBatch(data) {
  return request({
    url: USER_URL + '/admin/agree/friends/batch',
    method: 'post',
    data
  })
}

// Admin拒绝对方的加好友邀请批量
export function friendRefuseBatch(data) {
  return request({
    url: USER_URL + '/admin/friend/refuse/batch',
    method: 'post',
    data
  })
}
