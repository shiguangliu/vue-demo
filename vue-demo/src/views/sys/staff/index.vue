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
      :api="getListApi"
      :query="filterInfo.query"
      :result-set="tableInfo.resultSet"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 自定义插槽显示状态 -->
      <template v-slot:col-statusName="scope">
        <el-tag :type="scope.row.statusName === '正常' ? '': 'info' ">{{ scope.row.statusName }}</el-tag>
      </template>
      <template v-slot:col-deleteFlag="scope">
        <p :style="scope.row.deleteFlag ? 'color: red;': '' ">{{ scope.row.deleteFlag ? '已删除' : '' }}</p>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi, getMerchantListApi } from '@/api/common'
import { getListApi, createApi, updateApi, deleteApi, getRptListApi } from '@/api/sysstaff'
// import ThConsts from '@/constants' /* constant */
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'

export default {
  components: {
    PageFilter,
    PageTable
  },
  data() {
    return {
      getListApi,
      createApi,
      updateApi,
      deleteApi,
      // 相关列表
      listTypeInfo: {
        staffTypeList: [],
        staffOnlineStatusList: [],
        staffStatusList: [],
        deleteFlagList: [],
        genderList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          staffName: '',
          nickName: '',
          staffNo: '',
          phone: '',
          staffType: '',
          onlineStatus: '',
          status: ''
        },
        list: [
          { type: 'input', label: '真实姓名', value: 'staffName' },
          { type: 'input', label: '昵称', value: 'nickName' },
          { type: 'input', label: '员工编号', value: 'staffNo' },
          { type: 'input', label: '手机号', value: 'phone' },
          { type: 'customselect', label: '员工类型', value: 'staffType', list: 'staffTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '在线状态', value: 'onlineStatus', list: 'staffOnlineStatusList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'staffStatusList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '删除标志', value: 'deleteFlag', list: 'deleteFlagList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: true },
          { type: 'button', label: '导出', btType: 'success', icon: 'el-icon-download', event: 'export', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        tableIndex: false, // 显示序号
        refresh: 1,
        initCurpage: 1,
        data: [],
        resultSet: 'list', // Api返回的结果集字段名，如:res.data.userlist,则 resultSet 为：userlist
        fieldList: [
          { label: '员工ID', value: 'id' },
          { label: '员工编号', value: 'staffNo' },
          { label: '昵称', value: 'nickName' },
          { label: '真实姓名', value: 'staffName' },
          { label: '手机号', value: 'phone' },
          { label: '性别', value: 'genderName' },
          { label: '类型', value: 'staffTypeName', width: 90 },
          { label: '在线状态', value: 'onlineStatusName', width: 90 },
          { label: '状态', value: 'statusName', width: 90, type: 'slot' },
          { label: '删除标志', value: 'deleteFlag', width: 90, type: 'slot' },
          { label: '更新时间', value: 'updateTime', width: 150 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '100',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false },
            { tooltip: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', loading: 'deleteLoading', show: false }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits'
    ])
  },
  watch: {
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
    this.getList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('staffList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('staffList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'STAFF_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.staffTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'ONLINE_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.staffOnlineStatusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENDER_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.genderList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'STAFF_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.staffStatusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'DELETE_FLAG' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.deleteFlagList = res.data
        }
      })
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    // 得到placeholder的显示
    getPlaceholder(row) {
      let placeholder
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入' + row.label
      } else if (row.type === 'select' || row.type === 'time' || row.type === 'date') {
        placeholder = '请选择' + row.label
      } else {
        placeholder = row.label
      }
      return placeholder
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
        case 'create': { // 创建
          // 新建用户后跳转画面
          this.filterInfo.createLoading = true
          const rowdata = { status: 1, createBy: this.$store.state.staff.staffId }
          this.$handleAPI('', createApi, rowdata).then(res => {
            this.filterInfo.createLoading = false
            if (Number(res.code) === 200) {
              this.$router.push({ path: './detail', query: { staffId: res.data.id }, replace: true })
            }
          }).catch((error) => {
            this.filterInfo.createLoading = false
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        }
        case 'detail': // 编辑
          // 跳转到详情画面
          this.$router.push({ path: './detail', query: { staffId: data.id }, replace: true })
          break
        case 'delete': { // 删除
          data.deleteLoading = true
          data.updateBy = this.$store.state.staff.staffId
          // 删除选中的行
          data.deleteFlag = 1
          this.$handleAPI(event, deleteApi, data).then(res => {
            data.deleteLoading = false
            if (Number(res.code) === 200) {
              tableInfo.refresh = Math.random()
              // 刷新列表
              this.initList()
            }
          }).catch((error) => {
            data.deleteLoading = false
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        }
        case 'export': {
          // 导出
          this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
          this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
          this.$handleAPI('', getRptListApi, this.filterInfo.query).then(res => {
            if (Number(res.code) === 200) {
              this.handleDownload(res.data)
            } else {
              this.$message.error(res.message)
            }
          }).catch(error => {
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        }
      }
    },
    handleDownload(list) {
      this.downloadLoading = true
      import('@/vendor/Export2ExcelImage').then(excel => {
        const column = [
          { title: '员工ID', key: 'id', type: 'text' },
          { title: '员工编号', key: 'staffNo', type: 'text' },
          { title: '昵称', key: 'nickName', type: 'text' },
          { title: '真实姓名', key: 'staffName', type: 'text' },
          { title: '性别', key: 'genderName', type: 'text' },
          { title: '手机号', key: 'phone', type: 'text' },
          { title: '邮件', key: 'mail', type: 'text' },
          { title: '个性化签名', key: 'profile', type: 'text' },
          { title: '所属省', key: 'provinceName', type: 'text' },
          { title: '所属市', key: 'cityName', type: 'text' },
          { title: '详细地址', key: 'location', type: 'text' },
          { title: '头像', key: 'avatarUrl', type: 'image', width: 100, height: 100 },
          { title: '状态', key: 'statusName', type: 'text' },
          { title: '在线状态', key: 'onlineStatusName', type: 'text' },
          { title: '最近登录时间', key: 'latestLoginTime', type: 'text' },
          { title: '实名认证状态', key: 'verifyFlagName', type: 'text' },
          { title: '员工类型', key: 'staffTypeName', type: 'text' },
          { title: '角色', key: 'roleName', type: 'text' }
        ]
        for (var index in list) {
          if (list[index]['avatarUrl']) {
            list[index]['avatarUrl'] = this.$TH.FILE_URLS.static_url + list[index]['avatarUrl']
          }
        }
        excel.export_table_to_excel_image(column, list, '员工管理')
      })
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            this.$set(item, 'statusLoading', false)
            this.$set(item, 'deleteLoading', false)
            item.updatetime = this.$fn.switchTime(item.updatetime, 'YYYY-MM-DD hh:mm:ss')
          })
          break
      }
    }
  }
}
</script>

<style lang="scss">
</style>
