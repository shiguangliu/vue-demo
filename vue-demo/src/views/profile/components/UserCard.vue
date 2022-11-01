<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>{{ user.name }}</div>
          <template v-for="(role, index) in user.roleinfolist">
            {{ role.rolename }}
            <template v-if="index<user.roleinfolist.length - 1">
              {{ ' | ' }}
            </template>
          </template>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">
          <template v-for="(role, index) in user.roleinfolist">
            {{ role.rolename }}
            <template v-if="index<user.roleinfolist.length - 1">
              {{ ' | ' }}
            </template>
          </template>
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-body"><i class="fa fa-phone" aria-hidden="true" /> <span>{{ user.phone }}</span></div>
        <el-divider />
        <div class="user-bio-section-body"><i class="fa fa-envelope-o" aria-hidden="true" /> <span>{{ user.mail }}</span></div>
        <div class="user-bio-section-header" />
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><i class="fa fa-archive" aria-hidden="true" /><span>所属商户</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            <el-tag v-for="m in user.merchantinfolist" :key="m.merchantid" type="success">{{ m.merchantName }}</el-tag>
          </div>
        </div>
      </div>
      <!-- <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><i class="fa fa-hospital-o" /><span>所属门店</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            <el-tag v-for="u in user.storeinfolist" :key="u.storeid" type="success">{{ u.storename }}</el-tag>
          </div>
        </div>
      </div> -->
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
          name: '',
          email: '',
          avatar: '',
          roles: '',
          roleinfolist: [],
          merchantinfolist: [],
          storeinfolist: []
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
     font-size: 14px;
     padding: 15px 0;

     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       padding-bottom: 10px;
       margin-bottom: 10px;
       font-weight: bold;
     }

     .user-bio-section-body {
       font-weight: bold;
     }

   }
 }
</style>
