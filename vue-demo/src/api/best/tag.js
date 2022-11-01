import request from '@/common/js/request'

// 基础服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 列表-分页
export function listApi(data) {
  return request({
    url: BASE_URL + '/admin/tag/list',
    method: 'post',
    data
  })
}

// 列表-不分页
export function listAllApi(data) {
  return request({
    url: BASE_URL + '/admin/tag/listAll',
    method: 'post',
    data
  })
}

// 明细
export function getApi(params) {
  return request({
    url: BASE_URL + '/admin/tag/get',
    method: 'post',
    params
  })
}

// 修改
export function editApi(data) {
  return request({
    url: BASE_URL + '/admin/tag/edit',
    method: 'post',
    data
  })
}

// 新建
export function createApi(data) {
  return request({
    url: BASE_URL + '/admin/tag/create',
    method: 'post',
    data
  })
}

// 删除
export function deleteApi(data) {
  return request({
    url: BASE_URL + '/admin/tag/delete',
    method: 'post',
    data
  })
}

// 列表-分页
export function getUserHobbyTagList(data) {
  return request({
    url: BASE_URL + '/admin/userTag/hobbyList',
    method: 'post',
    data
  })
}
// 获取列表-导出
export function hobbyListForExport(data) {
  return request({
    url: BASE_URL + '/admin/userTag/hobbyListForExport',
    method: 'post',
    data
  })
}
