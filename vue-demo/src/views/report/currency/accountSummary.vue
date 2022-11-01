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
      ref="reportTable"
      v-loading="loading"
      :data="tableData"
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'right'}"
      :max-height="tableHeight"
      style="width: 60%"
    >
      <el-table-column
        prop="reportDate"
        label="统计日期"
      />
      <el-table-column label="账户余额总计">
        <el-table-column
          prop="gold"
          label="金币"
          align="right"
        />
        <el-table-column
          prop="diamond"
          label="钻石"
          align="right"
        />
      </el-table-column>
      <el-table-column label="人均">
        <el-table-column
          prop="avgGold"
          label="金币"
          align="right"
        />
        <el-table-column
          prop="avgDiamond"
          label="钻石"
          align="right"
        />
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getReportCurrencyAccountSummary } from '@/api/report/currency'
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
          reportDate: utils.switchTime(new Date(), 'YYYY-MM-DD')
        },
        list: [
          { type: 'input', label: '统计时间', value: 'reportDate', disabled: true },
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
      this.tableHeight = window.innerHeight - this.$refs.reportTable.$el.offsetTop - 150
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
      this.$initDataPermits('reportCurrencyAccountSummary', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
    },
    // 获取列表
    getList() {
      this.loading = true
      this.$handleAPI('', getReportCurrencyAccountSummary, this.filterInfo.query).then(
        res => {
          if (res.code === 200) {
            const arr = []
            // res.data.avgGold = Number(res.data.avgGold).toFixed(2)
            // res.data.avgDiamond = Number(res.data.avgDiamond).toFixed(2)
            res.data.reportDate = this.filterInfo.query.reportDate
            arr.push(res.data)
            this.tableData = arr
            // 优化导出的格式
            // this.editTable()
          }
          this.loading = false
        }
      )
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'search': // 搜索
          this.getList()
          break
        case 'export':
          this.handleDownload('用户账户总览')
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          break
      }
    },
    handleDownload(excelName) {
      try {
        const $e = this.$refs.reportTable.$el
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
