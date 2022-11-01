import request from '@/common/js/request'

const BASE_URL = process.env.VUE_APP_SERVICE_MALL

// 获取单个
export function getNoticeInfoApi(params) {
  return request({
    url: BASE_URL + '/admin/group/notice/getNoticeInfo',
    method: 'post',
    params
  })
}

// 更新
export function saveNoticeApi(params) {
  return request({
    url: BASE_URL + '/admin/group/notice/saveNotice',
    method: 'post',
    params
  })
}
