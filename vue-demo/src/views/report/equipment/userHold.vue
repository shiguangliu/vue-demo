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
      :summary-method="getSummaries"
      :header-cell-style="{'text-align':'center'}"
      :max-height="tableHeight"
      show-summary
      style="width: 70%"
    >
      <el-table-column
        prop="reportDate"
        label="统计日期"
        align="right"
      />
      <el-table-column
        prop="reportType"
        label="统计区分"
        align="left"
        width="150"
      />
      <el-table-column label="车辆">
        <el-table-column
          prop="carLoadedNum"
          label="已装备数"
          align="right"
        />
        <el-table-column
          prop="carUnloadedNum"
          label="未装备数"
          align="right"
        />
        <el-table-column
          prop="carTotalNum"
          label="总数"
          align="right"
        />
        <el-table-column
          prop="carAvgNum"
          label="人均"
          align="right"
        />
      </el-table-column>
      <el-table-column label="配件">
        <el-table-column
          prop="partLoadedNum"
          label="已装备数"
          align="right"
        />
        <el-table-column
          prop="partUnloadedNum"
          label="未装备数"
          align="right"
        />
        <el-table-column
          prop="partTotalNum"
          label="总数"
          align="right"
        />
        <el-table-column
          prop="partAvgNum"
          label="人均"
          align="right"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getReportEquipmentUserHold } from '@/api/report/equipment'
import { getConfigItemsListApi } from '@/api/common'
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
      result: '',
      tableHeight: 300,
      loading: false,
      listTypeInfo: {
        equipTypeList: [
          { itemValue: '1', itemName: '车辆' }, { itemValue: '2', itemName: '配件' }
        ],
        rareTypeList: [],
        itemLevelList: [],
        performanceRangeList: [],
        reportTypeList: [
          { itemValue: 'rare_type', itemName: '装备稀有度' }, { itemValue: 'performance', itemName: '装备性能分区间' }, { itemValue: 'item_level', itemName: '装备等级' }
        ]
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          reportType: 'rare_type',
          reportDate: utils.switchTime(new Date(), 'YYYY-MM-DD'),
          equipType: '',
          rareType: '',
          itemLevel: '',
          performance: '',
          performanceRangeStart: '',
          performanceRangeEnd: '',
          pageNum: 1,
          pageSize: 50
        },
        list: [
          { type: 'input', label: '统计时间', value: 'reportDate', disabled: true },
          { type: 'customselect', label: '统计区分', value: 'reportType', list: 'reportTypeList', key: 'itemValue', name: 'itemName', clearable: false },
          { type: 'customselect', label: '装备类型', value: 'equipType', list: 'equipTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '装备稀有度', value: 'rareType', list: 'rareTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '装备等级', value: 'itemLevel', list: 'itemLevelList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '装备性能分区间', value: 'performance', list: 'performanceRangeList', key: 'itemValue', name: 'itemName' },
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
      this.$initDataPermits('reportEquipmentUserHold', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      const params = {
        'configType': 'GAME_ITEM_LEVEL'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.itemLevelList = res.data
        }
      })
      const p2 = {
        'configType': 'GAME_ITEM_RARE_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, p2).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.rareTypeList = res.data
        }
      })
      this.listTypeInfo.performanceRangeList = []
      this.listTypeInfo.performanceRangeList.push({ itemValue: 1, itemName: '1-10' })
      this.listTypeInfo.performanceRangeList.push({ itemValue: 2, itemName: '11-50' })
      this.listTypeInfo.performanceRangeList.push({ itemValue: 3, itemName: '51-100' })
      this.listTypeInfo.performanceRangeList.push({ itemValue: 4, itemName: '101-150' })
      this.listTypeInfo.performanceRangeList.push({ itemValue: 5, itemName: '151-200' })
      this.listTypeInfo.performanceRangeList.push({ itemValue: 6, itemName: '201-300' })
      this.listTypeInfo.performanceRangeList.push({ itemValue: 7, itemName: '301-400' })
      this.listTypeInfo.performanceRangeList.push({ itemValue: 8, itemName: '401-500' })
      this.listTypeInfo.performanceRangeList.push({ itemValue: 9, itemName: '501-700' })
      this.listTypeInfo.performanceRangeList.push({ itemValue: 10, itemName: '701-900' })
      this.listTypeInfo.performanceRangeList.push({ itemValue: 11, itemName: '901-1100' })
      this.listTypeInfo.performanceRangeList.push({ itemValue: 12, itemName: '1101-1400' })
    },
    // 获取列表
    getList() {
      let per = ''
      this.listTypeInfo.performanceRangeList.forEach(el => {
        if (el.itemValue === this.filterInfo.query.performance) {
          per = el.itemName
        }
      })
      if (per !== '') {
        const ar = per.split('-')
        this.filterInfo.query.performanceRangeStart = ar[0]
        this.filterInfo.query.performanceRangeEnd = ar[1]
      } else {
        this.filterInfo.query.performanceRangeStart = ''
        this.filterInfo.query.performanceRangeEnd = ''
      }
      this.loading = true
      this.$handleAPI('', getReportEquipmentUserHold, this.filterInfo.query).then(
        res => {
          if (res.code === 200) {
            res.data.equipmentDtos[0].reportDate = this.filterInfo.query.reportDate
            this.result = res.data
            this.tableData = res.data.equipmentDtos
            // 优化导出的格式
            this.editTable()
          }
          this.loading = false
        }
      )
    },
    editTable() {
      var current = this.$refs['reportTable'].$el
        .querySelector('.el-table__footer-wrapper')
        .querySelector('.el-table__footer')
      var cell = current.rows[0].cells
      for (var i = 0; i < cell.length; i++) {
        if (i > 1) {
          cell[i].rowSpan = 2
        }
      }
    },
    // 自定义合计算法
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计'
          return
        }
        if (index === 0) {
          sums[index] = ''
          return
        }
        if (index === 5) {
          sums[index] = this.result.avgTotalCar
          return
        }
        const values = data.map(item => item[column.property])
        var countRows = 0
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            countRows = countRows + 1
            return prev + value
          } else {
            return prev
          }
        }, 0)
        if (index === 4 || index === 8) {
          if (sums[index - 2] > 0 || sums[index - 1] > 0) {
            sums[index] = (sums[index - 2] + sums[index - 1]).toFixed(2)
          } else {
            sums[index] = 0
          }
        }
        if (index === 9) {
          sums[index] = this.result.avgTotalPart
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
          this.handleDownload('用户车库数据总览')
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
