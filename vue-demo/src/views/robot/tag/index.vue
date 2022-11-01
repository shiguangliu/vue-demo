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
      :api="getRobotTagList"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <!-- 弹窗 -->
    <page-dialog
      :title="dialogInfo.title[dialogInfo.type]"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- form -->
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
import { getRobotTagList, getRobotTagInsert, getRobotTagUpdate } from '@/api/robot/tag/index'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageFilter,
    PageTable,
    PageDialog,
    PageForm
  },
  data() {
    // 检测品牌名称
    const checkTagName = (rule, value, callback) => {
      const check = this.$validate({ label: '标签名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      getRobotTagList,
      getRobotTagInsert,
      getRobotTagUpdate,
      // 相关列表
      listTypeInfo: {
        statusList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: '',
          tagName: null
        },
        list: [
          { type: 'input', label: '标签ID', value: 'id' },
          { type: 'input', label: '标签名称', value: 'tagName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '标签ID', value: 'id', width: 90 },
          { label: '标签名称', value: 'tagName', width: 300 },
          { label: '标签说明', value: 'tagDesc' },
          { label: '创建时间', value: 'createTime', width: 200 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '180',
          btList: [
            { label: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'edit', show: false },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: false }
          ]
        }
      },
      // 表单相关（追加、修改）
      formInfo: {
        ref: null,
        data: {
          id: '',
          tagName: '',
          tagDesc: ''
        },
        fieldList: [
          { label: '标签ID', value: 'id', type: 'tag', required: true, className: 'el-form-block-40' },
          { label: '标签名称', value: 'tagName', type: 'input', required: true, validator: checkTagName, className: 'el-form-block-40' },
          { label: '标签说明', value: 'tagDesc', type: 'textarea', maxlength: 200, className: 'el-form-block-80' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 弹窗相关
      dialogInfo: {
        title: {
          create: '添加马甲标签',
          edit: '编辑马甲标签'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'close', show: true },
          { label: '保存', type: 'primary', icon: '', event: 'save', show: true }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits'
    ]),
    nopicture() {
      return 'this.src="' + this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
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
      this.$initDataPermits('robotTag', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('robotTag', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      const formInfo = this.formInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
    },
    initList() {},
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
      const dialogInfo = this.dialogInfo
      const formInfo = this.formInfo
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'create': // 创建
          var param = { createBy: this.$store.state.staff.staffId }
          this.$handleAPI('', getRobotTagInsert, param).then(res => {
            if (res.code === 200) {
              formInfo.data.id = res.data.id
              formInfo.data.tagName = ''
              formInfo.data.tagDesc = ''
            } else {
              this.dialogInfo.visible = false
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          }).catch((error) => {
            this.dialogInfo.visible = false
            this.dialogInfo.btLoading = false
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          dialogInfo.type = event
          dialogInfo.visible = true
          break
        case 'edit': // 编辑
          dialogInfo.type = event
          dialogInfo.visible = true
          // 显示信息
          for (const key in data) {
            // 存在则赋值
            if (key in formInfo.data) {
              formInfo.data[key] = data[key]
            }
          }
          break
        case 'delete': { // 删除
          // 删除选中的行
          const rowdata = {
            id: data.id,
            'deleteFlag': 1,
            'updateBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('delete', getRobotTagUpdate, rowdata).then(res => {
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
        case 'close':
          // 弹窗点击关闭
          dialogInfo.visible = false
          tableInfo.refresh = Math.random()
          // 刷新列表
          this.initList()
          break
        case 'save': { // 弹窗点击保存
          // 保存
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const params = this.formInfo.data
              params.updateBy = this.$store.state.staff.staffId
              this.$handleAPI('', getRobotTagUpdate, params).then(res => {
                if (res.code === 200) {
                  this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success',
                    duration: 3500
                  })
                  dialogInfo.visible = false
                  tableInfo.refresh = Math.random()
                } else if (res.code === 500) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    duration: 3500
                  })
                }
                dialogInfo.btLoading = false
              }).catch(e => {
                dialogInfo.btLoading = false
              })
            }
          })
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) {
            data.forEach(item => {
              this.$set(item, 'statusLoading', false)
              this.$set(item, 'deleteLoading', false)
              item.createTime = this.$fn.switchTime(item.createTime, 'YYYY-MM-DD hh:mm:ss')
            })
          }
          break
      }
    },
    // 初始化表单
    resetForm() {
      this.formInfo.data = {
        id: '', // *唯一ID
        brandName: '', // *品牌名称
        firstLetter: '', // 首字母
        groupId: '',
        icon: '', // 品牌LOGO
        remarks: '', // 备注
        status: '' // *状态: 1：编辑中(默认为1)'
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .slot-avatar{
    height: 40px;
    display: flex;
    align-items: center;
    img{
      padding-right: 10px;
    }
  }
</style>
