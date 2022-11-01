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
      <el-tab-pane label="动态图片组详情" name="tab1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
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
        </el-card>
        <br>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>动态图片组列表</span>
          </div>
          <template>
            <div>
              <el-button
                v-if="formInfo.data.status == 1"
                v-waves
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleClick('create')"
              >
                {{ '新增动态图片' }}
              </el-button>
            </div>
          </template>
          <br>
          <page-table
            :data.sync="tableInfo.data"
            :pager="false"
            :refresh="tableInfo.refresh"
            :auto-fit="false"
            :init-curpage="tableInfo.initCurpage"
            :field-list="tableInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="tableInfo.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 弹窗 -->
    <page-dialog
      :visible.sync="(dialogInfo.type === 'create' || dialogInfo.type === 'detail') && dialogInfo.visible"
      :title="dialogInfo.title[dialogInfo.type]"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- form "-->
      <page-form
        :ref-obj.sync="formDetailInfo.ref"
        :data="formDetailInfo.data"
        :field-list="formDetailInfo.fieldList"
        :rules="formDetailInfo.rules"
        :label-width="formDetailInfo.labelWidth"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      >
        <template v-slot:form-fileLink>
          <div class="slot-avatar">
            <img
              v-imgAlart
              :src="$TH.FILE_URLS.static_url + formDetailInfo.data.fileLink"
              style="height: 60px;"
              :onerror="nopicture"
            >
            <el-button
              v-if="formInfo.data.status=='1'"
              v-waves
              type="primary"
              icon="el-icon-picture"
              size="mini"
              @click="handleClick('uploadFile')"
            >
              {{ '选择图片' }}
            </el-button>
          </div>
        </template>
      </page-form>
      <div class="slot-avatar">
        <el-button
          v-waves
          type="primary"
          icon="el-icon-plus"
          size="mini"
          :disabled="H5List.length > 0"
          @click="handleClick('addBonus')"
        >
          {{ '新增关联H5' }}
        </el-button>
      </div>
      <br>
      <el-table
        :data="H5List"
        border
        height="100"
        tooltip-effect="dark"
        style="width: 100%;"
      >
        <el-table-column
          label="H5 ID"
          width="150"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.id || '-' }}</template>
        </el-table-column>
        <el-table-column
          label="H5名称"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.title || '-' }}</template>
        </el-table-column>
        <el-table-column
          label="图片"
          align="center"
        >
          <template slot-scope="scope">
            <img
              v-imgAlart
              :src="$TH.FILE_URLS.static_url + scope.row.imageUrl"
              style="height: 60px;"
              :onerror="nopicture"
            >
          </template>
        </el-table-column>
        <el-table-column
          label="链接地址"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.jumpLink || '-' }}</template>
        </el-table-column>
        <el-table-column
          label="所属商户"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.merchantName || '-' }}</template>
        </el-table-column>
        <el-table-column
          label="有效时间"
          align="center"
          width="300"
        >
          <template slot-scope="scope">{{ scope.row.validHour || '-' }}</template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="deleteBonusItem(scope.$index, tableData)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </page-dialog>
    <page-dialog
      :title="dialogPopH5.title"
      :visible.sync="dialogPopH5.visible"
      :width="dialogPopH5.width"
      :bt-loading="dialogPopH5.btLoading"
      :bt-list="dialogPopH5.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <PopH5 v-if="dialogPopH5.visible" :custom-query="{ validFrom: formDetailInfo.data.validFrom, validTo: formDetailInfo.data.validTo }" @pickItem="pickItem" />
    </page-dialog>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetailListApi } from '@/api/task/task'
import { getInfoApi, tripMaterialInsert, tripMaterialdelete, tripMaterialUPdate, tripGetMaterialInfo, tripUpdate } from '@/api/ad/trip/detail'
import { updateStatusApi } from '@/api/ad/pop/detail'
import { daleteApi } from '@/api/ad/pop/index'
import { getConfigItemsListApi } from '@/api/common'
import Upload from '@/components/Upload'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import PageTable from '@/components/PageTable'
import PopH5 from '@/components/Popup/PopH5'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageFilter,
    PageForm,
    PageDialog,
    PageTable,
    PopH5,
    Upload
  },
  data() {
    const checkValiddate = (rule, value, callback) => {
      var msg = ''
      if (value !== undefined && value !== null && value.length >= 2) {
        if (value[1] !== null) {
          if (this.$fn.switchTime(value[1], 'YYYY-MM-DD') < this.$fn.switchTime(value[0], 'YYYY-MM-DD')) {
            msg = '有效截止时间必须大于等于今天'
          }
        }
      } else {
        msg = '请输入有效时间'
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    const checkAdSort = (rule, value, callback) => {
      if (value === '') {
        this.formInfo.data.adSort = 0
      } else {
        const check = this.$validate({ label: '排序', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      }
    }
    const checkSort = (rule, value, callback) => {
      if (value === '') {
        this.formDetailInfo.data.sort = 0
      } else {
        const check = this.$validate({ label: '排序', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      }
    }
    return {
      getInfoApi,
      getDetailListApi,
      activeName: 'tab1',
      readOnly: false,
      inputBonusCount: '',
      listTypeInfo: {
        taskTypeList: [],
        statusList: [],
        bonusItemTypeList: []
      },
      // 过滤相关配置（按钮区）
      filterInfo: {
        query: {
        },
        list: []
      },
      H5List: [],
      // 表单相关（追加、修改）
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          title: '',
          validFrom: '',
          validTo: '',
          valid: [],
          adSort: '',
          status: ''
        },
        fieldList: [
          { label: '动态图片组ID', value: 'id', type: 'tag', className: 'el-form-block-30' },
          { label: '动态图片组名称', value: 'title', type: 'input', required: true, className: 'el-form-block-30', maxlength: 200 },
          { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changeAddate', required: true, validator: checkValiddate },
          { label: '排序', value: 'adSort', type: 'input', className: 'el-form-block-30', validator: checkAdSort },
          { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', className: 'el-form-block-30' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 任务明细表单相关（追加、修改）
      formDetailInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          adId: '',
          validDate: [],
          validFrom: '',
          validTo: '',
          fileLink: '',
          fileType: '',
          fileName: '',
          sort: '',
          jumptype: '',
          jumpH5Id: ''
        },
        fieldList: [
          { label: '动态图片ID', value: 'id', type: 'tag', className: 'el-form-48' },
          { label: '图片', value: 'fileLink', type: 'slot', className: 'el-form-block', required: true },
          { label: '图片名称', value: 'fileName', type: 'input', required: true, className: 'el-form-48', maxlength: 200 },
          { label: '有效时间', value: 'validDate', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changedate', required: true, className: 'el-form-block' },
          { label: '排序', value: 'sort', type: 'input', className: 'el-form-48', validator: checkSort }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '动态图片ID', value: 'id', width: 90 },
          { label: '动态图片名称', value: 'fileName' },
          { label: '图片', value: 'fileLink', type: 'image', width: 120 },
          { label: '关联H5 ID', value: 'jumpH5Id', width: 90 },
          { label: '关联H5名称', value: 'jumpH5Name', type: 'tag', width: 160 },
          { label: '有效时间', value: 'validDate' },
          { label: '排序', value: 'sort', width: 90 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: [
            { tooltip: '编辑', label: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'detail', show: true },
            { tooltip: '删除', label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'detaildelete', show: true }
          ]
        }
      },
      // 弹窗相关
      dialogInfo: {
        title: {
          create: '添加',
          detail: '编辑'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'close', show: true },
          { label: '保存', type: 'primary', icon: '', event: 'detailsave', saveLoading: false, show: true }
        ]
      },
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
      dialogPopH5: {
        title: '选择H5',
        visible: false,
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'dialogPopH5Close', show: true }
        ]
      },
      tempBonus: {
        itemId: '',
        itemName: '',
        itemType: '',
        itemTypeName: '',
        itemLogUrl: ''
      },
      tableData: []
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
      this.$initDataPermits('adTripDetail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
    //  下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_SKU_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_TASK_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.taskTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.bonusItemTypeList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
      this.formDetailInfo.rules = this.$initRules(this.formDetailInfo.fieldList)
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      if (this.formDetailInfo.ref) {
        this.formDetailInfo.ref.resetFields()
      }
      // 获取url参数
      this.formInfo.data.id = this.$route.query.id
      this.tableData = []
      // 获取协议详细
      const param = { 'id': this.formInfo.data.id }
      this.$handleAPI('', getInfoApi, param).then(res => {
        if (res.code === 200) {
          console.log(res.data)
          // form表单初始化数据
          const data = res.data
          data.status += ''
          // 显示信息
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = data[key]
              if (key === 'validFrom' && data['validFrom'] !== '0000-00-00 00:00:00' && data['validFrom'] !== null) {
                this.formInfo.data.valid = [data['validFrom'], data['validTo']]
              }
            }
          }
          if (res.data.adminFzAdMaterialDtoList != null) {
            res.data.adminFzAdMaterialDtoList.forEach(item => {
              if (item.validFrom !== null && item.validTo !== null) {
                item.validDate = item.validFrom + '~' + item.validTo
              }
            })
            this.tableInfo.data = res.data.adminFzAdMaterialDtoList
          }
        }
      })
    },
    getDetailTaskList() {
      const param = { 'id': this.formInfo.data.id }
      this.$handleAPI('', getInfoApi, param).then(res => {
        if (res.code === 200) {
          if (res.data.adminFzAdMaterialDtoList != null) {
            res.data.adminFzAdMaterialDtoList.forEach(item => {
              if (item.validFrom !== null && item.validTo !== null) {
                item.validDate = item.validFrom + '~' + item.validTo
              }
            })
            this.tableInfo.data = res.data.adminFzAdMaterialDtoList
          } else {
            this.tableInfo.data = res.data.adminFzAdMaterialDtoList
          }
        }
      })
    },
    // 获取点击事件
    pickItem(data) {
      console.log(data)
      if (data.id != null) {
        this.formDetailInfo.data.jumpH5Id = data.id
        this.formDetailInfo.data.jumpType = 1
        this.H5List = [{
          id: data.id,
          title: data.title,
          imageUrl: data.imageUrl,
          jumpLink: data.jumpLink,
          merchantName: data.merchantName,
          validHour: data.validFrom + '~' + data.validTo + ''
        }]
      }
      this.dialogPopH5.visible = false
    },
    initButtonList(status) {
      status = Number(status)
      if (status === 6) { // 已下架状态
        this.formInfo.readOnly = true
        this.filterInfo.list = []
        this.tableInfo.handle.btList = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false }
        ]
      }
      if (status === 5) { // 已上架状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '下架', btType: 'danger', icon: 'el-icon-bottom', loading: 'deleteLoading', event: 'stop', show: false }
        ]
        this.tableInfo.handle.btList = []
      }
      if (status === 3) { // 审批NG状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
        this.tableInfo.handle.btList = []
      }
      if (status === 2) { // 已保存，审核中状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '审核通过', btType: 'primary', icon: 'el-icon-top', loading: 'submitLoading', event: 'approveOK', show: false },
          { type: 'button', label: '审核不通过', btType: 'danger', icon: 'el-icon-close', loading: 'stopLoading', event: 'approveNG', show: false }
        ]
        this.tableInfo.handle.btList = []
      }
      if (status === 1) { // 编辑状态
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '提交审批', btType: 'primary', icon: 'el-icon-check', loading: 'submitLoading', event: 'submit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
        this.tableInfo.handle.btList = [
          { tooltip: '编辑', label: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'detail', show: true },
          { tooltip: '删除', label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'detaildelete', show: true }
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
              this.formInfo.data.status = '1'
              this.$handleAPI('', tripUpdate, this.formInfo.data).then(res => {
                if (res.code === 200) {
                  this.getDetail()
                }
                this.$message({
                  showClose: true,
                  message: (res.code === 200) ? '操作成功' : res.message,
                  type: (res.code === 200) ? 'success' : 'error',
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
              this.formInfo.data.status = '2'
              this.$handleAPI('', tripUpdate, this.formInfo.data).then(res => {
                if (res.code === 200) {
                  this.getDetail()
                }
                this.$message({
                  showClose: true,
                  message: (res.code === 200) ? '操作成功' : res.message,
                  type: (res.code === 200) ? 'success' : 'error',
                  duration: 3500
                })
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
          this.$handleAPI('delete', daleteApi, mparamDelete).then(res => {
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
          this.$handleAPI('', updateStatusApi, param).then(res => {
            if (res.code === 200) {
              this.getDetail()
            }
          })
          break
        }
        case 'approveOK': {
          const param = {
            'id': this.formInfo.data.id,
            'status': 5,
            'updateBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', updateStatusApi, param).then(res => {
            if (res.code === 200) {
              this.getDetail()
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
          this.$handleAPI('', updateStatusApi, param).then(res => {
            if (res.code === 200) {
              this.getDetail()
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
        case 'stop': {
          const param = {
            'id': this.formInfo.data.id,
            'status': 6,
            'updateBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', updateStatusApi, param).then(res => {
            if (res.code === 200) {
              this.getDetail()
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
        case 'create': // 创建明细
          this.dialogInfo.type = event
          this.dialogInfo.visible = true
          this.tempBonus = {}
          this.tableData = []
          this.H5List = []
          var params = {
            'adId': this.formInfo.data.id,
            'createBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', tripMaterialInsert, params).then(res => {
            if (res.code === 200) {
              this.formDetailInfo.data = res.data
              this.getDetailTaskList()
            }
          })
          break
        case 'close':
          // 弹窗点击关闭
          this.dialogInfo.visible = false
          break
        case 'detailsave':
          this.formDetailInfo.ref.validate(valid => {
            if (valid) {
              this.formDetailInfo.data.adId = this.formInfo.data.id
              var param = this.formDetailInfo.data
              this.$handleAPI('', tripMaterialUPdate, param).then(res => {
                if (res.code === 200) {
                  this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success',
                    duration: 3500
                  })
                  this.getDetailTaskList()
                }
              })
              this.dialogInfo.type = event
              this.dialogInfo.visible = false
            }
          })
          break
        case 'detaildelete':
          var paramsTrip = { id: data.id }
          this.$handleAPI('delete', tripMaterialdelete, paramsTrip).then(res => {
            if (res.code === 200) {
              this.getDetailTaskList()
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
        case 'detail': {
          this.dialogInfo.type = event
          this.dialogInfo.visible = true
          this.$handleAPI('', tripGetMaterialInfo, { 'id': data.id }).then(res => {
            if (res.code === 200) {
              const data = res.data
              this.formDetailInfo.data.validDate = []
              for (const key in data) {
              // 存在则赋值
                if (key in this.formDetailInfo.data) {
                  this.formDetailInfo.data[key] = data[key]
                  if (key === 'validFrom' && data['validFrom'] !== '0000-00-00 00:00:00' && data['validFrom'] !== null) {
                    this.formDetailInfo.data.validDate = [data['validFrom'], data['validTo']]
                  }
                }
              }
              if (res.data.fzH5Dto.id !== null) {
                this.H5List = [{
                  id: res.data.fzH5Dto.id,
                  title: res.data.fzH5Dto.title,
                  imageUrl: res.data.fzH5Dto.imageUrl,
                  jumpLink: res.data.fzH5Dto.jumpLink,
                  merchantName: res.data.fzH5Dto.merchantName,
                  validHour: res.data.fzH5Dto.validFrom + '~' + res.data.fzH5Dto.validTo + ''
                }]
              }
            }
          })
          break
        }
        case 'addBonus': {
          this.dialogPopH5.type = event
          this.dialogPopH5.visible = true
          break
        }
        case 'dialogPopH5Close': {
          this.dialogPopH5.type = event
          this.dialogPopH5.visible = false
          break
        }
        case 'uploadFile': {
          // 上传图片
          this.dialogUpload.title.uploadFile = '图片上传'
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
    deleteBonusItem(index, rows) {
      this.H5List = []
      this.formDetailInfo.data.jumpH5Id = '0'
      this.formDetailInfo.data.jumpType = '0'
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'changeAddate': {
          if (this.formInfo.data.valid !== null) {
            this.formInfo.data.validFrom = this.$fn.switchTime(this.formInfo.data.valid[0])
            this.formInfo.data.validTo = this.$fn.switchTime(this.formInfo.data.valid[1])
          } else {
            this.formInfo.data.validFrom = ''
            this.formInfo.data.validTo = ''
          }
          break
        }
        case 'changedate': {
          if (this.formDetailInfo.data.validDate !== null) {
            this.formDetailInfo.data.validFrom = this.$fn.switchTime(this.formDetailInfo.data.validDate[0])
            this.formDetailInfo.data.validTo = this.$fn.switchTime(this.formDetailInfo.data.validDate[1])
          } else {
            this.formDetailInfo.data.validFrom = ''
            this.formDetailInfo.data.validTo = ''
          }
          break
        }
        case 'upload': { // 上传成功，绑定图片链接到id
          if (this.dialogUpload.type) {
            if (this.dialogUpload.type === 'uploadFile') {
              this.formDetailInfo.data.fileLink = data.fileList[0].relativeUrl
              this.formDetailInfo.data.fileType = data.fileList[0].fileType
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
            if (this.dialogUpload.type === 'uploadVideo') {
              this.formInfo2.data.duration = data.fileList[0].duration
              this.formInfo2.data.fileLink = data.fileList[0].relativeUrl
              this.formInfo2.data.fileType = data.fileList[0].fileType
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
<style scoped lang="scss">
  .group-container {
    height: 800px;
    padding: 20px;

    .slot-avatar{
      width: 200px;
      height: 40px;
      // display: flex;
      align-items: right;
    }
    .slot-avatar1{
      width: 60px;
      height: 30px;
      display: flex;
      align-items: center;
    }
    .image {
      width: 100%;
      display: block;
      align-items: center;
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
