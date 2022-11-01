<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="系统参数" name="sysConfigTab">
                <sys-config />
              </el-tab-pane>
              <el-tab-pane label="积分规则" name="pointRuleTab">
                <point-rule />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SysConfig from './components/SysConfig'
import PointRule from './components/PointRule'

export default {
  name: 'PlatConfig',
  components: { SysConfig, PointRule },
  data() {
    return {
      activeTab: 'sysConfigTab'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }
  }
}
</script>
