<template>
  <div class="tab-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="出行模式详情" name="tab1">
        <page-form
          :ref-obj.sync="formInfo.ref"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :rules="formInfo.rules"
          :label-width="formInfo.labelWidth"
          :list-type-info="listTypeInfo"
          :read-only="formInfo.readOnly"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetailApi, deleteBatchApi, updateDetailApi } from '@/api/trip/tripmode'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'

export default {
  components: {
    PageFilter,
    PageForm
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
      activeName: 'tab1',
      readOnly: false,
      listTypeInfo: {
        statusList: []
      },
      // 过滤相关配置（按钮区）
      filterInfo: {
        query: {
        },
        list: [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
      },
      // 表单相关（追加、修改）
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          modeName: '',
          speedFrom: '',
          speedTo: '',
          status: ''
        },
        fieldList: [
          { label: '出行模式ID', value: 'id', type: 'tag', className: 'el-form-block-30' },
          { label: '出行模式名称', value: 'modeName', type: 'input', required: true, className: 'el-form-block-60' },
          { label: '最低时速', value: 'speedFrom', type: 'input', append: 'append', fixtext: '公里/小时', required: true, className: 'el-form-block-40', validator: checkNumber },
          { label: '最高时速', value: 'speedTo', type: 'input', append: 'append', fixtext: '公里/小时', required: true, className: 'el-form-block-40', validator: checkNumber },
          { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-block-30' }
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
  watch: {
    'formInfo.data.status'(val) {
      // 按钮权限
      this.initButtonList(this.formInfo.data.status)
    }
  },
  created() {
    this.initList()
  },
  mounted() {
    this.getDetail()
    this.initDataPermits()
    // 验证规则
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('tripModeDetail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
    //  下拉框需要初始化加载的列表数据
      const sparams = {
        'configType': 'GENERAL_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, sparams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      // 获取url参数
      this.formInfo.data.id = this.$route.query.id
      // 获取version详细
      const param = { 'id': this.formInfo.data.id }
      this.$handleAPI('', getDetailApi, param).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          const data = res.data
          data.status += ''
          // 显示信息
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = data[key]
              if (key === 'speedFrom' && data['speedFrom'] === 0) {
                this.formInfo.data[key] = ''
              }
              if (key === 'speedTo' && data['speedTo'] === 0) {
                this.formInfo.data[key] = ''
              }
            }
          }
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
    initButtonList(status) {
      status = Number(status)
      if (status === 3) { // 停用状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '启用', btType: 'primary', icon: 'el-icon-check', loading: 'submitLoading', event: 'submit', show: false }
        ]
      }
      if (status === 2) { // 已发布，启用状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '停用', btType: 'danger', icon: 'el-icon-close', loading: 'stopLoading', event: 'stop', show: false }
        ]
      }
      if (status === 1) { // 编辑状态
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '启用', btType: 'primary', icon: 'el-icon-check', loading: 'submitLoading', event: 'submit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
      }
      this.initDataPermits()
    },
    saveDetail() {
      this.formInfo.ref.validate(valid => {
        if (valid) {
          this.formInfo.data.updateBy = this.$store.state.staff.staffId
          this.$handleAPI('', updateDetailApi, this.formInfo.data).then(res => {
            this.$message({
              showClose: true,
              message: (res.code === 200) ? '保存成功' : res.message,
              type: (res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          })
        }
      })
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'save': {
          this.saveDetail()
          break
        }
        case 'delete': {
          this.$confirm('确定要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var ids = []
            ids.push(this.formInfo.data.id)
            const params = {
              'ids': ids,
              'staffId': this.$store.state.staff.staffId
            }
            this.$handleAPI('', deleteBatchApi, params).then(res => {
              if (res.code === 200) {
                this.$message.success('删除成功')
                this.$store.dispatch('tagsView/delView', this.$route).then(() => {
                  this.$router.push({ path: './index', replace: true })
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
          })
          break
        }
        case 'edit': {
          const param = { 'id': this.formInfo.data.id, 'status': 1, 'updateBy': this.$store.state.staff.staffId }
          this.$handleAPI('', updateDetailApi, param).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 1
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          })
          break
        }
        case 'stop': {
          const param = { 'id': this.formInfo.data.id, 'status': 3, 'updateBy': this.$store.state.staff.staffId }
          this.$handleAPI('', updateDetailApi, param).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 3
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          })
          break
        }
        case 'submit': {
          var va = false
          this.formInfo.ref.validate(valid => {
            va = valid
          })
          if (!va) {
            return
          }
          const temStatus = this.formInfo.data.status
          this.formInfo.data.status = 2
          this.formInfo.data.updateBy = this.$store.state.staff.staffId
          this.$handleAPI('', updateDetailApi, this.formInfo.data).then(res => {
            this.$message({
              showClose: true,
              message: res.code === 200 ? '启用成功' : res.message,
              type: res.code === 200 ? 'success' : 'error',
              duration: 3500
            })
            if (res.code !== 200) {
              this.formInfo.data.status = temStatus
            }
          })
          break
        }
      }
    },
    handleEvent(event, data) {
      switch (event) {
        case 'list':
          break
      }
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
  .form-merchant-container {
    margin: 30px;
  }
  .image {
    width: 100%;
    display: block;
  }
  .imgdiv {
    height: 100px;
    overflow: hidden;
  }
</style>
