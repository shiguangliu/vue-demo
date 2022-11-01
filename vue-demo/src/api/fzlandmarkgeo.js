import request from '@/common/js/request'

// 登录账号相关服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

export function createLandMarkApi(data) {
  return request({
    url: USER_URL + '/admin/fzLandMarkGeo/add',
    method: 'post',
    data
  })
}

export function updateLandMarkApi(data) {
  return request({
    url: USER_URL + '/admin/fzLandMarkGeo/save',
    method: 'post',
    data
  })
}
