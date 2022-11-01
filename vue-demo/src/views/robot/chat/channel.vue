<template>
  <div class="app-container">
    <el-container style="height: 100%">
      <!-- 左侧侧边栏 -->
      <el-aside width="350px" class="aside-box">
        <el-container class="hv100" direction="vertical" style="height:100%;">
          <b><span :style="'' + (wsImOnline === 1 ? 'color: #13C0C5':'') +''"><i class="fa fa-wifi" aria-hidden="true" /></span>频道列表</b>
          <hr style="margin: 5px 0px">
          <div class="channel" :class="{ 'active-border': curIndex === 1 }" @click="changeChannel(1)">
            <span style="color: #13C0C5"><i class="fa fa-globe" aria-hidden="true" /></span>
            <span>世界频道</span>
          </div>
          <div class="channel" :class="{ 'active-border': curIndex === 0 }" @click="changeChannel(0)">
            <span style="color: #13C0C5"><i class="fa fa-street-view" aria-hidden="true" /></span>
            <span>附近频道</span>
          </div>
          <div class="channel" :class="{ 'active-border': curIndex === 2 }" @click="selectCity()">
            <span style="color: #13C0C5"><i class="fa fa-building-o" aria-hidden="true" /></span>
            <span>城市频道</span>
            <el-cascader v-model="value" style="padding-left: 40px" :options="options" :show-all-levels="true" @change="selectCity()" />
          </div>
        </el-container>
      </el-aside>

      <!-- 聊天面板容器 -->
      <el-main class="panel-box">
        <template v-if="curIndex === -1 || curRobot === null">
          <div class="friendly-tips animated flipInY">
            <p>
              不是井里没有水，而是你挖的不够深<br>
              不是成功来得慢，而是你努力的不够多<br>
              加油吧！ ......
            </p>
          </div>
        </template>
        <template v-if="curIndex !== -1 && curRobot !== null">
          <el-scrollbar
            ref="msgScrollBar"
            :native="false"
            tag="section"
            class="hv70"
          >
            <div v-for="(msg, index) in curMsgList" :key="msg.messageId + index +'A'">
              <div v-if="Math.floor((new Date(msg.messageTime).getTime()-new Date(curMsgList[((index-1)<0?0:index-1)].messageTime).getTime())/(60*1000))>10" class="content-middle">
                <span>{{ $fn.timeView(msg.messageTime) }}</span>
              </div>
              <div v-if="msg.idx === -10" class="content-left">
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    ID: {{ msg.fromUserId }}
                    <span v-if="msg.gender === 1"><i class="fa fa-mars" style="color: blue" aria-hidden="false" /></span>
                    <span v-if="msg.gender === 2"><i class="fa fa-venus" style="color: red" aria-hidden="false" /></span>
                    <br>
                    昵称: {{ msg.nickName }}
                  </div>
                  <div class="content-left-avatar">
                    <img
                      width="36"
                      height="36"
                      :src="$TH.FILE_URLS.static_url + msg.avatarUrl"
                      :onerror="defaultAvatar"
                    >
                  </div>
                </el-tooltip>
                <div class="content-message-left">
                  <pre
                    v-if="msg.messageType === 1"
                    :id="msg.messageId"
                    class="pre-content"
                    v-html="msg.content"
                  />
                  <div v-if="msg.messageType === 2">
                    <el-image
                      v-imgAlart
                      width="40px"
                      height="40px"
                      fit="contain"
                      :src="$TH.FILE_URLS.static_url + msg.mediaUrl"
                      :onerror="nopicture"
                    />
                  </div>
                  <div v-if="msg.messageType === 3 || msg.messageType === 4">
                    <video :src="$TH.FILE_URLS.static_url + msg.mediaUrl" controls="controls">
                      Your browser does not support the audio element.
                    </video>
                  </div>
                </div>
              </div>
              <div v-if="msg.idx === curIndex" class="content-right">
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    ID: {{ msg.fromUserId }}
                    <span v-if="msg.gender === 1"><i class="fa fa-mars" style="color: blue" aria-hidden="false" /></span>
                    <span v-if="msg.gender === 2"><i class="fa fa-venus" style="color: red" aria-hidden="false" /></span>
                    <br>
                    昵称: {{ msg.nickName }}
                  </div>
                  <div class="content-right-avatar">
                    <img
                      width="36"
                      height="36"
                      :src="$TH.FILE_URLS.static_url + msg.robotAvatarUrl"
                      :onerror="defaultAvatar"
                    >
                  </div>
                </el-tooltip>
                <div class="content-message-right">
                  <pre
                    v-if="msg.messageType === 1"
                    :id="msg.messageId"
                    class="pre-content"
                    v-html="msg.content"
                  />
                  <div v-if="msg.messageType === 2">
                    <el-image
                      v-imgAlart
                      width="40px"
                      height="40px"
                      fit="contain"
                      :src="$TH.FILE_URLS.static_url + msg.mediaUrl"
                      :onerror="nopicture"
                    />
                  </div>
                  <div v-if="msg.messageType === 3 || msg.messageType === 4">
                    <video :src="$TH.FILE_URLS.static_url + msg.mediaUrl" controls="controls">
                      Your browser does not support the audio element.
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <div class="send-box">
            <div class="send-type">
              <span class="image" @click="openPicDialog()"><i class="fa fa-picture-o" aria-hidden="true" /></span>
              <span class="emoji"><i v-popover:popoverEmoticon class="fa fa-smile-o" aria-hidden="true" /></span>
            </div>
            <textarea ref="textarea" v-model="sendingContent" class="text-area" />
            <div class="send">
              <span @click="sendTextMessage">发送</span>
            </div>
          </div>
          <el-popover ref="popoverEmoticon" placement="top-start" width="500" trigger="click" popper-class="padding0">
            <me-editor-emoticon ref="editorEmoticon" @selected="selecteEmoticon" />
          </el-popover>
        </template>
      </el-main>
      <el-aside style="align: right; width: 500px" class="aside-box-right">
        <div style="margin: 10px">
          <div slot="header" class="clearfix">
            <b>切换马甲</b>
            <div class="robot-refresh" type="text" @click="refreshRobot()">随机切换<i class="el-icon-refresh-right el-icon--right" /></div>
          </div>
          <hr style="margin: 5px 0px">
          <el-scrollbar
            ref="robotScrollBar"
            :native="false"
            tag="section"
            class="hv100"
          >
            <el-row :gutter="20">
              <el-col v-for="(robot,index) in robotList" :key="robot.index_name + index +'B'" :xs="12" :sm="12" :lg="6">
                <el-card :body-style="{ padding: '0px'}">
                  <div class="el-card__body" :class="{ 'active-border': index === curRobotIndex }" @click="selectRobot(index)">
                    <img :src="$TH.FILE_URLS.static_url + robot.avatarUrl" style="width: 100%;display: block;">
                    <div style="text-align:center;">
                      <div>
                        <span v-if="robot.gender === 1"><i class="fa fa-mars" style="color: blue" aria-hidden="false" /></span>
                        <span v-if="robot.gender === 2"><i class="fa fa-venus" style="color: red" aria-hidden="false" /></span>
                      </div>
                      <el-tooltip effect="light" :content="robot.nickName">
                        <div class="nick-name">{{ robot.nickName }}</div>
                      </el-tooltip>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-scrollbar>
        </div>
      </el-aside>
    </el-container>
    <page-dialog
      :visible.sync="dialogUpload.visible"
      :title="dialogUpload.title"
      :width="dialogUpload.width"
      :bt-loading="dialogUpload.btLoading"
      :bt-list="dialogUpload.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 图片上传组件 -->
      <Upload
        v-if="dialogUpload.visible"
        :upload-data="{targetPath: 'chat-pic',autoname: '1'}"
        @handleEvent="handleEvent"
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@/common/js/utils'
import { getAreaList } from '@/api/sysarea'
import { sendBroadcastMessages, changeChannel, refreshRobot } from '@/api/robot/chat'
import { getLocalStorage } from '@/common/js/storage'
import MeEditorEmoticon from './components/MeEditorEmoticon'
import PageDialog from '@/components/PageDialog'
import Upload from '@/components/Upload'
import v_head from '@/assets/img/v_head.png'
import defaultImage from '@/assets/img/no-pic.jpg'
export default {
  components: {
    MeEditorEmoticon,
    PageDialog,
    Upload
  },
  data() {
    return {
      timeoutObj: null,
      timeout: 10000,
      curIndex: -1,
      curRobotIndex: -1,
      sendingContent: '',
      allMsgList: [
        // {
        //   cityId: 0,
        //   msgs:[]
        // }
      ],
      curRobot: null,
      curMsgList: null,
      options: [],
      value: [31, 3101], // 默认上海
      robotList: [],
      robotIds: [],
      dialogUpload: {
        title: '发送聊天图片',
        visible: false,
        btLoading: false,
        btList: [
          { label: '关闭', type: 'primary', icon: 'el-icon-close', event: 'closeUpload', show: true }
        ],
        width: '400'
      },
      sendingPicUrl: ''
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits',
      'wsImOnline' // IM服务是否在线：1-在线 0-不在线
    ]),
    // 默认头像
    defaultAvatar() {
      return 'this.src="' + this.$TH.FILE_URLS.publicPath + v_head + '";this.onerror = null;'
    },
    // 图片加载失败
    nopicture() {
      return 'this.src="' + this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
    }
  },
  created() {
    this.refreshRobot()
    this.getCityOptions()
  },
  mounted() {
    // 连接IM服务器，并自动登录，启动心跳包
    this.$store.dispatch('ws/initConnect', this.onMessage)
      .catch((error) => {
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          duration: 3500
        })
      })
  },
  methods: {
    selectRobot(idx) {
      this.curRobotIndex = idx
      this.curRobot = this.robotList[idx]
    },
    refreshRobot() {
      const self = this
      this.$handleAPI('', refreshRobot, { staffId: this.$store.state.staff.staffId }).then(res => {
        if (Number(res.code) === 200) {
          self.robotList = res.data
          self.robotList.forEach(el => {
            this.robotIds.push(el.id)
          })
          self.selectRobot(0)
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
        }
      })
    },
    getCityOptions() {
      const self = this
      const params = { level: 1 }
      this.$handleAPI('', getAreaList, params).then(res => {
        if (Number(res.code) === 200) {
          self.getCitys(res.data)
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
        }
      })
    },
    getCitys(data) {
      const self = this
      var count = 0
      data.forEach(el => {
        const params = { parentId: el.areaId, level: 2 }
        this.$handleAPI('', getAreaList, params).then(res => {
          if (Number(res.code) === 200) {
            count++
            var arr = []
            res.data.forEach(it => {
              const ch = {
                value: it.areaId,
                label: it.areaName
              }
              arr.push(ch)
            })
            const pa = {
              value: el.areaId,
              label: el.areaName,
              children: arr
            }
            self.options.push(pa)
            if (count === data.length) {
              self.initAllMsgList() // 获得所有城市信息之后, 初始化会话列表
            }
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'error',
              duration: 3500
            })
          }
        })
      })
    },
    initAllMsgList() {
      const key = 'HISTORYCHAT(' + this.$route.path + ')'
      const historyChat = getLocalStorage(key, 'JSON')
      if (historyChat !== undefined && historyChat !== null) {
        var arr0 = []
        historyChat['ct0'] = historyChat['ct0'] || []
        historyChat['ct0'].forEach(el => {
          arr0.push(el.msg)
        })
        var pa0 = {
          msgs: arr0
        }
        this.allMsgList.push(pa0)
        var arr1 = []
        historyChat['ct1'] = historyChat['ct1'] || []
        historyChat['ct1'].forEach(el => {
          arr1.push(el.msg)
        })
        var pa1 = {
          msgs: arr1
        }
        this.allMsgList.push(pa1)
        this.options.forEach(item => {
          item.children.forEach(ch => {
            if (historyChat['ct' + ch.value] !== null && historyChat['ct' + ch.value] !== undefined) {
              var arr = []
              historyChat['ct' + ch.value].forEach(el => {
                arr.push(el.msg)
              })
              var pa = {
                cityId: ch.value,
                msgs: arr
              }
              this.allMsgList.push(pa)
            }
          })
        })
      } else {
        if (this.allMsgList.length < 1) {
          for (var v = 0; v < 2; v++) { // 世界频道，和附近频道会话记录
            var pa = {
              msgs: []
            }
            this.allMsgList.push(pa)
          }
          var pa2 = {
            cityId: this.value[1], // 默认城市频道是北京
            msgs: []
          }
          this.allMsgList.push(pa2)
        }
      }
      this.changeChannel(1)
    },
    selectCity() { // 选择城市，并切换城市频道
      const self = this
      self.curIndex = 2 // 2-城市频道
      const params = { userId: this.$store.state.staff.staffId, channelType: self.value[1] }
      this.$handleAPI('', changeChannel, params).then(res => {
        if (Number(res.code) === 200) {
          var flag = true
          self.allMsgList.forEach(el => {
            if (Number(el.cityId) === Number(self.value[1])) {
              self.curMsgList = el.msgs || []
              flag = false
            }
          })
          if (flag) {
            var pa = {
              cityId: self.value[1],
              msgs: []
            }
            self.allMsgList.push(pa)
            self.curMsgList = pa.msgs
          }
          self.scrollToBottom()
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
        }
      })
    },
    changeChannel(val) { // 选择世界频道，附近频道，使用默认的城市频道或者已经上次选择的的城市频道
      const self = this
      val = Number(val)
      self.curIndex = val
      const params = { userId: this.$store.state.staff.staffId, channelType: (val === 2) ? self.value[1] : val }
      this.$handleAPI('', changeChannel, params).then(res => {
        if (Number(res.code) === 200) {
          if (val === 2) {
            self.allMsgList.forEach(el => {
              if (Number(el.cityId) === Number(self.value[1])) {
                self.curMsgList = el.msgs || []
              }
            })
          } else {
            self.curMsgList = self.allMsgList[self.curIndex].msgs || []
          }
          self.scrollToBottom()
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
        }
      })
    },
    send(packet) {
      // 发送消息
      this.$store.dispatch('ws/send', packet)
        .catch((error) => {
          this.$message({
            showClose: true,
            message: error,
            type: 'error',
            duration: 3500
          })
        })
    },
    saveMessage(packet) {
      var path = this.$route.path
      this.$store.dispatch('ws/saveMessage', { packet, path })
        .catch((error) => {
          this.$message({
            showClose: true,
            message: error,
            type: 'error',
            duration: 3500
          })
        })
    },
    // 所有IM服务消息分配处理
    onMessage(packet) {
      switch (packet.command) {
        case 2:
          // "登录响应"
          break
        case 4:
          // "心跳包响应"
          break
        case 6:
          // "私聊或广播消息响应"
          this.recieveMessage(packet)
          break
        case 8:
          // "加好友申请响应"
          break
        case 10:
          // "接受加好友申请响应"
          break
        case 99:
          // "错误异常响应"
          this.$message({
            showClose: true,
            message: packet.message,
            type: 'error',
            duration: 3500
          })
          break
        default:
          break
      }
    },
    // 聊天消息处理
    recieveMessage(packet) {
      var index = this.robotIds.indexOf(Number(packet.fromUserId))
      if (index > -1) { // 自己发给自己了
        return
      }
      const self = this
      if (self.curMsgList === null) {
        console.log('无法接收消息' + packet)
        self.curMsgList = []
      }
      const msg = {
        messageId: packet.id,
        messageTime: new Date(packet.createTime),
        messageType: packet.msgType,
        content: packet.content,
        avatarUrl: packet.extras.avatarUrl,
        gender: Number(packet.extras.gender),
        nickName: packet.extras.nickName,
        fromUserId: packet.fromUserId,
        mediaUrl: packet.mediaUrl,
        idx: -10
      }
      self.curMsgList.push(msg)
      const pk = {
        scope: {
          channelType: this.curIndex,
          cityId: self.curIndex === 2 ? this.value[1] : null
        },
        msg: msg
      }
      self.scrollToBottom()
      self.saveMessage(pk)
    },
    sendTextMessage() {
      const self = this
      if (self.sendingContent === undefined || self.sendingContent === null || self.sendingContent.trim() === '') {
        this.$message({
          showClose: true,
          message: '请输入要发送的消息内容',
          type: 'error',
          duration: 3500
        })
        return
      }
      if (this.curRobot === null || this.curRobot === undefined || (this.curRobot.id + '') === '') {
        this.$message({
          showClose: true,
          message: '请先选择代表的马甲',
          type: 'error',
          duration: 3500
        })
        return
      }
      var content = utils.replaceEmoji(self.sendingContent)
      const packet = {
        fromUserId: this.curRobot.id,
        scope: {
          channelType: this.curIndex,
          cityId: self.curIndex === 2 ? this.value[1] : null
        },
        chatBody: {
          messageType: 1,
          content: content,
          broadcastFlag: 1
        }
      }
      self.curMsgList = self.curMsgList || []
      this.$handleAPI('', sendBroadcastMessages, packet).then(res => {
        if (res.code === 200) {
          var ret = res.data
          const msg = {
            messageId: ret.messageId,
            messageTime: new Date(ret.messageTime),
            messageType: 1,
            content: content,
            robotAvatarUrl: self.curRobot.avatarUrl,
            fromUserId: self.curRobot.id,
            idx: this.curIndex,
            gender: Number(self.curRobot.gender),
            nickName: self.curRobot.nickName
          }
          self.curMsgList.push(msg)
          self.sendingContent = ''
          self.scrollToBottom()
          const pk = {
            scope: {
              channelType: this.curIndex,
              cityId: self.curIndex === 2 ? this.value[1] : null
            },
            msg: msg
          }
          self.saveMessage(pk)
        }
        this.$message({
          showClose: true,
          message: res.code === 200 ? '发送成功' : res.message,
          type: res.code === 200 ? 'success' : 'error',
          duration: 3500
        })
      })
    },
    sendPicMessage() {
      const self = this
      if (self.sendingPicUrl === '') {
        this.$message({
          showClose: true,
          message: '请选择要发送的图片',
          type: 'error',
          duration: 3500
        })
        return
      }
      if (this.curRobot === null || this.curRobot === undefined || (this.curRobot.id + '') === '') {
        this.$message({
          showClose: true,
          message: '请先选择代表的马甲',
          type: 'error',
          duration: 3500
        })
        return
      }
      const packet = {
        fromUserId: this.curRobot.id,
        scope: {
          channelType: this.curIndex,
          cityId: self.curIndex === 2 ? this.value[1] : null
        },
        chatBody: {
          messageType: 2,
          mediaUrl: self.sendingPicUrl,
          broadcastFlag: 1
        }
      }
      self.curMsgList = self.curMsgList || []
      this.$handleAPI('', sendBroadcastMessages, packet).then(res => {
        if (res.code === 200) {
          var ret = res.data
          const msg = {
            messageId: ret.messageId,
            messageTime: new Date(ret.messageTime),
            messageType: 2,
            mediaUrl: self.sendingPicUrl,
            robotAvatarUrl: self.curRobot.avatarUrl,
            fromUserId: this.curRobot.id,
            idx: this.curIndex
          }
          self.curMsgList.push(msg)
          self.sendingPicUrl = ''
          self.scrollToBottom()
          const pk = {
            scope: {
              channelType: this.curIndex,
              cityId: self.curIndex === 2 ? this.value[1] : null
            },
            msg: msg
          }
          self.saveMessage(pk)
        }
        this.$message({
          showClose: true,
          message: res.code === 200 ? '发送成功' : res.message,
          type: res.code === 200 ? 'success' : 'error',
          duration: 3500
        })
      })
    },
    scrollToBottom() {
      // el-scrollbar 容器
      if (this.$refs['msgScrollBar'] !== undefined) {
        const el = this.$refs['msgScrollBar'].wrap
        const rAF = window.requestAnimationFrame
        const frameFunc = () => {
          el.scrollTop = el.scrollHeight
        }
        rAF(frameFunc)
      }
    },
    // 选中表情包回调事件
    selecteEmoticon(data) {
      if (data.type === 1 || data.type === 0) {
        const value = this.sendingContent
        const el = this.$refs.textarea
        const startPos = el.selectionStart
        const endPos = el.selectionEnd
        if (data.type === 0) {
          data.value += ' '
        }
        const newValue =
          value.substring(0, startPos) +
          data.value +
          value.substring(endPos, value.length)
        this.sendingContent = newValue
        if (el.setSelectionRange) {
          setTimeout(() => {
            const index = startPos + data.value.length
            el.setSelectionRange(index, index)
            el.focus()
          }, 0)
        }
      }
      this.$refs.popoverEmoticon.doClose()
    },
    openPicDialog() {
      this.dialogUpload.visible = true
    },
    handleClick(event, data) {
      switch (event) {
        case 'closeUpload': {
          // 图片上传弹窗点击关闭
          this.dialogUpload.visible = false
          break
        }
      }
    },
    handleEvent(event, data) {
      switch (event) {
        case 'upload': { // 上传成功，绑定图片链接到id
          this.sendingPicUrl = data.fileList[0].relativeUrl
          // 关闭弹窗
          this.handleClick('closeUpload')
          this.sendPicMessage()
          break
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
.app-container {
  .aside-box {
    position: relative;
    background-color:  #fff;
    border-right: 1px solid rgb(245, 226, 204);
    overflow: hidden;
    padding: 5px;
    height: 100%;
    .channel {
      padding-left: 5px;
      font-size: 15px;
      background-color: #fff;
      cursor: pointer;
      border-radius: 3px;
      &.active-border {
        background-color: hsl(20, 18%, 87%);
      }
    }
  }
  .aside-box-right {
    position: relative;
    background-color:#fff;
    padding: 0px;
    height: 100%;
    border-left: 1px solid rgb(245, 226, 204);
  }
  .aside-box .main {
    overflow: hidden;
    padding: 15px;

    .empty-data {
      text-align: center;
      padding-top: 40px;
      color: #ccc;
    }

    .main-menu {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 3px 10px 3px 10px;
      align-items: center;
      user-select: none;

      .title {
        font-size: 12px;
        font-weight: 600;
        color: #1f2329;
      }

      .icon {
        cursor: pointer;
      }
    }
  }
  .hv100 {
    height: 100%;
  }
  .hv70 {
    height: 70%;
    background-color: hsl(0, 23%, 95%);
  }
  .panel-box {
    overflow: hidden;
    height: 100%;
    padding: 0;

    .friendly-tips {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 100%;
      font-size: 24px;
      background-color: rgb(236, 233, 226);
      user-select: none;

      p {
        width: 100%;
        font-weight: 300;
        text-align: center;
        font-size: 15px;
        font-family: 'Courier New', Courier, monospace;
        color: #b9b4b4;
        margin-top: -30px;
      }
    }
  }

  .content-middle {
    width: 100%;
    display: flex;
    align-content: center;/*实现水平居中*/
    justify-content: center;
    text-align: justify;
    padding-top: 10px;
    color:#13C0C5;
  }
  .content-left {
    width: 51%;
    float: left;
    margin-top: 10px;
    padding-bottom: 10px;
    .content-left-avatar {
      float: left;
      margin-left: 5px;
    }
    .content-message-left {
      // display: inline-block;
      margin-left: 10px;
      // margin-top: 10px;
      position: relative;
      padding: 6px 6px;
      background-color: white;
      max-width: 80%;
      float: left;
      // min-height: 36px;
      line-height: 24px;
      box-sizing: border-box;
      font-size: 14px;
      word-break: break-all;
      text-align: left;
      border-radius: 4px;
      .pre-content {
        white-space: pre-wrap;
      }
      .text {
        white-space: pre-wrap;
      }
      &:before {
        content: " ";
        position: absolute;
        top: 12px;
        right: 100%;
        border: 6px solid transparent;
        border-right-color:white;
      }
    }
  }
  .content-right {
    width: 51%;
    float: right;
    margin-top: 10px;
    padding-bottom: 10px;
    .content-right-avatar {
      float: right;
      margin-right: 5px;
    }
    .content-message-right {
      // display: inline-block;
      margin-right: 10px;
      position: relative;
      padding: 6px 6px;
      background-color: #7ce48a;
      max-width: 80%;
      float: right;
      line-height: 24px;
      box-sizing: border-box;
      font-size: 14px;
      word-break: break-all;
      text-align: left;
      border-radius: 4px;
      .pre-content {
        white-space: pre-wrap;
      }
      .text {
        white-space: pre-wrap;
      }
      &:before {
        content: " ";
        position: absolute;
        top: 12px;
        left: 100%;
        border: 6px solid transparent;
        border-left-color:#7ce48a;
      }
    }
  }
  .send-box {
    height: 30%;
    width: 100%;
    position: relative;
    background: #fff;

    .send-type {
      position: relative;
      width: 100%;
      height: 14%;
      line-height: 40px;
      font-size: 12px;
      padding: 0 10px;
      color: rgb(104, 102, 101);
      // background-color:rgb(243, 245, 237);
      border-bottom: 1px solid  hsl(0, 23%, 95%);
      display: inline-block;
      .image {
        padding: 0px 5px;
        cursor: pointer;
        &:hover {
          color: #1aad19;
        }
      }
      .emoji {
        padding: 0px 5px;
        cursor: pointer;
        &:hover {
          color: #1aad19;
        }
      }
    }
    .text-area {
      box-sizing: border-box;
      padding: 10px;
      height: 74%;
      width: 100%;
      border: none;
      outline: none;
      font-family: "Micrsofot Yahei";
      font-size: 13px;
      resize: none;
    }
    .send {
      position: absolute;
      bottom: 10px;
      right: 30px;
      width: 75px;
      height: 28px;
      line-height: 28px;
      box-sizing: border-box;
      text-align: center;
      border: 1px solid #e5e5e5;
      border-radius: 3px;
      background:#fff;
      font-size: 14px;
      color: #7c7c7c;
      &:hover {
        background: rgb(18,150,17);
        color: #fff;
      }
    }
  }
  .el-card {
    line-height: 18px;
  }
  .el-card__body{
    padding: 0px;
    font-size: 10px;
    cursor: default;
    .nick-name {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &.active-border {
      background-color:#13C0C5;
    }

    &:hover {
      background-color: #13C0C5;
    }
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .robot-refresh {
    float: right;
    font-size: 14px;
    font-weight: bold;
    cursor: default;
    &:hover {
      color: hsl(229, 85%, 46%);
    }
  }
}
</style>
