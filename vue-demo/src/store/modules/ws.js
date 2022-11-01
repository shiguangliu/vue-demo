import ws from '@/common/js/ws-socket'
import { setLocalStorage, getLocalStorage } from '@/common/js/storage'

const state = {
  packetUnRead: [], // 未读消息记录
  packetHistory: [], // 消息历史记录
  imOnline: 0 // IM服务是否在线：1-在线 0-不在线
}

const mutations = {
  // 初始化WebSocket连接 注册
  INIT_SOCKET_CONNECT: (state, callback) => {
    // 建立连接
    ws.open(process.env.VUE_APP_IM_SERVER)
    // 接收到消息
    ws.onmessage((packet) => {
      callback(packet)
    })
  },
  // 发送数据包
  SEND: (state, packet) => {
    ws.send(packet)
  },
  // 保存聊天记录 localStorage.packetHistory
  SAVE_MESSAGE: (state, { packet, path }) => {
    const key = 'HISTORYCHAT(' + path + ')'
    let historyChat = getLocalStorage(key, 'JSON')
    historyChat = historyChat || {}
    // 聊天记录对应某个聊天窗口对象
    if (packet.scope !== undefined && packet.scope !== null) {
      console.log(packet)
      const who = 'ct' + ((packet.scope.cityId !== undefined && packet.scope.cityId !== null) ? packet.scope.cityId : packet.scope.channelType)
      if (!historyChat[who]) {
        historyChat[who] = []
      }
      // 最多缓存每个聊天对象100条历史记录
      if (historyChat[who].length >= 100) {
        historyChat[who].shift()
      }
      historyChat[who].push(packet)
      setLocalStorage(key, historyChat, 'JSON')
    }
  },
  // 更新IM服务在线状态
  CHANGE_IM_ONLINE: (state, online) => {
    state.imOnline = online || 0 // 默认不在线
  }
}

const actions = {
  // 初始化WebSocket连接
  initConnect({ commit, state }, callback) {
    return new Promise((resolve, reject) => {
      commit('INIT_SOCKET_CONNECT', callback)
    })
  },
  // 发送消息
  send({ commit, packet }, callback) {
    return new Promise((resolve, reject) => {
      // 发送消息
      commit('SEND', packet)
      // 记录消息记录
      // commit('SAVE_MESSAGE', packet)
    })
  },
  saveMessage({ commit }, { packet, path }) {
    return new Promise((resolve, reject) => {
      // 记录消息记录
      commit('SAVE_MESSAGE', { packet, path })
    })
  },
  changeImOnline({ commit }, online) {
    return new Promise((resolve, reject) => {
      // 更新IM服务在线状态
      commit('CHANGE_IM_ONLINE', online)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
