<template>
  <div class="user-activity">
    <div v-for="(msg, index) in messageData.list" :key="msg.seqid" class="post">
      <div class="user-block">
        <i v-if="msg.readflag==='0'" class="fa fa-envelope-o img-circle" />
        <i v-else class="fa fa-envelope-open-o img-circle" />
        <el-tooltip content="标记为已读" placement="top" style="float:right">
          <el-button v-if="msg.readflag==='0'" type="primary" round @click="read(index)">NEW</el-button>
        </el-tooltip>
        <span class="username text-muted">{{ msg.title }}</span>
        <span class="description">{{ msg.notifytime }}</span>
        <p>{{ msg.content }}</p>
      </div>
    </div>
    <!-- <div class="post">
      <div class="user-block">
        <img class="img-circle" :src="'https://wpimg.wallstcn.com/57ed425a-c71e-4201-9428-68760c0537c4.jpg'+avatarPrefix">
        <span class="username text-muted">Iron Man</span>
        <span class="description">Shared publicly - 7:30 PM today</span>
      </div>
      <p>
        Lorem ipsum represents a long-held tradition for designers,
        typographers and the like. Some people hate it and argue for
        its demise, but others ignore the hate as they create awesome
        tools to help create filler text for everyone from bacon lovers
        to Charlie Sheen fans.
      </p>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            Share
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            Like
          </span>
        </li>
      </ul>
    </div>
    <div class="post">
      <div class="user-block">
        <img class="img-circle" :src="'https://wpimg.wallstcn.com/9e2a5d0a-bd5b-457f-ac8e-86554616c87b.jpg'+avatarPrefix">
        <span class="username text-muted">Captain American</span>
        <span class="description">Sent you a message - yesterday</span>
      </div>
      <p>
        Lorem ipsum represents a long-held tradition for designers,
        typographers and the like. Some people hate it and argue for
        its demise, but others ignore the hate as they create awesome
        tools to help create filler text for everyone from bacon lovers
        to Charlie Sheen fans.
      </p>
      <ul class="list-inline">
        <li>
          <span class="link-black text-sm">
            <i class="el-icon-share" />
            Share
          </span>
        </li>
        <li>
          <span class="link-black text-sm">
            <svg-icon icon-class="like" />
            Like
          </span>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import { messageReadApi } from '@/api/system/home'
import { mapGetters } from 'vuex'
const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'

export default {
  props: {
    messageData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      carouselImages: [
        'https://wpimg.wallstcn.com/9679ffb0-9e0b-4451-9916-e21992218054.jpg',
        'https://wpimg.wallstcn.com/bcce3734-0837-4b9f-9261-351ef384f75a.jpg',
        'https://wpimg.wallstcn.com/d1d7b033-d75e-4cd6-ae39-fcd5f1c0a7c5.jpg',
        'https://wpimg.wallstcn.com/50530061-851b-4ca5-9dc5-2fead928a939.jpg'
      ],
      avatarPrefix,
      carouselPrefix
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits',
      'userid'
    ])
  },
  methods: {
    read(index) {
      this.$confirm('确定要标记为已读吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = { userid: this.userid, seqid: this.messageData.list[index].seqid, oldupdatetime: this.messageData.list[index].updatetime }
        this.$handleAPI('', messageReadApi, params).then(res => {
          if (res.code === '200' || res.code === 200) {
            this.messageData.list[index].readflag = '1'
          }
        }).catch(
        )
      }).catch((e) => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-activity {
  .user-block {

    .username {
      margin-left: 10px;
      padding: 2px 0;
    }

    .description {
      display: block;
      font-size: 12px;
      margin-left: 30px;
      padding: 2px 0;
    }

    .username{
      font-size: 14px;
      color: #000;
    }

    :after {
      clear: both;
    }

    .img-circle {
      border-radius: 50%;
      width: 20px;
      height: 20px;
      float: left;
    }

    span {
      font-weight: 500;
      font-size: 12px;
    }

    p {
      font-size: 12px;
      margin-left: 30px !important;
      padding: 2px 0;
    }
  }

  .btn-block {
    float: right;
  }

  .post {
    font-size: 14px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 15px;
    padding-bottom: 15px;
    color: #666;
    width: 100%;

    .image {
      width: 100%;
      height: 100%;

    }

    .user-images {
      padding-top: 20px;
    }
  }

  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;

    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }

    .link-black {

      &:hover,
      &:focus {
        color: #999;
      }
    }
  }
}

.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}
</style>
