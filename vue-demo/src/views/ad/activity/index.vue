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
      :api="getAdActivityList"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <template v-slot:col-jumpRoute="scope">
        <span v-if="scope.row.jumpType ===1">{{ scope.row.jumpLink }}</span>
        <span v-if="scope.row.jumpType ===2">{{ scope.row.jumpRoute }}</span>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAdActivityList, adActivityDel, adActivityInsert, getAdActivityExport } from '@/api/ad/activity/index'
import { listAll } from '@/api/ad/activity/detail'
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
      getAdActivityList,
      // 相关列表
      listTypeInfo: {
        statusList: [],
        activityTypeList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: '',
          activityName: '',
          validDateRange: [],
          validFrom: '',
          validTo: '',
          status: ''
        },
        list: [
          { type: 'input', label: '活动ID', value: 'id' },
          { type: 'input', label: '活动名称', value: 'activityName' },
          { type: 'customselect', label: '活动类型', value: 'activityType', list: 'activityTypeList', key: 'id', name: 'activityTypeName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '展示有效日期', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: false,
        data: [],
        fieldList: [
          { label: '活动ID', value: 'id', width: 80 },
          { label: '活动名称', value: 'activityName', width: 180 },
          { label: '活动类型名称', value: 'activityTypeName', width: 180 },
          { label: '跳转类型', value: 'jumpTypeName', width: 100 },
          { label: '跳转链接', value: 'jumpRoute', type: 'slot', width: 300 },
          { label: '有效期', value: 'validDate', width: 300 },
          { label: '活动状态', value: 'activityStatusName', width: 120 },
          { label: '状态', value: 'statusName', width: 80 },
          { label: '创建时间', value: 'createTime' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '170',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: false }
          ]
        }
      },
      temp: {
        id: undefined,
        merchantNo: '',
        merchantName: '',
        linkman: '',
        phone: '',
        cityId: '',
        createTime: ''
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
    this.getCityList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('activityList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('activityList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      // form验证
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      const params = {
        'configType': 'GAME_ITEM_SKU_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', listAll, { 'status': 2 }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.activityTypeList = res.data
        }
      })
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    getCityList() {
    },
    // reset temp
    resetTemp() {
      this.temp = {
        id: undefined,
        merchantNo: '',
        merchantName: '',
        linkman: '',
        phone: '',
        cityId: '',
        createTime: ''
      }
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
        case 'create': // 新建
          var param = {
            'createby': this.$store.state.staff.staffId
          }
          this.$handleAPI('', adActivityInsert, param).then(res => {
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
        case 'delete':
          var params = {
            'updateBy': this.$store.state.staff.staffId,
            'id': data.id
          }
          this.$handleAPI('delete', adActivityDel, params).then(res => {
            if (res.code === 200) {
              this.tableInfo.refresh = Math.random()
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          })
          break
        case 'detail': // 详情 跳转
          console.log(data.id)
          this.$router.push({ path: './detail', query: { id: data.id }, replace: true })
          break
        case 'export':
          this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
          this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
          this.$handleAPI('', getAdActivityExport, this.filterInfo.query).then(res => {
            if (res.code === 200) {
              this.handleDownload(res.data)
            }
          })
          break
      }
    },
    handleDownload(list) {
      import('@/vendor/Export2ExcelImage').then(excel => {
        const column = [
          { title: '活动ID', key: 'id', type: 'text' },
          { title: '活动名称', key: 'activityName', type: 'text' },
          { title: '活动类型名称', key: 'activityTypeName', type: 'text' },
          { title: '活动应用场景', key: 'sceneTypeName', type: 'text' },
          { title: '活动图片', key: 'imageUrl', type: 'image', width: 100, height: 100 },
          { title: '跳转类型', key: 'jumpTypeName', type: 'text' },
          { title: '跳转链接', key: 'jumpRoute', type: 'text' },
          { title: '有效期', key: 'validDate', type: 'text' },
          { title: '状态', key: 'statusName', type: 'text' },
          { title: '投放限制', key: 'createTime', type: 'text' }
        ]
        for (var index in list) {
          list[index]['imageUrl'] = this.$TH.FILE_URLS.static_url + list[index]['imageUrl']
        }
        excel.export_table_to_excel_image(column, list, '活动管理')
      })
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'pickDate': {
          if (data) {
            this.filterInfo.query.validFrom = data[0]
            this.filterInfo.query.validTo = data[1]
          } else {
            this.filterInfo.query.validFrom = ''
            this.filterInfo.query.validTo = ''
          }
          break
        }
        case 'list': // 对表格获取到的数据做处理
          if (data) {
            data.forEach(item => {
              this.$set(item, 'statusLoading', false)
              this.$set(item, 'deleteLoading', false)
              // item.approveTime = this.$fn.switchTime(item.approveTime, 'YYYY-MM-DD hh:mm:ss')
              if (item.validFrom !== null && item.validTo !== null) {
                item.validDate = item.validFrom + '  至  ' + item.validTo
              }
              if (item.validFrom === null || item.validTo === null || item.status === 1 || item.status === 2 || item.status === 3) {
                item.activityStatusName = '未开始'
              } else {
                if (item.status === 6 || item.status === 7) {
                  item.activityStatusName = '已结束'
                } else {
                  if (new Date(item.validFrom) <= new Date() && new Date(item.validTo) >= new Date()) {
                    item.activityStatusName = '进行中'
                  }
                  if (new Date(item.validFrom) > new Date()) {
                    item.activityStatusName = '未开始'
                  }
                  if (new Date(item.validTo) < new Date()) {
                    item.activityStatusName = '已结束'
                  }
                }
              }
            })
          }
          break
        case 'todo': {
          break
        }
      }
    }
  }
}
</script>
