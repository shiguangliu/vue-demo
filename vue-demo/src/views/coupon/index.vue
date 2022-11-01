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
      :api="getListApi"
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
      <template v-slot:col-linkRate="scope">
        <p>{{ scope.row.totalLink + '/' + scope.row.total }}</p>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi, getMerchantListApi } from '@/api/common'
import { getListApi, createApi, updateApi, deleteMaxApi } from '@/api/fzcoupon'
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
      objTypeList: [],
      popupDialog: {
        title: '',
        typeVal: '',
        visible: false,
        btLoading: false,
        height: '600px'
      },
      checkBoxList: [],
      getListApi,
      createApi,
      // 相关列表
      listTypeInfo: {
        merchantList: [],
        statusList: [] // 状态列表
      },
      // 过滤相关配置（检索条件）
      poolFilterInfo: {
        query: {
          id: '',
          couponName: '',
          validFrom: '',
          validTo: '',
          createTimeFrom: '',
          createTimeTo: '',
          merchantId: '',
          status: '',
          validDateRange: [],
          createDateRange: []
        },
        list: [
          { type: 'input', label: '票券ID', value: 'id' },
          { type: 'input', label: '票券名称', value: 'couponName' },
          { type: 'customselect', label: '所属商户', value: 'merchantId', list: 'merchantList', key: 'id', name: 'merchantName' },
          { type: 'datetimerange', label: '有效时间', dateType: 'daterange', value: 'validDateRange', event: 'pickValidDate' },
          { type: 'datetimerange', label: '创建时间', dateType: 'daterange', value: 'createDateRange', event: 'pickCreateDate' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false },
          // { type: 'button', label: '批量删除', btType: 'danger', icon: 'el-icon-delete', event: 'batchdelete', show: false }
          { type: 'button', label: '批量删除', btType: 'danger', icon: 'el-icon-delete', event: 'batchdelete', show: true }
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
          { label: '票券ID', value: 'id' },
          { label: '票券名称', value: 'couponName' },
          { label: '有效时间', value: 'validDate', type: 'slot', width: 260 },
          { label: '创建时间', value: 'createTime', width: 150 },
          { label: '所属商户', value: 'merchantName' },
          { label: '价格', value: 'price' },
          { label: '发放情况', value: 'linkRate', type: 'slot' },
          { label: '状态', value: 'statusName' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '160',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: false }
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
    this.initRules()
    this.getList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('couponList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('couponList', this.poolFilterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'COUPON_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
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
        case 'create': {
          // 直接创建
          const props = { status: 1, createBy: this.staffId, updateBy: this.staffId, staffId: this.staffId }
          this.$handleAPI('', createApi, props).then(res => {
            if (Number(res.code) === 200) {
              this.$router.push({
                path: './detail',
                query: { couponId: res.data.id, status: res.data.status },
                replace: true
              })
            } else {
              this.$message({
                showClose: true,
                message: res.error,
                type: 'error',
                duration: 3500
              })
            }
          }).catch(error => {
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        }
        case 'delete': {
          // 发放中的票券不能删除
          if (data.status !== 1) {
            this.$message.error('仅能删除编辑中的票券！')
            return false
          }
          this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const props = { id: data.id, deleteFlag: 1, updateBy: this.staffId, staffId: this.staffId }
            this.$handleAPI('', updateApi, props).then(res => {
              this.deleteLoading = false
              if (Number(res.code) === 200) {
                this.getList()
                this.$message.success('删除成功')
              }
            }).catch((error) => {
              this.resetLoading = false
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
            })
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
        case 'batchdelete': {
          this.$confirm('确定要删除多条票券数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let errMsg = '剔除非编辑状态票券，ID为：'
            const idArr = []
            this.checkBoxList.forEach(item => {
              // 仅能删除编辑中的票券
              if (item.status === 1) {
                idArr.push(item.id)
              } else {
                errMsg += item.id + ','
              }
            })
            if (idArr.length > 0) {
              const params = {
                'couponIds': idArr,
                'staffId': this.staffId
              }
              this.$handleAPI('', deleteMaxApi, params).then(res => {
                if (res.code === 200) {
                  this.$message.success('删除成功')
                  this.getList()
                } else {
                  this.$message({
                    showClose: true,
                    message: '删除失败',
                    type: 'error',
                    duration: 3500
                  })
                }
              })
            } else {
              if (errMsg !== '剔除非编辑状态票券，ID为：') {
                this.$message.error(errMsg)
              } else {
                this.$message({
                  showClose: true,
                  message: '请选择需要删除的数据',
                  type: 'error',
                  duration: 3500
                })
              }
            }
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          break
        }
        case 'detail': // 详情
          this.$router.push({
            path: './detail',
            query: { couponId: data.id, status: data.status, objectType: data.objectType },
            replace: true
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
        case 'pickCreateDate': // 选择日期范围
          if (data) {
            this.poolFilterInfo.query.createTimeFrom = data[0]
            this.poolFilterInfo.query.createTimeTo = data[1]
          } else {
            this.poolFilterInfo.query.createTimeFrom = ''
            this.poolFilterInfo.query.createTimeTo = ''
          }
          break
        case 'pickValidDate': // 选择日期范围
          if (data) {
            this.poolFilterInfo.query.validFrom = data[0]
            this.poolFilterInfo.query.validTo = data[1]
          } else {
            this.poolFilterInfo.query.validFrom = ''
            this.poolFilterInfo.query.validTo = ''
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
