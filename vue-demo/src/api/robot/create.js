import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const USER_URL = process.env.VUE_APP_SERVICE_USER

// 创建马甲
export function createRobotApi(data) {
  return request({
    url: USER_URL + '/admin/robot/create',
    method: 'post',
    data
  })
}
