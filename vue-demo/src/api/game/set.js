import request from '@/common/js/request'

const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取列表
export function listApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/game/set/list',
    method: 'post',
    data
  })
}

// 获取列表导出
export function rptApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/game/set/rpt/list',
    method: 'post',
    data
  })
}

// 新增
export function insertApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/game/set/insert',
    method: 'post',
    params
  })
}

// 取得单条明细
export function getApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/game/set/get',
    method: 'post',
    params
  })
}

// 更新单挑数据
export function updateApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/game/set/update',
    method: 'post',
    data
  })
}

// 删除数据
export function deleteApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/game/set/delete',
    method: 'post',
    data
  })
}

// 获取特惠礼包商品列表
export function getSkuList(params) {
  return request({
    url: SOCIAL_URL + '/admin/game/set/detail/list',
    method: 'post',
    params
  })
}

// 修改明细商品
export function updateSetDetail(data) {
  return request({
    url: SOCIAL_URL + '/admin/game/set/detail/update',
    method: 'post',
    data
  })
}

// 删除明细商品
export function deleteSetDetail(data) {
  return request({
    url: SOCIAL_URL + '/admin/game/set/detail/delete',
    method: 'post',
    data
  })
}
