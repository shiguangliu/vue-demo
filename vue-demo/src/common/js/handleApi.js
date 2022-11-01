import { Message, MessageBox } from 'element-ui'
import globalFn from '@/common/js/utils'

export default (type, api, data) => {
  type = type || 'none' // 默认值
  switch (type) {
    case 'create':
    case 'update':
      return new Promise((resolve, reject) => {
        api(data).then(res => {
          if (!res) return
          if (res.message && res.message !== '') {
            Message({
              showClose: true,
              message: res.message,
              type: (res.code === '200' || res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          }
          resolve(res)
        }).catch(e => {
          const message = e.response ? globalFn.requestError(e.response.status) : '请求超时'
          Message({
            showClose: true,
            message: message,
            type: 'error',
            duration: 3 * 1000
          })
        })
      })
    case 'delete':
      return new Promise((resolve, reject) => {
        MessageBox.confirm('此操作将删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api(data).then(res => {
            if (res.message && res.message !== '') {
              Message({
                showClose: true,
                message: res.message,
                type: (res.code === '200' || res.code === 200) ? 'success' : 'error',
                duration: 3500
              })
            }
            resolve(res)
          }).catch(e => {
            const message = e.response ? globalFn.requestError(e.response.status) : '请求超时'
            Message({
              showClose: true,
              message: message,
              type: 'error',
              duration: 3 * 1000
            })
          })
        }).catch(e => {
          reject(e)
        })
      })
    case 'none': // No Message Alert
      return new Promise((resolve, reject) => {
        api(data).then(res => {
          if (!res) return
          resolve(res)
        }).catch(e => {
          const message = e.response ? globalFn.requestError(e.response.status) : '请求超时'
          Message({
            showClose: true,
            message: message,
            type: 'error',
            duration: 3 * 1000
          })
        })
      })
    default:
      console.log('warning: 未设置的API操作类型')
      return new Promise((resolve, reject) => {
        api(data).then(res => {
          if (!res) return
          if (res.message && res.message !== '') {
            Message({
              showClose: true,
              message: res.message,
              type: (res.code === '200' || res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          }
          resolve(res)
        }).catch(e => {
          const message = e.response ? globalFn.requestError(e.response.status) : '请求超时'
          Message({
            showClose: true,
            message: message,
            type: 'error',
            duration: 3 * 1000
          })
        })
      })
      // return new Promise((resolve, reject) => {
      //   reject('找不到的类型设置')
      // })
  }
}
