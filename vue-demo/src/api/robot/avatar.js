import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

// 获取列表
export function getListApi(data) {
  return request({
    url: USER_URL + '/admin/robot/avatar/list',
    method: 'post',
    data
  })
}
// 删除
export function deleteApi(data) {
  return request({
    url: USER_URL + '/admin/robot/avatar/delete',
    method: 'post',
    data
  })
}
// 添加
export function createApi(data) {
  return request({
    url: USER_URL + '/admin/robot/avatar/create',
    method: 'post',
    data
  })
}
