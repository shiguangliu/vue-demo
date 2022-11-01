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
      :table-index="tableInfo.tableIndex"
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getGroupListApi"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      :check-box="tableInfo.checkBox"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 自定义插槽显示状态 -->
      <template v-slot:col-validDate="scope">
        <span>{{ scope.row.validFrom }}-{{ scope.row.validTo }}</span>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGroupListApi, createGroupApi, deleteGroupApi, getMerchantListApi, getGroupListForExport } from '@/api/group/groupInfo'
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
      getGroupListApi,
      createGroupApi,
      deleteGroupApi,
      // checkbox 选中的列表
      checkBoxList: [],
      // 相关列表
      listTypeInfo: {
        merchantList: [], // 商户列表
        maxFlagList: [], // 拼团是否有上限-拼团类型
        payFlagList: [], // 拼团是否需要报名费-报名费用
        multiFlagList: [], // 是否可重复参与
        statusList: [] // 拼团状态
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          groupTitle: '',
          merchantId: '',
          maxFlag: '',
          validDateRange: [],
          validFrom: '',
          validTo: '',
          payFlag: '',
          multiFlag: '',
          status: ''
        },
        list: [
          { type: 'input', label: '拼团名称', value: 'groupTitle' },
          { type: 'customselect', label: '所属商户', value: 'merchantId', list: 'merchantList', key: 'id', name: 'merchantName' },
          { type: 'customselect', label: '拼团类型', value: 'maxFlag', list: 'maxFlagList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '拼团状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '有效时间', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
          { type: 'customselect', label: '付费标志', value: 'payFlag', list: 'payFlagList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '重复参与', value: 'multiFlag', list: 'multiFlagList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false },
          { type: 'button', label: '批量删除', btType: 'danger', icon: 'el-icon-delete', event: 'delete', loading: 'deleteLoading', show: false },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: false }
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
          { label: '拼团ID', value: 'id' },
          { label: '拼团名称', value: 'groupTitle' },
          { label: '拼团图片', value: 'imageUrl', type: 'image' },
          { label: '有效时间', value: 'validDate', type: 'slot', width: '150' },
          { label: '所属商户', value: 'merchantName' },
          { label: '拼团类型', value: 'maxFlag' },
          { label: '当前价格', value: 'groupPrice' },
          { label: '当前参团人数', value: 'joinCount' },
          { label: '报名费用', value: 'groupFee' },
          { label: '重复参与', value: 'multiFlag' },
          { label: '拼团状态', value: 'status', type: 'tag' },
          { label: '权重', value: 'weight' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '180',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', loading: 'deleteLoading', show: false }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits',
      'staffId'
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
    this.getMaxFlagList()
    this.getPayFlagList()
    this.getMultiFlagList()
    this.getStatusList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('groupList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('groupList', this.filterInfo.list) // 条件区域操作权限
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
    getMaxFlagList() {
      const params = { 'configType': 'GROUP_MAX_FLAG' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.maxFlagList = res.data
        }
      })
    },
    getPayFlagList() {
      const params = { 'configType': 'GROUP_PAY_FLAG' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.payFlagList = res.data
        }
      })
    },
    getMultiFlagList() {
      const params = { 'configType': 'GROUP_MULTI_FLAG' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.multiFlagList = res.data
        }
      })
    },
    getStatusList() {
      const params = { 'configType': 'GROUP_STATUS' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
    },
    // 按钮点击1
    handleClick(event, data) {
      const tableInfo = this.tableInfo
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'create': { // 创建
          const self = this
          const params = { operatorId: self.staffId }
          this.$handleAPI('', createGroupApi, params).then(res => {
            if (res.code === 200) {
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success',
                duration: 3500
              })
              this.$router.push({ path: './detail', query: { groupId: res.data }, replace: true })
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          }).catch((error) => {
            this.resetTemp()
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        }
        case 'detail': // 编辑 跳转
          this.$router.push({ path: './detail', query: { groupId: data.id }, replace: true })
          break
        case 'delete': { // 删除
          const self = this
          this.$confirm('确定要删除拼团？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var groupIdarr = []
            if (data) {
              groupIdarr.push(data.id)
              data.deleteLoading = true
            } else {
              self.checkBoxList.forEach(item => {
                groupIdarr.push(item.id)
              })
            }
            if (groupIdarr.length > 0) {
              const params = {
                'groupIds': groupIdarr,
                'operatorId': self.staffId
              }
              this.$handleAPI('', deleteGroupApi, params).then(res => {
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
              this.$message({
                showClose: true,
                message: '请选择需要删除的数据',
                type: 'error',
                duration: 3500
              })
            }
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          if (data) {
            data.deleteLoading = false
          }
          break
        }
        case 'export':
          this.$handleAPI('', getGroupListForExport, this.filterInfo.query).then(
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
            this.filterInfo.query.validFrom = data[0]
            this.filterInfo.query.validTo = data[1]
          } else {
            this.filterInfo.query.validFrom = ''
            this.filterInfo.query.validTo = ''
          }
          break
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            this.$set(item, 'deleteLoading', false)
          })
          break
        case 'tableCheck': { // 选择
          this.checkBoxList = data
          break
        }
      }
    },
    handleDownload(list) {
      import('@/vendor/Export2ExcelImage').then(excel => {
        const column = [
          { title: '拼团ID', key: 'id', type: 'text', width: 100 },
          { title: '拼团名称', key: 'groupTitle', type: 'text', width: 200 },
          { title: '拼团子标题', key: 'groupSubtitle', type: 'text', width: 200 },
          { title: '所属商户', key: 'merchantName', type: 'text', width: 200 },
          { title: '客服电话', key: 'contact', type: 'text', width: 100 },
          { title: '报名方式', key: 'payFlag', type: 'text', width: 100 },
          { title: '报名费', key: 'groupFee', type: 'text', width: 100 },
          { title: '重复参与', key: 'multiFlag', type: 'text', width: 100 },
          { title: '是否邮寄', key: 'deliveryFlag', type: 'text', width: 100 },
          { title: '权重', key: 'weight', type: 'text', width: 100 },
          { title: '拼团类型', key: 'maxFlag', type: 'text', width: 100 },
          { title: '有效时间', key: 'validDate', type: 'text', width: 400 },
          { title: '拼团状态', key: 'statusText', type: 'text', width: 100 },
          { title: '当前价格', key: 'groupPrice', type: 'text', width: 100 },
          { title: '当前参团人数', key: 'joinCount', type: 'text', width: 100 },
          { title: '拼团图片', key: 'imageUrl', type: 'image', width: 100, height: 100 },
          { title: '一路所获缩略图', key: 'iconUrl', type: 'image', width: 100, height: 100 },
          { title: '拼团分享缩略图', key: 'shareImageUrl', type: 'image', width: 100, height: 100 }
        ]
        for (var index in list) {
          list[index]['imageUrl'] = this.$TH.FILE_URLS.static_url + list[index]['imageUrl']
          list[index]['iconUrl'] = this.$TH.FILE_URLS.static_url + list[index]['iconUrl']
          list[index]['shareImageUrl'] = this.$TH.FILE_URLS.static_url + list[index]['shareImageUrl']
        }
        excel.export_table_to_excel_image(column, list, '拼团一览')
      })
    }
  }
}
</script>
