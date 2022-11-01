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
      :api="getSellOutListForPageApi"
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
import { getSellOutListForPageApi, getSellOutListForExcelApi } from '@/api/sku/sell'
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
      getSellOutListForPageApi,
      // 相关列表
      listTypeInfo: {
        itemTypeList: [{ 'itemValue': '10', 'itemName': '车辆' }, { 'itemValue': '20', 'itemName': '引擎' }, { 'itemValue': '21', 'itemName': '轮胎' }, { 'itemValue': '22', 'itemName': '方向盘' }], // 装备类型
        rareTypeList: [], // 稀有度
        sponsorFlagList: [] // 是否赞助
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          type: '1',
          skuId: '',
          itemName: '',
          itemType: '',
          rareType: '',
          sponsorFlag: '',
          buyTimeFrom: '',
          buyTimeTo: '',
          buyTimeDateRange: [],
          transNo: '',
          userId: '',
          userPhone: ''
        },
        list: [
          { type: 'input', label: '商品ID', value: 'skuId' },
          { type: 'input', label: '商品名称', value: 'itemName' },
          { type: 'customselect', label: '装备类型', value: 'itemType', list: 'itemTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '稀有度', value: 'rareType', list: 'rareTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'input', label: '订单编号', value: 'transNo' },
          { type: 'input', label: '用户ID', value: 'userId' },
          { type: 'input', label: '用户手机号', value: 'userPhone' },
          { type: 'customselect', label: '是否赞助', value: 'sponsorFlag', list: 'sponsorFlagList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '购买时间', dateType: 'daterange', value: 'buyTimeDateRange', event: 'pickDate' },
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
          { label: '订单编号', value: 'transNo' },
          { label: '商品ID', value: 'skuId', width: 70 },
          { label: '商品名称', value: 'itemName' },
          { label: '商品类型', value: 'itemFlagStr', width: 70 },
          { label: '装备类型', value: 'itemTypeStr', width: 70 },
          { label: '图片', value: 'imageThumbnailUrl', type: 'image' },
          { label: '稀有度', value: 'rareTypeStr', width: 60 },
          { label: '是否赞助', value: 'sponsorFlagStr', width: 70 },
          { label: '货币类型', value: 'priceTypeStr', width: 70 },
          { label: '价格', value: 'salesPrice', width: 70 },
          { label: '数量', value: 'quantity', width: 50 },
          { label: '购买用户ID', value: 'userId', width: 90 },
          { label: '购买用户手机号', value: 'userPhone', width: 110 },
          { label: '购买时间', value: 'transTime' },
          { label: '状态', value: 'statusStr', type: 'tag', width: 70 }
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
    this.getRareTypeList()
    this.getSponsorFlagList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      // this.$initDataPermits('skuSellOutList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('skuSellOutList', this.filterInfo.list) // 条件区域操作权限
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
    getRareTypeList() {
      const params = { 'configType': 'GAME_ITEM_RARE_TYPE' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.rareTypeList = res.data
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
    // 按钮点击
    handleClick(event, data) {
      const tableInfo = this.tableInfo
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        // case 'detail': // 编辑 跳转
        //   this.$router.push({ path: './detail', query: { orderId: data.orderId }, replace: true })
        //   break
        case 'export':
          this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
          this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
          this.$handleAPI('', getSellOutListForExcelApi, this.filterInfo.query).then(
            res => {
              if (res.code === 200) {
                this.handleDownload(res.data)
              }
            }
          )
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'pickDate': // 选择日期范围
          if (data) {
            this.filterInfo.query.buyTimeFrom = data[0]
            this.filterInfo.query.buyTimeTo = data[1]
          } else {
            this.filterInfo.query.buyTimeFrom = ''
            this.filterInfo.query.buyTimeTo = ''
          }
          break
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
          })
          break
      }
    },
    handleDownload(list) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        var tHeader = []
        var filterVal = []
        for (var item in this.tableInfo.fieldList) {
          if (Number(item) > Number(5)) {
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
          filename: '用户购买记录',
          autoWidth: this.autoWidth,
          bookType: this.bookType
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
    }
  }
}
</script>
