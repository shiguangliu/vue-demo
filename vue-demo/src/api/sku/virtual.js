import request from '@/common/js/request'

const BASE_URL = process.env.VUE_APP_SERVICE_SOCIAL
// 获取列表
export function getVirtualListApi(data) {
  return request({
    url: BASE_URL + '/admin/gameSku/virtual/list',
    method: 'post',
    data
  })
}
// 获取列表-导出
export function virtualListForExport(data) {
  return request({
    url: BASE_URL + '/admin/gameSku/virtual/virtualListForExport',
    method: 'post',
    data
  })
}
// 新增
export function createVirtualApi(params) {
  return request({
    url: BASE_URL + '/admin/gameSku/virtual/create',
    method: 'post',
    params
  })
}
// 删除
export function deleteVirtualApi(data) {
  return request({
    url: BASE_URL + '/admin/gameSku/virtual/delete',
    method: 'post',
    data
  })
}

// 获取单个
export function getVirtualInfoApi(params) {
  return request({
    url: BASE_URL + '/admin/gameSku/virtual/get',
    method: 'post',
    params
  })
}

// 保存更新-提交审批
export function saveVirtualApi(data) {
  return request({
    url: BASE_URL + '/admin/gameSku/virtual/save',
    method: 'post',
    data
  })
}

// 修改为编辑中1-审批不通过3-审批通过5
export function approveVirtualStatusApi(params) {
  return request({
    url: BASE_URL + '/admin/gameSku/virtual/status/update',
    method: 'post',
    params
  })
}
