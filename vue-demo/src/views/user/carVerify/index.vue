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
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, updateBatchAuthentication } from '@/api/user/carVerify/index'
import { getConfigItemsListApi, getCarBrandNameList, getCarSeriesNameList } from '@/api/common'
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
        statusList: [],
        brandNameList: [],
        seriesNameList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          plateNo: '',
          userName: '',
          phone: '',
          brandId: '',
          seriesId: '',
          status: ''
        },
        list: [
          { type: 'input', label: '车牌号码', value: 'plateNo' },
          { type: 'input', label: '用户名称', value: 'userName' },
          { type: 'input', label: '用户电话  ', value: 'phone' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '车辆品牌', value: 'brandId', list: 'brandNameList', key: 'id', name: 'brandName', event: 'changeBrandId' },
          { type: 'customselect', label: '车辆系列', value: 'seriesId', list: 'seriesNameList', key: 'id', name: 'seriesName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '审核通过', btType: 'primary', icon: 'el-icon-check', event: 'approveOK', show: false },
          { type: 'button', label: '审核不通过', btType: 'danger', icon: 'el-icon-close', event: 'approveNG', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: false,
        checkBox: true,
        data: [],
        fieldList: [
          { label: '认证ID', value: 'id' },
          { label: '用户姓名', value: 'userName' },
          { label: '车辆品牌', value: 'brandName' },
          { label: '车辆系列', value: 'seriesName' },
          { label: '车牌号', value: 'plateNo' },
          { label: '审批时间', value: 'approveTime' },
          { label: '审批人', value: 'approveName' },
          { label: '默认车辆', value: 'defaultName' },
          { label: '状态', value: 'statusName', type: 'tag' },
          { label: '创建时间', value: 'createTime', minWidth: 90 }
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
      this.$initDataPermits('userCarVerifyList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('userCarVerifyList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      // form验证
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      const params = {
        'configType': 'USER_CAR_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          console.log(res.data)
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getCarBrandNameList, '').then(res => {
        if (res.code === 200) {
          this.listTypeInfo.brandNameList = res.data
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
        merchantNo: '',
        merchantName: '',
        linkman: '',
        phone: '',
        cityId: '',
        createTime: ''
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
        case 'approveOK': { // 批量审核通过
          var idsArr = []
          let pass = true
          try {
            this.checkBoxList.forEach(item => {
              if (item.status === 1) {
                idsArr.push(item.id)
              } else {
                throw new Error('认证ID为' + item.id + '已审核，请去掉勾选')
              }
            })
          } catch (error) {
            this.$message({
              showClose: true,
              message: error.message,
              type: 'error',
              duration: 3500
            })
            pass = false
          }
          // 校验不通过，则返回
          if (!pass) {
            return
          }
          if (idsArr.length > 0) {
            const params = {
              sysUserId: this.$store.state.staff.staffId,
              'idsArr': idsArr,
              'status': 2
            }
            this.$handleAPI('', updateBatchAuthentication, params).then(res => {
              if (res.code === 200) {
                this.$message.success('认证成功')
                this.tableInfo.refresh = Math.random()
              } else {
                this.$message({
                  showClose: true,
                  message: '认证失败',
                  type: 'error',
                  duration: 3500
                })
              }
            })
          } else {
            this.$message({
              showClose: true,
              message: '请选择需要认证的数据',
              type: 'error',
              duration: 3500
            })
          }
          break
        }
        case 'approveNG': { // 审核不通过
          var idsArrs = []
          let pass = true
          try {
            this.checkBoxList.forEach(item => {
              if (item.status === 1) {
                idsArrs.push(item.id)
              } else {
                throw new Error('认证ID为' + item.id + '已审核，请去掉勾选')
              }
            })
          } catch (error) {
            this.$message({
              showClose: true,
              message: error.message,
              type: 'error',
              duration: 3500
            })
            pass = false
          }
          // 校验不通过，则返回
          if (!pass) {
            return
          }
          if (idsArrs.length > 0) {
            const params = {
              sysUserId: this.$store.state.staff.staffId,
              'idsArr': idsArrs,
              'status': 3
            }
            this.$handleAPI('', updateBatchAuthentication, params).then(res => {
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.tableInfo.refresh = Math.random()
              } else {
                this.$message({
                  showClose: true,
                  message: '操作失败',
                  type: 'error',
                  duration: 3500
                })
              }
            })
          } else {
            this.$message({
              showClose: true,
              message: '请选择需要操作的数据',
              type: 'error',
              duration: 3500
            })
          }
          break
        }
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
        case 'changeBrandId': // 对品牌选择时做处理
          this.filterInfo.query.seriesId = null
          this.listTypeInfo.seriesNameList = null
          if (this.filterInfo.query.brandId != null) {
            const params = {
              brandId: this.filterInfo.query.brandId
            }
            this.$handleAPI('', getCarSeriesNameList, params).then(res => {
              if (res.code === 200) {
                this.listTypeInfo.seriesNameList = res.data
              }
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
