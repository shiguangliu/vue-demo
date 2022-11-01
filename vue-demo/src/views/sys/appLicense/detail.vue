<template>
  <div class="app-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="协议条款详情" name="tab1">
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
          <template v-slot:form-content>
            <Tinymce ref="editor" v-model="formInfo.data.content" :height="300" :width="1250" />
          </template>
        </page-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetailApi, updateStatusApi, deleteApi, updateDetailApi } from '@/api/system/appabout'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import Tinymce from '@/components/Tinymce'
import { validURL } from '@/common/js/validate.js'
export default {
  components: {
    PageFilter,
    PageForm,
    Tinymce
  },
  data() {
    const checkUrl = (rule, value, callback) => {
      var msg = ''
      if (value !== undefined) {
        var ret = validURL(value)
        if (!ret) {
          msg = '链接格式错误'
        }
      } else {
        msg = '链接格式错误'
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    return {
      getDetailApi,
      updateStatusApi,
      deleteApi,
      updateDetailApi,
      activeName: 'tab1',
      readOnly: false,
      listTypeInfo: {
        aboutTypeList: [],
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
          aboutType: '',
          aboutVer: '',
          staffName: '', // 发布人名字
          title: '', // 标题
          linkUrl: '', // 跳转H5链接url
          status: '', // 发布状态
          deleteFlag: '', // 删除标志
          updateTime: '', // 更新日期
          updateBy: '', // 更新用户ID
          createBy: '', // 创建用户id
          createTime: '', // 创建时间
          releaseTime: '', // 发布时间
          content: '' // 条款内容
        },
        fieldList: [
          { label: '协议ID', value: 'id', type: 'tag', className: 'el-form-block-20' },
          { label: '协议条款类型', value: 'aboutType', type: 'customselect', className: 'el-form-block-30', list: 'aboutTypeList', key: 'itemValue', name: 'itemName', required: true },
          { label: '协议条款版本', value: 'aboutVer', type: 'input', className: 'el-form-block-30', required: true },
          { label: '标题', value: 'title', type: 'input', className: 'el-form-block-30', required: true },
          { label: '跳转链接', value: 'linkUrl', type: 'input', className: 'el-form-block', required: false, validator: checkUrl },
          { label: '协议条款内容', value: 'content', type: 'slot' },
          { label: '发布人', value: 'staffName', type: 'tag', className: 'el-form-block-20' }
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
      this.$initDataPermits('appLicenseDetail', this.filterInfo.list) // 条件区域操作权限
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
      const tparams = {
        'configType': 'ABOUT_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, tparams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.aboutTypeList = res.data
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
      // 获取协议详细
      const param = { 'id': this.formInfo.data.id }
      this.$handleAPI('', getDetailApi, param).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          const data = res.data
          data.aboutType += ''
          data.status += ''
          // 显示信息
          for (const key in res.data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = data[key]
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
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'save': {
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
          break
        }
        case 'delete': {
          this.$confirm('确定要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const param = { 'id': this.formInfo.data.id, 'staffId': this.$store.state.staff.staffId }
            this.$handleAPI('', deleteApi, param).then(res => {
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
        case 'edit': {
          const param = { 'id': this.formInfo.data.id, 'status': 1, 'staffId': this.$store.state.staff.staffId }
          this.$handleAPI('', updateStatusApi, param).then(res => {
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
        case 'stop': {
          const param = { 'id': this.formInfo.data.id, 'status': 3, 'staffId': this.$store.state.staff.staffId }
          this.$handleAPI('', updateStatusApi, param).then(res => {
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
    // 触发事件
    handleEvent(event, data) {
      // switch (event) {
      //   case 'changeCity': {
      //     break
      //   }
      // }
    }
  }
}
</script>
<style lang="scss">
  .notice-container {
    height: 800px;
    padding: 20px;
    .apply {
      margin-top: 40px;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
    .filter-item-right {
      float: right;
    }
    .filter-button {
      display: inline-flex;
      align-items: center;
      margin-bottom: 5px;
      margin-right: 5px;
    }
    .input-number input {
      text-align: right;
    }
    .el-col {
      border-radius: 4px;
    }
    div#gd4-title-row.el-row {
      margin: 0 !important;
      color: rgb(103, 106, 108);
      font-size: 14px;
      div.el-col {
        display:table;
        height: 50px;
        padding: 0 !important;
        border: 1px solid #e7e7e7;
        border-radius: 0;
      }
    }
    .textAlignRight{text-align: right;}
    .el-col p{display:table-cell; vertical-align:middle;}
    .slot-avatar{
      height: 40px;
      display: flex;
      align-items: center;
      img{
        padding-right: 10px;
      }
    }
    .image {
      width: 100%;
      display: block;
    }
    .imgdiv {
      height: 100px;
      overflow: hidden;
    }
    /* 鼠标悬浮时 */
    .el-table--enable-row-hover .el-table__body tr:hover {
      cursor: pointer;
    }
    .input-btn {
      background: #3a8ee6;
      border-color: #3a8ee6;
      color: #FFF;
    }
    .excel-upload-input{
      display: none;
      z-index: -9999;
    }
    .form-notice-container {
      margin-top:20px;
      margin-left: 100px;
      max-width: 600px;
      .article-content {
        margin:0 auto;
        max-width: 100%!important;
        box-sizing: border-box!important;
        -webkit-box-sizing: border-box!important;
        word-wrap: break-word!important;
        img{
          display: inline-block;
          height: auto!important;
          max-width: 100%!important;
          object-fit: scale-down;
        }
      }
    }
  }
</style>
