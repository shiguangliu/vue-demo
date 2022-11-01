<template>
  <el-card shadow="never">
    <el-row>
      <div class="header">
        <span>ID: {{ user.id }}</span>
      </div>
      <el-col :span="8">
        <div class="user-profile">
          <div class="box-center">
            <pan-thumb :image="$TH.FILE_URLS.static_url + user.avatarUrl" :height="'50px'" :width="'50px'" :hoverable="false">
              <!-- <div>Hello</div> -->
              <div>{{ user.userName }}</div>
            </pan-thumb>
            <div class="user-name">
              <div class="nick">
                <span v-if="user.gender === 1"><i class="fa fa-mars" style="color: blue" aria-hidden="true" /></span>
                <span v-if="user.gender === 2"><i class="fa fa-venus" style="color: red" aria-hidden="true" /></span>
                {{ user.nickName }}
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="user-bio">
          <div class="user-education user-bio-section">
            <div class="user-bio-section-body"><i class="fa fa-user" aria-hidden="true" /> <span>用户类型:{{ user.userTypeName }}</span></div>
            <div class="user-bio-section-body"><i class="fa fa-phone" aria-hidden="true" /> <span>手机号码: {{ user.phone }}</span></div>
            <div class="user-bio-section-body"><i class="fa fa-map-marker" aria-hidden="true" /> <span>定位: {{ user.location }}</span></div>
            <div class="user-bio-section-body"><i class="fa fa-car" aria-hidden="true" /> <span>装备性能总分: {{ user.equipmentPerformance }}</span></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="user-bio-other">
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
        <div class="user-bio-section-header"><i class="fa fa-road" /><span>启程数据</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            累计里程: {{ user.tripMiles }}
          </div>
          <div class="text-muted">
            累计时长: {{ user.tripHours }}
          </div>
          <div class="text-muted">
            累计次数: {{ user.tripCount }}
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
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .box-center {
   margin-left: 5px;
   margin-top: 20px;
   display: table;
   text-align: center;
 }
  .header {
    padding-top: 1px;
    padding-left: 5px;
    font-size: 14px;
    height: 15px;
    width: 100%;
    text-align: left;
  }
 .text-muted {
   color: #606266;
 }

 .user-profile {
   padding-left: 5px;
   .user-name {
     font-weight: bold;
     font-size: 12px;
     .nick {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #010102;
        width: 100px;
     }
   }

   .box-center {
     padding-left: 5px;
     padding-top: 10px;
   }

   .user-role {
     padding-left: 5px;
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
   font-size: 10px;
   span {
     font-size: 10px;
   }
   .user-bio-section {
     padding: 1px 0;
     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       font-weight: bold;
       font-size: 10px;
     }
   }
   .user-bio-section-body {
      //  font-weight: bold;
      height: 23px;
       padding-top: 0;
     }
 }
 .user-bio-other {
   padding-left: 5px;
   font-size: 10px;
   span {
     font-size: 10px;
   }
   .user-bio-section {
     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       font-weight: bold;
       font-size: 10px;
     }
   }
   .user-bio-section-body {
      //  font-weight: bold;
       padding-top: 0;
     }
 }
</style>
