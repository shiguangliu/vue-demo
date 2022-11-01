import axios from 'axios'
import Qs from 'qs'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/common/js/auth'
import globalFn from '@/common/js/utils'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 10000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 设置请求头
  if (store.getters.token) {
    // 让每个请求携带token(刷新token除外)
    if (!(config.data && config.data.refreshToken) && !(config.params && config.params.refreshToken)) {
      config.headers['Authorization'] = getToken()
    }
  }
  if (config.method.toLowerCase() === 'post') {
    if (config.data) {
      config.data = {
        ...config.data,
        _t: Date.parse(new Date()) / 1000
      }
    }
    if (config.params) {
      config.data = Qs.stringify({
        ...config.params,
        _t: Date.parse(new Date()) / 1000
      })
      config.params = undefined
    }
  } else if (config.method.toLowerCase() === 'get') {
    config.params = {
      _t: Date.parse(new Date()) / 1000,
      ...config.params
    }
  }

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    let tips = '员工账号信息错误'; let btMsg = '重新登录'
    if (res.code && res.code === 401) {
      // access_token 超时
      return doRefreshToken(response)
    } else if (res.code === 20101 || res.code === 20201) {
      switch (res.code) {
        case 20101:
          tips = '当前账号在其他地方登录, 如不是本人操作，请及时修改密码'
          btMsg = '确定'
          break
        case 20201:
          tips = '员工账号信息错误, 请重新登录'
          btMsg = '重新登录'
          break
      }
      MessageBox.alert(tips, {
        confirmButtonText: btMsg,
        type: 'info'
      }).then(() => {
        store.dispatch('staff/logout').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }).catch((error) => {
        // reject(error)
        console.log(error) // for debug
      })
      return Promise.reject('error')
    } else {
      const data = response.data
      return data
    }
  },
  error => {
    console.log(error) // for debug
    const message = error.message || (error.response ? globalFn.requestError(error.response.status) : '请求超时')
    Message({
      showClose: true,
      message: message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(message)
  }
)
// 刷新TOKEN，如refreshToken过期或失效，则退出登录
async function doRefreshToken(response) {
  const btMsg = '重新登录'
  const tipsExp = '登录授权信息已过期'
  await store.dispatch('staff/doRefreshToken').then(res => {
    // 重新刷新当前页面
    // 恢复请求数据JSON对象格式
    if (response.config.data) {
      response.config.data = JSON.parse(response.config.data)
    }
    return service.request(response.config)
  }).catch((err) => {
    console.log(err) // for debug
    MessageBox.alert(tipsExp, {
      confirmButtonText: btMsg,
      type: 'info'
    }).then(() => {
      store.dispatch('staff/logout').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }).catch((error) => {
      // reject(error)
      console.log(error) // for debug
    })
  })
}

// // 直接退出登录
// async function doClearLoginToken(response) {
//   const btMsg = '重新登录'
//   const tipsExp = '登录授权信息已过期'
//   MessageBox.alert(tipsExp, {
//     confirmButtonText: btMsg,
//     type: 'info'
//   }).then(() => {
//     store.dispatch('staff/logout').then(() => {
//       location.reload() // 为了重新实例化vue-router对象 避免bug
//     })
//   }).catch((error) => {
//     // reject(error)
//     console.log(error) // for debug
//   })
// }

export default service
