import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

// 获取列表
export function getListApi(data) {
  return request({
    url: USER_URL + '/admin/robot/profile/list',
    method: 'post',
    data
  })
}
// 删除
export function deleteApi(params) {
  return request({
    url: USER_URL + '/admin/robot/profile/delete',
    method: 'post',
    params
  })
}
// 更新
export function updateDetailApi(data) {
  return request({
    url: USER_URL + '/admin/robot/profile/update',
    method: 'post',
    data
  })
}
