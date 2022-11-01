<template>
  <div>
    <el-container class="container">
      <el-main class="padding0">
        <div class="emoticon">
          <div
            v-for="(item, i) in emoji.emoji1"
            :key="item.index_name"
            class="emoticon-item"
            @click="clickEmoticon(item, 1)"
          >
            <img :src="'https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/' + i + '.gif'">
          </div>
          <div
            v-for="(item) in emoji.emoji2"
            :key="item.index_name"
            class="emoticon-item symbol"
            @click="clickEmoticon(item, 0)"
          >
            {{ item }}
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import emoji from '@/assets/emoji'
export default {
  data() {
    return {
      emoji: emoji,
      showTitle: 'QQ表情/符号表情',
      page: 1,
      pageSize: 13,

      // 表情包列表
      emojiItem: [
        {
          emoticon_id: -1,
          name: 'QQ表情/符号表情',
          url: require('@/assets/image/icon_face.png'),
          list: []
        }
      ]
    }
  },
  computed: {
    pageTotal() {
      return this.emojiItem.length / this.pageSize
    }
  },
  created() {
    // this.loadUserEmoji();
  },
  methods: {
    // 表情包导航翻页
    turnPage(type) {
      if (type === 1) {
        if (this.page === 1) return false
        this.page--
      } else {
        if (this.page >= this.pageTotal) return false
        this.page++
      }
    },
    // 点击表情包导航
    triggerItem(item) {
      this.showTitle = item.name
    },
    // 选中表情
    clickEmoticon(emoji, type) {
      const text = type === 1 ? `[${emoji}]` : emoji
      this.callback({
        type: type,
        value: text
      })
    },
    callback(data) {
      this.$emit('selected', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 300px;
  width: 500px;
  background-color: white;
  .header {
    line-height: 30px;
    font-size: 13px;
    font-weight: 400;
    padding-left: 5px;
    user-select: none;
    position: relative;
    border-bottom: 1px solid #fbf5f5;
    .addbtn {
      position: absolute;
      right: 10px;
      top: 1px;
      color: #409eff;
      cursor: pointer;
    }
  }
}
.emoji-box,
.emoticon {
  width: 100%;
}
.emoticon {
  .title {
    width: 50%;
    height: 25px;
    line-height: 25px;
    color: #ccc;
    font-weight: 400;
    padding-left: 3px;
    font-size: 12px;
  }
  .emoticon-item {
    width: 30px;
    height: 30px;
    margin: 2px;
    float: left;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      transform: scale(1.3);
    }
  }
  .symbol {
    font-size: 22px;
  }
}

.emoji-box {
  .emoji-item {
    width: 67px;
    height: 67px;
    margin: 2px;
    background-color: #eff1f7;
    float: left;
    cursor: pointer;
    transition: ease-in 0.3s;
  }

  .custom-emoji {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 10px;
    i {
      font-size: 30px;
      margin-bottom: 3px;
    }

    &:active {
      color: #409eff;
    }
  }
}

/deep/ .el-image {
  width: 100%;
  height: 100%;
  transition: ease-in 0.3s;
}

.emoji-box .emoji-item:hover .el-image,
.emoji-box .emoji-item:hover {
  border-radius: 10px;
}
</style>
