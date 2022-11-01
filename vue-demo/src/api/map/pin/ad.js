import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

// 查询特殊坐标点List
export function getLandMarkList(data) {
  return request({
    url: USER_URL + '/admin/fzLandMarkGeo/list',
    method: 'post',
    data
  })
}

// 查询详情
export function getLandInfo(params) {
  return request({
    url: USER_URL + '/admin/landBatch/info',
    method: 'post',
    params
  })
}

// 保存特殊点
export function saveLandMark(data) {
  return request({
    url: USER_URL + '/admin/fzLandMarkGeo/save',
    method: 'post',
    data
  })
}

// 新增特殊点
export function addLandMark(data) {
  return request({
    url: USER_URL + '/admin/fzLandMarkGeo/add',
    method: 'post',
    data
  })
}

// 批量删除
export function deleteLandBatch(data) {
  return request({
    url: USER_URL + '/admin/landBatch/delete',
    method: 'post',
    data
  })
}
