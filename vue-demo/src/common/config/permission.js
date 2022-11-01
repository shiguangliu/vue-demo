import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/common/js/auth'
import getPageTitle from '@/common/js/get-page-title'

NProgress.configure({ showSpinner: false }) // 不显示加载圆圈

// 免登录可进入的页面
const whiteList = ['/login', '/401', '/404', '/retrieve']

// 路由前置
router.beforeEach(async(to, from, next) => {
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0 && store.getters.menu.length > 0
      if (hasRoles) { // 判断当前员工是否有权限
        next()
      } else {
        await store.dispatch('staff/getStaffInfo').then(() => {
          const staffInfo = {
            staffId: store.getters.staffId,
            systemId: store.getters.currentSystemId
          }
          // 重新拉取当前员工菜单信息
          store.dispatch('permission/getPermissions', staffInfo).then(routers => { // 获取员工权限数据
            router.addRoutes(routers) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,设置replace: true，以便导航不会留下历史记录
          }).catch((err) => {
            store.dispatch('staff/logout').then(() => {
              sessionStorage.clear()
              Message.error(err || '授权无效，请重新登录')
              next({ path: '/' })
            })
          })
        }).catch((err) => {
          store.dispatch('staff/logout').then(() => {
            sessionStorage.clear()
            Message.error(err || '授权无效，请重新登录')
            next({ path: '/' })
          })
        })
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
// 路由后置
router.afterEach(() => {
  NProgress.done()
})
