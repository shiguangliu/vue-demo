import request from '@/common/js/request'

// 基础服务API路由
const MALL_URL = process.env.VUE_APP_SERVICE_MALL

// 优选列表
export function listApi(data) {
  return request({
    url: MALL_URL + '/admin/best/list',
    method: 'post',
    data
  })
}

// 优选列表 导出
export function rptListApi(data) {
  return request({
    url: MALL_URL + '/admin/best/rpt/list',
    method: 'post',
    data
  })
}

// 创建优选
export function createBestApi(params) {
  return request({
    url: MALL_URL + '/admin/best/create',
    method: 'post',
    params
  })
}

// 取得优选
export function detailApi(params) {
  return request({
    url: MALL_URL + '/admin/best/get',
    method: 'post',
    params
  })
}

// 保存优选
export function saveApi(data) {
  return request({
    url: MALL_URL + '/admin/best/save',
    method: 'post',
    data
  })
}

// 启用优选
export function submitApi(data) {
  return request({
    url: MALL_URL + '/admin/best/submit',
    method: 'post',
    data
  })
}

// 停用优选
export function offlineApi(data) {
  return request({
    url: MALL_URL + '/admin/best/offline',
    method: 'post',
    data
  })
}

// 编辑优选
export function editApi(data) {
  return request({
    url: MALL_URL + '/admin/best/edit',
    method: 'post',
    data
  })
}

// 优选置顶
export function topApi(data) {
  return request({
    url: MALL_URL + '/admin/best/top',
    method: 'post',
    data
  })
}

// 优选删除
export function deleteApi(data) {
  return request({
    url: MALL_URL + '/admin/best/delete',
    method: 'post',
    data
  })
}
