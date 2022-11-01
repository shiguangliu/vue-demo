<template>
  <div class="app-container topListPage">
    <!-- 条件栏 -->
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <!-- 邀请汇总情况 -->
    <page-table
      :pager="tableInfo.pager"
      :table-index="tableInfo.tableIndex"
      :check-box="tableInfo.checkBox"
      :show-summary="tableInfo.showSummary"
      :summary-field-list="tableInfo.summaryFieldList"
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
      <template v-slot:col-validDate="scope">
        <p v-if="scope.row.validFrom != null || scope.row.validTo != null">{{ scope.row.validFrom + '-' + scope.row.validTo }}</p>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { getConfigItemsListApi } from '@/api/common'
import { getReportInviteTopListApi as getListApi } from '@/api/report/invite'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import utils from '@/common/js/utils'
export default {
  components: {
    PageFilter,
    PageTable
  },
  filters: {
  },
  data() {
    return {
      getListApi,
      // 相关列表
      listTypeInfo: {},
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          // reportDate: utils.switchTime(new Date(), 'YYYY-MM-DD'),
          validDateRange: [new Date(), new Date()],
          DateFrom: utils.switchTime(new Date(), 'YYYY-MM-DD'),
          DateTo: utils.switchTime(new Date(), 'YYYY-MM-DD')
        },
        list: [
          // { type: 'date', label: '统计日期', dateType: 'date', value: 'reportDate' },
          { type: 'datetimerange', label: '检索日期', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '导出', btType: 'success', icon: 'el-icon-download', event: 'export', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        paget: false,
        refresh: 1,
        initCurpage: 1,
        tableIndex: false, // 是否显示序号
        checkBox: false,
        showSummary: true,
        summaryFieldList: ['inviteTotal', 'goldTotal'],
        data: [],
        fieldList: [
          { label: '排名', value: 'sort' },
          { label: '邀请人账户', value: 'refereeId' },
          { label: '累计邀请注册', value: 'inviteTotal', align: 'right' },
          { label: '累计获得奖励（金币）', value: 'goldTotal', align: 'right' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['theme', 'dataPermits', 'staffId'])
  },
  watch: {
  },
  created() {
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
      this.$initDataPermits('topList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          this.tableInfo.initCurpage = 1 // 重新回第1页
          this.tableInfo.refresh = Math.random()
          break
        case 'export': {
          // 多选导出
          this.$handleAPI('', getListApi, this.filterInfo.query).then(res => {
            if (Number(res.code) === 200) {
              this.handleDownload(res.data)
            }
          })
          break
        }
      }
    },
    handleDownload(list) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        var tHeader = []
        var filterVal = []
        for (var item in this.tableInfo.fieldList) {
          tHeader[item] = this.tableInfo.fieldList[item].label
          filterVal[item] = this.tableInfo.fieldList[item].value
        }
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '邀请注册排名报表' + new Date().getTime(),
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
        case 'tableCheck': { // 选择
          // 根据data字段区分赋值
          // this.checkBoxList = data
          break
        }
        case 'pickDate': // 选择日期范围
          if (data) {
            this.filterInfo.query.DateFrom = utils.switchTime(data[0], 'YYYY-MM-DD')
            this.filterInfo.query.DateTo = utils.switchTime(data[1], 'YYYY-MM-DD')
          } else {
            this.filterInfo.query.DateFrom = ''
            this.filterInfo.query.DateTo = ''
          }
          break
      }
    }
  }
}
</script>

<style lang="scss">
.topListPage {
  .el-table {
    height: auto !important;
    width: 60% !important;
    thead th {
      background: #F5F7FA;
    }
  }
}
</style>
