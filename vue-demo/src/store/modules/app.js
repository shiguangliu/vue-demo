import Cookies from 'js-cookie'
const FixedCacheKey = process.env.VUE_APP_ROUTER_BASE // 缓存补充Key

const state = {
  sidebar: {
    opened: Cookies.get(FixedCacheKey + 'sidebarStatus') ? !!+Cookies.get(FixedCacheKey + 'sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get(FixedCacheKey + 'size') || 'medium',
  // 全屏状态
  fullScreen: false
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set(FixedCacheKey + 'sidebarStatus', 1)
    } else {
      Cookies.set(FixedCacheKey + 'sidebarStatus', 0)
    }
  },
  TOGGLE_FULLSCREEN: (state) => {
    state.fullScreen = !state.fullScreen
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set(FixedCacheKey + 'sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set(FixedCacheKey + 'size', size)
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
