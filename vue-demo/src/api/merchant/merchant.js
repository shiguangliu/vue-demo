import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 获取列表
export function getListApi(data) {
  return request({
    url: BASE_URL + '/admin/merchant/list',
    method: 'post',
    data
  })
}

// 获取列表-导出功能
export function listForExport(data) {
  return request({
    url: BASE_URL + '/admin/merchant/listForExport',
    method: 'post',
    data
  })
}

// 删除
export function deleteApi(params) {
  return request({
    url: BASE_URL + '/admin/merchant/delete',
    method: 'post',
    params
  })
}

// 新增
export function createApi(params) {
  return request({
    url: BASE_URL + '/admin/merchant/insert',
    method: 'post',
    params
  })
}

// 编辑
export function getApi(params) {
  return request({
    url: BASE_URL + '/admin/merchant/selectById',
    method: 'post',
    params
  })
}

// 修改
export function updateApi(data) {
  return request({
    url: BASE_URL + '/admin/merchant/update',
    method: 'post',
    data
  })
}

// 查询所有图片
export function getMaterialList(params) {
  return request({
    url: BASE_URL + '/admin/merchant/material/list',
    method: 'post',
    params
  })
}

// 新增图片
export function insertMaterial(params) {
  return request({
    url: BASE_URL + '/admin/merchant/material/insert',
    method: 'post',
    params
  })
}

// 删除图片
export function deleteMaterial(params) {
  return request({
    url: BASE_URL + '/admin/merchant/material/delete',
    method: 'post',
    params
  })
}
