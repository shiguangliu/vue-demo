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
import { getListApi, createApi, deleteApi, listForExport } from '@/api/merchant/merchant'
import { getConfigItemsListApi, cityOptionsList } from '@/api/common'
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
      createApi,
      deleteApi,
      // 相关列表
      listTypeInfo: {
        statusList: [],
        provinceIdOptionsList: [],
        cityOptionsList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          merchantNo: '',
          merchantName: '',
          provinceId: '',
          cityId: '',
          status: ''
        },
        list: [
          { type: 'input', label: '商户编码', value: 'merchantNo' },
          { type: 'input', label: '商户名称', value: 'merchantName' },
          { type: 'customselect', label: '所属省级  ', value: 'provinceId', list: 'provinceIdOptionsList', key: 'areaId', name: 'areaName', event: 'changeProvinceId' },
          { type: 'customselect', label: '所属城市', value: 'cityId', list: 'cityOptionsList', key: 'areaId', name: 'areaName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '商户ID', value: 'id' },
          { label: '商户编码', value: 'merchantNo' },
          { label: '商户名称', value: 'merchantName' },
          { label: '联系人', value: 'linkman' },
          { label: '联系电话', value: 'phone' },
          { label: '所属城市', value: 'areaName' },
          { label: '状态', value: 'itemName', type: 'tag' },
          { label: '创建时间', value: 'createTime', minWidth: 90 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '180',
          btList: [
            { label: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'edit', show: false },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', loading: 'deleteLoading', show: false }
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
      this.$initDataPermits('merchantDetail', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('merchantList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      // form验证
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      const params = {
        'configType': 'APPROVE_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      const param = { 'level': 1, 'status': 1 }
      this.$handleAPI('', cityOptionsList, param).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.provinceIdOptionsList = res.data
        }
      })
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    getCityList() {
      // const params = { 'level': 2, 'parentid': 'all' }
      // this.$handleAPI('', fetchAreaList, params).then(res => {
      //   if (res.stat === '0') {
      //     this.listTypeInfo.cityOptionsList = res.data.arealist
      //   }
      // })
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
        case 'create': { // 创建
          this.resetTemp()
          const params = {
            sysUserId: this.$store.state.staff.staffId
          }
          this.$handleAPI('', createApi, params).then(res => {
            if (res.code === 200) {
              this.temp.id = res.data.id
              this.temp.merchantNo = res.data.merchantNo
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
        }
        case 'edit': // 编辑 跳转
          this.$router.push({ path: './detail', query: { id: data.id }, replace: true })
          break
        case 'delete': { // 删除
          data.deleteLoading = true
          // API
          const deldata = {
            id: data.id
          }
          this.$handleAPI('delete', deleteApi, deldata).then(res => {
            data.deleteLoading = false
            if (res.code === 200) {
              tableInfo.refresh = Math.random()
              // 刷新列表
              this.initList()
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          }).catch((error) => {
            data.deleteLoading = false
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        }
        case 'export':
          this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
          this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
          this.$handleAPI('', listForExport, this.filterInfo.query).then(
            res => {
              if (res.code === 200) {
                this.handleDownload(res.data)
              }
            }
          )
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
            item.createTime = this.$fn.switchTime(item.createTime, 'YYYY-MM-DD hh:mm:ss')
          })
          break
        case 'changeProvinceId': // 对两级联动做处理
          this.filterInfo.cityOptionsList = null
          this.filterInfo.query.cityId = null
          if (this.filterInfo.query.provinceId != null) {
            const params = {
              parentId: this.filterInfo.query.provinceId,
              level: 2,
              status: 1
            }
            this.$handleAPI('', cityOptionsList, params).then(res => {
              if (res.code === 200) {
                this.listTypeInfo.cityOptionsList = res.data
              }
            })
          }
          break
        case 'todo': {
          break
        }
      }
    },
    handleDownload(list) {
      import('@/vendor/Export2ExcelImage').then(excel => {
        const column = [
          { title: '商户ID', key: 'id', type: 'text' },
          { title: '商户编码', key: 'merchantNo', type: 'text' },
          { title: '商户名称', key: 'merchantName', type: 'text' },
          { title: '商户简称', key: 'shortName', type: 'text' },
          { title: '商户简介', key: 'description', type: 'text' },
          { title: '联系人', key: 'linkman', type: 'text' },
          { title: '联系人手机', key: 'phone', type: 'text' },
          { title: '法人', key: 'legalPerson', type: 'text' },
          { title: '法人证件号', key: 'legalPersonIdno', type: 'text' },
          { title: '商户详细地址', key: 'address', type: 'text' },
          { title: '注册日期', key: 'corpRegdate', type: 'text' },
          { title: '所属省份', key: 'province', type: 'text' },
          { title: '所属城市', key: 'city', type: 'text' },
          { title: '所属区县', key: 'district', type: 'text' },
          { title: '注册电话', key: 'telno', type: 'text' },
          { title: '邮箱', key: 'email', type: 'text' },
          { title: '企业官网', key: 'portalUrl', type: 'text' },
          { title: '商户banner图片', key: 'bannerUrl', type: 'image', width: 100, height: 100 },
          { title: 'LOGO图标', key: 'logoUrl', type: 'image', width: 100, height: 100 },
          { title: '状态', key: 'itemName', type: 'text' },
          { title: '创建时间', key: 'createTime', type: 'text' }
        ]
        for (var index in list) {
          list[index]['bannerUrl'] = this.$TH.FILE_URLS.static_url + list[index]['bannerUrl']
          list[index]['logoUrl'] = this.$TH.FILE_URLS.static_url + list[index]['logoUrl']
        }
        excel.export_table_to_excel_image(column, list, '商户管理')
      })
    }
  }
}
</script>
