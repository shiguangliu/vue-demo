<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>ID: {{ user.playerId }}</span>
    </div>
    <div>
      <el-row>
        <el-col :span="10">
          <div class="user-profile">
            <div class="box-center">
              <pan-thumb :image="$TH.FILE_URLS.static_url + user.avatarUrl" :height="'100px'" :width="'100px'" :hoverable="false">
                <div>Hello</div>
                <div>{{ user.nickName }}</div>
              </pan-thumb>
            </div>
            <div class="box-center">
              <div class="user-name text-center">{{ user.nickName }}
                <span v-if="user.gender === 1"><i class="fa fa-mars" aria-hidden="true" /></span>
                <span v-if="user.gender === 2"><i class="fa fa-venus" aria-hidden="true" /></span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="user-bio">
            <div class="user-education user-bio-section">
              <div class="user-bio-section-body"><i class="fa fa-user" aria-hidden="true" /> <span>用户类型:{{ user.userTypeName }}</span></div>
              <div class="user-bio-section-body"><i class="fa fa-phone" aria-hidden="true" /> <span>手机号码: {{ user.phone }}</span></div>
              <div class="user-bio-section-body"><i class="fa fa-road" aria-hidden="true" /> <span>所属车道: {{ user.playerLaneTypeName }}</span></div>
              <div class="user-bio-section-body"><i class="fa fa-car" aria-hidden="true" /> <span>是否翻车: {{ user.playerExtraName }}</span></div>
              <div class="user-bio-section-body"><i class="fa fa-clock-o" aria-hidden="true" /> <span>轨迹时长: {{ user.playerTrackTime }}</span></div>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="user-result">
            <span v-if="user.playerResult === 1" class="victory">胜利</span>
            <span v-if="user.playerResult === 2" class="failure">失败</span>
            <span v-if="user.playerResult === 3" class="failure">终止</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <reward-group :result-data="user.raceResultDtos" />
      </el-row>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import RewardGroup from './RewardGroup'
export default {
  components: { PanThumb, RewardGroup },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          playerId: '', // id
          avatarUrl: '', // 用户头像
          nickName: '', // 用户昵称
          gender: '',
          userType: '', // 用户类型
          phone: '', // 用户手机号码
          playerExtraName: '', // 翻车
          playerLaneTypeName: '', // 所属赛道
          playerTrackTime: '', // 轨迹时长
          raceResultDtos: []
        }
      }
    }
  },
  data() {
    return {
      userData: []
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
 .user-result {
   padding-left: 4px;
   font-size: 20px;
   .victory {
     color: red;
   }
   .failure {
     color: rgb(94, 89, 89);
   }
 }
</style>
