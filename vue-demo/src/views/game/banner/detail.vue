<template>
  <div class="tab-container">
    <el-row>
      <el-col v-show="formInfo1.data.status === '1'" :span="24" align="left">
        <el-button v-if="dataPermits.includes('gameBannerDetail:save')" class="filter-item" type="primary" size="small" icon="el-icon-check" @click="handleClick('submit')">
          保存
        </el-button>
        <el-button v-if="dataPermits.includes('gameBannerDetail:submit')" class="filter-item" type="primary" size="small" icon="el-icon-check" @click="handleClick('enable')">
          启用
        </el-button>
        <el-button v-if="dataPermits.includes('gameBannerDetail:delete')" class="filter-item" type="danger" size="small" icon="el-icon-delete" @click="handleClick('delete')">
          删除
        </el-button>
      </el-col>
      <el-col v-show="formInfo1.data.status === '2'" :span="24" align="left">
        <el-button v-if="dataPermits.includes('gameBannerDetail:edit')" class="filter-item" type="primary" size="small" icon="el-icon-edit" @click="handleClick('edit')">
          编辑
        </el-button>
        <el-button v-if="dataPermits.includes('gameBannerDetail:stop')" class="filter-item" type="danger" size="small" icon="el-icon-delete" @click="handleClick('reject')">
          不启用
        </el-button>
      </el-col>
      <el-col v-show="formInfo1.data.status === '3'" :span="24" align="left">
        <el-button v-if="dataPermits.includes('gameBannerDetail:edit')" class="filter-item" type="primary" size="small" icon="el-icon-edit" @click="handleClick('edit')">
          编辑
        </el-button>
        <el-button v-if="dataPermits.includes('gameBannerDetail:submit')" class="filter-item" type="primary" size="small" icon="el-icon-check" @click="handleClick('enable')">
          启用
        </el-button>
      </el-col>
    </el-row>
    <br>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="商城banner详情" name="tab1">
        <div class="form-merchant-container">
          <!-- page form 1 -->
          <page-form
            :ref-obj.sync="formInfo1.ref"
            :data="formInfo1.data"
            :field-list="formInfo1.fieldList"
            :rules="formInfo1.rules"
            :label-width="formInfo1.labelWidth"
            :list-type-info="listTypeInfo"
            :read-only="formInfo1.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <!-- 自定义插槽-选择图片 -->
            <template v-slot:form-fileLink>
              <div class="slot-avatar">
                <img
                  v-imgAlart
                  :src="$TH.FILE_URLS.static_url + formInfo1.data.fileLink"
                  style="height: 50px; width: 50px;"
                  :onerror="nopicture"
                >
                <el-button
                  v-waves
                  type="primary"
                  icon="el-icon-picture"
                  size="mini"
                  @click="handleClick('uploadFileBannerUrl')"
                >
                  {{ formInfo1.data.fileLink ? '更换图片' : '选择图片' }}
                </el-button>
              </div>
            </template>
            <!-- 自定义插槽-选择链接 -->
            <template v-slot:form-jumpH5Id>
              <div class="slot-avatar">
                <el-link
                  target="_blank"
                  :href="formInfo1.data.jumpLink"
                  v-text="formInfo1.data.jumpName"
                />
                <el-button
                  v-waves
                  type="primary"
                  size="mini"
                  @click="openDailogH5"
                >
                  {{ '选择关联H5' }}
                </el-button>
              </div>
            </template>
          </page-form>
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
        </div>
      </el-tab-pane>
    </el-tabs>
    <page-dialog
      :title="dialogH5.title"
      :visible.sync="dialogH5.visible"
      :width="dialogH5.width"
      :bt-loading="dialogH5.btLoading"
      :bt-list="dialogH5.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <PopH5 @pickItem="pickItem" />
    </page-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { insertMaterial } from '@/api/merchant/merchant'
import { getApi, updateApi } from '@/api/game/banner/detail'
import { getConfigItemsListApi } from '@/api/common'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import Upload from '@/components/Upload'
import defaultImage from '@/assets/img/no-pic.jpg'
import PopH5 from '@/components/Popup/PopH5'

export default {
  components: {
    PageForm,
    PageDialog,
    PopH5,
    Upload
  },
  data() {
    return {
      getApi,
      updateApi,
      activeName: 'tab1',
      materiallist: [],
      listTypeInfo: {
        jumpTypeList: []
      },
      formInfo1: {
        ref: null,
        readOnly: true,
        data: {
          id: '', // *唯一ID
          title: '', // *商户编号
          fileLink: '', // *商户全称
          description: '',
          valid: [],
          validFrom: '',
          validTo: '',
          jumpType: '',
          status: '',
          jumpH5Id: '',
          sort: '',
          jumpRoute: '',
          statusName: '',
          jumpLink: '',
          jumpName: '',
          updateBy: '',
          updateTime: '' // 更新时间
        },
        fieldList: [
          { label: 'ID', value: 'id', type: 'tag', className: 'el-form-block-20', required: true, disabled: true },
          { label: 'Banner名称', value: 'title', type: 'input', required: true, className: 'el-form-block', maxlength: 200 },
          { label: '图片', value: 'fileLink', type: 'slot', className: 'el-form-block' },
          { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changedate', className: 'el-form-block-20', required: true },
          { label: '跳转类型', value: 'jumpType', type: 'customselect', list: 'jumpTypeList', key: 'itemValue', name: 'itemName', event: 'jumpTypeConvert', required: true, className: 'el-form-block-20' },
          { label: '跳转H5链接', value: 'jumpH5Id', type: 'slot', required: true, show: false, className: 'el-form-block' },
          { label: '跳转原生路由', value: 'jumpRoute', type: 'input', required: true, show: false, className: 'el-form-block', maxlength: 200 },
          { label: '说明', value: 'description', type: 'textarea', maxlength: 500, className: 'el-form-block', autosize: { minRows: 6, maxRows: 10 }},
          { label: '排序', value: 'sort', type: 'input', className: 'el-form-block-20', maxlength: 11 },
          { label: '状态', value: 'statusName', type: 'tag', className: 'el-form-block-20' }
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
      },
      dialogFormVisible: false,
      listLoading: false,
      dialogH5: {
        title: '选择H5链接',
        visible: false,
        btLoading: false
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
    // TODO
  },
  mounted() {
    this.getDetail()
    this.initDataPermits()
    // 验证规则
    this.initRules()
  },
  methods: {
    // 打开H5弹框
    openDailogH5() {
      this.dialogH5.visible = true
    },
    // 获取点击事件
    pickItem(data) {
      console.log(data)
      this.formInfo1.data.jumpH5Id = data.id
      this.formInfo1.data.jumpName = data.title
      this.formInfo1.data.jumpLink = data.jumpLink
      console.log(this.formInfo1.data)
      this.dialogH5.visible = false
    },
    // 初始化数据权限
    initDataPermits() {
      // 画面控制
    },
    getDetail() {
      // 下拉框需要初始化加载的列表数据
      const params = {
        'configType': 'PLAT_JUMP_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.jumpTypeList = res.data
        }
      })
      // 初始化设置 form fileds
      if (this.formInfo1.ref) {
        this.formInfo1.ref.resetFields()
      }
      // 获取url参数
      this.formInfo1.data.id = this.$route.query.id
      // 获取merchant详细
      const mparam = { 'id': this.formInfo1.data.id }
      this.$handleAPI('', getApi, mparam).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          console.log(res)
          const data = res.data
          data.status += ''
          data.jumpType += ''
          if (data.status === '1') {
            this.formInfo1.readOnly = false
          }
          // 显示信息
          for (const key in res.data) {
            // 存在则赋值
            if (key in this.formInfo1.data) {
              this.formInfo1.data[key] = data[key]
              if (key === 'validFrom' && res.data['validFrom'] !== '0000-00-00 00:00:00' && res.data['validFrom'] !== null) {
                this.formInfo1.data.valid = [res.data['validFrom'], res.data['validTo']]
              }
            }
          }
          this.formInfo1.fieldList.forEach(element => {
            if (this.formInfo1.data.jumpType === '2') {
              if (element.value === 'jumpH5Id') {
                element.show = false
              }
              if (element.value === 'jumpRoute') {
                element.show = true
              }
            }
            if (this.formInfo1.data.jumpType === '1') {
              if (element.value === 'jumpH5Id') {
                element.show = true
              }
              if (element.value === 'jumpRoute') {
                element.show = false
              }
            }
          })
          // 初始化select选择框
          this.handleEvent('changeProvince', null)
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo1.rules = this.$initRules(this.formInfo1.fieldList)
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'submit': {
          // 验证flag
          var flag = true
          if (this.formInfo1.data.jumpType === '1') {
            if (this.formInfo1.data.jumpH5Id === '' || this.formInfo1.data.jumpH5Id === 0) {
              flag = false
            }
          }
          this.formInfo1.ref.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          if (flag === true) {
            this.formInfo1.data.validFrom = this.$fn.switchTime(this.formInfo1.data.valid[0])
            this.formInfo1.data.validTo = this.$fn.switchTime(this.formInfo1.data.valid[1])
            const merchantData = this.formInfo1.data
            merchantData.status = '1'
            merchantData.updateBy = this.$store.state.staff.staffId
            this.$handleAPI('', updateApi, merchantData).then(res => {
              if (res.code === 200) {
                this.formInfo1.data.status = '1'
                this.formInfo1.readOnly = false
              }
              this.$message({
                showClose: true,
                message: (res.code === 200) ? '已提交' : res.message,
                type: (res.code === 200) ? 'success' : 'error',
                duration: 3500
              })
            })
          } else {
            this.$message({
              showClose: true,
              message: '请检查所有必输项目',
              type: 'error',
              duration: 3500
            })
          }
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
          break
        case 'edit':
          var mparam = {
            'id': this.formInfo1.data.id,
            'updateBy': this.$store.state.staff.staffId,
            'status': 1
          }
          this.$handleAPI('', updateApi, mparam).then(res => {
            if (res.code === 200) {
              this.getDetail()
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
        case 'reject':
          var mparams = {
            'id': this.formInfo1.data.id,
            'updateBy': this.$store.state.staff.staffId,
            'status': 3
          }
          this.$handleAPI('', updateApi, mparams).then(res => {
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
          }).catch((error) => {
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        case 'enable':
          // 验证flag
          var flags = true
          if (this.formInfo1.data.jumpType === '1') {
            if (this.formInfo1.data.jumpH5Id === '' || this.formInfo1.data.jumpH5Id === 0) {
              flag = false
            }
          }
          this.formInfo1.ref.validate(valid => {
            if (!valid) {
              flags = false
            }
          })
          if (flags === true) {
            this.formInfo1.data.validFrom = this.$fn.switchTime(this.formInfo1.data.valid[0])
            this.formInfo1.data.validTo = this.$fn.switchTime(this.formInfo1.data.valid[1])
            var mparamFrom = this.formInfo1.data
            mparamFrom.updateBy = this.$store.state.staff.staffId
            mparamFrom.status = 2
            this.$handleAPI('', updateApi, mparamFrom).then(res => {
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
            }).catch((error) => {
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
            })
          } else {
            this.$message({
              showClose: true,
              message: '请检查所有必输项目',
              type: 'error',
              duration: 3500
            })
          }
          break
        case 'delete':
          var mparamDelete = {
            'id': this.formInfo1.data.id,
            'updateBy': this.$store.state.staff.staffId,
            'deleteFlag': 1
          }
          this.$handleAPI('delete', updateApi, mparamDelete).then(res => {
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
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'jumpTypeConvert' : {
          this.formInfo1.fieldList.forEach(element => {
            if (this.formInfo1.data.jumpType === '2') {
              if (element.value === 'jumpH5Id') {
                element.show = false
              }
              if (element.value === 'jumpRoute') {
                element.show = true
              }
            }
            if (this.formInfo1.data.jumpType === '1') {
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
          console.log(this.formInfo1.data)
          if (this.formInfo1.data.valid !== null) {
            this.formInfo1.data.validFrom = this.$fn.switchTime(this.formInfo1.data.valid[0])
            this.formInfo1.data.validTo = this.$fn.switchTime(this.formInfo1.data.valid[1])
          } else {
            this.formInfo1.data.validFrom = ''
            this.formInfo1.data.validTo = ''
          }
          break
        }
        case 'upload': { // 上传成功，绑定图片链接到id
          console.log(this.dialogUpload)
          if (this.dialogUpload.type === 'uploadFile') {
            if (data.code === 200) {
              const temp = data.fileList
              temp.forEach(item => {
                const params = {
                  'id': this.$route.query.id,
                  'fileLink': item.relativeUrl,
                  'fileType': 1,
                  'fileStyle': 1,
                  'createBy': this.$store.state.staff.staffId
                }
                this.$handleAPI('', insertMaterial, params).then(res => {
                  if (res.code === 200) {
                    // 异步合并数组文件文件列表
                    // 遍历temp push
                    this.materiallist.push(res.data)
                  }
                }).catch((error) => {
                  this.$message({
                    showClose: true,
                    message: error,
                    type: 'error',
                    duration: 3500
                  })
                })
              })
            }
          }
          if (this.dialogUpload.type === 'uploadFileBannerUrl') {
            if (data.code === 200) {
              const temp = data.fileList
              temp.forEach(item => {
                const params = {
                  'id': this.formInfo1.data.id,
                  'fileLink': item.relativeUrl,
                  'fileType': 1,
                  'fileStyle': 1,
                  'createBy': this.$store.state.staff.staffId
                }
                this.$handleAPI('', updateApi, params).then(res => {
                  if (res.code === 200) {
                    this.formInfo1.data.fileLink = item.relativeUrl
                  }
                }).catch((error) => {
                  this.$message({
                    showClose: true,
                    message: error,
                    type: 'error',
                    duration: 3500
                  })
                })
              })
            }
          }
          // 关闭弹窗
          this.handleClick('closeUpload')
          break
        }
      }
    },

    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getUserList()
    },
    resetTemp() {
      this.temp = {
        userid: undefined,
        employeeno: '',
        usernm: '',
        usertype: '',
        isvalid: ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
</style>
