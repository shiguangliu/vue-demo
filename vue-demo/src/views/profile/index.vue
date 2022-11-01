<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>
        <el-col :span="18" :xs="24">
          <el-card style="border-color: #13C0C5;">
            <el-tabs v-model="activeTab" @tab-click="tabClick">
              <el-tab-pane label="账户" name="account">
                <account :account="account" />
              </el-tab-pane>
              <el-tab-pane label="登录履历" name="history">
                <timeline />
                <!-- <timeline :timeline="loginHistoryList" /> -->
                <page-table
                  :table-index="tableInfo.tableIndex"
                  :check-box="tableInfo.checkBox"
                  :refresh="tableInfo.refresh"
                  :init-curpage="tableInfo.initCurpage"
                  :data.sync="tableInfo.data"
                  :api="getLoginHistory"
                  :query="tableInfo.query"
                  :field-list="tableInfo.fieldList"
                  :list-type-info="listTypeInfo"
                >
                  <template v-slot:col-trackType="scope">
                    <p>{{ getTrackStatusName(scope.row.trackType) }}</p>
                  </template>
                </page-table>
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
import { getConfigItemsListApi } from '@/api/common'
import { getLoginHistory } from '@/api/account'
import { getLocalStorage } from '@/common/js/storage'
import UserCard from './components/UserCard'
import Timeline from './components/Timeline'
import Account from './components/Account'
import PageTable from '@/components/PageTable'

export default {
  name: 'Profile',
  components: { UserCard, Timeline, Account, PageTable },
  data() {
    return {
      getLoginHistory,
      staff: {},
      account: {},
      activeTab: 'account',
      loginHistoryList: [],
      listTypeInfo: {},
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: false, // 是否显示序号
        checkBox: false,
        query: { staffId: this.staffId },
        data: [],
        fieldList: [
          { label: '履历ID', value: 'id', width: 100 },
          { label: 'IP地址', value: 'ip' },
          { label: '记录类型', value: 'trackType', type: 'slot' },
          { label: '记录时间', value: 'trackTime', width: 200 }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'staffId',
      'staffNo',
      'gender',
      'roleInfoList',
      'phone',
      'mail',
      'merchantInfoList'
    ])
  },
  watch: {
    'account.refresh'(val) {
      this.staff.name = this.account.name
      this.staff.phone = this.account.phone
      this.staff.gender = this.account.gender
      this.staff.mail = this.account.mail
    }
  },
  created() {
    this.getStaff()
    // this.getStaffLoginHistory()
  },
  mounted() {
    this.tableInfo.query = { staffId: this.staffId }
    this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_LOGIN_TRACK_TYPE' }).then(res => {
      if (res.code === 200) {
        this.listTypeInfo.statusList = res.data
      }
    })
  },
  methods: {
    tabClick(e) {
      if (e.name === 'history') {
        this.tableInfo.refresh = Math.random()
      }
    },
    getTrackStatusName(value) {
      for (const item of this.listTypeInfo.statusList) {
        if (Number(item.itemValue) === value) {
          return item.itemName
        }
      }
      return '未设置'
    },
    getStaff() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        avatar: this.avatar,
        roleInfoList: this.roleInfoList,
        phone: this.phone,
        mail: this.mail,
        merchantInfoList: this.merchantInfoList,
        storeInfoList: this.storeInfoList
      }
      this.account = {
        staffId: this.staffId,
        staffNo: getLocalStorage('staffNo'),
        name: this.name,
        sex: this.sex,
        phone: this.phone,
        mail: this.mail,
        refresh: 0
      }
    },
    getStaffLoginHistory() {
      const params = { staffId: this.staffId, pageSize: 20, pageNum: 1 }
      this.$handleAPI('', getLoginHistory, params).then(res => {
        console.log(res)
        if (res.code === '200' || res.code === 200) {
          this.loginHistoryList = res.data.list
        }
      }).catch(
      )
    }
  }
}
</script>
