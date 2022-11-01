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
      :api="getListApi"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      :check-box="tableInfo.checkBox"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, createApi, daleteApi, batchDaleteApi, getAdvertTripExport } from '@/api/ad/pop/index'
import { getConfigItemsListApi } from '@/api/common'
// import ThConsts from '@/constants' /* constant */
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
        statusList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: '',
          title: '',
          validDateRange: [],
          validFrom: '',
          validTo: '',
          status: '',
          sceneType: 12
        },
        list: [
          { type: 'input', label: '图片组ID', value: 'id' },
          { type: 'input', label: '图片组名称', value: 'title' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '展示有效日期', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false },
          { type: 'button', label: '批量删除', btType: 'danger', icon: 'el-icon-delete', event: 'batchdelete', show: false },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: false,
        checkBox: true,
        data: [],
        fieldList: [
          { label: '图片组ID', value: 'id' },
          { label: '图片组名称', value: 'title' },
          { label: '展示日期', value: 'validDate' },
          { label: '创建时间', value: 'createTime' },
          { label: '状态', value: 'statusName', type: 'tag' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '180',
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
      this.$initDataPermits('adTripList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('adTripList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      // form验证
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_SKU_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
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
            'sceneType': 12,
            'createby': this.$store.state.staff.staffId
          }
          this.$handleAPI('', createApi, param).then(res => {
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
        case 'batchdelete': { // 删除
          var idsArrs = []
          let pass = true
          try {
            this.checkBoxList.forEach(item => {
              idsArrs.push(item.id)
            })
          } catch (error) {
            this.$message({
              showClose: true,
              message: error.message,
              type: 'error',
              duration: 3500
            })
            pass = false
          }
          // 校验不通过，则返回
          if (!pass) {
            return
          }
          if (idsArrs.length > 0) {
            const params = {
              'updateBy': this.$store.state.staff.staffId,
              'ids': idsArrs
            }
            this.$handleAPI('delete', batchDaleteApi, params).then(res => {
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
          } else {
            this.$message({
              showClose: true,
              message: '请选择需要操作的数据',
              type: 'error',
              duration: 3500
            })
          }
          break
        }
        case 'delete':
          var params = {
            'updateBy': this.$store.state.staff.staffId,
            'id': data.id
          }
          this.$handleAPI('delete', daleteApi, params).then(res => {
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
          this.$handleAPI('', getAdvertTripExport, this.filterInfo.query).then(res => {
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
          { title: '图片组ID', key: 'id', type: 'text' },
          { title: '图片组名称', key: 'title', type: 'text' },
          { title: '展示日期', key: 'exhibitionDate', type: 'text' },
          { title: '状态', key: 'statusName', type: 'text' },
          { title: '排序', key: 'sort', type: 'text' },
          { title: '图片ID', key: 'pictureId', type: 'text' },
          { title: '图片名称', key: 'pictureName', type: 'text' },
          { title: '图片', key: 'imageUrl', type: 'image', width: 100, height: 100 },
          { title: '关联H5ID', key: 'jumpH5Id', type: 'text' },
          { title: '关联H5名称', key: 'jumpH5Name', type: 'text' },
          { title: '关联H5链接', key: 'jumpH5Link', type: 'text' },
          { title: '有效时间', key: 'validDate', type: 'text' }
        ]
        for (var index in list) {
          list[index]['imageUrl'] = this.$TH.FILE_URLS.static_url + list[index]['imageUrl']
        }
        excel.export_table_to_excel_image(column, list, '启程动态')
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
                item.validDate = item.validFrom + '~' + item.validTo
              }
              if (item.timeFrom !== null && item.timeTo !== null) {
                item.timeDate = item.timeFrom + '~' + item.timeTo
              }
              if (item.limitType === 1) {
                item.limitTypeName = item.count + '/' + item.maxTimes
              }
            })
          }
          break
        case 'todo': {
          break
        }
        case 'tableCheck': { // 选择
          this.checkBoxList = data
          break
        }
      }
    }
  }
}
</script>
