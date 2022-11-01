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
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getListApi"
      :query="filterInfo.query"
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
import { getListApi, giftPackInsert } from '@/api/gift/pack/index'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'

export default {
  components: {
    PageFilter,
    PageTable
  },
  data() {
    return {
      getListApi,
      // 相关列表
      listTypeInfo: {
        statusList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: null,
          packName: null,
          status: null
        },
        list: [
          { type: 'input', label: '新手礼包ID', value: 'id' },
          { type: 'input', label: '新手礼包名称', value: 'packName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '新增', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '新手礼包ID', value: 'id', minWidth: 30 },
          { label: '新手礼包商品', value: 'packNameString' },
          { label: '有效时间', value: 'validFrom', minWidth: 60 },
          { label: '状态', value: 'statusName', type: 'tag', minWidth: 30 },
          { label: '创建时间', value: 'createTime', minWidth: 50 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '100',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits'
    ])
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
    this.getList()
  },
  created() {
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('giftPackList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('giftPackList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      // form验证
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      const params = {
        'configType': 'GENERAL_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
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
        case 'create': // 编辑 跳转
          var param = {
            'createBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', giftPackInsert, param).then(res => {
            if (res.code === 200) {
              this.$router.push({ path: './detail', query: { id: res.data.id }, replace: true })
            }
            this.$message({
              showClose: true,
              message: (res.code === 200) ? '新增成功' : res.message,
              type: (res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          })
          break
        case 'detail': // 编辑 跳转
          this.$router.push({ path: './detail', query: { id: data.id }, replace: true })
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            this.$set(item, 'statusLoading', false)
            this.$set(item, 'deleteLoading', false)
            item.validFrom = item.validFrom + '~' + item.validTo
          })
          break
        case 'todo': {
          break
        }
      }
    }
  }
}
</script>
