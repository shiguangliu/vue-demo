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
      :api="getRechargeListApi"
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
import { getRechargeListApi, getRechargeListForExcelApi } from '@/api/sku/recharge'
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
      getRechargeListApi,
      // 相关列表
      listTypeInfo: {
        itemTypeList: [{ 'itemValue': '30', 'itemName': '金币' }, { 'itemValue': '31', 'itemName': '钻石' }], // 装备类型
        appTypeList: [], // 平台（IOS/安卓）
        payTypeList: [], // 支付渠道
        orderStatusList: [] // 订单状态
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          transNo: '',
          itemName: '',
          userId: '',
          userPhone: '',
          itemType: '',
          payType: '',
          status: '',
          appType: '',
          rechargeFrom: '',
          rechargeTo: '',
          rechargeDateRange: []
        },
        list: [
          { type: 'input', label: '充值编号', value: 'transNo' },
          { type: 'input', label: '商品名称', value: 'itemName' },
          { type: 'input', label: '用户ID', value: 'userId' },
          { type: 'input', label: '用户手机号', value: 'userPhone' },
          { type: 'customselect', label: '商品类型', value: 'itemType', list: 'itemTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '支付渠道', value: 'payType', list: 'payTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '订单状态', value: 'status', list: 'orderStatusList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: 'IOS/安卓', value: 'appType', list: 'appTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '充值时间', dateType: 'daterange', value: 'rechargeDateRange', event: 'pickDate' },
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
          { label: '充值编号', value: 'transNo', width: '160px' },
          { label: '商品名称', value: 'itemName' },
          { label: '商品类型', value: 'itemTypeStr' },
          { label: '图片', value: 'imageThumbnailUrl', type: 'image' },
          { label: '售价', value: 'priceText' },
          { label: '获得', value: 'quantityText' },
          { label: 'IOS/安卓', value: 'appTypeStr' },
          { label: '用户ID', value: 'userId' },
          { label: '用户手机号', value: 'userPhone' },
          { label: '支付方式', value: 'payTypeStr' },
          { label: '时间', value: 'transTime', width: '150px' },
          { label: '状态', value: 'statusStr', type: 'tag', width: '100px' }
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
    // this.getItemTypeList()
    this.getAppTypeList()
    this.getPayTypeList()
    this.getOrderStatusList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('skuRechargeList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('skuRechargeList', this.filterInfo.list) // 条件区域操作权限
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
    // getItemTypeList() {
    //   const params = { 'configType': 'GAME_ITEM_TYPE' }
    //   this.$handleAPI('', getConfigItemsListApi, params).then(res => {
    //     if (res.code === 200) {
    //       this.listTypeInfo.itemTypeList = res.data
    //     }
    //   })
    // },
    getAppTypeList() {
      const params = { 'configType': 'APP_TYPE' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.appTypeList = res.data
        }
      })
    },
    getPayTypeList() {
      const params = { 'configType': 'PLAT_PAY_TYPE' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.payTypeList = res.data
        }
      })
    },
    getOrderStatusList() {
      const params = { 'configType': 'USER_TRANS_ORDER_STATUS' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.orderStatusList = res.data
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
          this.$router.push({ path: './rechargeDetail', query: { id: data.id }, replace: true })
          break
        case 'export':
          this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
          this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
          this.$handleAPI('', getRechargeListForExcelApi, this.filterInfo.query).then(
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
            this.filterInfo.query.rechargeFrom = data[0]
            this.filterInfo.query.rechargeTo = data[1]
          } else {
            this.filterInfo.query.rechargeFrom = ''
            this.filterInfo.query.rechargeTo = ''
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
          if (Number(item) > Number(3)) {
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
          filename: '游戏币充值记录',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j]
        })
      )
    }
  }
}
</script>
