import request from '@/common/js/request'
// 员工管理相关接口
// 基础服务API路由
const BASE_URL = process.env.VUE_APP_SERVICE_BASE

// 创建
export function createApi(data) {
  return request({
    url: BASE_URL + '/api.user.insert.php',
    method: 'post',
    data
  })
}

// 编辑
export function updateApi(data) {
  return request({
    url: BASE_URL + '/api.user.update.php',
    method: 'post',
    data
  })
}

// 删除
export function deleteApi(data) {
  return request({
    url: BASE_URL + '/api.user.delete.php',
    method: 'post',
    data
  })
}

// 得到单条数据
export function getRowApi(data) {
  return request({
    url: BASE_URL + '/api.user.get.php',
    method: 'post',
    data
  })
}

// 获取列表
export function getListApi(data) {
  return request({
    url: BASE_URL + '/api.user.list.php',
    method: 'post',
    data
  })
}
