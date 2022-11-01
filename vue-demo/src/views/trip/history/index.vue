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
      ref="refSpecTable"
      v-loading="bonusListLoading"
      :data.sync="tripData"
      :highlight-current-row="true"
      border
      height="500"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      @expand-change="expandChange"
    >
      <el-table-column type="expand" label="" prop="">
        <template slot-scope="props">
          <el-table :data.sync="props.row.bonusList" stripe>
            <el-table-column label="收获记录ID" prop="id" align="center" />
            <el-table-column label="奖励ID" prop="bonusItemId" align="center" />
            <el-table-column label="奖励名称" prop="bonusName" align="center" />
            <el-table-column label="奖励类型" prop="bonusTypeName" align="center" />
            <el-table-column label="奖励数量" prop="bonusQuantity" align="center" />
            <el-table-column label="抽奖广告关联ID" prop="advObjectId" align="center" />
            <el-table-column label="广告类型" prop="advTypeName" align="center" />
            <el-table-column label="广告对象名称" prop="advName" align="center" />
            <el-table-column label="中奖/未中奖提示" prop="statusName" align="center" />
            <el-table-column label="翻牌状态" prop="drawFlagName" align="center" />
            <el-table-column label="领取状态" prop="hitFlagName" align="center" />
            <el-table-column label="领取时间" prop="hitTime" align="center" />
            <el-table-column label="有效时间" prop="expiredAt" align="center" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="启程ID" width="75px" align="center" />
      <el-table-column prop="distance" label="行驶距离" align="center" width="80px" />
      <el-table-column prop="tripTime" label="行驶时长" align="center" width="140px" />
      <el-table-column prop="speedMax" label="最快速度" align="center" width="100px" />
      <el-table-column prop="startEndTime" label="开始与结束时间" align="center" />
      <el-table-column prop="userId" label="用户ID" align="center" width="80px" />
      <el-table-column prop="userPhone" label="用户手机号" align="center" width="100px" />
      <el-table-column prop="statusName" label="启程状态" align="center" width="80px" />
      <el-table-column prop="modeName" label="出行标签" align="center" width="80px" />
      <el-table-column prop="bonusGet" label="领取/获得奖励" align="center" width="100px" />
      <el-table-column prop="tripGold" label="里程产生金币数" align="center" width="105px" />
      <el-table-column prop="adGold" label="广告奖励金币数" align="center" width="105px" />
      <el-table-column prop="drawStatus" label="奖励状态" width="80px" align="center" />
      <el-table-column label="操作" width="100px" align="center">
        <template slot-scope="scope">
          <el-tooltip effect="light" content="详情" placement="top">
            <el-button type="primary" icon="el-icon-view" class="handle-button" @click.stop="handleClick('detail', scope.row)">详情</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[1, 10, 20, 50]"
      :page-size="pageSize"
      :total="totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getListApi, getBonusApi, exportTripHistory } from '@/api/trip/triphistory'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
export default {
  components: {
    PageFilter
  },
  data() {
    return {
      refresh: 1,
      bonusListLoading: false,
      getListApi,
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      downloadLoading: false,
      // 相关列表
      listTypeInfo: {
        bonusStatusList: [] // 奖励状态待领取，已领取，过期
        // tripStatusList: [], // 启程是否结束
        // drawStatusList: [] // 中奖未中奖
        // bonusItemTypeList: [],
        // drawFlagList: [] // 是否翻牌
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: '',
          bonusStatus: '', // *状态
          userId: '',
          startTimeFrom: '',
          startTimeTo: '',
          startTime: [],
          endTimeFrom: '',
          endTimeTo: '',
          endTime: [],
          userPhone: ''
        },
        list: [
          { type: 'input', label: '启程ID', value: 'id' },
          { type: 'input', label: '用户ID', value: 'userId' },
          { type: 'input', label: '用户手机号', value: 'userPhone' },
          { type: 'customselect', label: '奖励状态', value: 'bonusStatus', list: 'bonusStatusList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '开始时间', dateType: 'daterange', value: 'startTime', event: 'pickStartTime' },
          { type: 'datetimerange', label: '结束时间', dateType: 'daterange', value: 'endTime', event: 'pickEndTime' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: true }
        ]
      },
      tripData: [],
      bonusData: []
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
      // this.$initDataPermits('tripHistoryList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('tripHistoryList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      // const statusParams = {
      //   'configType': 'USER_TRIP_STATUS'
      // }
      // this.$handleAPI('', getConfigItemsListApi, statusParams).then(res => {
      //   if (res.code === 200) {
      //     this.listTypeInfo.tripStatusList = res.data
      //   }
      // })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_HIT_FLAG' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.bonusStatusList = res.data.splice(0, 2)
        }
      })
      // this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_DRAW_STATUS' }).then(res => {
      //   if (res.code === 200) {
      //     this.listTypeInfo.drawStatusList = res.data
      //   }
      // })
      // this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_TYPE' }).then(res => {
      //   if (res.code === 200) {
      //     this.listTypeInfo.bonusItemTypeList = res.data
      //   }
      // })
      // this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_DRAW_FLAG' }).then(res => {
      //   if (res.code === 200) {
      //     this.listTypeInfo.drawFlagList = res.data
      //   }
      // })
    },
    // 获取列表
    getList() {
      this.filterInfo.query.pageNum = this.currentPage
      this.filterInfo.query.pageSize = this.pageSize
      this.$handleAPI('', getListApi, this.filterInfo.query).then(res => {
        if (res.code === 200) {
          this.totalCount = res.data.total
          this.tripData = res.data.list
          this.tripData.forEach(item => {
            // item.status = this.$fn.getDataName({ dataList: this.listTypeInfo.tripStatusList, value: 'itemValue', label: 'itemName', data: item.status + '' })
            // item.drawStatus = this.$fn.getDataName({ dataList: this.listTypeInfo.bonusStatusList, value: 'itemValue', label: 'itemName', data: item.drawStatus + '' })
            item.bonusGet = item.drawTimes + '/' + item.lotteryTimes
            item.tripTime = item.tripDays + '天' + item.tripHours + '小时' + item.tripMinutes + '分钟' + item.tripSeconds + '秒'
            if (item.startTime === null) {
              item.startTime = '~'
            }
            if (item.endTime === null) {
              item.endTime = '~'
            }
            item.startEndTime = item.startTime + ' 至 ' + item.endTime
            item.speedMax = item.speedMax + '公里/小时'
            item.distance = item.distance + '公里'
            // item.bonusList.forEach(it => {
            //   it.status = this.$fn.getDataName({ dataList: this.listTypeInfo.drawStatusList, value: 'itemValue', label: 'itemName', data: it.status + '' })
            //   it.hitFlag = this.$fn.getDataName({ dataList: this.listTypeInfo.bonusStatusList, value: 'itemValue', label: 'itemName', data: it.hitFlag + '' })
            //   it.bonusType = this.$fn.getDataName({ dataList: this.listTypeInfo.bonusItemTypeList, value: 'itemValue', label: 'itemName', data: it.bonusType + '' })
            //   it.drawFlag = this.$fn.getDataName({ dataList: this.listTypeInfo.drawFlagList, value: 'itemValue', label: 'itemName', data: it.drawFlag + '' })
            // })
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
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    expandChange(row, expanded) {
      // if (expandedRows.length > 1) {
      //   expandedRows.shift()
      // }
      var flag = false
      expanded.forEach(el => {
        if (el.id === row.id) {
          flag = true
        }
      })
      if (flag) { // 说明是展开，请求二级表格数据
        this.$handleAPI('', getBonusApi, { 'tripId': row.id }).then(res => {
          if (res.code === 200) {
            row.bonusList = res.data.list
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
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'search': // 搜索
          this.getList()
          break
        case 'detail': // 编辑
          this.$router.push({ path: './detail', query: { id: data.id }, replace: true })
          break
        case 'export': // 导出
          this.handleDownload()
          break
      }
    },
    handleDownload() {
      this.filterInfo.query.pageNum = this.currentPage
      this.filterInfo.query.pageSize = this.pageSize
      this.$handleAPI('', exportTripHistory, this.filterInfo.query).then(res => {
        if (res.code === 200) {
          res.data.list.forEach(item => {
            item.tripTime = item.tripDays + '天' + item.tripHours + '小时' + item.tripMinutes + '分钟' + item.tripSeconds + '秒'
            if (item.userGender === 1) {
              item.gender = '先生'
            } else {
              item.gender = '女士'
            }
            item.startCoord = item.startLng + ' : ' + item.startLat
            item.endCoord = item.endLng + ' : ' + item.endLat
          })
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const column = [
              { title: '启程ID', key: 'id', type: 'text', width: 100 },
              { title: '行驶距离(公里)', key: 'distance', type: 'text', width: 100 },
              { title: '行驶时长', key: 'tripTime', type: 'text', width: 100 },
              { title: '平均速度(公里/小时)', key: 'speed', type: 'text', width: 100 },
              { title: '最快速度(公里/小时)', key: 'speedMax', type: 'text', width: 100 },
              { title: '启程开始时间', key: 'startTime', type: 'text', width: 100 },
              { title: '启程结束时间', key: 'endTime', type: 'text', width: 100 },
              { title: '用户ID', key: 'userId', type: 'text', width: 100 },
              { title: '性别', key: 'gender', type: 'text', width: 100 },
              { title: '用户手机号', key: 'userPhone', type: 'text', width: 100 },
              { title: '启程状态', key: 'statusName', type: 'text', width: 100 },
              { title: '出行标签', key: 'modeName', type: 'text', width: 100 },
              { title: '获得翻牌次数', key: 'lotteryTimes', type: 'text', width: 100 },
              { title: '已翻牌次数', key: 'drawTimes', type: 'text', width: 100 },
              { title: '里程产生金币数', key: 'tripGold', type: 'text', width: 100 },
              { title: '广告产生金币数', key: 'adGold', type: 'text', width: 100 },
              { title: '奖励状态', key: 'drawStatus', type: 'text', width: 100 },
              { title: '开始时当日行程', key: 'startDistance', type: 'text', width: 100 },
              { title: '结束时当日行程', key: 'endDistance', type: 'text', width: 100 },
              { title: '起点坐标', key: 'startCoord', type: 'text', width: 100 },
              { title: '起点位置', key: 'tripFromLocation', type: 'text', width: 100 },
              { title: '终点坐标', key: 'endCoord', type: 'text', width: 100 },
              { title: '终点位置', key: 'tripToLocation', type: 'text', width: 100 }
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
              filename: '启程记录一览',
              autoWidth: this.autoWidth,
              bookType: this.bookType
            })
            this.downloadLoading = false
            // excel.export_table_to_excel_image(column, res.data.list, '启程记录一览')
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
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return v[j]
        } else {
          return v[j]
        }
      }))
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'pickStartTime': // 选择日期范围
          if (data) {
            this.filterInfo.query.startTimeFrom = data[0]
            this.filterInfo.query.startTimeTo = data[1]
          } else {
            this.filterInfo.query.startTimeFrom = ''
            this.filterInfo.query.startTimeTo = ''
          }
          break
        case 'pickEndTime': // 选择日期范围
          if (data) {
            this.filterInfo.query.endTimeFrom = data[0]
            this.filterInfo.query.endTimeTo = data[1]
          } else {
            this.filterInfo.query.endTimeFrom = ''
            this.filterInfo.query.endTimeTo = ''
          }
          break
        case 'list': // 对表格获取到的数据做处理
          if (data) {
            // data.forEach(item => {
            //   item.status = this.$fn.getDataName({ dataList: this.listTypeInfo.statusList, value: 'itemValue', label: 'itemName', data: item.status + '' })
            // })
            this.tripData = data
          }
          break
      }
    }
  }
}
</script>
