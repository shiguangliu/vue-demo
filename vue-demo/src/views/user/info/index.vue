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
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="uploadRuleExcel">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, userBatchDelete, refreshNickName } from '@/api/user/info/index'
import { getConfigItemsListApi, cityOptionsList } from '@/api/common'
// import ThConsts from '@/constants' /* constant */
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import XLSX from 'xlsx'

export default {
  components: {
    PageFilter,
    PageTable
  },
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      getListApi,
      // checkbox 选中的列表
      checkBoxList: [],
      nickNameList: [],
      // 相关列表
      listTypeInfo: {
        statusList: [],
        sourceList: [],
        genderList: [],
        userTypeList: [],
        provinceIdOptionsList: [],
        cityOptionsList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          userId: '',
          nickName: null,
          userName: null,
          phone: null,
          idno: null,
          gender: null,
          provinceId: null,
          cityId: null,
          status: null,
          source: null
        },
        list: [
          { type: 'input', label: '用户ID', value: 'userId' },
          { type: 'input', label: '昵称', value: 'nickName' },
          { type: 'input', label: '真实姓名', value: 'userName' },
          { type: 'input', label: '电话号码', value: 'phone' },
          { type: 'input', label: '身份证号码', value: 'idno' },
          { type: 'customselect', label: '用户类型', value: 'userType', list: 'userTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '性别', value: 'gender', list: 'genderList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '所属省级  ', value: 'provinceId', list: 'provinceIdOptionsList', key: 'areaId', name: 'areaName', event: 'changeProvinceId' },
          { type: 'customselect', label: '所属城市', value: 'cityId', list: 'cityOptionsList', key: 'areaId', name: 'areaName' },
          { type: 'customselect', label: '注册来源', value: 'source', list: 'sourceList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '刷新马甲昵称', btType: 'danger', icon: 'el-icon-refresh', event: 'refreshRobotNickName', show: false },
          { type: 'button', label: '删除马甲', btType: 'danger', icon: 'el-icon-delete', event: 'deleteRobot', show: false }
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
          { label: '用户ID', value: 'id', minWidth: 60 },
          { label: '用户昵称', value: 'nickName' },
          { label: '用户真实姓名', value: 'userName' },
          { label: '用户类型', value: 'userTypeName' },
          { label: '联系电话', value: 'phone' },
          { label: '性别', value: 'genderName', minWidth: 50 },
          { label: '注册时间', value: 'registerTime', minWidth: 110 },
          { label: '注册来源', value: 'sourceName' },
          { label: '实名认证状态', value: 'verifyFlagName' },
          { label: '最近登录时间', value: 'latestLoginTime', minWidth: 110 },
          { label: '状态', value: 'statusName', type: 'tag', minWidth: 70 }
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
      this.$initDataPermits('userInfoList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('userInfoList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      // form验证
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      const params = {
        'configType': 'USER_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      const sourceParams = {
        'configType': 'USER_REGISTER_SOURCE'
      }
      this.$handleAPI('', getConfigItemsListApi, sourceParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.sourceList = res.data
        }
      })
      const genderParams = {
        'configType': 'GENDER_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, genderParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.genderList = res.data
        }
      })
      const userTypeParams = {
        'configType': 'PLAT_USER_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, userTypeParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.userTypeList = res.data
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
        nickName: null,
        userName: null,
        phone: null,
        idno: null,
        gender: null,
        provinceId: null,
        cityId: null,
        status: null
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
        case 'deleteRobot': {
          var idsArrs = []
          var ids = []
          let pass = true
          try {
            this.checkBoxList.forEach(item => {
              if (item.userType === 9) {
                idsArrs.push(item.id)
              } else {
                ids.push(item.id)
                pass = false
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
            var msgIds = ids.join(',')
            this.$message({
              showClose: true,
              message: '用户id为' + msgIds + '不属于机器人马甲，不能删除',
              type: 'error',
              duration: 3500
            })
            return
          }
          if (idsArrs.length > 0) {
            const params = {
              'updateBy': this.$store.state.staff.staffId,
              'userIds': idsArrs
            }
            this.$handleAPI('delete', userBatchDelete, params).then(res => {
              if (res.code === 200) {
                this.tableInfo.refresh = Math.random()
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
        case 'refreshRobotNickName':
          this.$refs['excel-upload-input'].click()
          break
        case 'refreshRobotNickNameApi': {
          const params = { 'nickNameList': this.nickNameList }
          this.$handleAPI('', refreshNickName, params).then(res => {
            if (res.code === 200) {
              this.$message.success('刷新成功')
            }
          })
          break
        }
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
            item.registerTime = this.$fn.switchTime(item.registerTime, 'YYYY-MM-DD hh:mm:ss')
            if (item.phone !== '') {
              var str = String(item.phone)
              var strLen = str.slice(-7, -3)
              item.phone = str.replace(strLen, '****')
            }
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
                console.log(res.data)
                this.listTypeInfo.cityOptionsList = res.data
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
    },
    uploadRuleExcel(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.$refs['excel-upload-input'].value = null
      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      // this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          // const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          // this.generateData({ header, results })
          // this.loading = false
          resolve()
          const ruleList = []
          results.forEach(element => {
            ruleList.push(element['昵称'])
          })
          this.nickNameList = ruleList
          this.handleClick('refreshRobotNickNameApi')
        }
        reader.readAsArrayBuffer(rawFile)
      })
    }

  }
}
</script>
