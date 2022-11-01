import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

// 获取数据
export function getApi(params) {
  return request({
    url: USER_URL + '/admin/matchSetting/info',
    method: 'post',
    params
  })
}

// 新增或修改
export function matchSettingSave(data) {
  return request({
    url: USER_URL + '/admin/matchSetting/save',
    method: 'post',
    data
  })
}
