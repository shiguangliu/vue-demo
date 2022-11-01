<template>
  <div class="app-container">
    <el-container style="height: 100%">
      <!-- 左侧侧边栏 -->
      <el-aside width="450px" class="aside-box">
        <el-container class="hv100" direction="vertical" style="height:100%;">
          <el-header height="30px" class="header">
            <div class="from">
              <el-input
                v-model="keywords"
                prefix-icon="el-icon-search"
                placeholder="搜索聊天"
                size="small"
              />
            </div>
            <span :style="'' + (wsImOnline === 1 ? 'color: #13C0C5':'') +''"><i class="fa fa-wifi" aria-hidden="true" /></span>
          </el-header>
          <!-- 对话列表栏 -->
          <el-scrollbar
            ref="myScrollbar"
            :native="false"
            class="hv100"
          >
            <el-main class="main">
              <!-- 对话列表 -->
              <div v-for="(item,idx) in talkItems" :key="item.sessionId" class="talk-item" :class="{ 'active-border': idx === curIndex }">
                <div class="avatar">
                  <el-tooltip class="item" effect="light" :content="item.robotNickName" placement="top">
                    <img
                      v-show="item.robotAvatarUrl"
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + item.robotAvatarUrl"
                      :onerror="defaultAvatar"
                    >
                  </el-tooltip>
                  <el-tooltip class="item" effect="light" :content="item.nickName" placement="top">
                    <img
                      v-show="item.avatarUrl"
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + item.avatarUrl"
                      :onerror="defaultAvatar"
                    >
                  </el-tooltip>
                </div>
                <div class="card" @click="getMessage(idx)">
                  <div class="title">
                    <div class="card-name">
                      <p class="nickname">
                        {{ item.nickName }}
                      </p>
                      <div v-if="item.unread !== 0" class="unread">
                        {{ item.unread }}条未读
                      </div>
                    </div>
                    <div class="card-time">
                      {{ item.updatedTime }}
                    </div>
                  </div>
                  <div class="content">
                    <span :class="item.showStatusName !== '离线' ? 'online-color' : 'offline-color'">{{ item.showStatusName }}</span>
                    <span
                      v-text="item.message"
                    />
                  </div>
                </div>
              </div>
            </el-main>
          </el-scrollbar>
          <div style="text-align: center">
            <div style="color: #13C0C5; cursor: pointer" @click="getMoreTalkItem()">
              <span style="font-size: 14px">加载更多</span>
              <i class="fa fa-caret-down" aria-hidden="true" />
            </div>
            <!-- <el-button type="text" @click="getMoreTalkItem()">加载更多<i class="el-icon-more el-icon--right" /></el-button> -->
          </div>
        </el-container>
      </el-aside>

      <!-- 聊天面板容器 -->
      <el-main class="panel-box">
        <template v-if="curRobotId == null">
          <div class="friendly-tips animated flipInY">
            <!-- <img src="~@/assets/image/chat.png" width="300" /> -->
            <p>
              不是井里没有水，而是你挖的不够深<br>
              不是成功来得慢，而是你努力的不够多<br>
              加油吧！ ......
            </p>
          </div>
        </template>
        <template v-if="curRobotId !== null">
          <div style="text-align: center;background-color: hsl(0, 23%, 95%)">
            <div style="color: #13C0C5; padding-top: 10px; cursor: pointer" @click="getMoreHistoryMessage()">
              <span style="font-size: 14px">查看更多</span>
              <i class="fa fa-caret-up" aria-hidden="true" />
            </div>
          </div>
          <el-scrollbar
            ref="msgScrollBar"
            :native="false"
            tag="section"
            class="hv70"
          >
            <div v-for="(msg, index) in curMsgList" :key="msg.messageId + '' +index">
              <div v-if="Math.floor((new Date(msg.messageTime).getTime()-new Date(curMsgList[((index-1)<0?0:index-1)].messageTime).getTime())/(60*1000))>10" class="content-middle">
                <span>{{ $fn.timeView(msg.messageTime) }}</span>
              </div>
              <div v-if="msg.messageType === 6" class="content-middle">
                <pre
                  v-if="msg.messageType === 6"
                  :id="msg.messageId"
                  class="pre-content"
                  v-html="msg.content"
                />
              </div>
              <div v-if="msg.toUserId === curRobotId" class="content-left">
                <div v-if="msg.messageType !== 6" class="content-left-avatar">
                  <img
                    width="36"
                    height="36"
                    :src="$TH.FILE_URLS.static_url + msg.avatarUrl"
                    :onerror="defaultAvatar"
                  >
                </div>
                <div v-if="msg.messageType !== 6" class="content-message-left">
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
              <div v-if="msg.fromUserId === curRobotId" class="content-right">
                <div v-if="msg.messageType !== 6" class="content-right-avatar">
                  <img
                    width="36"
                    height="36"
                    :src="$TH.FILE_URLS.static_url + msg.robotAvatarUrl"
                    :onerror="defaultAvatar"
                  >
                </div>
                <div v-if="msg.messageType !== 6" class="content-message-right">
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
      <el-aside style="align: right; width: 400px" class="aside-box-right">
        <el-scrollbar
          ref="rightSideScrollBar"
          :native="false"
          tag="section"
          class="hv100"
        >
          <div v-if="userData !== null">
            <div style="height: 50%">
              <user-card
                :user="userData.userDto"
              />
            </div>
            <div style="height: 50%">
              <user-card
                :user="userData.robotDto"
              />
            </div>
          </div>
        </el-scrollbar>
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
import { getUnreadMessages, getHistoryMessages, sendMessages, readMessages, getAllFriend, getRobotUserInfo } from '@/api/robot/chat'
import UserCard from './components/UserCard'
import MeEditorEmoticon from './components/MeEditorEmoticon'
import PageDialog from '@/components/PageDialog'
import Upload from '@/components/Upload'
import v_head from '@/assets/img/v_head.png'
import defaultImage from '@/assets/img/no-pic.jpg'
export default {
  components: {
    UserCard,
    MeEditorEmoticon,
    PageDialog,
    Upload
  },
  data() {
    return {
      timeoutObj: null,
      timeout: 10000,
      curRobotId: null,
      curFromUserId: null,
      curImItem: null,
      curIndex: -1,
      sendingContent: '',
      keywords: '',
      allFriendInfo: [],
      allFriendIds: [],
      userData: null,
      loadItemNum: 20,
      talkItems: [
        // {
        //   userId: 123,
        //   robotId: 12354,
        //   nickName: '张三',
        //   avatarUrl: '/u-drive-files/staff/80001/avatar/20201217/536943205333426176.png',
        //   unread: 12,
        //   message: '哈哈哈哈哈哈哈哈符合度假风好大开发和卡东方航空大后方',
        //   updatedTime: '2021-01-26 11:11:27',
        //   showStatusName: '在线'
        // },
        // {
        //   userId: 1234,
        //   robotId: 12354,
        //   nickName: '张三',
        //   avatarUrl: '/u-drive-files/staff/80001/avatar/20201217/536943205333426176.png',
        //   unread: 12,
        //   message: '哈哈哈哈哈哈哈哈符合度假风好大开发和卡东方航空大后方',
        //   updatedTime: '2021-01-26 11:11:27',
        //   showStatusName: '在线'
        // }
      ],
      allMsgList: [
        // {
        //   fromUserId: '',
        //   toUserId: '',
        //   msgs: []
        // }
      ],
      curMsgList: [],
      talkNum: 20,
      // 图片上传弹窗相关
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
    this.getAllFriend()
  },
  methods: {
    getAllFriend() {
      this.$handleAPI('', getAllFriend, { staffId: this.$store.state.staff.staffId }).then(res => {
        if (res.code === 200) {
          this.allFriendInfo = res.data
          this.allFriendInfo.forEach(el => {
            this.allFriendIds.push(el.userId + ':' + el.robotId)
            el.sessionId = el.userId + ':' + el.robotId
          })
          this.getMsgList()
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
    getMsgList() { // 获取新消息列表
      const self = this
      this.$handleAPI('', getUnreadMessages, { staffId: this.$store.state.staff.staffId }).then(res => {
        if (res.code === 200) {
          var addArr = []
          addArr = res.data
          addArr.forEach(el => {
            var index = self.allFriendIds.indexOf(el.userId + ':' + el.robotId)
            if (index !== -1) {
              self.allFriendInfo.splice(index, 1)
              self.allFriendIds.splice(index, 1)
            }
            el.sessionId = el.userId + ':' + el.robotId
            el.updatedTime = utils.switchTime(new Date(el.messageTime), 'YYYY-MM-DD')
          })
          self.allFriendInfo.splice(0, 0, ...addArr)
          for (let index = addArr.length - 1; index >= 0; index--) {
            self.allFriendIds.splice(0, 0, addArr[index].userId + ':' + addArr[index].robotId)
          }
          self.talkItems = self.allFriendInfo.slice(0, self.loadItemNum)
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
    getMoreHistoryMessage() {
      const self = this
      var curMsg = this.curMsgList[0]
      var havaCurMsg = (curMsg !== undefined && curMsg !== null)
      const param = {
        userId: this.curRobotId,
        friendId: this.curFromUserId,
        lastMsgId: havaCurMsg ? curMsg.messageId : '',
        lastTime: havaCurMsg ? curMsg.messageTime : Date.parse(new Date()),
        pageSize: 20
      }
      this.$handleAPI('', getHistoryMessages, param).then(res => {
        if (res.code === 200) {
          if (res.data !== null && res.data.length > 0) {
            res.data.forEach(el => {
              el.avatarUrl = self.curImItem.avatarUrl
              el.robotAvatarUrl = self.curImItem.robotAvatarUrl
              if (el.messageType === 1) {
                el.content = utils.replaceEmoji(el.content)
              }
            })
            self.curMsgList.splice(0, 0, ...res.data)
          } else {
            self.$message({
              showClose: true,
              message: '没有更多数据了',
              type: 'success',
              duration: 3500
            })
          }
        } else {
          self.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
        }
      })
    },
    getMoreTalkItem() {
      if (this.loadItemNum <= this.allFriendInfo.length) {
        this.loadItemNum += 20
        this.talkItems = this.allFriendInfo.slice(0, this.loadItemNum)
      } else {
        this.$message({
          showClose: true,
          message: '没有更多数据了',
          type: 'success',
          duration: 3500
        })
      }
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
      const self = this
      var flag = 0
      // 好友ID列表KEY固定为：注册用户ID+":"+马甲ID
      var index = this.allFriendIds.indexOf(packet.fromUserId + ':' + packet.toUserId)
      if (index < 0) { // 对话列表中没有，属于新增好友消息
        index = this.allFriendIds.indexOf(packet.toUserId + ':' + packet.fromUserId)
      }
      var delEl = this.allFriendInfo[index]
      if (delEl === undefined || delEl === null) {
        return
      }
      const msg = {
        messageId: packet.id,
        messageTime: new Date(packet.createTime),
        messageType: packet.msgType,
        content: packet.content,
        robotAvatarUrl: delEl.robotAvatarUrl,
        avatarUrl: delEl.avatarUrl,
        fromUserId: Number(packet.fromUserId),
        toUserId: Number(packet.toUserId),
        mediaUrl: packet.mediaUrl
      }
      this.allMsgList.forEach(el => {
        if (el.fromUserId === Number(packet.fromUserId) && el.toUserId === Number(packet.toUserId)) {
          // 收到的新消息，追加到消息列表中
          flag = 1
          el.msgs.push(msg)
        } else if (el.fromUserId === Number(packet.toUserId) && el.toUserId === Number(packet.fromUserId)) {
          // 自己发送出去的消息，已经在消息列表中
          flag = 1
        }
        if ((el.fromUserId === self.curFromUserId && el.toUserId === self.curRobotId) || (el.fromUserId === self.curRobotId && el.toUserId === self.curFromUserId)) {
          flag = 2
          self.scrollToBottom()
          // 消息阅读记录更新
          self.$handleAPI('', readMessages, { userId: self.curRobotId, friendId: self.curFromUserId }).then(res => {
            if (res.code === 200) {
              console.log('更新消息阅读记录')
            }
          })
        }
      })
      if (flag !== 2) { // 不是当前会话更新会话列表
        this.allFriendIds.splice(index, 1)
        this.allFriendIds.splice(0, 0, packet.fromUserId + ':' + packet.toUserId)
        this.allFriendInfo.splice(index, 1)
        var tem = utils.switchTime(packet.createTime, 'YYYY-MM-DD')
        const pa = {
          userId: Number(packet.fromUserId),
          robotId: Number(packet.toUserId),
          nickName: delEl.nickName,
          unread: (delEl.unread === undefined || delEl.unread === null || delEl.unread === '') ? 1 : delEl.unread + 1,
          avatarUrl: delEl.avatarUrl,
          robotAvatarUrl: delEl.robotAvatarUrl,
          message: packet.msgType === 1 ? packet.content : packet.msgType === 2 ? '[图片]' : packet.msgType === 3 ? '[语音]' : '[新消息]',
          messageId: packet.id,
          updatedTime: tem,
          showStatusName: '在线'
        }
        this.allFriendInfo.splice(0, 0, pa)
        this.talkItems = this.allFriendInfo.slice(0, this.loadItemNum)
      }
      if (flag === 0) { // allMsgList没有这个会话,添加会话
        const newIm = {
          fromUserId: Number(packet.fromUserId),
          toUserId: Number(packet.toUserId)
        }
        newIm.msgs = []
        newIm.msgs.push(msg)
        this.allMsgList.push(newIm)
      }
    },
    sendTextMessage() {
      const self = this
      if (self.sendingContent === undefined || self.sendingContent === null || self.sendingContent.trim() === '') {
        return
      }
      var content = utils.replaceEmoji(self.sendingContent)
      const packet = {
        fromUserId: this.curRobotId,
        toUserId: this.curFromUserId,
        chatBody: {
          messageType: 1,
          content: self.sendingContent,
          broadcastFlag: 2
        }
      }
      this.$handleAPI('', sendMessages, packet).then(res => {
        if (res.code === 200) {
          var ret = res.data
          self.allMsgList.forEach(el => {
            if (el.fromUserId === self.curFromUserId && el.toUserId === self.curRobotId) {
              const msg = {
                messageId: ret.messageId,
                messageTime: new Date(ret.messageTime),
                messageType: 1,
                content: content,
                robotAvatarUrl: self.curImItem.robotAvatarUrl,
                avatarUrl: self.curImItem.avatarUrl,
                fromUserId: this.curRobotId,
                toUserId: this.curFromUserId
              }
              self.curMsgList.push(msg)
              self.sendingContent = ''
              self.scrollToBottom()
            }
          })
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
        return
      }
      const packet = {
        fromUserId: this.curRobotId,
        toUserId: this.curFromUserId,
        chatBody: {
          messageType: 2,
          mediaUrl: self.sendingPicUrl,
          broadcastFlag: 2
        }
      }
      this.$handleAPI('', sendMessages, packet).then(res => {
        if (res.code === 200) {
          var ret = res.data
          self.allMsgList.forEach(el => {
            if (el.fromUserId === self.curFromUserId && el.toUserId === self.curRobotId) {
              const msg = {
                messageId: ret.messageId,
                messageTime: new Date(ret.messageTime),
                messageType: 2,
                mediaUrl: self.sendingPicUrl,
                robotAvatarUrl: self.curImItem.robotAvatarUrl,
                avatarUrl: self.curImItem.avatarUrl,
                fromUserId: this.curRobotId,
                toUserId: this.curFromUserId
              }
              self.curMsgList.push(msg)
              self.sendingPicUrl = ''
              self.scrollToBottom()
            }
          })
        }
        this.$message({
          showClose: true,
          message: res.code === 200 ? '发送成功' : res.message,
          type: res.code === 200 ? 'success' : 'error',
          duration: 3500
        })
      })
    },
    getMessage(idx) {
      const self = this
      self.curImItem = self.talkItems[idx]
      self.curRobotId = self.talkItems[idx].robotId
      self.curFromUserId = self.talkItems[idx].userId
      self.curIndex = idx
      if (self.talkItems[idx].unread > 0) {
        self.talkItems[idx].unread = 0
        // 需要更新消息阅读记录
        this.$handleAPI('', readMessages, { userId: this.curRobotId, friendId: this.curFromUserId }).then(res => {
          if (res.code === 200) {
            console.log('更新阅读记录')
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'error',
              duration: 3500
            })
          }
        })
      }
      var flag = false
      self.allMsgList.forEach(el => {
        if (el.fromUserId === self.curFromUserId && el.toUserId === self.curRobotId) {
          flag = true
          self.curMsgList = el.msgs
        }
      })
      self.showUserInfo(self.curFromUserId, self.curRobotId)
      if (flag) {
        self.scrollToBottom()
        return
      }
      const param = {
        userId: self.curRobotId,
        friendId: self.curFromUserId,
        lastMsgId: '',
        lastTime: Date.parse(new Date()),
        pageSize: 20
      }
      this.$handleAPI('', getHistoryMessages, param).then(res => {
        if (res.code === 200) {
          const newIm = {
            fromUserId: self.curFromUserId,
            toUserId: self.curRobotId
          }
          if (res.data !== null && res.data.length > 0) {
            newIm.msgs = res.data
          } else {
            newIm.msgs = []
          }
          newIm.msgs.forEach(el => {
            el.avatarUrl = self.curImItem.avatarUrl
            el.robotAvatarUrl = self.curImItem.robotAvatarUrl
            if (el.messageType === 1) {
              el.content = utils.replaceEmoji(el.content)
            }
          })
          self.allMsgList.push(newIm)
          self.curMsgList = newIm.msgs
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
    showUserInfo(userId, robotId) {
      this.$handleAPI('', getRobotUserInfo, { userId: userId, robotId: robotId }).then(res => {
        if (res.code === 200) {
          this.userData = res.data
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

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 15px;

      .from {
        flex: 1 1;
        flex-shrink: 0;
        padding-top: 10px;
        height: 40px;

        /deep/ .el-input .el-input__inner {
          border-radius: 20px;
          width: 240px;
        }
      }
    }
  }
  .aside-box-right {
    position: relative;
    background-color:#fff;
    overflow: hidden;
    padding: 0px;
    height: 100%;
    background-color: white;
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

    .talk-item {
      padding: 8px 25px;
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      border-left: 1px solid white;
      .avatar {
        height: 35px;
        width: 35px;
        flex-basis: 35px;
        flex-shrink: 0;
        border-radius: 50%;
        background-color:  white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: white;
        user-select: none;
        transition: ease 1s;
        position: relative;
        // overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          background-color: white;
          border-radius: 3px;
          margin-right: 5px;
        }
      }

      .card {
        height: 40px;
        display: flex;
        align-content: center;
        flex-direction: column;
        flex: 1 1;
        margin-left: 25px;
        overflow: hidden;
        .title {
          width: 100%;
          height: 20px;
          display: flex;
          align-items: center;

          .card-name {
            color: #1f2329;
            font-size: 14px;
            line-height: 20px;
            flex: 1 1;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            align-items: center;
            overflow: hidden;
            .nickname {
              font-weight: 400;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              margin-right: 3px;
            }
            .unread {
              font-weight: 400;
              margin-left: 5px;
              color: rgb(243, 34, 34);
            }
          }
          .card-time {
            color: #8f959e;
            font-size: 12px;
            margin-left: 10px;
            user-select: none;
          }
        }
        .content {
          font-size: 10px;
          line-height: 18px;
          color: #414347;
          overflow: hidden;
          margin-top: 3px;
          font-weight: 300;
          white-space: nowrap;
          text-overflow: ellipsis;
          .offline-color {
            color: #8f959e;
            font-weight: 400;
          }
          .online-color {
            color: #4aa71c;
            font-weight: 400;
          }
        }
      }

      &.active-border {
        border-color: hsl(0, 23%, 95%);
        background-color: hsl(0, 23%, 95%);
      }

      &:hover {
        background-color: hsl(0, 23%, 95%);
      }
    }
  }
  .hv100 {
    height: 100%;
  }
  .hv70 {
    height: 66%;
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
}
</style>
