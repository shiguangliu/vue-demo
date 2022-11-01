import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

// 拉取消息列表
export function getUnreadMessages(params) {
  return request({
    url: USER_URL + '/admin/robot/unread/message/get',
    method: 'post',
    params
  })
}
// 拉取消息
export function getHistoryMessages(params) {
  return request({
    url: USER_URL + '/admin/robot/history/message/get',
    method: 'post',
    params
  })
}
// 发送消息
export function sendMessages(data) {
  return request({
    url: USER_URL + '/admin/message/send',
    method: 'post',
    data
  })
}
// 更新阅读消息状态
export function readMessages(params) {
  return request({
    url: USER_URL + '/admin/message/im/read',
    method: 'post',
    params
  })
}
// 获取所有好友
export function getAllFriend(params) {
  return request({
    url: USER_URL + '/admin/all-robot/friend/get',
    method: 'post',
    params
  })
}
// 获取马甲好友信息
export function getRobotUserInfo(params) {
  return request({
    url: USER_URL + '/admin/user-info/get',
    method: 'post',
    params
  })
}
// 发送广播消息
export function sendBroadcastMessages(data) {
  return request({
    url: USER_URL + '/admin/message/broadcast',
    method: 'post',
    data
  })
}
// 改变后台频道
export function changeChannel(params) {
  return request({
    url: USER_URL + '/admin/trip/channel/change',
    method: 'post',
    params
  })
}
// 随机刷新马甲
export function refreshRobot(params) {
  return request({
    url: USER_URL + '/admin/robot/refresh',
    method: 'post',
    params
  })
}
