<template>
  <div class="notice-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="拼团须知" name="tab1">
        <page-filter
          :query.sync="filterInfo.query"
          :filter-list="filterInfo.list"
          :list-type-info="listTypeInfo"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
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
          <template v-slot:form-imageurl>
            <div class="slot-avatar" style="margin-top: 10px; margin-bottom: 10px;">
              <img
                v-imgAlart
                :src="$TH.FILE_URLS.static_url + formInfo.data.groupFlowUrl"
                style="height: 30px;"
                :fit="'contain'"
                :onerror="nopicture"
              >
              <el-button
                v-waves
                type="primary"
                icon="el-icon-picture"
                size="mini"
                @click="handleClick('uploadFile')"
              >
                {{ formInfo.data.groupFlowUrl ? '更换图片' : '选择图片' }}
              </el-button>
            </div>
          </template>
          <!-- 自定义插槽-富文本 -->
          <template v-slot:form-description>
            <Tinymce ref="editor" v-model="formInfo.data.groupDescription" :height="400" />
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
            :upload-data="{targetPath: 'group-notice',autoname: '1'}"
            @handleEvent="handleEvent"
          />
        </page-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getNoticeInfoApi, saveNoticeApi } from '@/api/group/groupNotice'
import defaultImage from '@/assets/img/no-pic.jpg'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import Upload from '@/components/Upload'
import Tinymce from '@/components/Tinymce'

export default {
  components: {
    PageFilter,
    PageDialog,
    PageForm,
    Tinymce,
    Upload
  },
  data() {
    return {
      activeName: 'tab1',
      getNoticeInfoApi,
      saveNoticeApi,
      // 相关列表
      listTypeInfo: {
      },
      // 表格相关（检索结果）
      filterInfo: {
        query: {
        },
        list: [
          { type: 'button', label: '保存修改', btType: 'primary', icon: 'el-icon-plus', event: 'save', show: false, float: 'right' }
        ]
      },
      // 表单相关
      formInfo: {
        ref: null,
        readOnly: false,
        data: {
          id: '',
          groupFlowUrl: '',
          groupDescription: ''
        },
        fieldList: [
          { label: 'ID', value: 'id', type: 'tag', className: 'el-form-block-30' },
          { label: '拼团流程图', value: 'imageurl', type: 'slot', className: 'el-form-block' },
          { label: '拼团须知', value: 'description', type: 'slot' }
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
          { label: '关闭', type: '', icon: '', event: 'closeUpload', show: true }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits',
      'staffId'
    ]),
    nopicture() {
      return 'this.src="' + this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
    }
  },
  watch: {
  },
  created() {
    this.getGroupNotice()
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('groupNotice', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    // 下拉框需要初始化加载的列表数据
    initList() {
    },
    getGroupNotice() { // 获取数据
      const params = { }
      const self = this
      this.$handleAPI('', getNoticeInfoApi, params).then(res => {
        if (res.code === 200) {
          self.formInfo.ref.resetFields()
          self.formInfo.data = res.data
          for (const key in res.data) {
            // 存在则赋值
            if (key in self.formInfo.data) {
              self.formInfo.data[key] = res.data[key]
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
      }).catch((error) => {
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          duration: 3500
        })
      })
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
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
        case 'save': {
          const self = this
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const params = self.formInfo.data
              params.operatorId = self.staffId
              this.$handleAPI('', saveNoticeApi, params).then(res => {
                if (res.code === 200) {
                  this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'successs',
                    duration: 3500
                  })
                } else {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error',
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
      }
    },
    handleEvent(event, data) {
      switch (event) {
        case 'upload': { // 上传成功，绑定图片链接到id
          if (this.dialogUpload.type) {
            if (this.dialogUpload.type === 'uploadFile') {
              this.formInfo.data.groupFlowUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
          }
          break
        }
      }
    },
    handleClose(event, tag) {
    }
  }
}
</script>

<style scoped lang="scss">
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
      height: 30px;
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
