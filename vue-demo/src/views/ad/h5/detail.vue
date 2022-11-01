<template>
  <div class="group-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="H5详情" name="tab1">
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
          <template v-slot:form-imageUrl>
            <div class="slot-avatar">
              <img
                v-imgAlart
                :src="$TH.FILE_URLS.static_url + formInfo.data.imageUrl"
                style="height: 60px;"
                :onerror="nopicture"
              >
              <el-button
                v-waves
                type="primary"
                icon="el-icon-picture"
                size="mini"
                @click="handleClick('uploadFile')"
              >
                {{ formInfo.data.imageUrl ? '更换图片' : '选择图片' }}
              </el-button>
            </div>
          </template>
        </page-form>

        <!-- 图片上传弹窗 -->
        <page-dialog
          :title="dialogUpload.title[dialogUpload.type]"
          :visible="dialogUpload.type === 'uploadFile' && dialogUpload.visible"
          :width="dialogUpload.width"
          :bt-loading="dialogUpload.btLoading"
          :bt-list="dialogUpload.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 图片上传组件 -->
          <Upload
            v-if="dialogUpload.type === 'uploadFile' && dialogUpload.visible"
            :upload-data="{targetPath: 'ad-h5',autoname: '1'}"
            @handleEvent="handleEvent"
          />
        </page-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetailApi, deleteApi, updateDetailApi, updateStatusApi } from '@/api/ad/h5'
import { getConfigItemsListApi, getMerchantListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import Upload from '@/components/Upload'
import defaultImage from '@/assets/img/no-pic.jpg'
import { validURL } from '@/common/js/validate.js'
export default {
  components: {
    PageFilter,
    PageForm,
    PageDialog,
    Upload
  },
  data() {
    // const checkValiddate = (rule, value, callback) => {
    //   var msg = ''
    //   if (value !== undefined && value.length >= 2) {
    //     if (value[1] !== null) {
    //       if (this.$fn.switchTime(value[1], 'YYYY-MM-DD') < this.$fn.switchTime(new Date(), 'YYYY-MM-DD')) {
    //         msg = '有效截止时间必须大于等于今天'
    //       }
    //     }
    //   } else {
    //     msg = '请输入有效时间'
    //   }
    //   if (msg === '') {
    //     callback()
    //   } else {
    //     callback(new Error(msg))
    //   }
    // }
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
      activeName: 'tab1',
      readOnly: false,
      listTypeInfo: {
        merchantList: [],
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
          title: '',
          merchantId: '',
          validFrom: '',
          validTo: '',
          valid: [],
          imageUrl: '',
          jumpLink: '',
          status: ''
        },
        fieldList: [
          { label: 'H5ID', value: 'id', type: 'tag', className: 'el-form-block-30' },
          { label: 'H5名称', value: 'title', type: 'input', required: true, className: 'el-form-block-40' },
          { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changedate', required: true },
          { label: '链接地址', value: 'jumpLink', type: 'input', required: true, validator: checkUrl, className: 'el-form-block-40' },
          { label: '所属商户', value: 'merchantId', type: 'customselect', list: 'merchantList', key: 'id', name: 'merchantName', required: true, className: 'el-form-block-40' },
          { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-block-30' },
          { label: '缩略图', value: 'imageUrl', type: 'slot', required: true }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 图片上传弹窗相关
      dialogUpload: {
        title: {
          uploadFile: '图片上传'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', btType: 'primary', type: 'button', icon: 'el-icon-close', event: 'closeUpload', show: true }
        ]
      },
      filterUpload: {
        query: {
        },
        list: []
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
      this.$initDataPermits('adH5Detail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
    //  下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
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
          // 显示信息
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = data[key]
              if (key === 'merchantId' && data[key] === 0) {
                this.formInfo.data[key] = ''
              }
              if (key === 'validFrom' && data['validFrom'] !== '0000-00-00 00:00:00' && data['validFrom'] !== null) {
                this.formInfo.data.valid = [data['validFrom'], data['validTo']]
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
          const param = { 'id': this.formInfo.data.id, 'status': 1, 'staffId': this.$store.state.staff.staffId }
          this.$handleAPI('', updateStatusApi, param).then(res => {
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
          const param = { 'id': this.formInfo.data.id, 'status': 3, 'staffId': this.$store.state.staff.staffId }
          this.$handleAPI('', updateStatusApi, param).then(res => {
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
          this.formInfo.ref.validate(valid => {
            if (valid) {
              var temStatus = this.formInfo.data.status
              this.formInfo.data.status = 2
              this.formInfo.data.updateBy = this.$store.state.staff.staffId
              this.$handleAPI('', updateDetailApi, this.formInfo.data).then(res => {
                this.$message({
                  showClose: true,
                  message: (res.code === 200) ? '启用成功' : res.message,
                  type: (res.code === 200) ? 'success' : 'error',
                  duration: 3500
                })
                if (res.code !== 200) {
                  this.formInfo.data.status = temStatus
                }
              })
            }
          })
          break
        }
        case 'uploadFile': {
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        }
        case 'closeUpload':
          // 图片上传弹窗点击关闭
          this.dialogUpload.visible = false
          this.dialogUpload.type = ''
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'changedate': {
          if (this.formInfo.data.valid !== null) {
            this.formInfo.data.validFrom = this.$fn.switchTime(this.formInfo.data.valid[0])
            this.formInfo.data.validTo = this.$fn.switchTime(this.formInfo.data.valid[1])
          } else {
            this.formInfo.data.validFrom = ''
            this.formInfo.data.validTo = ''
          }
          break
        }
        case 'upload': { // 上传成功，绑定图片链接到id
          if (this.dialogUpload.type) {
            if (this.dialogUpload.type === 'uploadFile') {
              this.formInfo.data.imageUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
          }
          break
        }
      }
    }
  }
}
</script>
<style lang="scss">
  .group-container {
    height: 800px;
    padding: 20px;

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
  }
</style>
、
