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
      border
      :header-cell-style="{'text-align':'center'}"
      :cell-style="{'text-align':'right'}"
      style="width: 750px;"
    >
      <el-table-column
        prop="reportDate"
        label="截止日前"
        width="100"
      />
      <el-table-column
        label="新手阶段"
        prop="newPeriodNum"
      />
      <el-table-column
        label="成长阶段"
        prop="growPeriodNum"
      />
      <el-table-column
        label="休眠阶段"
        prop="sleepPeriodNum"
      />
      <el-table-column
        label="流失阶段"
        prop="losePeriodNum"
      />
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getReportUserLifeCycleApi } from '@/api/report/lifecycle'
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
          reportDate: utils.switchTime(new Date(), 'YYYY-MM-DD')
        },
        list: [
          { type: 'date', label: '统计时间', dateType: 'date', value: 'reportDate' },
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
      this.tableHeight = window.innerHeight - this.$refs.reportTable.$el.offsetTop - 440
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
      this.$initDataPermits('reportUserLifeCycle', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      console.log('initList')
    },
    // 获取列表
    getList() {
      this.loading = true
      this.$handleAPI('', getReportUserLifeCycleApi, this.filterInfo.query).then(
        res => {
          if (res.code === 200) {
            const arr = []
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
          this.handleDownload('用户生命周期统计')
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
        const $e = this.$refs['reportTable'].$el
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
    }
  }
}
</script>
