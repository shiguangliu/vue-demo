import request from '@/common/js/request'

const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取列表
export function listApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/game/item/list',
    method: 'post',
    data
  })
}

// 获取列表
export function rptApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/game/item/rpt/list',
    method: 'post',
    data
  })
}

// 新增
export function insertApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/game/item/insert',
    method: 'post',
    params
  })
}

// 取得单条明细
export function getApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/game/item/get',
    method: 'post',
    params
  })
}

// 更新单挑数据
export function updateApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/game/item/update',
    method: 'post',
    data
  })
}

// 删除数据
export function deleteApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/game/item/delete',
    method: 'post',
    data
  })
}
