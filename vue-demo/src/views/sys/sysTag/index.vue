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
      :api="getUserHobbyTagList"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 自定义插槽显示状态 -->
      <template v-slot:col-status="scope">
        <i
          :class="scope.row.status === '1' ? 'el-icon-edit' : (scope.row.status === '2' ? 'el-icon-check' : 'el-icon-close')"
          :style="{color: scope.row.status === '3' ? '#f56c6c' : '#67c23a', fontSize: '20px'}"
        />
      </template>
      <!-- 自定义插槽状态按钮 -->
      <template v-slot:bt-status="scope">
        <el-tooltip effect="light" :content="scope.data.row.status === '2' ? '停用' : '启用'" placement="top">
          <el-button
            v-if="scope.data.item.show && (!scope.data.item.ifRender || scope.data.item.ifRender(scope.data.row))"
            v-waves
            size="mini"
            class="handle-button"
            :type="scope.data.row.status === '2' ? 'danger' : 'success'"
            :icon="scope.data.item.imageurl"
            :disabled="scope.data.item.disabled"
            :loading="scope.data.row[scope.data.item.loading]"
            @click="handleClick(scope.data.item.event, scope.data.row)"
          />
        </el-tooltip>
      </template>
    </page-table>
    <!-- 弹窗 -->
    <page-dialog
      :title="dialogInfo.title[dialogInfo.type]"
      :visible.sync="dialogInfo.type !== 'uploadFile' && dialogInfo.visible"
      :width="dialogInfo.width"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- form -->
      <page-form
        v-if="dialogInfo.type !== 'uploadFile'"
        :ref-obj.sync="formInfo.ref"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      >
        <!-- 自定义插槽-选择图片 -->
        <template v-slot:form-imageUrl>
          <div class="slot-avatar">
            <img
              v-imgAlart
              :src="$TH.FILE_URLS.static_url + formInfo.data.imageUrl"
              style="height: 50px; width: 50px;"
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
        <template v-slot:form-head1Url>
          <div class="slot-avatar">
            <img
              v-imgAlart
              :src="$TH.FILE_URLS.static_url + formInfo.data.head1Url"
              style="height: 50px; width: 50px;"
              :onerror="nopicture"
            >
            <el-button
              v-waves
              type="primary"
              icon="el-icon-picture"
              size="mini"
              @click="handleClick('uploadFile1')"
            >
              {{ formInfo.data.head1Url ? '更换图片' : '选择图片' }}
            </el-button>
          </div>
        </template>
        <template v-slot:form-head2Url>
          <div class="slot-avatar">
            <img
              v-imgAlart
              :src="$TH.FILE_URLS.static_url + formInfo.data.head2Url"
              style="height: 50px; width: 50px;"
              :onerror="nopicture"
            >
            <el-button
              v-waves
              type="primary"
              icon="el-icon-picture"
              size="mini"
              @click="handleClick('uploadFile2')"
            >
              {{ formInfo.data.head2Url ? '更换图片' : '选择图片' }}
            </el-button>
          </div>
        </template>
        <template v-slot:form-head3Url>
          <div class="slot-avatar">
            <img
              v-imgAlart
              :src="$TH.FILE_URLS.static_url + formInfo.data.head3Url"
              style="height: 50px; width: 50px;"
              :onerror="nopicture"
            >
            <el-button
              v-waves
              type="primary"
              icon="el-icon-picture"
              size="mini"
              @click="handleClick('uploadFile3')"
            >
              {{ formInfo.data.head3Url ? '更换图片' : '选择图片' }}
            </el-button>
          </div>
        </template>
        <template v-slot:form-head4Url>
          <div class="slot-avatar">
            <img
              v-imgAlart
              :src="$TH.FILE_URLS.static_url + formInfo.data.head4Url"
              style="height: 50px; width: 50px;"
              :onerror="nopicture"
            >
            <el-button
              v-waves
              type="primary"
              icon="el-icon-picture"
              size="mini"
              @click="handleClick('uploadFile4')"
            >
              {{ formInfo.data.head4Url ? '更换图片' : '选择图片' }}
            </el-button>
          </div>
        </template>
        <template v-slot:form-head5Url>
          <div class="slot-avatar">
            <img
              v-imgAlart
              :src="$TH.FILE_URLS.static_url + formInfo.data.head5Url"
              style="height: 50px; width: 50px;"
              :onerror="nopicture"
            >
            <el-button
              v-waves
              type="primary"
              icon="el-icon-picture"
              size="mini"
              @click="handleClick('uploadFile5')"
            >
              {{ formInfo.data.head5Url ? '更换图片' : '选择图片' }}
            </el-button>
          </div>
        </template>
      </page-form>
    </page-dialog>

    <!-- 图片上传弹窗 -->
    <page-dialog
      :title="dialogUpload.title[dialogUpload.type]"
      :visible.sync="dialogUpload.type === 'uploadFile' && dialogUpload.visible"
      :width="dialogUpload.width"
      :bt-loading="dialogUpload.btLoading"
      :bt-list="dialogUpload.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 图片上传组件 -->
      <Upload
        v-if="dialogUpload.type === 'uploadFile' && dialogUpload.visible"
        :upload-data="{targetPath: 'sys-tag',autoname: '1'}"
        @handleEvent="handleEvent"
      />
    </page-dialog>

    <page-dialog
      :title="dialogUpload.title[dialogUpload.type]"
      :visible.sync="dialogUpload.type === 'uploadFile1' && dialogUpload.visible"
      :width="dialogUpload.width"
      :bt-loading="dialogUpload.btLoading"
      :bt-list="dialogUpload.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 图片上传组件 -->
      <Upload
        v-if="dialogUpload.type === 'uploadFile1' && dialogUpload.visible"
        :upload-data="{targetPath: 'sys-tag',autoname: '1'}"
        @handleEvent="handleEvent"
      />
    </page-dialog>
    <page-dialog
      :title="dialogUpload.title[dialogUpload.type]"
      :visible.sync="dialogUpload.type === 'uploadFile2' && dialogUpload.visible"
      :width="dialogUpload.width"
      :bt-loading="dialogUpload.btLoading"
      :bt-list="dialogUpload.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 图片上传组件 -->
      <Upload
        v-if="dialogUpload.type === 'uploadFile2' && dialogUpload.visible"
        :upload-data="{targetPath: 'sys-tag',autoname: '1'}"
        @handleEvent="handleEvent"
      />
    </page-dialog>
    <page-dialog
      :title="dialogUpload.title[dialogUpload.type]"
      :visible.sync="dialogUpload.type === 'uploadFile3' && dialogUpload.visible"
      :width="dialogUpload.width"
      :bt-loading="dialogUpload.btLoading"
      :bt-list="dialogUpload.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 图片上传组件 -->
      <Upload
        v-if="dialogUpload.type === 'uploadFile3' && dialogUpload.visible"
        :upload-data="{targetPath: 'sys-tag',autoname: '1'}"
        @handleEvent="handleEvent"
      />
    </page-dialog>
    <page-dialog
      :title="dialogUpload.title[dialogUpload.type]"
      :visible.sync="dialogUpload.type === 'uploadFile4' && dialogUpload.visible"
      :width="dialogUpload.width"
      :bt-loading="dialogUpload.btLoading"
      :bt-list="dialogUpload.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 图片上传组件 -->
      <Upload
        v-if="dialogUpload.type === 'uploadFile4' && dialogUpload.visible"
        :upload-data="{targetPath: 'sys-tag',autoname: '1'}"
        @handleEvent="handleEvent"
      />
    </page-dialog>
    <page-dialog
      :title="dialogUpload.title[dialogUpload.type]"
      :visible.sync="dialogUpload.type === 'uploadFile5' && dialogUpload.visible"
      :width="dialogUpload.width"
      :bt-loading="dialogUpload.btLoading"
      :bt-list="dialogUpload.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 图片上传组件 -->
      <Upload
        v-if="dialogUpload.type === 'uploadFile5' && dialogUpload.visible"
        :upload-data="{targetPath: 'sys-tag',autoname: '1'}"
        @handleEvent="handleEvent"
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserHobbyTagList, deleteApi, editApi, getApi, createApi, hobbyListForExport } from '@/api/best/tag'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'
import Upload from '@/components/Upload'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageFilter,
    PageTable,
    PageDialog,
    PageForm,
    Upload
  },
  data() {
    // 检测标签ID
    const checkID = (rule, value, callback) => {
      const check = this.$validate({ label: '标签ID', value, rules: ['notnull', 'noChinese', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测标签名称
    const checkTagName = (rule, value, callback) => {
      const check = this.$validate({ label: '标签名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测排序
    const checkSort = (rule, value, callback) => {
      const check = this.$validate({ label: '排序', value, rules: ['notnull', 'noChinese', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      getUserHobbyTagList,
      // checkbox 选中的列表
      checkBoxList: [],
      // 过滤相关配置（检索条件）
      listTypeInfo: {
        tagTypeList: [] // 标签类型列表
      },
      filterInfo: {
        query: {
          tagId: null,
          tagName: null
        },
        list: [
          { type: 'input', label: '标签ID', value: 'tagId' },
          { type: 'input', label: '标签名称', value: 'tagName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: true },
          { type: 'button', label: '批量删除', btType: 'danger', icon: 'el-icon-delete', event: 'delete', show: false },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        tableIndex: false, // 显示序号
        checkBox: true,
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '兴趣爱好标签ID', value: 'tagId', width: '120' },
          { label: '兴趣爱好标签名称', value: 'tagName' },
          { label: '标签图片', value: 'imageUrl', type: 'image' },
          { label: '排序', value: 'sort', width: '100' },
          { label: '创建时间', value: 'createTime', width: '200' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '180',
          btList: [
            { label: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'detail', show: false },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', loading: 'deleteLoading', show: false }
          ]
        }
      },
      // 表单相关（追加、修改）
      formInfo: {
        ref: null,
        data: {
          tagId: '', // *唯一ID
          tagName: '', // *标签名称
          imageUrl: '', // 标签图片链接
          head1Url: '', // 默认头像1图片链接
          head2Url: '', // 默认头像2图片链接
          head3Url: '', // 默认头像3图片链接
          head4Url: '', // 默认头像4图片链接
          head5Url: '', // 默认头像5图片链接
          sort: '', // 排序
          updateTime: '',
          oldUpdateTime: ''
        },
        fieldList: [
          { label: '标签ID', value: 'tagId', type: 'tag', required: true, validator: checkID },
          { label: '兴趣爱好名称', value: 'tagName', type: 'input', className: 'el-form-block', required: true, validator: checkTagName },
          { label: '标签图片', value: 'imageUrl', type: 'slot', className: 'el-form-block' },
          { label: '默认头像1', value: 'head1Url', type: 'slot' },
          { label: '默认头像2', value: 'head2Url', type: 'slot' },
          { label: '默认头像3', value: 'head3Url', type: 'slot' },
          { label: '默认头像4', value: 'head4Url', type: 'slot' },
          { label: '默认头像5', value: 'head5Url', type: 'slot' },
          { label: '排序', value: 'sort', type: 'input', validator: checkSort, className: 'el-form-block', maxlength: 11 }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 弹窗相关
      dialogInfo: {
        title: {
          create: '添加',
          update: '编辑'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'close', show: true },
          { label: '保存', type: 'primary', icon: '', event: 'save', saveLoading: false, show: true }
        ]
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
      'dataPermits'
    ]),
    nopicture() {
      return 'this.src="' + this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
    }
  },
  watch: {
    'dialogInfo.visible'(val) {
      const formInfo = this.formInfo
      if (!val) {
        // 表单验证初始化
        if (formInfo.ref) {
          formInfo.ref.resetFields()
        }
        this.resetForm()
        // 重置弹窗按钮loading
        this.dialogInfo.btLoading = false
        this.dialogInfo.type = ''
      }
    },
    'dialogInfo.type'(val) {
      const formInfo = this.formInfo
      switch (val) {
        case 'create': {
          // 新建品牌
          // 表单验证初始化
          if (formInfo.ref) {
            formInfo.ref.resetFields()
          }
          this.resetForm()
          this.dialogInfo.btLoading = true
          const params = {
            updateBy: this.$store.state.staff.staffId,
            tagType: 20
          }
          this.$handleAPI('', createApi, params).then(res => {
            this.dialogInfo.btLoading = false
            if (res.code === 200) {
              formInfo.data.tagId = res.data.tagId
              formInfo.data.updateTime = res.data.updateTime
            } else {
              this.dialogInfo.visible = false
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          }).catch((error) => {
            this.dialogInfo.visible = false
            this.dialogInfo.btLoading = false
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        }
        case 'update':

          break
      }
    },
    'dialogUpload.visible'(val) {
      if (!val) {
        // 重置弹窗按钮loading
        this.dialogUpload.btLoading = false
      }
    },
    'dialogUpload.type'(val) {
      // 图片上传
    }
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
      this.$initDataPermits('sysTagList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('sysTagList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      const formInfo = this.formInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
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
      const dialogInfo = this.dialogInfo
      const dialogUpload = this.dialogUpload
      const formInfo = this.formInfo
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'create': // 创建
          dialogInfo.type = event
          dialogInfo.visible = true
          break
        case 'detail': // 编辑
          dialogInfo.type = event
          dialogInfo.visible = true
          var params = {
            id: data.tagId
          }
          this.$handleAPI('', getApi, params).then(res => {
            if (res.code === 200) {
              // 显示信息
              for (const key in res.data) {
                if (key in formInfo.data) {
                  formInfo.data[key] = res.data[key]
                }
              }
            } else if (res.code === 500) {
              this.$message({
                showClose: true,
                message: res.message,
                duration: 3500
              })
            }
          })
          break
        case 'delete': { // 删除
          const self = this
          this.$confirm('确定要删除该标签？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var tagIdarr = []
            if (data) {
              tagIdarr.push(data.tagId)
              data.deleteLoading = true
            } else {
              self.checkBoxList.forEach(item => {
                tagIdarr.push(item.tagId)
              })
            }
            if (tagIdarr.length > 0) {
              const params = {
                'tagIds': tagIdarr,
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
        case 'close':
          // 弹窗点击关闭
          dialogInfo.visible = false
          tableInfo.refresh = Math.random()
          break
        case 'closeUpload':
          // 图片上传弹窗点击关闭
          dialogUpload.visible = false
          break
        case 'save': { // 弹窗点击保存
          // 保存
          this.formInfo.ref.validate(valid => {
            if (valid) {
              this.formInfo.data.oldUpdateTime = this.formInfo.data.updateTime
              const params = this.formInfo.data
              dialogInfo.btLoading = true
              this.$handleAPI('', editApi, params).then(res => {
                if (res.code === 200) {
                  dialogInfo.visible = false
                  this.formInfo.data.updateTime = res.data.updateTime
                  tableInfo.refresh = Math.random()
                } else if (res.code === 500) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    duration: 3500
                  })
                }
                dialogInfo.btLoading = false
              }).catch(e => {
                dialogInfo.btLoading = false
              })
            }
          })
          break
        }
        case 'uploadFile':
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        case 'uploadFile1':
          this.dialogUpload.visible = true
          this.dialogUpload.type = 'uploadFile1'
          break
        case 'uploadFile2':
          this.dialogUpload.visible = true
          this.dialogUpload.type = 'uploadFile2'
          break
        case 'uploadFile3':
          this.dialogUpload.visible = true
          this.dialogUpload.type = 'uploadFile3'
          break
        case 'uploadFile4':
          this.dialogUpload.visible = true
          this.dialogUpload.type = 'uploadFile4'
          break
        case 'uploadFile5':
          this.dialogUpload.visible = true
          this.dialogUpload.type = 'uploadFile5'
          break
        case 'export':
          this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
          this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
          this.$handleAPI('', hobbyListForExport, this.filterInfo.query).then(
            res => {
              if (res.code === 200) {
                this.handleDownload(res.data)
              }
            }
          )
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) {
            data.forEach(item => {
              this.$set(item, 'statusLoading', false)
              this.$set(item, 'deleteLoading', false)
              item.createTime = this.$fn.switchTime(item.createTime, 'YYYY-MM-DD hh:mm:ss')
            })
          }
          break
        case 'upload': { // 上传成功，绑定图片链接到id
          var params = ''
          if (data.code === 200) {
            if (this.dialogUpload.type === 'uploadFile') {
              params = {
                tagId: this.formInfo.data.tagId,
                imageUrl: data.fileList[0].relativeUrl,
                oldUpdateTime: this.formInfo.data.updateTime
              }
              this.formInfo.data.imageUrl = data.fileList[0].relativeUrl
            }
            if (this.dialogUpload.type === 'uploadFile1') {
              params = {
                tagId: this.formInfo.data.tagId,
                head1Url: data.fileList[0].relativeUrl,
                oldUpdateTime: this.formInfo.data.updateTime
              }
              this.formInfo.data.head1Url = data.fileList[0].relativeUrl
            }
            if (this.dialogUpload.type === 'uploadFile2') {
              params = {
                tagId: this.formInfo.data.tagId,
                head2Url: data.fileList[0].relativeUrl,
                oldUpdateTime: this.formInfo.data.updateTime
              }
              this.formInfo.data.head2Url = data.fileList[0].relativeUrl
            }
            if (this.dialogUpload.type === 'uploadFile3') {
              params = {
                tagId: this.formInfo.data.tagId,
                head3Url: data.fileList[0].relativeUrl,
                oldUpdateTime: this.formInfo.data.updateTime
              }
              this.formInfo.data.head3Url = data.fileList[0].relativeUrl
            }
            if (this.dialogUpload.type === 'uploadFile4') {
              params = {
                tagId: this.formInfo.data.tagId,
                head4Url: data.fileList[0].relativeUrl,
                oldUpdateTime: this.formInfo.data.updateTime
              }
              this.formInfo.data.head4Url = data.fileList[0].relativeUrl
            }
            if (this.dialogUpload.type === 'uploadFile5') {
              params = {
                tagId: this.formInfo.data.tagId,
                head5Url: data.fileList[0].relativeUrl,
                oldUpdateTime: this.formInfo.data.updateTime
              }
              this.formInfo.data.head5Url = data.fileList[0].relativeUrl
            }
            this.$handleAPI('', editApi, params).then(res => {
              if (res.code === 200) {
                this.formInfo.data.updateTime = res.data.updateTime
              } else if (res.code === 500) {
                this.$message({
                  showClose: true,
                  message: res.message,
                  duration: 3500
                })
              }
            }).catch((error) => {
              data.statusLoading = false
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
            })
            // 关闭弹窗
            this.handleClick('closeUpload')
            return
          }
          break
        }
        case 'tableCheck': { // 选择
          this.checkBoxList = data
          break
        }
      }
    },
    handleDownload(list) {
      import('@/vendor/Export2ExcelImage').then(excel => {
        const column = [
          { title: '标签ID', key: 'tagId', type: 'text', width: 100 },
          { title: '兴趣爱好名称', key: 'tagName', type: 'text', width: 200 },
          { title: '排序', key: 'sort', type: 'text', width: 100 },
          { title: '标签图片', key: 'imageUrl', type: 'image', width: 100, height: 100 },
          { title: '默认头像1', key: 'head1Url', type: 'image', width: 100, height: 100 },
          { title: '默认头像2', key: 'head2Url', type: 'image', width: 100, height: 100 },
          { title: '默认头像3', key: 'head3Url', type: 'image', width: 100, height: 100 },
          { title: '默认头像4', key: 'head4Url', type: 'image', width: 100, height: 100 },
          { title: '默认头像5', key: 'head5Url', type: 'image', width: 100, height: 100 }
        ]
        for (var index in list) {
          list[index]['imageUrl'] = this.$TH.FILE_URLS.static_url + list[index]['imageUrl']
          list[index]['head1Url'] = this.$TH.FILE_URLS.static_url + list[index]['head1Url']
          list[index]['head2Url'] = this.$TH.FILE_URLS.static_url + list[index]['head2Url']
          list[index]['head3Url'] = this.$TH.FILE_URLS.static_url + list[index]['head3Url']
          list[index]['head4Url'] = this.$TH.FILE_URLS.static_url + list[index]['head4Url']
          list[index]['head5Url'] = this.$TH.FILE_URLS.static_url + list[index]['head5Url']
        }
        excel.export_table_to_excel_image(column, list, '基础数据|兴趣爱好标签')
      })
    },
    // 初始化表单
    resetForm() {
      this.formInfo.data = {
        tagId: '', // *唯一ID
        tagType: '',
        tagName: '', // *标签名称
        imageUrl: '', // 首字母
        head1Url: '', // 品牌LOGO
        head2Url: '', // 备注
        head3Url: '', // *状态: 1：编辑中(默认为1)'
        head4Url: '', // *状态: 1：编辑中(默认为1)'
        head5Url: '', // *状态: 1：编辑中(默认为1)'
        sort: '', // *状态: 1：编辑中(默认为1)'
        updateTime: '',
        oldUpdateTime: ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .slot-avatar{
    height: 40px;
    display: flex;
    align-items: center;
    img{
      padding-right: 10px;
    }
  }
</style>
