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
      :table-index="tableInfo.tableIndex"
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getListApi"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      :check-box="tableInfo.checkBox"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 自定义插槽显示状态 -->
      <template v-slot:col-validDate="scope">
        <span>{{ scope.row.validFrom }}--{{ scope.row.validTo }}</span>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, createApi } from '@/api/game/banner/index'
import { getConfigItemsListApi } from '@/api/common'
// import ThConsts from '@/constants' /* constant */
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
      // checkbox 选中的列表
      checkBoxList: [],
      // 相关列表
      listTypeInfo: {
        statusList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          title: '',
          status: ''
        },
        list: [
          { type: 'input', label: 'banner名称', value: 'title' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '新建', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: 'ID', value: 'id', width: 80 },
          { label: 'banner名称', value: 'title', width: 200 },
          { label: '图片', value: 'fileLink', type: 'image', width: 120 },
          { label: '有效时间', value: 'validDate', type: 'slot', width: 300 },
          { label: '说明', value: 'description' },
          { label: '排序', value: 'sort', width: 80 },
          { label: '状态', value: 'statusName', type: 'tag', width: 120 },
          { label: '创建时间', value: 'createTime', width: 150 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '100',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false }
          ]
        }
      },
      temp: {
        id: undefined,
        merchantNo: '',
        merchantName: '',
        linkman: '',
        phone: '',
        cityId: '',
        createTime: ''
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
    this.getCityList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('gameBannerList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('gameBannerList', this.filterInfo.list) // 条件区域操作权限
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
          console.log(res.data)
          this.listTypeInfo.statusList = res.data
        }
      })
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    getCityList() {
    },
    // reset temp
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        subtitle: '',
        validFrom: '',
        validTo: '',
        description: '',
        fileType: '',
        fileLink: '',
        fileStyle: '',
        duration: '',
        jumpType: '',
        jumpH5Id: '',
        jumpRoute: '',
        sort: '',
        status: ''
      }
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
        case 'create': // 新建
          this.resetTemp()
          var params = {
            'createBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', createApi, params).then(res => {
            if (res.code === 200) {
              this.temp.id = res.data.id
              tableInfo.data.unshift(this.temp)
              this.$message({
                showClose: true,
                message: '创建成功',
                type: 'success',
                duration: 3500
              })
              this.$router.push({ path: './detail', query: { id: this.temp.id }, replace: true })
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          }).catch((error) => {
            this.resetTemp()
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        case 'detail': // 详情 跳转
          console.log(data.id)
          this.$router.push({ path: './detail', query: { id: data.id }, replace: true })
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          console.log(data)
          if (!data) {
            data.forEach(item => {
              this.$set(item, 'statusLoading', false)
              this.$set(item, 'deleteLoading', false)
              item.approveTime = this.$fn.switchTime(item.approveTime, 'YYYY-MM-DD hh:mm:ss')
            })
          }
          break
        case 'todo': {
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
