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
      :result-set="tableInfo.resultSet"
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
import { listApi, insertApi, rptApi } from '@/api/game/item'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageFilter,
    PageTable
  },
  data() {
    return {
      listApi,
      insertApi,
      // 相关列表
      listTypeInfo: {
        itemTypeList: [],
        rareTypeList: [],
        sponsorFlagList: [],
        statusList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          itemName: '',
          itemType: '',
          rareType: '',
          sponsorFlag: '',
          validDateRange: [],
          createTimeFrom: '',
          createTimeTo: '',
          status: '',
          diff: 1
        },
        list: [
          { type: 'input', label: '装备名称', value: 'itemName' },
          { type: 'customselect', label: '装备类型', value: 'itemType', list: 'itemTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '稀有度', value: 'rareType', list: 'rareTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '是否赞助', value: 'sponsorFlag', list: 'sponsorFlagList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '创建时间', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: false },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '新建', btType: 'success', icon: 'el-icon-plus', event: 'create', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        tableIndex: false, // 显示序号
        refresh: 1,
        initCurpage: 1,
        data: [],
        resultSet: '', // Api返回的结果集字段名，如:res.data.userlist,则 resultSet 为：userlist
        fieldList: [
          // 价格 投放限制 权重 状态
          { label: '装备ID', value: 'id' },
          { label: '装备名称', value: 'itemName', width: 150 },
          { label: '装备类型', value: 'itemTypeName' },
          { label: '图片', value: 'imageThumbnailUrl', type: 'image' },
          { label: '稀有度', value: 'rareTypeName', width: 80 },
          { label: '等级', value: 'level', width: 80 },
          { label: '马力', value: 'powers', width: 80 },
          { label: '稳定', value: 'stable', width: 80 },
          { label: '操控', value: 'control', width: 80 },
          { label: '性能分', value: 'performance', width: 80 },
          { label: '满级价值', value: 'maxValue' },
          { label: '是否赞助', value: 'sponsorFlagName', width: 80 },
          { label: '排序', value: 'sort' },
          { label: '创建时间', value: 'createTime', width: 150 },
          { label: '状态', value: 'statusName', width: 80 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: [
            { tooltip: '详情', label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false }
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
    ]),
    nopicture() {
      return (
        'this.src="' +
        this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
      )
    }
  },
  watch: {
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
      this.$initDataPermits('gameItemList', this.filterInfo.list) // 条件区域操作权限
      this.$initDataPermits('gameItemList', this.tableInfo.handle.btList) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_TYPE' }).then(res => {
        if (res.code === 200) {
          var itemTypeList = res.data
          for (var item of itemTypeList) {
            if (item.itemValue < 30) {
              this.listTypeInfo.itemTypeList.push(item)
            }
          }
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_RARE_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.rareTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'YES_NO' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.sponsorFlagList = res.data
        }
      })
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
        case 'create': { // 新增
          const self = this
          const params = {
            'userId': self.staffId
          }
          this.$handleAPI('', insertApi, params).then(res => {
            if (res.code === 200) {
              this.$message.success('新建成功')
              this.$router.push({ path: './detail', query: { id: res.data }, replace: true })
            } else {
              this.$message({
                message: '新建失败',
                type: 'error',
                duration: 3500
              })
            }
          })
          break
        }
        case 'detail': // 明细
          this.$router.push({ path: './detail', query: { id: data.id }, replace: true })
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
        case 'pickDate': // 选择日期范围
          if (data) {
            this.filterInfo.query.createTimeFrom = this.$fn.switchTime(data[0])
            this.filterInfo.query.createTimeTo = this.$fn.switchTime(data[1])
          } else {
            this.filterInfo.query.createTimeFrom = ''
            this.filterInfo.query.createTimeTo = ''
          }
          break
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            // this.$set(item, 'deleteLoading', false)
          })
          break
      }
    },
    handleDownload(list) {
      import('@/vendor/Export2ExcelImage').then(excel => {
        const column = [
          { title: '装备ID', key: 'id', type: 'text' },
          { title: '装备名称', key: 'itemName', type: 'text' },
          { title: '装备类型', key: 'itemTypeStr', type: 'text' },
          { title: '装备品牌名称', key: 'itemBrandName', type: 'text' },
          { title: '装备系列名称', key: 'itemSeriesName', type: 'text' },
          { title: '装备介绍', key: 'description', type: 'text' },
          { title: '装备大图', key: 'imageUrl', type: 'image', width: 100, height: 100 },
          { title: '缩略图片', key: 'imageThumbnailUrl', type: 'image', width: 100, height: 100 },
          { title: '装备品牌Logo', key: 'itemLogoUrl', type: 'image', width: 100, height: 100 },
          { title: '稀有度', key: 'rareTypeStr', type: 'text' },
          { title: '等级', key: 'itemLevel', type: 'text' },
          { title: '马力', key: 'powers', type: 'text' },
          { title: '稳定', key: 'stable', type: 'text' },
          { title: '操控', key: 'control', type: 'text' },
          { title: '性能分', key: 'performance', type: 'text' },
          { title: '装备最大等级', key: 'maxLevel', type: 'text' },
          { title: '满级价值', key: 'maxValue', type: 'text' },
          { title: '价格类型', key: 'priceTypeStr', type: 'text' },
          { title: '价格', key: 'price', type: 'text' },
          { title: '计量单位名称', key: 'unitName', type: 'text' },
          { title: '是否赞助', key: 'sponsorFlagStr', type: 'text' },
          { title: '排序', key: 'sort', type: 'text' },
          { title: '创建时间', key: 'createTime', type: 'text' },
          { title: '状态', key: 'statusName', type: 'text' }
        ]
        for (var index in list) {
          if (list[index]['imageUrl'] !== '') {
            list[index]['imageUrl'] = this.$TH.FILE_URLS.static_url + list[index]['imageUrl']
          }
          if (list[index]['imageThumbnailUrl'] !== '') {
            list[index]['imageThumbnailUrl'] = this.$TH.FILE_URLS.static_url + list[index]['imageThumbnailUrl']
          }
          if (list[index]['itemLogoUrl'] !== '') {
            list[index]['itemLogoUrl'] = this.$TH.FILE_URLS.static_url + list[index]['itemLogoUrl']
          }
        }
        excel.export_table_to_excel_image(column, list, '装备管理一览')
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
