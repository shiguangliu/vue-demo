<template>
  <div>
    <page-filter
      class="groupFilter"
      :query.sync="popGroupFilterInfo.query"
      :filter-list="popGroupFilterInfo.list"
      :list-type-info="popGroupListTypeInfo"
      :row-item-count="2"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <page-table
      class="popTable"
      :cache-params="false"
      :pager="true"
      :table-index="popGroupTableInfo.tableIndex"
      :refresh="popGroupTableInfo.refresh"
      :init-curpage="popGroupTableInfo.initCurpage"
      :data.sync="popGroupTableInfo.data"
      :api="getGroupListApi"
      :query="popGroupFilterInfo.query"
      :field-list="popGroupTableInfo.fieldList"
      :list-type-info="popGroupListTypeInfo"
      :handle="popGroupTableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 自定义插槽显示状态 -->
      <template v-slot:col-validDate="scope">
        <span>{{ scope.row.validFrom }}-{{ scope.row.validTo }}</span>
      </template>
    </page-table>
  </div>
</template>
<script>
import { getConfigItemsListApi, getMerchantListApi } from '@/api/common'
import { getGroupListApi } from '@/api/popup'
import PageTable from '@/components/PageTable'
import PageFilter from '@/components/PageFilter'
export default {
  name: 'PopGroup',
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
      getGroupListApi,
      listLoading: false,
      // 相关列表
      popGroupListTypeInfo: {
        tagList: [],
        merchantList: [],
        maxFlagList: [],
        multiFlagList: [],
        groupStatusList: []
      },
      // 列表过滤相关配置（检索条件）
      popGroupFilterInfo: {
        query: {
          merchantId: '',
          multiFlag: '',
          maxFlag: '',
          status: '5',
          id: '',
          validFrom: '',
          validTo: '',
          validDateRange: this.customQuery && this.customQuery.validFrom && this.customQuery.validTo ? [this.customQuery.validFrom, this.customQuery.validTo] : [],
          groupFeeFrom: '',
          groupFeeTo: '',
          keywords: ''
        },
        list: [
          { type: 'customselect', label: '所属商户', value: 'merchantId', list: 'merchantList', key: 'id', name: 'merchantName' },
          { type: 'customselect', label: '重复参与', value: 'multiFlag', list: 'multiFlagList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '拼团类型', value: 'maxFlag', list: 'maxFlagList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '拼团状态', value: 'status', list: 'groupStatusList', key: 'itemValue', name: 'itemName', disabled: true },
          { type: 'datetimerange', label: '有效时间', dateType: 'datetimerange', value: 'validDateRange', beforeAfterFlag: 'after', event: 'pickValidDate', disabled: 'disabled' },
          { type: 'input', label: '报名费用最低', value: 'groupFeeFrom' },
          { type: 'input', label: '报名费用最高', value: 'groupFeeTo' },
          { type: 'input', label: '关键词', value: 'keywords' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchGroup', show: true }
        ]
      },
      popGroupTableInfo: {
        refresh: 1,
        tableIndex: false, // 是否显示序号
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '拼团ID', value: 'id' },
          { label: '拼团名称', value: 'groupTitle' },
          { label: '拼团图片', value: 'imageUrl', type: 'image' },
          { label: '有效时间', value: 'validDate', type: 'slot', width: '150' },
          { label: '所属商户', value: 'merchantName' },
          { label: '拼团类型', value: 'maxFlag' },
          { label: '当前价格', value: 'groupPrice' },
          { label: '当前参团人数', value: 'joinCount' },
          { label: '报名费用', value: 'groupFee' },
          { label: '重复参与', value: 'multiFlag' },
          { label: '拼团状态', value: 'status' },
          { label: '权重', value: 'weight' }
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
    this.popGroupFilterInfo.query = Object.assign(this.popGroupFilterInfo.query, this.customQuery)
    // 初始化常量
    this.initConsts()
    this.initList()
  },
  methods: {
    initConsts() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.popGroupListTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GROUP_MULTI_FLAG' }).then(res => {
        if (res.code === 200) {
          this.popGroupListTypeInfo.multiFlagList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GROUP_STATUS' }).then(res => {
        if (res.code === 200) {
          this.popGroupListTypeInfo.groupStatusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GROUP_MAX_FLAG' }).then(res => {
        if (res.code === 200) {
          this.popGroupListTypeInfo.maxFlagList = res.data
        }
      })
    },
    initList() {
      this.popGroupTableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'searchGroup': {
          this.popGroupTableInfo.refresh = Math.random()
          break
        }
        case 'pickItem': { // 选择某个拼团
          this.$emit('pickItem', data, 'PopGroup')
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'pickValidDate': // 有效期修改
          if (this.popGroupFilterInfo.query.validDateRange !== null) {
            this.popGroupFilterInfo.query.validFrom = this.popGroupFilterInfo.query.validDateRange[0]
            this.popGroupFilterInfo.query.validTo = this.popGroupFilterInfo.query.validDateRange[1]
          } else {
            this.popGroupFilterInfo.query.validFrom = ''
            this.popGroupFilterInfo.query.validTo = ''
          }
          break
      }
    }
  }
}
</script>

<style lang="scss">
.groupFilter .filter-customselect {
  min-width: auto !important;
}
.popTable {
  max-height: 500px !important;
  overflow: auto;
}
</style>
