import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const MALL_URL = process.env.VUE_APP_SERVICE_MALL

// 获取列表
export function getInfoApi(params) {
  return request({
    url: MALL_URL + '/admin/advert/pop/info',
    method: 'post',
    params
  })
}

// 修改状态
export function updateStatusApi(data) {
  return request({
    url: MALL_URL + '/admin/advert/pop/updateStatus',
    method: 'post',
    data
  })
}

// 保存数据
export function updateApi(data) {
  return request({
    url: MALL_URL + '/admin/advert/pop/update',
    method: 'post',
    data
  })
}
