import request from '@/common/js/request'

// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取列表
export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/task/list',
    method: 'post',
    data
  })
}
// 删除任务
export function deleteDetailApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/task/detail/delete',
    method: 'post',
    params
  })
}
// 创建任务
export function createApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/task/create',
    method: 'post',
    params
  })
}
// 创建任务明细
export function createDetailTaskApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/task/detail/create',
    method: 'post',
    params
  })
}
// 批量删除任务
export function deleteBatchApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/task/batch/delete',
    method: 'post',
    data
  })
}
// 获取任务
export function getTaskApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/task/get',
    method: 'post',
    params
  })
}
// 获取任务明细
export function getDetailListApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/task/detail/list',
    method: 'post',
    params
  })
}
// 更新任务
export function updateTaskApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/task/update',
    method: 'post',
    data
  })
}
// 更新任务明细
export function updateDetailTaskApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/task/detail/update',
    method: 'post',
    data
  })
}
// 获取任务明细详情
export function getDetailTaskApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/task/detail/get',
    method: 'post',
    params
  })
}
// 获取任务奖励删除
export function deleteTaskBonusApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/task/bonus/delete',
    method: 'post',
    params
  })
}
// 根据任务类型获取任务明细
export function getTaskDetailByTaskTypeApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/task-detail/with-task-type/list',
    method: 'post',
    params
  })
}
