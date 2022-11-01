import request from '@/common/js/request'

// 登录账号相关服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 员工角色管理
export function updateApi(data) {
  return request({
    url: BASE_URL + '/admin/sysStaffRole/save',
    method: 'post',
    data
  })
}

export function getListApi(params) {
  return request({
    url: BASE_URL + '/admin/sysStaffRole/list',
    method: 'post',
    params
  })
}
