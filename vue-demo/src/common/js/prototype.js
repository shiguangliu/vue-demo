import utils from '@/common/js/utils' // 公共方法
import validate from '@/common/js/validateObject' // 公共验证方法
import initRules from '@/common/js/initRules' // 初始化验证规则
import initDataPermits from '@/common/js/initDataPermits' // 初始化数据权限
import handleAPI from '@/common/js/handleApi' // 基本操作API的方法
import eventBus from '@/common/js/eventBus'
import md5 from 'js-md5' // md5加密
import thconsts from '@/constants/index' // 系统常量定义

export default {
  install(Vue, options) {
    Vue.prototype.$fn = utils
    Vue.prototype.$validate = validate
    Vue.prototype.$initRules = initRules
    Vue.prototype.$initDataPermits = initDataPermits
    Vue.prototype.$handleAPI = handleAPI
    Vue.prototype.$eventBus = eventBus
    Vue.prototype.$MD5 = md5
    Vue.prototype.$TH = thconsts
  }
}
