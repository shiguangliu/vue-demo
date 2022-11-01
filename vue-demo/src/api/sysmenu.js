import request from '@/common/js/request'

// 登录账号相关服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 菜单管理-模块
export function getModuleList(data) {
  return request({
    url: BASE_URL + '/admin/sysMenu/module/list',
    method: 'post',
    data
  })
}

// 菜单管理-菜单
export function getSysMenuList(data) {
  return request({
    url: BASE_URL + '/admin/sysMenu/menu/list',
    method: 'post',
    data
  })
}

// 菜单管理-页面
export function getSysPageList(data) {
  return request({
    url: BASE_URL + '/admin/sysMenu/page/list',
    method: 'post',
    data
  })
}

// 菜单管理-ALL
export function getAllMemuList(data) {
  return request({
    url: BASE_URL + '/admin/sysMenu/all/list',
    method: 'post',
    data
  })
}

// 菜单管理-模块-增
export function addModuleInfo(data) {
  return request({
    url: BASE_URL + '/admin/sysMenu/module/add',
    method: 'post',
    data
  })
}

// 菜单管理-模块-删
export function deleteModuleInfo(params) {
  return request({
    url: BASE_URL + '/admin/sysMenu/module/delete',
    method: 'post',
    params
  })
}

// 菜单管理-模块-改
export function editModuleInfo(data) {
  return request({
    url: BASE_URL + '/admin/sysMenu/module/edit',
    method: 'post',
    data
  })
}

// 菜单管理-模块-查
export function getModuleInfo(params) {
  return request({
    url: BASE_URL + '/admin/sysMenu/module/get',
    method: 'post',
    params
  })
}

// 菜单管理-菜单-增
export function addMenuInfo(data) {
  return request({
    url: BASE_URL + '/admin/sysMenu/menu/add',
    method: 'post',
    data
  })
}

// 菜单管理-菜单-删
export function deleteMenuInfo(params) {
  return request({
    url: BASE_URL + '/admin/sysMenu/menu/delete',
    method: 'post',
    params
  })
}

// 菜单管理-菜单-改
export function editMenuInfo(data) {
  return request({
    url: BASE_URL + '/admin/sysMenu/menu/edit',
    method: 'post',
    data
  })
}

// 菜单管理-菜单-查
export function getMenuInfo(params) {
  return request({
    url: BASE_URL + '/admin/sysMenu/menu/get',
    method: 'post',
    params
  })
}

// 菜单管理-页面-增
export function addPageInfo(data) {
  return request({
    url: BASE_URL + '/admin/sysMenu/page/add',
    method: 'post',
    data
  })
}

// 菜单管理-页面-删
export function deletePageInfo(params) {
  return request({
    url: BASE_URL + '/admin/sysMenu/page/delete',
    method: 'post',
    params
  })
}

// 菜单管理-页面-改
export function editPageInfo(data) {
  return request({
    url: BASE_URL + '/admin/sysMenu/page/edit',
    method: 'post',
    data
  })
}

// 菜单管理-页面-查
export function getPageInfo(params) {
  return request({
    url: BASE_URL + '/admin/sysMenu/page/get',
    method: 'post',
    params
  })
}
