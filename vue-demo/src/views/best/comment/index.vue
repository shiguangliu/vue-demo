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
      :title="dialogDetail.title"
      :visible.sync="dialogDetail.visible"
      :width="dialogDetail.width"
      :bt-loading="dialogDetail.btLoading"
      :bt-list="dialogDetail.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-form
        :ref-obj.sync="formInfoDetail.ref"
        :data="formInfoDetail.data"
        :field-list="formInfoDetail.fieldList"
        :rules="formInfoDetail.rules"
        :label-width="formInfoDetail.labelWidth"
        :list-type-info="listTypeInfo"
        :read-only="formInfoDetail.readOnly"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
    </page-dialog>
    <!-- 新建 -->
    <page-dialog
      :title="dialogCreate.title"
      :visible.sync="dialogCreate.visible"
      :width="dialogCreate.width"
      :bt-loading="dialogCreate.btLoading"
      :bt-list="dialogCreate.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-form
        :ref-obj.sync="formInfoCreate.ref"
        :data="formInfoCreate.data"
        :field-list="formInfoCreate.fieldList"
        :rules="formInfoCreate.rules"
        :label-width="formInfoCreate.labelWidth"
        :list-type-info="listTypeInfo"
        :read-only="formInfoCreate.readOnly"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listApi, approveApi, approveNGApi, deleteApi, createCommentApi } from '@/api/best/comment'
import { getConfigItemsListApi, getMerchantListApi, getBestListApi } from '@/api/common'
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
    return {
      listApi,
      deleteApi,
      createCommentApi,
      downloadLoading: false,
      saveLoading: false,
      approveOKLoading: false,
      approveNGLoading: false,
      // checkbox 选中的列表
      checkBoxList: [],
      // 相关列表
      listTypeInfo: {
        merchantList: [], // 商户类型列表
        statusList: [], // 审核状态
        bestList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          bestName: '',
          goodsType: '',
          merchantId: '',
          validDateRange: [],
          commentTimeFrom: '',
          commentTimeTo: '',
          phone: '',
          cityId: ''
        },
        list: [
          { type: 'input', label: '优选名称', value: 'bestName' },
          { type: 'customselect', label: '所属商户', value: 'merchantId', list: 'merchantList', key: 'id', name: 'merchantName' },
          { type: 'input', label: '手机号', value: 'phone' },
          { type: 'customselect', label: '审核状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '评论时间', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '新建', btType: 'success', icon: 'el-icon-plus', event: 'create', show: false },
          { type: 'button', label: '审批通过', btType: 'success', icon: 'el-icon-circle-check', event: 'approveOK', show: false },
          { type: 'button', label: '审批不通过', btType: 'danger', icon: 'el-icon-circle-close', event: 'approveNG', show: false },
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
          { label: '评论ID', value: 'id' },
          { label: '评论时间', value: 'commentTime' },
          { label: '评论内容', value: 'comment' },
          { label: '用户昵称', value: 'commentByName' },
          { label: '手机号', value: 'phone' },
          { label: '优选名称', value: 'bestName' },
          { label: '所属商户', value: 'merchantName' },
          { label: '审核状态', value: 'statusName' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '180',
          btList: [
            { tooltip: '详情', label: '详情', type: 'primary', icon: 'el-icon-tickets', event: 'detail', show: false },
            { tooltip: '删除', label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', loading: 'deleteLoading', show: false }
          ]
        }
      },
      // 评论明细
      dialogDetail: {
        title: '评论查看',
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { type: 'success', label: '审批通过', icon: 'el-icon-circle-check', event: 'approveOK', show: false },
          { type: 'danger', label: '审批不通过', icon: 'el-icon-circle-close', event: 'approveNG', show: false },
          { label: '关闭', type: '', icon: '', event: 'closedialogDetail', show: true }
        ]
      },
      // 评论明细-form
      formInfoDetail: {
        ref: null,
        readOnly: false,
        data: {
          id: '',
          bestName: '',
          merchantName: '',
          comment: '',
          commentTime: '',
          commentByName: '',
          phone: '',
          statusName: ''
        },
        fieldList: [
          { label: '评论ID', value: 'id', type: 'tag' },
          { label: '优选名称', value: 'bestName', type: 'tag' },
          { label: '所属商户', value: 'merchantName', type: 'tag' },
          { label: '评论', value: 'comment', type: 'tag', className: 'el-form-block' },
          { label: '评论时间', value: 'commentTime', type: 'tag' },
          { label: '评论用户', value: 'commentByName', type: 'tag' },
          { label: '手机号', value: 'phone', type: 'tag' },
          { label: '状态', value: 'statusName', type: 'tag' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 评论新建
      dialogCreate: {
        title: '评论新增',
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '保存', type: 'primary', icon: '', event: 'save', show: true, loading: 'saveLoading' },
          { label: '关闭', type: '', icon: '', event: 'closedialogCreate', show: true }
        ]
      },
      // 评论新建-form
      formInfoCreate: {
        ref: null,
        readOnly: false,
        data: {
          bestId: '',
          comment: '',
          commentTime: ''
        },
        fieldList: [
          { label: '优选名称', value: 'bestId', type: 'customselect', list: 'bestList', key: 'id', name: 'bestName', className: 'el-form-block', required: true },
          { label: '评论时间', value: 'commentTime', type: 'date', dateType: 'datetime', className: 'el-form-block', required: true },
          { label: '评论内容', value: 'comment', type: 'input', className: 'el-form-block', required: true }
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
      this.$initDataPermits('bestCommentList', this.filterInfo.list) // 条件区域操作权限
      this.$initDataPermits('bestCommentList', this.tableInfo.handle.btList) // 列表区域操作权限
      this.$initDataPermits('bestCommentList', this.dialogDetail.btList) // 详细页面操作权限
    },
    // 初始化验证
    initRules() {
      const formInfoCreate = this.formInfoCreate
      formInfoCreate.rules = this.$initRules(formInfoCreate.fieldList)
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_COMMENT_APPROVE_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getBestListApi, { 'objectType': 2 }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.bestList = res.data
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
      const dialogDetail = this.dialogDetail
      const dialogCreate = this.dialogCreate
      const formInfoCreate = this.formInfoCreate
      const formInfoDetail = this.formInfoDetail
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'create':
          if (formInfoCreate.ref) {
            formInfoCreate.ref.resetFields()
          }
          this.resetForm()
          dialogCreate.visible = true
          break
        case 'save': {
          this.formInfoCreate.ref.validate(valid => {
            if (valid) {
              this.saveLoading = true
              const params = {
                'bestId': formInfoCreate.data.bestId,
                'comment': formInfoCreate.data.comment,
                'commentTime': this.$fn.switchTime(formInfoCreate.data.commentTime),
                'userId': this.staffId
              }
              this.$handleAPI('', createCommentApi, params).then(res => {
                if (res.code === 200) {
                  this.$message({
                    type: 'info',
                    message: '保存成功'
                  })
                  dialogCreate.visible = false
                  this.getList()
                  this.saveLoading = false
                } else {
                  this.$message({
                    type: 'info',
                    message: res.message
                  })
                  this.saveLoading = false
                }
              }).catch((e) => {
                console.log(e)
                this.$message({
                  type: 'info',
                  message: '保存失败'
                })
              })
              this.saveLoading = false
            }
          })
          break
        }
        case 'closedialogCreate': // 弹窗点击关闭
          dialogCreate.visible = false
          break
        case 'detail':
          dialogDetail.visible = true
          this.formInfoDetail.data = data
          if (this.formInfoDetail.data.status === 1) {
            this.dialogDetail.btList = [
              { type: 'success', label: '审批通过', icon: 'el-icon-circle-check', event: 'approveOK', show: false },
              { type: 'danger', label: '审批不通过', icon: 'el-icon-circle-close', event: 'approveNG', show: false },
              { label: '关闭', type: '', icon: '', event: 'closedialogDetail', show: true }
            ]
          } else if (this.formInfoDetail.data.status === 3) {
            this.dialogDetail.btList = [
              { type: 'success', label: '审批通过', icon: 'el-icon-circle-check', event: 'approveOK', show: false },
              { label: '关闭', type: '', icon: '', event: 'closedialogDetail', show: true }
            ]
          } else {
            this.dialogDetail.btList = [
              { label: '关闭', type: '', icon: '', event: 'closedialogDetail', show: true }
            ]
          }
          this.$initDataPermits('bestCommentList', this.dialogDetail.btList) // 详细页面操作权限
          break
        case 'closedialogDetail': // 弹窗点击关闭
          dialogDetail.visible = false
          break
        case 'approveOK': {
          const self = this
          this.$confirm('确定要审批通过吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var idArr = []
            if (dialogDetail.visible) {
              idArr.push(formInfoDetail.data.id)
              this.dialogDetail.btLoading = true
            } else {
              self.checkBoxList.forEach(item => {
                idArr.push(item.id)
              })
            }
            if (idArr.length > 0) {
              const params = {
                'commentIds': idArr,
                'userId': self.staffId
              }
              this.$handleAPI('', approveApi, params).then(res => {
                if (res.code === 200) {
                  this.$message.success('审批成功')
                  this.formInfoDetail.data.statusName = this.$fn.getDataName({ dataList: this.listTypeInfo.statusList, value: 'itemValue', label: 'itemName', data: '2' })
                  this.dialogDetail.btLoading = false
                  this.dialogDetail.btList = [
                    { label: '关闭', type: '', icon: '', event: 'closedialogDetail', show: true }
                  ]
                  this.getList()
                } else {
                  this.$message({
                    showClose: true,
                    message: '审批失败',
                    type: 'error',
                    duration: 3500
                  })
                }
              })
            } else {
              this.$message({
                showClose: true,
                message: '请选择需要审批的数据',
                type: 'error',
                duration: 3500
              })
            }
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消审批'
            })
          })
          break
        }
        case 'approveNG': {
          const self = this
          this.$confirm('确定要审批不通过吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var idArr = []
            if (dialogDetail.visible) {
              idArr.push(formInfoDetail.data.id)
              this.dialogDetail.btLoading = true
            } else {
              self.checkBoxList.forEach(item => {
                idArr.push(item.id)
              })
            }
            if (idArr.length > 0) {
              const params = {
                'commentIds': idArr,
                'userId': self.staffId
              }
              this.$handleAPI('', approveNGApi, params).then(res => {
                if (res.code === 200) {
                  this.$message.success('审批成功')
                  this.formInfoDetail.data.statusName = this.$fn.getDataName({ dataList: this.listTypeInfo.statusList, value: 'itemValue', label: 'itemName', data: '3' })
                  this.dialogDetail.btList = [
                    { type: 'success', label: '审批通过', icon: 'el-icon-circle-check', event: 'approveOK', show: false },
                    { label: '关闭', type: '', icon: '', event: 'closedialogDetail', show: true }
                  ]
                  this.$initDataPermits('bestCommentList', this.dialogDetail.btList) // 详细页面操作权限
                  this.dialogDetail.btLoading = false
                  this.getList()
                } else {
                  this.$message({
                    showClose: true,
                    message: '审批失败',
                    type: 'error',
                    duration: 3500
                  })
                }
              })
            } else {
              this.$message({
                showClose: true,
                message: '请选择需要审批的数据',
                type: 'error',
                duration: 3500
              })
            }
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消审批'
            })
          })
          break
        }
        case 'delete': { // 删除
          const self = this
          this.$confirm('确定要删除该评论？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var idArr = []
            if (data) {
              idArr.push(data.id)
              data.deleteLoading = true
            } else {
              self.checkBoxList.forEach(item => {
                idArr.push(item.id)
              })
            }
            if (idArr.length > 0) {
              const params = {
                'commentIds': idArr,
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
        case 'pickDate': // 选择日期范围
          if (data) {
            this.filterInfo.query.commentTimeFrom = this.$fn.switchTime(data[0])
            this.filterInfo.query.commentTimeTo = this.$fn.switchTime(data[1])
          } else {
            this.filterInfo.query.commentTimeFrom = ''
            this.filterInfo.query.commentTimeTo = ''
          }
          break
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            this.$set(item, 'deleteLoading', false)
            if (item.comment.length > 50) {
              item.comment = item.comment.slice(0, 50) + '...'
            }
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
      this.formInfoCreate.data = {
        bestId: '',
        comment: '',
        commentTime: ''
      }
    }
  }
}
</script>
