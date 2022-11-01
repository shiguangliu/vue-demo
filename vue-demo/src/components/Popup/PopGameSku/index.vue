<template>
  <div>
    <page-filter
      class="gameSkuFilter"
      :query.sync="popFilterInfo.query"
      :filter-list="popFilterInfo.list"
      :list-type-info="popListTypeInfo"
      :row-item-count="2"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <page-table
      class="popTable"
      :cache-params="false"
      :pager="true"
      :table-index="popTableInfo.tableIndex"
      :refresh="popTableInfo.refresh"
      :init-curpage="popTableInfo.initCurpage"
      :data.sync="popTableInfo.data"
      :api="getGameSkuListApi"
      :query="popFilterInfo.query"
      :field-list="popTableInfo.fieldList"
      :list-type-info="popListTypeInfo"
      :handle="popTableInfo.handle"
      :listen-height="popTableInfo.listenHeight"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
  </div>
</template>
<script>
import { getConfigItemsListApi } from '@/api/common'
import { getGameSkuListApi } from '@/api/popup'
import PageTable from '@/components/PageTable'
import PageFilter from '@/components/PageFilter'
export default {
  name: 'PopGameSku',
  components: {
    PageFilter,
    PageTable
  },
  props: {
    // 是否单选
    single: {
      type: Boolean,
      default: false
    },
    customQuery: {
      type: Object,
      default: null
    },
    // 选中数据
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      getGameSkuListApi,
      listLoading: false,
      // 相关列表
      popListTypeInfo: {
        itemTypeList: [],
        rareTypeList: []
      },
      // 列表过滤相关配置（检索条件）
      popFilterInfo: {
        query: {
          diff: '',
          itemType: '',
          rareType: '',
          keywords: '',
          appType: ''
        },
        list: [
          { type: 'customselect', label: '装备类型', value: 'itemType', list: 'itemTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '稀有度', value: 'rareType', list: 'rareTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'input', label: '关键词', value: 'keywords' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchGameSku', show: true }
        ]
      },
      popTableInfo: {
        refresh: 1,
        tableIndex: false, // 是否显示序号
        initCurpage: 1,
        listenHeight: false,
        data: [],
        fieldList: [
          { label: '商品ID', value: 'id', width: 80 },
          { label: '装备类型', value: 'itemTypeStr' },
          { label: '稀有度', value: 'rareType' },
          { label: '装备名称', value: 'itemName' },
          { label: '数量', value: 'quantity' },
          { label: 'IOS/安卓', value: 'appTypeStr' },
          { label: '缩略图', value: 'imageThumbnailUrl', type: 'image', width: 100 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '120',
          btList: [
            { label: '添加', type: 'primary', icon: 'el-icon-plus', event: 'pickItem', show: true }
          ]
        }
      }
    }
  },
  created() {
  },
  mounted() {
    this.popFilterInfo.query = Object.assign(this.popFilterInfo.query, this.customQuery)
    // 初始化常量
    this.initConsts()
    this.initList()
  },
  methods: {
    initConsts() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_TYPE' }).then(res => {
        if (res.code === 200) {
          var itemTypeList = res.data
          if (this.popFilterInfo.query.diff === 1) {
            for (var item of itemTypeList) {
              if (item.itemValue < 30) {
                this.popListTypeInfo.itemTypeList.push(item)
              }
            }
          } else {
            for (var item1 of itemTypeList) {
              if (item1.itemValue === this.popFilterInfo.query.itemType) {
                this.popListTypeInfo.itemTypeList.push(item1)
              }
            }
          }
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_RARE_TYPE' }).then(res => {
        if (res.code === 200) {
          this.popListTypeInfo.rareTypeList = res.data
        }
      })
    },
    initList() {
      if (this.popFilterInfo.query.diff === 1) {
        this.popTableInfo.fieldList = [
          { label: '商品ID', value: 'id', width: 80 },
          { label: '装备类型', value: 'itemTypeStr' },
          { label: '稀有度', value: 'rareType' },
          { label: '装备名称', value: 'itemName' },
          { label: '缩略图', value: 'imageThumbnailUrl', type: 'image', width: 100 }
        ]
      } else {
        this.popTableInfo.fieldList = [
          { label: '商品ID', value: 'id', width: 80 },
          { label: '装备类型', value: 'itemTypeStr' },
          { label: '装备名称', value: 'itemName' },
          { label: '数量', value: 'quantity' },
          { label: 'IOS/安卓', value: 'appTypeStr' },
          { label: '缩略图', value: 'imageThumbnailUrl', type: 'image', width: 100 }
        ]
      }
      this.popTableInfo.refresh = Math.random()
    },
    getItemTypeName: function(value) {
      for (const item of this.popListTypeInfo.itemTypeList) {
        if (Number(item.itemValue) === value) {
          return item.itemName
        }
      }
      return '未设置'
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'searchGameSku': {
          this.popTableInfo.refresh = Math.random()
          break
        }
        case 'pickItem': { // 选择某个装备
          this.$emit('pickItem', data, 'PopGameSku')
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'TODO': {
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gameSkuFilter .filter-customselect{
  min-width: auto !important;
}
.popTable {
  max-height: 500px !important;
  overflow: auto;
}
</style>
