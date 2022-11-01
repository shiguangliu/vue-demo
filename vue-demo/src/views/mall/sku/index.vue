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
      :api="getGoodsListApi"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      :check-box="tableInfo.checkBox"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 自定义插槽显示状态 -->
      <template v-slot:col-releaseDate="scope">
        <span>{{ scope.row.releaseFrom }}~{{ scope.row.releaseTo }}</span>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGoodsListApi, createGoodsApi, listForExport } from '@/api/sku/goods'
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
      getGoodsListApi,
      createGoodsApi,
      // 相关列表
      listTypeInfo: {
        itemTypeList: [{ 'itemValue': '10', 'itemName': '车辆' }, { 'itemValue': '20', 'itemName': '引擎' }, { 'itemValue': '21', 'itemName': '轮胎' }, { 'itemValue': '22', 'itemName': '方向盘' }], // 装备类型
        rareTypeList: [], // 稀有度
        sponsorFlagList: [], // 是否赞助
        statusList: [] // 商品状态
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          // id: '',
          itemName: '',
          itemType: '',
          rareType: '',
          sponsorFlag: '',
          releaseFrom: '',
          releaseTo: '',
          releaseDateRange: [],
          status: ''
        },
        list: [
          // { type: 'input', label: '商品ID', value: 'id' },
          { type: 'input', label: '商品名称', value: 'itemName' },
          { type: 'customselect', label: '装备类型', value: 'itemType', list: 'itemTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '稀有度', value: 'rareType', list: 'rareTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '是否赞助', value: 'sponsorFlag', list: 'sponsorFlagList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '有效时间', dateType: 'daterange', value: 'releaseDateRange', event: 'pickDate' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '新建', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: false, // 是否显示序号
        data: [],
        fieldList: [
          { label: '商品ID', value: 'id' },
          { label: '商品名称', value: 'itemName' },
          { label: '商品类型', value: 'itemFlagStr' },
          { label: '装备类型', value: 'itemTypeStr' },
          { label: '图片', value: 'imageThumbnailUrl', type: 'image' },
          { label: '稀有度', value: 'rareTypeStr' },
          { label: '是否赞助', value: 'sponsorFlagStr' },
          { label: '货币类型', value: 'priceTypeStr' },
          { label: '价格', value: 'price' },
          { label: '有效时间', value: 'releaseDate', type: 'slot', width: '260' },
          { label: '状态', value: 'statusStr', type: 'tag', width: '80' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '100',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false }
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
    // this.getItemTypeList()
    this.getRareTypeList()
    this.getSponsorFlagList()
    this.getStatusList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('skuList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('skuList', this.filterInfo.list) // 条件区域操作权限
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
    // getItemTypeList() {
    //   const params = { 'configType': 'GAME_ITEM_TYPE' }
    //   this.$handleAPI('', getConfigItemsListApi, params).then(res => {
    //     if (res.code === 200) {
    //       this.listTypeInfo.itemTypeList = res.data
    //     }
    //   })
    // },
    getRareTypeList() {
      const params = { 'configType': 'GAME_ITEM_RARE_TYPE' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.rareTypeList = res.data
        }
      })
    },
    getSponsorFlagList() {
      const params = { 'configType': 'YES_NO' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.sponsorFlagList = res.data
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
          this.$handleAPI('', createGoodsApi, params).then(res => {
            if (res.code === 200) {
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success',
                duration: 3500
              })
              this.$router.push({ path: './detail', query: { id: res.data }, replace: true })
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
          this.$router.push({ path: './detail', query: { id: data.id }, replace: true })
          break
        case 'export':
          this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
          this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
          this.$handleAPI('', listForExport, this.filterInfo.query).then(
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
            this.filterInfo.query.releaseFrom = data[0]
            this.filterInfo.query.releaseTo = data[1]
          } else {
            this.filterInfo.query.releaseFrom = ''
            this.filterInfo.query.releaseTo = ''
          }
          break
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
          })
          break
      }
    },
    handleDownload(list) {
      import('@/vendor/Export2ExcelImage').then(excel => {
        const column = [
          { title: '商品ID', key: 'id', type: 'text' },
          { title: '商品名称', key: 'itemName', type: 'text' },
          { title: '商品类型', key: 'itemFlagStr', type: 'text' },
          { title: '装备类型', key: 'itemTypeStr', type: 'text' },
          { title: '稀有度', key: 'rareTypeStr', type: 'text' },
          { title: '是否赞助', key: 'sponsorFlagStr', type: 'text' },
          { title: '货币类型', key: 'priceTypeStr', type: 'text' },
          { title: '价格', key: 'price', type: 'text' },
          { title: '有效时间', key: 'releaseDate', type: 'text' },
          { title: '状态', key: 'statusStr', type: 'text' },
          { title: '图片', key: 'imageThumbnailUrl', type: 'image', width: 100, height: 100 }
        ]
        for (var index in list) {
          list[index]['imageThumbnailUrl'] = this.$TH.FILE_URLS.static_url + list[index]['imageThumbnailUrl']
        }
        excel.export_table_to_excel_image(column, list, '商品管理')
      })
    }
  }
}
</script>
