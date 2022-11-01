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
    <page-dialog
      :width="dialogInfo.width"
      :visible.sync="dialogInfo.visible"
      :title="dialogInfo.title"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-form
        :ref-obj.sync="formInfo.ref"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      >
        <template v-slot:form-races>
          <el-checkbox-group v-model="formInfo.data.races" @change="handleCheckedChange">
            <el-checkbox v-for="item in listTypeInfo.raceTypeConfigList" :key="item.itemValue" :label="item.itemValue">{{ item.itemName }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </page-form>
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, deleteApi, getDetailApi, updateDetailApi, exportList } from '@/api/race/racetips'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'

export default {
  components: {
    PageFilter,
    PageTable,
    PageForm,
    PageDialog
  },
  data() {
    const checkNumber = (rule, value, callback) => {
      const check = this.$validate({ label: '', value, rules: ['notnull', 'number'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      getListApi,
      downloadLoading: false,
      // 相关列表
      listTypeInfo: {
        statusList: [],
        tipsTypeList: [],
        raceTypeConfigList: [],
        tipSceneList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: '',
          tipType: '',
          raceType: '',
          status: '' // *状态: 1：编辑中(默认为1)'
        },
        list: [
          { type: 'input', label: '文案ID', value: 'id' },
          { type: 'customselect', label: '文案类型', value: 'tipType', list: 'tipsTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '适用比赛类型', value: 'raceType', list: 'raceTypeConfigList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: true },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '比赛文案ID', value: 'id', width: 120 },
          { label: '文案类型', value: 'tipTypeName', type: 'tag', width: 150 },
          { label: '适用比赛类型', value: 'raceTypeList' },
          { label: '排序', value: 'sort', width: 90 },
          { label: '创建时间', value: 'createTime', width: 150 },
          { label: '状态', value: 'statusName', type: 'tag' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { tooltip: '编辑文案', label: '编辑文案', type: 'primary', icon: 'el-icon-view', event: 'editTips', show: false },
            { tooltip: '删除文案', label: '删除文案', type: 'danger', icon: 'el-icon-delete', event: 'deleteTips', show: false }
          ]
        }
      },
      dialogInfo: {
        title: '详情',
        visible: false,
        btLoading: false,
        width: '600px',
        btList: [
          { label: '取消', type: '', icon: '', event: 'cancel', show: true },
          { label: '确定', type: 'primary', icon: '', event: 'save', show: true }
        ]
      },
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          tipType: '',
          tipText: '',
          tipSubtitle: '',
          tipRemarks: '',
          raceTypeList: '',
          races: [],
          tipScene: '',
          status: '',
          sort: ''
        },
        fieldList: [
          { label: '比赛文案ID', value: 'id', type: 'tag' },
          { label: '文案类型', value: 'tipType', type: 'customselect', list: 'tipsTypeList', key: 'itemValue', name: 'itemName', required: true, event: 'changeTipType' },
          { label: '适用比赛类型', value: 'races', type: 'slot', className: 'el-form-block-100' },
          { label: '输赢原因', value: 'tipScene', type: 'customselect', list: 'tipSceneList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-block-50' },
          { label: '文案内容', value: 'tipText', type: 'textarea', required: true, className: 'el-form-block-100' },
          { label: '温馨提示', value: 'tipSubtitle', type: 'textarea', className: 'el-form-block-100' },
          { label: '备注说明', value: 'tipRemarks', type: 'textarea', className: 'el-form-block-100' },
          { label: '状态', value: 'status', type: 'customselect', list: 'statusList', key: 'itemValue', name: 'itemName', required: true },
          { label: '排序', value: 'sort', type: 'input', required: true, validator: checkNumber }
        ],
        rules: {},
        labelWidth: '120px'
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits'
    ])
  },
  created() {
    this.initList()
  },
  mounted() {
    this.initDataPermits()
    this.initRules()
    this.getList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('raceSetting', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('raceSetting', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_RACE_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.raceTypeConfigList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_RACE_TIPS_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.tipsTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'RACE_TIP_SCENE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.tipSceneList = res.data
        }
      })
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    resetForm() {
      this.formInfo.data = {
        id: '', // *唯一ID
        tipType: '',
        tipText: '',
        tipSubtitle: '',
        tipRemarks: '',
        raceTypeList: '',
        tipScene: '',
        races: [],
        status: '',
        sort: ''
      }
    },
    handleCheckedChange(vals) {
      var str = ''
      if (vals !== null && vals.length !== 0) {
        for (var j = 0; j < vals.length; j++) {
          str += vals[j]
          if (j !== vals.length - 1) {
            str += ','
          }
        }
      }
      this.formInfo.data.raceTypeList = str
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
          this.resetForm()
          this.dialogInfo.visible = true
          break
        }
        case 'deleteTips': {
          this.$confirm('确定要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$handleAPI('', deleteApi, { 'id': data.id, 'staffId': this.$store.state.staff.staffId }).then(res => {
              if (res.code === 200) {
                this.$message.success('删除成功')
                this.getList()
              } else {
                this.$message({
                  showClose: true,
                  message: '删除失败',
                  type: 'error',
                  duration: 3500
                })
              }
            })
          }).catch((e) => {
            console.log()
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          break
        }
        case 'editTips': // 编辑
          this.$handleAPI('', getDetailApi, { 'id': data.id }).then(res => {
            if (res.code === 200) {
              res.data.tipType += ''
              res.data.status += ''
              res.data.tipScene += ''
              this.formInfo.fieldList.forEach(element => {
                if (element.value === 'tipScene') {
                  if (res.data.tipType === '11' || res.data.tipType === '12') {
                    element.type = 'customselect'
                  } else {
                    element.type = 'hidden'
                  }
                }
                if (element.value === 'tipSubtitle') {
                  if (res.data.tipType === '11' || res.data.tipType === '12') {
                    element.type = 'textarea'
                  } else {
                    this.formInfo.data.tipSubtitle = ''
                    element.type = 'hidden'
                  }
                }
              })
              for (const key in res.data) {
                // 存在则赋值
                if (key in this.formInfo.data) {
                  if (key === 'raceTypeList' && res.data[key] !== '' && res.data[key] !== null) {
                    this.formInfo.data['races'] = res.data[key].split(',')
                  }
                  this.formInfo.data[key] = res.data[key]
                }
              }
              this.dialogInfo.visible = true
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          }).catch((error) => {
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        case 'cancel':
          this.dialogInfo.visible = false
          this.resetForm()
          break
        case 'save':
          this.formInfo.ref.validate(valid => {
            if (valid) {
              this.formInfo.data.updateBy = this.$store.state.staff.staffId
              this.$handleAPI('', updateDetailApi, this.formInfo.data).then(res => {
                if (res.code === 200) {
                  this.dialogInfo.visible = false
                  this.resetForm()
                  this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success',
                    duration: 3500
                  })
                  this.getList()
                }
              })
            }
          })
          break
        case 'export':
          this.hanldeDownload()
          break
      }
    },
    hanldeDownload() {
      this.$handleAPI('', exportList, this.filterInfo.query).then(res => {
        if (res.code === 200) {
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const column = [
              { title: '比赛文案ID', key: 'id', type: 'text', width: 100 },
              { title: '文案类型', key: 'tipTypeName', type: 'text', width: 100 },
              { title: '适用比赛类型', key: 'raceTypeList', type: 'text', width: 100 },
              { title: '文案内容', key: 'tipText', type: 'text', width: 100 },
              { title: '备注说明', key: 'tipRemarks', type: 'text', width: 100 },
              { title: '排序', key: 'sort', type: 'text', width: 100 },
              { title: '创建时间', key: 'createTime', type: 'text', width: 100 },
              { title: '状态', key: 'statusName', type: 'text', width: 100 }
            ]
            const tHeader = []
            const filterVal = []
            for (const index in column) {
              const item = column[index]
              tHeader[index] = item.title
              filterVal[index] = item.key
            }
            const data = this.formatJson(filterVal, res.data.list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '路赛文案一览',
              autoWidth: this.autoWidth,
              bookType: this.bookType
            })
            this.downloadLoading = false
            // excel.export_table_to_excel_image(column, res.data.list, '路赛文案一览')
          })
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
        }
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
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          break
        case 'changeTipType': { // 文案类型改变事件
          this.formInfo.fieldList.forEach(element => {
            if (element.value === 'tipScene') {
              if (this.formInfo.data.tipType === '11' || this.formInfo.data.tipType === '12') {
                this.formInfo.data.tipScene = '1'
                element.type = 'customselect'
              } else {
                this.formInfo.data.tipScene = '0'
                element.type = 'hidden'
              }
            }
            if (element.value === 'tipSubtitle') {
              if (this.formInfo.data.tipType === '11' || this.formInfo.data.tipType === '12') {
                element.type = 'textarea'
              } else {
                this.formInfo.data.tipSubtitle = ''
                element.type = 'hidden'
              }
            }
          })
          break
        }
      }
    }
  }
}
</script>
