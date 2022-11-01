<template>
  <div>
    <page-filter
      class="gameItemFilter"
      :query.sync="popFilterInfo.query"
      :filter-list="popFilterInfo.list"
      :list-type-info="popListTypeInfo"
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
      :api="getAreaSelectByList"
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
import { getAreaList, getAreaSelectByList } from '@/api/sysarea'
import PageTable from '@/components/PageTable'
import PageFilter from '@/components/PageFilter'
export default {
  name: 'PopArea',
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
      getAreaList,
      getAreaSelectByList,
      listLoading: false,
      // 相关列表
      popListTypeInfo: {
        parentsList: []
      },
      // 列表过滤相关配置（检索条件）
      popFilterInfo: {
        query: {
          areaName: '',
          status: 1,
          level: 2,
          parentId: '' // 所属上级区域ID
        },
        list: [
          { type: 'customselect', label: '所属省市', value: 'parentId', list: 'parentsList', key: 'areaId', name: 'areaName' },
          { type: 'input', label: '地区名称', value: 'areaName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchArea', show: true }
        ]
      },
      popTableInfo: {
        refresh: 1,
        tableIndex: false, // 是否显示序号
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '地区ID', value: 'areaId', width: 80 },
          { label: '地区名称', value: 'areaName' },
          { label: '上级地区ID', value: 'parentId' },
          { label: '上级地区名称', value: 'parentName' }
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
      const params = {
        'level': 1,
        'status': 1
      }
      this.$handleAPI('', getAreaList, params).then(res => {
        if (res.code === 200) {
          this.popListTypeInfo.parentsList = res.data
        }
      })
    },
    initList() {
      this.popTableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'searchArea': {
          this.popTableInfo.refresh = Math.random()
          break
        }
        case 'pickItem': { // 选择某个装备
          this.$emit('pickItem', data, 'PopArea')
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

<style lang="scss">
.gameItemFilter .filter-customselect{
  min-width: auto !important;
}
.popTable {
  max-height: 500px !important;
  overflow: auto;
}
</style>
