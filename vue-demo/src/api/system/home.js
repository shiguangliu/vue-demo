import request from '@/common/js/request'

// 基础服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 首页累加数统计
export function homeCountApi(data) {
  return request({
    url: BASE_URL + '/api.home.count.to.list.php',
    method: 'post',
    data
  })
}

// 首页图表统计数据
export function homeChartApi(data) {
  return request({
    url: BASE_URL + '/api.home.chart.report.php',
    method: 'post',
    data
  })
}

// 首页ToDO 数据统计
export function homeTodoApi(data) {
  return request({
    url: BASE_URL + '/api.home.todo.list.php',
    method: 'post',
    data
  })
}

// 首页消息列表数据统计
export function homeMessageApi(data) {
  return request({
    url: BASE_URL + '/api.home.message.list.php',
    method: 'post',
    data
  })
}

// 消息已读
export function messageReadApi(data) {
  return request({
    url: BASE_URL + '/m.user.message.read.php',
    method: 'post',
    data
  })
}
