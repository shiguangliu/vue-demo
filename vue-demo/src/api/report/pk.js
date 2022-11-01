import request from '@/common/js/request'

// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 报表：11-常规路赛总览
export function getReportPkRegularSummary(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/pk/regularSummary',
    method: 'post',
    data
  })
}
// 报表：12-疯狂路赛总览
export function getReportPkCrazySummary(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/pk/crazySummary',
    method: 'post',
    data
  })
}
// 报表：13-地图使用情况总览
export function getReportPkMapSummary(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/pk/mapSummary',
    method: 'post',
    data
  })
}
// 获取可用的地图列表数据
export function getRaceMapListCanUse(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/map/listCanUse',
    method: 'post',
    data
  })
}
// 报表：14-官方联赛情况总览-1
export function getReportPkCupSummary1(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/pk/cupSummary1',
    method: 'post',
    data
  })
}
// 报表：14-官方联赛情况总览-2
export function getReportPkCupSummary2(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/pk/cupSummary2',
    method: 'post',
    data
  })
}
// 报表：14-官方联赛情况总览-3
export function getReportPkCupSummary3(data) {
  return request({
    url: SOCIAL_URL + '/admin/report/pk/cupSummary3',
    method: 'post',
    data
  })
}
// 获取有效的官方联赛列表数据
export function getRaceCupList(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/listForReport',
    method: 'post',
    data
  })
}
