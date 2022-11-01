import request from '@/common/js/request'

const BASE_URL = process.env.VUE_APP_SERVICE_BASE

const MALL_URL = process.env.VUE_APP_SERVICE_MALL

const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取常量列表
export function getConfigItemsListApi(params) {
  return request({
    url: BASE_URL + '/admin/sys/configItems/getConfigItemsList',
    method: 'post',
    params
  })
}

// 获取常量列表
export function updateConfigItemsListApi(data) {
  return request({
    url: BASE_URL + '/admin/sys/configItems/update',
    method: 'post',
    data
  })
}

// 城市列表
export function cityOptionsList(data) {
  return request({
    url: BASE_URL + '/admin/sysArea/list',
    method: 'post',
    data
  })
}

// 获取商户列表
export function getMerchantListApi(params) {
  return request({
    url: MALL_URL + '/admin/sys/merchant/getMerchantList',
    method: 'post',
    params
  })
}

// 获取所有启用车辆品牌
export function getCarBrandNameList(params) {
  return request({
    url: SOCIAL_URL + '/admin/getCarBrandName/list',
    method: 'post',
    params
  })
}

// 根据品牌id获取所有启用车辆系列
export function getCarSeriesNameList(params) {
  return request({
    url: SOCIAL_URL + '/admin/getCarSeriesName/list',
    method: 'post',
    params
  })
}

// 取得优选下拉框
export function getBestListApi(params) {
  return request({
    url: MALL_URL + '/admin/best/listDrop',
    method: 'post',
    params
  })
}

// 取得优选标签下拉框
export function getBestTagListApi(data) {
  return request({
    url: BASE_URL + '/admin/tag/listAll',
    method: 'post',
    data
  })
}

// 获取所有非删除车辆品牌组
export function getBrandGroupApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/carBrandGroup/searchList',
    method: 'post',
    data
  })
}

// 根据车辆品牌组id查询所有非删除车辆品牌
export function getBrandNameListApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/getCarBrandName/searchList',
    method: 'post',
    params
  })
}
