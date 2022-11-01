import request from '@/common/js/request'

// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 获取列表
export function getListApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/list',
    method: 'post',
    data
  })
}
// 创建
export function createApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/create',
    method: 'post',
    params
  })
}
// 删除
export function deleteApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/delete',
    method: 'post',
    params
  })
}
// 更新
export function updateDetailApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/detail/update',
    method: 'post',
    data
  })
}

// 官方联赛详情编辑
export function editDetailApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/detail/edit',
    method: 'post',
    data
  })
}

// 详情
export function getDetailApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/detail/get',
    method: 'post',
    params
  })
}
// 奖励详情
export function getRankInfoApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/rank/get',
    method: 'post',
    params
  })
}
// 更新奖励等级设置
export function updateRankInfoApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/rank/update',
    method: 'post',
    data
  })
}
// 更新奖励等级设置
export function addRankPrizeApi(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/prize/add',
    method: 'post',
    data
  })
}
// 删除等级奖励
export function deleteRankPrizeApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/prize/delete',
    method: 'post',
    params
  })
}
// 删除等级信息
export function deleteRankApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/rank/delete',
    method: 'post',
    params
  })
}

// 官方联赛报名用户信息
export function getCupJoinsList(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/joins/list',
    method: 'post',
    data
  })
}

// 官方联赛报名用户信息导出
export function exportCupJoinsList(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/joins/export',
    method: 'post',
    data
  })
}

// 官方联赛报名用户信息
export function getRaceUserList(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/user/list',
    method: 'post',
    params
  })
}

// 官方联赛比赛奖励详情
export function getRaceRewardList(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/reward/list',
    method: 'post',
    params
  })
}

// 官方联赛比赛奖励详情确认发放
export function raceRewardConfirmDistribution(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/reward/confirm/distribution',
    method: 'post',
    params
  })
}

// 官方联赛详情报名用户详情
export function getRaceRewardUserDetails(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/reward/user/details',
    method: 'post',
    params
  })
}

// 官方联赛详情报名用户信息添加马甲
export function raceCupJoinsInsertRobot(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/robot/join',
    method: 'post',
    params
  })
}

// 官方联赛详情报名用户详情删除马甲
export function raceCupJoinsDelRobot(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/robot/del',
    method: 'post',
    params
  })
}

// 官方联赛详情报名用户详情修改积分
export function raceCupRobotUpdateScore(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/robot/updateScore',
    method: 'post',
    params
  })
}

// 官方联赛详情报名用户详情结果发布
export function raceCupRobotResultsRelease(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/robot/results/release',
    method: 'post',
    params
  })
}
// copy一个官方联赛详情
export function copyApi(params) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/copy',
    method: 'post',
    params
  })
}
// 导出官方联赛列表
export function exportRaceCupList(data) {
  return request({
    url: SOCIAL_URL + '/admin/race/cup/list/export',
    method: 'post',
    data
  })
}
