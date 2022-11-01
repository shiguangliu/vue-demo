import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

// 马甲启程数据增长规则List
export function getRobotTripRuleList(data) {
  return request({
    url: USER_URL + '/admin/robot/trip/rule/list',
    method: 'post',
    data
  })
}

// 马甲启程数据增长规则新建
export function robotTripRuleInsert(params) {
  return request({
    url: USER_URL + '/admin/robot/trip/rule/insert',
    method: 'post',
    params
  })
}

// 马甲启程数据增长规则保存
export function robotTripRuleUpdate(data) {
  return request({
    url: USER_URL + '/admin/robot/trip/rule/update',
    method: 'post',
    data
  })
}

// 马甲启程数据增长规则修改状态
export function robotTripRuleUpdateStatus(data) {
  return request({
    url: USER_URL + '/admin/robot/trip/rule/update/status',
    method: 'post',
    data
  })
}

// 获取标签库列表
export function getRobotTagList(data) {
  return request({
    url: USER_URL + '/admin/robot/tag/list',
    method: 'post',
    data
  })
}
