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
      :api="listApi"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <template v-slot:col-price="scope">
        <p v-if="scope.row.price != null">{{ scope.row.price + scope.row.unitName }}</p>
      </template>
      <template v-slot:col-validDate="scope">
        <p v-if="scope.row.releaseFrom != null || scope.row.releaseTo != null">{{ scope.row.releaseFrom + '-' + scope.row.releaseTo }}</p>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi } from '@/api/common'
import { listApi, insertApi, rptApi } from '@/api/game/set'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageFilter,
    PageTable
  },
  nopicture() {
    return (
      'this.src="' +
      this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
    )
  },
  data() {
    return {
      listApi,
      insertApi,
      // 相关列表
      listTypeInfo: {
        statusList: [] // 状态列表
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: '',
          packName: '',
          appType: '',
          status: ''
        },
        list: [
          { type: 'input', label: '特惠礼包ID', value: 'id' },
          { type: 'input', label: '特惠礼包名称', value: 'setName' },
          { type: 'customselect', label: 'IOS/安卓', value: 'appType', list: 'appTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: false },
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
          { label: '特惠礼包ID', value: 'id' },
          { label: '特惠礼包名称', value: 'setName' },
          { label: '图片', value: 'imageThumbnailUrl', type: 'image' },
          { label: '有效时间', value: 'validDate', type: 'slot', width: 260 },
          { label: '礼包说明', value: 'setDescription' },
          { label: '售价', value: 'price' },
          { label: '排序', value: 'sort' },
          { label: '状态', value: 'statusName' },
          { label: 'IOS/安卓', value: 'appTypeStr' },
          { label: '创建日期', value: 'createTime' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '120',
          btList: [
            { label: '详情', tooltip: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false }
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
    this.getAppTypeList()
    this.getStatusList()
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
      this.$initDataPermits('gameSetList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('gameSetList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
    },
    getAppTypeList() {
      const params = { 'configType': 'APP_TYPE' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.appTypeList = res.data
        }
      })
    },
    getStatusList() {
      const params = { 'configType': 'GAME_ITEM_SKU_STATUS' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
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
        case 'create': { // 新增
          const props = { userId: this.staffId }
          this.$handleAPI('', insertApi, props).then(res => {
            if (Number(res.code) === 200) {
              this.$router.push({
                path: './detail',
                query: { id: res.data },
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
        case 'detail': // 详情
          this.$router.push({
            path: './detail',
            query: { id: data.id },
            replace: true
          })
          break
        case 'export': // 导出
          this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
          this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
          this.$handleAPI('', rptApi, this.filterInfo.query).then(res => {
            if (res.code === 200) {
              this.handleDownload(res.data.list)
            }
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
          })
          break
      }
    },
    handleDownload(list) {
      import('@/vendor/Export2ExcelImage').then(excel => {
        const column = [
          { title: '特惠礼包ID', key: 'id', type: 'text' },
          { title: '适用平台', key: 'appTypeStr', type: 'text' },
          { title: 'AppStore编号', key: 'iosSkuNo', type: 'text' },
          { title: '特惠礼包名称', key: 'setName', type: 'text' },
          { title: '货币类型', key: 'priceTypeStr', type: 'text' },
          { title: '特惠礼包价格', key: 'price', type: 'text' },
          { title: '特惠礼包价值', key: 'setValue', type: 'text' },
          { title: '价值单位', key: 'unitName', type: 'text' },
          { title: '特惠礼包说明', key: 'setDescription', type: 'text' },
          { title: '有效时间', key: 'releaseDate', type: 'text' },
          { title: '排序', key: 'sort', type: 'text' },
          { title: '状态', key: 'statusName', type: 'text' },
          { title: '礼包大图', key: 'imageUrl', type: 'image', width: 100, height: 100 },
          { title: '礼包商品封面缩略图', key: 'imageThumbnailUrl', type: 'image', width: 100, height: 100 }
        ]
        for (var index in list) {
          if (list[index]['imageUrl'] !== '') {
            list[index]['imageUrl'] = this.$TH.FILE_URLS.static_url + list[index]['imageUrl']
          }
          if (list[index]['imageThumbnailUrl'] !== '') {
            list[index]['imageThumbnailUrl'] = this.$TH.FILE_URLS.static_url + list[index]['imageThumbnailUrl']
          }
        }
        excel.export_table_to_excel_image(column, list, '特惠礼包一览')
      })
    }
  }
}
</script>

<style scoped>
.cardIcon {
  font-size: 40px;
}
</style>
