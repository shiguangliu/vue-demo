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
          style="width: 1380px;margin-bottom: 50px;"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column
            prop="summaryDate"
            label="统计日期"
            width="150"
          />
          <el-table-column
            prop="cupName"
            label="官方联赛"
            width="150"
          />
          <el-table-column label="报名参赛情况">
            <el-table-column
              prop="joinCount"
              label="报名人数"
              align="right"
            />
            <el-table-column
              prop="pkCount"
              label="参赛人数"
              align="right"
            />
            <el-table-column
              prop="joinFee"
              label="报名费收入"
              align="right"
            />
          </el-table-column>
          <el-table-column label="获得奖励数量">
            <el-table-column
              prop="goldSum"
              label="金币"
              align="right"
            />
            <el-table-column
              prop="diamondSum"
              label="钻石"
              align="right"
            />
            <el-table-column
              prop="eqipmentSum"
              label="车辆、配件"
              align="right"
            />
          </el-table-column>
          <el-table-column label="获得奖励人数">
            <el-table-column
              prop="goldManSum"
              label="金币"
              align="right"
            />
            <el-table-column
              prop="diamondManSum"
              label="钻石"
              align="right"
            />
            <el-table-column
              prop="eqipmentManSum"
              label="车辆、配件"
              align="right"
            />
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-button type="primary">地区占比</el-button>
        <el-table
          ref="report-table2"
          v-loading="loading2"
          element-loading-background="rgba(255, 255, 255, .5)"
          element-loading-text="加载中，请稍后..."
          element-loading-spinner="el-icon-loading"
          :data="tableData2"
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
            prop="area"
            label="地区"
            width="150"
          />
          <el-table-column label="报名">
            <el-table-column
              prop="total"
              label="人数"
              align="right"
            />
            <el-table-column
              prop="rate"
              label="占比(%)"
              align="right"
            >
              <template slot-scope="{row}">
                {{ row['rate'].toFixed(2) || 0.00 }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-button type="primary">性别占比</el-button>
        <el-table
          ref="report-table3"
          v-loading="loading3"
          element-loading-background="rgba(255, 255, 255, .5)"
          element-loading-text="加载中，请稍后..."
          element-loading-spinner="el-icon-loading"
          :data="tableData3"
          :max-height="tableHeight3"
          style="width: 540px"
          :header-cell-style="{'text-align':'center'}"
        >
          <el-table-column
            prop="summaryDate"
            label="统计日期"
            width="150"
          />
          <el-table-column
            prop="gender"
            label="性别"
            width="150"
          />
          <el-table-column label="报名">
            <el-table-column
              prop="total"
              label="人数"
              align="right"
            />
            <el-table-column
              prop="rate"
              label="占比(%)"
              align="right"
            >
              <template slot-scope="{row}">
                {{ row['rate'].toFixed(2) || 0.00 }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getReportPkCupSummary1, getReportPkCupSummary2, getReportPkCupSummary3, getRaceCupList } from '@/api/report/pk'
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
      tableHeight3: 300,
      loading: false,
      loading2: false,
      loading3: false,
      tableData: [],
      tableData2: [],
      tableData3: [],
      // 相关列表
      listTypeInfo: {
        cupList: [] // 联赛列表
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          cupId: '',
          reportDate: new Date()
        },
        list: [
          { type: 'date', label: '统计日期', value: 'reportDate' },
          { type: 'customselect', label: '官方联赛', value: 'cupId', list: 'cupList', key: 'id', name: 'cupTitle' },
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
      this.tableHeight = window.innerHeight - this.$refs['report-table3'].$el.offsetTop - 200
    })
    this.initList()
    this.initDataPermits()
    this.initRules()
    this.getList()
  },
  created() {
    this.getCupList()
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
    getCupList() {
      const params = { }
      this.$handleAPI('', getRaceCupList, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.cupList = res.data
        }
      })
    },
    // 获取列表
    getList() {
      if (this.filterInfo.query.reportDate === '' || this.filterInfo.query.reportDate === null) {
        this.$message({
          showClose: true,
          message: '统计日期不可为空',
          type: 'error',
          duration: 3500
        })
        return
      }
      this.loading = true
      this.loading2 = true
      this.loading3 = true
      this.$handleAPI('', getReportPkCupSummary1, this.filterInfo.query).then(
        res => {
          if (res.code === 200) {
            this.tableData = res.data
            this.loading = false
          }
        }
      )
      this.$handleAPI('', getReportPkCupSummary3, this.filterInfo.query).then(
        res => {
          if (res.code === 200) {
            this.tableData3 = res.data
            this.loading3 = false
          }
        }
      )
      this.$handleAPI('', getReportPkCupSummary2, this.filterInfo.query).then(
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
        // this.editTable($e2)
        var ws2 = XLSX.utils.table_to_sheet($e2)
        XLSX.utils.book_append_sheet(workbook, ws2, '地区占比')
        const $e3 = this.$refs['report-table3'].$el
        // this.editTable($e3)
        var ws3 = XLSX.utils.table_to_sheet($e3)
        XLSX.utils.book_append_sheet(workbook, ws3, '性别占比')
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'array' })
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          `官方联赛总览.xlsx`,
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
