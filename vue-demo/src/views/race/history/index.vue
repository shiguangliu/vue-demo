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
      :api="getUserRaceList"
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
import { getUserRaceList, getUserRaceExport } from '@/api/user/info/detail'
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
      getUserRaceList,
      // 相关列表
      listTypeInfo: {
        statusList: [],
        raceTypeList: [],
        playerResultList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: null,
          userId: null,
          raceType: null,
          valid: [],
          startTime: null,
          endTime: null,
          status: null,
          playerResult: null
        },
        list: [
          { type: 'input', label: '路赛记录ID', value: 'id' },
          { type: 'input', label: '用户ID', value: 'userId' },
          { type: 'customselect', label: '比赛结果', value: 'playerResult', list: 'playerResultList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '比赛类型', value: 'raceType', list: 'raceTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '比赛时间', dateType: 'daterange', value: 'valid', event: 'raceDate' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: false }
        ]
      },
      // 表单相关（追加、修改）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '路赛ID', value: 'id', minWidth: 60 },
          { label: '比赛类型', value: 'raceTypeName', width: 90 },
          { label: '官方联赛名称', value: 'cupTitle' },
          { label: '比赛地图名称', value: 'mapName' },
          { label: '用户1ID', value: 'player1Id' },
          { label: '用户1名称', value: 'player1UserName' },
          { label: '用户1比赛结果', value: 'player1ResultName', width: 100 },
          { label: '用户2ID', value: 'player2Id' },
          { label: '用户2名称', value: 'player2UserName' },
          { label: '用户2比赛结果', value: 'player2ResultName', width: 100 },
          { label: '比赛开始时间', value: 'startTime', width: 150 },
          { label: '比赛结束时间', value: 'endTime', width: 150 },
          { label: '状态', value: 'statusName', type: 'tag', minWidth: 70 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '100',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: true }
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
      this.$initDataPermits('raceHistoryList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('raceHistoryList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      const raceTypeParams = {
        'configType': 'USER_RACE_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, raceTypeParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.raceTypeList = res.data
        }
      })
      const playerResultParams = {
        'configType': 'USER_RACE_RESULT'
      }
      this.$handleAPI('', getConfigItemsListApi, playerResultParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.playerResultList = res.data
        }
      })
      const statusParams = {
        'configType': 'USER_RACE_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, statusParams).then(res => {
        if (res.code === 200) {
          var arr = []
          res.data.forEach(item => {
            if (item.itemValue !== '1' && item.itemValue !== '2') {
              arr.push(item)
            }
          })
          this.listTypeInfo.statusList = arr
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
        case 'detail': // 编辑
          var id = data.id
          this.$router.push({ path: './detail', query: { id: id }, replace: true })
          break
        case 'export':
          var flag = true
          if (this.filterInfo.query.startTime === null || this.filterInfo.query.startTime === '') {
            flag = false
            this.$message({
              showClose: true,
              message: '请选择比赛时间',
              type: 'error',
              duration: 3500
            })
          } else {
            var stateDate = this.filterInfo.query.startTime
            var endDate = this.filterInfo.query.endTime
            var lastMonth = this.getAssignDate(endDate)
            if (stateDate < lastMonth) {
              flag = false
              this.$message({
                showClose: true,
                message: '比赛时间检索范围不能超过一个月',
                type: 'error',
                duration: 3500
              })
            }
          }
          if (flag) {
            this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
            this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
            this.$handleAPI('', getUserRaceExport, this.filterInfo.query).then(res => {
              if (res.code === 200) {
                this.handleDownload(res.data)
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error',
                  duration: 3500
                })
              }
            })
          }
          break
      }
    },
    // 获取指定日期前一个月时间
    getAssignDate(date) {
      var arr = date.split('-')
      var year = arr[0] // 获取当前日期的年份
      var month = arr[1] // 获取当前日期的月份
      var day = arr[2] // 获取当前日期的日
      // var days = new Date(year, month, 0)
      // days = days.getDate() // 获取当前日期中月的天数
      var year2 = year
      var month2 = parseInt(month) - 1
      if (month2 === 0) {
        year2 = parseInt(year2) - 1
        month2 = 12
      }
      var day2 = day
      var days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      var t2 = year2 + '-' + month2 + '-' + day2
      return t2
    },
    handleDownload(list) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const column = [
          { title: '路赛ID', key: 'id', type: 'text' },
          { title: '比赛类型', key: 'raceTypeName', type: 'text' },
          { title: '官方联赛名称', key: 'cupTitle', type: 'text' },
          { title: '地图场景名称', key: 'mapName', type: 'text' },
          { title: '游戏用户1ID', key: 'player1Id', type: 'text' },
          { title: '游戏用户1名称', key: 'player1UserName', type: 'text' },
          { title: '用户1车道名称', key: 'player1LaneTypeName', type: 'text' },
          { title: '用户1是否翻车', key: 'player1ExtraName', type: 'text' },
          { title: '用户1轨迹总时长(秒)', key: 'player1TrackTime', type: 'text' },
          { title: '用户1比赛结果', key: 'player1ResultName', type: 'text' },
          { title: '游戏用户2ID', key: 'player2Id', type: 'text' },
          { title: '游戏用户2名称', key: 'player2UserName', type: 'text' },
          { title: '用户2车道名称', key: 'player2LaneTypeName', type: 'text' },
          { title: '用户2是否翻车', key: 'player2ExtraName', type: 'text' },
          { title: '用户2轨迹总时长(秒)', key: 'player2TrackTime', type: 'text' },
          { title: '用户2比赛结果', key: 'player2ResultName', type: 'text' },
          { title: '比赛开始时间', key: 'startTime', type: 'text' },
          { title: '比赛结束时间', key: 'endTime', type: 'text' },
          { title: '比赛来源', key: 'raceSource', type: 'text' },
          { title: '状态名称', key: 'statusName', type: 'text' }
        ]
        var tHeader = []
        var filterVal = []
        for (var item in column) {
          tHeader[item] = column[item].title
          filterVal[item] = column[item].key
        }
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '路赛记录',
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
          if (data) {
            data.forEach(item => {
              // item.status = this.$fn.getDataName({ dataList: this.listTypeInfo.statusList, value: 'itemValue', label: 'itemName', data: item.status + '' })
            })
          }
          break
        case 'raceDate':
          if (data) {
            this.filterInfo.query.startTime = data[0]
            this.filterInfo.query.endTime = data[1]
          } else {
            this.filterInfo.query.startTime = ''
            this.filterInfo.query.endTime = ''
          }
          break
      }
    }
  }
}
</script>
