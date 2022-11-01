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
    <el-row>
      <el-col :span="24">
        <el-table
          ref="report-table"
          v-loading="loading"
          element-loading-background="rgba(255, 255, 255, .5)"
          element-loading-text="加载中，请稍后..."
          element-loading-spinner="el-icon-loading"
          :data="tableData"
          show-summary
          :max-height="tableHeight"
          style="width: 870px;margin-bottom: 80px;"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column
            prop="summaryDate"
            label="统计日期"
            width="150"
          />
          <el-table-column label="启程奖励数量">
            <el-table-column
              prop="awardCount2"
              label="已领取"
              align="right"
            />
            <el-table-column
              prop="awardCount1"
              label="未领取"
              align="right"
            />
            <el-table-column
              prop="awardCount3"
              label="已失效"
              align="right"
            />
          </el-table-column>
          <el-table-column label="启程奖励获得人数">
            <el-table-column
              prop="awardManCount2"
              label="已领取"
              align="right"
            />
            <el-table-column
              prop="awardManCount1"
              label="未领取"
              align="right"
            />
            <el-table-column
              prop="awardManCount3"
              label="已失效"
              align="right"
            />
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-button type="primary">奖励翻卡分类</el-button>
        <el-table
          ref="report-table2"
          v-loading="loading2"
          element-loading-background="rgba(255, 255, 255, .5)"
          element-loading-text="加载中，请稍后..."
          element-loading-spinner="el-icon-loading"
          :data="tableData2"
          show-summary
          :max-height="tableHeight2"
          style="width: 540px"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column
            prop="summaryDate"
            label="统计日期"
            width="150"
          />
          <el-table-column
            prop="bonusType"
            label="奖励分类"
            width="150"
          />
          <el-table-column label="翻卡奖励">
            <el-table-column
              prop="awardCount"
              label="奖励数"
              align="right"
            />
            <el-table-column
              prop="awardManCount"
              label="人数"
              align="right"
            />
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getReportTripAwardList1, getReportTripAwardList2 } from '@/api/report/tripAward'
import PageFilter from '@/components/PageFilter'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  components: {
    PageFilter
  },
  data() {
    return {
      tableHeight: 300,
      tableHeight2: 300,
      loading: false,
      loading2: false,
      tableData: [],
      tableData2: [],
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
      this.tableHeight = window.innerHeight - this.$refs['report-table'].$el.offsetTop - 200
      this.tableHeight = window.innerHeight - this.$refs['report-table2'].$el.offsetTop - 200
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
      this.loading = true
      this.loading2 = true
      if (this.filterInfo.query.DateFrom === '' || this.filterInfo.query.DateFrom === null) {
        this.$message({
          showClose: true,
          message: '统计日期不可为空',
          type: 'error',
          duration: 3500
        })
        return
      }
      this.$handleAPI('', getReportTripAwardList1, this.filterInfo.query).then(
        res => {
          if (res.code === 200) {
            this.tableData = res.data
            this.loading = false
          }
        }
      )
      this.$handleAPI('', getReportTripAwardList2, this.filterInfo.query).then(
        res => {
          if (res.code === 200) {
            this.tableData2 = res.data
            this.loading2 = false
          }
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
          this.handleDownload()
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
    handleDownload() {
      try {
        var workbook = XLSX.utils.book_new()
        const $e = this.$refs['report-table'].$el
        this.editTable($e)
        var ws1 = XLSX.utils.table_to_sheet($e)
        XLSX.utils.book_append_sheet(workbook, ws1, '基础数据')
        const $e2 = this.$refs['report-table2'].$el
        this.editTable($e2)
        var ws2 = XLSX.utils.table_to_sheet($e2)
        XLSX.utils.book_append_sheet(workbook, ws2, '奖励翻卡情况')
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'array' })
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          `启程奖励情况总览.xlsx`,
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
