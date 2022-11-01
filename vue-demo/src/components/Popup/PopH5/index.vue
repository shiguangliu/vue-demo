<template>
  <div>
    <page-filter
      class="h5Filter"
      :query.sync="popH5FilterInfo.query"
      :filter-list="popH5FilterInfo.list"
      :list-type-info="popH5ListTypeInfo"
      :row-item-count="2"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <page-table
      class="popTable"
      :cache-params="false"
      :pager="true"
      :table-index="popH5TableInfo.tableIndex"
      :refresh="popH5TableInfo.refresh"
      :init-curpage="popH5TableInfo.initCurpage"
      :data.sync="popH5TableInfo.data"
      :api="getH5ListApi"
      :query="popH5FilterInfo.query"
      :field-list="popH5TableInfo.fieldList"
      :list-type-info="popH5ListTypeInfo"
      :handle="popH5TableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <template v-slot:col-validFromTo="scope">
        <p>{{ scope.row.validFrom + '-' + scope.row.validTo }}</p>
      </template>
    </page-table>
  </div>
</template>
<script>
import { getMerchantListApi } from '@/api/common'
import { getH5ListApi } from '@/api/popup'
import PageTable from '@/components/PageTable'
import PageFilter from '@/components/PageFilter'
export default {
  name: 'PopH5',
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
    // 查询条件
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
      getH5ListApi,
      listLoading: false,
      // 相关列表
      popH5ListTypeInfo: {
        merchantList: []
      },
      // 列表过滤相关配置（检索条件）
      popH5FilterInfo: {
        query: {
          merchantId: '',
          id: '',
          validFrom: '',
          validTo: '',
          validDateRange: this.customQuery && this.customQuery.validFrom && this.customQuery.validTo ? [this.customQuery.validFrom, this.customQuery.validTo] : [],
          keywords: '',
          status: 2
        },
        list: [
          { type: 'customselect', label: '所属商户', value: 'merchantId', list: 'merchantList', key: 'id', name: 'merchantName' },
          { type: 'input', label: '关键词', value: 'keywords' },
          { type: 'datetimerange', label: '有效时间', dateType: 'datetimerange', value: 'validDateRange', beforeAfterFlag: 'after', event: 'pickValidDate', disabled: 'disabled' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchH5', show: true }
        ]
      },
      popH5TableInfo: {
        refresh: 1,
        tableIndex: false, // 是否显示序号
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: 'H5ID', value: 'id', width: 80 },
          { label: 'H5名称', value: 'title' },
          { label: '图片', value: 'imageUrl', type: 'image', width: 100 },
          { label: '所属商户', value: 'merchantName' },
          { label: '有效时间段', value: 'validFromTo', type: 'slot', width: 300 }
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
    this.popH5FilterInfo.query = Object.assign(this.popH5FilterInfo.query, this.customQuery)
    // 初始化常量
    this.initConsts()
    this.initList()
  },
  methods: {
    initConsts() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.popH5ListTypeInfo.merchantList = res.data
        }
      })
    },
    initList() {
      this.popH5TableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'searchH5': {
          this.popH5TableInfo.refresh = Math.random()
          break
        }
        case 'pickItem': { // 选择某个装备
          this.$emit('pickItem', data, 'PopH5')
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'pickValidDate': // 有效期修改
          if (this.popH5FilterInfo.query.validDateRange !== null) {
            this.popH5FilterInfo.query.validFrom = this.popH5FilterInfo.query.validDateRange[0]
            this.popH5FilterInfo.query.validTo = this.popH5FilterInfo.query.validDateRange[1]
          } else {
            this.popH5FilterInfo.query.validFrom = ''
            this.popH5FilterInfo.query.validTo = ''
          }
          break
      }
    }
  }
}
</script>

<style lang="scss">
.h5Filter .filter-customselect {
  min-width: auto !important;
}
.popTable {
  max-height: 500px !important;
  overflow: auto;
}
</style>
