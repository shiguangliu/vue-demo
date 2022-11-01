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
      :api="getTransSetListApi"
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
import { getConfigItemsListApi } from '@/api/common'
import { getTransSetListApi } from '@/api/fztransset'
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
      getTransSetListApi,
      // 相关列表
      listTypeInfo: {
        statusList: [], // 状态列表
        itemTypeList: [],
        payTypeList: [],
        appTypeList: []
      },
      // 过滤相关配置（检索条件）
      poolFilterInfo: {
        query: {
          transNo: '',
          skuId: '',
          setName: '',
          userId: '',
          userPhone: '',
          itemType: '',
          payType: '',
          status: '',
          appType: ''
        },
        list: [
          { type: 'input', label: '订单编号', value: 'transNo' },
          { type: 'input', label: '商品ID', value: 'skuId' },
          { type: 'input', label: '商品名称', value: 'setName' },
          { type: 'input', label: '用户ID', value: 'userId' },
          { type: 'input', label: '手机号码', value: 'userPhone' },
          { type: 'customselect', label: '商品类型', value: 'itemType', list: 'itemTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '支付渠道', value: 'payType', list: 'payTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: 'App来源', value: 'appType', list: 'appTypeList', key: 'itemValue', name: 'itemName' },
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
          { label: '订单编号', value: 'transNo' },
          { label: '礼包名称', value: 'setName' },
          { label: '图片', value: 'imageUrl', type: 'image' },
          { label: '售价', value: 'totalAmount' },
          { label: 'APP来源', value: 'appTypeName' },
          { label: '用户ID', value: 'userId' },
          { label: '手机号码', value: 'userPhone' },
          { label: '支付方式', value: 'payTypeName' },
          { label: '支付时间', value: 'payTime' },
          { label: '状态', value: 'statusName' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '100',
          btList: [
            { label: '查看', type: 'primary', icon: 'el-icon-view', event: 'showDetail', show: true }
          ]
        }
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
      this.$initDataPermits('gameSetOrderList', this.poolFilterInfo.list) // 条件区域操作权限
    },
    initList() {
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.itemTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_TRANS_ORDER_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_PAY_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.payTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'APP_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.appTypeList = res.data
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
              this.$handleAPI('', getTransSetListApi, this.poolFilterInfo.query).then(res => {
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
        case 'showDetail':
          this.$router.push({
            path: './orderDetail',
            query: { transId: data.id },
            replace: true
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
          filename: '特惠礼包购买记录' + new Date().getTime(),
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
