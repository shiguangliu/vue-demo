<template>
  <div class="template-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="通知详情" name="tab1">
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
        >
          <!-- 自定义插槽-选择图片 -->
          <template v-slot:form-photo>
            <div class="slot-avatar">
              {{ formInfo.data.membername }}
              <img
                v-imgAlart
                :src="$TH.FILE_URLS.static_url + formInfo.data.photo"
                style="height: 60px;"
                :onerror="nopicture"
              >
            </div>
          </template>
        </page-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getApi, updateApi, deleteApi } from '@/api/sysnotice'
import { getConfigItemsListApi } from '@/api/common'
import defaultImage from '@/assets/img/no-pic.jpg'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'

export default {
  components: {
    PageFilter,
    PageForm
  },
  data() {
    return {
      activeName: 'tab1',
      getApi,
      updateApi,
      noticeId: this.$route.query.noticeId || '',
      status: Number(this.$route.query.status) || 0,
      oldupdatetime: '',
      updateuserid: '',
      okLoading: true,
      ngLoading: true,
      // 相关列表
      listTypeInfo: {
        appTypeList: [],
        pushFlagList: [],
        statusList: [], // 状态列表
        noticeTypeList: [] // 类型
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
        },
        list: []
      },
      // 表单相关（显示）
      formInfo: {
        ref: null,
        readOnly: false,
        data: {
          id: this.$route.query.noticeId || '',
          noticeType: '',
          noticeTime: '',
          staffId: '',
          staffName: '',
          title: '',
          content: '',
          linkUrl: '',
          pushToApp: '',
          pushToAppArr: [],
          pushFlag: '',
          status: ''
        },
        fieldList: [
        ],
        fieldListEdit: [
          { label: '通知ID', value: 'id', type: 'tag', className: 'el-form-block-20' },
          { label: '通知类型', value: 'noticeType', type: 'customselect', key: 'itemValue', name: 'itemName', className: 'el-form-block-30', list: 'noticeTypeList', required: true },
          { label: '通知时间', value: 'noticeTime', type: 'date', dateType: 'datetime', className: 'el-form-block-30' },
          { label: '通知标题', value: 'title', type: 'input', className: 'el-form-block-30', required: true },
          { label: '通知内容', value: 'content', type: 'textarea', className: 'el-form-block-60', autosize: { minRows: 6, maxRows: 10 }, maxlength: 300, showLimit: true, required: true },
          { label: '跳转链接', value: 'linkUrl', type: 'input' },
          { label: '推送平台', value: 'pushToAppArr', type: 'checkbox', className: 'el-form-block-80', list: 'appTypeList', required: true },
          { label: '推送标志', value: 'pushFlag', type: 'tag', key: 'itemValue', name: 'itemName', className: 'el-form-block-20', list: 'pushFlagList' },
          { label: '发布人', value: 'staffName', type: 'tag', className: 'el-form-block-20' },
          { label: '状态', value: 'status', type: 'tag', key: 'itemValue', name: 'itemName', className: 'el-form-block-20', list: 'statusList' }
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
      'userid',
      'roles',
      'staffId'
    ]),
    nopicture() {
      return 'this.src="' + this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
    }
  },
  watch: {
    'formInfo.data.status'(val) {
      // 按钮权限
      this.initButtonList(val)
    }
  },
  created() {
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
    this.getNotice()
  },
  methods: {
    initDataPermits() {
      this.$initDataPermits('sysNoticeDetail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'APP_TYPE' }).then(res => {
        if (res.code === 200) {
          var appTypeList = res.data
          this.listTypeInfo.appTypeList = []
          for (var item of appTypeList) {
            var appType = {
              key: item.itemValue,
              name: item.itemName
            }
            this.listTypeInfo.appTypeList.push(appType)
          }
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PUSH_FLAG' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.pushFlagList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'NOTICE_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.noticeTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'APPROVE_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      // statusList: [], // 状态列表
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    initButtonList(status) {
      status = Number(status)
      // (1：编辑中 2：审批中 3：审批NG 5：审批通过 7:作废)
      if (status === 1) {
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'save', show: false },
          { type: 'button', label: '提交', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'submit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
        this.formInfo.fieldList = this.formInfo.fieldListEdit
      } else if (status === 2) {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'saveLoading', event: 'edit', show: false },
          { type: 'button', label: '审批通过', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'approveOK', show: false },
          { type: 'button', label: '审批不通过', btType: 'primary', icon: 'el-icon-close', loading: 'okLoading', event: 'approveNG', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
        this.formInfo.fieldList = this.formInfo.fieldListEdit
      } else if (status === 3) {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'saveLoading', event: 'edit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
        this.formInfo.fieldList = this.formInfo.fieldListEdit
      } else if (status === 5) {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'saveLoading', event: 'edit', show: false }
        ]
        this.formInfo.fieldList = this.formInfo.fieldListEdit
      } else {
        this.filterInfo.list = []
        this.formInfo.fieldList = this.formInfo.fieldListEdit
      }
      this.initRules()
      this.initDataPermits()
    },
    getNotice() {
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      // 表单验证初始化
      const params = { noticeId: this.noticeId }
      this.$handleAPI('', getApi, params).then(res => {
        if (Number(res.code) === 200) {
          for (const key in res.data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = res.data[key]
            }
          }
          this.formInfo.data.status = this.formInfo.data.status + ''
          this.formInfo.data.appType = this.formInfo.data.appType + ''
          this.formInfo.data.pushFlag = this.formInfo.data.pushFlag + ''
          this.formInfo.data.noticeType = this.formInfo.data.noticeType + ''
        }
      }).catch((error) => {
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          duration: 3500
        })
      })
      this.listLoading = true
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'edit': {
          if (this.formInfo.data.pushFlag === '1') {
            this.$message({
              showClose: true,
              message: '通知已经推送，不可以编辑修改',
              type: 'error',
              duration: 3500
            })
            break
          }
          const props = {
            id: this.noticeId,
            status: 1
          }
          this.$handleAPI('', updateApi, props).then(res => {
            if (Number(res.code) === 200) {
              this.getNotice()
              this.formInfo.fieldList = this.formInfo.fieldListEdit
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
        }
        case 'save': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const props = {
                id: this.noticeId,
                noticeType: this.formInfo.data.noticeType,
                noticeTime: this.$fn.switchTime(this.formInfo.data.noticeTime, 'YYYY-MM-DD hh:mm:ss'),
                title: this.formInfo.data.title,
                content: this.formInfo.data.content,
                linkUrl: this.formInfo.data.linkUrl,
                pushToApp: this.formInfo.data.pushToAppArr.join(','),
                updateBy: this.staffId
              }
              this.$handleAPI('', updateApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.getNotice()
                  this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success',
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
            }
          })
          break
        }
        case 'submit': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const props = {
                id: this.noticeId,
                noticeType: this.formInfo.data.noticeType,
                noticeTime: this.$fn.switchTime(this.formInfo.data.noticeTime, 'YYYY-MM-DD hh:mm:ss'),
                title: this.formInfo.data.title,
                content: this.formInfo.data.content,
                linkUrl: this.formInfo.data.linkUrl,
                pushToApp: this.formInfo.data.pushToAppArr.join(','),
                status: 2,
                updateBy: this.staffId
              }
              this.$handleAPI('', updateApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.getNotice()
                  this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success',
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
            }
          })
          break
        }
        case 'approveOK': {
          var oDate1 = new Date(this.formInfo.data.noticeTime)
          var oDate2 = new Date()
          // 检查增加1分钟，保证能按将来时间运行job
          var min = oDate2.getMinutes()
          oDate2.setMinutes(min + 1)
          if (oDate1.getTime() <= oDate2.getTime()) {
            this.$message({
              showClose: true,
              message: '通知时间已是过去时间，不能通知',
              type: 'error',
              duration: 3500
            })
            break
          }
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const props = {
                id: this.noticeId,
                status: 5,
                updateBy: this.staffId
              }
              this.$handleAPI('', updateApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.status = 5
                  this.getNotice()
                  // msg
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success',
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
            }
          })
          break
        }
        case 'approveNG': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const props = {
                id: this.noticeId,
                status: 3,
                updateBy: this.staffId
              }
              this.$handleAPI('', updateApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.status = 3
                  this.getNotice()
                  // msg
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success',
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
            }
          })
          break
        }
        case 'delete': {
          this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              id: this.noticeId,
              deleteFlag: 1,
              updateBy: this.staffId
            }
            this.deleteLoading = true
            this.$handleAPI('', deleteApi, params).then(res => {
              this.deleteLoading = false
              if (Number(res.code) === 200) {
                this.$message.success('删除成功')
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.push({ path: './index', query: { }, replace: true })
              }
            }).catch((error) => {
              this.resetLoading = false
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
            })
          }).catch((e) => {
          })
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'tableCheck': { // 选择货号
          this.checkboxList = data
          break
        }
      }
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
    }

  }
}
</script>

<style scoped>
  .template-container {
    padding: 0px;
    margin: 20px;
  }
    .image {
    width: 100%;
    display: block;
  }

</style>
