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
      ref="report-table"
      v-loading="loading"
      element-loading-background="rgba(255, 255, 255, .5)"
      element-loading-text="加载中，请稍后..."
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      :summary-method="getSummaries"
      show-summary
      :max-height="tableHeight"
      style="width: 780px"
      :header-cell-style="{'text-align':'center'}"
    >
      <el-table-column
        prop="summaryDate"
        label="统计日期"
        width="150"
      />
      <el-table-column label="疯狂路赛PK场次">
        <el-table-column
          prop="session1"
          label="用户&用户"
          align="right"
        />
        <el-table-column
          prop="session2"
          label="用户&陪玩"
          align="right"
        />
      </el-table-column>
      <el-table-column
        prop="sessionTotal"
        label="总场次"
        width="150"
        align="right"
      />
      <el-table-column label="疯狂路赛PK胜率（%）">
        <el-table-column
          prop="winRate1"
          label="用户"
          align="right"
        >
          <template slot-scope="{row}">
            {{ row['winRate1'].toFixed(2) || 0.00 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="winRate2"
          label="陪玩"
          align="right"
        >
          <template slot-scope="{row}">
            {{ row['winRate2'].toFixed(2) || 0.00 }}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getReportPkCrazySummary } from '@/api/report/pk'
import PageFilter from '@/components/PageFilter'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  components: {
    PageFilter
  },
  data() {
    return {
      loading: false,
      tableHeight: 300,
      tableData: [],
      // 相关列表
      listTypeInfo: {
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          validDateRange: [new Date(), new Date()],
          DateFrom: new Date(),
          DateTo: new Date()
        },
        list: [
          { type: 'datetimerange', label: '统计时间', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: true }
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
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs['report-table'].$el.offsetTop - 180
    })
    this.initList()
    this.initDataPermits()
    this.initRules()
    this.getList()
  },
  created() {
    // this.getMerchantList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
    },
    // 初始化验证
    initRules() {
      // form验证
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
    },
    // 获取列表
    getList() {
      if (this.filterInfo.query.DateFrom === '' || this.filterInfo.query.DateFrom === null) {
        this.$message({
          showClose: true,
          message: '统计日期不可为空',
          type: 'error',
          duration: 3500
        })
        return
      }
      this.loading = true
      this.$handleAPI('', getReportPkCrazySummary, this.filterInfo.query).then(
        res => {
          if (res.code === 200) {
            this.tableData = res.data
            this.loading = false
          }
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
        if (index === 4 || index === 5) {
          sums[index] = (sums[index] / countRows).toFixed(2)
        }
      })
      return sums
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'search': // 搜索
          this.getList()
          break
        case 'export':
          this.handleDownload('疯狂路赛总览')
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
          data.forEach(item => {
          })
          break
      }
    },
    editTable(e) {
      var current = e.querySelector('.el-table__footer-wrapper').querySelector('.el-table__footer')
      var cell = current.rows[0].cells
      for (var i = 0; i < cell.length; i++) {
        cell[i].rowSpan = 1
      }
    },
    handleDownload(excelName) {
      try {
        const $e = this.$refs['report-table'].$el
        this.editTable($e)
        let $table = $e.querySelector('.el-table__fixed')
        if (!$table) {
          $table = $e
        }
        const wb = XLSX.utils.table_to_book($table, { raw: true })
        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          `${excelName}.xlsx`,
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
