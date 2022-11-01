<template>
  <div class="app-container">
    <!-- 条件栏 -->
    <page-filter
      :query.sync="poolFilterInfo.query"
      :filter-list="poolFilterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <!-- 表格 -->
    <page-table
      :table-index="tableInfo.tableIndex"
      :check-box="tableInfo.checkBox"
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getHistoryListApi"
      :query="poolFilterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <template v-slot:col-validDate="scope">
        <p>{{ scope.row.validFrom + '-' + scope.row.validTo }}</p>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi } from '@/api/common'
import { getHistoryListApi } from '@/api/fzgamelottery'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'

export default {
  components: {
    PageFilter,
    PageTable
  },
  filters: {
  },
  data() {
    return {
      popupDialog: {
        title: '',
        typeVal: '',
        visible: false,
        btLoading: false,
        height: '600px'
      },
      downloadLoading: false,
      checkBoxList: [],
      getHistoryListApi,
      // 相关列表
      listTypeInfo: {
        statusList: [], // 状态列表
        objectTypeList: []
      },
      // 过滤相关配置（检索条件）
      poolFilterInfo: {
        query: {
          lotteryId: '',
          poolId: '',
          objectType: '',
          hitTimeFrom: '',
          hitTimeTo: '',
          searchKeywords: '',
          hitDateRange: []
        },
        list: [
          { type: 'input', label: '转盘ID', value: 'lotteryId' },
          { type: 'input', label: '奖励ID', value: 'poolId' },
          { type: 'datetimerange', label: '中奖时间', dateType: 'daterange', value: 'hitDateRange', event: 'pickDate' },
          { type: 'customselect', label: '奖励类型', value: 'objectType', list: 'objectTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'input', label: '手机号/昵称', value: 'searchKeywords' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '导出', btType: 'success', icon: 'el-icon-download', event: 'export', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: false, // 是否显示序号
        checkBox: true,
        data: [],
        fieldList: [
          { label: '转盘ID', value: 'lotteryId' },
          { label: '奖励ID', value: 'poolId' },
          { label: '奖励类型', value: 'objectTypeName' },
          { label: '奖励名称', value: 'objectName' },
          { label: '数量', value: 'hitQty' },
          { label: '用户ID', value: 'userId' },
          { label: '用户昵称', value: 'userNickName' },
          { label: '用户手机号', value: 'userPhone' },
          // { label: '搜索关键字', value: 'searchKeyWords' },
          { label: '中奖时间', value: 'hitTime', width: 160 }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['theme', 'dataPermits', 'staffId'])
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.getList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('lotteryHistory', this.poolFilterInfo.list) // 条件区域操作权限
    },
    initList() {
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_LOTTERY_POOL_OBJECT_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.objectTypeList = res.data
        }
      })
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick(event, data) {
      const tableInfo = this.tableInfo
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'export': {
          // 多选导出
          const idArr = []
          this.checkBoxList.forEach(item => {
            idArr.push(item.id)
          })
          if (idArr.length === 0) {
            this.$confirm('暂未勾选数据，确定全部导出当前页数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$handleAPI('', getHistoryListApi, this.poolFilterInfo.query).then(res => {
                if (Number(res.code) === 200) {
                  this.handleDownload(res.data.list)
                }
              })
            }).catch((e) => {
              this.$message({
                type: 'info',
                message: '已取消导出'
              })
            })
          } else if (idArr.length > 0) {
            this.handleDownload(this.checkBoxList)
          }
          break
        }
      }
    },
    handleDownload(list) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        var tHeader = []
        var filterVal = []
        for (var item in this.tableInfo.fieldList) {
          tHeader[item] = this.tableInfo.fieldList[item].label
          filterVal[item] = this.tableInfo.fieldList[item].value
        }
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '转盘记录' + new Date().getTime(),
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
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
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            this.$set(item, 'statusLoading', false)
            this.$set(item, 'deleteLoading', false)
            item.updatetime = this.$fn.switchTime(
              item.updatetime,
              'YYYY-MM-DD hh:mm:ss'
            )
          })
          break
        case 'tableCheck': { // 选择
          this.checkBoxList = data
          break
        }
        case 'pickDate': // 选择日期范围
          if (data) {
            this.poolFilterInfo.query.hitTimeFrom = data[0]
            this.poolFilterInfo.query.hitTimeTo = data[1]
          } else {
            this.poolFilterInfo.query.hitTimeFrom = ''
            this.poolFilterInfo.query.hitTimeTo = ''
          }
          break
      }
    }
  }
}
</script>

<style scoped>
.cardIcon {
  font-size: 40px;
}
</style>
