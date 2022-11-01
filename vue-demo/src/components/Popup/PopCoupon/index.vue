<template>
  <div>
    <page-filter
      class="couponRecordFilter"
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
      :api="getCouponListApi"
      :query="popFilterInfo.query"
      :field-list="popTableInfo.fieldList"
      :list-type-info="popListTypeInfo"
      :handle="popTableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <template v-slot:col-validDate="scope">
        <p v-if="scope.row.validFrom != null || scope.row.validTo != null">{{ scope.row.validFrom + ' 至 ' + scope.row.validTo }}</p>
      </template>
      <template v-slot:col-linkRate="scope">
        <p>{{ scope.row.totalLink + '/' + scope.row.total }}</p>
      </template>
    </page-table>
  </div>
</template>
<script>
import { getConfigItemsListApi, getMerchantListApi } from '@/api/common'
import { getCouponListApi } from '@/api/popup'
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
      getCouponListApi,
      listLoading: false,
      // 相关列表
      popListTypeInfo: {
        merchantList: [],
        statusList: []
        // itemTypeList: [],
        // rareTypeList: []
      },
      // 列表过滤相关配置（检索条件）
      popFilterInfo: {
        query: {
          id: '',
          validFrom: '',
          validTo: '',
          merchantId: '',
          status: '5',
          validDateRange: this.customQuery && this.customQuery.validFrom && this.customQuery.validTo ? [this.customQuery.validFrom, this.customQuery.validTo] : [],
          priceFrom: '',
          priceTo: ''
        },
        list: [
          { type: 'input', label: '票券ID', value: 'id' },
          { type: 'customselect', label: '所属商户', value: 'merchantId', list: 'merchantList', key: 'id', name: 'merchantName' },
          { type: 'datetimerange', label: '有效时间', dateType: 'datetimerange', value: 'validDateRange', beforeAfterFlag: 'after', event: 'pickValidDate', disabled: 'disabled' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName', disabled: true },
          { type: 'input', label: '价格区间From', value: 'priceFrom', append: 'append', fixtext: '元' },
          { type: 'input', label: '价格区间To', value: 'priceTo', append: 'append', fixtext: '元' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchCoupon', show: true }
        ]
      },
      popTableInfo: {
        refresh: 1,
        tableIndex: false, // 是否显示序号
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '票券ID', value: 'id' },
          { label: '票券名称', value: 'couponName' },
          { label: '有效时间', value: 'validDate', type: 'slot', width: 270 },
          { label: '创建时间', value: 'createTime', width: 150 },
          { label: '所属商户', value: 'merchantName' },
          { label: '缩略图', value: 'thumbnailUrl', type: 'image', width: 100 },
          { label: '价格', value: 'price' },
          { label: '发放情况', value: 'linkRate', type: 'slot' },
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
    this.popFilterInfo.query = Object.assign(this.popFilterInfo.query, this.customQuery)
    // 初始化常量
    this.initConsts()
    this.initList()
  },
  methods: {
    initConsts() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.popListTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'COUPON_STATUS' }).then(res => {
        if (res.code === 200) {
          this.popListTypeInfo.statusList = res.data
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
        case 'searchCoupon': {
          this.popTableInfo.refresh = Math.random()
          break
        }
        case 'pickItem': { // 选择某个装备
          this.$emit('pickItem', data, 'PopCoupon')
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'pickValidDate': // 有效期修改
          console.log(this.popFilterInfo.query.validDateRange)
          if (this.popFilterInfo.query.validDateRange !== null) {
            this.popFilterInfo.query.validFrom = this.popFilterInfo.query.validDateRange[0]
            this.popFilterInfo.query.validTo = this.popFilterInfo.query.validDateRange[1]
          } else {
            this.popFilterInfo.query.validFrom = ''
            this.popFilterInfo.query.validTo = ''
          }
          break
      }
    }
  }
}
</script>

<style lang="scss">
.couponRecordFilter .filter-customselect{
  min-width: auto !important;
}
.popTable {
  max-height: 500px !important;
  overflow: auto;
}
</style>
