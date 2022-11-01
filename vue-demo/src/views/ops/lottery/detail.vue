<template>
  <div class="template-container lotteryDetail">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="转盘详情" name="tab1">
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
              <el-tag class="el-form-block-60" size="medium">{{ formInfo.data.validFrom + ' ~ ' + formInfo.data.validTo }}</el-tag>
            </template>
          </page-form>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px;border-color: #13C0C5;">
          <div slot="header" class="clearfix">
            <span>奖励列表</span>
            <el-button type="primary" icon="el-icon-plus" :disabled="showPickDialogBtnDisabled" style="float: right;" @click="handleClick('showObjTypeDialog')">新增奖励</el-button>
          </div>
          <page-table
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurPage"
            :data.sync="tableInfo.data"
            :api="getPoolListApi"
            :query="tableInfo.query"
            :field-list="tableInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="tableInfo.handle"
            :pager="tableInfo.pager"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <template v-slot:col-validDate="scope">
              <p>{{ scope.row.validFrom + '-' + scope.row.validTo }}</p>
            </template>
            <template v-slot:col-objectType="scope">
              <p>{{ getObjectTypeName(scope.row.objectType) }}</p>
            </template>
          </page-table>
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
            <el-col v-for="(item, index) in objectTypeList" :key="index" :span="8">
              <el-button v-if="item.itemValue == 11 || item.itemValue == 12 || item.itemValue == 13" type="default" style="width: 100%;margin-bottom: 10px;" @click="clickObjType(item)">
                <div style="padding: 10px;">
                  <i v-if="item.itemValue == 11" class="cardIcon el-icon-setting" />
                  <i v-if="item.itemValue == 12" class="cardIcon el-icon-coin" />
                  <i v-if="item.itemValue == 13" class="cardIcon fa fa-diamond svg-icon" />
                  <h3 class="icon-name">{{ item.itemName }}</h3>
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
          <PopGameItem v-if="popupDialog.visible && popupDialog.typeVal == 11" :custom-query="{ diff: 1 }" @pickItem="pickItem" />
          <PopGameItem v-if="popupDialog.visible && popupDialog.typeVal == 12" :custom-query="{ diff: undefined, itemType: '30' }" @pickItem="pickItem" />
          <PopGameItem v-if="popupDialog.visible && popupDialog.typeVal == 13" :custom-query="{ diff: undefined, itemType: '31' }" @pickItem="pickItem" />
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
            v-if="itemProps.objectType === 12 || itemProps.objectType === 13"
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
            v-if="itemProps.objectType === 11"
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
            <template v-slot:form-imageUrl>
              <div class="slot-avatar">
                <img
                  v-imgAlart
                  height="50px"
                  width="50px"
                  style="object-fit: cover;"
                  :src="$TH.FILE_URLS.static_url + itemFormInfo.data.imageUrl"
                  :onerror="nopicture"
                >
              </div>
            </template>
          </page-form>
        </page-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi, getMerchantListApi } from '@/api/common'
import { getApi, getPoolListApi, updateApi, getGameItemApi, createPoolApi, updatePoolApi } from '@/api/fzgamelottery'
import PageFilter from '@/components/PageFilter'
import PageDialog from '@/components/PageDialog'
import PageTable from '@/components/PageTable'
import PageForm from '@/components/PageForm'
import PopGameItem from '@/components/Popup/PopGameItem'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageFilter,
    PageDialog,
    PageForm,
    PageTable,
    PopGameItem
  },
  data() {
    const checkName = (rule, value, callback) => {
      const check = this.$validate({ label: '转盘名称', value, rules: ['notnull', 'length'], conditions: [1, 60] })
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
    const checkRealInt = (rule, value, callback) => {
      const check = this.$validate({ label: '数量', value, rules: ['realint', 'notnull', 'length'], conditions: [1, 1000] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkHitQty = (rule, value, callback) => {
      const check = this.$validate({ label: '概率、排序', value, rules: ['int', 'notnull', 'length'], conditions: [1, 1000] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      objTypeList: [],
      objectTypeList: [],
      objTypeDialog: {
        title: '选择奖励类型',
        visible: false,
        btLoading: false,
        width: '500px',
        height: '300px'
      },
      itemProps: {},
      tempData: {},
      activeName: 'tab1',
      getApi,
      updateApi,
      getGameItemApi,
      getPoolListApi,
      lotteryId: this.$route.query.lotteryId || '',
      status: this.$route.query.status || '',
      objectType: '',
      objectId: 0,
      objectName: '',
      showPickDialogBtnDisabled: false,
      tableApiName: undefined,
      btnChangeEnable: '',
      // 相关列表
      listTypeInfo: {
        merchantList: [],
        statusList: [],
        itemTypeList: [],
        rareTypeList: [],
        gameItemTypeList: [],
        bestStatusList: []
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
          id: this.$route.query.lotteryId || '',
          objectType: '',
          validFrom: '',
          validTo: '',
          hitQty: '',
          weight: '',
          weightShow: '',
          status: '',
          valid: [],
          lotteryName: ''
        },
        fieldList: [],
        rules: {},
        labelWidth: '120px'
      },
      poolFieldList: [
        { label: '转盘ID', value: 'id', type: 'tag', className: 'el-form-block-30' },
        { label: '转盘名称', value: 'lotteryName', type: 'tag', className: 'el-form-block-30' },
        { label: '有效时间', value: 'validDate', type: 'slot', className: 'el-form-block-60' },
        { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', className: 'el-form-block-30' }
      ],
      poolFieldListEdit: [
        { label: '转盘ID', value: 'id', type: 'tag', className: 'el-form-block-30' },
        { label: '转盘名称', value: 'lotteryName', type: 'input', required: true, validator: checkName, className: 'el-form-block-30' },
        { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changedate', required: true, validator: checkValidFrom, className: 'el-form-block-60' },
        { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', className: 'el-form-block-30' }
      ],
      tableInfo: {
        refresh: 1,
        initCurPage: 1,
        pager: false, // 不分页（单个层级数据量不大）
        tableIndex: false,
        data: [],
        fieldList: [
          { label: '奖励ID', value: 'id' },
          { label: '奖励类型', value: 'objectType', type: 'slot' },
          { label: '奖励名称', value: 'objectName' },
          { label: '抽中奖品数量', value: 'hitQty' },
          { label: '中奖概率', value: 'weight' },
          { label: '排序', value: 'sort' }
        ],
        query: { lotteryId: this.$route.query.lotteryId },
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: [
            { label: '编辑', tooltip: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'editLottery', show: true },
            { label: '删除', tooltip: '删除', type: 'danger', icon: 'el-icon-delete', event: 'deleteLottery', show: true }
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
        height: '500px',
        btList: [
          { label: '取消', type: 'info', icon: '', event: 'cancelLotteryPoolForm', show: true },
          { label: '确定', type: 'primary', icon: '', event: 'saveLotteryPoolForm', saveLoading: false, show: true }
        ]
      },
      // 表单相关（显示）
      poolFormInfo: {
        ref: null,
        data: {
          hitQty: '',
          weight: '',
          total: '',
          sort: ''
        },
        fieldList: [
          { label: '奖励ID', value: 'objectId', type: 'tag', className: 'el-form-block' },
          { label: '奖励名称', value: 'objectName', type: 'tag', className: 'el-form-block' },
          { label: '抽中奖品数量', value: 'hitQty', type: 'input', validator: checkRealInt, required: true, className: 'el-form-block' },
          { label: '中奖概率', value: 'weight', type: 'input', validator: checkHitQty, required: true, className: 'el-form-block' },
          { label: '排序', value: 'sort', type: 'input', validator: checkHitQty, required: true }
        ],
        labelWidth: '120px'
      },
      itemFormInfo: {
        ref: null,
        data: {
          imageUrl: '',
          hitQty: '',
          weight: '',
          total: '',
          sort: '',
          imageThumbnailUrl: '',
          itemTypeName: '',
          rareType: ''
        },
        fieldList: [
          { label: '图片', value: 'imageUrl', type: 'slot', className: 'el-form-block' },
          { label: '奖励ID', value: 'objectId', type: 'tag' },
          { label: '奖励名称', value: 'objectName', type: 'tag' },
          { label: '装备类型', value: 'itemTypeName', type: 'tag' },
          { label: '稀有度', value: 'rareType', type: 'tag' },
          { label: '抽中奖品数量', value: 'hitQty', type: 'input', validator: checkRealInt, required: true, className: 'el-form-block' },
          { label: '中奖概率', value: 'weight', type: 'input', validator: checkHitQty, required: true, className: 'el-form-block' },
          { label: '排序', value: 'sort', type: 'input', validator: checkHitQty, required: true, className: 'el-form-block' }
        ],
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
    'formInfo.data.status'(val) {
      this.initButtonList(val)
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
        getMerchantListApi({}),
        getConfigItemsListApi({ 'configType': 'GENERAL_STATUS' }),
        getConfigItemsListApi({ 'configType': 'GAME_LOTTERY_POOL_OBJECT_TYPE' }),
        getConfigItemsListApi({ 'configType': 'GAME_ITEM_TYPE' })
      ]
      Promise.all(reqArr).then(res => {
        let codeSum = 0
        for (const item of res) {
          codeSum += Number(item.code)
        }
        if (codeSum % 200 !== 0) {
          this.$message.success('获取失败')
        }
        that.listTypeInfo.merchantList = res[0].data
        that.listTypeInfo.statusList = res[1].data
        that.objectTypeList = res[2].data
        that.listTypeInfo.itemTypeList = res[3].data
      }).catch(error => {
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          duration: 3500
        })
      })
      this.itemFormInfo.staffId = this.staffId
      this.poolFormInfo.staffId = this.staffId
      // 获取详情
      this.getData()
    },
    getMerchantName(val) {
      for (const item of this.listTypeInfo.merchantList) {
        if (Number(item.id) === Number(val)) {
          return item.merchantName + '/' + item.shortName
        }
      }
      return '暂未设置'
    },
    getObjectTypeName(val) {
      for (const item of this.objectTypeList) {
        if (Number(item.itemValue) === Number(val)) {
          return item.itemName
        }
      }
      return '暂未设置'
    },
    getGameItemTypeName(val) {
      for (const item of this.listTypeInfo.gameItemTypeList) {
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
        this.formInfo.fieldList = this.poolFieldListEdit
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'save', show: false },
          { type: 'button', label: '启用', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'submit', show: false },
          { type: 'button', label: '不启用', btType: 'danger', icon: 'el-icon-close', loading: 'ngLoading', event: 'stop', show: false }
        ]
        this.tableInfo.handle.btList.forEach(item => {
          item.disabled = false
        })
        this.showPickDialogBtnDisabled = false
      } else if (status === 2 || status === 3) {
        this.formInfo.fieldList = this.poolFieldList
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'saveLoading', event: 'edit', show: false }
        ]
        this.tableInfo.handle.btList.forEach(item => {
          item.disabled = true
        })
        this.showPickDialogBtnDisabled = true
      } else {
        this.formInfo.fieldList = []
        this.filterInfo.list = []
      }
      this.initDataPermits()
    },
    initDataPermits() {
      this.$initDataPermits('lotteryDetail', this.filterInfo.list) // 条件区域操作权限
      this.$initDataPermits('lotteryDetail', this.tableInfo.handle.btList)
      // TODO添加按钮的权限
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
      this.itemFormInfo.rules = this.$initRules(this.itemFormInfo.fieldList)
      this.poolFormInfo.rules = this.$initRules(this.poolFormInfo.fieldList)
    },
    getData() {
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      // 表单验证初始化
      const params = { id: this.$route.query.lotteryId }
      this.$handleAPI('', getApi, params).then(res => {
        if (Number(res.code) === 200) {
          this.initButtonList(res.data.status)
          // this.lotteryId = res.data.id
          // this.objectName = res.data.objectName
          for (const key in res.data) {
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = res.data[key]
            }
          }
          this.formInfo.data.valid = [res.data.validFrom, res.data.validTo]
          this.tableInfo.query = { lotteryId: this.lotteryId }
          this.tableInfo.refresh = Math.random()
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
    clickObjType(e) {
      const props = {
        staffId: this.staffId,
        lotteryId: this.lotteryId,
        objectType: Number(e.itemValue)
      }
      // 弹出选择具体条目
      this.popupDialog.title = '选择' + e.itemName
      this.popupDialog.typeVal = e.itemValue
      this.popupDialog.visible = true
      this.itemProps = props
      // 创建 11-装备 12-金币 13-钻石
    },
    pickItem(data, popType) {
      // 添加装备
      if (data !== '' || data !== undefined) {
        const props = Object.assign(this.itemProps, { objectId: data.id, objectName: data.itemName, imageUrl: data.imageUrl, itemTypeName: data.itemTypeName, rareType: data.rareType })
        this.formDialog.title = '添加' + data.itemName
        if (this.itemProps.objectType === 11) {
          this.itemFormInfo.data = props
        } else if (this.itemProps.objectType === 12 || this.itemProps.objectType === 13) {
          this.poolFormInfo.data = props
        }
        this.formDialog.visible = true
        this.popupDialog.visible = false
      }
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'showObjTypeDialog': {
          this.objTypeDialog.visible = true
          break
        }
        case 'saveLotteryPoolForm': {
          let allFormValid = true
          if (this.itemProps.objectType === 11) {
            this.itemFormInfo.ref.validate(valid => {
              allFormValid = valid
            })
          } else if (this.itemProps.objectType === 12 || this.itemProps.objectType === 13) {
            this.poolFormInfo.ref.validate(valid => {
              allFormValid = valid
            })
          }
          if (allFormValid === true) {
            if (this.tempData.id !== undefined) {
              // update
              const props = this.tempData.objectType === 11 ? this.itemFormInfo.data : this.poolFormInfo.data
              props.staffId = this.staffId
              props.total = props.hitQty // 总数量默认=抽中数量
              this.$handleAPI('', updatePoolApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.objTypeDialog.visible = false
                  this.popupDialog.visible = false
                  this.formDialog.visible = false
                  this.tableInfo.refresh = Math.random()
                  this.$message.success('编辑奖励成功')
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
              this.itemProps.total = this.itemProps.hitQty // 总数量默认=抽中数量
              this.$handleAPI('', createPoolApi, this.itemProps).then(res => {
                if (Number(res.code) === 200) {
                  this.objTypeDialog.visible = false
                  this.popupDialog.visible = false
                  this.formDialog.visible = false
                  this.tableInfo.refresh = Math.random()
                  this.$message.success('新增奖励成功')
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
          break
        }
        case 'cancelLotteryPoolForm': {
          this.popupDialog.visible = false
          this.formDialog.visible = false
          break
        }
        case 'editLottery': {
          this.tempData = data
          this.itemProps.objectType = data.objectType
          this.formDialog.title = '编辑 - ' + data.objectName
          if (data.objectType === 11) {
            this.itemFormInfo.data = JSON.parse(JSON.stringify(this.tempData))
          } else if (data.objectType === 12 || data.objectType === 13) {
            this.poolFormInfo.data = JSON.parse(JSON.stringify(this.tempData))
          }
          this.formDialog.visible = true
          break
        }
        case 'deleteLottery': {
          this.$confirm('确定要删除该奖励池吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const props = { id: data.id, deleteFlag: 1, staffId: this.staffId }
            this.$handleAPI('', updatePoolApi, props).then(res => {
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
        case 'edit': {
          this.formInfo.fieldList = this.poolFieldListEdit
          this.showPickDialogBtnDisabled = false
          const props = {
            id: this.lotteryId,
            staffId: this.staffId,
            status: 1
          }
          this.$handleAPI('', updateApi, props).then(res => {
            if (Number(res.code) === 200) {
              this.getData()
              this.formInfo.fieldList = res.data.status === 1 ? this.poolFieldListEdit : this.poolFieldList
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
              const props = {
                id: this.lotteryId,
                validFrom: this.formInfo.data.validFrom === null ? '' : this.formInfo.data.validFrom,
                validTo: this.formInfo.data.validTo === null ? '' : this.formInfo.data.validTo,
                lotteryName: this.formInfo.data.lotteryName,
                staffId: this.staffId
              }
              if (props.validFrom === props.validTo) {
                this.$message.error('有效期不可设置为同一时间点')
                return
              }
              this.$handleAPI('', updateApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.getData()
                  this.formInfo.fieldList = res.data.status === 1 ? this.poolFieldListEdit : this.poolFieldList
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
              const props = {
                id: this.lotteryId,
                validFrom: this.formInfo.data.validFrom === null ? '' : this.formInfo.data.validFrom,
                validTo: this.formInfo.data.validTo === null ? '' : this.formInfo.data.validTo,
                lotteryName: this.formInfo.data.lotteryName,
                status: 2,
                staffId: this.staffId
              }
              if (props.validFrom === props.validTo) {
                this.$message.error('有效期不可设置为同一时间点')
                return
              }
              if (this.tableInfo.data.length === 0) {
                this.$message.error('暂未设置奖励奖品，不可启用')
                return
              }
              this.$handleAPI('', updateApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.getData()
                  this.formInfo.fieldList = this.poolFieldList
                  this.$message({
                    showClose: true,
                    message: '启用成功',
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
        case 'stop': {
          this.$confirm('确定要禁用该转盘吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.formInfo.ref.validate(valid => {
              if (valid) {
                const props = {
                  id: this.lotteryId,
                  validFrom: this.formInfo.data.validFrom === null ? '' : this.formInfo.data.validFrom,
                  validTo: this.formInfo.data.validTo === null ? '' : this.formInfo.data.validTo,
                  lotteryName: this.formInfo.data.lotteryName,
                  status: 3,
                  staffId: this.staffId
                }
                this.$handleAPI('', updateApi, props).then(res => {
                  if (Number(res.code) === 200) {
                    this.getData()
                    this.formInfo.fieldList = this.poolFieldList
                    this.$message({
                      showClose: true,
                      message: '禁用成功',
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
                this.formInfo.fieldList = this.poolFieldList
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
        case 'changedate': // 有效期修改
          if (this.formInfo.data.valid !== null) {
            this.formInfo.data.validFrom = this.$fn.switchTime(this.formInfo.data.valid[0])
            this.formInfo.data.validTo = this.$fn.switchTime(this.formInfo.data.valid[1])
          } else {
            this.formInfo.data.validFrom = ''
            this.formInfo.data.validTo = ''
          }
          break
      }
    }
  }
}
</script>

<style scoped>
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
</style>
