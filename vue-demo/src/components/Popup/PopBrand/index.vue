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
      :api="getListApi"
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
import { getListApi } from '@/api/merchant/carBrand'
import { getBrandGroupApi } from '@/api/common'
import PageTable from '@/components/PageTable'
import PageFilter from '@/components/PageFilter'
export default {
  name: 'Popbrand',
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
      getListApi,
      listLoading: false,
      // 相关列表
      popListTypeInfo: {
        brandGroupList: []
      },
      // 列表过滤相关配置（检索条件）
      popFilterInfo: {
        query: {
          status: 2,
          brandName: '',
          groupId: ''
        },
        list: [
          { type: 'customselect', label: '品牌组', value: 'groupId', list: 'brandGroupList', key: 'id', name: 'groupName' },
          { type: 'input', label: '品牌名称', value: 'brandName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchGameItem', show: true }
        ]
      },
      popTableInfo: {
        refresh: 1,
        tableIndex: false, // 是否显示序号
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '品牌ID', value: 'id', width: 90 },
          { label: '品牌名称', value: 'brandName' },
          { label: '首字母', value: 'firstLetter', width: 90 },
          { label: '所属品牌组', value: 'carGroupName' },
          { label: '图片', value: 'icon', type: 'image' }
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
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getBrandGroupApi, '').then(res => {
        if (res.code === 200) {
          console.log(res.data)
          this.popListTypeInfo.brandGroupList = res.data
        }
      })
      this.popTableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'searchGameItem': {
          this.popTableInfo.refresh = Math.random()
          break
        }
        case 'pickItem': { // 选择某个装备
          this.$emit('pickItem', data, 'Popbrand')
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
