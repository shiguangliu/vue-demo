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
      :api="getListApi"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <template v-slot:col-validDate="scope">
        <span>{{ scope.row.validFrom }}-{{ scope.row.validTo }}</span>
      </template>
    </page-table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getListApi, createApi, deleteApi, getFzH5ListForExport } from '@/api/ad/h5'
import { getConfigItemsListApi, getMerchantListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
export default {
  components: {
    PageFilter,
    PageTable
  },
  data() {
    return {
      getListApi,
      // 相关列表
      listTypeInfo: {
        statusList: [], // 状态列表
        merchantList: [] // 所属商户
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: '',
          title: '',
          status: '', // *状态
          merchantId: '',
          validFrom: '',
          validTo: ''
        },
        list: [
          { type: 'input', label: '广告ID', value: 'id' },
          { type: 'input', label: '广告名称', value: 'title' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '所属商户', value: 'merchantId', list: 'merchantList', key: 'id', name: 'merchantName' },
          { type: 'datetimerange', label: '有效时间', value: 'valid', dateType: 'daterange', event: 'pickDate' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '新增', btType: 'success', icon: 'el-icon-plus', event: 'create', show: true },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: 'H5ID', value: 'id', width: 90 },
          { label: 'H5名称', value: 'title', width: 120 },
          { label: '图片', value: 'imageUrl', type: 'image', width: 90 },
          { label: '链接地址', value: 'jumpLink' },
          { label: '所属商户', value: 'merchantName' },
          { label: '有效时间', value: 'validDate', type: 'slot', width: 140 },
          { label: '创建时间', value: 'createTime', width: 135 },
          { label: '状态', value: 'statusName', type: 'tag', width: 90 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: [
            { tooltip: '详情', label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false },
            { tooltip: '删除', label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: false }
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
      this.$initDataPermits('adH5List', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('adH5List', this.filterInfo.list) // 条件区域操作权限
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
      const statusParams = {
        'configType': 'GENERAL_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, statusParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    // 得到placeholder的显示
    getPlaceholder(row) {
      let placeholder
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入' + row.label
      } else if (row.type === 'select' || row.type === 'time' || row.type === 'date') {
        placeholder = '请选择' + row.label
      } else {
        placeholder = row.label
      }
      return placeholder
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
          this.$router.push({ path: './detail', query: { id: data.id }, replace: true })
          break
        case 'create': // 新建
          this.$handleAPI('', createApi, { 'staffId': this.$store.state.staff.staffId }).then(res => {
            if (res.code === 200) {
              var id = res.data.id
              this.$router.push({ path: './detail', query: { id: id }, replace: true })
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          }).catch((error) => {
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        case 'delete': {
          this.$confirm('确定要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const param = { 'id': data.id, 'staffId': this.$store.state.staff.staffId }
            this.$handleAPI('', deleteApi, param).then(res => {
              if (res.code === 200) {
                this.$message.success('删除成功!')
                this.getList()
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error',
                  duration: 3500
                })
              }
            })
          })
          break
        }
        case 'export':
          this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
          this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
          this.$handleAPI('', getFzH5ListForExport, this.filterInfo.query).then(
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
          if (data) {
            data.forEach(item => {
              // item.status = this.$fn.getDataName({ dataList: this.listTypeInfo.statusList, value: 'itemValue', label: 'itemName', data: item.status + '' })
            })
          }
          break
        case 'pickDate': { //
          if (data) {
            this.filterInfo.query.validFrom = data[0]
            this.filterInfo.query.validTo = data[1]
          } else {
            this.filterInfo.query.validFrom = ''
            this.filterInfo.query.validTo = ''
          }
          break
        }
      }
    },
    handleDownload(list) {
      import('@/vendor/Export2ExcelImage').then(excel => {
        const column = [
          { title: 'H5ID', key: 'id', type: 'text' },
          { title: 'H5名称', key: 'title', type: 'text' },
          { title: '图片', key: 'imageUrl', type: 'image', width: 100, height: 100 },
          { title: '链接地址', key: 'jumpLink', type: 'text' },
          { title: '所属商户', key: 'merchantName', type: 'text' },
          { title: '有效时间', key: 'validDate', type: 'text' },
          { title: '创建时间', key: 'createTime', type: 'text' },
          { title: '状态', key: 'statusName', type: 'text' }
        ]
        for (var index in list) {
          list[index]['imageUrl'] = this.$TH.FILE_URLS.static_url + list[index]['imageUrl']
        }
        excel.export_table_to_excel_image(column, list, 'H5一览')
      })
    }
  }

}
</script>
