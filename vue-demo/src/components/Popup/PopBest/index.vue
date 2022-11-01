<template>
  <div>
    <page-filter
      class="bestFilter"
      :query.sync="popBestFilterInfo.query"
      :filter-list="popBestFilterInfo.list"
      :list-type-info="popBestListTypeInfo"
      :row-item-count="2"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <page-table
      class="popTable"
      :cache-params="false"
      :pager="true"
      :table-index="popBestTableInfo.tableIndex"
      :refresh="popBestTableInfo.refresh"
      :init-curpage="popBestTableInfo.initCurpage"
      :data.sync="popBestTableInfo.data"
      :api="getBestListApi"
      :query="popBestFilterInfo.query"
      :field-list="popBestTableInfo.fieldList"
      :list-type-info="popBestListTypeInfo"
      :handle="popBestTableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
  </div>
</template>
<script>
import { getConfigItemsListApi, getMerchantListApi, getBestTagListApi } from '@/api/common'
import { getBestListApi } from '@/api/popup'
import PageTable from '@/components/PageTable'
import PageFilter from '@/components/PageFilter'
export default {
  name: 'PopBest',
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
      getBestListApi,
      listLoading: false,
      // 相关列表
      popBestListTypeInfo: {
        tagList: [],
        merchantList: [],
        objectTypeList: [],
        advFlagList: []
      },
      // 列表过滤相关配置（检索条件）
      popBestFilterInfo: {
        query: {
          tagId: '',
          merchantId: '',
          objectType: '',
          advFlag: '',
          id: '',
          validDateRange: this.customQuery && this.customQuery.validFrom && this.customQuery.validTo ? [this.customQuery.validFrom, this.customQuery.validTo] : [],
          validFrom: '',
          validTo: '',
          keywords: '',
          status: 2
        },
        list: [
          { type: 'customselect', label: '优选标签', value: 'tagId', list: 'tagList', key: 'tagId', name: 'tagName' },
          { type: 'customselect', label: '所属商户', value: 'merchantId', list: 'merchantList', key: 'id', name: 'merchantName' },
          { type: 'customselect', label: '类型', value: 'objectType', list: 'objectTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '性质', value: 'advFlag', list: 'advFlagList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '有效时间', dateType: 'datetimerange', beforeAfterFlag: 'after', value: 'validDateRange', event: 'pickValidDate', disabled: 'disabled' },
          { type: 'input', label: '关键词', value: 'keywords' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchBest', show: true }
        ]
      },
      popBestTableInfo: {
        refresh: 1,
        tableIndex: false, // 是否显示序号
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '优选ID', value: 'id', width: 80 },
          { label: '优选标签', value: 'tagName' },
          { label: '优选名称', value: 'bestName' },
          { label: '图片', value: 'imageUrl', type: 'image', width: 100 },
          { label: '所属商户', value: 'merchantName' },
          { label: '类型', value: 'objectTypeName' },
          { label: '性质', value: 'advFlagName' },
          { label: '有效时间段', value: 'validFromTo', width: 300 },
          { label: '状态', value: 'statusName' }
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
    this.popBestFilterInfo.query = Object.assign(this.popBestFilterInfo.query, this.customQuery)
    console.log(this)
    // 初始化常量
    this.initConsts()
    this.initList()
  },
  methods: {
    initConsts() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.popBestListTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'BEST_ADV_FLAG' }).then(res => {
        if (res.code === 200) {
          this.popBestListTypeInfo.advFlagList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'BEST_OBJECT_TYPE' }).then(res => {
        if (res.code === 200) {
          this.popBestListTypeInfo.objectTypeList = res.data
        }
      })
      this.$handleAPI('', getBestTagListApi, {}).then(res => {
        if (res.code === 200) {
          this.popBestListTypeInfo.tagList = res.data.list
        }
      })
    },
    initList() {
      this.popBestTableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'searchBest': {
          this.popBestTableInfo.refresh = Math.random()
          break
        }
        case 'pickItem': { // 选择某个装备
          this.$emit('pickItem', data, 'PopBest')
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'pickValidDate': // 有效期修改
          if (this.popBestFilterInfo.query.validDateRange !== null) {
            this.popBestFilterInfo.query.validFrom = this.popBestFilterInfo.query.validDateRange[0]
            this.popBestFilterInfo.query.validTo = this.popBestFilterInfo.query.validDateRange[1]
          } else {
            this.popBestFilterInfo.query.validFrom = ''
            this.popBestFilterInfo.query.validTo = ''
          }
          break
      }
    }
  }
}
</script>

<style lang="scss">
.bestFilter .filter-customselect {
  min-width: auto !important;
}
.popTable {
  max-height: 500px !important;
  overflow: auto;
}
</style>
