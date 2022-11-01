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
      <el-tab-pane label="活动详情" name="tab1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <el-row>
            <el-col :span="12">
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
                <!-- 自定义插槽-选择链接 -->
                <template v-slot:form-jumpH5Id>
                  <div class="slot-avatar">
                    <el-link
                      target="_blank"
                      :href="formInfo.data.jumpLink"
                      v-text="formInfo.data.title"
                    />
                    <el-button
                      v-waves
                      type="primary"
                      size="mini"
                      @click="handleClick('relationH5')"
                    >
                      {{ '选择关联H5' }}
                    </el-button>
                  </div>
                </template>
              </page-form>
            </el-col>
            <el-col :span="12">
              <page-form
                :ref-obj.sync="formInfo2.ref"
                :data="formInfo2.data"
                :field-list="formInfo2.fieldList"
                :rules="formInfo2.rules"
                :label-width="formInfo2.labelWidth"
                :list-type-info="listTypeInfo"
                :read-only="formInfo2.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              >
                <!-- 自定义插槽-选择图片 -->
                <template v-slot:form-imageUrl>
                  <div class="slot-avatar">
                    <img
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + formInfo2.data.imageUrl"
                      style="height: 80px;"
                      :onerror="nopicture"
                    >
                    <el-button
                      v-waves
                      type="primary"
                      icon="el-icon-picture"
                      size="mini"
                      @click="handleClick('uploadFileBannerUrl')"
                    >
                      {{ formInfo2.data.fileLink ? '更换图片' : '选择图片' }}
                    </el-button>
                  </div>
                </template>
              </page-form>
            </el-col>
          </el-row>
        </el-card>
        <!-- 图片上传弹窗 -->
        <page-dialog
          :title="dialogUpload.title[dialogUpload.type]"
          :visible.sync="dialogUpload.type === 'uploadFileBannerUrl' && dialogUpload.visible"
          :width="dialogUpload.width"
          :bt-loading="dialogUpload.btLoading"
          :bt-list="dialogUpload.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 图片上传组件 -->
          <Upload
            v-if="dialogUpload.type === 'uploadFileBannerUrl' && dialogUpload.visible"
            :upload-data="{targetPath: 'sys-tag',autoname: '1'}"
            @handleEvent="handleEvent"
          />
        </page-dialog>
        <page-dialog
          :title="dialogH5.title"
          :visible.sync="dialogH5.visible"
          :width="dialogH5.width"
          :bt-loading="dialogH5.btLoading"
          :bt-list="dialogH5.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <PopH5 :custom-query="{ diff: 1 }" @pickItem="pickH5" />
        </page-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAdActivityInfo, listAll, adActivityUpdStatus, adActivityUpd } from '@/api/ad/activity/detail'
import { adActivityDel } from '@/api/ad/activity/index'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import Upload from '@/components/Upload'
import defaultImage from '@/assets/img/no-pic.jpg'
import PopH5 from '@/components/Popup/PopH5'

export default {
  components: {
    PageFilter,
    PageForm,
    PageDialog,
    Upload,
    PopH5
  },
  data() {
    const checkValiddate = (rule, value, callback) => {
      var msg = ''
      if (value.length === 0) {
        msg = '请输入有效时间!'
      }
      if (value.length >= 2) {
        if (value[1] !== null) {
          if (this.$fn.switchTime(value[1], 'YYYY-MM-DD') < this.$fn.switchTime(value[0], 'YYYY-MM-DD')) {
            msg = '有效截止时间必须大于等于今天'
          }
        }
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    const checkAdSort = (rule, value, callback) => {
      if (value === '') {
        this.formInfo.data.sort = 0
      } else {
        const check = this.$validate({ label: '排序', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      }
    }
    const checkH5Id = (rule, value, callback) => {
      var msg = ''
      if (value === 0) {
        msg = '请选择H5链接!'
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    return {
      getAdActivityInfo,
      activeName: 'tab1',
      readOnly: false,
      listTypeInfo: {
        activityTypeList: [],
        statusList: [],
        jumpTypeList: [],
        sceneTypeList: []
      },
      // 过滤相关配置（按钮区）
      filterInfo: {
        query: {
        },
        list: []
      },
      // 表单相关（追加、修改）
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          activityName: '',
          activityType: '',
          validFrom: '',
          validTo: '',
          valid: [],
          sceneTypeArr: [],
          sceneType: '',
          jumpRoute: '',
          status: '',
          sort: '',
          jumpH5Id: '',
          jumpType: '',
          jumpLink: '',
          title: '',
          imageUrl: '',
          updateBy: ''
        },
        fieldList: [
          { label: '活动ID', value: 'id', type: 'tag', className: 'el-form-block' },
          { label: '活动类型', value: 'activityType', type: 'customselect', list: 'activityTypeList', key: 'id', name: 'activityTypeName', required: true },
          { label: '活动名称', value: 'activityName', type: 'input', required: true, className: 'el-form-block' },
          { label: '应用场景', value: 'sceneTypeArr', type: 'checkbox', required: true, className: 'el-form-block', list: 'sceneTypeList' },
          { label: '跳转类型', value: 'jumpType', type: 'customselect', className: 'el-form-block', list: 'jumpTypeList', key: 'itemValue', name: 'itemName', required: true, event: 'jumpTypeConvert' },
          { label: '跳转H5链接', value: 'jumpH5Id', type: 'slot', required: true, show: false, className: 'el-form-block', validator: checkH5Id },
          { label: '跳转链接', value: 'jumpRoute', type: 'input', required: true, show: false, className: 'el-form-block', maxlength: 200 },
          { label: '活动排序', value: 'sort', type: 'input', className: 'el-form-block', required: true, validator: checkAdSort },
          { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changedate', required: true, className: 'el-form-block', validator: checkValiddate },
          { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', className: 'el-form-block' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      formInfo2: {
        ref: null,
        data: {
          imageUrl: ''
        },
        fieldList: [
          { label: '活动图片', value: 'imageUrl', type: 'slot', className: 'el-form-block', required: true }
        ],
        rules: {},
        labelWidth: '120px'
      },
      dialogH5: {
        title: '选择H5',
        visible: false,
        btLoading: false
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
          { label: '关闭', type: '', icon: '', event: 'closeUpload', show: true }
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
      this.$initDataPermits('activityDetail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
    //  下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_SKU_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_JUMP_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.jumpTypeList = res.data
        }
      })
      this.$handleAPI('', listAll, { 'status': 2 }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.activityTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'APP_SCENE' }).then(res => {
        if (res.code === 200) {
          for (var item of res.data) {
            if (item.itemValue === '103' || item.itemValue === '104') {
              var appType = {
                key: item.itemValue,
                name: item.itemName
              }
              this.listTypeInfo.sceneTypeList.push(appType)
            }
          }
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
      this.formInfo2.rules = this.$initRules(this.formInfo2.fieldList)
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
      this.$handleAPI('', getAdActivityInfo, param).then(res => {
        if (res.code === 200) {
          const data = res.data
          data.jumpType += ''
          if (res.data.activityType === 0) {
            res.data.activityType = ''
          }
          if (res.data.sceneTypeArr === null) {
            res.data.sceneTypeArr = []
          }
          // 显示信息
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = data[key]
              if (key === 'validFrom' && data['validFrom'] !== '0000-00-00 00:00:00' && data['validFrom'] !== null) {
                this.formInfo.data.valid = [data['validFrom'], data['validTo']]
              }
            }
            if (key in this.formInfo2.data) {
              this.formInfo2.data[key] = data[key]
            }
          }
          this.formInfo.fieldList.forEach(element => {
            if (this.formInfo.data.jumpType === '2') {
              if (element.value === 'jumpH5Id') {
                element.show = false
              }
              if (element.value === 'jumpRoute') {
                element.show = true
              }
            }
            if (this.formInfo.data.jumpType === '1') {
              if (element.value === 'jumpH5Id') {
                element.show = true
              }
              if (element.value === 'jumpRoute') {
                element.show = false
              }
            }
          })
          if (res.data.fzH5 !== null) {
            this.formInfo.data.title = res.data.fzH5.title
            this.formInfo.data.jumpLink = res.data.fzH5.jumpLink
          }
        }
      })
    },
    initButtonList(status) {
      status = Number(status)
      if (status === 6) { // 已下架状态
        this.formInfo.readOnly = true
        this.formInfo2.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false }
        ]
      }
      if (status === 5) { // 已上架状态
        this.formInfo.readOnly = true
        this.formInfo2.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '下架', btType: 'danger', icon: 'el-icon-bottom', loading: 'deleteLoading', event: 'stop', show: false }
        ]
      }
      if (status === 3) { // 审批NG状态
        this.formInfo.readOnly = true
        this.formInfo2.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
      }
      if (status === 2) { // 已保存，审核中状态
        this.formInfo.readOnly = true
        this.formInfo2.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '审核通过', btType: 'primary', icon: 'el-icon-top', loading: 'submitLoading', event: 'approveOK', show: false },
          { type: 'button', label: '审核不通过', btType: 'danger', icon: 'el-icon-close', loading: 'stopLoading', event: 'approveNG', show: false }
        ]
      }
      if (status === 1) { // 编辑状态
        this.formInfo.readOnly = false
        this.formInfo2.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '提交审批', btType: 'primary', icon: 'el-icon-check', loading: 'submitLoading', event: 'submit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
      }
      this.initDataPermits()
    },
    // 获取点击事件
    pickH5(data) {
      // 获取点击事件
      this.formInfo.data.jumpH5Id = data.id
      this.formInfo.data.title = data.title
      this.formInfo.data.jumpLink = data.jumpLink
      this.dialogH5.visible = false
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'save': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              this.formInfo2.ref.validate(valid => {
                if (valid) {
                  const params = this.formInfo.data
                  params.updateBy = this.$store.state.staff.staffId
                  params.sceneType = this.formInfo.data.sceneTypeArr.join(',')
                  params.imageUrl = this.formInfo2.data.imageUrl
                  this.$handleAPI('', adActivityUpd, params).then(res => {
                    this.$message({
                      showClose: true,
                      message: (res.code === 200) ? '保存成功' : res.message,
                      type: (res.code === 200) ? 'success' : 'error',
                      duration: 3500
                    })
                  })
                }
              })
            }
          })
          break
        }
        case 'delete': {
          var mparamDelete = {
            'id': this.formInfo.data.id,
            'updateBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('delete', adActivityDel, mparamDelete).then(res => {
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
          break
        }
        case 'edit': {
          const param = {
            'id': this.formInfo.data.id,
            'status': 1,
            'updateBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', adActivityUpdStatus, param).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 1
            }
          })
          break
        }
        case 'stop': {
          const param = {
            'id': this.formInfo.data.id,
            'status': 6,
            'updateBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', adActivityUpdStatus, param).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 6
            }
            this.$message({
              showClose: true,
              message: (res.code === 200) ? '操作成功' : res.message,
              type: (res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          })
          break
        }
        case 'approveNG': {
          const param = {
            'id': this.formInfo.data.id,
            'status': 3,
            'updateBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', adActivityUpdStatus, param).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 3
            }
            this.$message({
              showClose: true,
              message: (res.code === 200) ? '操作成功' : res.message,
              type: (res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          })
          break
        }
        case 'approveOK': {
          const param = {
            'id': this.formInfo.data.id,
            'status': 5,
            'updateBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', adActivityUpdStatus, param).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 5
            }
            this.$message({
              showClose: true,
              message: (res.code === 200) ? '操作成功' : res.message,
              type: (res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          })
          break
        }
        case 'submit': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              this.formInfo2.ref.validate(valid => {
                if (valid) {
                  var oldStatus = this.formInfo.data.status
                  const params = this.formInfo.data
                  params.status = 2
                  params.updateBy = this.$store.state.staff.staffId
                  params.sceneType = this.formInfo.data.sceneTypeArr.join(',')
                  params.imageUrl = this.formInfo2.data.imageUrl
                  this.$handleAPI('', adActivityUpd, params).then(res => {
                    if (res.code !== 200) {
                      this.formInfo.data.status = oldStatus
                    }
                    this.$message({
                      showClose: true,
                      message: (res.code === 200) ? '保存成功' : res.message,
                      type: (res.code === 200) ? 'success' : 'error',
                      duration: 3500
                    })
                  })
                }
              })
            }
          })
          break
        }
        case 'relationH5': {
          this.dialogH5.visible = true
          break
        }
        case 'uploadFile':
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        case 'uploadFileBannerUrl':
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
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
        case 'tableCheck': { // 选择货号
          this.checkboxList = data
          break
        }
        case 'jumpTypeConvert' : {
          this.formInfo.fieldList.forEach(element => {
            if (this.formInfo.data.jumpType === '2') {
              if (element.value === 'jumpH5Id') {
                element.show = false
              }
              if (element.value === 'jumpRoute') {
                element.show = true
              }
            }
            if (this.formInfo.data.jumpType === '1') {
              if (element.value === 'jumpH5Id') {
                element.show = true
              }
              if (element.value === 'jumpRoute') {
                element.show = false
              }
            }
          })
          break
        }
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
          if (this.dialogUpload.type === 'uploadFileBannerUrl') {
            if (data.code === 200) {
              const temp = data.fileList
              temp.forEach(item => {
                this.formInfo2.data.imageUrl = item.relativeUrl
              })
            }
          }
          // 关闭弹窗
          this.dialogUpload.visible = false
          break
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
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
      a{
        padding-right: 10px;
        padding-left: 10px;
      }
    }
    .slot-video{
      height: 160px;
      display: inline-block;
      align-items: center;
      video{
        padding-right: 10px;
        width: 300px;
        height: 150px;
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
    .box-card {
      width: 98%;
      margin: 15px 15px;
      border: 1px solid #13C0C5;
      font-size: 16px;
      .el-card__header .el-button {
        font-size: 16px;
      }
      .el-card__body {
        padding: 15px;
      }
    }
  }
</style>
