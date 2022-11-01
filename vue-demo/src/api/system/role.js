import request from '@/common/js/request'

// 基础服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 创建
export function createApi(data) {
  return request({
    url: BASE_URL + '/api.sys.roles.save.php',
    method: 'post',
    data
  })
}

// 编辑
export function updateApi(data) {
  return request({
    url: BASE_URL + '/api.sys.roles.save.php',
    method: 'post',
    data
  })
}

// 删除
export function deleteApi(data) {
  return request({
    url: BASE_URL + '/api.sys.roles.delete.php',
    method: 'post',
    data
  })
}

// 得到单条数据
export function getRowApi(data) {
  return request({
    url: BASE_URL + '/api.sys.roles.get.php',
    method: 'post',
    data
  })
}

// 获取列表
export function getListApi(data) {
  return request({
    url: BASE_URL + '/api.sys.roles.list.php',
    method: 'post',
    data
  })
}

// 获取全部系统菜单列表
export function getAllSysMenuList(data) {
  return request({
    url: BASE_URL + '/api.sys.menus.list.php',
    method: 'post',
    data
  })
}
