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
      :check-box="tableInfo.checkBox"
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
import { getListApi, createApi, deleteBatchApi } from '@/api/task/task'
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
      getListApi,
      // checkbox 选中的列表
      checkBoxList: [],
      // 相关列表
      listTypeInfo: {
        statusList: [], // 状态列表
        taskTypeList: [] // 所属商户
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          taskName: '',
          status: '', // *状态
          taskType: '',
          validFrom: '',
          validTo: '',
          validDateRange: [],
          createTime: ''
        },
        list: [
          { type: 'input', label: '任务ID', value: 'id' },
          { type: 'customselect', label: '任务类型', value: 'taskType', list: 'taskTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '有效时间', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '新增', btType: 'success', icon: 'el-icon-plus', event: 'create', show: true },
          { type: 'button', label: '批量删除', btType: 'danger', icon: 'el-icon-delete', event: 'delete', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        tableIndex: false, // 显示序号
        checkBox: true,
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '任务ID', value: 'id', width: 90 },
          { label: '任务类型', value: 'taskTypeName', type: 'tag' },
          { label: '有效时间', value: 'validDate', type: 'slot' },
          { label: '创建时间', value: 'createTime' },
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
      this.$initDataPermits('taskList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('taskList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      const taskTypeParams = {
        'configType': 'PLAT_TASK_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, taskTypeParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.taskTypeList = res.data
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
        case 'delete': { // 删除
          const self = this
          this.$confirm('确定要删除任务？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var ids = []
            if (data) {
              ids.push(data.id)
              data.deleteLoading = true
            } else {
              self.checkBoxList.forEach(item => {
                ids.push(item.id)
              })
            }
            if (ids.length > 0) {
              const params = {
                'ids': ids,
                'staffId': this.$store.state.staff.staffId
              }
              this.$handleAPI('', deleteBatchApi, params).then(res => {
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
            console.log()
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
          if (data) {
            data.forEach(item => {
              // item.status = this.$fn.getDataName({ dataList: this.listTypeInfo.statusList, value: 'itemValue', label: 'itemName', data: item.status + '' })
              // item.taskType = this.$fn.getDataName({ dataList: this.listTypeInfo.taskTypeList, value: 'itemValue', label: 'itemName', data: item.taskType + '' })
            })
          }
          break
        case 'tableCheck': { // 选择
          this.checkBoxList = data
          break
        }
      }
    }
  }

}
</script>
