<template>
  <div class="tab-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="版本详情" name="tab1">
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
import { updateApi, getAppVerApi, updateAppVerStatusApi, deleteAppVerApi } from '@/api/system/appversion'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import { validURL } from '@/common/js/validate.js'
export default {
  components: {
    PageFilter,
    PageForm
  },
  data() {
    const checkUrl = (rule, value, callback) => {
      var msg = ''
      if (this.formInfo.data.appType === '2') {
        if (value !== undefined) {
          var ret = validURL(value)
          if (!ret) {
            msg = '链接格式错误'
          }
        } else {
          msg = '链接格式错误'
        }
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    const checkApkMd5 = (rule, value, callback) => {
      var msg = ''
      if (this.formInfo.data.appType === '2') {
        if (value === '' || value === null || value === undefined) {
          msg = 'Apk Md5 不能为空'
        }
      }

      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    return {
      updateApi,
      getAppVerApi,
      activeName: 'tab1',
      readOnly: false,
      listTypeInfo: {
        appTypeList: [],
        forceList: [],
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
          appType: '', // *app类型
          appVer: '', // *版本号
          apkLink: '', // *apk链接
          apkMd5: '', // apk  md5
          forceFlag: '', // 是否强制更新
          description: '', // *版本更新描述
          releaseTime: '', // *发布时间
          releaseBy: '', // *发布用户ID
          status: '', // 发布状态
          deleteFlag: '', // 删除标志
          updateTime: '', // 更新日期
          updateBy: '', // 更新用户ID
          createBy: '', // 创建用户id
          createTime: '' // 创建时间
        },
        fieldList: [
          { label: '版本ID', value: 'id', type: 'tag', className: 'el-form-block-30' },
          { label: '适用APP', value: 'appType', type: 'customselect', className: 'el-form-block-40', list: 'appTypeList', key: 'itemValue', name: 'itemName', required: true, event: 'changeAppType' },
          { label: '版本号', value: 'appVer', type: 'input', className: 'el-form-block-30', required: true },
          { label: 'Apk链接', value: 'apkLink', type: 'input', className: 'el-form-block', validator: checkUrl },
          { label: 'Apk MD5', value: 'apkMd5', type: 'input', className: 'el-form-block', validator: checkApkMd5 },
          { label: '版本更新描述', value: 'description', type: 'textarea', className: 'el-form-block', autosize: { minRows: 3, maxRows: 5 }, required: true },
          { label: '是否强制更新', value: 'forceFlag', type: 'customselect', className: 'el-form-block-30', list: 'forceList', key: 'itemValue', name: 'itemName', required: true },
          { label: '状态', value: 'status', type: 'tag', className: 'el-form-block-30', list: 'statusList', key: 'itemValue', name: 'itemName', required: true }
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
  mounted() {
    this.initList()
    this.getDetail()
    this.initDataPermits()
    // 验证规则
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('appVerDetail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
    //  下拉框需要初始化加载的列表数据
      const sparams = {
        'configType': 'APP_VERSION_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, sparams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      const uparams = {
        'configType': 'UPGRADE_FORCE_FLAG'
      }
      this.$handleAPI('', getConfigItemsListApi, uparams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.forceList = res.data
        }
      })
      const tparams = {
        'configType': 'APP_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, tparams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.appTypeList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    getDetail() {
      const self = this
      // 初始化设置 form fileds
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      // 获取url参数
      this.formInfo.data.id = this.$route.query.id
      // 获取version详细
      const param = { 'id': this.formInfo.data.id }
      this.$handleAPI('', getAppVerApi, param).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          // console.log(res)
          const data = res.data
          data.appType += ''
          data.forceFlag += ''
          data.status += ''
          self.formInfo.fieldList.forEach(element => {
            if (element.value === 'apkLink') {
              if (data.appType === '2') {
                element.type = 'input'
                element.required = true
                element.validator = self.checkUrl
              } else {
                element.type = 'hidden'
                element.required = false
                element.validator = null
              }
            }
            if (element.value === 'apkMd5') {
              if (data.appType === '2') {
                element.type = 'input'
                element.required = true
                element.validator = self.checkApkMd5
              } else {
                element.type = 'hidden'
                element.required = false
                element.validator = self.checkApkMd5
              }
            }
          })
          // 显示信息
          for (const key in res.data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = data[key]
            }
          }
          if (self.formInfo.data.appType === '1') {
            self.formInfo.data.apkLink = ''
            self.formInfo.data.apkMd5 = ''
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
      if (status === 3) { // 已作废状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [] // 只读，不能修改
      }
      if (status === 2) { // 已发布，启用状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '作废', btType: 'danger', icon: 'el-icon-close', loading: 'stopLoading', event: 'stop', show: false }
        ]
      }
      if (status === 1) { // 编辑状态
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '发布', btType: 'primary', icon: 'el-icon-check', loading: 'submitLoading', event: 'submit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
      }
      this.initDataPermits()
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'save': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              this.formInfo.data.updateBy = this.$store.state.staff.staffId
              this.$handleAPI('', updateApi, this.formInfo.data).then(res => {
                this.$message({
                  showClose: true,
                  message: (res.code === 200) ? '保存成功' : res.message,
                  type: (res.code === 200) ? 'success' : 'error',
                  duration: 3500
                })
              })
            }
          })
          break
        }
        case 'delete': { // 删除
          this.$confirm('确定要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const param = { 'id': this.formInfo.data.id, 'staffId': this.$store.state.staff.staffId }
            this.$handleAPI('', deleteAppVerApi, param).then(res => {
              if (res.code === 200) {
                this.$router.push({ path: './index' })
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
        case 'edit': { // 编辑
          const param = { 'id': this.formInfo.data.id, 'status': 1, 'staffId': this.$store.state.staff.staffId }
          this.$handleAPI('', updateAppVerStatusApi, param).then(res => {
            if (res.code === 200) {
              this.getDetail()
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
        case 'stop': { // 作废
          const param = { 'id': this.formInfo.data.id, 'status': 3, 'staffId': this.$store.state.staff.staffId }
          this.$handleAPI('', updateAppVerStatusApi, param).then(res => {
            if (res.code === 200) {
              this.getDetail()
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
        case 'submit': { // 发布
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
          this.$handleAPI('', updateApi, this.formInfo.data).then(res => {
            this.$message({
              showClose: true,
              message: res.code === 200 ? '发布成功' : res.message,
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
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'changeAppType': {
          this.formInfo.fieldList.forEach(element => {
            if (element.value === 'apkLink') {
              if (this.formInfo.data.appType === '2') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
                this.formInfo.data.apkLink = ''
              }
            }
            if (element.value === 'apkMd5') {
              if (this.formInfo.data.appType === '2') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
                this.formInfo.data.apkMd5 = ''
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
