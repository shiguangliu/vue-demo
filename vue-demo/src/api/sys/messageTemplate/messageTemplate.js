import request from '@/common/js/request'

// 消息模版API
// 基础服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 获取列表
export function getListApi(data) {
  return request({
    url: BASE_URL + '/admin/sysMessageTemplate/list',
    method: 'post',
    data
  })
}
// 新增
export function createApi(data) {
  return request({
    url: BASE_URL + '/admin/sysMessageTemplate/insert',
    method: 'post',
    data
  })
}

// 删除
export function deleteApi(data) {
  return request({
    url: BASE_URL + '/admin/sysMessageTemplate/delete',
    method: 'post',
    data
  })
}

// 修改
export function updateApi(data) {
  return request({
    url: BASE_URL + '/admin/sysMessageTemplate/update',
    method: 'post',
    data
  })
}
