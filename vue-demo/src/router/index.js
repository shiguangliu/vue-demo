import Vue from 'vue'
import Router from 'vue-router'
// 布局组件
import Layout from '@/layout/index'

Vue.use(Router)

/**
 * 路由对象的key
 * path 路径
 * component 映射页面
 * name 路由名字 (唯一，不可重复，相当于唯一标识)
 * hidden 设置为true则加载菜单的时候不渲染这个路由
 * meta: { // 自定义参数，这里用来做菜单渲染
 *    title 菜单渲染显示的名字
 *    icon  菜单图标
 * }
 */

/**
 * 基础路由, 不被权限控制的
 */
export const baseRouter = [
  // 实现路由刷新效果
  {
    path: '/redirect',
    component: resolve => require([`@/components/RouterView`], resolve),
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  // 登录页面
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    name: '登录',
    hidden: true,
    meta: { title: '登录', icon: '' }
  },
  {
    path: '/retrieve',
    component: () => import('@/views/sys/retrieve/index'),
    name: '找回密码',
    hidden: true,
    meta: { title: '找回密码', icon: '' }
  },
  // 错误页面定义
  {
    path: '/401',
    name: '401',
    hidden: true,
    meta: { title: '401', icon: '' },
    component: () => import('@/views/sys/error-page/401')
  },
  {
    path: '/404',
    name: '404',
    hidden: true,
    meta: { title: '404', icon: '' },
    component: () => import('@/views/sys/error-page/404')
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: '/profile/index',
        component: () => import('@/views/profile/index'),
        name: '个人中心',
        meta: { title: '个人中心', code: 'profile', icon: 'fa fa-user fa-lg' }
      }
    ]
  }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.VUE_APP_ROUTER_BASE,
  routes: baseRouter
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
