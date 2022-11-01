import { login, logout, refreshToken as refreshTokenApi, getStaffInfo as getStaffInfoApi } from '@/api/account'
import {
  getToken, setToken, removeToken, getTokenExpiredAt, setTokenExpiredAt, removeTokenExpiredAt,
  getRefreshToken, setRefreshToken, removeRefreshToken, getStaffId, setStaffId, removeStaffId } from '@/common/js/auth'
import router, { resetRouter } from '@/router'
import v_head from '@/assets/img/v_head.png'
import thconsts from '@/constants/index' // 系统常量定义

// 用户信息存储元
const state = {
  token: getToken(),
  tokenExpiredAt: getTokenExpiredAt(),
  refreshToken: getRefreshToken(),
  staffId: getStaffId(),
  staffNo: '', // 员工编号
  name: '', // 员工姓名
  mail: '', // 邮箱
  phone: '', // 手机号
  gender: '', // 性别
  avatar: '', // 头像
  description: '', // 个人介绍
  roles: [], // 当前用户拥有的权限id列表
  roleInfoList: [], // 当前用户拥有的权限信息列表
  staffType: '', // 员工类型id：1-平台员工 2-商户员工 9-超级管理员
  staffTypeName: '', // 员工类型名称
  currentSystemId: '18', // 当前子系统Id(0-默认)
  subSystemList: [], // 子系统列表：零坐标
  subSystemInfoList: [], // 子系统信息列表：零坐标
  merchantList: [], // 用户所属的商户ID列表
  merchantInfoList: [] // 用户所属的商户信息列表
}

const mutations = {
  SET_STAFFID: (state, staffId) => {
    state.staffId = staffId
  },
  SET_STAFFNO: (state, staffNo) => {
    state.staffNo = staffNo
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_MAIL: (state, mail) => {
    state.mail = mail
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = ((avatar || '') === '' ? (thconsts.FILE_URLS.publicPath + v_head) : thconsts.FILE_URLS.static_url + avatar)
  },
  SET_GENDER: (state, gender) => {
    state.gender = gender
  },
  SET_DESCRIPTION: (state, description) => {
    state.description = description
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLEINFOLIST: (state, roleList) => {
    state.roleInfoList = roleList
  },
  SET_STAFFTYPE: (state, staffType) => {
    state.staffType = staffType
  },
  SET_STAFFTYPENAME: (state, staffTypeName) => {
    state.staffTypeName = staffTypeName
  },
  SET_CURRENTSYSTEMID: (state, currentSystemId) => {
    state.currentSystemId = currentSystemId
  },
  SET_SUBSYSTEMLIST: (state, subsyslist) => {
    state.subSystemList = subsyslist
  },
  SET_SUBSYSTEMINFOLIST: (state, subsyslist) => {
    state.subSystemInfoList = subsyslist
  },
  SET_MERCHANTLIST: (state, merchantlist) => {
    state.merchantList = merchantlist
  },
  SET_MERCHANTINFOLIST: (state, merchantlist) => {
    state.merchantInfoList = merchantlist
  }
}

const actions = {
  // user login
  login({ commit }, staffInfo) {
    const { staffNo, password, subSystemId } = staffInfo
    return new Promise((resolve, reject) => {
      login({ staffNo: staffNo.trim(), password: password, ip: '', subSystemId: subSystemId }).then(response => {
        const { data } = response
        if (response.code === '200' || response.code === 200) {
          // 记住用户信息
          commit('SET_TOKEN', data.token.tokenHead + data.token.token) // 登录TOKEN
          commit('SET_REFRESH_TOKEN', data.token.refreshToken) // 刷新TOKEN
          commit('SET_STAFFID', data.staffId || data.id)
          commit('SET_ROLES', data.roles || [999])
          commit('SET_ROLEINFOLIST', data.roleInfoList)
          commit('SET_NAME', data.staffName)
          commit('SET_MAIL', data.mail)
          commit('SET_PHONE', data.phone)
          commit('SET_GENDER', data.gender)
          commit('SET_AVATAR', data.avatarUrl)
          commit('SET_STAFFTYPE', data.staffType)
          commit('SET_STAFFTYPENAME', data.staffTypeName)
          commit('SET_DESCRIPTION', data.description)
          commit('SET_CURRENTSYSTEMID', subSystemId || '1') // 默认零坐标
          commit('SET_SUBSYSTEMLIST', data.subSystemList)
          commit('SET_SUBSYSTEMINFOLIST', data.subSystemInfoList)
          commit('SET_MERCHANTLIST', data.merchantList)
          commit('SET_MERCHANTINFOLIST', data.merchantInfoList)
          // save to cookie
          setToken(data.token.tokenHead + data.token.token)
          const expiredAt = new Date()
          expiredAt.setSeconds(expiredAt.getSeconds() + data.token.expiresIn)
          setTokenExpiredAt(expiredAt)
          setRefreshToken(data.token.refreshToken)
          setStaffId(data.staffId || data.id)
          resolve()
        } else {
          reject(response.message)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user login refresh token
  doRefreshToken({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.refreshToken === undefined || state.refreshToken === '') {
        const tips = '登录已失效, 请重新登录'
        reject(tips)
      } else {
        refreshTokenApi({ staffId: state.staffId, refreshToken: state.refreshToken }).then(response => {
          const { data } = response
          if (response.code === '200' || response.code === 200) {
            // 记住用户信息
            commit('SET_TOKEN', data.tokenHead + data.token) // 登录TOKEN
            commit('SET_REFRESH_TOKEN', data.refreshToken) // 刷新TOKEN
            // save to cookie
            setToken(data.tokenHead + data.token)
            const expiredAt = new Date()
            expiredAt.setSeconds(expiredAt.getSeconds() + data.expiresIn)
            setTokenExpiredAt(expiredAt)
            setRefreshToken(data.refreshToken)
            resolve(data)
          } else {
            reject(response.message)
          }
        }).catch(error => {
          reject(error)
        })
      }
    })
  },

  // get staff info
  getStaffInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const staffInfo = {
        staffId: state.staffId
      }
      getStaffInfoApi(staffInfo).then(response => {
        if (response.code === '200' || response.code === 200) {
          const { data } = response
          // 记住员工信息
          commit('SET_STAFFID', data.staffId || data.id)
          commit('SET_ROLES', data.roles || [999])
          commit('SET_NAME', data.staffName)
          commit('SET_AVATAR', data.avatarUrl)
          commit('SET_STAFFTYPE', data.staffType)
          commit('SET_DESCRIPTION', data.description)
          commit('SET_PHONE', data.phone)
          commit('SET_MAIL', data.mail)
          commit('SET_ROLEINFOLIST', data.roleInfoList)
          commit('SET_SUBSYSTEMLIST', data.subSystemList)
          commit('SET_SUBSYSTEMINFOLIST', data.subSystemInfoList)
          commit('SET_MERCHANTLIST', data.merchantList)
          commit('SET_MERCHANTINFOLIST', data.merchantInfoList)
          commit('SET_GENDER', data.gender)
          resolve(data)
        } else {
          reject(response.message)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // staff logout
  logout({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        sessionStorage.clear()
        resolve()
      }, 500)
      const staffInfo = {
        staffId: state.staffId
      }
      logout(staffInfo).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_STAFFID', '')
        commit('SET_ROLES', [])
        commit('SET_NAME', '')
        commit('SET_MAIL', '')
        commit('SET_PHONE', '')
        commit('SET_GENDER', '')
        commit('SET_AVATAR', '')
        commit('SET_STAFFTYPE', '')
        commit('SET_DESCRIPTION', '')
        commit('SET_ROLEINFOLIST', [])
        commit('SET_SUBSYSTEMLIST', [])
        commit('SET_SUBSYSTEMINFOLIST', [])
        commit('SET_MERCHANTLIST', [])
        // 菜单权限
        removeToken()
        removeTokenExpiredAt()
        removeRefreshToken()
        removeStaffId()
        resetRouter()
        dispatch('permission/clearPermissions', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove session
  resetSession({ commit }) {
    return new Promise(resolve => {
      setTimeout(() => {
        sessionStorage.clear()
        resolve()
      }, 500)
      commit('SET_TOKEN', '')
      commit('SET_REFRESH_TOKEN', '')
      commit('SET_STAFFID', '')
      commit('SET_ROLES', [])
      commit('SET_NAME', '')
      commit('SET_MAIL', '')
      commit('SET_PHONE', '')
      commit('SET_GENDER', '')
      commit('SET_AVATAR', '')
      commit('SET_STAFFTYPE', '')
      commit('SET_DESCRIPTION', '')
      commit('SET_ROLEINFOLIST', [])
      commit('SET_SUBSYSTEMLIST', [])
      commit('SET_SUBSYSTEMINFOLIST', [])
      commit('SET_MERCHANTLIST', [])
      removeToken()
      removeTokenExpiredAt()
      removeRefreshToken()
      removeStaffId()
      resolve()
    })
  },

  // dynamically change subsystem's permissions
  changeSystem({ commit, dispatch }, systemId) {
    return new Promise(async resolve => {
      // 切换子系统
      commit('SET_CURRENTSYSTEMID', systemId)
      const { staffId, roles } = await dispatch('getStaffInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const userInfo = {
        staffId: staffId,
        systemId: systemId,
        roleList: roles
      }
      const accessRoutes = await dispatch('permission/getPermissions', userInfo, { root: true })
      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  setMail({ commit }, data) {
    commit('SET_MAIL', data)
  },

  setPhone({ commit }, data) {
    commit('SET_PHONE', data)
  },

  setGender({ commit }, data) {
    commit('SET_GENDER', data)
  },

  setName({ commit }, data) {
    commit('SET_NAME', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
