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
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, deleteApi, getRptListApi } from '@/api/system/feedback'
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
      // 相关列表
      listTypeInfo: {
        statusList: [], // 状态列表
        sourceList: [], // ios or 安卓
        feedbackTypeList: [],
        sceneList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          status: '', // *状态: 1：编辑中(默认为1)'
          source: '',
          feedbackType: '',
          scene: ''
        },
        list: [
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '投诉来源类型', value: 'source', list: 'sourceList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '反馈类型', value: 'feedbackType', list: 'feedbackTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '场景', value: 'scene', list: 'sceneList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '导出', btType: 'success', icon: 'el-icon-download', event: 'export', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '投诉建议ID', value: 'id', width: 90 },
          { label: '场景', value: 'sceneName', type: 'tag', width: 100 },
          { label: '投诉建议来源', value: 'sourceName', type: 'tag', width: 110 },
          { label: '反馈类型', value: 'feedbackTypeName', type: 'tag', width: 90 },
          { label: '提交人ID', value: 'submitBy', width: 90 },
          { label: '提交人', value: 'submitByName' },
          { label: '联系电话', value: 'phone' },
          { label: '投诉建议内容', value: 'content' },
          { label: '状态', value: 'statusName', type: 'tag', width: 90 },
          { label: '反馈时间', value: 'createTime', width: 150 },
          { label: '回复处理时间', value: 'replyTime', width: 150 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: false }
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
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('feedbackList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('feedbackList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      const params = {
        'configType': 'PROCESS_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      const appTypeParams = {
        'configType': 'APP_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, appTypeParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.sourceList = res.data
        }
      })
      const fParams = {
        'configType': 'PLAT_FEEDBACK_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, fParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.feedbackTypeList = res.data
        }
      })
      const sceneParams = {
        'configType': 'APP_SCENE'
      }
      this.$handleAPI('', getConfigItemsListApi, sceneParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.sceneList = res.data
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
        case 'export': // 导出
          this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
          this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
          this.$handleAPI('', getRptListApi, this.filterInfo.query).then(res => {
            if (Number(res.code) === 200) {
              this.handleDownload(res.data)
            } else {
              this.$message.error(res.message)
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
        case 'detail': // 编辑
          var id = data.id
          this.$router.push({ path: './detail', query: { id: id, submitByName: data.submitByName }, replace: true })
          break
        case 'delete': // 删除
          this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'id': data.id,
              'staffId': this.$store.state.staff.staffId
            }
            this.deleteLoading = true
            this.$handleAPI('', deleteApi, params).then(res => {
              this.deleteLoading = false
              this.$message.success('删除成功')
              if (Number(res.code) === 200) {
                this.getList()
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error',
                  duration: 3500
                })
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
          })
          break
      }
    },
    handleDownload(list) {
      this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
      this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const column = [
          { label: '投诉建议ID', value: 'id' },
          { label: '反馈类型', value: 'feedbackTypeName' },
          { label: '场景', value: 'sceneName' },
          { label: '投诉建议来源', value: 'sourceName' },
          { label: '责备对象', value: 'reproachName' },
          { label: '提交人ID', value: 'submitBy' },
          { label: '提交人', value: 'submitByName' },
          { label: '电话', value: 'phone' },
          { label: '反馈时间', value: 'createTime' },
          { label: '状态', value: 'statusName' },
          { label: '投诉建议内容', value: 'content' },
          { label: '回复内容', value: 'replyContent' },
          { label: '回复人', value: 'replyByName' },
          { label: '回复日期', value: 'replyTime' }
        ]
        var tHeader = []
        var filterVal = []
        for (var item in column) {
          tHeader[item] = column[item].label
          filterVal[item] = column[item].value
        }
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '意见反馈' + new Date().getTime(),
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
          if (!data) {
            console.log(data)
          }
          break
      }
    }
  }
}
</script>

<style lang="scss">
  .slot-avatar{
    height: 40px;
    display: flex;
    align-items: center;
    img{
      padding-right: 10px;
    }
  }
</style>
