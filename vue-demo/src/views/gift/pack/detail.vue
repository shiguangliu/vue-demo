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
      <el-tab-pane label="新手礼包详情" name="tab1">
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
              />
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card">
          <div class="clearfix">
            <span>礼包商品明细</span>
            <el-button
              v-if="formInfo.data.status == 1"
              v-waves
              size="mini"
              class="handle-button"
              style="float: right;"
              :type="'primary'"
              :icon="'el-icon-plus'"
              @click="handleClick('insertCommodity')"
            >
              {{ '新增礼包商品' }}
            </el-button>
          </div>
          <br>
          <!-- 表格 -->
          <page-table
            :refresh="tableInfo2.refresh"
            :init-curpage="tableInfo2.initCurpage"
            :data.sync="tableInfo2.data"
            :field-list="tableInfo2.fieldList"
            :list-type-info="listTypeInfo"
            :pager="false"
            :handle="tableInfo2.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <template v-slot:col-price="scope">
              <p v-if="scope.row.priceType == 0">{{ '-' }}</p>
              <p v-if="scope.row.priceType == 1"><i class="tableIcon fa fa-jpy" />{{ ' ' + scope.row.price }}</p>
              <p v-if="scope.row.priceType == 2"><i class="tableIcon el-icon-coin" />{{ ' ' + scope.row.price }}</p>
              <p v-if="scope.row.priceType == 3"><i class="tableIcon fa fa-diamond" />{{ ' ' + scope.row.price }}</p>
            </template>
          </page-table>
        </el-card>
        <!-- 新增礼包商品 -->
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
              <el-button type="default" style="width: 100%;margin-bottom: 10px;" @click="clickObjType(item)">
                <div style="padding: 10px;">
                  <i v-if="item.itemValue == 1" class="cardIcon el-icon-coin" />
                  <i v-if="item.itemValue == 2" class="cardIcon fa fa-diamond" />
                  <i v-if="item.itemValue == 3" class="cardIcon el-icon-setting" />
                  <h3 class="icon-name">{{ item.itemName }}</h3>
                </div>
              </el-button>
            </el-col>
          </el-row>
        </page-dialog>
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
        <page-dialog
          :title="popupDialog.title"
          :visible.sync="popupDialog.visible"
          :width="popupDialog.width"
          :bt-loading="popupDialog.btLoading"
          :bt-list="popupDialog.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <PopGameItem v-if="popupDialog.visible && popupDialog.typeVal == 1" :custom-query="{ diff: undefined, itemType: '30'}" @pickItem="pickItem" />
          <PopGameItem v-if="popupDialog.visible && popupDialog.typeVal == 2" :custom-query="{ diff: undefined, itemType: '31' }" @pickItem="pickItem" />
          <PopGameItem v-if="popupDialog.visible && popupDialog.typeVal == 3" :custom-query="{ diff: 1}" @pickItem="pickItem" />
        </page-dialog>
        <page-dialog
          :width="dialogAdd.width"
          :visible.sync="dialogAdd.visible"
          :title="dialogAdd.title[dialogAdd.type]"
          :bt-loading="dialogAdd.btLoading"
          :bt-list="dialogAdd.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <page-form
            :ref-obj.sync="formInfo2.ref2"
            :data="formInfo2.data"
            :field-list="formInfo2.fieldList"
            :rules="formInfo2.rules2"
            :label-width="formInfo2.labelWidth"
            :list-type-info="listTypeInfo"
            :read-only="formInfo2.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <!-- 自定义插槽-选择图片 -->
            <template v-slot:form-curUrl>
              <div class="slot-avatar">
                <img
                  v-imgAlart
                  :src="$TH.FILE_URLS.static_url + formInfo2.data.curUrl"
                  style="height: 30px;"
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
import { getGiftPackInfo, giftPackDel, giftPackUpdateStatus, giftPackUpdate } from '@/api/gift/pack/detail'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import Upload from '@/components/Upload'
import defaultImage from '@/assets/img/no-pic.jpg'
import PopH5 from '@/components/Popup/PopH5'
import PageTable from '@/components/PageTable'
import PopGameItem from '@/components/Popup/PopGameItem'

export default {
  components: {
    PageTable,
    PageFilter,
    PageForm,
    PageDialog,
    Upload,
    PopH5,
    PopGameItem
  },
  data() {
    const checkValiddate = (rule, value, callback) => {
      var msg = ''
      if (value.length === 0) {
        msg = '请输入有效时间!'
      }
      if (value.length >= 2) {
        if (value[1] !== null) {
          var dt1 = new Date()
          var dt2 = new Date(value[1])
          if (dt2 < dt1) {
            msg = '有效截止时间必须大于今天'
          }
        }
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    const checkUpdSort = (rule, value, callback) => {
      const check = this.$validate({ label: '排序', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkItemValue = (rule, value, callback) => {
      const check = this.$validate({ label: '价值', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        if (value === 0) {
          callback(new Error('价值必须大于0'))
        }
        callback()
      }
    }
    const checkUpdCount = (rule, value, callback) => {
      const check = this.$validate({ label: '添加数量', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      getGiftPackInfo,
      activeName: 'tab1',
      editIndex: '',
      editType: '',
      inputCount: 1,
      curItemId: 0,
      inputNumber: '',
      curItemName: '',
      curItemSort: '',
      curTypeName: '',
      curRarity: '',
      curUrl: '',
      readOnly: false,
      objectTypeList: [],
      chooseReward: {
        id: '',
        itemValue: ''
      },
      fzGiftPackDetailList: [],
      listTypeInfo: {
        guideTypeList: [],
        statusList: []
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
          packName: '',
          guideType: '',
          validFrom: '',
          validTo: '',
          valid: [],
          status: ''
        },
        fieldList: [
          { label: '新手礼包ID', value: 'id', type: 'tag', className: 'el-form-block' },
          { label: '新手礼包名称', value: 'packName', type: 'input', className: 'el-form-block', required: true },
          { label: '适用场景', value: 'guideType', type: 'customselect', list: 'guideTypeList', key: 'itemValue', name: 'itemName', required: true },
          { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changedate', required: true, className: 'el-form-block', validator: checkValiddate },
          { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', className: 'el-form-block' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 表单相关（追加、修改）
      formInfo2: {
        ref2: null,
        data: {
          curItemId: '',
          curItemName: '',
          curItemSort: '',
          curTypeName: '',
          curRarity: '',
          curUrl: '',
          itemValue: '',
          inputCount: ''
        },
        fieldList: [
          { label: '装备的ID', value: 'curItemId', type: 'tag', className: 'el-form-block-80' },
          { label: '装备的名称', value: 'curItemName', type: 'tag', className: 'el-form-block-80' },
          { label: '图片', value: 'curUrl', type: 'slot', className: 'el-form-block-80' },
          { label: '装备类型', value: 'curTypeName', type: 'tag', className: 'el-form-block-80' },
          { label: '稀有度', value: 'curRarity', type: 'tag', className: 'el-form-block-80' },
          { label: '价值(元)', value: 'itemValue', type: 'input', required: true, className: 'el-form-block-80', validator: checkItemValue },
          { label: '排序', value: 'curItemSort', type: 'input', required: true, className: 'el-form-block-80', validator: checkUpdSort },
          { label: '添加数量', value: 'inputCount', type: 'input', required: true, className: 'el-form-block-80', validator: checkUpdCount }
        ],
        rules2: {},
        labelWidth: '120px'
      },
      // 表格相关（检索结果）
      tableInfo2: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '商品ID', value: 'id' },
          { label: '商品名称', value: 'itemName' },
          { label: '装备类型', value: 'itemTypeName' },
          { label: '图片', value: 'imageThumbnailUrl', type: 'image' },
          { label: '稀有度', value: 'rareType' },
          { label: '数量', value: 'quantity' },
          { label: '是否赞助', value: 'sponsorFlagName' },
          { label: '售卖价格', value: 'price', type: 'slot' },
          { label: '价值(元)', value: 'itemValue' },
          { label: '排序', value: 'sort' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '180',
          btList: [
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'giftDelete', show: true },
            { label: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'giftEtid', show: true }
          ]
        }
      },
      objTypeDialog: {
        title: '选择礼包类型',
        visible: false,
        btLoading: false,
        width: '800px',
        height: '300px'
      },
      popupDialog: {
        title: '',
        typeVal: '',
        visible: false,
        btLoading: false,
        height: '600px'
      },
      dialogAdd: {
        title: { gold: '添加金币', equip: '添加装备', diamond: '添加钻石', goldEdit: '修改金币', equipEdit: '修改装备', diamondEdit: '修改钻石' },
        visible: false,
        btLoading: false,
        type: '',
        width: '400px',
        btList: [
          { label: '取消', type: '', icon: '', event: 'cancellDialogAdd', show: true },
          { label: '确定', type: 'primary', icon: '', event: 'addDialogAdd', show: true }
        ]
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
      this.$initDataPermits('giftPackDetail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
    //  下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'APP_GUIDE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.guideTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_RACE_CUP_REWARD_TYPE' }).then(res => {
        if (res.code === 200) {
          res.data.forEach(element => {
            if (element.itemValue !== '9') {
              var objectType = {
                'itemValue': element.itemValue,
                'itemName': element.itemName
              }
              this.objectTypeList.push(objectType)
            }
          })
          // this.objectTypeList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
      this.formInfo2.rules2 = this.$initRules(this.formInfo2.fieldList)
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      // 获取url参数
      this.formInfo.data.id = this.$route.query.id
      if (this.formInfo.data.id !== null && this.formInfo.data.id !== '') {
        // 获取协议详细
        const param = { 'id': this.formInfo.data.id }
        this.$handleAPI('', getGiftPackInfo, param).then(res => {
          if (res.code === 200) {
            const data = res.data
            data.guideType += ''
            if (data.guideType === '0') {
              data.guideType = ''
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
            }
            this.tableInfo2.data = data.fzGameItemList
          }
        })
      } else {
        this.formInfo.data.status = 1
      }
    },
    clickObjType(e) {
      const props = {
        objectType: Number(e.itemValue)
      }
      // 弹出选择具体条目
      this.popupDialog.title = '选择' + e.itemName
      this.popupDialog.typeVal = e.itemValue
      this.popupDialog.visible = true
      this.itemProps = props
    },
    pickItem(data) {
      var prizes = this.tableInfo2.data
      var flag = false
      if (prizes !== null && prizes.length > 0) {
        prizes.forEach(item => {
          if (Number(item.id) === Number(data.id)) {
            this.$message({
              showClose: true,
              message: '同一奖励级别中,奖项不可重复',
              type: 'error',
              duration: 3500
            })
            flag = true
          }
        })
      }
      if (flag) {
        return
      }
      if (data.itemType !== 30 && data.itemType !== 31) {
        this.formInfo2.data.curTypeName = data.itemTypeName
        this.formInfo2.data.curRarity = data.rareType
        this.formInfo2.data.curUrl = data.imageThumbnailUrl
      } else {
        this.formInfo2.data.curTypeName = ''
        this.formInfo2.data.curRarity = ''
        this.formInfo2.data.curUrl = ''
      }
      this.formInfo2.data.itemValue = ''
      this.formInfo2.data.curItemId = data.id
      this.formInfo2.data.curItemName = data.itemName
      this.formInfo2.data.curItemSort = Number(this.inputNumber) + 1
      this.formInfo2.data.inputCount = 1
      this.chooseReward = data
      if (data.itemType === 30 || data.itemType === 31) {
        this.formInfo2.fieldList.forEach(element => {
          if (element.value === 'curTypeName') {
            element.type = 'hidden'
          }
          if (element.value === 'curRarity') {
            element.type = 'hidden'
          }
          if (element.value === 'curUrl') {
            element.type = 'hidden'
          }
        })
      } else {
        this.formInfo2.fieldList.forEach(element => {
          if (element.value === 'curTypeName') {
            element.type = 'tag'
          }
          if (element.value === 'curRarity') {
            element.type = 'tag'
          }
          if (element.value === 'curUrl') {
            element.type = 'slot'
          }
        })
      }
      this.dialogAdd.visible = true
      if (data.itemType === 30) { // 金币
        this.dialogAdd.type = 'gold'
      }
      if (data.itemType !== 30 && data.itemType !== 31) { // 装备
        this.dialogAdd.type = 'equip'
      }
      if (data.itemType === 31) { // 钻石
        this.dialogAdd.type = 'diamond'
      }
      this.editType = 'addType'
    },
    initButtonList(status) {
      status = Number(status)
      if (status === 3) { // 停用状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '启用', btType: 'primary', icon: 'el-icon-check', loading: 'submitLoading', event: 'submit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
        this.tableInfo2.handle.btList = []
      }
      if (status === 2) { // 启用状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '停用', btType: 'danger', icon: 'el-icon-bottom', loading: 'deleteLoading', event: 'stop', show: false }
        ]
        this.tableInfo2.handle.btList = []
      }
      if (status === 1) { // 编辑状态
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '启用', btType: 'primary', icon: 'el-icon-check', loading: 'submitLoading', event: 'submit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
        this.tableInfo2.handle.btList = [
          { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'giftDelete', show: true },
          { label: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'giftEtid', show: true }
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
        case 'cancellDialogAdd':
          this.dialogAdd.visible = false
          this.inputCount = 1
          break
        case 'addDialogAdd': {
          this.formInfo2.ref2.validate(valid => {
            if (valid) {
              if (this.editType === 'giftEdit') {
                this.tableInfo2.data[this.editIndex].sort = this.formInfo2.data.curItemSort
                this.tableInfo2.data[this.editIndex].quantity = this.formInfo2.data.inputCount
                this.tableInfo2.data[this.editIndex].itemValue = this.formInfo2.data.itemValue
                this.formInfo2.data.inputCount = 1
                this.dialogAdd.visible = false
              } else {
                this.chooseReward.sort = this.formInfo2.data.curItemSort
                this.chooseReward.quantity = this.formInfo2.data.inputCount
                this.chooseReward.itemValue = this.formInfo2.data.itemValue
                this.inputNumber = this.formInfo2.data.curItemSort
                this.dialogAdd.visible = false
                this.popupDialog.visible = false
                this.objTypeDialog.visible = false
                this.inputCount = 1
                console.log(this.chooseReward)
                this.tableInfo2.data.push(this.chooseReward)
              }
            }
          })
          break
        }
        case 'insertCommodity': {
          if (this.tableInfo2.data.length !== 0) {
            var maxNumber = 1
            this.tableInfo2.data.forEach(item => {
              if (item.sort > maxNumber) {
                maxNumber = item.sort
              }
            })
            this.inputNumber = maxNumber
          }
          this.objTypeDialog.visible = true
          break
        }
        case 'giftDelete': {
          this.tableInfo2.data.splice(this.tableInfo2.data.indexOf(data), 1)
          break
        }
        case 'giftEtid': {
          this.formInfo2.data.curItemId = data.id
          this.formInfo2.data.curItemName = data.itemName
          this.formInfo2.data.curItemSort = data.sort
          this.formInfo2.data.inputCount = data.quantity
          this.formInfo2.data.itemValue = data.itemValue
          if (data.itemType !== 30 && data.itemType !== 31) {
            this.formInfo2.data.curTypeName = data.itemTypeName
            this.formInfo2.data.curRarity = data.rareType
            this.formInfo2.data.curUrl = data.imageThumbnailUrl
          } else {
            this.formInfo2.data.curTypeName = ''
            this.formInfo2.data.curRarity = ''
            this.formInfo2.data.curUrl = ''
          }
          if (data.itemType === 30) { // 金币
            this.dialogAdd.type = 'goldEdit'
          }
          if (data.itemType !== 30 && data.itemType !== 31) { // 装备
            this.dialogAdd.type = 'equipEdit'
          }
          if (data.itemType === 31) { // 钻石
            this.dialogAdd.type = 'diamondEdit'
          }
          this.editType = 'giftEdit'
          this.editIndex = this.tableInfo2.data.indexOf(data)
          if (data.itemType === 30 || data.itemType === 31) {
            this.formInfo2.fieldList.forEach(element => {
              if (element.value === 'curTypeName') {
                element.type = 'hidden'
              }
              if (element.value === 'curRarity') {
                element.type = 'hidden'
              }
              if (element.value === 'curUrl') {
                element.type = 'hidden'
              }
            })
          } else {
            this.formInfo2.fieldList.forEach(element => {
              if (element.value === 'curTypeName') {
                element.type = 'tag'
              }
              if (element.value === 'curRarity') {
                element.type = 'tag'
              }
              if (element.value === 'curUrl') {
                element.type = 'slot'
              }
            })
          }
          this.dialogAdd.visible = true
          break
        }
        case 'save': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              var currentTime = new Date()
              var validToTime = new Date(this.formInfo.data.validTo)
              if (validToTime < currentTime) {
                this.$message({
                  showClose: true,
                  message: '有效截止时间必须大于今天',
                  type: 'error',
                  duration: 3500
                })
              }
              if (this.tableInfo2.data !== null && this.tableInfo2.data !== '') {
                this.tableInfo2.data.forEach(item => {
                  var fzGiftPackDetail = {
                    'id': '',
                    'seqId': '',
                    'itemId': '',
                    'itemType': '',
                    'quantity': '',
                    'itemValue': '',
                    'sort': ''
                  }
                  fzGiftPackDetail.id = this.formInfo.data.id
                  fzGiftPackDetail.itemId = item.id
                  fzGiftPackDetail.itemType = item.itemType
                  fzGiftPackDetail.quantity = item.quantity
                  fzGiftPackDetail.itemValue = item.itemValue
                  fzGiftPackDetail.sort = item.sort
                  this.fzGiftPackDetailList.push(fzGiftPackDetail)
                })
              }
              const params = {
                'id': this.formInfo.data.id,
                'packName': this.formInfo.data.packName,
                'guideType': this.formInfo.data.guideType,
                'validFrom': this.formInfo.data.validFrom,
                'validTo': this.formInfo.data.validTo,
                'status': 1,
                'updateBy': this.$store.state.staff.staffId,
                'fzGiftPackDetailList': this.fzGiftPackDetailList
              }
              this.$handleAPI('', giftPackUpdate, params).then(res => {
                if (res.code === 200) {
                  this.formInfo.data.id = res.data.id
                  this.formInfo.data.status = 1
                  this.initButtonList(this.formInfo.status)
                  this.fzGiftPackDetailList = []
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
          break
        }
        case 'delete': {
          if (this.formInfo.data.id !== null && this.formInfo.data.id !== '') {
            var mparamDelete = {
              'id': this.formInfo.data.id,
              'updateBy': this.$store.state.staff.staffId
            }
            this.$handleAPI('delete', giftPackDel, mparamDelete).then(res => {
              if (res.code === 200) {
                this.$store.dispatch('tagsView/delView', this.$route).then(() => {
                  this.$router.push({ path: './index', replace: true })
                })
              }
            })
          } else {
            this.$store.dispatch('tagsView/delView', this.$route).then(() => {
              this.$router.push({ path: './index', replace: true })
            })
          }
          break
        }
        case 'edit': {
          const param = {
            'id': this.formInfo.data.id,
            'status': 1,
            'updateBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', giftPackUpdateStatus, param).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 1
            }
          })
          break
        }
        case 'stop': {
          const param = {
            'id': this.formInfo.data.id,
            'status': 3,
            'updateBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', giftPackUpdateStatus, param).then(res => {
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
        case 'submit': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              var currentTime1 = new Date()
              var validToTime1 = new Date(this.formInfo.data.validTo)
              if (validToTime1 < currentTime1) {
                this.$message({
                  showClose: true,
                  message: '有效截止时间必须大于今天',
                  type: 'error',
                  duration: 3500
                })
              }
              if (this.tableInfo2.data !== null && this.tableInfo2.data !== '') {
                this.tableInfo2.data.forEach(item => {
                  var fzGiftPackDetail = {
                    'id': '',
                    'seqId': '',
                    'itemId': '',
                    'itemType': '',
                    'quantity': '',
                    'itemValue': '',
                    'sort': ''
                  }
                  fzGiftPackDetail.id = this.formInfo.data.id
                  fzGiftPackDetail.itemId = item.id
                  fzGiftPackDetail.itemType = item.itemType
                  fzGiftPackDetail.quantity = item.quantity
                  fzGiftPackDetail.itemValue = item.itemValue
                  fzGiftPackDetail.sort = item.sort
                  this.fzGiftPackDetailList.push(fzGiftPackDetail)
                })
              }
              const params = {
                'id': this.formInfo.data.id,
                'packName': this.formInfo.data.packName,
                'guideType': this.formInfo.data.guideType,
                'validFrom': this.formInfo.data.validFrom,
                'validTo': this.formInfo.data.validTo,
                'status': 2,
                'updateBy': this.$store.state.staff.staffId,
                'fzGiftPackDetailList': this.fzGiftPackDetailList
              }
              this.$handleAPI('', giftPackUpdate, params).then(res => {
                if (res.code === 200) {
                  this.formInfo.data.id = res.data.id
                  this.formInfo.data.status = 2
                  this.initButtonList(this.formInfo.status)
                  this.fzGiftPackDetailList = []
                }
                this.$message({
                  showClose: true,
                  message: (res.code === 200) ? '修改成功' : res.message,
                  type: (res.code === 200) ? 'success' : 'error',
                  duration: 3500
                })
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
              // const temp = data.fileList
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
  .cardIcon {
    font-size: 40px;
  }
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
