import request from '@/common/js/request'

// 登录账号相关服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 子系统管理
export function getListApi(data) {
  return request({
    url: BASE_URL + '/admin/sysModule/list',
    method: 'post',
    data
  })
}
