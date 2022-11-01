<template>
  <div class="coupon-detail-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="票券管理详情" name="tab1">
        <el-card class="box-card" style="border-color: #13C0C5;">
          <div slot="header" class="clearfix">
            <span>基础信息</span>
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
          >
            <template v-slot:form-validDate>
              <el-tag size="medium">{{ formInfo.data.validFrom + ' ~ ' + formInfo.data.validTo }}</el-tag>
            </template>
            <template v-slot:form-thumbnailUrl>
              <div class="slot-avatar">
                <img
                  v-imgAlart
                  height="100px"
                  :fit="'contain'"
                  :src="$TH.FILE_URLS.static_url + formInfo.data.thumbnailUrl"
                  :onerror="nopicture"
                >
                <el-button type="primary" @click="handleClick('uploadThumbnail')">上传缩略图</el-button>
              </div>
            </template>
          </page-form>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px;border-color: #13C0C5;">
          <div slot="header" class="clearfix">
            <span>关联H5设置</span>
            <el-button type="primary" icon="el-icon-plus" :disabled="showPickDialogBtnDisabled" style="float: right;" @click="handleClick('showH5Pop')">新增关联H5</el-button>
          </div>
          <page-table
            class="h5_table"
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurPage"
            :data.sync="tableInfo.data"
            :api="getH5Api"
            :query="tableInfo.query"
            :field-list="tableInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="tableInfo.handle"
            :pager="tableInfo.pager"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <template v-slot:col-validDate="scope">
              <p v-if="scope.row.validFrom != null && scope.row.validTo != null">{{ scope.row.validFrom + ' ~ ' + scope.row.validTo }}</p>
            </template>
            <template v-slot:col-objectType="scope">
              <p>{{ getObjectTypeName(scope.row.objectType) }}</p>
            </template>
            <template v-slot:col-merchantId="scope">
              <p>{{ getMerchantName(scope.row.merchantId) }}</p>
            </template>
            <template v-slot:col-status="scope">
              <p>{{ getGeneralStatusName(scope.row.status) }}</p>
            </template>
          </page-table>
        </el-card>
        <!-- H5 -->
        <page-dialog
          :title="popupDialog.title"
          :visible.sync="popupDialog.visible"
          :width="popupDialog.width"
          :bt-loading="popupDialog.btLoading"
          :bt-list="popupDialog.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <PopH5 v-if="popupDialog.visible" :custom-query="{ merchantId: formInfo.data.merchantId, validFrom: formInfo.data.validFrom, validTo: formInfo.data.validTo }" @pickItem="pickItem" />
        </page-dialog>
        <!-- 添加卡券 -->
        <page-dialog
          :v-if="formDialog.visible"
          :title="formDialog.title"
          :visible.sync="formDialog.visible"
          :width="formDialog.width"
          :bt-loading="formDialog.btLoading"
          :bt-list="formDialog.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <page-form
            :ref-obj.sync="recordFormInfo.ref"
            :data="recordFormInfo.data"
            :field-list="recordFormInfo.fieldList"
            :rules="recordFormInfo.rules"
            :label-width="recordFormInfo.labelWidth"
            :list-type-info="listTypeInfo"
            :read-only="recordFormInfo.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <!-- 自定义插槽显示状态 -->
            <template v-slot:form-qrCodeUrl>
              <div class="slot-avatar">
                <img
                  v-imgAlart
                  height="100px"
                  :fit="'contain'"
                  :src="$TH.FILE_URLS.static_url + recordFormInfo.data.qrCodeUrl"
                  :onerror="nopicture"
                >
                <el-button type="primary" @click="handleClick('uploadQrCode')">上传二维码</el-button>
              </div>
            </template>
          </page-form>
        </page-dialog>
        <page-dialog
          :title="dialogUpload.title[dialogUpload.type]"
          :visible.sync="(dialogUpload.type === 'uploadThumbnail' || dialogUpload.type === 'uploadQrCode') && dialogUpload.visible"
          :width="dialogUpload.width"
          :bt-loading="dialogUpload.btLoading"
          :bt-list="dialogUpload.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 图片上传组件 -->
          <Upload
            v-if="dialogUpload.type === 'uploadThumbnail' && dialogUpload.visible"
            :upload-data="{targetPath: 'coupon/' + couponId + '/', autoname: '1'}"
            @handleEvent="handleEvent"
          />
          <!-- 图片上传组件 -->
          <Upload
            v-if="dialogUpload.type === 'uploadQrCode' && dialogUpload.visible"
            :upload-data="{targetPath: 'couponrecord/' + couponId + '/', autoname: '1'}"
            @handleEvent="handleEvent"
          />
        </page-dialog>
        <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="uploadRuleExcel">
      </el-tab-pane>
      <el-tab-pane label="券库列表" name="tab2">
        <el-card class="box-card" style="border-color: #13C0C5;">
          <div slot="header" class="clearfix">
            <span>券库</span>
            <div style="float: right;">
              <el-button type="primary" icon="el-icon-download" @click="handleClick('download')">下载模板</el-button>
              <el-button type="primary" icon="el-icon-upload" :disabled="showPickDialogBtnDisabled" @click="handleClick('import')">批量导入</el-button>
              <el-button type="primary" icon="el-icon-plus" :disabled="showPickDialogBtnDisabled" @click="handleClick('addCouponRecord')">添加</el-button>
            </div>
          </div>
          <page-table
            :refresh="couponRecordTableInfo.refresh"
            :init-curpage="couponRecordTableInfo.initCurPage"
            :data.sync="couponRecordTableInfo.data"
            :api="getCouponRecordListApi"
            :query="couponRecordTableInfo.query"
            :field-list="couponRecordTableInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="couponRecordTableInfo.handle"
            :pager="couponRecordTableInfo.pager"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <template v-slot:col-validDate="scope">
              <p v-if="scope.row.validFrom != null && scope.row.validTo != null">{{ scope.row.validFrom + ' ~ ' + scope.row.validTo }}</p>
            </template>
            <!-- <template v-slot:col-objectType="scope">
              <p>{{ getObjectTypeName(scope.row.objectType) }}</p>
            </template> -->
          </page-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi, getMerchantListApi } from '@/api/common'
import { getApi, updateApi, getCouponRecordListApi, createCouponRecordApi, updateCouponRecordApi, importCouponRecordApi, getRptListApi } from '@/api/fzcoupon'
import { getH5Api } from '@/api/fztriplotterypool'
import PageFilter from '@/components/PageFilter'
import PageDialog from '@/components/PageDialog'
import PageTable from '@/components/PageTable'
import PageForm from '@/components/PageForm'
import PopH5 from '@/components/Popup/PopH5'
import defaultImage from '@/assets/img/no-pic.jpg'
import Upload from '@/components/Upload'
import XLSX from 'xlsx'

export default {
  components: {
    PageFilter,
    PageDialog,
    PageForm,
    PageTable,
    PopH5,
    Upload
  },
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    const checkName = (rule, value, callback) => {
      const check = this.$validate({ label: '票券名称、说明', value, rules: ['notnull', 'length'], conditions: [1, 60] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkValidFrom = (rule, value, callback) => {
      const check = this.$validate({ label: '有效时间', value: this.formInfo.data.validFrom, rules: ['notnull'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkRecordValidFrom = (rule, value, callback) => {
      const check = this.$validate({ label: '有效时间', value: this.recordFormInfo.data.validFrom, rules: ['notnull'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkPrice = (rule, value, callback) => {
      const check = this.$validate({ label: '价格', value, rules: ['notnull', 'length'], conditions: [1, 1000] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      downloadUrl: '',
      objTypeDialog: {
        title: '选择关联H5',
        visible: false,
        btLoading: false,
        width: '500px',
        height: '300px'
      },
      activeName: 'tab1',
      getApi,
      updateApi,
      getH5Api,
      getCouponRecordListApi,
      couponId: this.$route.query.couponId || '',
      status: this.$route.query.status || '',
      showPickDialogBtnDisabled: false,
      tableApiName: undefined,
      btnChangeEnable: '',
      // 相关列表
      listTypeInfo: {
        merchantList: [],
        approveStatusList: [],
        statusList: []
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
        data: {
          id: this.$route.query.couponId || '',
          couponName: '',
          validFrom: '',
          validTo: '',
          description: '',
          merchantId: '',
          price: '',
          status: '',
          valid: [],
          note: '',
          thumbnailUrl: '',
          jumpH5Id: 0
        },
        fieldList: [],
        rules: {},
        labelWidth: '120px'
      },
      couponFieldList: [
        { label: '票券ID', value: 'id', type: 'tag', className: 'el-form-block-30' },
        { label: '票券名称', value: 'couponName', type: 'tag', required: true, className: 'el-form-block-30' },
        { label: '票券说明', value: 'description', type: 'tag', required: true, className: 'el-form-block-30' },
        { label: '所属商户', value: 'merchantId', type: 'customselect', list: 'merchantList', key: 'id', name: 'merchantName', className: 'el-form-block-30' },
        { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', className: 'el-form-block-60' },
        { label: '价格', value: 'price', type: 'tag', append: 'append', fixtext: '元', className: 'el-form-block-30' },
        { label: '使用须知', value: 'note', type: 'textarea', autosize: { minRows: 6, maxRows: 6 }, maxlength: 100, showLimit: true, className: 'el-form-block-30' },
        { label: '状态', value: 'status', type: 'tag', list: 'approveStatusList', key: 'itemValue', name: 'itemName', className: 'el-form-block-30' },
        { label: '缩略图', value: 'thumbnailUrl', type: 'slot', className: 'el-form-block' }
      ],
      couponFieldListEdit: [
        { label: '票券ID', value: 'id', type: 'tag', className: 'el-form-block-30' },
        { label: '票券名称', value: 'couponName', type: 'input', required: true, validator: checkName, className: 'el-form-block-30' },
        { label: '票券说明', value: 'description', type: 'input', required: true, validator: checkName, className: 'el-form-block-30' },
        { label: '所属商户', value: 'merchantId', type: 'customselect', required: true, list: 'merchantList', key: 'id', name: 'merchantName', className: 'el-form-block-30' },
        { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', event: 'changedate', beforeAfterFlag: 'after', required: true, validator: checkValidFrom, className: 'el-form-block-60' },
        { label: '价格', value: 'price', type: 'input', append: 'append', fixtext: '元', required: true, validator: checkPrice, className: 'el-form-block-30' },
        { label: '使用须知', value: 'note', type: 'textarea', autosize: { minRows: 6, maxRows: 6 }, maxlength: 200, showLimit: true, className: 'el-form-block-30' },
        { label: '状态', value: 'status', type: 'tag', list: 'approveStatusList', key: 'itemValue', name: 'itemName', className: 'el-form-block-30' },
        { label: '缩略图', value: 'thumbnailUrl', type: 'slot', className: 'el-form-inline-block' }
      ],
      tableInfo: {
        refresh: 1,
        initCurPage: 1,
        pager: false, // 不分页（单个层级数据量不大）
        tableIndex: false,
        data: [],
        fieldList: [
          { label: 'H5ID', value: 'id', width: '60px' },
          { label: 'H5名称', value: 'title' },
          { label: '缩略图', value: 'imageUrl', type: 'image' },
          { label: '链接地址', value: 'jumpLink', width: '300px' },
          { label: '所属商户', value: 'merchantId', type: 'slot' },
          { label: '有效时间', value: 'validDate', type: 'slot' },
          { label: '创建时间', value: 'createTime' },
          { label: '状态', value: 'status', type: 'slot', width: '60px' }
        ],
        query: {},
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: [
            // { label: '编辑', tooltip: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'editLottery', show: true },
            { label: '删除', tooltip: '删除', type: 'danger', icon: 'el-icon-delete', event: 'deleteH5', show: true }
          ]
        }
      },
      couponRecordTableInfo: {
        refresh: 1,
        initCurPage: 1,
        pager: true,
        tableIndex: false,
        data: [],
        fieldList: [
          { label: '券号', value: 'couponNo', width: '150px' },
          { label: '券密', value: 'couponKeyHide', width: '180px' },
          { label: '状态', value: 'statusName', type: 'tag', width: '80px' },
          { label: '二维码', value: 'qrCodeUrl', type: 'image' },
          { label: '票券有效时间', value: 'validDate', type: 'slot', width: '280px' },
          { label: '领取人ID', value: 'linkUserId' },
          { label: '领取人手机', value: 'linkPhone' },
          { label: '领取时间', value: 'linkTime' },
          { label: '订单号', value: 'transNo' },
          { label: '购买时间', value: 'transTime' },
          { label: '实付', value: 'payAmount' },
          { label: '付款方式', value: 'payTypeName' }
        ],
        query: { couponId: this.$route.query.couponId },
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: [
            { label: '编辑', tooltip: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'editCouponRecord', show: true },
            { label: '删除', tooltip: '删除', type: 'danger', icon: 'el-icon-delete', event: 'deleteCouponRecord', show: true }
          ]
        }
      },
      popupDialog: {
        title: '',
        typeVal: '',
        visible: false,
        btLoading: false,
        height: '600px'
      },
      formDialog: {
        title: '',
        typeVal: '',
        visible: false,
        btLoading: false,
        height: '600px',
        btList: [
          { label: '取消', type: 'info', icon: '', event: 'cancelCouponRecordForm', show: true },
          { label: '确定', type: 'primary', icon: '', event: 'saveCouponRecordForm', saveLoading: false, show: true }
        ]
      },
      // 表单相关（显示
      recordFormInfo: {
        ref: null,
        data: {
          id: '',
          couponId: this.$route.query.couponId,
          couponNo: '',
          couponKey: '',
          qrCodeValue: '',
          qrCodeUrl: '',
          validFrom: '',
          validTo: '',
          valid: []
        },
        fieldList: [
          { label: '券号', value: 'couponNo', type: 'input', required: true, className: 'el-form-block-50' },
          { label: '券密', value: 'couponKey', type: 'input', required: true, className: 'el-form-block-50' },
          { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changeRecordDate', required: true, validator: checkRecordValidFrom, className: 'el-form-block-60' },
          { label: '二维码内容', value: 'qrCodeValue', type: 'input', className: 'el-form-block-60' },
          { label: '', value: '', type: '', className: 'el-form-block-60' },
          { label: '二维码', value: 'qrCodeUrl', type: 'slot', className: 'el-form-block-60' }
        ],
        labelWidth: '120px'
      },
      dialogUpload: {
        title: {
          uploadThumbnail: '上传缩略图',
          uploadQrCode: '上传二维码'
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
    'formInfo.data.status'(val) {
      this.initButtonList(val)
    }
  },
  created() {
    this.initList()
  },
  mounted() {
    this.initDataPermits()
    this.initRules()
    // 获取详情
    this.getData()
  },
  methods: {
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'COUPON_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.approveStatusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'COUPON_RECORD_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      // 模板地址配置
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_DATA_TEMPLATE' }).then(res => {
        if (res.code === 200) {
          for (const item of res.data) {
            if (item.itemCode === 'PLAT_DATA_TEMPLATE_COUPON_IMPORT') {
              this.downloadUrl = item.itemValue // 模版下载地址
            }
          }
        }
      })
    },
    getMerchantName(val) {
      for (const item of this.listTypeInfo.merchantList) {
        if (Number(item.id) === Number(val)) {
          return item.merchantName + '/' + item.shortName
        }
      }
      return '暂未设置'
    },
    getApproveStatusName(val) {
      for (const item of this.listTypeInfo.approveStatusList) {
        if (Number(item.itemValue) === Number(val)) {
          return item.itemName
        }
      }
      return '暂未设置'
    },
    getGeneralStatusName(val) {
      for (const item of this.listTypeInfo.statusList) {
        if (Number(item.itemValue) === Number(val)) {
          return item.itemName
        }
      }
      return '暂未设置'
    },
    initButtonList(status) {
      status = Number(status)
      if (status === 1) {
        this.formInfo.fieldList = this.couponFieldListEdit
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'save', show: false },
          { type: 'button', label: '提交', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'submit', show: false }
        ]
        this.formInfo.readOnly = false
        this.showPickDialogBtnDisabled = false
        this.tableInfo.handle.btList.forEach(item => {
          item.disabled = false
        })
        this.couponRecordTableInfo.handle.btList.forEach(item => {
          item.disabled = false
        })
      } else if (status === 2) {
        this.formInfo.fieldList = this.couponFieldList
        this.filterInfo.list = [
          { type: 'button', label: '审核通过', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'approveOK', show: false },
          { type: 'button', label: '审核不通过', btType: 'danger', icon: 'el-icon-close', loading: 'ngLoading', event: 'approveNG', show: false }
        ]
        this.formInfo.readOnly = true
        this.showPickDialogBtnDisabled = true
        this.tableInfo.handle.btList.forEach(item => {
          item.disabled = true
        })
        this.couponRecordTableInfo.handle.btList.forEach(item => {
          item.disabled = true
        })
      } else if (status === 5) {
        this.formInfo.fieldList = this.couponFieldList
        this.filterInfo.list = [
          { type: 'button', label: '作废', btType: 'danger', icon: 'el-icon-close', loading: 'ngLoading', event: 'close', show: false },
          { type: 'button', label: '导出', btType: 'success', icon: 'el-icon-download', loading: 'okLoading', event: 'export', show: false }
        ]
        this.formInfo.readOnly = true
        this.showPickDialogBtnDisabled = true
        this.tableInfo.handle.btList.forEach(item => {
          item.disabled = true
        })
        this.couponRecordTableInfo.handle.btList.forEach(item => {
          item.disabled = true
        })
      } else if (status === 3 || status === 7) {
        this.formInfo.fieldList = this.couponFieldList
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'edit', show: false }
        ]
        this.formInfo.readOnly = true
        this.showPickDialogBtnDisabled = true
        this.tableInfo.handle.btList.forEach(item => {
          item.disabled = true
        })
        this.couponRecordTableInfo.handle.btList.forEach(item => {
          item.disabled = true
        })
      } else {
        this.formInfo.fieldList = []
        this.filterInfo.list = []
        this.tableInfo.handle.btList.forEach(item => {
          item.disabled = true
        })
        this.couponRecordTableInfo.handle.btList.forEach(item => {
          item.disabled = true
        })
      }
      this.initDataPermits()
    },
    initDataPermits() {
      this.$initDataPermits('couponDetail', this.filterInfo.list) // 条件区域操作权限
      this.$initDataPermits('couponDetail', this.tableInfo.handle.btList)
      // TODO添加按钮的权限
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
      this.recordFormInfo.rules = this.$initRules(this.recordFormInfo.fieldList)
    },
    getData() {
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      // 表单验证初始化
      const params = { id: this.$route.query.couponId }
      this.$handleAPI('', getApi, params).then(res => {
        if (Number(res.code) === 200) {
          this.initButtonList(res.data.status)
          this.couponId = res.data.id
          for (const key in res.data) {
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = res.data[key]
            }
          }
          this.formInfo.data.valid = [res.data.validFrom, res.data.validTo]
          if (Number(res.data.jumpH5Id) !== 0) {
            this.tableInfo.query = { id: res.data.jumpH5Id }
            this.tableInfo.refresh = Math.random()
          }
          this.couponRecordTableInfo.query = { couponId: res.data.id }
          this.couponRecordTableInfo.refresh = Math.random()
          this.initRules()
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
    pickItem(data, popType) {
      // H5
      if (data !== '' || data !== undefined) {
        this.tableInfo.query = { id: data.id }
        this.tableInfo.refresh = Math.random()
        this.formInfo.data.jumpH5Id = data.id
        // TODO 调用save？
        this.popupDialog.visible = false
      }
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'showH5Pop': {
          if (this.formInfo.data.merchantId === '' || Number(this.formInfo.data.merchantId) === 0) {
            this.$message.error('暂未选择所属商户！')
            return false
          }
          this.popupDialog.visible = true
          break
        }
        case 'uploadThumbnail': // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        case 'uploadQrCode': // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        case 'closeUpload':
          // 图片上传弹窗点击关闭
          this.dialogUpload.visible = false
          this.dialogUpload.type = ''
          break
        case 'showObjTypeDialog': {
          this.objTypeDialog.visible = true
          break
        }
        case 'deleteH5': {
          this.$confirm('确定要删除当前关联H5吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.tableInfo.api = undefined
            this.tableInfo.data = []
            this.formInfo.data.jumpH5Id = 0
            // const props = {
            //   id: this.couponId,
            //   jumpH5Id: 0
            // }
            // this.$handleAPI('', updateApi, props).then(res => {
            //   if (Number(res.code) === 200) {
            //     this.getData()
            //     this.$message({
            //       showClose: true,
            //       message: '删除成功',
            //       type: 'success',
            //       duration: 3500
            //     })
            //   } else {
            //     this.$message({
            //       showClose: true,
            //       message: res.message,
            //       type: 'error',
            //       duration: 3500
            //     })
            //   }
            // }).catch((error) => {
            //   this.$message({
            //     showClose: true,
            //     message: error,
            //     type: 'error',
            //     duration: 3500
            //   })
            // })
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
          break
        }
        case 'edit': {
          this.formInfo.data.status = 1
          this.formInfo.data.staffId = this.staffId
          const props = this.formInfo.data
          this.$handleAPI('', updateApi, props).then(res => {
            if (Number(res.code) === 200) {
              this.getData()
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
        case 'save': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const props = this.formInfo.data
              if (props.validFrom === props.validTo) {
                this.$message.error('有效期不可设置为同一时间点')
                return
              }
              // validto < 当前时间提醒
              const now = new Date()
              const validTo = new Date(props.validTo)
              if (now >= validTo) {
                this.$message.error('有效期截止时间晚于当天！')
                return
              }
              props.staffId = this.staffId
              this.$handleAPI('', updateApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.getData()
                  this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success',
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
        case 'submit': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const props = this.formInfo.data
              if (props.validFrom === props.validTo) {
                this.$message.error('有效期不可设置为同一时间点')
                return false
              }
              // validto < 当前时间提醒
              const now = new Date()
              const validTo = new Date(props.validTo)
              if (now >= validTo) {
                this.$message.error('有效期截止时间晚于当天！')
                return
              }
              if (!props.jumpH5Id) {
                this.$message.error('请选择关联H5')
                return false
              }
              if (this.couponRecordTableInfo.data.length === 0) {
                this.$message.error('请至少添加一个票券')
                return false
              }
              // 判断子票券列表的有效期
              let validFlag = true
              this.couponRecordTableInfo.data.forEach(item => {
                if (item.validFrom !== this.formInfo.data.validFrom || item.validTo !== this.formInfo.data.validTo) {
                  validFlag = false
                }
              })
              if (!validFlag) {
                this.$message.error('券库列表的有效期需与主券保持一致！')
                return false
              }
              props.staffId = this.staffId
              props.status = 2
              this.$handleAPI('', updateApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.getData()
                  this.$message({
                    showClose: true,
                    message: '提交成功',
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
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const props = this.formInfo.data
              if (props.validFrom === props.validTo) {
                this.$message.error('有效期不可设置为同一时间点')
                return false
              }
              props.staffId = this.staffId
              props.status = 5
              this.$handleAPI('', updateApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.getData()
                  this.$message({
                    showClose: true,
                    message: '提交成功',
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
          this.$confirm('确定审核不通过吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.formInfo.ref.validate(valid => {
              if (valid) {
                this.formInfo.data.staffId = this.staffId
                this.formInfo.data.status = 3
                const props = this.formInfo.data
                this.$handleAPI('', updateApi, props).then(res => {
                  if (Number(res.code) === 200) {
                    this.getData()
                    this.$message({
                      showClose: true,
                      message: '审批不通过成功',
                      type: 'success',
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
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
          break
        }
        case 'close': {
          this.$confirm('确定作废吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.formInfo.ref.validate(valid => {
              if (valid) {
                this.formInfo.data.staffId = this.staffId
                this.formInfo.data.status = 7
                const props = this.formInfo.data
                this.$handleAPI('', updateApi, props).then(res => {
                  if (Number(res.code) === 200) {
                    this.getData()
                    this.$message({
                      showClose: true,
                      message: '作废成功',
                      type: 'success',
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
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
          break
        }
        case 'delete': {
          this.$confirm('确定要删除该奖励吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.tableInfo.api = undefined
            this.tableInfo.data = []
            this.objectId = 0
            this.objectName = ''
            const props = {
              id: this.poolId,
              objectId: 0,
              staffId: this.staffId
            }
            this.$handleAPI('', updateApi, props).then(res => {
              if (Number(res.code) === 200) {
                this.getData()
                // this.formInfo.fieldList = this.poolFieldList
                this.$message({
                  showClose: true,
                  message: '删除成功',
                  type: 'success',
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
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
          break
        }
        case 'addCouponRecord': {
          // 弹出输入框
          this.formDialog.visible = true
          this.formDialog.title = '添加卡券'
          // 默认设置主表时间
          this.recordFormInfo.data.validFrom = this.formInfo.data.validFrom
          this.recordFormInfo.data.validTo = this.formInfo.data.validTo
          this.recordFormInfo.data.valid = [this.formInfo.data.validFrom, this.formInfo.data.validTo]
          break
        }
        case 'editCouponRecord': {
          this.formDialog.visible = true
          this.formDialog.title = '编辑卡券'
          // this.recordFormInfo.ref.resetFields()
          for (const key in data) {
            if (key in this.recordFormInfo.data) {
              this.recordFormInfo.data[key] = data[key]
            }
          }
          this.recordFormInfo.data.valid = [data.validFrom, data.validTo]
          break
        }
        case 'saveCouponRecordForm': {
          if (Date.parse(this.recordFormInfo.data.validFrom) < Date.parse(this.formInfo.data.validFrom) || Date.parse(this.recordFormInfo.data.validTo) > Date.parse(this.formInfo.data.validTo)) {
            this.$message.error('有效时间设置不合理')
            return false
          }
          this.recordFormInfo.ref.validate(valid => {
            if (valid) {
              this.recordFormInfo.data.createBy = this.staffId
              this.recordFormInfo.data.updateBy = this.staffId
              this.recordFormInfo.data.couponId = this.couponId
              const props = this.recordFormInfo.data
              if (this.recordFormInfo.data.id !== '' && this.recordFormInfo.data.id !== undefined) {
                // update
                this.$handleAPI('', updateCouponRecordApi, props).then(res => {
                  if (Number(res.code) === 200) {
                    this.objTypeDialog.visible = false
                    this.popupDialog.visible = false
                    this.formDialog.visible = false
                    this.couponRecordTableInfo.refresh = Math.random()
                    this.$message.success('编辑券号成功')
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
                // create
                props.status = 1
                this.$handleAPI('', createCouponRecordApi, props).then(res => {
                  if (Number(res.code) === 200) {
                    this.objTypeDialog.visible = false
                    this.popupDialog.visible = false
                    this.formDialog.visible = false
                    this.couponRecordTableInfo.refresh = Math.random()
                    this.$message.success('新增券号成功')
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
            }
          })
          break
        }
        case 'cancelCouponRecordForm': {
          this.popupDialog.visible = false
          this.formDialog.visible = false
          break
        }
        case 'deleteCouponRecord': {
          this.$confirm('确定要删除该票券吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const props = { id: data.id, deleteFlag: 1, updateBy: this.staffId }
            this.$handleAPI('', updateCouponRecordApi, props).then(res => {
              if (Number(res.code) === 200) {
                this.recordFormInfo.data.refresh = Math.random()
                this.$message({
                  showClose: true,
                  message: '删除票券成功',
                  type: 'success',
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
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
          break
        }
        case 'import': // 导入
          this.$refs['excel-upload-input'].click()
          break
        case 'download': // 导出
          console.log(this.downloadUrl)
          window.open(this.downloadUrl, '_blank')
          break
        case 'export': {
          // 导出
          this.$handleAPI('', getRptListApi, { couponId: this.$route.query.couponId }).then(res => {
            if (Number(res.code) === 200) {
              this.handleDownload(res.data)
              // this.filterInfo.query.export = 0
            } else {
              this.$message.error(res.message)
            }
          }).catch(error => {
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        }
      }
    },
    handleDownload(list) {
      this.downloadLoading = true
      import('@/vendor/Export2ExcelImage').then(excel => {
        const column = [
          { title: '票券ID', key: 'id', type: 'text' },
          { title: '票券名称', key: 'couponName', type: 'text' },
          { title: '票券说明', key: 'description', type: 'text' },
          { title: '所属商户', key: 'merchantName', type: 'text' },
          { title: '券号', key: 'couponNo', type: 'text' },
          { title: '券密', key: 'couponKey', type: 'text' },
          { title: '状态', key: 'statusName', type: 'text' },
          { title: '二维码', key: 'qrCodeUrl', type: 'image', width: 100, height: 100 },
          { title: '有效时间', key: 'releaseDate', type: 'text' },
          { title: '领取人ID', key: 'linkUserId', type: 'text' },
          { title: '领取人手机', key: 'linkPhone', type: 'text' },
          { title: '领取时间', key: 'linkTime', type: 'text' },
          { title: '订单号', key: 'transNo', type: 'text' },
          { title: '购买时间', key: 'transTime', type: 'text' },
          { title: '实付', key: 'payAmount', type: 'text' },
          { title: '付款方式', key: 'payTypeName', type: 'text' }
        ]
        for (var index in list) {
          if (list[index]['qrCodeUrl']) {
            list[index]['qrCodeUrl'] = this.$TH.FILE_URLS.static_url + list[index]['qrCodeUrl']
            column[7] = { title: '二维码', key: 'qrCodeUrl', type: 'image', width: 100, height: 100 }
          } else {
            column[7] = { title: '二维码', key: 'qrCodeUrl', type: 'text' }
          }
        }
        excel.export_table_to_excel_image(column, list, '票券一览')
      })
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'changedate': // 有效期修改
          if (this.formInfo.data.valid !== null) {
            this.formInfo.data.validFrom = this.$fn.switchTime(this.formInfo.data.valid[0])
            this.formInfo.data.validTo = this.$fn.switchTime(this.formInfo.data.valid[1])
          } else {
            this.formInfo.data.validFrom = ''
            this.formInfo.data.validTo = ''
          }
          break
        case 'changeRecordDate': // 有效期修改
          if (this.recordFormInfo.data.valid !== null) {
            this.recordFormInfo.data.validFrom = this.$fn.switchTime(this.recordFormInfo.data.valid[0])
            this.recordFormInfo.data.validTo = this.$fn.switchTime(this.recordFormInfo.data.valid[1])
          } else {
            this.recordFormInfo.data.validFrom = ''
            this.recordFormInfo.data.validTo = ''
          }
          break
        case 'upload': {
          if (data.code !== 200) return
          if (this.dialogUpload.type === 'uploadThumbnail') {
            this.formInfo.data.thumbnailUrl = data.fileList[0].relativeUrl
          }
          if (this.dialogUpload.type === 'uploadQrCode') {
            this.recordFormInfo.data.qrCodeUrl = data.fileList[0].relativeUrl
          }
          // 关闭弹窗
          this.handleClick('closeUpload')
          break
        }
      }
    },
    // 格式化yyyy/MM/dd
    formatDate(date) {
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : '' + month
      var day = date.getDate()
      day = day < 10 ? '0' + day : '' + day
      var hours = date.getHours()
      hours = hours > 0 && hours < 10 ? '0' + hours : '' + hours
      var minutes = date.getMinutes()
      minutes = minutes > 0 && minutes < 10 ? '0' + minutes : '' + minutes
      var seconds = date.getSeconds()
      seconds = seconds > 0 && seconds < 10 ? '0' + seconds : '' + seconds
      return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    uploadRuleExcel(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.$refs['excel-upload-input'].value = null
      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      const pageThis = this
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array', cellDates: true })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const results = XLSX.utils.sheet_to_json(worksheet)
          resolve()
          // 组装数据
          const dataList = []
          results.forEach(element => {
            const data = {}
            data.couponId = this.couponId
            data.status = 1
            data.couponNo = element['券号']
            data.couponKey = element['券密']
            data.qrCodeUrl = element['二维码链接']
            data.qrCodeValue = element['二维码内容']
            // 如果主券设置了有效期 直接用主券的有效期
            if (pageThis.formInfo.data.validFrom !== '' && pageThis.formInfo.data.validTo !== '') {
              data.validFrom = pageThis.formInfo.data.validFrom
              data.validTo = pageThis.formInfo.data.validTo
            } else {
              if (typeof (element['有效期开始']) === 'object') {
                data.validFrom = this.formatDate(element['有效期开始'])
              } else if (typeof (element['有效期开始']) === 'string') {
                data.validFrom = element['有效期开始']
              }
              if (typeof (element['有效期截止']) === 'object') {
                data.validTo = this.formatDate(element['有效期截止'])
              } else if (typeof (element['有效期截止']) === 'string') {
                data.validTo = element['有效期截止']
              }
            }
            dataList.push(data)
          })
          if (dataList.length === 0) {
            this.$message.error('暂未读取到任何数据')
            return false
          }
          this.$confirm('确定要导入' + dataList.length + '条数据吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            this.$handleAPI('', importCouponRecordApi, { staffId: this.staffId, couponRecordList: dataList }).then(res => {
              if (Number(res.code) === 200) {
                this.couponRecordTableInfo.refresh = Math.random()
                loading.close()
                this.$message.success('导入券号成功')
              } else {
                loading.close()
                this.$message.error('导入券号失败')
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
              message: '已取消操作'
            })
          })
        }
        reader.readAsArrayBuffer(rawFile)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .coupon-detail-container {
    padding: 0px;
    margin: 20px;
    .cardIcon {
      font-size: 40px;
    }

    .slot-avatar{
      height: 100px;
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
    .excel-upload-input{
      display: none;
      z-index: -9999;
    }
  }
</style>
<style lang="scss">
  .h5_table {
    height: 120px !important;
    .el-table {
      height: 120px !important;
    }
  }
</style>
