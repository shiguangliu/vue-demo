import request from '@/common/js/request'

// 登录账号相关服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 员工登录
export function login(data) {
  return request({
    url: BASE_URL + '/admin/login',
    method: 'post',
    data
  })
}

// 刷新Token
export function refreshToken(params) {
  return request({
    url: BASE_URL + '/admin/token',
    method: 'post',
    params
  })
}

// 获取员工信息
export function getStaffInfo(params) {
  return request({
    url: BASE_URL + '/admin/sysStaff/get',
    method: 'post',
    params
  })
}

// 得到员工相关权限数据（菜单、画面及画面按钮权限）
export function getPermissionsApi(params) {
  return request({
    url: BASE_URL + '/admin/roleSysMenuList/get',
    method: 'post',
    params
  })
}

// 退出登录
export function logout(params) {
  return request({
    url: BASE_URL + '/admin/logout',
    method: 'post',
    params
  })
}

export function getLoginHistory(data) {
  return request({
    url: BASE_URL + '/admin/login/history/list',
    method: 'post',
    data
  })
}

export function updateStaff(data) {
  return request({
    url: BASE_URL + '/admin/sysStaff/save',
    method: 'post',
    data
  })
}

// changePwd
export function changePwd(data) {
  return request({
    url: BASE_URL + '/admin/changePassword',
    method: 'post',
    data
  })
}

export function mSendVerifyCode(data) {
  return request({
    url: BASE_URL + '/m.verifycode.send.php',
    method: 'post',
    data
  })
}

export function mCheckVerifyCode(data) {
  return request({
    url: BASE_URL + '/m.verifycode.check.php',
    method: 'post',
    data
  })
}

export function fetchUser(data) {
  return request({
    url: BASE_URL + '/api.user.get.php',
    method: 'post',
    data
  })
}

export function ifUserExist(data) {
  return request({
    url: BASE_URL + '/api.user.list.php',
    method: 'post',
    data
  })
}

// update
export function updateUser(data) {
  return request({
    url: BASE_URL + '/api.user.update.php',
    method: 'post',
    data
  })
}

// 部门
export function getDepartmentListApi(data) {
  return request({
    url: BASE_URL + '/api.department.list.php',
    method: 'post',
    data
  })
}

// 公司
export function getCompanyListApi(data) {
  return request({
    url: BASE_URL + '/api.company.list.php',
    method: 'post',
    data
  })
}

// 得到员工信息
export function getUserInfoApi(data) {
  return request({
    url: BASE_URL + '/api.user.get.php',
    method: 'post',
    data
  })
}
