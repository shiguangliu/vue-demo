// 子系统
const SUBSYSTEM = [
  { key: '18', name: '零坐标后台' }
]

// 通用上传API接口地址
const FILE_URLS = {
  file_upload_url: process.env.VUE_APP_BASE_API + process.env.VUE_APP_SERVICE_BASE + '/minio/upload',
  file_delete_url: process.env.VUE_APP_BASE_API + process.env.VUE_APP_SERVICE_BASE + '/minio/delete',
  static_url: process.env.VUE_APP_RESOURCE,
  publicPath: '' // 静态资源NoPicture用
}

// 省市区层级
const AREA_LEVEL = [
  { key: 1, name: '省' },
  { key: 2, name: '市' },
  { key: 3, name: '区' },
  { key: 4, name: '街道' }
]

// 评论类型
const COMMENT_TYPE = [
  { key: 10, name: '拼团订单' },
  { key: 11, name: '优选文章' }
]

const AMAP_KEY = '2a012f303af62fab29b7c28a928d213e'

export default {
  SUBSYSTEM,
  COMMENT_TYPE,
  FILE_URLS,
  AREA_LEVEL,
  AMAP_KEY
}
