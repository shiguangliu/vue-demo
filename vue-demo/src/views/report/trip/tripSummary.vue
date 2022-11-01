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
    <el-table
      ref="table-tripSummary"
      v-loading="loading"
      :data="tableData.tripPartitionList"
      :summary-method="getSummaries"
      :header-cell-style="{'text-align':'center'}"
      :max-height="tableHeight"
      show-summary
      style="width: 500px;"
    >
      <el-table-column
        prop="reportDate"
        label="统计日期"
        width="100"
      />
      <el-table-column
        prop="distance"
        label="里程分类"
        width="150"
      />
      <el-table-column label="启程">
        <el-table-column
          prop="tripNum"
          label="次数"
          align="right"
        />
        <el-table-column
          prop="personNum"
          label="人数"
          align="right"
          class-name="person-num"
        />
      </el-table-column>
    </el-table>
    <br>
    <el-button type="primary">行程距离情况</el-button>
    <el-table
      ref="table-tripSummaryForDistance"
      v-loading="loading"
      :data="tableData.tripSummaryList"
      :header-cell-style="{'text-align':'center'}"
      style="width: 750px;"
    >
      <el-table-column
        prop="reportDate"
        label="截止日前"
        width="100"
      />
      <el-table-column label="单次行程距离（KM）">
        <el-table-column
          prop="maxDistance"
          label="最长"
          align="right"
        />
        <el-table-column
          prop="avgDistance"
          label="人均"
          align="right"
        />
      </el-table-column>
      <el-table-column label="单日行程距离（KM）">
        <el-table-column
          prop="maxDistanceDay"
          label="最长"
          align="right"
        />
        <el-table-column
          prop="avgDistanceDay"
          label="人均"
          align="right"
        />
      </el-table-column>
      <el-table-column label="总行程距离（KM）">
        <el-table-column
          prop="distanceTotal"
          label="最长"
          align="right"
        />
        <el-table-column
          prop="avgDistanceTotal"
          label="人均"
          align="right"
        />
      </el-table-column>
    </el-table>
    <br>
    <el-button type="primary">行程时长情况</el-button>
    <el-table
      ref="table-tripSummaryForHours"
      v-loading="loading"
      :data="tableData.tripSummaryList"
      :header-cell-style="{'text-align':'center'}"
      style="width: 850px;"
    >
      <el-table-column
        prop="reportDate"
        label="截止日前"
        width="100"
      />
      <el-table-column label="单次行程时长（小时）">
        <el-table-column
          prop="maxHours"
          label="最长"
          align="right"
        />
        <el-table-column
          prop="minHours"
          label="最短"
          align="right"
        />
        <el-table-column
          prop="avgHours"
          label="人均"
          align="right"
        />
      </el-table-column>
      <el-table-column label="单日行程时长（小时）">
        <el-table-column
          prop="maxHoursDay"
          label="最长"
          align="right"
        />
        <el-table-column
          prop="minHoursDay"
          label="最短"
          align="right"
        />
        <el-table-column
          prop="avgHoursDay"
          label="人均"
          align="right"
        />
      </el-table-column>
      <el-table-column label="总行程时长（小时）">
        <el-table-column
          prop="hoursTotal"
          label="累计"
          align="right"
        />
        <el-table-column
          prop="avgHoursTotal"
          label="人均"
          align="right"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getReportTripSummary } from '@/api/report/trip'
import PageFilter from '@/components/PageFilter'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import utils from '@/common/js/utils'

export default {
  components: {
    PageFilter
  },
  data() {
    return {
      tableData: [],
      tableHeight: 300,
      loading: false,
      listTypeInfo: {
        mileageTypeList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          validDateRange: [new Date(), new Date()],
          DateFrom: utils.switchTime(new Date(), 'YYYY-MM-DD'),
          DateTo: utils.switchTime(new Date(), 'YYYY-MM-DD'),
          mileageType: ''
        },
        list: [
          { type: 'datetimerange', label: '统计时间', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
          { type: 'customselect', label: '里程分类', value: 'mileageType', list: 'mileageTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: false }
        ]
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
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs['table-tripSummary'].$el.offsetTop - 440
    })
  },
  created() {
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('reportTripSummary', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      this.listTypeInfo.mileageTypeList = []
      this.listTypeInfo.mileageTypeList.push({ itemValue: 1, itemName: '[1，10]' })
      this.listTypeInfo.mileageTypeList.push({ itemValue: 2, itemName: '(10，20]' })
      this.listTypeInfo.mileageTypeList.push({ itemValue: 3, itemName: '(20，30]' })
      this.listTypeInfo.mileageTypeList.push({ itemValue: 4, itemName: '(30，50]' })
      this.listTypeInfo.mileageTypeList.push({ itemValue: 5, itemName: '(50，+∞]' })
    },
    // 获取列表
    getList() {
      this.loading = true
      this.$handleAPI('', getReportTripSummary, this.filterInfo.query).then(
        res => {
          if (res.code === 200) {
            this.tableData = res.data
            // 优化导出的格式
            this.editTable()
          }
          this.loading = false
        }
      )
    },
    // 自定义合计算法
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 1) {
          sums[index] = ''
          return
        }
        const values = data.map(item => item[column.property])
        var countRows = 0
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr)// 将values中的每个值转换为number类型
          if (!isNaN(value)) {
            countRows = countRows + 1
            return prev + value
          } else {
            return prev
          }
        }, 0)
      })
      return sums
    },
    editTable() {
      var current = this.$refs['table-tripSummary'].$el
        .querySelector('.el-table__footer-wrapper')
        .querySelector('.el-table__footer')
      var cell = current.rows[0].cells
      cell[0].rowSpan = 1
      cell[1].rowSpan = 1
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'search': // 搜索
          this.getList()
          break
        case 'export':
          this.handleDownload('启程使用情况')
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'pickDate': // 选择日期范围
          if (data) {
            this.filterInfo.query.DateFrom = data[0]
            this.filterInfo.query.DateTo = data[1]
          } else {
            this.filterInfo.query.DateFrom = ''
            this.filterInfo.query.DateTo = ''
          }
          break
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          break
      }
    },
    handleDownload(excelName) {
      try {
        const $e = this.$refs['table-tripSummary'].$el
        const $e2 = this.$refs['table-tripSummaryForDistance'].$el
        const $e3 = this.$refs['table-tripSummaryForHours'].$el
        let $table = $e.querySelector('.el-table__fixed')
        let $table2 = $e2.querySelector('.el-table__fixed')
        let $table3 = $e3.querySelector('.el-table__fixed')
        if (!$table) {
          $table = $e
        }
        if (!$table2) {
          $table2 = $e2
        }
        if (!$table3) {
          $table3 = $e3
        }
        // 创建一个空的工作区间
        const wb = XLSX.utils.book_new()
        // 创建sheet
        const sheet1 = XLSX.utils.table_to_sheet($table, { raw: true })
        const sheet2 = XLSX.utils.table_to_sheet($table2, { raw: true })
        const sheet3 = XLSX.utils.table_to_sheet($table3, { raw: true })
        // 追加sheet
        XLSX.utils.book_append_sheet(wb, sheet1, '启程使用情况')
        XLSX.utils.book_append_sheet(wb, sheet2, '行程距离情况')
        XLSX.utils.book_append_sheet(wb, sheet3, '行程时长情况')
        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }), `${excelName}.xlsx`,
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.error(e)
      }
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
    }
  }
}
</script>
<style scoped lang="scss">
  .person-num {
    padding-right: 10px;
  }
</style>
