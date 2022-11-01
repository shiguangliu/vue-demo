import request from '@/common/js/request'

// 登录账号相关服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

export function listGeoApi(data) {
  return request({
    url: USER_URL + '/admin/userGeo/list',
    method: 'post',
    data
  })
}

export function listGeoDetailApi(data) {
  return request({
    url: USER_URL + '/admin/userGeo/listByCenterRadius',
    method: 'post',
    data
  })
}

export function updateGeoApi(data) {
  return request({
    url: USER_URL + '/admin/userGeo/update',
    method: 'post',
    data
  })
}
