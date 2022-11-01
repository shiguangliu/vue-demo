<template>
  <div class="template-container poolDetail">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="奖励详情" name="tab1">
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
              <el-tag class="el-form-block-30" size="medium">{{ formInfo.data.validFrom + ' ~ ' + formInfo.data.validTo }}</el-tag>
            </template>
          </page-form>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px;border-color: #13C0C5;">
          <div slot="header" class="clearfix">
            <span>奖励信息</span>
            <el-button type="primary" icon="el-icon-plus" :disabled="showPickDialogBtnDisabled" style="float: right;" @click="handleClick('showPickDialog')">添加</el-button>
          </div>
          <page-table
            v-if="objectType === 10"
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurPage"
            :data.sync="tableInfo.data"
            :api="getCouponApi"
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
            <template v-slot:col-linkRate="scope">
              <p>{{ scope.row.totalLink + '/' + scope.row.total }}</p>
            </template>
          </page-table>
          <page-table
            v-if="objectType === 11"
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurPage"
            :data.sync="tableInfo.data"
            :api="getGameItemApi"
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
            <template v-slot:col-sponsorFlag="scope">
              <p>{{ getSponsorFlagName(scope.row.sponsorFlag) }}</p>
            </template>
            <template v-slot:col-itemType="scope">
              <p>{{ getGameItemTypeName(scope.row.itemType) }}</p>
            </template>
          </page-table>
          <page-table
            v-if="objectType === 13"
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurPage"
            :data.sync="tableInfo.data"
            :api="getGameItemApi"
            :query="tableInfo.query"
            :field-list="tableInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="tableInfo.handle"
            :pager="tableInfo.pager"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <template v-slot:col-itemType="scope">
              <p>{{ getGameItemTypeName(scope.row.itemType) }}</p>
            </template>
          </page-table>
          <page-table
            v-if="objectType === 14"
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurPage"
            :data.sync="tableInfo.data"
            :api="getBestApi"
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
            <template v-slot:col-customImgUrl="scope">
              <img
                v-if="scope.row.article != null && scope.row.article.imageUrl"
                v-imgAlart
                :src="$TH.FILE_URLS.static_url + scope.row.article.imageUrl"
                style="max-height: 60px;"
                :onerror="nopicture"
              >
              <img
                v-if="scope.row.goods != null && scope.row.goods.imageUrl"
                v-imgAlart
                :src="$TH.FILE_URLS.static_url + scope.row.goods.imageUrl"
                style="max-height: 60px;"
                :onerror="nopicture"
              >
            </template>
            <template v-slot:col-merchantId="scope">
              <p v-if="scope.row.article != null && scope.row.article.merchantId">{{ getMerchantName(scope.row.article.merchantId) }}</p>
              <p v-if="scope.row.goods != null && scope.row.goods.merchantId">{{ getMerchantName(scope.row.goods.merchantId) }}</p>
            </template>
            <template v-slot:col-tagId="scope">
              <p>{{ getTagName(scope.row.tagId) }}</p>
            </template>
            <template v-slot:col-objectType="scope">
              <p>{{ getBestObjectTypeName(scope.row.objectType) }}</p>
            </template>
            <template v-slot:col-advFlag="scope">
              <p>{{ getAdvFlagName(scope.row.advFlag) }}</p>
            </template>
            <template v-slot:col-status="scope">
              <p>{{ getGeneralStatusName(scope.row.status) }}</p>
            </template>
          </page-table>
          <page-table
            v-if="objectType === 15"
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurPage"
            :data.sync="tableInfo.data"
            :api="getGroupApi"
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
            <template v-slot:col-merchantId="scope">
              <p>{{ getMerchantName(scope.row.merchantId) }}</p>
            </template>
            <template v-slot:col-maxFlag="scope">
              <p>{{ getMaxFlagName(scope.row.maxFlag) }}</p>
            </template>
            <template v-slot:col-multiFlag="scope">
              <p>{{ getMultiFlagName(scope.row.multiFlag) }}</p>
            </template>
            <template v-slot:col-status="scope">
              <p>{{ getGroupStatusName(scope.row.status) }}</p>
            </template>
            <template v-slot:col-level1Price="scope">
              <p>{{ '¥' + scope.row.level1Price }}</p>
            </template>
          </page-table>
          <page-table
            v-if="objectType === 16"
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
              <p>{{ scope.row.validFrom + '-' + scope.row.validTo }}</p>
            </template>
            <template v-slot:col-merchantName="scope">
              <p>{{ getMerchantName(scope.row.merchantId) }}</p>
            </template>
            <template v-slot:col-status="scope">
              <p>{{ getGeneralStatusName(scope.row.status) }}</p>
            </template>
          </page-table>
        </el-card>
        <!-- 选择-->
        <page-dialog
          :title="popupDialog.title"
          :visible.sync="popupDialog.visible"
          :width="popupDialog.width"
          :bt-loading="popupDialog.btLoading"
          :bt-list="popupDialog.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <PopCoupon v-if="popupDialog.visible && objectType == 10" :custom-query="{ validFrom: formInfo.data.validFrom, validTo: formInfo.data.validTo }" @pickItem="pickItem" />
          <PopGameItem v-if="popupDialog.visible && objectType == 11" @pickItem="pickItem" />
          <PopGameItem v-if="popupDialog.visible && objectType == 13" :custom-query="{ itemType: '31' }" @pickItem="pickItem" />
          <PopBest v-if="popupDialog.visible && objectType == 14" :custom-query="{ validFrom: formInfo.data.validFrom, validTo: formInfo.data.validTo }" @pickItem="pickItem" />
          <PopGroup v-if="popupDialog.visible && objectType == 15" :custom-query="{ validFrom: formInfo.data.validFrom, validTo: formInfo.data.validTo }" @pickItem="pickItem" />
          <PopH5 v-if="popupDialog.visible && objectType == 16" :custom-query="{ validFrom: formInfo.data.validFrom, validTo: formInfo.data.validTo }" @pickItem="pickItem" />
        </page-dialog>
        <!-- 选择文章end -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi, getMerchantListApi, getBestTagListApi } from '@/api/common'
import { getApi, updateApi, getGameItemApi, getGroupApi, getBestApi, getH5Api, getCouponApi } from '@/api/fztriplotterypool'
import defaultImage from '@/assets/img/no-pic.jpg'
import PageFilter from '@/components/PageFilter'
import PageDialog from '@/components/PageDialog'
import PageTable from '@/components/PageTable'
import PageForm from '@/components/PageForm'
import PopGameItem from '@/components/Popup/PopGameItem'
import PopH5 from '@/components/Popup/PopH5'
import PopBest from '@/components/Popup/PopBest'
import PopGroup from '@/components/Popup/PopGroup'
import PopCoupon from '@/components/Popup/PopCoupon'

export default {
  components: {
    PageFilter,
    PageDialog,
    PageForm,
    PageTable,
    PopGameItem,
    PopH5,
    PopBest,
    PopGroup,
    PopCoupon
  },
  data() {
    const checkValidFrom = (rule, value, callback) => {
      const check = this.$validate({ label: '有效时间', value: this.formInfo.data.validFrom, rules: ['notnull'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkHitQty = (rule, value, callback) => {
      const check = this.$validate({ label: '奖励数量', value, rules: ['realint', 'notnull', 'length'], conditions: [1, 1000] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkRate = (rule, value, callback) => {
      const check = this.$validate({ label: '概率', value, rules: ['number', 'notnull', 'length'], conditions: [1, 10] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      activeName: 'tab1',
      getApi,
      updateApi,
      getGameItemApi,
      getGroupApi,
      getBestApi,
      getH5Api,
      getCouponApi,
      poolId: this.$route.query.poolId || '',
      status: this.$route.query.status || '',
      objectType: this.$route.query.objectType || 0,
      objectId: 0,
      objectName: '',
      merchantId: '',
      showPickDialogBtnDisabled: false,
      tableApiName: undefined,
      btnChangeEnable: '',
      // 相关列表
      listTypeInfo: {
        merchantList: [],
        statusList: [],
        multiFlagList: [],
        groupStatusList: [],
        maxFlagList: [],
        itemTypeList: [],
        rareTypeList: [],
        yesNoList: [],
        gameItemTypeList: [],
        bestStatusList: [],
        limitTypeList: [],
        advFlagList: [],
        tagList: [],
        bestObjectTypeList: [],
        couponStatusList: []
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
          id: this.$route.query.poolId || '',
          objectName: '',
          objectType: this.$route.query.objectType,
          objectTypeName: '',
          validFrom: '',
          validTo: '',
          hitQty: '',
          weight: '',
          weightShow: '',
          status: '',
          valid: []
        },
        fieldList: [],
        rules: {},
        labelWidth: '150px'
      },
      poolFieldList: [
        { label: '奖励ID', value: 'id', type: 'tag', className: 'el-form-inline-block-20' },
        { label: '奖励名称', value: 'objectName', type: 'tag', className: 'el-form-inline-block-50' },
        { label: '奖励类型', value: 'objectTypeName', type: 'tag', className: 'el-form-inline-block-20' },
        { label: '有效时间', value: 'validDate', type: 'slot', className: 'el-form-inline-block-30' },
        { label: '奖励数量', value: 'hitQty', type: 'input', append: 'append', fixtext: '个', disabled: true, className: 'el-form-inline-block-20' },
        { label: '中奖权重概率', value: 'weight', type: 'input', disabled: true, className: 'el-form-inline-block-20' },
        { label: '未中奖展示权重概率', value: 'weightShow', type: 'input', disabled: true, className: 'el-form-inline-block-20' },
        { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', className: 'el-form-inline-block-20' }
      ],
      poolFieldListEdit: [
        { label: '奖励ID', value: 'id', type: 'tag', className: 'el-form-inline-block-20' },
        { label: '奖励名称', value: 'objectName', type: 'tag', className: 'el-form-inline-block-50' },
        { label: '奖励类型', value: 'objectTypeName', type: 'tag', className: 'el-form-inline-block-20' },
        { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', event: 'changedate', beforeAfterFlag: 'after', required: true, validator: checkValidFrom, className: 'el-form-inline-block-30' },
        { label: '奖励数量', value: 'hitQty', type: 'input', append: 'append', fixtext: '个', validator: checkHitQty, required: true, className: 'el-form-inline-block-20' },
        { label: '中奖权重概率', value: 'weight', type: 'input', validator: checkRate, required: true, className: 'el-form-inline-block-20' },
        { label: '未中奖展示权重概率', value: 'weightShow', type: 'input', validator: checkRate, required: true, className: 'el-form-inline-block-20' },
        { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', className: 'el-form-inline-block-20' }
      ],
      tableInfo: {
        refresh: 1,
        initCurPage: 1,
        pager: false, // 不分页（单个层级数据量不大）
        tableIndex: false,
        data: [],
        fieldList: [],
        query: {},
        handle: {
          fixed: 'right',
          label: '操作',
          width: '100',
          btList: [
            { label: '删除', tooltip: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: false }
          ]
        }
      },
      tableData: [],
      tableFieldList: [],
      couponTableFieldList: [
        { label: '票券ID', value: 'id' },
        { label: '票券名称', value: 'couponName' },
        { label: '有效时间', value: 'validDate', type: 'slot', width: 270 },
        { label: '创建时间', value: 'createTime', width: 150 },
        { label: '所属商户', value: 'merchantName' },
        { label: '缩略图', value: 'thumbnailUrl', type: 'image', width: 100 },
        { label: '价格', value: 'price' },
        { label: '发放情况', value: 'linkRate', type: 'slot' },
        { label: '状态', value: 'statusName' }
      ],
      gameItemTableFieldList: [
        { label: '装备ID', value: 'id' },
        { label: '装备名称', value: 'itemName' },
        { label: '装备类型', value: 'itemType', type: 'slot' },
        { label: '图片', value: 'imageThumbnailUrl', type: 'image' },
        { label: '稀有度', value: 'rareType' },
        { label: '是否赞助', value: 'sponsorFlag', type: 'slot' },
        { label: '等级', value: 'itemLevel' },
        { label: '马力', value: 'powers' },
        { label: '稳定', value: 'stable' },
        { label: '操控', value: 'control' },
        { label: '性能分', value: 'performance' },
        { label: '满级价值', value: 'maxValue' }
      ],
      diamondItemTableFieldList: [
        { label: '装备ID', value: 'id' },
        { label: '装备名称', value: 'itemName' },
        { label: '装备类型', value: 'itemType', type: 'slot' },
        { label: '图片', value: 'imageThumbnailUrl', type: 'image' }
      ],
      bestTableFieldList: [
        { label: '优选ID', value: 'id' },
        { label: '优选标签', value: 'tagId', type: 'slot' },
        { label: '优选名称', value: 'bestName' },
        { label: '缩略图', value: 'customImgUrl', type: 'slot' },
        { label: '所属商户', value: 'merchantId', type: 'slot' },
        { label: '类型', value: 'objectType', type: 'slot' },
        { label: '性质', value: 'advFlag', type: 'slot' },
        { label: '有效时间', value: 'validDate', type: 'slot' },
        { label: '状态', value: 'status', type: 'slot' }
      ],
      groupTableFieldList: [
        { label: '拼团ID', value: 'groupId' },
        { label: '拼团名称', value: 'groupTitle' },
        { label: '列表图片', value: 'imageUrl', type: 'image' },
        { label: '有效时间', value: 'validDate', type: 'slot' },
        { label: '所属商户', value: 'merchantId', type: 'slot' },
        { label: '拼团类型', value: 'maxFlag', type: 'slot' },
        { label: '当前价格', value: 'level1Price', type: 'slot' },
        { label: '当前参团人数', value: 'level1' },
        { label: '报名费用', value: 'groupFee' },
        { label: '重复参与', value: 'multiFlag', type: 'slot' },
        { label: '拼团状态', value: 'status', type: 'slot' },
        { label: '状态', value: 'status', type: 'slot' }
      ],
      h5TableFieldList: [
        { label: 'H5ID', value: 'id' },
        { label: 'H5名称', value: 'title' },
        { label: '缩略图', value: 'imageUrl', type: 'image' },
        { label: '链接地址', value: 'jumpLink' },
        { label: '所属商户', value: 'merchantName', type: 'slot' },
        { label: '有效时间', value: 'validDate', type: 'slot' },
        { label: '创建时间', value: 'createTime' },
        { label: '状态', value: 'status', type: 'slot' }
      ],
      popupDialog: {
        title: '',
        typeVal: '',
        visible: false,
        btLoading: false,
        height: '600px'
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
    'objectType'(val) {
      switch (val) {
        case 10: {
          this.tableInfo.fieldList = this.couponTableFieldList
          break
        }
        case 11: {
          this.tableInfo.fieldList = this.gameItemTableFieldList
          break
        }
        case 13: {
          this.tableInfo.fieldList = this.diamondItemTableFieldList
          break
        }
        case 14: {
          this.tableInfo.fieldList = this.bestTableFieldList
          break
        }
        case 15: {
          this.tableInfo.fieldList = this.groupTableFieldList
          break
        }
        case 16: {
          this.tableInfo.fieldList = this.h5TableFieldList
          break
        }
      }
    }
  },
  created() {
    this.initList()
    // this.getData()
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
  },
  methods: {
    getMerchantName(val) {
      for (const item of this.listTypeInfo.merchantList) {
        if (Number(item.id) === Number(val)) {
          return item.merchantName + '/' + item.shortName
        }
      }
      return '暂未设置'
    },
    getMultiFlagName(val) {
      for (const item of this.listTypeInfo.multiFlagList) {
        if (Number(item.itemValue) === Number(val)) {
          return item.itemName
        }
      }
      return '暂未设置'
    },
    getMaxFlagName(val) {
      for (const item of this.listTypeInfo.maxFlagList) {
        if (Number(item.itemValue) === Number(val)) {
          return item.itemName
        }
      }
      return '暂未设置'
    },
    getGroupStatusName(val) {
      for (const item of this.listTypeInfo.groupStatusList) {
        if (Number(item.itemValue) === Number(val)) {
          return item.itemName
        }
      }
      return '暂未设置'
    },
    getSponsorFlagName(val) {
      for (const item of this.listTypeInfo.yesNoList) {
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
    getAdvFlagName(val) {
      for (const item of this.listTypeInfo.advFlagList) {
        if (Number(item.itemValue) === Number(val)) {
          return item.itemName
        }
      }
      return '暂未设置'
    },
    getTagName(val) {
      for (const item of this.listTypeInfo.tagList) {
        if (Number(item.tagId) === Number(val)) {
          return item.tagName
        }
      }
      return '暂未设置'
    },
    getBestObjectTypeName(val) {
      for (const item of this.listTypeInfo.bestObjectTypeList) {
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
    getTableData(objType, objectId) {
      switch (objType) {
        case 10: {
          this.tableInfo.fieldList = this.couponTableFieldList
          this.tableInfo.query = { id: objectId }
          this.tableInfo.refresh = Math.random()
          break
        }
        case 11: {
          this.tableInfo.fieldList = this.gameItemTableFieldList
          this.tableInfo.query = { id: objectId }
          this.tableInfo.refresh = Math.random()
          break
        }
        case 13: {
          this.tableInfo.fieldList = this.diamondItemTableFieldList
          this.tableInfo.query = { id: objectId }
          this.tableInfo.refresh = Math.random()
          break
        }
        case 14: {
          this.tableInfo.fieldList = this.bestTableFieldList
          this.tableInfo.query = { bestId: objectId }
          this.tableInfo.refresh = Math.random()
          break
        }
        case 15: {
          this.tableInfo.fieldList = this.groupTableFieldList
          this.tableInfo.query = { groupId: objectId }
          this.tableInfo.refresh = Math.random()
          break
        }
        case 16: {
          this.tableInfo.fieldList = this.h5TableFieldList
          this.tableInfo.query = { id: objectId }
          this.tableInfo.refresh = Math.random()
          break
        }
      }
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
        this.tableInfo.handle.btList[0].disabled = false
        this.showPickDialogBtnDisabled = false
      } else if (status === 2 || status === 3) {
        this.formInfo.fieldList = this.poolFieldList
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'saveLoading', event: 'edit', show: false }
        ]
        this.tableInfo.handle.btList[0].disabled = true
        this.showPickDialogBtnDisabled = true
      } else {
        this.formInfo.fieldList = []
        this.filterInfo.list = []
      }
      this.initDataPermits()
    },
    initDataPermits() {
      this.$initDataPermits('tripLotteryDetail', this.filterInfo.list) // 条件区域操作权限
      this.$initDataPermits('tripLotteryDetail', this.tableInfo.handle.btList)
      // TODO添加按钮的权限
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      // best 14
      if (Number(this.$route.query.objectType) === 14) {
        this.$handleAPI('', getConfigItemsListApi, { 'configType': 'BEST_ADV_FLAG' }).then(res => {
          if (res.code === 200) {
            this.listTypeInfo.advFlagList = res.data
          }
        })
        this.$handleAPI('', getConfigItemsListApi, { 'configType': 'BEST_OBJECT_TYPE' }).then(res => {
          if (res.code === 200) {
            this.listTypeInfo.bestObjectTypeList = res.data
          }
        })
        this.$handleAPI('', getBestTagListApi, {}).then(res => {
          if (res.code === 200) {
            this.listTypeInfo.tagList = res.data.list
          }
        })
      }
      // group 15
      if (Number(this.$route.query.objectType) === 15) {
        this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GROUP_MULTI_FLAG' }).then(res => {
          if (res.code === 200) {
            this.listTypeInfo.multiFlagList = res.data
          }
        })
        this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GROUP_STATUS' }).then(res => {
          if (res.code === 200) {
            this.listTypeInfo.groupStatusList = res.data
          }
        })
        this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GROUP_MAX_FLAG' }).then(res => {
          if (res.code === 200) {
            this.listTypeInfo.maxFlagList = res.data
          }
        })
      }
      if (Number(this.$route.query.objectType) === 10) {
        this.$handleAPI('', getConfigItemsListApi, { 'configType': 'COUPON_STATUS' }).then(res => {
          if (res.code === 200) {
            this.listTypeInfo.couponStatusList = res.data
          }
        })
      }
      // gameitem 11
      if (Number(this.$route.query.objectType) === 11 || Number(this.$route.query.objectType) === 13) {
        this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_TYPE' }).then(res => {
          if (res.code === 200) {
            this.listTypeInfo.itemTypeList = res.data
          }
        })
        this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_RARE_TYPE' }).then(res => {
          if (res.code === 200) {
            this.listTypeInfo.rareTypeList = res.data
          }
        })
        this.$handleAPI('', getConfigItemsListApi, { 'configType': 'YES_NO' }).then(res => {
          if (res.code === 200) {
            this.listTypeInfo.yesNoList = res.data
          }
        })
        this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_TYPE' }).then(res => {
          if (res.code === 200) {
            this.listTypeInfo.gameItemTypeList = res.data
          }
        })
      }
      // 获取详细
      this.getData()
    },
    getData() {
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      // 表单验证初始化
      const params = { id: this.$route.query.poolId }
      this.$handleAPI('', getApi, params).then(res => {
        if (Number(res.code) === 200) {
          this.initButtonList(res.data.status)
          this.objectType = res.data.objectType
          this.objectId = res.data.objectId
          this.objectName = res.data.objectName
          for (const key in res.data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = res.data[key]
            }
          }
          // 设置1隐藏显示
          if (this.objectType === 14 || this.objectType === 15 || this.objectType === 16) {
            for (const item of this.formInfo.fieldList) {
              this.formInfo.data.hitQty = 1
              if (item.value === 'hitQty') {
                item.type = 'hidden'
              }
            }
          }
          this.formInfo.data.valid = [res.data.validFrom, res.data.validTo]
          if (Number(res.data.objectId) !== 0) {
            this.getTableData(res.data.objectType, res.data.objectId)
          }
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
      if (data !== '' || data !== undefined) {
        this.objectId = data.id
        this.merchantId = data.merchantId
        switch (this.objectType) {
          case 10:
            this.objectName = data.couponName
            break
          case 11:
            this.objectName = data.itemName
            break
          case 14:
            this.objectName = data.bestName
            break
          case 15:
            this.objectName = data.groupTitle
            break
          case 16:
            this.objectName = data.h5Name
            break
        }
        this.getTableData(this.objectType, data.id)
        this.popupDialog.visible = false
      }
    },
    getConfirmRes() {
      const pageThis = this
      // 判断pool有效期与奖励品有效期对比
      const poolValidFrom = this.formInfo.data.validFrom
      const poolValidTo = this.formInfo.data.validTo
      const tableValidFrom = this.tableInfo.data[0].validFrom
      const tableValidTo = this.tableInfo.data[0].validTo
      if (poolValidFrom !== tableValidFrom || poolValidTo !== tableValidTo) {
        return new Promise((resolve) => {
          pageThis.$confirm('奖池有效期与奖品有效期不一致，请仔细核验再确认！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            resolve(true)
          }).catch((e) => {
            resolve(false)
          })
        })
      } else {
        return new Promise((resolve) => {
          resolve(true)
        })
      }
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'showPickDialog': {
          // 弹出选择具体条目
          this.popupDialog.title = '选择'
          this.popupDialog.typeVal = this.objectType
          this.popupDialog.visible = true
          break
        }
        case 'edit': {
          // delete this.tableInfo.handle.btList[0].disabled
          // this.tableInfo.refresh = Math.random()
          this.formInfo.fieldList = this.poolFieldListEdit
          this.showPickDialogBtnDisabled = false
          const props = {
            id: this.poolId,
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
          this.getConfirmRes().then(res => {
            if (res) {
              this.formInfo.ref.validate(valid => {
                if (valid) {
                  const props = {
                    id: this.poolId,
                    validFrom: this.formInfo.data.validFrom === null ? '' : this.formInfo.data.validFrom,
                    validTo: this.formInfo.data.validTo === null ? '' : this.formInfo.data.validTo,
                    hitQty: this.formInfo.data.hitQty,
                    weight: this.formInfo.data.weight,
                    weightShow: this.formInfo.data.weightShow,
                    staffId: this.staffId,
                    status: 1,
                    objectId: this.objectId,
                    objectName: this.objectName,
                    merchantId: this.merchantId
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
            }
          })
          break
        }
        case 'submit': {
          this.getConfirmRes().then(res => {
            if (res) {
              this.formInfo.ref.validate(valid => {
                if (valid) {
                  if (this.tableInfo.data.length === 0) {
                    this.$message.error('请至少添加一个奖励')
                    return false
                  }
                  const props = {
                    id: this.poolId,
                    validFrom: this.formInfo.data.validFrom,
                    validTo: this.formInfo.data.validTo,
                    hitQty: this.formInfo.data.hitQty,
                    weight: this.formInfo.data.weight,
                    weightShow: this.formInfo.data.weightShow,
                    staffId: this.staffId,
                    status: 2,
                    objectId: this.objectId,
                    objectName: this.objectName
                  }
                  this.$handleAPI('', updateApi, props).then(res => {
                    if (Number(res.code) === 200) {
                      this.getData()
                      this.formInfo.fieldList = this.poolFieldList
                      // TODO 添加按钮不可用
                    }
                    this.$message({
                      showClose: true,
                      message: '启用成功',
                      type: 'success',
                      duration: 3500
                    })
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
            }
          })
          break
        }
        case 'stop': {
          this.$confirm('确定要禁用该奖励池吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.formInfo.ref.validate(valid => {
              if (valid) {
                const props = {
                  id: this.poolId,
                  validFrom: this.formInfo.data.validFrom,
                  validTo: this.formInfo.data.validTo,
                  hitQty: this.formInfo.data.hitQty,
                  weight: this.formInfo.data.weight,
                  weightShow: this.formInfo.data.weightShow,
                  staffId: this.staffId,
                  status: 3,
                  objectId: this.objectId,
                  objectName: this.objectName
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
              objectId: 0
            }
            this.$handleAPI('', updateApi, props).then(res => {
              if (Number(res.code) === 200) {
                this.getData()
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

<style scoped lang="scss">
  .template-container {
    padding: 0px;
    margin: 20px;
  }
  .image {
    width: 100%;
    display: block;
  }
</style>
<style lang="scss">
  .poolDetail {
    .el-table {
      max-height: 200px !important;
    }
  }
</style>
