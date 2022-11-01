<template>
  <div class="app-container">
    <!-- 条件栏 -->
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <!-- 表格 -->
    <page-table
      :table-index="tableInfo.tableIndex"
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="robotInviteList"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      :check-box="tableInfo.checkBox"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { robotInviteList, agreeFriends, friendRefuse, agreeFriendsBatch, friendRefuseBatch } from '@/api/robot/invite/index'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'

export default {
  components: {
    PageFilter,
    PageTable
  },
  data() {
    return {
      robotInviteList,
      // checkbox 选中的列表
      checkBoxList: [],
      // 相关列表
      listTypeInfo: {
        userTypeList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          userId: '',
          userName: '',
          phone: '',
          brandId: '',
          seriesId: '',
          userType: ''
        },
        list: [
          { type: 'input', label: '用户ID', value: 'userId' },
          { type: 'customselect', label: '用户类型', value: 'userType', list: 'userTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'input', label: '马甲ID', value: 'vestId' },
          { type: 'input', label: '马甲昵称  ', value: 'vestName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '批量同意', btType: 'primary', icon: 'el-icon-check', event: 'batchaccept', show: false },
          { type: 'button', label: '批量忽略', btType: 'danger', icon: 'el-icon-close', event: 'batchdelete', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: false,
        checkBox: true,
        data: [],
        fieldList: [
          { label: '用户ID', value: 'userId' },
          { label: '用户呢称', value: 'userName' },
          { label: '用户类型', value: 'userTypeName' },
          { label: '马甲ID', value: 'vestId' },
          { label: '马甲昵称', value: 'vestName' },
          { label: '马甲类型', value: 'vestTypeName' },
          { label: '好友申请', value: 'inviteMessage' },
          { label: '发送申请时间', value: 'inviteTime', minWidth: 90 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '同意', type: 'primary', icon: 'fa fa-check', event: 'accept', show: false },
            { label: '忽略', type: 'danger', icon: 'el-icon-close', event: 'delete', show: false }
          ]
        }
      },
      temp: {
        id: undefined,
        merchantNo: '',
        merchantName: '',
        linkman: '',
        phone: '',
        cityId: '',
        createTime: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits'
    ])
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
    this.getList()
  },
  created() {
    this.getCityList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('robotInvite', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('robotInvite', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      // form验证
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      const params = {
        'configType': 'PLAT_USER_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.userTypeList = res.data
        }
      })
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    getCityList() {
    },
    // reset temp
    resetTemp() {
      this.temp = {
        id: undefined,
        merchantNo: '',
        merchantName: '',
        linkman: '',
        phone: '',
        cityId: '',
        createTime: ''
      }
    },
    // 按钮点击
    handleClick(event, data) {
      const tableInfo = this.tableInfo
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'accept': {
          this.$confirm('确定同意好友申请吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'userId': data.vestId,
              'inviteId': data.id,
              'staffId': this.$store.state.staff.staffId
            }
            this.$handleAPI('', agreeFriends, params).then(res => {
              if (res.code === 200) {
                this.$message({
                  showClose: true,
                  message: '操作成功',
                  type: 'success',
                  duration: 3500
                })
                tableInfo.refresh = Math.random()
              } else {
                this.$message({
                  showClose: true,
                  message: '操作失败',
                  type: 'error',
                  duration: 3500
                })
              }
            })
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
          break
        }
        case 'delete': {
          this.$confirm('确定要忽略好友申请吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'userId': data.vestId,
              'inviteId': data.id
            }
            this.$handleAPI('', friendRefuse, params).then(res => {
              if (res.code === 200) {
                this.$message({
                  showClose: true,
                  message: '操作成功',
                  type: 'success',
                  duration: 3500
                })
                tableInfo.refresh = Math.random()
              } else {
                this.$message({
                  showClose: true,
                  message: '操作失败',
                  type: 'error',
                  duration: 3500
                })
              }
            })
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
          break
        }
        case 'batchaccept': { // 批量同意
          const inviteIdList = []
          let pass = true
          try {
            this.checkBoxList.forEach(item => {
              inviteIdList.push(item.id)
            })
          } catch (error) {
            this.$message({
              showClose: true,
              message: error.message,
              type: 'error',
              duration: 3500
            })
            pass = false
          }
          if (inviteIdList.length <= 0) {
            this.$message({
              showClose: true,
              message: '请选择需要的数据',
              type: 'error',
              duration: 3500
            })
            pass = false
          }
          // 校验不通过，则返回
          if (!pass) {
            return
          }
          this.$confirm('确定批量同意好友申请吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'staffId': this.$store.state.staff.staffId,
              'inviteIdList': inviteIdList
            }
            this.$handleAPI('', agreeFriendsBatch, params).then(res => {
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.tableInfo.refresh = Math.random()
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error',
                  duration: 3500
                })
              }
            })
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
          break
        }
        case 'batchdelete': { // 批量忽略
          const inviteIdList = []
          let pass = true
          try {
            this.checkBoxList.forEach(item => {
              inviteIdList.push(item.id)
            })
          } catch (error) {
            this.$message({
              showClose: true,
              message: error.message,
              type: 'error',
              duration: 3500
            })
            pass = false
          }
          if (inviteIdList.length <= 0) {
            this.$message({
              showClose: true,
              message: '请选择需要操作的数据',
              type: 'error',
              duration: 3500
            })
            pass = false
          }
          // 校验不通过，则返回
          if (!pass) {
            return
          }
          this.$confirm('确定批量忽略好友申请吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'inviteIdList': inviteIdList
            }
            this.$handleAPI('', friendRefuseBatch, params).then(res => {
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.tableInfo.refresh = Math.random()
              } else {
                this.$message({
                  showClose: true,
                  message: '操作失败',
                  type: 'error',
                  duration: 3500
                })
              }
            })
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) {
            data.forEach(item => {
              this.$set(item, 'statusLoading', false)
              this.$set(item, 'deleteLoading', false)
              item.approveTime = this.$fn.switchTime(item.approveTime, 'YYYY-MM-DD hh:mm:ss')
            })
          }
          break
        case 'todo': {
          break
        }
        case 'tableCheck': { // 选择
          this.checkBoxList = data
          break
        }
      }
    }
  }
}
</script>
