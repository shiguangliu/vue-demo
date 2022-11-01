<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>ID: {{ user.id }}</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="$TH.FILE_URLS.static_url + user.avatarUrl" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          <div>{{ user.userName }}</div>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.nickName }}
          <span v-if="user.gender === 1"><i class="fa fa-mars" aria-hidden="true" /></span>
          <span v-if="user.gender === 2"><i class="fa fa-venus" aria-hidden="true" /></span>
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-body"><i class="fa fa-phone" aria-hidden="true" /> <span>{{ user.phone }}</span></div>
        <div class="user-bio-section-body"><i class="fa fa-envelope-o" aria-hidden="true" /> <span>{{ user.mail }}</span></div>
        <div class="user-bio-section-body"><i class="fa fa-birthday-cake" aria-hidden="true" /> <span>{{ user.birthday }}</span></div>
        <div class="user-bio-section-body"><i class="fa fa-map-marker" aria-hidden="true" /> <span>{{ user.location }}</span></div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><i class="fa fa-coffee" /><span>兴趣爱好标签</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.tagList }}
          </div>
        </div>
      </div>
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><i class="fa fa-file-text-o" /><span>签名</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.profile }}
          </div>
        </div>
      </div>
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>个人介绍</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.description }}
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: '', // id
          avatarUrl: '', // 用户头像
          nickName: '', // 用户昵称
          userName: '', // 用户真实姓名
          genderName: '', // 用户性别
          gender: '',
          birthday: '', // 用户生日
          phone: '', // 用户手机号码
          mail: '', // 用户邮箱
          registerTime: '', // *创建时间
          location: '', // 用户所在地
          profile: '', // 用户个性化签名
          description: '', // 用户个人介绍
          tagList: '', // 用户兴趣爱好标签
          statusName: '' // 用户状态
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .box-center {
   margin: 0 auto;
   display: table;
 }

 .text-muted {
   color: #777;
 }

 .user-profile {
   .user-name {
     font-weight: bold;
   }

   .box-center {
     padding-top: 10px;
   }

   .user-role {
     padding-top: 10px;
     font-weight: 400;
     font-size: 14px;
   }

   .box-social {
     padding-top: 30px;

     .el-table {
       border-top: 1px solid #dfe6ec;
     }
   }

   .user-follow {
     padding-top: 20px;
   }
 }

 .user-bio {
   margin-top: 20px;
   color: #606266;

   span {
     padding-left: 4px;
   }

   .user-bio-section {
     padding: 15px 0;

     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       padding-bottom: 10px;
       margin-bottom: 10px;
       font-weight: bold;
       font-size: 14px;
     }
     .user-bio-section-body {
      //  font-weight: bold;
       padding: 5px 0;
     }
   }
 }
</style>
