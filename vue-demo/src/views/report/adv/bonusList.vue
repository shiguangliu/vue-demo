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
    <el-row>
      <el-col :span="13">
        <!-- 表格 -->
        <el-table
          ref="report-table"
          :data="tableData"
          :header-cell-style="{'text-align':'center'}"
          style="width: 100%"
        >
          <el-table-column
            prop="reportDate"
            label="统计日期"
            align="center"
          />
          <el-table-column label="领取人数" align="center">
            <el-table-column
              prop="newlyAdded"
              label="新增"
              align="right"
            />
            <el-table-column
              prop="cumulative"
              label="累计"
              align="right"
            />
          </el-table-column>
          <el-table-column label="红包金币数量" align="center">
            <el-table-column
              prop="totalNumber"
              label="总计"
              align="right"
            />
            <el-table-column
              prop="averageNumber"
              label="人均"
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
import { getReportAdvBonusList } from '@/api/report/adv'
import PageFilter from '@/components/PageFilter'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  components: {
    PageFilter
  },
  data() {
    return {
      tableData: [],
      // 相关列表
      listTypeInfo: {
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          reportDate: null
        },
        list: [
          { type: 'date', label: '统计时间', dateType: 'date', value: 'reportDate' },
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
      if (this.filterInfo.query.reportDate === null) {
        this.filterInfo.query.reportDate = new Date()
      }
      this.$handleAPI('', getReportAdvBonusList, this.filterInfo.query).then(res => {
        if (res.code === 200) {
          this.tableData = []
          this.tableData.push(res.data)
        }
      })
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'search': // 搜索
          this.$handleAPI('', getReportAdvBonusList, this.filterInfo.query).then(res => {
            if (res.code === 200) {
              this.tableData = []
              this.tableData.push(res.data)
            }
          })
          break
        case 'export':
          this.handleDownload('霸屏红包领取统计')
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          // data.forEach(item => {
          // })
          break
      }
    },
    handleDownload(excelName) {
      try {
        const $e = this.$refs['report-table'].$el
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
<style scoped lang="scss">
  .app-container {
    align-items: center;
  }
</style>
