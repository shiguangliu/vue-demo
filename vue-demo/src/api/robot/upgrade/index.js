import request from '@/common/js/request'

// 频道相关API
// 基础服务API路由
const SOCIAL_URL = process.env.VUE_APP_SERVICE_SOCIAL

// 马甲启程数据增长规则List
export function robotEquipmentChange(data) {
  return request({
    url: SOCIAL_URL + '/admin/robot/equipment/change',
    method: 'post',
    data
  })
}
