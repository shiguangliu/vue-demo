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
      :api="getApi"
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
import { getApi, getGameMarketExcel } from '@/api/game/market/index'
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
      getApi,
      // 相关列表
      listTypeInfo: {
        itemTypeList: [], // 装备类型
        rareTypeList: [], // 稀有度
        priceTypeList: [], // 货币类型
        sponsorFlagList: [], // 是否赞助
        statusList: [] // 状态
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: null,
          itemNo: '',
          itemType: '',
          rareType: '',
          priceType: '',
          sponsorFlag: '',
          status: '',
          releaseDate: [],
          releaseFrom: '',
          releaseTo: '',
          salesDate: [],
          salesFrom: '',
          salesTo: '',
          transNo: '',
          soldUserId: null,
          purchaseUserId: null
        },
        list: [
          { type: 'input', label: '交易ID', value: 'id' },
          { type: 'input', label: '装备编号', value: 'itemNo' },
          { type: 'customselect', label: '装备类型', value: 'itemType', list: 'itemTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '稀有度', value: 'rareType', list: 'rareTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '货币类型', value: 'priceType', list: 'priceTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '是否赞助', value: 'sponsorFlag', list: 'sponsorFlagList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '上架时间', dateType: 'daterange', value: 'releaseDate', event: 'releaseDate' },
          { type: 'input', label: '订单编号', value: 'transNo' },
          { type: 'input', label: '出售用户ID', value: 'soldUserId' },
          { type: 'input', label: '购买用户ID', value: 'purchaseUserId' },
          { type: 'datetimerange', label: '出售时间', dateType: 'daterange', value: 'salesDate', event: 'salesDate' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '交易ID', value: 'id', width: '80px' },
          { label: '装备编号', value: 'itemNo' },
          { label: '装备名称', value: 'itemName' },
          { label: '装备类型', value: 'itemTypeName', width: '80px' },
          { label: '图片', value: 'imageThumbnailUrl', type: 'image', width: '100px' },
          { label: '稀有度', value: 'rareType', width: '60px' },
          { label: '售卖等级', value: 'itemLevel', width: '80px' },
          { label: '性能分', value: 'performance', width: '100px' },
          { label: '是否赞助', value: 'sponsorFlagName', width: '80px' },
          { label: '售卖价格', value: 'quotedPrice', width: '100px' },
          { label: '货币类型', value: 'priceTypeName', width: '100px' },
          { label: '数量', value: 'number', width: '60px' },
          { label: '上架时间', value: 'releaseFrom' },
          { label: '状态', value: 'statusName', type: 'tag', width: '80px' },
          { label: '出售时间', value: 'transTime' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '100',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false }
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
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
    this.getList()
  },
  created() {
    this.getItemTypeList()
    this.getRareTypeList()
    this.getPriceTypeList()
    this.getSponsorFlagList()
    this.getStatusList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('gameMarketList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('gameMarketList', this.filterInfo.list) // 条件区域操作权限
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
      this.tableInfo.refresh = Math.random()
    },
    getItemTypeList() {
      const params = { 'configType': 'GAME_ITEM_TYPE' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          res.data.forEach((item, index) => {
            if (item.itemValue === '30') {
              res.data.splice(index, 1)
            }
          })
          res.data.forEach((item, index) => {
            if (item.itemValue === '31') {
              res.data.splice(index, 1)
            }
          })
          this.listTypeInfo.itemTypeList = res.data
        }
      })
    },
    getRareTypeList() {
      const params = { 'configType': 'GAME_ITEM_RARE_TYPE' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.rareTypeList = res.data
        }
      })
    },
    getPriceTypeList() {
      const params = { 'configType': 'GAME_ITEM_PRICE_TYPE' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          res.data.forEach((item, index) => {
            if (item.itemValue === '1') {
              res.data.splice(index, 1)
            }
          })
          this.listTypeInfo.priceTypeList = res.data
        }
      })
    },
    getSponsorFlagList() {
      const params = { 'configType': 'YES_NO' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.sponsorFlagList = res.data
        }
      })
    },
    getStatusList() {
      const params = { 'configType': 'GAME_ITEM_MARKET_STATUS' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
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
        case 'detail': // 编辑 跳转
          this.$router.push({ path: './detail', query: { id: data.id }, replace: true })
          break
        case 'export':
          this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
          this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
          this.$handleAPI('', getGameMarketExcel, this.filterInfo.query).then(res => {
            if (res.code === 200) {
              this.handleDownload(res.data)
            }
          })
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
        case 'releaseDate': {
          if (data) {
            this.filterInfo.query.releaseFrom = data[0]
            this.filterInfo.query.releaseTo = data[1]
          } else {
            this.filterInfo.query.releaseFrom = ''
            this.filterInfo.query.releaseTo = ''
          }
          break
        }
        case 'salesDate': {
          if (data) {
            this.filterInfo.query.salesFrom = data[0]
            this.filterInfo.query.salesTo = data[1]
          } else {
            this.filterInfo.query.salesFrom = ''
            this.filterInfo.query.salesTo = ''
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
          if (Number(item) > Number(4)) {
            // 图片不导出，if中的3是图片在fieldList中的索引位置
            tHeader[item - 1] = this.tableInfo.fieldList[item].label
            filterVal[item - 1] = this.tableInfo.fieldList[item].value
          } else {
            tHeader[item] = this.tableInfo.fieldList[item].label
            filterVal[item] = this.tableInfo.fieldList[item].value
          }
        }
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '交易所交易记录',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.list.map(v =>
        filterVal.map(j => {
          console.log(j)
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
