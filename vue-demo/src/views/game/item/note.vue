<template>
  <div class="notice-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="车辆首页说明" name="tab1">
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
          <!-- 自定义插槽-富文本 -->
          <template v-slot:form-description>
            <Tinymce ref="editor" v-model="formInfo.data.note" :height="400" />
          </template>
        </page-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApi, updateApi } from '@/api/game/note'
import defaultImage from '@/assets/img/no-pic.jpg'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import Tinymce from '@/components/Tinymce'

export default {
  components: {
    PageFilter,
    PageForm,
    Tinymce
  },
  data() {
    return {
      activeName: 'tab1',
      noteData: {},
      // 相关列表
      listTypeInfo: {
      },
      // 表格相关（检索结果）
      filterInfo: {
        query: {
        },
        list: [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-plus', event: 'save', show: false, float: 'right' }
        ]
      },
      // 表单相关
      formInfo: {
        ref: null,
        readOnly: false,
        data: {
          note: ''
        },
        fieldList: [
          { value: 'description', type: 'slot', className: 'el-form-block-60' }
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
    ]),
    nopicture() {
      return 'this.src="' + this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
    }
  },
  watch: {
  },
  created() {
    this.getNote()
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('gameItemNote', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    // 下拉框需要初始化加载的列表数据
    initList() {
    },
    getNote() { // 获取数据
      const self = this
      this.$handleAPI('', getApi, { 'noteType': 1 }).then(res => {
        if (res.code === 200) {
          self.formInfo.data.note = res.data.note
          self.noteData = res.data
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
        case 'save': {
          this.$confirm('确定要保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = this.noteData
            if (params.id === null) {
              params.noteType = 1
              params.status = 2
              params.note = this.formInfo.data.note
              params.updateBy = this.staffId
            } else {
              params.note = this.formInfo.data.note
              params.updateBy = this.staffId
            }
            this.$handleAPI('', updateApi, params).then(res => {
              if (res.code === 200) {
                this.formInfo.data.note = res.data.note
                this.noteData = res.data
                this.$message.success('保存成功')
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
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消保存'
            })
          })
          break
        }
      }
    },
    handleEvent(event, data) {
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
