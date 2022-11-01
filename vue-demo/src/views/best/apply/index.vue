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
      :check-box="tableInfo.checkBox"
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="listApi"
      :query="filterInfo.query"
      :result-set="tableInfo.resultSet"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listApi, listAllApi } from '@/api/best/apply'
import { getConfigItemsListApi, cityOptionsList, getMerchantListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'

export default {
  components: {
    PageFilter,
    PageTable
  },
  data() {
    return {
      listApi,
      listAllApi,
      downloadLoading: false,
      // checkbox 选中的列表
      checkBoxList: [],
      // 相关列表
      listTypeInfo: {
        merchantList: [], // 商户类型列表
        goodsTypeList: [],
        provinceIdOptionsList: [],
        cityOptionsList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          bestName: '',
          goodsType: '',
          merchantId: '',
          validDateRange: [],
          applyTimeFrom: '',
          applyTimeTo: '',
          phone: '',
          provinceId: '',
          cityId: ''
        },
        list: [
          { type: 'input', label: '优选名称', value: 'bestName' },
          { type: 'customselect', label: '优选类型', value: 'goodsType', list: 'goodsTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '所属商户', value: 'merchantId', list: 'merchantList', key: 'id', name: 'merchantName' },
          { type: 'input', label: '手机号', value: 'phone' },
          { type: 'datetimerange', label: '申请时间', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
          { type: 'customselect', label: '所属省级  ', value: 'provinceId', list: 'provinceIdOptionsList', key: 'areaId', name: 'areaName', event: 'changeProvinceId' },
          { type: 'customselect', label: '所属城市', value: 'cityId', list: 'cityOptionsList', key: 'areaId', name: 'areaName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '导出', btType: 'success', icon: 'el-icon-download', event: 'export', show: false },
          { type: 'button', label: '批量导出', btType: 'success', icon: 'el-icon-download', event: 'batchexport', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        tableIndex: false, // 显示序号
        checkBox: true,
        refresh: 1,
        initCurpage: 1,
        data: [],
        resultSet: '', // Api返回的结果集字段名，如:res.data.userlist,则 resultSet 为：userlist
        fieldList: [
          { label: '申请编号', value: 'applyNo' },
          { label: '优选类型', value: 'goodsTypeName' },
          { label: '优选名称', value: 'bestName' },
          { label: '所属商户', value: 'merchantName' },
          { label: '申请时间', value: 'applyTimeShow', width: 150 },
          { label: '申请人姓名', value: 'applyName', width: 80 },
          { label: '联系方式', value: 'phone' },
          { label: '性别', value: 'genderName', width: 80 },
          { label: '城市', value: 'cityName', width: 80 },
          { label: '用车时间(看车)', value: 'reservedTime', width: 150 },
          { label: '备注', value: 'remarks' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits',
      'staffId'
    ])
  },
  watch: {
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
    this.getList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('bestApplyList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_GOODS_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.goodsTypeList = res.data
        }
        this.listTypeInfo.goodsTypeList.forEach(item => {
          if (item.itemValue < 20) {
            this.listTypeInfo.goodsTypeList.splice(this.listTypeInfo.goodsTypeList.indexOf(item), 1)
          }
        })
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
    // 得到placeholder的显示
    getPlaceholder(row) {
      let placeholder
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入' + row.label
      } else if (row.type === 'select' || row.type === 'time' || row.type === 'date') {
        placeholder = '请选择' + row.label
      } else {
        placeholder = row.label
      }
      return placeholder
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
        case 'export':
          var applyList = []
          this.checkBoxList.forEach(item => {
            applyList.push(item)
          })
          if (applyList.length > 0) {
            this.handleDownload(applyList)
          } else {
            this.$message({
              showClose: true,
              message: '请选择导出的数据',
              type: 'error',
              duration: 3500
            })
          }
          break
        case 'batchexport':
          this.$handleAPI('', listAllApi, this.filterInfo.query).then(
            res => {
              if (res.code === 200) {
                this.handleDownload(res.data.list)
              }
            }
          )
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'pickDate': // 选择日期范围
          if (data) {
            this.filterInfo.query.applyTimeFrom = this.$fn.switchTime(data[0])
            this.filterInfo.query.applyTimeTo = this.$fn.switchTime(data[1])
          } else {
            this.filterInfo.query.applyTimeFrom = ''
            this.filterInfo.query.applyTimeTo = ''
          }
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
                console.log(res.data)
                this.listTypeInfo.cityOptionsList = res.data
              }
            })
          }
          break
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            item.reservedTime = this.$fn.switchTime(item.reservedTime, 'YYYY年MM月DD日')
          })
          break
        case 'tableCheck': { // 选择
          this.checkBoxList = data
          break
        }
      }
    },
    handleDownload(list) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        var tHeader = []
        var filterVal = []
        for (var item in this.tableInfo.fieldList) {
          tHeader[item] = this.tableInfo.fieldList[item].label
          filterVal[item] = this.tableInfo.fieldList[item].value
        }
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return v[j]
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
