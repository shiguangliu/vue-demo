import { Message } from 'element-ui'
export default {
  /**
   * 通过key找到在列表中对应的显示
   *  @param {Object} obj
   *  @param obj.dataList 数据列表
   *  @param obj.value    数据的值对应的字段名称   例如 'value'
   *  @param obj.label    数据的说明对应的字段名称 例如 'label'
   *  @param obj.data     当前传入的数据值
   * @return name        返回当前传入值在数组中对应的名字
   */
  getDataName: (obj) => {
    let name = obj.data
    if (Array.isArray(obj.dataList) && obj.dataList.length > 0) {
      for (let i = 0; i < obj.dataList.length; i++) {
        if ((obj.dataList[i][obj.value] + '') === (obj.data + '')) {
          name = obj.dataList[i][obj.label]
        }
      }
    }
    return name
  },
  /**
   * 对请求失败的HTTP状态码做处理
   * @param {Number} code     HTTP状态码
   * @param {String} message  错误提示
   * @return message 返回处理过的提示信息
   */
  requestError: (code, message) => {
    const statusCode = (code + '').replace(/[^0-9]+/g, '') - 0

    switch (statusCode) {
      case 400:
        return 'Bad Request (错误的请求)'
      case 401:
        return 'Unauthorized (请求要求身份验证)'
      case 403:
        return 'Forbidden (服务器拒绝请求)'
      case 404:
        return 'NOT Found (服务器找不到请求的资源)'
      case 405:
        return 'Bad Request (禁用请求中指定的方法)'
      case 406:
        return 'Not Acceptable (无法使用请求的内容特性响应请求的网页)'
      case 407:
        return 'Proxy Authentication Required (需要代理授权)'
      case 408:
        return 'Request Timed-Out (服务器等候请求时发生超时)'
      case 409:
        return 'Conflict (服务器在完成请求时发生冲突。服务器必须在响应中包含有关冲突的信息)'
      case 410:
        return 'Gone (请求的资源已被永久删除)'
      case 411:
        return 'Length Required (服务器不接受不含有效内容长度标头字段的请求)'
      case 412:
        return 'Precondition Failed (未满足前提条件)'
      case 413:
        return 'Request Entity Too Large (请求实体过大)'
      case 414:
        return 'Request, URI Too Large (请求的 URI 过长)'
      case 415:
        return 'Unsupported Media Type (不支持的媒体类型)'
      case 429:
        return '您的操作过于频繁,请稍后重试'
      case 500:
        return 'Internal Server Error (服务器内部错误)'
      case 501:
        return 'Not Implemented (尚未实施)'
      case 502:
        return 'Bad Gateway (错误网关)'
      case 503:
        return 'Server Unavailable (服务不可用)'
      case 504:
        return 'Gateway Timed-Out (网关超时)'
      case 505:
        return 'HTTP Version not supported (HTTP 版本不受支持)'
      default:
        return message
    }
  },
  /**
   * 传入时间戳，转换指定的时间格式
   * @param {Number} val      时间戳
   * @param {String} dateType 要得到的时间格式 例如 YYYY-MM-DD hh:mm:ss
   * @return dataStr 例如 YYYY-MM-DD hh:mm:ss
   */
  switchTime: (val = +new Date(), dateType = 'YYYY-MM-DD hh:mm:ss') => {
    // 将字符串转换成数字
    const timeStamp = +new Date(val)

    // 如果转换成数字出错
    if (!timeStamp) {
      return val
    }
    let str
    // 得到时间字符串
    const dateStr = new Date(timeStamp)
    str = dateType.replace('YYYY', dateStr.getFullYear())
    str = str.replace('MM', (dateStr.getMonth() + 1 < 10 ? '0' : '') + (dateStr.getMonth() + 1))
    str = str.replace('DD', (dateStr.getDate() < 10 ? '0' : '') + dateStr.getDate())
    str = str.replace('hh', (dateStr.getHours() < 10 ? '0' : '') + dateStr.getHours())
    str = str.replace('mm', (dateStr.getMinutes() < 10 ? '0' : '') + dateStr.getMinutes())
    str = str.replace('ss', (dateStr.getSeconds() < 10 ? '0' : '') + dateStr.getSeconds())

    return str
  },
  /**
   * 时间显示
   */
  timeView: function(val) {
    const now = +new Date() // 当时时间
    const timeStamp = +new Date(val) // 需要处理的时间
    const result = now - timeStamp // 相差的时间戳
    const min = 60 * 1000 // 分钟的毫秒数
    const hour = 60 * 60 * 1000 // 小时的毫秒数
    const day = 60 * 60 * 1000 * 24 // 日的毫秒数
    if (result / min < 1) {
      return '刚刚发布'
    } else if (result / min < 60) {
      return Math.floor(result / min) + '分钟前'
    } else if (result / hour > 1 && result / hour < 24) {
      return Math.floor(result / hour) + '小时前'
    } else if (result / day > 1 && result / day < 7) {
      return Math.floor(result / day) + '天前'
    } else if (this.switchTime(now, 'YYYY') === this.switchTime(timeStamp, 'YYYY')) {
      return this.switchTime(timeStamp, 'MM月DD日')
    } else {
      return this.switchTime(timeStamp, 'YYYY年MM月DD日')
    }
  },
  /**
   * a模拟window.open，不会被浏览器拦截
   * @param {String} url        a标签打开的地址
   * @param {String} id         a标签的ID
   * @param {String} targetType a标签点击打开的方式（当前页面打开还是新窗口打开）
   */
  openWindow: (url, targetType = '_blank', id = 'open', download = false) => {
    // 如果存在则删除
    if (document.getElementById(id)) {
      document.body.removeChild(document.getElementById(id))
    }
    const a = document.createElement('a')
    a.setAttribute('href', url)
    if (download) {
      a.setAttribute('download', url)
    }
    a.setAttribute('target', targetType)
    a.setAttribute('id', id)
    document.body.appendChild(a)
    a.click()
  },
  /**
   * 复制
   * @param {String} value 要复制的值
   */
  copyData(value) {
    const inputDom = document.createElement('input')
    inputDom.value = value
    document.body.appendChild(inputDom)
    inputDom.select() // 选择对象
    document.execCommand('Copy') // 执行浏览器复制命令
    document.body.removeChild(inputDom) // 删除DOM
    Message({
      type: 'success',
      message: '复制成功'
    })
  },
  /**
   * 将树结构转换为一级列表
   * @param {Array} treeData
   *@return {Array} arr
   */
  treeToList(treeData, arr = []) {
    for (let i = 0; i < treeData.length; i++) {
      const item = treeData[i]
      arr.push(item)
      if (item.children && item.children.length !== 0) {
        this.treeToList(item.children, arr)
      }
    }
    return arr
  },
  /**
   * 将一级的数据结构处理成树状数据结构
   * @param {Object} obj {key, pKey, data}
   *  @param obj.key  字段名称 比如id
   *  @param obj.pKey 父字段名称 比如 pid
   *  @param obj.rootPValue 根节点的父字段的值
   *  @param obj.data 需要处理的数据
   *  @param obj.jsonData 是否深复制数据（默认是true）
   * @return {Array} arr
   */
  getTreeArr: (obj) => {
    if (!Array.isArray(obj.data)) {
      console.log('getTreeArr=>请传入数组')
      return []
    }
    obj.jsonData = obj.jsonData === false ? obj.jsonData : true
    const arr = obj.jsonData ? JSON.parse(JSON.stringify(obj.data)) : obj.data
    const arr1 = []
    // 将数据处理成数状结构
    arr.forEach(item => {
      let index = 0
      item.children = []
      arr.forEach(item1 => {
        // 得到树结构关系
        if (item[obj.key] === item1[obj.pKey]) {
          item.children.push(item1)
        }
        // 判断根节点
        if (item1[obj.key] !== item[obj.pKey]) {
          index++
        }
      })
      // 没传入根节点，根据当前数据结构得到根节点
      if (!('rootPValue' in obj) && index === arr.length) {
        arr1.push(item)
      }
    })
    // 传入根节点，根据传入的根节点组成树结构
    if ('rootPValue' in obj) {
      arr.forEach(item => {
        if (item[obj.pKey] === obj.rootPValue) {
          arr1.push(item)
        }
      })
    }
    return arr1
  },
  /**
   * 数组去重
   * @param {Array} data 要去重的数组
   * @param {String} key 作为去重依据的字段 (处理对象数组时需要传入)
   * @return arr 返回处理后的数据
   */
  handleRepeatArr({ data, key }) {
    if (!Array.isArray(data)) {
      console.log('请传入数组')
      return
    }
    /** 1.递归去重，缺点，会将数据默认排序 */
    // // 先对数据做排序处理
    // data = data.sort((item, item1) => {
    //   if (key) {
    //     return item[key] - item1[key]
    //   }
    //   return item - item1
    // })
    // // 递归去重
    // function getData (index) {
    //   if (index >= 1) {
    //     // 判断当前数据和下一条数据是否相等
    //     let result = key ? data[index][key] === data[index - 1][key] : data[index] === data[index - 1]
    //     if (result) {
    //       data.splice(index, 1)
    //     }
    //     getData(index - 1)
    //   }
    // }
    // getData(data.length - 1)
    // return data

    /** 2.根据对象的属性不同去重 */
    const arr = []; const obj = {}
    data.forEach((item, index) => {
      const attr = key ? item[key] : item
      if (!obj[attr]) {
        obj[attr] = index + 1
        arr.push(item)
      }
    })
    return arr

    /** 3.利用indexOf以及forEach (适合处理数组，不适合处理对象数组) */
    // let arr = []
    // data.forEach((item, index) => {
    //   // 如果当前元素在之后没有出现过(后面出现的数据会保留)
    //   // let result = data.indexOf(item, index + 1)
    //   // 如果当前元素在之前没有出现过(前面出现的数据会保留)
    //   let result = index === 0 ? -1 : data.lastIndexOf(item, index - 1)
    //   if (result === -1) {
    //     arr.push(item)
    //   }
    // })
    // return arr

    /** 4.new Set (适合处理数组，不适合处理对象数组) */
    // return [...new Set(data)]

    /** 5. 双层循环去重 （占用内存高） */
    // for (let i = 0, len = data.length; i < len; i++) {
    //   for (let j = i + 1; j < len; j++) {
    //     let result = key ? data[i][key] === data[j][key] : data[i] === data[j]
    //     if (result) {
    //       data.splice(j, 1)
    //       len--
    //       j--
    //     }
    //   }
    // }
    // return data
  },
  /**
   * 搜索框字符串，将问号后面字符得到并转换为对象
   * @return {Object}
   */
  getLocationSearch() {
    const str = window.location.search
    const arr = str.substr(1).split('&')
    const obj = {}
    for (const item of arr) {
      const data = item.split('=')
      obj[data[0]] = data[1]
    }
    return obj
  },
  /**
   * 判断字节序：true则是小端、false则是大端
   */
  littleEndian() {
    const buffer = new ArrayBuffer(2)
    new DataView(buffer).setInt16(0, 256, true)
    return new Int16Array(buffer)[0] === 256
  },
  /**
   * bytes大小转MB/GB描述
   * @param bytes
   * @returns {string|string|string}
   */
  bytesToSize(bytes) {
    if (bytes === 0) return '0 B'
    var k = 1024 // or 1024
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    var i = Math.floor(Math.log(bytes) / Math.log(k))
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
  },
  /**
   * 字符串转byte数组
   * @param str
   * @returns {Array}
   */
  stringToBytes(str) {
    var bytes = []
    var c = ''
    const len = str.length
    for (let i = 0; i < len; i++) {
      c = str.charCodeAt(i)
      if (c >= 0x010000 && c <= 0x10FFFF) {
        bytes.push(((c >> 18) & 0x07) | 0xF0)
        bytes.push(((c >> 12) & 0x3F) | 0x80)
        bytes.push(((c >> 6) & 0x3F) | 0x80)
        bytes.push((c & 0x3F) | 0x80)
      } else if (c >= 0x000800 && c <= 0x00FFFF) {
        bytes.push(((c >> 12) & 0x0F) | 0xE0)
        bytes.push(((c >> 6) & 0x3F) | 0x80)
        bytes.push((c & 0x3F) | 0x80)
      } else if (c >= 0x000080 && c <= 0x0007FF) {
        bytes.push(((c >> 6) & 0x1F) | 0xC0)
        bytes.push((c & 0x3F) | 0x80)
      } else {
        bytes.push(c & 0xFF)
      }
    }
    return bytes
  },
  /**
   * byte数组转字符串
   * @param bytes
   * @returns {string|string|string}
   */
  bytesToString(bytes) {
    if (typeof bytes === 'string') {
      return bytes
    }
    var str = ''
    const _arr = bytes
    for (let i = 0; i < _arr.length; i++) {
      const one = _arr[i].toString(2)
      const v = one.match(/^1+?(?=0)/)
      if (v && one.length === 8) {
        const bytesLength = v[0].length
        var store = _arr[i].toString(2).slice(7 - bytesLength)
        for (let st = 1; st < bytesLength; st++) {
          store += _arr[st + i].toString(2).slice(2)
        }
        str += String.fromCharCode(parseInt(store, 2))
        i += bytesLength - 1
      } else {
        str += String.fromCharCode(_arr[i])
      }
    }
    return str
  },
  /**
   * 编码
   * 报文格式：magic4字节 + 版本1字节 + 序列化算法1字节 + 指令1字节 + 数据长度4字节 + 数据内容
   * 总长度 = 11 + 数据内容
   * @param packet 数据包
   * @returns {ArrayBuffer}
   */
  encode(packet) {
    const bytes = this.stringToBytes(JSON.stringify(packet))
    const buffer = new ArrayBuffer(11 + bytes.length)
    if (buffer.byteLength !== 11 + bytes.length) {
      console.log('编码分配内存失败，内存不足')
      return null
    }
    const dataView = new DataView(buffer)

    dataView.setInt32(0, 0x12345678)
    dataView.setInt8(4, packet.version)
    dataView.setInt8(5, 1) // 写死1表示json序列化
    dataView.setInt8(6, packet.command)
    dataView.setInt32(7, bytes.length)
    for (let i = 11; i < bytes.length + 11; i++) {
      dataView.setUint8(i, bytes[i - 11])
    }
    return dataView.buffer
  },
  /**
   * 解码
   * 报文格式：magic4字节 + 版本1字节 + 序列化算法1字节 + 指令1字节 + 数据长度4字节 + 数据内容
   * 总长度 = 11 + 数据内容
   * @param buffer {ArrayBuffer}
   * @returns {JSON}
   */
  decode(buffer) {
    const dataView = new DataView(buffer)
    const lenght = dataView.getInt32(7)
    const bytes = []
    for (let i = 11; i < lenght + 11; i++) {
      bytes[i - 11] = dataView.getUint8(i)
    }
    const json = this.bytesToString(bytes)
    return JSON.parse(json)
  },
  /**
 * 替换表情文字
 * @param {String} content  需要替换的字符串
 */
  replaceEmoji(content) {
    const emojis = {
      '[微笑]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/0.gif'>",
      '[撇嘴]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/1.gif'>",
      '[色]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/2.gif'>",
      '[发呆]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/3.gif'>",
      '[得意]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/4.gif'>",
      '[流泪]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/5.gif'>",
      '[害羞]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/6.gif'>",
      '[闭嘴]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/7.gif'>",
      '[睡]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/8.gif'>",
      '[大哭]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/9.gif'>",
      '[尴尬]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/10.gif'>",
      '[发怒]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/11.gif'>",
      '[调皮]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/12.gif'>",
      '[呲牙]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/13.gif'>",
      '[惊讶]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/14.gif'>",
      '[难过]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/15.gif'>",
      '[酷]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/16.gif'>",
      '[冷汗]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/17.gif'>",
      '[抓狂]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/18.gif'>",
      '[吐]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/19.gif'>",
      '[偷笑]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/20.gif'>",
      '[可爱]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/21.gif'>",
      '[白眼]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/22.gif'>",
      '[傲慢]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/23.gif'>",
      '[饥饿]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/24.gif'>",
      '[困]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/25.gif'>",
      '[惊恐]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/26.gif'>",
      '[流汗]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/27.gif'>",
      '[憨笑]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/28.gif'>",
      '[大兵]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/29.gif'>",
      '[奋斗]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/30.gif'>",
      '[咒骂]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/31.gif'>",
      '[疑问]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/32.gif'>",
      '[嘘]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/33.gif'>",
      '[晕]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/34.gif'>",
      '[折磨]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/35.gif'>",
      '[衰]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/36.gif'>",
      '[骷髅]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/37.gif'>",
      '[敲打]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/38.gif'>",
      '[再见]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/39.gif'>",
      '[擦汗]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/40.gif'>",
      '[抠鼻]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/41.gif'>",
      '[鼓掌]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/42.gif'>",
      '[糗大了]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/43.gif'>",
      '[坏笑]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/44.gif'>",
      '[左哼哼]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/45.gif'>",
      '[右哼哼]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/46.gif'>",
      '[哈欠]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/47.gif'>",
      '[鄙视]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/48.gif'>",
      '[委屈]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/49.gif'>",
      '[快哭了]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/50.gif'>",
      '[阴险]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/51.gif'>",
      '[亲亲]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/52.gif'>",
      '[吓]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/53.gif'>",
      '[可怜]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/54.gif'>",
      '[菜刀]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/55.gif'>",
      '[西瓜]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/56.gif'>",
      '[啤酒]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/57.gif'>",
      '[篮球]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/58.gif'>",
      '[乒乓]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/59.gif'>",
      '[咖啡]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/60.gif'>",
      '[饭]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/61.gif'>",
      '[猪头]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/62.gif'>",
      '[玫瑰]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/63.gif'>",
      '[凋谢]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/64.gif'>",
      '[示爱]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/65.gif'>",
      '[爱心]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/66.gif'>",
      '[心碎]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/67.gif'>",
      '[蛋糕]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/68.gif'>",
      '[闪电]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/69.gif'>",
      '[炸弹]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/70.gif'>",
      '[刀]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/71.gif'>",
      '[足球]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/72.gif'>",
      '[瓢虫]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/73.gif'>",
      '[便便]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/74.gif'>",
      '[月亮]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/75.gif'>",
      '[太阳]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/76.gif'>",
      '[礼物]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/77.gif'>",
      '[拥抱]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/78.gif'>",
      '[强]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/79.gif'>",
      '[弱]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/80.gif'>",
      '[握手]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/81.gif'>",
      '[胜利]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/82.gif'>",
      '[抱拳]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/83.gif'>",
      '[勾引]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/84.gif'>",
      '[拳头]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/85.gif'>",
      '[差劲]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/86.gif'>",
      '[爱你]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/87.gif'>",
      '[NO]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/88.gif'>",
      '[OK]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/89.gif'>",
      '[爱情]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/90.gif'>",
      '[飞吻]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/91.gif'>",
      '[跳跳]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/92.gif'>",
      '[发抖]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/93.gif'>",
      '[怄火]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/94.gif'>",
      '[转圈]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/95.gif'>",
      '[磕头]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/96.gif'>",
      '[回头]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/97.gif'>",
      '[跳绳]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/98.gif'>",
      '[挥手]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/99.gif'>",
      '[激动]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/100.gif'>",
      '[街舞]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/101.gif'>",
      '[献吻]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/102.gif'>",
      '[左太极]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/103.gif'>",
      '[右太极]': "<img src='https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/104.gif'>"
    }
    return content.replace(
      /(\[\微\笑\]|\[\撇\嘴\]|\[\色\]|\[\发\呆\]|\[\得\意\]|\[\流\泪\]|\[\害\羞\]|\[\闭\嘴\]|\[\睡\]|\[\大\哭\]|\[\尴\尬\]|\[\发\怒\]|\[\调\皮\]|\[\呲\牙\]|\[\惊\讶\]|\[\难\过\]|\[\酷\]|\[\冷\汗\]|\[\抓\狂\]|\[\吐\]|\[\偷\笑\]|\[\可\爱\]|\[\白\眼\]|\[\傲\慢\]|\[\饥\饿\]|\[\困\]|\[\惊\恐\]|\[\流\汗\]|\[\憨\笑\]|\[\大\兵\]|\[\奋\斗\]|\[\咒\骂\]|\[\疑\问\]|\[\嘘\]|\[\晕\]|\[\折\磨\]|\[\衰\]|\[\骷\髅\]|\[\敲\打\]|\[\再\见\]|\[\擦\汗\]|\[\抠\鼻\]|\[\鼓\掌\]|\[\糗\大\了\]|\[\坏\笑\]|\[\左\哼\哼\]|\[\右\哼\哼\]|\[\哈\欠\]|\[\鄙\视\]|\[\委\屈\]|\[\快\哭\了\]|\[\阴\险\]|\[\亲\亲\]|\[\吓\]|\[\可\怜\]|\[\菜\刀\]|\[\西\瓜\]|\[\啤\酒\]|\[\篮\球\]|\[\乒\乓\]|\[\咖\啡\]|\[\饭\]|\[\猪\头\]|\[\玫\瑰\]|\[\凋\谢\]|\[\示\爱\]|\[\爱\心\]|\[\心\碎\]|\[\蛋\糕\]|\[\闪\电\]|\[\炸\弹\]|\[\刀\]|\[\足\球\]|\[\瓢\虫\]|\[\便\便\]|\[\月\亮\]|\[\太\阳\]|\[\礼\物\]|\[\拥\抱\]|\[\强\]|\[\弱\]|\[\握\手\]|\[\胜\利\]|\[\抱\拳\]|\[\勾\引\]|\[\拳\头\]|\[\差\劲\]|\[\爱\你\]|\[\N\O\]|\[\O\K\]|\[\爱\情\]|\[\飞\吻\]|\[\跳\跳\]|\[\发\抖\]|\[\怄\火\]|\[\转\圈\]|\[\磕\头\]|\[\回\头\]|\[\跳\绳\]|\[\挥\手\]|\[\激\动\]|\[\街\舞\]|\[\献\吻\]|\[\左\太\极\]|\[\右\太\极\])/gi,
      ($0, $1) => {
        return emojis[$1]
      })
  }
}
