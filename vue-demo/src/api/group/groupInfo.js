import request from '@/common/js/request'

const BASE_URL = process.env.VUE_APP_SERVICE_MALL

// 获取列表
export function getGroupListApi(data) {
  return request({
    url: BASE_URL + '/admin/group/getGroupList',
    method: 'post',
    data
  })
}
// 新增
export function createGroupApi(params) {
  return request({
    url: BASE_URL + '/admin/group/createGroup',
    method: 'post',
    params
  })
}
// 删除
export function deleteGroupApi(data) {
  return request({
    url: BASE_URL + '/admin/group/deleteGroup',
    method: 'post',
    data
  })
}

// 获取单个
export function getGroupInfoApi(params) {
  return request({
    url: BASE_URL + '/admin/group/getGroupInfo',
    method: 'post',
    params
  })
}

// 保存更新
export function saveGroupApi(data) {
  return request({
    url: BASE_URL + '/admin/group/saveGroup',
    method: 'post',
    data
  })
}

// 修改为编辑中1-审批不通过3-审批通过5
export function approveGroupStatusApi(params) {
  return request({
    url: BASE_URL + '/admin/group/approveGroupStatus',
    method: 'post',
    params
  })
}

// 获取商户列表
export function getMerchantListApi(params) {
  return request({
    url: BASE_URL + '/admin/sys/merchant/getMerchantList',
    method: 'post',
    params
  })
}
// 获取列表-导出
export function getGroupListForExport(data) {
  return request({
    url: BASE_URL + '/admin/group/getGroupListForExport',
    method: 'post',
    data
  })
}

