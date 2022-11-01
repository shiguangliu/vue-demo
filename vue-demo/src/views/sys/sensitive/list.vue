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
      <template v-slot:col-status="scope">
        <p>{{ getGeneralStatusName(scope.row.status) }}</p>
      </template>
      <template v-slot:col-content="scope">
        <p>{{ cutContent(scope.row.content) }}</p>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi } from '@/api/common'
import { getListApi, createApi, updateApi } from '@/api/syssensitivewords'
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
        statusList: [] // 状态列表
      },
      // 过滤相关配置（检索条件）
      poolFilterInfo: {
        query: {
          id: '',
          content: '',
          status: ''
        },
        list: [
          // { type: 'input', label: '敏感词ID', value: 'id' },
          // { type: 'input', label: '敏感词内容', value: 'content' },
          // { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: false, // 是否显示序号
        checkBox: false,
        data: [],
        fieldList: [
          { label: '敏感词ID', value: 'id' },
          { label: '敏感词内容', value: 'content', type: 'slot', width: '550px' },
          { label: '状态', value: 'status', type: 'slot' },
          { label: '创建日期', value: 'createTime', width: '150px' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
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
      this.$initDataPermits('sensitiveWords', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('sensitiveWords', this.poolFilterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    getGeneralStatusName(val) {
      for (const item of this.listTypeInfo.statusList) {
        if (Number(item.itemValue) === Number(val)) {
          return item.itemName
        }
      }
      return '暂未设置'
    },
    cutContent(value) {
      return value.slice(0, 50) + (value.length > 30 ? '...' : '')
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
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
          const props = { status: 1, createBy: this.staffId, updateBy: this.staffId, staffId: this.staffId }
          this.$handleAPI('', createApi, props).then(res => {
            if (Number(res.code) === 200) {
              this.$router.push({
                path: './index',
                query: { sid: res.data.id, status: res.data.status },
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
        case 'detail': // 详情
          this.$router.push({
            path: './index',
            query: { sid: data.id },
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
        case 'pickDate': // 选择日期范围
          if (data) {
            this.poolFilterInfo.query.createTimeFrom = data[0]
            this.poolFilterInfo.query.createTimeTo = data[1]
          } else {
            this.poolFilterInfo.query.createTimeFrom = ''
            this.poolFilterInfo.query.createTimeTo = ''
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
