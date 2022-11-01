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
      :api="getGroupOrderListForPageApi"
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
import { getGroupOrderListForPageApi, getGroupOrderListForExcelApi, getMerchantListApi } from '@/api/group/groupOrder'
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
      getGroupOrderListForPageApi,
      // 相关列表
      listTypeInfo: {
        merchantList: [], // 商户列表
        orderStatusList: [], // 订单状态
        groupStatusList: [], // 拼团状态
        payStatusList: [] // 付款状态
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          orderNo: '',
          groupTitle: '',
          merchantId: '',
          userPhone: '',
          orderTimeFrom: '',
          orderTimeTo: '',
          payStatus: '',
          groupStatus: '',
          orderStatus: ''
        },
        list: [
          { type: 'input', label: '订单编号', value: 'orderNo' },
          { type: 'input', label: '拼团名称', value: 'groupTitle' },
          { type: 'customselect', label: '所属商户', value: 'merchantId', list: 'merchantList', key: 'id', name: 'merchantName' },
          { type: 'input', label: '手机号', value: 'userPhone' },
          { type: 'date', label: '下单时间From', value: 'orderTimeFrom' },
          { type: 'date', label: '下单时间To', value: 'orderTimeTo' },
          { type: 'customselect', label: '付款状态', value: 'payStatus', list: 'payStatusList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '拼团状态', value: 'groupStatus', list: 'groupStatusList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '订单状态', value: 'orderStatus', list: 'orderStatusList', key: 'itemValue', name: 'itemName' },
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
          { label: '订单编号', value: 'orderNo' },
          { label: '拼团名称', value: 'groupTitle' },
          { label: '所属商户', value: 'merchantName' },
          { label: '手机号', value: 'userPhone' },
          { label: '下单时间', value: 'orderTime', width: '180px' },
          { label: '付款状态', value: 'payStatus' },
          { label: '拼团状态', value: 'groupStatus' },
          { label: '订单状态', value: 'orderStatus', type: 'tag', width: '100px' }
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
    this.getMerchantList()
    this.getOrderStatusList()
    this.getGroupStatusList()
    this.getPayStatusList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('groupOrderList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('groupOrderList', this.filterInfo.list) // 条件区域操作权限
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
    getMerchantList() {
      const params = {}
      this.$handleAPI('', getMerchantListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
    },
    getOrderStatusList() {
      const params = { 'configType': 'GROUP_ORDER_STATUS' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.orderStatusList = res.data
        }
      })
    },
    getGroupStatusList() {
      const params = { 'configType': 'GROUP_STATUS' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.groupStatusList = res.data
        }
      })
    },
    getPayStatusList() {
      const params = { 'configType': 'GROUP_PAY_STATUS' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.payStatusList = res.data
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
          this.$router.push({ path: './detail', query: { orderId: data.orderId }, replace: true })
          break
        case 'export':
          this.$handleAPI('', getGroupOrderListForExcelApi, this.filterInfo.query).then(
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
          tHeader[item] = this.tableInfo.fieldList[item].label
          filterVal[item] = this.tableInfo.fieldList[item].value
        }
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '拼团订单记录',
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
