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
    <page-table
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getListApi"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, createApi, exportRaceCupList } from '@/api/race/racecup'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'

export default {
  components: {
    PageFilter,
    PageTable
  },
  data() {
    return {
      getListApi,
      // 相关列表
      listTypeInfo: {
        statusList: [],
        cupStatusList: [],
        payTypeList: [],
        announceFlagList: []
      },
      downloadLoading: false,
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          phaseNo: '',
          cupTitle: '',
          cupStatus: '',
          payType: '',
          status: '',
          validFrom: '',
          validTo: '',
          valid: [],
          releaseFrom: '',
          releaseTo: '',
          announceFlag: ''
        },
        list: [
          { type: 'input', label: '联赛期数', value: 'phaseNo' },
          { type: 'input', label: '联赛名称', value: 'cupTitle' },
          { type: 'customselect', label: '联赛状态', value: 'cupStatus', list: 'cupStatusList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '报名付费方式', value: 'payType', list: 'payTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '结果公布', value: 'announceFlag', list: 'announceFlagList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '联赛有效时间', value: 'valid', dateType: 'daterange', event: 'changeValid' },
          { type: 'datetimerange', label: '上架时间', value: 'release', dateType: 'daterange', event: 'changeRelease' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '新建', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: true },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '官方联赛ID', value: 'id', width: 90 },
          { label: '联赛期数', value: 'phaseNo', width: 70 },
          { label: '联赛名称', value: 'cupTitle' },
          { label: '联赛有效时间', value: 'valid', width: 140 },
          { label: '报名时间', value: 'enrollTime', width: 140 },
          { label: '上架时间', value: 'releaseTime', width: 140 },
          { label: '联赛报名限制人数', value: 'applyLimit', width: 80 },
          { label: '联赛报名人数', value: 'applyTotal', width: 60 },
          { label: '报名费', value: 'applyFee', width: 60 },
          { label: '报名付费方式', value: 'payTypeName', width: 100 },
          { label: '奖项等级', value: 'rankLimit', width: 70 },
          { label: '联赛状态', value: 'cupStatusName', type: 'tag', width: 150 },
          { label: '结果公布', value: 'announceFlagName', type: 'tag', width: 90 },
          { label: '状态', value: 'statusName', type: 'tag' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '80',
          btList: [
            { tooltip: '详情', label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false },
            { tooltip: '删除', label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: false }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits'
    ])
  },
  created() {
    this.initList()
  },
  mounted() {
    this.initDataPermits()
    this.initRules()
    this.getList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('raceCupList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('raceCupList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_RACE_CUP_PUB_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_RACE_CUP_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.cupStatusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_PRICE_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.payTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_RACE_CUP_ANNOUNCE_FLAG' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.announceFlagList = res.data
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
        case 'create': { // 创建
          this.$handleAPI('', createApi, '').then(res => {
            if (res.code === 200) {
              console.log(res)
              var id = res.data.id
              this.$router.push({ path: './detail', query: { id: id }, replace: true })
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          }).catch((error) => {
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        }
        case 'detail': // 编辑
          var id = data.id
          this.$router.push({ path: './detail', query: { id: id }, replace: true })
          break
        case 'export':
          this.handleDownload()
          break
      }
    },
    handleDownload() {
      this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
      this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
      this.$handleAPI('', exportRaceCupList, this.filterInfo.query).then(res => {
        if (res.code === 200) {
          res.data.list.forEach(item => {
            if (item.releaseTo === null) {
              item.releaseTo = ''
            }
            if (item.releaseFrom === null) {
              item.releaseFrom = ''
            }
            if (item.enrollFrom === null) {
              item.enrollFrom = ''
            }
            if (item.deadLine === null) {
              item.deadLine = ''
            }
            if (item.validFrom === null) {
              item.validFrom = ''
            }
            if (item.validTo === null) {
              item.validTo = ''
            }
            item.releaseTime = item.releaseFrom + '-' + item.releaseTo
            item.enrollTime = item.enrollFrom + '-' + item.deadLine
            item.valid = item.validFrom + '-' + item.validTo
          })
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const column = [
              { title: '官方联赛ID', key: 'id', type: 'text', width: 100 },
              { title: '联赛期数', key: 'phaseNo', type: 'text', width: 100 },
              { title: '联赛名称', key: 'cupTitle', type: 'text', width: 100 },
              { title: '联赛有效时间', key: 'valid', type: 'text', width: 100 },
              { title: '报名时间', key: 'enrollTime', type: 'text', width: 100 },
              { title: '上架时间', key: 'releaseTime', type: 'text', width: 100 },
              { title: '结果公布时间', key: 'announceTime', type: 'text', width: 100 },
              { title: '联赛报名限制人数', key: 'applyLimit', type: 'text', width: 100 },
              { title: '联赛报名人数', key: 'applyTotal', type: 'text', width: 100 },
              { title: '报名费', key: 'applyFee', type: 'text', width: 100 },
              { title: '报名付费方式', key: 'payTypeName', type: 'text', width: 100 },
              { title: '胜方加分值', key: 'scoreWin', type: 'text', width: 100 },
              { title: '负方加分值', key: 'scoreLose', type: 'text', width: 100 },
              { title: '设立名次', key: 'rankLimit', type: 'text', width: 100 },
              { title: '联赛介绍', key: 'description', type: 'text', width: 100 },
              { title: '联赛状态', key: 'cupStatusName', type: 'text', width: 100 },
              { title: '结果公布标志', key: 'announceFlagName', type: 'text', width: 100 },
              { title: '发布状态', key: 'statusName', type: 'text', width: 100 }
            ]
            const tHeader = []
            const filterVal = []
            for (const index in column) {
              const item = column[index]
              tHeader[index] = item.title
              filterVal[index] = item.key
            }
            const data = this.formatJson(filterVal, res.data.list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '官方联赛一览',
              autoWidth: this.autoWidth,
              bookType: this.bookType
            })
            this.downloadLoading = false
            // excel.export_table_to_excel_image(column, res.data.list, '官方联赛一览')
          })
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
        }
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
          if (data) {
            data.forEach(item => {
              if (item.releaseTo === null) {
                item.releaseTo = ''
              }
              if (item.releaseFrom === null) {
                item.releaseFrom = ''
              }
              if (item.enrollFrom === null) {
                item.enrollFrom = ''
              }
              if (item.deadLine === null) {
                item.deadLine = ''
              }
              if (item.validFrom === null) {
                item.validFrom = ''
              }
              if (item.validTo === null) {
                item.validTo = ''
              }
              item.releaseTime = item.releaseFrom + '-' + item.releaseTo
              item.enrollTime = item.enrollFrom + '-' + item.deadLine
              item.valid = item.validFrom + '-' + item.validTo
            })
          }
          break
        case 'changeValid':
          if (data) {
            this.filterInfo.query.validFrom = data[0]
            this.filterInfo.query.validTo = data[1]
          } else {
            this.filterInfo.query.validFrom = ''
            this.filterInfo.query.validTo = ''
          }
          break
        case 'changeRelease':
          if (data) {
            this.filterInfo.query.releaseFrom = data[0]
            this.filterInfo.query.releaseTo = data[1]
          } else {
            this.filterInfo.query.releaseFrom = ''
            this.filterInfo.query.releaseTo = ''
          }
          break
      }
    }
  }
}
</script>
