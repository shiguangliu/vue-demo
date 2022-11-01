<template>
  <div class="app-container inviteListPage">
    <!-- 条件栏 -->
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :lg="16">
        <!-- 好友邀请的明细列表表格 -->
        <el-button type="primary">邀请明细</el-button>
        <page-table
          :table-index="detailTableInfo.tableIndex"
          :check-box="detailTableInfo.checkBox"
          :show-summary="detailTableInfo.showSummary"
          :summary-field-list="detailTableInfo.summaryFieldList"
          :refresh="detailTableInfo.refresh"
          :init-curpage="detailTableInfo.initCurpage"
          :data.sync="detailTableInfo.data"
          :api="getList1Api"
          :query="filterInfo.query"
          :field-list="detailTableInfo.fieldList"
          :list-type-info="listTypeInfo"
          :handle="detailTableInfo.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <template v-slot:col-validDate="scope">
            <p v-if="scope.row.validFrom != null || scope.row.validTo != null">{{ scope.row.validFrom + '-' + scope.row.validTo }}</p>
          </template>
        </page-table>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <!-- 邀请汇总情况 -->
        <el-button type="primary">邀请汇总情况</el-button>
        <page-table
          :pager="totalTableInfo.pager"
          :table-index="totalTableInfo.tableIndex"
          :check-box="totalTableInfo.checkBox"
          :show-summary="totalTableInfo.showSummary"
          :summary-field-list="totalTableInfo.summaryFieldList"
          :refresh="totalTableInfo.refresh"
          :init-curpage="totalTableInfo.initCurpage"
          :data.sync="totalTableInfo.data"
          :api="getList2Api"
          :query="filterInfo.query"
          :field-list="totalTableInfo.fieldList"
          :list-type-info="listTypeInfo"
          :handle="totalTableInfo.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <template v-slot:col-validDate="scope">
            <p v-if="scope.row.validFrom != null || scope.row.validTo != null">{{ scope.row.validFrom + '-' + scope.row.validTo }}</p>
          </template>
        </page-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { getConfigItemsListApi } from '@/api/common'
import { getReportInviteListApi as getList1Api, getReportInviteSummaryApi as getList2Api } from '@/api/report/invite'
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
      detailCheckBoxList: [],
      totalCheckBoxList: [],
      getList1Api,
      getList2Api,
      // 相关列表
      listTypeInfo: {},
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          reportDate: utils.switchTime(new Date(), 'YYYY-MM-DD'),
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
      detailTableInfo: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: false, // 是否显示序号
        checkBox: false,
        showSummary: true,
        summaryFieldList: [{ colIndex: 8, colName: 'goldTotal' }],
        data: [],
        fieldList: [
          { label: '统计日期', value: 'reportDate' },
          { label: '邀请人账户', value: 'userId' },
          { label: '邀请时间', value: 'chainTime', width: '150' },
          { label: '被邀请人账户', value: 'invitedUserId' },
          { label: '所在地区', value: 'location' },
          { label: '注册时间', value: 'registerTime', width: '150' },
          { label: '是否为好友', value: 'friendFlagName' },
          { label: '邀请来源', value: 'sourceName' },
          { label: '邀请奖励', value: 'gold', align: 'right' }
        ]
      },
      // 表格相关（检索结果）
      totalTableInfo: {
        pager: false,
        refresh: 1,
        initCurpage: 1,
        tableIndex: false, // 是否显示序号
        checkBox: false,
        showSummary: true,
        summaryFieldList: ['inviteTotal', 'invitedTotal', 'goldTotal'],
        data: [],
        fieldList: [
          { label: '统计日期', value: 'reportDate' },
          { label: '邀请人数', value: 'inviteTotal', align: 'right' },
          { label: '被邀请人数', value: 'invitedTotal', align: 'right' },
          { label: '邀请奖励金币', value: 'goldTotal', align: 'right' }
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
      this.$initDataPermits('inviteList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
    },
    // 获取列表
    getList() {
      this.detailTableInfo.refresh = Math.random()
      this.totalTableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          this.filterInfo.query.export = 0
          this.detailCheckBoxList = []
          this.totalCheckBoxList = []
          this.detailTableInfo.initCurpage = 1 // 重新回第1页
          this.detailTableInfo.refresh = Math.random()
          this.totalTableInfo.initCurpage = 1 // 重新回第1页
          this.totalTableInfo.refresh = Math.random()
          break
        case 'export': {
          // 多选导出
          const idArr = []
          this.detailCheckBoxList.forEach(item => {
            idArr.push(item.id)
          })
          const totalArr = []
          this.totalCheckBoxList.forEach(item => {
            totalArr.push(item.id)
          })
          if (idArr.length === 0 || totalArr.length === 0) {
            const listArr = []
            const exportQuery = this.filterInfo.query
            exportQuery.export = 1
            const reqArr = [getList1Api(exportQuery), getList2Api(this.filterInfo.query)]
            Promise.all(reqArr).then(res => {
              let codeSum = 0
              for (const item of res) {
                codeSum += Number(item.code)
              }
              if (codeSum % 200 !== 0) {
                this.$message.success('获取失败')
              }
              listArr[0] = res[0].data.list
              listArr[1] = res[1].data
              this.handleDownload(listArr)
              this.filterInfo.query.export = 0
            }).catch(error => {
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
            })
          } else if (idArr.length > 0) {
            // 第一张表+第二张表
            this.handleDownload([this.detailCheckBoxList, this.totalCheckBoxList])
          }
          break
        }
      }
    },
    handleDownload(listArr) {
      // 组织sheet
      var tHeader1 = []
      var filterVal1 = []
      for (const item1 in this.detailTableInfo.fieldList) {
        tHeader1[item1] = this.detailTableInfo.fieldList[item1].label
        filterVal1[item1] = this.detailTableInfo.fieldList[item1].value
      }
      const detailData = this.formatJson(filterVal1, listArr[0])
      // 组织sheet
      var tHeader2 = []
      var filterVal2 = []
      for (const item2 in this.totalTableInfo.fieldList) {
        tHeader2[item2] = this.totalTableInfo.fieldList[item2].label
        filterVal2[item2] = this.totalTableInfo.fieldList[item2].value
      }
      const totalData = this.formatJson(filterVal2, listArr[1])
      const result = []
      result.push({
        sheetTitle: '邀请注册明细', th: tHeader1, data: detailData
      })
      result.push({
        sheetTitle: '邀请汇总', th: tHeader2, data: totalData
      })
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel_multisheet(result, '邀请注册报表' + new Date().getTime())
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
          this.detailCheckBoxList = data
          this.totalCheckBoxList = data
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
.inviteListPage {
  .el-table {
    height: auto !important;
    thead th {
      background: #F5F7FA;
    }
  }
}
</style>
