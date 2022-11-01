import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import 'font-awesome/scss/font-awesome.scss'
import './icons' // icon
import vueWaves from '@/directive/waves/index'// 水波纹指令
import vueFocus from '@/directive/focus/index'// 聚焦指令
import vueImgAlart from '@/directive/imgAlart/index'// 图片弹窗指令
import * as filters from './filters' // global filters

import '@/common/config/errorLog' // 错误日志
import '@/common/config/permission' // 路由动态配置
import prototype from '@/common/js/prototype' // 挂载在原型上的方法
const FixedCacheKey = process.env.VUE_APP_ROUTER_BASE // 缓存补充Key

Vue.use(Element, {
  size: Cookies.get(FixedCacheKey + 'size') || 'mini' // set element-ui default size
})

Vue.use(prototype)
Vue.use(vueWaves)
Vue.use(vueFocus)
Vue.use(vueImgAlart)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
