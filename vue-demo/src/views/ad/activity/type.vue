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
      :api="getListApi"
      :query="filterInfo.query"
      :result-set="tableInfo.resultSet"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <!-- 详细 -->
    <page-dialog
      :title="dialogType.title"
      :visible.sync="dialogType.visible"
      :width="dialogType.width"
      :bt-loading="dialogType.btLoading"
      :bt-list="dialogType.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-form
        :ref-obj.sync="formInfoType.ref"
        :data="formInfoType.data"
        :field-list="formInfoType.fieldList"
        :rules="formInfoType.rules"
        :label-width="formInfoType.labelWidth"
        :list-type-info="listTypeInfo"
        :read-only="formInfoType.readOnly"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, getApi, deleteApi, editApi } from '@/api/ad/activity/type'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'

export default {
  components: {
    PageFilter,
    PageTable,
    PageDialog,
    PageForm
  },
  data() {
    const checkActivityTypeName = (rule, value, callback) => {
      const check = this.$validate({ label: '活动类型', value, rules: ['notnull', 'length'], conditions: [1, 100] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkRemarks = (rule, value, callback) => {
      const check = this.$validate({ label: '备注', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      getListApi,
      // checkbox 选中的列表
      checkBoxList: [],
      // 相关列表
      listTypeInfo: {
        statusList: [] // 状态类型列表
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: '',
          activityTypeName: '',
          status: ''
        },
        list: [
          { type: 'input', label: '活动类型ID', value: 'id' },
          { type: 'input', label: '活动类型', value: 'activityTypeName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '新增', btType: 'success', icon: 'el-icon-plus', event: 'create', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        tableIndex: false, // 显示序号
        checkBox: false,
        refresh: 1,
        initCurpage: 1,
        data: [],
        resultSet: '',
        fieldList: [
          { label: '活动类型ID', value: 'id' },
          { label: '活动类型', value: 'activityTypeName' },
          { label: '状态', value: 'statusName' },
          { label: '创建时间', value: 'createTime' },
          { label: '备注', value: 'remarks' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: [
            { tooltip: '删除', label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', loading: 'deleteLoading', show: false },
            { tooltip: '编辑', label: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'detail', show: false }
          ]
        }
      },
      // 活动类型dialog
      dialogType: {
        title: '活动类型编辑',
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'closedialogType', show: true },
          { label: '保存', type: 'primary', icon: '', event: 'save', saveLoading: false, show: false }
        ]
      },
      // 活动类型dialog-form
      formInfoType: {
        ref: null,
        readOnly: false,
        data: {
          id: '',
          activityTypeName: '',
          remarks: '',
          status: ''
        },
        fieldList: [
          { label: '活动类型ID', value: 'id', type: 'tag', className: 'el-form-block-40' },
          { label: '活动类型', value: 'activityTypeName', type: 'input', className: 'el-form-block-60', required: true, validator: checkActivityTypeName },
          { label: '备注', value: 'remarks', type: 'textarea', className: 'el-form-block-60', autosize: { minRows: 2, maxRows: 3 }, maxlength: 200, showLimit: true, required: true, validator: checkRemarks },
          { label: '状态', value: 'status', type: 'customselect', className: 'el-form-block-50', list: 'statusList', key: 'itemValue', name: 'itemName', required: true }
        ],
        rules: {},
        labelWidth: '120px'
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
    'dialogType.visible'(val) {
      if (!val) {
        this.dialogType.btLoading = false
        this.dialogType.type = ''
      }
    }
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
      this.$initDataPermits('activityTypeList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('activityTypeList', this.filterInfo.list) // 条件区域操作权限
      this.$initDataPermits('activityTypeList', this.dialogType.btList) // 明细操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
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
      const dialogType = this.dialogType
      const formInfoType = this.formInfoType
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'create': // 创建
          if (formInfoType.ref) {
            formInfoType.ref.resetFields()
          }
          this.resetForm()
          this.formInfoType.rules = this.$initRules(this.formInfoType.fieldList)
          dialogType.visible = true
          break
        case 'detail': // 编辑
          this.$handleAPI('', getApi, { 'id': data.id }).then(res => {
            if (res.code === 200) {
              this.formInfoType.data = res.data
              this.formInfoType.data.status = this.formInfoType.data.status + ''
              dialogType.visible = true
              if (this.formInfoType.ref) {
                this.formInfoType.ref.resetFields()
              }
              this.formInfoType.rules = this.$initRules(this.formInfoType.fieldList)
            }
          })
          break
        case 'save': // 保存
          console.log('save')
          this.formInfoType.ref.validate(valid => {
            console.log(valid)
            if (valid) {
              this.formInfoType.data.updateBy = this.staffId
              this.formInfoType.data.oldUpdateTime = this.formInfoType.data.updateTime
              this.$handleAPI('update', editApi, this.formInfoType.data).then(res => {
                if (res.code === 200) {
                  dialogType.visible = false
                  this.getList()
                }
              })
            }
          })
          break
        case 'closedialogType': // 弹窗点击关闭
          dialogType.visible = false
          break
        case 'delete': { // 删除
          const self = this
          this.$confirm('确定要删除该活动类型？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'id': data.id,
              'updateBy': self.staffId
            }
            this.$handleAPI('', deleteApi, params).then(res => {
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
                if (data) {
                  data.deleteLoading = false
                }
              }
            })
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          if (data) {
            data.deleteLoading = false
          }
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            this.$set(item, 'deleteLoading', false)
          })
          break
      }
    },
    // 初始化表单
    resetForm() {
      this.formInfoType.data = {
        id: '',
        activityTypeName: '',
        remarks: '',
        status: ''
      }
    }
  }
}
</script>
