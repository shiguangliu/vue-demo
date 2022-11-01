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
      ref="table-transWithRobot"
      v-loading="loading"
      :data="tableData"
      :summary-method="getSummaries"
      :header-cell-style="{'text-align':'center'}"
      :max-height="tableHeight"
      show-summary
      style="width: 100%"
    >
      <el-table-column
        prop="reportDate"
        label="统计日期"
      />
      <el-table-column
        prop="jobName"
        label="模块"
        width="220"
      />
      <el-table-column label="获得金币">
        <el-table-column
          prop="setGold"
          label="金币"
          align="right"
        />
        <el-table-column
          prop="setGoldPerson"
          label="人数"
          align="right"
        />
        <el-table-column
          prop="setGoldAvg"
          label="人均"
          align="right"
        />
      </el-table-column>
      <el-table-column label="消耗金币">
        <el-table-column
          prop="getGold"
          label="金币"
          align="right"
        />
        <el-table-column
          prop="getGoldPerson"
          label="人数"
          align="right"
        />
        <el-table-column
          prop="getGoldAvg"
          label="人均"
          align="right"
        />
      </el-table-column>
      <el-table-column label="获得钻石">
        <el-table-column
          prop="setDiamond"
          label="钻石"
          align="right"
        />
        <el-table-column
          prop="setDiamondPerson"
          label="人数"
          align="right"
        />
        <el-table-column
          prop="setDiamondAvg"
          label="人均"
          align="right"
        />
      </el-table-column>
      <el-table-column label="消耗钻石">
        <el-table-column
          prop="getDiamond"
          label="钻石"
          align="right"
        />
        <el-table-column
          prop="getDiamondPerson"
          label="人数"
          align="right"
        />
        <el-table-column
          prop="getDiamondAvg"
          label="人均"
          align="right"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getReportCurrencyTransWithRobot } from '@/api/report/currency'
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
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          validDateRange: [new Date(), new Date()],
          DateFrom: utils.switchTime(new Date(), 'YYYY-MM-DD'),
          DateTo: utils.switchTime(new Date(), 'YYYY-MM-DD')
        },
        list: [
          { type: 'datetimerange', label: '统计时间', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
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
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs['table-transWithRobot'].$el.offsetTop - 150
    })
    this.initList()
    this.initDataPermits()
    this.initRules()
    this.getList()
  },
  created() {
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('reportCurrencyTransWithRobot', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
    },
    // 获取列表
    getList() {
      this.loading = true
      this.$handleAPI('', getReportCurrencyTransWithRobot, this.filterInfo.query).then(
        res => {
          if (res.code === 200) {
            this.tableData = res.data.currencyTransWithRobotList
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
        if (index === 4 || index === 7 || index === 10 || index === 13) {
          if (sums[index - 2] > 0) {
            sums[index] = (sums[index - 2] / sums[index - 1]).toFixed(2)
          } else {
            sums[index] = 0
          }
        }
      })
      return sums
    },
    editTable() {
      var current = this.$refs['table-transWithRobot'].$el
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
          this.handleDownload('用户与马甲、陪玩间货币流通总览')
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
        const $e = this.$refs['table-transWithRobot'].$el
        let $table = $e.querySelector('.el-table__fixed')
        if (!$table) {
          $table = $e
        }
        const wb = XLSX.utils.table_to_book($table, { raw: true })
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
