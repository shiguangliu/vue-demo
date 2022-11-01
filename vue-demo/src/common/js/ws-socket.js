import { Message } from 'element-ui'
import { getToken, getStaffId } from '@/common/js/auth'
import store from '@/store'
import globalFn from '@/common/js/utils'

class WsSocket {
  socket
  // 构造方法
  constructor() {
    if (!window.WebSocket) {
      Message({
        showClose: true,
        message: '您的浏览器不支持 WebSocket!',
        type: 'error',
        duration: 3500
      })
    }
  }

  // 打开WebSocket连接
  open(ImServerUrl) {
    const self = this
    try {
      // 当websocket状态已经打开，则直接返回
      if (this.socket !== undefined && this.socket.readyState === WebSocket.OPEN) {
        Message({
          showClose: true,
          message: 'IM服务器已连接成功: ' + ImServerUrl,
          type: 'info',
          duration: 3500
        })
        return
      }
      this.socket = new WebSocket(ImServerUrl)
      // 指定接收二进制数据类型
      this.socket.binaryType = 'arraybuffer'
    } catch (error) {
      Message({
        showClose: true,
        message: 'IM服务器连接失败' + error,
        type: 'error',
        duration: 3500
      })
    }
    // 连接建立
    this.socket.onopen = function(event) {
      Message({
        showClose: true,
        message: 'IM服务器连接成功: ' + event.target.url,
        type: 'info',
        duration: 3500
      })
      heartCheck.start(self)
      // 自动鉴权认证
      self.autoLogin()
      // 变更IM在线状态为：1-在线
      store.dispatch('ws/changeImOnline', 1)
        .catch((error) => {
          Message({
            showClose: true,
            message: error,
            type: 'error',
            duration: 3500
          })
        })
    }
    // 连接关闭
    this.socket.onclose = function(event) {
      console.log('websocket 断开: ' + event.code + ' ' + event.reason + ' ' + event.wasClean)
      Message({
        showClose: true,
        message: 'IM服务器连接已关闭' + event,
        type: 'error',
        duration: 3500
      })
      heartCheck.stop()
      // 变更IM在线状态为：0-不在线
      store.dispatch('ws/changeImOnline', 0)
        .catch((error) => {
          Message({
            showClose: true,
            message: error,
            type: 'error',
            duration: 3500
          })
        })
    }
    // 连接发生错误
    this.socket.onerror = function(event) {
      Message({
        showClose: true,
        message: '连接错误' + event,
        type: 'error',
        duration: 3500
      })
    }
  }

  // 接收到消息
  onmessage(callback) {
    const self = this
    this.socket.onmessage = function(event) {
      try {
        heartCheck.reset(self)
        // 解码
        const packet = globalFn.decode(event.data)
        // 派发接收数据事件
        callback(packet)
      } catch (error) {
        Message({
          showClose: true,
          message: '数据解析失败:' + error,
          type: 'error',
          duration: 3500
        })
      }
    }
  }
  // 发送数据包
  send(packet) {
    try {
      // 判断websocket状态是否打开
      const ws = this.socket
      if (ws !== undefined && ws.readyState === WebSocket.OPEN) {
        ws.send(globalFn.encode(packet))
      } else {
        Message({
          showClose: true,
          message: 'IM服务器连接已关闭',
          type: 'error',
          duration: 3500
        })
      }
    } catch (error) {
      Message({
        showClose: true,
        message: '数据解析失败:' + error,
        type: 'error',
        duration: 3500
      })
    }
  }
  // 自动登录
  autoLogin() {
    // 登录请求包
    const packet = {
      userId: getStaffId(),
      token: getToken(),
      version: 1,
      command: 1
    }
    this.send(packet)
  }
}
// 心跳包发送
const heartCheck = {
  timeout: 10000, // 10s
  timeoutHandler: null,
  reset: function(ws) {
    clearTimeout(this.timeoutHandler)
    this.start(ws)
  },
  stop: function() {
    clearTimeout(this.timeoutHandler)
  },
  start: function(ws) {
    this.timeoutHandler = setTimeout(function() {
      // 心跳包
      const heart = {
        version: 1,
        command: 3
      }
      ws.send(heart)
    }, this.timeout)
  }
}

export default new WsSocket()
