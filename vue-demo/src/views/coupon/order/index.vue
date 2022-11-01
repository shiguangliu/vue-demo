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
      :api="getAllCouponRecordListApi"
      :query="poolFilterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <template v-slot:col-validDate="scope">
        <p v-if="scope.row.validFrom != null || scope.row.validTo != null">{{ scope.row.validFrom + '-' + scope.row.validTo }}</p>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi, getMerchantListApi } from '@/api/common'
import { getAllCouponRecordListApi } from '@/api/fzcoupon'
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
      getAllCouponRecordListApi,
      // 相关列表
      listTypeInfo: {
        statusList: [], // 状态列表
        payTypeList: [],
        merchantList: []
      },
      // 过滤相关配置（检索条件）
      poolFilterInfo: {
        query: {
          id: '',
          couponName: '',
          linkPhone: '',
          validFrom: '',
          validTo: '',
          linkTimeFrom: '',
          linkTimeTo: '',
          payType: '',
          status: '',
          merchantId: '',
          payTimeFrom: '',
          payTimeTo: '',
          validDateRange: [],
          linkDateRange: [],
          payDateRange: []
        },
        list: [
          { type: 'input', label: '票券ID', value: 'id' },
          { type: 'input', label: '票券名称', value: 'couponName' },
          { type: 'input', label: '用户手机', value: 'linkPhone' },
          { type: 'datetimerange', label: '票券有效时间', dateType: 'daterange', value: 'validDateRange', event: 'pickValidDate' },
          { type: 'datetimerange', label: '领取时间', dateType: 'daterange', value: 'linkDateRange', event: 'pickLinkDate' },
          { type: 'customselect', label: '付款方式', value: 'payType', list: 'payTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '所属商户', value: 'merchantId', list: 'merchantList', key: 'id', name: 'merchantName' },
          { type: 'datetimerange', label: '购买时间', dateType: 'daterange', value: 'payDateRange', event: 'pickPayDate' },
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
          { label: '券号', value: 'couponNo' },
          // { label: '券密', value: 'couponKeyHide' },
          { label: '票券ID', value: 'id' },
          { label: '票券名称', value: 'couponName', width: 200 },
          { label: '所属商户', value: 'merchantName', width: 200 },
          { label: '状态', value: 'statusName' },
          { label: '票券有效时间', value: 'validDate', type: 'slot', width: 260 },
          { label: '用户ID', value: 'linkUserId' },
          { label: '用户手机', value: 'linkPhone' },
          { label: '领取时间', value: 'linkTime' },
          { label: '订单号', value: 'transNo' },
          { label: '购买时间', value: 'payTime' },
          { label: '实付', value: 'payAmount' },
          { label: '付款方式', value: 'payTypeName' }
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
      this.$initDataPermits('couponOrderList', this.poolFilterInfo.list) // 条件区域操作权限
    },
    initList() {
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'COUPON_RECORD_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_PAY_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.payTypeList = res.data
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
          this.checkBoxList = []
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
              this.$handleAPI('', getAllCouponRecordListApi, this.poolFilterInfo.query).then(res => {
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
          filename: '票券记录' + new Date().getTime(),
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
        case 'pickValidDate': // 选择日期范围
          if (data) {
            this.poolFilterInfo.query.validFrom = data[0]
            this.poolFilterInfo.query.validTo = data[1]
          } else {
            this.poolFilterInfo.query.validFrom = ''
            this.poolFilterInfo.query.validTo = ''
          }
          break
        case 'pickLinkDate': // 选择日期范围
          if (data) {
            this.poolFilterInfo.query.linkTimeFrom = data[0]
            this.poolFilterInfo.query.linkTimeTo = data[1]
          } else {
            this.poolFilterInfo.query.linkTimeFrom = ''
            this.poolFilterInfo.query.linkTimeTo = ''
          }
          break
        case 'pickPayDate': // 选择日期范围
          if (data) {
            this.poolFilterInfo.query.payTimeFrom = data[0]
            this.poolFilterInfo.query.payTimeTo = data[1]
          } else {
            this.poolFilterInfo.query.payTimeFrom = ''
            this.poolFilterInfo.query.payTimeTo = ''
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
