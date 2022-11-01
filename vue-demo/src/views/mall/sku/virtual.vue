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
      :api="getVirtualListApi"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      :check-box="tableInfo.checkBox"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <page-dialog
      :title="dialogCreate.title"
      :visible.sync="dialogCreate.visible"
      :width="dialogCreate.width"
      :bt-loading="dialogCreate.btLoading"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <el-row>
        <el-col :span="24" class="diaglog-title">请选择新增类型</el-col>
      </el-row>
      <el-row class="btnView">
        <el-col :span="12">
          <el-button @click="handleClick('createForType' ,30)"><i class="el-icon-coin" /><br><div class="text">金币类</div></el-button>
        </el-col>
        <el-col :span="12">
          <el-button @click="handleClick('createForType', 31)"><i class="fa fa-diamond svg-icon" /><br><div class="text">钻石类</div></el-button>
        </el-col>
      </el-row>
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getVirtualListApi, createVirtualApi, virtualListForExport } from '@/api/sku/virtual.js'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'

export default {
  components: {
    PageFilter,
    PageTable,
    PageDialog
  },
  data() {
    return {
      getVirtualListApi,
      createVirtualApi,
      // 相关列表
      listTypeInfo: {
        itemTypeList: [{ 'itemValue': '30', 'itemName': '金币' }, { 'itemValue': '31', 'itemName': '钻石' }], // 装备类型
        appTypeList: [], // 平台
        statusList: [] // 状态
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          // id: '',
          itemName: '',
          itemType: '',
          appType: '',
          status: ''
        },
        list: [
          // { type: 'input', label: '商品ID', value: 'id' },
          { type: 'input', label: '商品名称', value: 'itemName' },
          { type: 'customselect', label: '商品类型', value: 'itemType', list: 'itemTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: 'IOS/安卓', value: 'appType', list: 'appTypeList', key: 'itemValue', name: 'itemName' },
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
          { label: '商品类型', value: 'itemTypeStr' },
          { label: '图片', value: 'imageThumbnailUrl', type: 'image' },
          { label: '售价', value: 'priceText' },
          { label: '获得', value: 'quantityText' },
          { label: '排序', value: 'sort' },
          { label: '状态', value: 'statusStr', type: 'tag' },
          { label: 'IOS/安卓', value: 'appTypeStr' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '120',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false }
          ]
        }
      },
      // 新建优选
      dialogCreate: {
        title: '温馨提示',
        visible: false,
        type: '',
        btLoading: false,
        width: '400px',
        btList: []
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
    this.getAppTypeList()
    this.getStatusList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('skuVirtualList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('skuVirtualList', this.filterInfo.list) // 条件区域操作权限
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
    // 按钮点击1
    handleClick(event, data) {
      const tableInfo = this.tableInfo
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'create': // 新建
          this.dialogCreate.visible = true
          break
        case 'createForType': { // 创建
          const self = this
          const params = { operatorId: self.staffId, 'itemType': data }
          this.$handleAPI('', createVirtualApi, params).then(res => {
            if (res.code === 200) {
              this.dialogCreate.visible = false
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success',
                duration: 3500
              })
              this.$router.push({ path: './virtualDetail', query: { id: res.data }, replace: true })
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
          this.$router.push({ path: './virtualDetail', query: { id: data.id }, replace: true })
          break
        case 'export':
          this.$handleAPI('', virtualListForExport, this.filterInfo.query).then(
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
          if (!data) return
          data.forEach(item => {
          })
          break
      }
    },
    handleDownload(list) {
      import('@/vendor/Export2ExcelImage').then(excel => {
        const column = [
          { title: '商品ID', key: 'id', type: 'text', width: 100 },
          { title: '商品名称', key: 'itemName', type: 'text', width: 200 },
          { title: '商品类型', key: 'itemTypeStr', type: 'text', width: 200 },
          { title: '有效时间', key: 'releaseDate', type: 'text', width: 400 },
          { title: '支付方式', key: 'priceTypeStr', type: 'text', width: 100 },
          { title: '售价', key: 'price', type: 'text', width: 100 },
          { title: '获得数量', key: 'quantity', type: 'text', width: 100 },
          { title: '排序', key: 'sort', type: 'text', width: 100 },
          { title: '状态', key: 'statusStr', type: 'text', width: 100 },
          { title: '上架平台区分', key: 'appTypeStr', type: 'text', width: 100 },
          { title: 'AppStore编号', key: 'iosSkuNo', type: 'text', width: 100 },
          { title: '商品图片', key: 'imageUrl', type: 'image', width: 100, height: 100 },
          { title: '游戏币图片', key: 'baseImageUrl', type: 'image', width: 100, height: 100 }
        ]
        for (var index in list) {
          list[index]['imageUrl'] = this.$TH.FILE_URLS.static_url + list[index]['imageUrl']
          list[index]['baseImageUrl'] = this.$TH.FILE_URLS.static_url + list[index]['baseImageUrl']
        }
        excel.export_table_to_excel_image(column, list, '游戏币管理')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.diaglog-title {
  text-align: center;
  color: green;
  font-size: 16px;
  font-weight: bold;
}
.btnView {
  margin-top: 30px;
  margin-bottom: 20px;
  .el-col-12 {
    text-align: center;
    .el-button {
      width: 120px;
      height: 120px;
      font-size: 60px;
      .text {
        margin-top: 10px;
        font-size: 20px;
      }
    }
  }
}
</style>
