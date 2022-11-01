import request from '@/common/js/request'

const BASE_URL = process.env.VUE_APP_SERVICE_SOCIAL
// 获取列表
export function getGoodsListApi(data) {
  return request({
    url: BASE_URL + '/admin/gameSku/goods/list',
    method: 'post',
    data
  })
}
// 获取列表-导出
export function listForExport(data) {
  return request({
    url: BASE_URL + '/admin/gameSku/goods/listForExport',
    method: 'post',
    data
  })
}
// 新增
export function createGoodsApi(params) {
  return request({
    url: BASE_URL + '/admin/gameSku/goods/create',
    method: 'post',
    params
  })
}
// 删除
export function deleteGoodsApi(data) {
  return request({
    url: BASE_URL + '/admin/gameSku/goods/delete',
    method: 'post',
    data
  })
}

// 获取单个
export function getGoodsInfoApi(params) {
  return request({
    url: BASE_URL + '/admin/gameSku/goods/get',
    method: 'post',
    params
  })
}

// 保存更新-提交审批
export function saveGoodsApi(data) {
  return request({
    url: BASE_URL + '/admin/gameSku/goods/save',
    method: 'post',
    data
  })
}

// 修改为编辑中1-审批不通过3-审批通过5
export function approveGoodsStatusApi(params) {
  return request({
    url: BASE_URL + '/admin/gameSku/goods/status/update',
    method: 'post',
    params
  })
}
