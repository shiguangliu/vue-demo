import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

// 修改用户状态
export function getReportUserLifeCycleApi(data) {
  return request({
    url: USER_URL + '/admin/report/user/lifeCycle',
    method: 'post',
    data
  })
}
