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
      :header-cell-style="{'text-align':'center'}"
    >
      <el-table-column
        prop="summaryDate"
        label="统计日期"
        width="150"
      />
      <el-table-column
        prop="mapName"
        label="地图名称"
        width="150"
      />
      <el-table-column label="使用次数">
        <el-table-column
          v-for="item in tableHeader"
          :key="item"
          :value="item"
          :label="item"
          :prop="item"
          align="right"
        >
          <template slot-scope="{row}">
            {{ row[item] || 0 }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="使用占比（%）">
        <el-table-column
          v-for="item in tableHeader2"
          :key="item"
          :value="item"
          :label="item"
          :prop="item"
          align="right"
        >
          <template slot-scope="{row}">
            {{ Number(row[item] || 0.00 ).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getReportPkMapSummary, getRaceMapListCanUse } from '@/api/report/pk'
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
      race1Count: 0,
      tableData: [],
      tableHeader: { }, // 绑定表头
      tableHeader2: { }, // 绑定表头
      // 相关列表
      listTypeInfo: {
        mapList: [] // 地图列表
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          mapId: '',
          validDateRange: [new Date(), new Date()],
          DateFrom: new Date(),
          DateTo: new Date()
        },
        list: [
          { type: 'datetimerange', label: '统计时间', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
          { type: 'customselect', label: '地图类型', value: 'mapId', list: 'mapList', key: 'id', name: 'mapName' },
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
    this.getMapList()
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
    getMapList() {
      const params = {}
      this.$handleAPI('', getRaceMapListCanUse, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.mapList = res.data
        }
      })
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
      this.$handleAPI('', getReportPkMapSummary, this.filterInfo.query).then(
        res => {
          if (res.code === 200) {
            // 第一次遍历，制作 tableHeader 和 tableHeader2
            var th = {}
            var thKey = {}
            var th2 = {}
            var thKey2 = {}
            var race1CountOld = 0
            for (var i = 0; i < res.data.length; i++) {
              thKey[res.data[i].raceName] = res.data[i].raceName // 动态列
              thKey2[res.data[i].raceName + '(%)'] = res.data[i].raceName + '(%)' // 动态列
            }
            // 动态增加列
            for (var key in thKey) {
              th[key] = key
              race1CountOld++
            }
            for (var key2 in thKey2) {
              th2[key2] = key2
            }
            this.tableHeader = th
            this.tableHeader2 = th2

            // 第二次遍历，制作行数据
            var tr = []// 保存数据
            var trKey = {} // 保存key
            for (var i2 = 0; i2 < res.data.length; i2++) {
              var d2 = res.data[i2]
              tr[d2.summaryDate + d2.mapName] = {
                summaryDate: d2.summaryDate, // 固定列
                mapName: d2.mapName
              }
              trKey[d2.summaryDate + d2.mapName] = d2.summaryDate + d2.mapName
            }
            // 第三次遍历，添加对应数据
            for (var i3 = 0; i3 < res.data.length; i3++) {
              var d3 = res.data[i3]
              tr[d3.summaryDate + d3.mapName][d3.raceName] = d3.useNum // 动态列
              tr[d3.summaryDate + d3.mapName][d3.raceName + '(%)'] = d3.useRate // 动态列
            }
            // 重新组装tr数据
            var iNew = 0
            var trNew = []
            for (var keyNew in trKey) {
              trNew[iNew] = tr[keyNew]
              iNew++
            }
            this.tableData = trNew
            this.race1Count = race1CountOld + 2
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
        if (index === 1) {
          sums[index] = '-'
          return
        }
        if (index > this.race1Count - 1) {
          sums[index] = '-'
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
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'search': // 搜索
          this.getList()
          break
        case 'export':
          this.handleDownload('地图使用情况总览')
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
