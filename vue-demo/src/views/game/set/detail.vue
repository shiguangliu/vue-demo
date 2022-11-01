<template>
  <div class="template-container lotteryDetail">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="特惠礼包详情" name="tab1">
        <page-filter
          :query.sync="filterInfo.query"
          :filter-list="filterInfo.list"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
        <el-card class="box-card" style="border-color: #13C0C5;">
          <div slot="header" class="clearfix">
            <span>基础信息</span>
          </div>
          <el-row>
            <el-col :span="18">
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
            </el-col>
            <el-col :span="6">
              <page-form
                :ref-obj.sync="formInfo.imageRef"
                :data="formInfo.data"
                :field-list="formInfo.imageFieldList"
                :rules="formInfo.imageRules"
                :label-width="formInfo.labelWidth"
                :label-position="'top'"
                :list-type-info="listTypeInfo"
                :read-only="formInfo.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              >
                <!-- 自定义插槽-选择图片 -->
                <template v-slot:form-imageThumbnailUrl>
                  <div class="slot-avatar el-form-image">
                    <img
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + formInfo.data.imageThumbnailUrl"
                      style="height: 60px;"
                      :onerror="nopicture"
                      :fit="'cover'"
                    >
                    <el-button
                      v-waves
                      type="primary"
                      icon="el-icon-picture"
                      size="mini"
                      @click="handleClick('uploadThumbnail')"
                    >
                      {{ formInfo.data.imageThumbnailUrl ? '更换图片' : '选择图片' }}
                    </el-button>
                  </div>
                </template>
                <template v-slot:form-imageUrl>
                  <div class="slot-avatar el-form-image">
                    <img
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + formInfo.data.imageUrl"
                      style="height: 60px;"
                      :onerror="nopicture"
                      :fit="'cover'"
                    >
                    <el-button
                      v-waves
                      type="primary"
                      icon="el-icon-picture"
                      size="mini"
                      @click="handleClick('uploadImage')"
                    >
                      {{ formInfo.data.imageUrl ? '更换图片' : '选择图片' }}
                    </el-button>
                  </div>
                </template>
              </page-form>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px;border-color: #13C0C5;">
          <div slot="header" class="clearfix">
            <span>特惠礼包商品详情</span>
            <el-button type="primary" icon="el-icon-plus" :disabled="showPickDialogBtnDisabled" style="float: right;" @click="handleClick('showObjTypeDialog')">新增奖励</el-button>
          </div>
          <page-table
            class="skutable"
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurPage"
            :data.sync="tableInfo.data"
            :api="getSkuList"
            :query="tableInfo.query"
            :field-list="tableInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="tableInfo.handle"
            :pager="tableInfo.pager"
            :listen-height="tableInfo.listenHeight"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
        </el-card>
        <!-- 选择新增奖励类型 -->
        <page-dialog
          :title="objTypeDialog.title"
          :visible.sync="objTypeDialog.visible"
          :width="objTypeDialog.width"
          :bt-loading="objTypeDialog.btLoading"
          :bt-list="objTypeDialog.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <el-row :gutter="30" class="objTypeRow">
            <el-col :span="8">
              <el-button type="default" style="width: 100%;margin-bottom: 10px;" @click="clickObjType(11)">
                <div style="padding: 10px;">
                  <i class="cardIcon el-icon-setting" />
                  <h3 class="icon-name">装备</h3>
                </div>
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="default" style="width: 100%;margin-bottom: 10px;" @click="clickObjType(12)">
                <div style="padding: 10px;">
                  <i class="cardIcon el-icon-coin" />
                  <h3 class="icon-name">金币</h3>
                </div>
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="default" style="width: 100%;margin-bottom: 10px;" @click="clickObjType(13)">
                <div style="padding: 10px;">
                  <i class="cardIcon fa fa-diamond svg-icon" />
                  <h3 class="icon-name">钻石</h3>
                </div>
              </el-button>
            </el-col>
          </el-row>
        </page-dialog>
        <!-- 选择装备-->
        <page-dialog
          :title="popupDialog.title"
          :visible.sync="popupDialog.visible"
          :width="popupDialog.width"
          :bt-loading="popupDialog.btLoading"
          :bt-list="popupDialog.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <PopGameSku v-if="popupDialog.visible && popupDialog.typeVal == 11" :custom-query="{ diff: 1 }" @pickItem="pickItem" />
          <PopGameSku v-if="popupDialog.visible && popupDialog.typeVal == 12" :custom-query="{ diff: undefined, itemType: '30', appType: formInfo.data.appType }" @pickItem="pickItem" />
          <PopGameSku v-if="popupDialog.visible && popupDialog.typeVal == 13" :custom-query="{ diff: undefined, itemType: '31', appType: formInfo.data.appType }" @pickItem="pickItem" />
        </page-dialog>
        <page-dialog
          :title="formDialog.title"
          :visible.sync="formDialog.visible"
          :width="formDialog.width"
          :bt-loading="formDialog.btLoading"
          :bt-list="formDialog.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <page-form
            v-if="itemProps.itemFlag === 3"
            :ref-obj.sync="poolFormInfo.ref"
            :data="poolFormInfo.data"
            :field-list="poolFormInfo.fieldList"
            :rules="poolFormInfo.rules"
            :label-width="poolFormInfo.labelWidth"
            :list-type-info="listTypeInfo"
            :read-only="poolFormInfo.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
          <page-form
            v-if="itemProps.itemFlag === 1 || itemProps.itemFlag === 2"
            :ref-obj.sync="itemFormInfo.ref"
            :data="itemFormInfo.data"
            :field-list="itemFormInfo.fieldList"
            :rules="itemFormInfo.rules"
            :label-width="itemFormInfo.labelWidth"
            :list-type-info="listTypeInfo"
            :read-only="itemFormInfo.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <!-- 自定义插槽显示状态 -->
            <template v-slot:form-imageThumbnailUrl>
              <div class="slot-avatar">
                <img
                  v-imgAlart
                  height="50px"
                  width="50px"
                  style="object-fit: cover;"
                  :src="$TH.FILE_URLS.static_url + itemFormInfo.data.imageThumbnailUrl"
                  :onerror="nopicture"
                >
              </div>
            </template>
          </page-form>
        </page-dialog>
        <!-- 图片上传弹窗 -->
        <page-dialog
          :title="dialogUpload.title[dialogUpload.type]"
          :visible.sync="dialogUpload.visible"
          :width="dialogUpload.width"
          :bt-loading="dialogUpload.btLoading"
          :bt-list="dialogUpload.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <Upload
            v-if="dialogUpload.type === 'uploadThumbnail' && dialogUpload.visible"
            :upload-data="{targetPath: 'gameItemThumbnail',autoname: '1'}"
            @handleEvent="handleEvent"
          />
          <Upload
            v-if="dialogUpload.type === 'uploadImage' && dialogUpload.visible"
            :upload-data="{targetPath: 'gameItemImage',autoname: '1'}"
            @handleEvent="handleEvent"
          />
        </page-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi } from '@/api/common'
import { getApi, updateApi, deleteApi, getSkuList, updateSetDetail, deleteSetDetail } from '@/api/game/set'
import PageFilter from '@/components/PageFilter'
import PageDialog from '@/components/PageDialog'
import PageTable from '@/components/PageTable'
import PageForm from '@/components/PageForm'
import PopGameSku from '@/components/Popup/PopGameSku'
import defaultImage from '@/assets/img/no-pic.jpg'
import Upload from '@/components/Upload'

export default {
  components: {
    PageFilter,
    PageDialog,
    PageForm,
    PageTable,
    PopGameSku,
    Upload
  },
  data() {
    const checkIosSkuNo = (rule, value, callback) => {
      if (this.formInfo.data.appType === '1') {
        const check = this.$validate({ label: 'AppStore编号', value, rules: ['notnull', 'length'], conditions: [1, 200] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const checkName = (rule, value, callback) => {
      const check = this.$validate({ label: '新手礼包名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkPrice = (rule, value, callback) => {
      const check = this.$validate({ label: '优惠礼包价格', value, rules: ['notnull', 'number', 'length'], conditions: [0, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkSetValue = (rule, value, callback) => {
      const check = this.$validate({ label: '优惠礼包价值', value, rules: ['notnull', 'number', 'length'], conditions: [0, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkUnitName = (rule, value, callback) => {
      const check = this.$validate({ label: '计量单位名称', value, rules: ['notnull', 'length'], conditions: [1, 20] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkValidFrom = (rule, value, callback) => {
      const check = this.$validate({ label: '有效时间', value: this.formInfo.data.releaseFrom, rules: ['notnull'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        var currentTime = new Date()
        var validToTime = new Date(this.formInfo.data.releaseTo)
        if (validToTime < currentTime) {
          callback(new Error('有效截止时间必须大于今天'))
        } else {
          callback()
        }
      }
    }
    const checkRealInt = (rule, value, callback) => {
      const check = this.$validate({ label: '数量', value, rules: ['realint', 'notnull', 'length'], conditions: [1, 1000] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkSort = (rule, value, callback) => {
      const check = this.$validate({ label: '排序', value, rules: ['int', 'notnull', 'length'], conditions: [1, 1000] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      id: this.$route.query.id || '',
      setData: [],
      objTypeDialog: {
        title: '选择商品类型',
        visible: false,
        btLoading: false,
        width: '500px',
        height: '300px'
      },
      itemProps: {},
      tempData: {},
      activeName: 'tab1',
      getApi,
      getSkuList,
      objectType: '',
      objectId: 0,
      objectName: '',
      showPickDialogBtnDisabled: false,
      tableApiName: undefined,
      btnChangeEnable: '',
      // 相关列表
      listTypeInfo: {
        gameItemPriceList: [],
        appTypeList: [],
        platAppStoreSkuSet: []
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
        imageRef: null,
        readOnly: false,
        data: {
          id: this.$route.query.id || '',
          setName: '',
          appType: '',
          iosSkuNo: '',
          priceType: '',
          price: '',
          setValue: '',
          unitName: '',
          setDescription: '',
          sort: '',
          releaseFrom: '',
          releaseTo: '',
          statusName: '',
          imageThumbnailUrl: '',
          imageUrl: '',
          valid: []
        },
        fieldList: [
          { label: '特惠礼包ID', value: 'id', type: 'tag', className: 'el-form-block-40' },
          { label: '适用平台', value: 'appType', type: 'customselect', list: 'appTypeList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-inline-block-40', event: 'changeAppType' },
          { label: 'AppStore编号', value: 'iosSkuNo', type: 'customselect', list: 'platAppStoreSkuSet', key: 'itemValue', name: 'itemName', validator: checkIosSkuNo, className: 'el-form-block-80' },
          { label: '特惠礼包名称', value: 'setName', type: 'input', required: true, validator: checkName, className: 'el-form-block-40' },
          { label: '货币类型', value: 'priceType', type: 'customselect', list: 'gameItemPriceList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-inline-block-40' },
          { label: '特惠礼包价格', value: 'price', type: 'input', required: true, validator: checkPrice, className: 'el-form-inline-block-40' },
          { label: '特惠礼包价值', value: 'setValue', type: 'input', required: true, validator: checkSetValue, className: 'el-form-inline-block-40' },
          { label: '价值单位', value: 'unitName', type: 'input', required: true, validator: checkUnitName, className: 'el-form-inline-block-40' },
          { label: '特惠礼包说明', value: 'setDescription', type: 'textarea', className: 'el-form-block', autosize: { minRows: 3, maxRows: 3 }, maxlength: 500, showLimit: true, required: true },
          { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changedate', required: true, validator: checkValidFrom, className: 'el-form-block' },
          { label: '排序', value: 'sort', type: 'input', required: true, className: 'el-form-block-40', validator: checkSort },
          { label: '状态', value: 'statusName', type: 'tag', className: 'el-form-block-30' }
        ],
        imageFieldList: [
          { label: '礼包大图', value: 'imageThumbnailUrl', type: 'slot', required: true, className: 'el-form-block-100' },
          { label: '礼包商品封面缩略图', value: 'imageUrl', type: 'slot', required: true, className: 'el-form-block-100' }
        ],
        rules: {},
        imageRules: {},
        labelWidth: '120px'
      },
      tableInfo: {
        refresh: 1,
        initCurPage: 1,
        pager: false, // 不分页（单个层级数据量不大）
        tableIndex: false,
        listenHeight: false,
        data: [],
        fieldList: [
          { label: '商品ID', value: 'objectId' },
          { label: '商品名称', value: 'objectName' },
          { label: '商品类型', value: 'itemFlagName' },
          { label: '装备类型', value: 'itemTypeName' },
          { label: '图片', value: 'imageThumbnailUrl', type: 'image' },
          { label: '稀有度', value: 'rareType' },
          { label: '数量', value: 'objectQuantity' },
          { label: '状态', value: 'statusName' }
        ],
        query: { id: this.$route.query.id },
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: [
            { label: '编辑', tooltip: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'editSku', show: true },
            { label: '删除', tooltip: '删除', type: 'danger', icon: 'el-icon-delete', event: 'deleteSku', show: true }
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
          { label: '取消', type: 'info', icon: '', event: 'cancelSkuForm', show: true },
          { label: '确定', type: 'primary', icon: '', event: 'saveSkuForm', saveLoading: false, show: true }
        ]
      },
      // 表单相关（显示）
      poolFormInfo: {
        ref: null,
        data: {
          hitQty: '',
          weight: '',
          quantity: '',
          objectQuantity: '',
          sort: ''
        },
        fieldList: [
          { label: '商品ID', value: 'objectId', type: 'tag', className: 'el-form-block' },
          { label: '商品名称', value: 'objectName', type: 'tag', className: 'el-form-block' },
          { label: '数量', value: 'objectQuantity', type: 'input', validator: checkRealInt, required: true, className: 'el-form-block' }
        ],
        labelWidth: '150px'
      },
      itemFormInfo: {
        ref: null,
        data: {
          imageUrl: '',
          hitQty: '',
          weight: '',
          quantity: '',
          sort: '',
          imageThumbnailUrl: '',
          itemTypeName: '',
          rareType: ''
        },
        fieldList: [
          { label: '图片', value: 'imageThumbnailUrl', type: 'slot', className: 'el-form-block' },
          { label: '商品ID', value: 'objectId', type: 'tag', className: 'el-form-block' },
          { label: '商品名称', value: 'objectName', type: 'tag', className: 'el-form-block' },
          { label: '装备类型', value: 'itemTypeName', type: 'tag', className: 'el-form-block' },
          { label: '稀有度', value: 'rareType', type: 'tag', className: 'el-form-block' },
          { label: '数量', value: 'objectQuantity', type: 'input', validator: checkRealInt, required: true }
        ],
        labelWidth: '120px'
      },
      // 图片上传弹窗相关
      dialogUpload: {
        title: {
          uploadThumbnail: '礼包缩略图片URL',
          uploadImage: '礼包商品封面缩略图'
        },
        num: 1,
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
    },
    'poolFormInfo.data.quantity'() {
      this.handleEvent('changeQuantity')
    }
  },
  created() {
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
  },
  methods: {
    initList() {
      const that = this
      const reqArr = [
        getConfigItemsListApi({ 'configType': 'APP_TYPE' }),
        getConfigItemsListApi({ 'configType': 'GAME_ITEM_PRICE_TYPE' }),
        getConfigItemsListApi({ 'configType': 'PLAT_APP_STORE_SKU_SET' })
      ]
      Promise.all(reqArr).then(res => {
        let codeSum = 0
        for (const item of res) {
          codeSum += Number(item.code)
        }
        if (codeSum % 200 !== 0) {
          this.$message.success('获取失败')
        }
        that.listTypeInfo.appTypeList = res[0].data
        that.listTypeInfo.gameItemPriceList = res[1].data
        that.listTypeInfo.platAppStoreSkuSet = res[2].data
      }).catch(error => {
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          duration: 3500
        })
      })
      // 获取详情
      this.getData()
    },
    initButtonList(status) {
      status = Number(status)
      this.formInfo.readOnly = true
      if (status === 1) { // 1：编辑中
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-plus', event: 'save', show: false, float: 'left' },
          { type: 'button', label: '提交', btType: 'primary', icon: 'el-icon-check', event: 'submit', show: false, float: 'left' },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', event: 'delete', show: false, float: 'right' }
        ]
        this.tableInfo.handle.btList.forEach(item => {
          item.disabled = false
        })
        this.showPickDialogBtnDisabled = false
      } else if (status === 2) { // 2：审批中
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', event: 'edit', show: false, float: 'right' },
          { type: 'button', label: '审批通过', btType: 'primary', icon: 'el-icon-check', event: 'approveOK', show: false, float: 'left' },
          { type: 'button', label: '审批拒绝', btType: 'danger', icon: 'el-icon-close', event: 'approveNG', show: false, float: 'left' }
        ]
        this.tableInfo.handle.btList.forEach(item => {
          item.disabled = true
        })
        this.showPickDialogBtnDisabled = true
      } else if (status === 3) { // 3：审批NG
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', event: 'edit', show: false, float: 'left' },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', event: 'delete', show: false, float: 'right' }
        ]
        this.tableInfo.handle.btList.forEach(item => {
          item.disabled = true
        })
        this.showPickDialogBtnDisabled = true
      } else if (status === 5) { // 5：已上架
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', event: 'edit', show: false, float: 'right' },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', event: 'delete', show: false, float: 'right' }
        ]
        this.tableInfo.handle.btList.forEach(item => {
          item.disabled = true
        })
        this.showPickDialogBtnDisabled = true
      } else {
        this.filterInfo.list = []
        this.tableInfo.handle.btList.forEach(item => {
          item.disabled = true
        })
        this.showPickDialogBtnDisabled = true
      }
      this.initDataPermits()
    },
    initDataPermits() {
      this.$initDataPermits('gameSetDetail', this.filterInfo.list) // 条件区域操作权限
      this.$initDataPermits('gameSetDetail', this.tableInfo.handle.btList)
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
      this.itemFormInfo.rules = this.$initRules(this.itemFormInfo.fieldList)
      this.poolFormInfo.rules = this.$initRules(this.poolFormInfo.fieldList)
      this.formInfo.imageRules = this.$initRules(this.formInfo.imageFieldList)
    },
    getData() {
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      // 表单验证初始化
      const params = { id: this.$route.query.id }
      this.$handleAPI('', getApi, params).then(res => {
        if (Number(res.code) === 200) {
          this.initButtonList(res.data.status)
          this.setData = res.data
          for (const key in res.data) {
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = res.data[key]
            }
          }
          this.formInfo.data.appType = this.formInfo.data.appType === 0 ? '' : this.formInfo.data.appType + ''
          this.formInfo.data.priceType = this.formInfo.data.priceType === 0 ? '' : this.formInfo.data.priceType + ''
          this.formInfo.data.valid = [res.data.releaseFrom, res.data.releaseTo]
          this.tableInfo.query = { id: this.id }
          this.tableInfo.refresh = Math.random()
          this.initRules()
          this.handleEvent('changeAppType', '')
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
    clickObjType(e) {
      const props = {
        staffId: this.staffId,
        id: this.id,
        objectType: Number(e.itemValue)
      }
      // 弹出选择具体条目
      if (e === 11) {
        this.popupDialog.title = '选择装备'
        this.popupDialog.typeVal = e
      }
      if (e === 12) {
        this.popupDialog.title = '选择金币'
        this.popupDialog.typeVal = e
      }
      if (e === 13) {
        this.popupDialog.title = '选择钻石'
        this.popupDialog.typeVal = e
      }
      this.popupDialog.visible = true
      this.itemProps = props
      // 创建 11-装备 12-金币 13-钻石
    },
    pickItem(data, popType) {
      // 添加装备
      if (data !== '' || data !== undefined) {
        const objectName = data.itemName
        // if (this.itemProps.itemFlag === 3) {
        //   objectName = objectName + ' * ' + data.quantity
        // }
        const props = Object.assign(this.itemProps, { objectId: data.id, objectName: objectName, imageThumbnailUrl: data.imageThumbnailUrl,
          itemFlag: data.itemFlag, itemFlagName: data.itemFlagStr, itemId: data.itemId, itemType: data.itemType, itemTypeName: data.itemTypeStr,
          rareType: data.rareType, skuNo: data.skuNo, quantity: data.quantity })
        this.formDialog.title = '添加' + data.itemName
        if (this.itemProps.itemFlag === 1 || this.itemProps.itemFlag === 2) {
          // 默认数量为1
          this.itemFormInfo.data = JSON.parse(JSON.stringify(props))
          this.itemFormInfo.data.objectQuantity = 1
        } else if (this.itemProps.itemFlag === 3) {
          // 默认数量为1
          this.poolFormInfo.data = JSON.parse(JSON.stringify(props))
        }
        this.formDialog.visible = true
        this.popupDialog.visible = false
      }
    },
    // 按钮点击
    handleClick(event, data) {
      const dialogUpload = this.dialogUpload
      const self = this
      switch (event) {
        case 'showObjTypeDialog':
          this.objTypeDialog.visible = true
          break
        case 'uploadThumbnail': // 上传图片 缩略图片URL
          dialogUpload.visible = true
          dialogUpload.type = event
          dialogUpload.num = data
          break
        case 'uploadImage': // 上传图片 大图URL
          dialogUpload.visible = true
          dialogUpload.type = event
          dialogUpload.num = data
          break
        case 'closeUpload': // 图片上传弹窗点击关闭
          dialogUpload.visible = false
          dialogUpload.type = ''
          break
        case 'edit' : { // 编辑
          this.$confirm('确定要编辑吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'id': self.id,
              'status': 1,
              'updateTime': self.setData.updateTime,
              'updateBy': self.staffId
            }
            this.$handleAPI('', updateApi, params).then(res => {
              if (res.code === 200) {
                this.$message.success('编辑成功')
                this.getData()
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error',
                  duration: 3500
                })
              }
            })
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消编辑'
            })
          })
          break
        }
        case 'submit' : // 提交
        case 'save': { // 保存
          var flag = true
          this.formInfo.imageRef.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          this.formInfo.ref.validate(valid => {
            if (valid && flag) {
              var confirmStr = '保存'
              if (event === 'submit') {
                confirmStr = '启用'
              }
              this.$confirm('确定要' + confirmStr + '吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                if (valid || this.itemDate.status === 3) {
                  const params = this.formInfo.data
                  if (event === 'submit') {
                    params.status = 2
                  }
                  if (this.formInfo.data.appType !== '1') {
                    params.iosSkuNo = ''
                  }
                  params.id = this.id
                  params.updateBy = this.staffId
                  params.updateTime = this.setData.updateTime
                  this.$handleAPI('', updateApi, params).then(res => {
                    if (res.code === 200) {
                      this.$message.success(confirmStr + '成功')
                      this.getData()
                    } else {
                      this.$message({
                        showClose: true,
                        message: res.message,
                        type: 'error',
                        duration: 3500
                      })
                    }
                  })
                }
              }).catch((e) => {
                this.$message({
                  type: 'info',
                  message: '已取消' + confirmStr
                })
              })
            }
          })
          break
        }
        case 'approveOK': { // 审批通过
          this.$confirm('确定要审批通过吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'id': self.id,
              'status': 5,
              'updateTime': self.setData.updateTime,
              'updateBy': self.staffId
            }
            this.$handleAPI('', updateApi, params).then(res => {
              if (res.code === 200) {
                this.$message.success('审批成功')
                this.getData()
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error',
                  duration: 3500
                })
              }
            })
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消审批'
            })
          })
          break
        }
        case 'approveNG' : { // 审批拒绝
          this.$confirm('确定要审批拒绝吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'id': self.id,
              'status': 3,
              'updateTime': self.setData.updateTime,
              'updateBy': self.staffId
            }
            this.$handleAPI('', updateApi, params).then(res => {
              if (res.code === 200) {
                this.$message.success('审批成功')
                this.getData()
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error',
                  duration: 3500
                })
              }
            })
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消审批'
            })
          })
          break
        }
        case 'delete': { // 删除
          const self = this
          this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'id': self.id,
              'updateTime': self.setData.updateTime,
              'updateBy': self.staffId
            }
            this.$handleAPI('', deleteApi, params).then(res => {
              if (res.code === 200) {
                this.$message.success('删除成功')
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
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          break
        }
        case 'saveSkuForm': {
          let allFormValid = true
          if (this.itemProps.itemFlag === 1 || this.itemProps.itemFlag === 2) {
            this.itemFormInfo.ref.validate(valid => {
              allFormValid = valid
            })
          } else if (this.itemProps.itemFlag === 3) {
            this.poolFormInfo.ref.validate(valid => {
              allFormValid = valid
            })
          }
          if (allFormValid === true) {
            const propsInfo = this.itemProps.itemFlag === 3 ? this.poolFormInfo.data : this.itemFormInfo.data
            const props = { id: this.id, seqId: propsInfo.seqId, skuId: propsInfo.objectId, quantity: 1, updateTime: propsInfo.updateTime, updateBy: this.staffId, itemQuantity: propsInfo.objectQuantity }
            this.$handleAPI('', updateSetDetail, props).then(res => {
              if (Number(res.code) === 200) {
                this.objTypeDialog.visible = false
                this.popupDialog.visible = false
                this.formDialog.visible = false
                this.tableInfo.refresh = Math.random()
                this.$message.success('编辑特惠礼包商品成功')
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
          break
        }
        case 'cancelSkuForm': {
          this.popupDialog.visible = false
          this.formDialog.visible = false
          break
        }
        case 'editSku': {
          this.tempData = data
          this.itemProps.itemFlag = this.tempData.itemFlag
          this.formDialog.title = '编辑 - ' + data.itemTypeName
          if (this.tempData.itemFlag === 1 || this.tempData.itemFlag === 2) {
            this.itemFormInfo.data = JSON.parse(JSON.stringify(this.tempData))
          } else if (this.tempData.itemFlag === 3) {
            this.poolFormInfo.data = JSON.parse(JSON.stringify(this.tempData))
          }
          this.formDialog.visible = true
          break
        }
        case 'deleteSku': {
          this.$confirm('确定要删除该商品吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const props = { id: data.id, seqId: data.seqId, staffId: this.staffId }
            this.$handleAPI('', deleteSetDetail, props).then(res => {
              if (Number(res.code) === 200) {
                this.tableInfo.refresh = Math.random()
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
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'upload': { // 上传成功，绑定图片链接到id
          if (data.code !== 200) return
          if (this.dialogUpload.type === 'uploadThumbnail') {
            this.formInfo.data.imageThumbnailUrl = data.fileList[0].relativeUrl
          } else if (this.dialogUpload.type === 'uploadImage') {
            this.formInfo.data.imageUrl = data.fileList[0].relativeUrl
          }
          // 关闭弹窗
          this.handleClick('closeUpload')
          break
        }
        case 'changeAppType': // 修改道具类型
          this.formInfo.fieldList.forEach(element => {
            if (element.value === 'iosSkuNo') {
              if (this.formInfo.data.appType === '1') {
                element.type = 'customselect'
              } else {
                element.type = 'hidden'
              }
            }
          })
          break
        case 'changeQuantity': // 修改数量
          // if (this.poolFormInfo.data.quantity != null) {
          //   this.poolFormInfo.data.sumQuantity = this.poolFormInfo.data.objectQuantity * this.poolFormInfo.data.quantity
          // }
          break
        case 'changedate': // 有效期修改
          if (this.formInfo.data.valid !== null) {
            this.formInfo.data.releaseFrom = this.$fn.switchTime(this.formInfo.data.valid[0])
            this.formInfo.data.releaseTo = this.$fn.switchTime(this.formInfo.data.valid[1])
          } else {
            this.formInfo.data.releaseFrom = ''
            this.formInfo.data.releaseTo = ''
          }
          break
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            item.sumQuantity = item.quantity
          })
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .cardIcon {
    font-size: 40px;
  }
  .template-container {
    padding: 0px;
    margin: 20px;
  }
  .image {
    width: 100%;
    display: block;
  }
  .slot-avatar{
    height: 40px;
    display: flex;
    align-items: center;
    img {
      padding-right: 10px;
    }
  }
</style>
