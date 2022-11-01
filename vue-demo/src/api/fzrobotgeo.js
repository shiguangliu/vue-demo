import request from '@/common/js/request'

// 登录账号相关服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

export function createRobotApi(data) {
  return request({
    url: USER_URL + '/admin/fzRobotGeo/add',
    method: 'post',
    data
  })
}

export function updateRobotApi(data) {
  return request({
    url: USER_URL + '/admin/fzRobotGeo/save',
    method: 'post',
    data
  })
}

export function batchAddRobotApi(data) {
  return request({
    url: USER_URL + '/admin/fzRobotGeo/batchAdd',
    method: 'post',
    data
  })
}
