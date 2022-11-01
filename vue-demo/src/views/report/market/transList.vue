<template>
  <div class="app-container transListPage">
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
import { getConfigItemsListApi } from '@/api/common'
import { getReportMarketTransListApi as getListApi } from '@/api/report/market'
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
      checkBoxList: [],
      getListApi,
      // 相关列表
      listTypeInfo: {
        merchantList: [],
        itemTypeList: [],
        statisTypeList: [
          { itemName: '按稀有度', itemValue: '1' },
          { itemName: '按等级区间', itemValue: '2' },
          { itemName: '按性能分区间', itemValue: '3' }
        ],
        rareTypeList: [],
        levelList: [],
        performTypeList: [
          { itemName: '< 10', itemValue: '101' },
          { itemName: '11 ~ 50', itemValue: '102' },
          { itemName: '51 ~ 100', itemValue: '103' },
          { itemName: '101 ~ 150', itemValue: '104' },
          { itemName: '151 ~ 200', itemValue: '105' },
          { itemName: '201 ~ 300', itemValue: '106' },
          { itemName: '301 ~ 400', itemValue: '107' },
          { itemName: '401 ~ 500', itemValue: '108' },
          { itemName: '501 ~ 700', itemValue: '109' },
          { itemName: '701 ~ 900', itemValue: '110' },
          { itemName: '901 ~ 1100', itemValue: '111' },
          { itemName: '1101 ~ 1400', itemValue: '112' },
          { itemName: '1400 +', itemValue: '113' }
        ]
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          reportDate: utils.switchTime(new Date(), 'YYYY-MM-DD'),
          itemType: '',
          itemLevel: '',
          reportType: '',
          rareType: '',
          DateFrom: utils.switchTime(new Date(), 'YYYY-MM-DD'),
          DateTo: utils.switchTime(new Date(), 'YYYY-MM-DD'),
          transType: '',
          performType: '',
          validDateRange: [new Date(), new Date()]
        },
        list: [
          // { type: 'date', label: '统计日期', dateType: 'date', value: 'reportDate' },
          { type: 'datetimerange', label: '统计日期', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
          { type: 'customselect', label: '装备类型', value: 'itemType', list: 'itemTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '统计区分', value: 'reportType', list: 'statisTypeList', key: 'itemValue', name: 'itemName', event: 'change' },
          { type: 'customselect', label: '装备稀有度', value: 'rareType', list: 'rareTypeList', key: 'itemValue', name: 'itemName', show: true },
          { type: 'customselect', label: '装备等级', value: 'itemLevel', list: 'levelList', key: 'itemValue', name: 'itemName', show: true },
          { type: 'customselect', label: '装备性能分区间', value: 'performType', list: 'performTypeList', key: 'itemValue', name: 'itemName', show: true },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '导出', btType: 'success', icon: 'el-icon-download', event: 'export', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        pager: false,
        refresh: 1,
        initCurpage: 1,
        tableIndex: false, // 是否显示序号
        checkBox: false,
        showSummary: true,
        summaryFieldList: ['carTotal', 'carPer', 'partTotal', 'partPer'],
        data: [],
        fieldList: [
          { label: '统计日期', value: 'reportDate' },
          { label: '统计区分', value: 'statisName' },
          { label: '车辆', value: '', labelList: [{ label: '数量', value: 'carTotal', align: 'right' }, { label: '人均', value: 'carPer', align: 'right' }] },
          { label: '配件', value: '', labelList: [{ label: '数量', value: 'partTotal', align: 'right' }, { label: '人均', value: 'partPer', align: 'right' }] }
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
      this.$initDataPermits('transList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.itemTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_RARE_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.rareTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_LEVEL' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.levelList = res.data
        }
      })
      this.filterInfo.query.reportType = '1'
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick(event, data) {
      const tableInfo = this.tableInfo
      const reportType = this.filterInfo.query.reportType
      switch (event) {
        case 'search': // 搜索
          if (reportType === '' || reportType === undefined) {
            this.$message.error('请选择统计区分类型')
            return false
          }
          // 重置分页
          this.checkBoxList = []
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'export': {
          // 多选导出
          const idArr = []
          this.checkBoxList.forEach(item => {
            idArr.push(item.id)
          })
          if (idArr.length === 0) {
            this.$handleAPI('', getListApi, this.filterInfo.query).then(res => {
              if (Number(res.code) === 200) {
                this.handleDownload(res.data)
              }
            })
          } else if (idArr.length > 0) {
            this.handleDownload(this.checkBoxList)
          }
          break
        }
      }
    },
    handleDownload(list) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        var merges = ['A1:A2', 'B1:B2', 'C1:C2', 'D1:E1', 'F1:G1']
        const multiHeader = [['统计日期', '交易类别', '统计区分', '车辆', '', '配件', '']]
        const tHeader = ['', '', '', '数量', '人均', '数量', '人均']
        var filterVal = ['reportDate', 'transTypeName', 'statisName', 'carTotal', 'carPer', 'partTotal', 'partPer']
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          merges,
          data,
          filename: '交易所交易报表' + new Date().getTime(),
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
        case 'change': { // 选择
          console.log(this.filterInfo.query.reportType)
          break
        }
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
          this.checkBoxList = data
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
.transListPage {
  .el-table {
    height: auto !important;
  }
}
</style>
