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
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <template v-slot:col-content="scope">
        <p>{{ scope.row.content | cutContent }}</p>
      </template>
      <template v-slot:col-linkUrl="scope">
        <el-link type="success" :href="scope.row.linkUrl" target="_blank">{{ scope.row.linkUrl }}</el-link>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi } from '@/api/common'
import { getListApi, createApi, getRptListApi } from '@/api/sysnotice'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageFilter,
    PageTable
  },
  filters: {
    cutContent: function(value) {
      return value.slice(0, 50) + (value.length > 30 ? '...' : '')
    }
  },
  data() {
    return {
      getListApi,
      createApi,
      // 相关列表
      listTypeInfo: {
        pushFlagList: [],
        statusList: [], // 状态列表
        noticeTypeList: [] // 类型
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          noticeType: '',
          title: '',
          content: '',
          status: ''
        },
        list: [
          { type: 'customselect', label: '通知类型', key: 'itemValue', name: 'itemName', value: 'noticeType', list: 'noticeTypeList' },
          { type: 'input', label: '通知标题', value: 'title' },
          { type: 'input', label: '通知内容', value: 'content' },
          { type: 'customselect', label: '状态', key: 'itemValue', name: 'itemName', value: 'status', list: 'statusList' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-edit', event: 'create', show: true },
          { type: 'button', label: '导出', btType: 'success', icon: 'el-icon-download', event: 'export', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: false, // 是否显示序号
        data: [],
        fieldList: [
          { label: 'ID', value: 'id' },
          { label: '类型', value: 'noticeTypeName' },
          { label: '发布人', value: 'staffName' },
          { label: '通知标题', value: 'title' },
          { label: '通知内容', value: 'content', type: 'slot', width: 280 },
          { label: '跳转链接', value: 'linkUrl', type: 'slot', width: 280 },
          { label: '推送标志', value: 'pushFlagName', width: 80 },
          { label: '推送时间', value: 'pushTime', width: 160 },
          { label: '状态', value: 'statusName', width: 80 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '120',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['theme', 'dataPermits', 'staffId']),
    nopicture() {
      return (
        'this.src="' +
        this.$TH.FILE_URLS.publicPath +
        defaultImage +
        '";this.onerror = null;'
      )
    }
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
      this.$initDataPermits('sysNoticeList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('sysNoticeList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'APPROVE_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PUSH_FLAG' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.pushFlagList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'NOTICE_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.noticeTypeList = res.data
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
      } else if (
        row.type === 'select' ||
        row.type === 'time' ||
        row.type === 'date'
      ) {
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
        case 'export': // 导出
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
        case 'create': {
          this.$handleAPI('', createApi, { createBy: this.staffId, updateBy: this.staffId })
            .then(res => {
              if (Number(res.code) === 200) {
                this.$router.push({
                  path: './detail',
                  query: { noticeId: res.data.id, status: res.data.status },
                  replace: true
                })
              } else {
                this.$message({
                  showClose: true,
                  message: res.error,
                  type: 'error',
                  duration: 3500
                })
              }
            })
            .catch(error => {
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
            })
          break
        }
        case 'detail': // 详情
          this.$router.push({
            path: './detail',
            query: { noticeId: data.id, status: data.status },
            replace: true
          })
          break
      }
    },
    handleDownload(list) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const column = [
          { label: '通知ID', value: 'id' },
          { label: '通知类型', value: 'noticeTypeName' },
          { label: '通知时间', value: 'noticeTime' },
          { label: '通知标题', value: 'title' },
          { label: '通知内容', value: 'content' },
          { label: '跳转链接', value: 'linkUrl' },
          { label: '推送平台', value: 'pushToApp' },
          { label: '推送标志', value: 'pushFlagName' },
          { label: '发布人', value: 'staffName' },
          { label: '状态', value: 'statusName' }
        ]
        var tHeader = []
        var filterVal = []
        for (var item in column) {
          tHeader[item] = column[item].label
          filterVal[item] = column[item].value
        }
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '推送管理' + new Date().getTime(),
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return v[j]
          } else {
            return v[j]
          }
        })
      )
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            this.$set(item, 'statusLoading', false)
            this.$set(item, 'deleteLoading', false)
            item.updatetime = this.$fn.switchTime(
              item.updatetime,
              'YYYY-MM-DD hh:mm:ss'
            )
          })
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.slot-avatar {
  height: 40px;
  display: flex;
  align-items: center;
  img {
    padding-right: 10px;
  }
}
</style>
