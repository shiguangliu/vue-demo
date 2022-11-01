<template>
  <div>
    <page-filter
      class="gameItemFilter"
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
      :api="getGameItemListApi"
      :query="popFilterInfo.query"
      :field-list="popTableInfo.fieldList"
      :list-type-info="popListTypeInfo"
      :handle="popTableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
  </div>
</template>
<script>
import { getConfigItemsListApi } from '@/api/common'
import { getGameItemListApi } from '@/api/popup'
import PageTable from '@/components/PageTable'
import PageFilter from '@/components/PageFilter'
export default {
  name: 'PopGameItem',
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
      getGameItemListApi,
      listLoading: false,
      // 相关列表
      popListTypeInfo: {
        itemTypeList: [],
        rareTypeList: []
      },
      // 列表过滤相关配置（检索条件）
      popFilterInfo: {
        query: {
          itemType: '',
          rareType: '',
          id: '',
          keywords: '',
          status: 2
        },
        list: [
          { type: 'customselect', label: '装备类型', value: 'itemType', list: 'itemTypeList', key: 'itemValue', name: 'itemName', disabled: true },
          { type: 'customselect', label: '稀有度', value: 'rareType', list: 'rareTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'input', label: '关键词', value: 'keywords' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchGameItem', show: true }
        ]
      },
      popTableInfo: {
        refresh: 1,
        tableIndex: false, // 是否显示序号
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '装备ID', value: 'id', width: 80 },
          { label: '装备类型', value: 'itemTypeName' },
          { label: '稀有度', value: 'rareTypeName' },
          { label: '装备名称', value: 'itemName' },
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
          this.popListTypeInfo.itemTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_RARE_TYPE' }).then(res => {
        if (res.code === 200) {
          this.popListTypeInfo.rareTypeList = res.data
        }
      })
    },
    initList() {
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
        case 'searchGameItem': {
          this.popTableInfo.refresh = Math.random()
          break
        }
        case 'pickItem': { // 选择某个装备
          this.$emit('pickItem', data, 'PopGameItem')
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
.gameItemFilter .filter-customselect{
  min-width: auto !important;
}
.popTable {
  max-height: 500px !important;
  overflow: auto;
}
</style>
