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
      :api="getRobotTagList"
      :query="popFilterInfo.query"
      :field-list="popTableInfo.fieldList"
      :list-type-info="popListTypeInfo"
      :handle="popTableInfo.handle"
      :check-box="popTableInfo.checkBox"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
  </div>
</template>
<script>
import { getRobotTagList } from '@/api/robot/tag/index'
import PageTable from '@/components/PageTable'
import PageFilter from '@/components/PageFilter'
export default {
  name: 'PopRobotTag',
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
      getRobotTagList,
      listLoading: false,
      checkBoxList: [],
      // 相关列表
      popListTypeInfo: {
        brandGroupList: []
      },
      // 列表过滤相关配置（检索条件）
      popFilterInfo: {
        query: {
          id: '',
          tagName: null
        },
        list: [
          { type: 'input', label: '标签ID', value: 'id' },
          { type: 'input', label: '标签名称', value: 'tagName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchRobotTag', show: true },
          { type: 'button', label: '批量添加', btType: 'primary', icon: 'el-icon-plus', event: 'pickItemBatch', show: true }
        ]
      },
      popTableInfo: {
        refresh: 1,
        initCurpage: 1,
        checkBox: true,
        data: [],
        fieldList: [
          { label: '标签ID', value: 'id', width: 90 },
          { label: '标签名称', value: 'tagName', width: 300 },
          { label: '标签说明', value: 'tagDesc' }
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
    },
    initList() {
      this.popTableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'searchRobotTag': {
          this.popTableInfo.refresh = Math.random()
          break
        }
        case 'pickItem': { // 选择某个装备
          this.$emit('pickItem', data, 'PopRobotTag')
          this.$nextTick(() => {
            this.initList()
          })
          break
        }
        case 'pickItemBatch': {
          this.$emit('pickItemBatch', this.checkBoxList, 'PopRobotTag')
          this.$nextTick(() => {
            this.initList()
          })
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
        case 'tableCheck': { // 选择
          this.checkBoxList = data
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
