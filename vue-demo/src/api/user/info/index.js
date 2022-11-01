import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

// 获取列表
export function getListApi(data) {
  return request({
    url: USER_URL + '/admin/user/list',
    method: 'post',
    data
  })
}

// 批量删除
export function userBatchDelete(data) {
  return request({
    url: USER_URL + '/admin/user/batch/delete',
    method: 'post',
    data
  })
}

// 刷洗马甲名称
export function refreshNickName(data) {
  return request({
    url: USER_URL + '/admin/user/refresh/robot/nickName',
    method: 'post',
    data
  })
}

