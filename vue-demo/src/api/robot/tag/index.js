import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

// 获取标签库列表
export function getRobotTagList(data) {
  return request({
    url: USER_URL + '/admin/robot/tag/list',
    method: 'post',
    data
  })
}

// 标签库新增
export function getRobotTagInsert(params) {
  return request({
    url: USER_URL + '/admin/robot/tag/insert',
    method: 'post',
    params
  })
}

// 标签库修改
export function getRobotTagUpdate(data) {
  return request({
    url: USER_URL + '/admin/robot/tag/update',
    method: 'post',
    data
  })
}

// 标签库修改
export function getSelectByList(data) {
  return request({
    url: USER_URL + '/admin/robot/tag/selectByList',
    method: 'post',
    data
  })
}
