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
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <!-- 详细 -->
    <page-dialog
      :title="dialogTag.title"
      :visible.sync="dialogTag.visible"
      :width="dialogTag.width"
      :bt-loading="dialogTag.btLoading"
      :bt-list="dialogTag.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-form
        :ref-obj.sync="formInfoTag.ref"
        :data="formInfoTag.data"
        :field-list="formInfoTag.fieldList"
        :rules="formInfoTag.rules"
        :label-width="formInfoTag.labelWidth"
        :list-type-info="listTypeInfo"
        :read-only="formInfoTag.readOnly"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listApi, getApi, editApi, createApi, deleteApi } from '@/api/best/tag'
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
    const checkTagname = (rule, value, callback) => {
      const check = this.$validate({ label: '标签名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkSort = (rule, value, callback) => {
      const check = this.$validate({ label: '排序', value, rules: ['notnull', 'number'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      listApi,
      getApi,
      editApi,
      createApi,
      deleteApi,
      // checkbox 选中的列表
      checkBoxList: [],
      // 相关列表
      listTypeInfo: {
        tagTypeList: [] // 标签类型列表
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          tagName: '',
          tagType: ''
        },
        list: [
          { type: 'input', label: '标签名称', value: 'tagName' },
          { type: 'customselect', label: '标签类型', value: 'tagType', list: 'tagTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '新增', btType: 'success', icon: 'el-icon-plus', event: 'create', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-delete', event: 'delete', show: false }
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
          { label: '标签类型', value: 'tagTypeName' },
          { label: '标签名称', value: 'tagName' },
          { label: '排序', value: 'sort' }
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
      // 标签dialog
      dialogTag: {
        title: '标签编辑',
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'closedialogTag', show: true },
          { label: '保存', type: 'primary', icon: '', event: 'save', saveLoading: false, show: false }
        ]
      },
      // 标签dialog-form
      formInfoTag: {
        ref: null,
        readOnly: false,
        data: {
          tagId: '',
          tagType: '',
          tagName: '',
          sort: ''
        },
        fieldList: [
          { label: '标签ID', value: 'tagId', type: 'tag', className: 'el-form-block-40' },
          { label: '标签类型', value: 'tagType', type: 'customselect', className: 'el-form-block-50', list: 'tagTypeList', key: 'itemValue', name: 'itemName', required: true },
          { label: '标签名称', value: 'tagName', type: 'input', className: 'el-form-block-60', required: true, validator: checkTagname },
          { label: '排序', value: 'sort', type: 'input', className: 'el-form-block-40', required: true, validator: checkSort }
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
    'dialogTag.visible'(val) {
      if (!val) {
        this.dialogTag.btLoading = false
        this.dialogTag.type = ''
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
      this.$initDataPermits('bestTagList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('bestTagList', this.filterInfo.list) // 条件区域操作权限
      this.$initDataPermits('bestTagList', this.dialogTag.btList) // 明细操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      const params = {
        'configType': 'TAG_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.tagTypeList = res.data
        }
        this.listTypeInfo.tagTypeList.forEach(item => {
          if (item.itemValue > 19) {
            this.listTypeInfo.tagTypeList.splice(this.listTypeInfo.tagTypeList.indexOf(item), 1)
          }
        })
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
      const dialogTag = this.dialogTag
      const formInfoTag = this.formInfoTag
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'create': // 创建
          if (formInfoTag.ref) {
            formInfoTag.ref.resetFields()
          }
          this.resetForm()
          this.formInfoTag.rules = this.$initRules(this.formInfoTag.fieldList)
          dialogTag.visible = true
          break
        case 'detail': // 编辑
          this.$handleAPI('', getApi, { 'id': data.tagId }).then(res => {
            if (res.code === 200) {
              this.formInfoTag.data = res.data
              this.formInfoTag.data.tagType = this.formInfoTag.data.tagType.toString()
              dialogTag.visible = true
              if (this.formInfoTag.ref) {
                this.formInfoTag.ref.resetFields()
              }
              this.formInfoTag.rules = this.$initRules(this.formInfoTag.fieldList)
            }
          })
          break
        case 'save': // 保存
          this.formInfoTag.ref.validate(valid => {
            if (valid) {
              var id = this.formInfoTag.data.tagId
              this.formInfoTag.data.updateBy = this.staffId
              this.formInfoTag.data.oldUpdateTime = this.formInfoTag.data.updateTime
              if (id) {
                this.$handleAPI('update', editApi, this.formInfoTag.data).then(res => {
                  if (res.code === 200) {
                    dialogTag.visible = false
                    this.getList()
                  }
                })
              } else {
                this.$handleAPI('update', createApi, this.formInfoTag.data).then(res => {
                  if (res.code === 200) {
                    dialogTag.visible = false
                    this.getList()
                  }
                })
              }
            }
          })
          break
        case 'closedialogTag': // 弹窗点击关闭
          dialogTag.visible = false
          break
        case 'delete': { // 删除
          const self = this
          this.$confirm('确定要删除该标签？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var tagIdarr = []
            if (data) {
              tagIdarr.push(data.tagId)
              data.deleteLoading = true
            } else {
              self.checkBoxList.forEach(item => {
                tagIdarr.push(item.tagId)
              })
            }
            if (tagIdarr.length > 0) {
              const params = {
                'tagIds': tagIdarr,
                'userId': self.staffId
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
            } else {
              this.$message({
                showClose: true,
                message: '请选择需要删除的数据',
                type: 'error',
                duration: 3500
              })
            }
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
        case 'tableCheck': { // 选择
          this.checkBoxList = data
          break
        }
      }
    },
    // 初始化表单
    resetForm() {
      this.formInfoTag.data = {
        tagId: '',
        tagType: '',
        sort: 0,
        tagName: ''
      }
    }
  }
}
</script>
