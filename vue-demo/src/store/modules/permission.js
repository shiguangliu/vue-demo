import { getPermissionsApi } from '@/api/account'
// 布局组件
import Layout from '@/layout/index'
import AppMain from '@/layout/components/AppMain'

// 添加默认页面
function addPage(arr) {
  // 首页
  const home = {
    id: 0,
    pid: 1,
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'Home',
        meta: { title: '首页', code: 'home', icon: 'fa fa-home fa-lg' }
      }
    ]
  }
  arr.unshift(home)
  return arr
}

// 菜单结构数据元转换为树形菜单结构数据元
function menuItem2TreeItem(menu, index) {
  const item = {} // 第1层级菜单
  item.id = menu.menuId
  item.pid = menu.parentId
  item.meta = {}
  item.meta.title = menu.menuName
  item.meta.code = menu.routePath
  item.meta.icon = menu.icon
  item.meta.id = menu.menuId
  // 使路由名字具有唯一性
  item.name = menu.menuName + index + menu.level
  // 设置对应的页面路径
  item.path = '/' + menu.routePath
  if (Number(menu.level) === 1 || Number(menu.level) === 2) {
    // 第一、二级子菜单，默认跳转到第1个子菜单或子页面
    item.redirect = getFirstSubPath(menu)
  }
  // 第1层级默认布局
  if (Number(menu.level) === 1) {
    item.component = Layout
    if (menu.pageList.length <= 0) {
      item.redirect = ''
    }
  } else if (Number(menu.level) === 2 && menu.pageList.length > 0) {
    item.component = AppMain
  } else {
    item.component = Layout
  }
  item.sort = menu.sort
  // 子菜单
  item.children = []
  return item
}

// 得到第一级子菜单或子页面路由
function getFirstSubPath(menu) {
  if (menu.subList.length > 0) {
    const subItem = menu.subList[0]
    return `${menu.routePath}/${subItem.routePath}`
  } else if (menu.pageList.length > 0) {
    const page = menu.pageList[0]
    return `/${page.routePath}`
  } else {
    return ''
  }
}

// 菜单页面结构数据元转换为树形菜单结构数据元
function pageItem2TreeItem(page, menu, index) {
  const item = {} // 第1层级菜单
  item.id = page.pageId
  item.pid = menu.id
  item.meta = {}
  item.meta.title = page.pageName
  item.meta.code = page.routePath
  item.meta.icon = ''
  item.meta.id = page.pageId
  item.meta.routeName = page.routeName
  // 使路由名字具有唯一性
  item.name = page.pageName + index + menu.id
  // 设置对应的页面路径
  item.path = '/' + page.routePath
  // 如果菜单不显示，则设置隐藏
  if (page.menuFlag !== '1' && page.menuFlag !== 1) {
    item.hidden = true
  }

  // 组件类型:0-无 1-默认布局 2-页面组件
  if (Number(page.component) === 1 || Number(page.component) === 0) {
    item.component = Layout
  } else if (Number(page.component) === 2) {
    item.component = resolve => require([`@/views${item.path}`], resolve)
  } else {
    item.component = resolve => require(['@/views/sys/error-page/401'], resolve)
  }
  item.sort = page.sort
  // 子菜单
  item.children = []
  return item
}

const permission = {
  namespaced: true,
  state: {
    routes: [],
    menu: [],
    baseMenu: [],
    dataPermits: []
  },
  mutations: {
    // 设置用户菜单
    SET_MENU: (state, menu, baseMenu) => {
      state.menu = menu
      state.baseMenu = baseMenu
      state.routes = menu
    },
    // 设置数据权限
    SET_DATAPERMITS: (state, dataPermits) => {
      state.dataPermits = dataPermits
    }
  },
  actions: {
    // 获取登录员工权限数据
    getPermissions({ commit }, staffInfo) {
      return new Promise((resolve, reject) => {
        getPermissionsApi(staffInfo).then(res => {
          if (Number(res.code) === 200) {
            // 组织树形菜单
            let treeMenu = []
            const dataPermits = []
            const menuList = res.data || res.data.menuList || []
            menuList.forEach((menu, index) => {
              // 一级菜单
              let item = {}
              item = menuItem2TreeItem(menu, index)
              // 一级菜单子页面
              const pageList = menu.pageList || []
              pageList.forEach((page, pageindex) => {
                let pageitem = {} // 子页面
                pageitem = pageItem2TreeItem(page, item, (index + pageindex))
                // 添加子页面
                item.children.push(pageitem)
                // 整理画面菜单权限
                const buttonList = page.pageButtonList || []
                buttonList.forEach(btn => {
                  if (Number(btn.buttonRight) === 1) {
                    dataPermits.push(pageitem.meta.routeName + ':' + btn.buttonId)
                  }
                })
              })
              // 二级菜单
              const subList = menu.subList || []
              subList.forEach((submenu, subindex) => {
                let subitem = {}
                subitem = menuItem2TreeItem(submenu, (index + subindex))
                // 二级菜单子页面
                const subPageList = submenu.pageList || []
                subPageList.forEach((subpage, subpageindex) => {
                  let pageitem = {} // 子页面
                  pageitem = pageItem2TreeItem(subpage, subitem, (subindex + subpageindex))
                  // 添加子页面
                  subitem.children.push(pageitem)
                  // 整理画面菜单权限
                  const subButtonList = subpage.pageButtonList || []
                  subButtonList.forEach(btn => {
                    if (Number(btn.buttonRight) === 1) {
                      dataPermits.push(pageitem.meta.routeName + ':' + btn.buttonId)
                    }
                  })
                })

                item.children.push(subitem)
              })
              // 添加菜单元
              treeMenu.push(item)
            })

            // 得到静态目录
            treeMenu = addPage(treeMenu)
            // 添加不需要权限也能访问的页面
            commit('SET_MENU', treeMenu, treeMenu)
            commit('SET_DATAPERMITS', dataPermits)
            // 返回全部路由菜单
            resolve(treeMenu)
          } else {
            // 得到静态目录
            const treeMenu = addPage([])
            commit('SET_MENU', treeMenu, treeMenu)
            reject(res.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 清除用户权限
    clearPermissions({ commit }) {
      // 清除用户权限
      commit('SET_MENU', [], [])
      commit('SET_DATAPERMITS', [])
    }
  }
}

export default permission
