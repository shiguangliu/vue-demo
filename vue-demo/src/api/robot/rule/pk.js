import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取常量数据ROBOT_PK_RULE
export function selectRobotPkRule(params) {
  return request({
    url: SOCIAL_URL + '/admin/sys/configItems/update/selectRobotPkRule',
    method: 'post',
    params
  })
}

// 更新常量数据ROBOT_PK_RULE
export function updateRobotPkRule(data) {
  return request({
    url: SOCIAL_URL + '/admin/sys/configItems/update/robotPkRule',
    method: 'post',
    data
  })
}
