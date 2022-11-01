import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取用户详情
export function getApi(params) {
  return request({
    url: USER_URL + '/admin/user/info',
    method: 'post',
    params
  })
}

// 修改用户状态
export function updateApi(params) {
  return request({
    url: USER_URL + '/admin/user/updateStatus',
    method: 'post',
    params
  })
}

// 后台功能用户管理详情地址信息
export function getUserAddressList(params) {
  return request({
    url: USER_URL + '/admin/user/address/list',
    method: 'post',
    params
  })
}

// 后台功能用户详情车辆认证信息
export function getUserManageCarList(params) {
  return request({
    url: SOCIAL_URL + '/admin/user/manage/car/list',
    method: 'post',
    params
  })
}

// 获取用户装备信息
export function getEquipmentList(data) {
  return request({
    url: SOCIAL_URL + '/admin/user/manage/equipment/list',
    method: 'post',
    data
  })
}

// 后台功能用户详情装备信息装备总性能分
export function getSumPerformance(params) {
  return request({
    url: SOCIAL_URL + '/admin/user/manage/equipment/performance',
    method: 'post',
    params
  })
}

// 获取用户账户余额
export function getUserAccountManage(params) {
  return request({
    url: SOCIAL_URL + '/admin/user/account/manage',
    method: 'post',
    params
  })
}

// 后台功能用户详情账户变动记录
export function getUserAccountChangeRecord(data) {
  return request({
    url: SOCIAL_URL + '/admin/user/account/changeRecord',
    method: 'post',
    data
  })
}

// 后台功能用户详情交易记录
export function getUserTransOrderList(data) {
  return request({
    url: SOCIAL_URL + '/admin/user/transOrder/list',
    method: 'post',
    data
  })
}

// 后台功能用户详情路赛记录List
export function getUserRaceList(data) {
  return request({
    url: SOCIAL_URL + '/admin/user/race/list',
    method: 'post',
    data
  })
}

// 后台功能用户管理(删除马甲)
export function userDelete(params) {
  return request({
    url: USER_URL + '/admin/user/delete',
    method: 'post',
    params
  })
}

// 后台功能路赛记录导出
export function getUserRaceExport(data) {
  return request({
    url: SOCIAL_URL + '/admin/user/race/export',
    method: 'post',
    data
  })
}
