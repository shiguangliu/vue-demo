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
      :title="dialogInfo.title[dialogInfo.type]"
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
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, deleteApi, updateDetailApi } from '@/api/robot/profile'
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
    return {
      getListApi,
      // 相关列表
      listTypeInfo: {
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: '',
          profile: ''
        },
        list: [
          { type: 'input', label: '签名ID', value: 'id' },
          { type: 'input', label: '签名内容', value: 'profile' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '新建', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '签名ID', value: 'id', width: 120 },
          { label: '签名内容', value: 'profile' },
          { label: '创建时间', value: 'createTime', width: 150 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { tooltip: '编辑', label: '编辑', type: 'primary', icon: 'el-icon-view', event: 'edit', show: true },
            { tooltip: '删除', label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: true }
          ]
        }
      },
      dialogInfo: {
        title: {
          create: '添加马甲签名',
          edit: '编辑马甲签名'
        },
        visible: false,
        btLoading: false,
        width: '600px',
        type: '',
        btList: [
          { label: '取消', type: '', icon: '', event: 'cancel', show: true },
          { label: '确定', type: 'primary', icon: '', event: 'save', show: true }
        ]
      },
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          profile: ''
        },
        fieldList: [
          { label: '签名ID', value: 'id', type: 'tag' },
          { label: '签名内容', value: 'profile', type: 'textarea', autosize: { minRows: 6, maxRows: 10 }, maxlength: 1000, showLimit: true, className: 'el-form-block-100' }
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
      this.$initDataPermits('robotProfile', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('robotProfile', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    resetForm() {
      this.formInfo.data = {
        id: '', // *唯一ID
        profile: ''
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
          this.resetForm()
          this.dialogInfo.visible = true
          this.dialogInfo.type = event
          break
        }
        case 'delete': {
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
        case 'edit': // 编辑
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = data[key]
            }
          }
          this.dialogInfo.visible = true
          this.dialogInfo.type = event
          break
        case 'cancel':
          this.dialogInfo.visible = false
          break
        case 'save':
          this.formInfo.ref.validate(valid => {
            if (valid) {
              this.formInfo.data.updateBy = this.$store.state.staff.staffId
              this.$handleAPI('', updateDetailApi, this.formInfo.data).then(res => {
                if (res.code === 200) {
                  this.dialogInfo.visible = false
                  this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success',
                    duration: 3500
                  })
                  this.getList()
                } else {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error',
                    duration: 3500
                  })
                }
              })
            }
          })
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          break
      }
    }
  }
}
</script>
