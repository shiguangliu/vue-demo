<template>
  <div class="group-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <!-- 条件栏 -->
    <el-tabs
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane label="基本信息" name="base">
        <el-row>
          <el-col :span="12">
            <page-form
              :ref-obj.sync="formInfo.ref1"
              :data="formInfo.data"
              :field-list="formInfo.fieldList1"
              :rules="formInfo.rules1"
              :label-width="formInfo.labelWidth"
              :list-type-info="listTypeInfo"
              :read-only="formInfo.readOnly"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
          </el-col>
          <el-col :span="12">
            <page-form
              :ref-obj.sync="formInfo.ref2"
              :data="formInfo.data"
              :field-list="formInfo.fieldList2"
              :rules="formInfo.rules2"
              :label-width="formInfo.labelWidth"
              :list-type-info="listTypeInfo"
              :read-only="formInfo.readOnly"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            >
              <!-- 自定义插槽-选择图片 -->
              <template v-slot:form-imageUrl>
                <div class="slot-avatar">
                  <img
                    v-imgAlart
                    :src="$TH.FILE_URLS.static_url + formInfo.data.imageUrl"
                    style="height: 60px;"
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
              <!-- 自定义插槽-选择图片 -->
              <template v-slot:form-iconUrl>
                <div class="slot-avatar">
                  <img
                    v-imgAlart
                    :src="$TH.FILE_URLS.static_url + formInfo.data.iconUrl"
                    style="height: 60px;"
                    :onerror="nopicture"
                  >
                  <el-button
                    v-waves
                    type="primary"
                    icon="el-icon-picture"
                    size="mini"
                    @click="handleClick('uploadIcon')"
                  >
                    {{ formInfo.data.iconUrl ? '更换图片' : '选择图片' }}
                  </el-button>
                </div>
              </template>
              <!-- 自定义插槽-选择图片 -->
              <template v-slot:form-shareImageUrl>
                <div class="slot-avatar">
                  <img
                    v-imgAlart
                    :src="$TH.FILE_URLS.static_url + formInfo.data.shareImageUrl"
                    style="height: 60px;"
                    :onerror="nopicture"
                  >
                  <el-button
                    v-waves
                    type="primary"
                    icon="el-icon-picture"
                    size="mini"
                    @click="handleClick('uploadShareImageUrl')"
                  >
                    {{ formInfo.data.shareImageUrl ? '更换图片' : '选择图片' }}
                  </el-button>
                </div>
              </template>
            </page-form>
          </el-col>
        </el-row>
        <br>
        <br>
        <!-- 图片上传弹窗 -->
        <page-dialog
          :title="dialogUpload.title[dialogUpload.type]"
          :visible="(dialogUpload.type === 'uploadFile' || dialogUpload.type === 'uploadIcon' || dialogUpload.type === 'uploadShareImageUrl') && dialogUpload.visible"
          :width="dialogUpload.width"
          :bt-loading="dialogUpload.btLoading"
          :bt-list="dialogUpload.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 图片上传组件 -->
          <Upload
            v-if="dialogUpload.type === 'uploadFile' && dialogUpload.visible"
            :upload-data="{targetPath: 'group',autoname: '1'}"
            @handleEvent="handleEvent"
          />
          <!-- 图片上传组件 -->
          <Upload
            v-if="dialogUpload.type === 'uploadIcon' && dialogUpload.visible"
            :upload-data="{targetPath: 'group',autoname: '1'}"
            @handleEvent="handleEvent"
          />
          <!-- 图片上传组件 -->
          <Upload
            v-if="dialogUpload.type === 'uploadShareImageUrl' && dialogUpload.visible"
            :upload-data="{targetPath: 'group',autoname: '1'}"
            @handleEvent="handleEvent"
          />
        </page-dialog>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="goods">
        <page-form
          :ref-obj.sync="formInfo.refGoods"
          :data="formInfo.data"
          :field-list="formInfo.fieldGoodsList"
          :rules="formInfo.rulesGoods"
          :label-width="formInfo.labelWidth"
          :list-type-info="listTypeInfo"
          :read-only="formInfo.readOnly"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 自定义插槽-富文本 -->
          <template v-slot:form-content>
            <Tinymce v-if="formInfo.data.status === '1' " ref="editor" v-model="formInfo.data.content" :height="400" :width="800" />
            <div v-else class="article-content" v-html="formInfo.data.content">{{ formInfo.data.content }}</div>
          </template>
          <!-- 自定义插槽-阶梯价格1~4 -->
          <template v-slot:form-levelRange>
            <el-row>
              <el-col :span="12">
                <el-form-item label="" prop="level1">
                  <el-input
                    v-model="formInfo.data.level1"
                    :disabled="formInfo.readOnly"
                    :placeholder="'请输入第1档人数'"
                    @focus="handleEvent"
                  >
                    <template slot="prepend">
                      {{ "第1档" }}
                    </template>
                    <template slot="append">
                      {{ "人" }}
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" prop="level1Price">
                  <el-input
                    v-model="formInfo.data.level1Price"
                    :disabled="formInfo.readOnly"
                    :placeholder="'请输入第1档价格'"
                    @focus="handleEvent"
                  >
                    <template slot="append">
                      {{ "元" }}
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="" prop="level2">
                  <el-input
                    v-model="formInfo.data.level2"
                    :disabled="formInfo.readOnly"
                    :placeholder="'请输入第2档人数'"
                    @focus="handleEvent"
                  >
                    <template slot="prepend">
                      {{ "第2档" }}
                    </template>
                    <template slot="append">
                      {{ "人" }}
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" prop="level2Price">
                  <el-input
                    v-model="formInfo.data.level2Price"
                    :disabled="formInfo.readOnly"
                    :placeholder="'请输入第2档价格'"
                    @focus="handleEvent"
                  >
                    <template slot="append">
                      {{ "元" }}
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="" prop="level3">
                  <el-input
                    v-model="formInfo.data.level3"
                    :disabled="formInfo.readOnly"
                    :placeholder="'请输入第3档人数'"
                    @focus="handleEvent"
                  >
                    <template slot="prepend">
                      {{ "第3档" }}
                    </template>
                    <template slot="append">
                      {{ "人" }}
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" prop="level3Price">
                  <el-input
                    v-model="formInfo.data.level3Price"
                    :disabled="formInfo.readOnly"
                    :placeholder="'请输入第3档价格'"
                    @focus="handleEvent"
                  >
                    <template slot="append">
                      {{ "元" }}
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="" prop="level4">
                  <el-input
                    v-model="formInfo.data.level4"
                    :disabled="formInfo.readOnly"
                    :placeholder="'请输入第4档人数'"
                    @focus="handleEvent"
                  >
                    <template slot="prepend">
                      {{ "第4档" }}
                    </template>
                    <template slot="append">
                      {{ "人" }}
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" prop="level4Price">
                  <el-input
                    v-model="formInfo.data.level4Price"
                    :disabled="formInfo.readOnly"
                    :placeholder="'请输入第4档价格'"
                    @focus="handleEvent"
                  >
                    <template slot="append">
                      {{ "元" }}
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
        </page-form>
        <!-- 图片上传弹窗 -->
        <page-dialog
          :title="dialogUploadMarterial.title[dialogUploadMarterial.type]"
          :visible="dialogUploadMarterial.type === 'uploadMarterial' && dialogUploadMarterial.visible"
          :width="dialogUploadMarterial.width"
          :bt-loading="dialogUploadMarterial.btLoading"
          :bt-list="dialogUploadMarterial.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 图片上传组件 -->
          <Upload
            v-if="dialogUploadMarterial.type === 'uploadMarterial' && dialogUploadMarterial.visible"
            :upload-data="{targetPath: 'group',autoname: '1'}"
            @handleEvent="handleEvent"
          />
        </page-dialog>
        <!-- 添加项目end -->
        <page-filter
          :query.sync="filterUpload.query"
          :filter-list="filterUpload.list"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
        <el-row :data="materiallist">
          <el-col v-for="(item, itemIndex) in materiallist" :key="item" :span="3" style="padding: 5px;">
            <el-card :body-style="{ padding: '0px'}">
              <div class="imgdiv">
                <img
                  v-imgAlart
                  :src="$TH.FILE_URLS.static_url + item"
                  class="image"
                  :onerror="nopicture"
                >
              </div>
              <div style="margin: 14px;">
                <!-- <span></span> -->
                <el-tooltip v-show="formInfo.data.status == 1" effect="dark" content="删除素材" placement="bottom">
                  <i v-if="formInfo.data.status == 1" class="el-icon-delete" style="color: #F56C6C; float:right; cursor: pointer;" @click="handleClick('deleteMaterial',itemIndex)" />
                </el-tooltip>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="订单信息" name="apply">
        <div>
          <!-- 导出 -->
          <el-button size="mini" type="primary" icon="el-icon-download" @click="handleClick('export')">导出订单</el-button>
          <br>
          <br>
          <!-- 表格 -->
          <page-table
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurpage"
            :data.sync="tableInfo.data"
            :api="getGroupOrderListForPageApi"
            :query="filterOrderInfo.query"
            :field-list="tableInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="tableInfo.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGroupInfoApi, saveGroupApi, approveGroupStatusApi, getMerchantListApi, deleteGroupApi } from '@/api/group/groupInfo'
import { getConfigItemsListApi } from '@/api/common'
import { getGroupOrderListForPageApi, getGroupOrderListForExcelApi } from '@/api/group/groupOrder'
import defaultImage from '@/assets/img/no-pic.jpg'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import PageTable from '@/components/PageTable'
import Upload from '@/components/Upload'
import Tinymce from '@/components/Tinymce'

export default {
  components: {
    PageFilter,
    PageDialog,
    PageForm,
    PageTable,
    Tinymce,
    Upload
  },
  data() {
    const checkGroupTitle = (rule, value, callback) => {
      const check = this.$validate({ label: '拼团标题名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkGroupSubtitle = (rule, value, callback) => {
      const check = this.$validate({ label: '拼团子标题', value, rules: ['length'], conditions: [0, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkConcat = (rule, value, callback) => {
      const check = this.$validate({ label: '客服电话', value, rules: ['notnull', 'length'], conditions: [1, 100] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkWeight = (rule, value, callback) => {
      const check = this.$validate({ label: '权重', value, rules: ['int', 'notnull', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkGroupFee = (rule, value, callback) => {
      const check = this.$validate({ label: '费用数值', value, rules: ['number', 'length'], conditions: [0, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkGoodsName = (rule, value, callback) => {
      const check = this.$validate({ label: '商品名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkLevel1 = (rule, value, callback) => {
      const check = this.$validate({ label: '参团人数', value, rules: ['notnull', 'int', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkPrice1 = (rule, value, callback) => {
      const check = this.$validate({ label: '档次价格', value, rules: ['notnull', 'number', 'length'], conditions: [1, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkLevel234 = (rule, value, callback) => {
      const check = this.$validate({ label: '参团人数', value, rules: ['int', 'length'], conditions: [0, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkPrice234 = (rule, value, callback) => {
      const check = this.$validate({ label: '档次价格', value, rules: ['number', 'length'], conditions: [0, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkValiddate = (rule, value, callback) => {
      var msg = ''
      if (value !== undefined && value.length >= 2) {
        if (value[1] !== null) {
          if (this.$fn.switchTime(value[1], 'YYYY-MM-DD') < this.$fn.switchTime(new Date(), 'YYYY-MM-DD')) {
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
    return {
      getGroupInfoApi,
      saveGroupApi,
      deleteGroupApi,
      approveGroupStatusApi,
      getMerchantListApi,
      getConfigItemsListApi,
      getGroupOrderListForPageApi,
      getGroupOrderListForExcelApi,
      activeName: 'base',
      groupId: '',
      materiallist: [],
      // 相关列表
      listTypeInfo: {
        merchantList: [], // 商户列表
        maxFlagList: [], // 拼团是否有上限-拼团类型
        payFlagList: [], // 拼团是否需要报名费-报名费用
        multiFlagList: [], // 是否可重复参与
        deliveryFlagList: [], // 是否邮寄
        statusList: [] // 拼团状态
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '订单编号', value: 'orderNo' },
          { label: '拼团名称', value: 'groupTitle' },
          { label: '所属商户', value: 'merchantName' },
          { label: '手机号', value: 'userPhone' },
          { label: '下单时间', value: 'orderTime', width: '180px' },
          { label: '付款状态', value: 'payStatus' },
          { label: '拼团状态', value: 'groupStatus' },
          { label: '订单状态', value: 'orderStatus' },
          { label: '邮寄信息', value: 'address' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '100',
          btList: [
            { label: '详情', type: '', icon: 'el-icon-view', event: 'orderDetail', show: true }
          ]
        }
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          groupId: ''
        },
        list: []
      },
      filterOrderInfo: {
        query: {
          groupId: ''
        },
        list: []
      },
      // 表单相关
      formInfo: {
        ref1: null,
        ref2: null,
        refGoods: null,
        readOnly: false,
        data: {
          operatorId: '',
          groupId: '',
          status: '',
          groupTitle: '',
          groupSubtitle: '',
          merchantId: '',
          contact: '',
          payFlag: '',
          groupFee: '',
          multiFlag: '',
          maxFlag: '',
          weight: '',
          imageUrl: '',
          iconUrl: '',
          shareImageUrl: '',
          valid: [],
          validFrom: '',
          validTo: '',
          deliveryFlag: '',
          goodsId: '',
          goodsName: '',
          refprice: '',
          content: '',
          fileLinkList: [],
          levelRange: '1',
          level1: '',
          level1Price: '',
          level2: '',
          level2Price: '',
          level3: '',
          level3Price: '',
          level4: '',
          level4Price: ''
        },
        fieldList1: [
          { label: 'ID', value: 'groupId', type: 'tag', className: 'el-form-block-50' },
          { label: '拼团标题名称', value: 'groupTitle', type: 'input', required: true, validator: checkGroupTitle, className: 'el-form-block-80' },
          { label: '拼团子标题', value: 'groupSubtitle', type: 'input', validator: checkGroupSubtitle, className: 'el-form-block-80' },
          { label: '所属商户', value: 'merchantId', type: 'customselect', list: 'merchantList', required: true, key: 'id', name: 'merchantName', className: 'el-form-block-80' },
          { label: '客服电话', value: 'contact', type: 'input', required: true, validator: checkConcat, className: 'el-form-block-80' },
          { label: '重复参与', value: 'multiFlag', type: 'customselect', list: 'multiFlagList', required: true, key: 'itemValue', name: 'itemName', className: 'el-form-block-50' },
          { label: '是否邮寄', value: 'deliveryFlag', type: 'customselect', list: 'deliveryFlagList', required: true, key: 'itemValue', name: 'itemName', className: 'el-form-block-50' }
        ],
        fieldList2: [
          { label: '权重', value: 'weight', type: 'input', required: true, validator: checkWeight, className: 'el-form-block-50' },
          { label: '拼团类型', value: 'maxFlag', type: 'customselect', list: 'maxFlagList', required: true, key: 'itemValue', name: 'itemName', className: 'el-form-block-50' },
          { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changedate', required: true, className: 'el-form-block-30', validator: checkValiddate },
          { label: '报名费用', value: 'payFlag', type: 'customselect', list: 'payFlagList', required: true, key: 'itemValue', name: 'itemName', className: 'el-form-block-80' },
          { label: '报名费', value: 'groupFee', type: 'input', validator: checkGroupFee, append: 'append', fixtext: '元', className: 'el-form-block-80' },
          { label: '拼团状态', value: 'status', type: 'customselect', list: 'statusList', disabled: true, key: 'itemValue', name: 'itemName', className: 'el-form-block-50' },
          { label: '拼团图片', value: 'imageUrl', type: 'slot', className: 'el-form-block', required: true },
          { label: '一路所获缩略图', value: 'iconUrl', type: 'slot', className: 'el-form-block', required: true },
          { label: '拼团分享缩略图', value: 'shareImageUrl', type: 'slot', className: 'el-form-block', required: true }
        ],
        fieldGoodsList: [
          { label: '商品ID', value: 'goodsId', type: 'tag', className: 'el-form-block-30' },
          { label: '商品名称', value: 'goodsName', type: 'input', required: true, validator: checkGoodsName, className: 'el-form-block-30' },
          { label: '划线价格', value: 'refprice', type: 'input', append: 'append', fixtext: '元', required: true, className: 'el-form-block-30' },
          { label: '阶梯价格', value: 'levelRange', type: 'slot', required: true },
          { label: '参团人数档次1', value: 'level1', type: 'hidden', required: true, validator: checkLevel1 },
          { label: '档次1价格', value: 'level1Price', type: 'hidden', required: true, validator: checkPrice1 },
          { label: '参团人数档次2', value: 'level2', type: 'hidden', validator: checkLevel234 },
          { label: '档次2价格', value: 'level2Price', type: 'hidden', validator: checkPrice234 },
          { label: '参团人数档次3', value: 'level3', type: 'hidden', validator: checkLevel234 },
          { label: '档次3价格', value: 'level3Price', type: 'hidden', validator: checkPrice234 },
          { label: '参团人数档次4', value: 'level4', type: 'hidden', validator: checkLevel234 },
          { label: '档次4价格', value: 'level4Price', type: 'hidden', validator: checkPrice234 },
          { label: '图文详情', value: 'content', type: 'slot', className: 'el-form-block', required: true }
        ],
        rules1: {},
        rules2: {},
        rulesGoods: {},
        labelWidth: '120px'
      },
      // 图片上传弹窗相关
      dialogUpload: {
        title: {
          uploadFile: '图片上传',
          uploadIcon: '缩略图上传',
          uploadShareImageUrl: '分享图上传'
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
      },
      // 素材上传弹窗相关
      dialogUploadMarterial: {
        title: {
          uploadFile: '素材上传'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'closeUploadMarterial', show: true }
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
      // 按钮权限
      this.initButtonList(this.formInfo.data.status)
    }
  },
  created() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
    this.groupId = this.$route.query.groupId
    this.getMerchantList()
    this.getGroupStatusList()
    this.getMultiFlagList()
    this.getMaxFlagList()
    this.getPayFlagList()
    this.getDeliveryFlagList()
    this.getDetail()
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('groupDetail', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      const formInfo = this.formInfo
      formInfo.rules1 = this.$initRules(formInfo.fieldList1)
      formInfo.rules2 = this.$initRules(formInfo.fieldList2)
      formInfo.rulesGoods = this.$initRules(formInfo.fieldGoodsList)
    },
    // 下拉框需要初始化加载的列表数据
    initList() {
      // table插件 会有created有缓存
      this.groupId = this.$route.query.groupId
      this.filterOrderInfo.query.groupId = this.groupId
      this.tableInfo.refresh = Math.random()
    },
    getMerchantList() {
      const params = {}
      this.$handleAPI('', getMerchantListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
    },
    getMaxFlagList() {
      const params = { 'configType': 'GROUP_MAX_FLAG' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.maxFlagList = res.data
        }
      })
    },
    getPayFlagList() {
      const params = { 'configType': 'GROUP_PAY_FLAG' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.payFlagList = res.data
        }
      })
    },
    getMultiFlagList() {
      const params = { 'configType': 'GROUP_MULTI_FLAG' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.multiFlagList = res.data
        }
      })
    },
    getGroupStatusList() {
      const params = { 'configType': 'GROUP_STATUS' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
    },
    getDeliveryFlagList() {
      const params = { 'configType': 'GROUP_DELIVERY_FLAG' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.deliveryFlagList = res.data
        }
      })
    },
    // 检查参团阶梯价格是否符合-检查商品banner图片是否上传
    checkLevelPrice() {
      const level1 = this.formInfo.data.level1
      const level1Price = this.formInfo.data.level1Price
      const level2 = this.formInfo.data.level2
      const level2Price = this.formInfo.data.level2Price
      const level3 = this.formInfo.data.level3
      const level3Price = this.formInfo.data.level3Price
      const level4 = this.formInfo.data.level4
      const level4Price = this.formInfo.data.level4Price
      const linkArr = this.formInfo.data.fileLinkList
      if (linkArr.length < 1) {
        return '请上传商品banner图片'
      }
      if (linkArr.length > 5) {
        return '商品banner图片不得超过5个'
      }
      var msg = null
      // 层级验证：1验证同一lv价格和人数是否都存在  2 验证是否比上一级人数高，价格低 3 验证上一级人数和价格是否存在
      if ((level2 != null && Number(level2) > 0) || (level2Price != null && Number(level2Price) > 0)) {
        if (level2 != null && Number(level2) > 0 && level2Price != null && Number(level2Price) > 0 &&
          Number(level2) > Number(level1) && Number(level2Price) < Number(level1Price)) {
          // 必须同时满足：价格，人数都存在，且价格比上一档次低，人数比上一档次高
        } else {
          if (level2 == null || Number(level2) <= 0) {
            msg = '请输入档次2人数'
            return msg
          }
          if (level2Price == null || Number(level2Price) <= 0) {
            msg = '请输入档次2价格'
            return msg
          }
          if (Number(level2) <= Number(level1)) {
            msg = '档次2人数必须大于档次1人数'
            return msg
          }
          if (Number(level2Price) >= Number(level1Price)) {
            msg = '档次2价格必须小于档次1价格'
            return msg
          }
        }
      }
      if ((level3 != null && Number(level3) > 0) || (level3Price != null && Number(level3Price) > 0)) {
        if (level3 != null && Number(level3) > 0 && level3Price != null && Number(level3Price) > 0 &&
          Number(level3) > Number(level2) && Number(level3Price) < Number(level2Price)) {
          // 必须同时满足：价格，人数都存在，且价格比上一档次低，人数比上一档次高
        } else {
          if (level3 == null || Number(level3) <= 0) {
            msg = '请输入档次3人数'
            return msg
          }
          if (level3Price == null || Number(level3Price) <= 0) {
            msg = '请输入档次3价格'
            return msg
          }
          if (Number(level3) <= Number(level2)) {
            msg = '档次3人数必须大于档次2人数'
            return msg
          }
          if (Number(level3Price) >= Number(level2Price)) {
            msg = '档次3价格必须小于档次2价格'
            return msg
          }
        }
      }
      if ((level4 != null && Number(level4) > 0) || (level4Price != null && Number(level4Price) > 0)) {
        if (level4 != null && Number(level4) > 0 && level4Price != null && Number(level4Price) > 0 &&
          Number(level4) > Number(level3) && Number(level4Price) < Number(level3Price)) {
          // 必须同时满足：价格，人数都存在，且价格比上一档次低，人数比上一档次高
        } else {
          if (level4 == null || Number(level4) <= 0) {
            msg = '请输入档次4人数'
            return msg
          }
          if (level4Price == null || Number(level4Price) <= 0) {
            msg = '请输入档次4价格'
            return msg
          }
          if (Number(level4) <= Number(level3)) {
            msg = '档次4人数必须大于档次3人数'
            return msg
          }
          if (Number(level4Price) >= Number(level3Price)) {
            msg = '档次4价格必须小于档次3价格'
            return msg
          }
        }
      }
      return msg
    },
    initButtonList(status) {
      status = status + ''
      if (status === '1') {
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存修改', btType: 'primary', icon: 'el-icon-plus', event: 'saveBase', show: true, float: 'left' },
          { type: 'button', label: '提交审批', btType: 'primary', icon: 'el-icon-check', event: 'submitBase', show: true, float: 'left' },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', event: 'delete', show: true, float: 'right' }
        ]
        this.filterUpload.list = [
          { type: 'button', label: '上传banner图片', btType: 'primary', icon: 'el-icon-plus', event: 'uploadMarterial', show: true, float: 'left', className: 'el-form-block' }
        ]
      } else if (status === '2') {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: true, float: 'right' },
          { type: 'button', label: '审批通过', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'approveOK', show: true, float: 'left' },
          { type: 'button', label: '审批拒绝', btType: 'danger', icon: 'el-icon-close', loading: 'ngLoading', event: 'approveNG', show: true, float: 'left' }
        ]
        this.filterUpload.list = [
          { type: 'button', label: '上传banner图片', btType: 'primary', icon: 'el-icon-plus', event: '', show: true, float: 'left', className: 'el-form-block' }
        ]
      } else if (status === '3') {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: true, float: 'left' }
        ]
        this.filterUpload.list = [
          { type: 'button', label: '上传banner图片', btType: 'primary', icon: 'el-icon-plus', event: '', show: true, float: 'left', className: 'el-form-block' }
        ]
      } else if (status === '5') {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: true, float: 'left' }
        ]
        this.filterUpload.list = [
          { type: 'button', label: '上传banner图片', btType: 'primary', icon: 'el-icon-plus', event: '', show: true, float: 'left', className: 'el-form-block' }
        ]
      } else {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
        ]
        this.filterUpload.list = [
          { type: 'button', label: '上传banner图片', btType: 'primary', icon: 'el-icon-plus', event: '', show: true, float: 'left', className: 'el-form-block' }
        ]
      }
      this.initDataPermits()
    },
    getDetail() { // 获取数据
      const params = { groupId: this.groupId }
      const self = this
      this.$handleAPI('', getGroupInfoApi, params).then(res => {
        if (res.code === 200) {
          // self.formInfo.ref.resetFields()
          self.materiallist = res.data.fileLinkList
          for (const key in res.data) {
            // 存在则赋值
            if (key in self.formInfo.data) {
              self.formInfo.data[key] = res.data[key]
              if (key === 'validFrom' && res.data['validFrom'] !== '0000-00-00 00:00:00' && res.data['validFrom'] !== null) {
                self.formInfo.data.valid = [res.data['validFrom'], res.data['validTo']]
              }
            }
          }
          if (res.data.deliveryFlag === 0) {
            res.data.deliveryFlag = null
            self.formInfo.data.deliveryFlag = null
          } else {
            self.formInfo.data.deliveryFlag = res.data.deliveryFlag + ''
          }
          if (res.data.maxFlag === 0) {
            res.data.maxFlag = null
            self.formInfo.data.maxFlag = null
          } else {
            self.formInfo.data.maxFlag = res.data.maxFlag + ''
          }
          if (res.data.multiFlag === 0) {
            res.data.multiFlag = null
            self.formInfo.data.multiFlag = null
          } else {
            self.formInfo.data.multiFlag = res.data.multiFlag + ''
          }
          if (res.data.payFlag === 0) {
            res.data.payFlag = null
            self.formInfo.data.payFlag = null
          } else {
            self.formInfo.data.payFlag = res.data.payFlag + ''
          }
          self.formInfo.data.status = res.data.status + ''
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
        case 'uploadIcon': {
          // 上传缩略图
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        }
        case 'uploadShareImageUrl': {
          // 上传分享缩略图
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        }
        case 'closeUpload':
          // 图片上传弹窗点击关闭
          this.dialogUpload.visible = false
          this.dialogUpload.type = ''
          break
        case 'closeUploadMarterial':
          // 图片上传弹窗点击关闭
          this.dialogUploadMarterial.visible = false
          this.dialogUploadMarterial.type = ''
          break
        case 'uploadMarterial':
          // 上传商品banner图片
          this.dialogUploadMarterial.visible = true
          this.dialogUploadMarterial.type = 'uploadMarterial'
          break
        case 'deleteMaterial': {
          // 删除图片
          this.materiallist.splice(data, 1)
          this.$message.success('删除成功')
          break
        }
        case 'saveBase': {
          // 验证flag
          var flag = true
          var msg = '请检查所有必输项目'
          this.formInfo.ref1.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          this.formInfo.ref2.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          this.formInfo.refGoods.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          if (this.checkLevelPrice() != null) {
            flag = false
            msg = this.checkLevelPrice()
          }
          if (flag) {
            this.formInfo.data.operatorId = this.staffId
            const params = this.formInfo.data
            this.$handleAPI('', saveGroupApi, params).then(res => {
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
          } else {
            this.$message({
              showClose: true,
              message: msg,
              type: 'error',
              duration: 3500
            })
          }
          break
        }
        case 'submitBase': {
          // 验证flag
          var flag1 = true
          var msg1 = '请检查所有必输项目'
          this.formInfo.ref1.validate(valid => {
            if (!valid) {
              flag1 = false
            }
          })
          this.formInfo.ref2.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          this.formInfo.refGoods.validate(valid => {
            if (!valid) {
              flag1 = false
            }
          })
          if (this.checkLevelPrice() != null) {
            flag1 = false
            msg1 = this.checkLevelPrice()
          }
          if (flag1) {
            // const self = this
            this.formInfo.data.operatorId = this.staffId
            this.formInfo.data.status = 2
            const params = this.formInfo.data
            this.$handleAPI('', saveGroupApi, params).then(res => {
              if (res.code === 200) {
                this.formInfo.data.status = 2 + ''
                this.$message({
                  showClose: true,
                  message: '提交审批成功',
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
          } else {
            this.$message({
              showClose: true,
              message: msg1,
              type: 'error',
              duration: 3500
            })
          }
          break
        }
        case 'delete': {
          const params = {}
          const self = this
          var groupIdarr = []
          groupIdarr.push(this.groupId)
          params.groupIds = groupIdarr
          params.operatorId = self.staffId
          this.$handleAPI('delete', deleteGroupApi, params).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 9 + ''
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
        case 'edit': {
          const params = {}
          const self = this
          params.groupId = this.groupId
          params.operatorId = self.staffId
          params.operatorType = 1
          this.$handleAPI('', approveGroupStatusApi, params).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 1 + ''
              this.$message({
                showClose: true,
                message: '编辑成功',
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
          break
        }
        case 'approveOK': {
          const params = {}
          const self = this
          params.groupId = this.groupId
          params.operatorId = self.staffId
          params.operatorType = 5
          this.$handleAPI('', approveGroupStatusApi, params).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 5 + ''
              this.$message({
                showClose: true,
                message: '审核成功',
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
          break
        }
        case 'approveNG': {
          const params = {}
          const self = this
          params.groupId = this.groupId
          params.operatorId = self.staffId
          params.operatorType = 3
          this.$handleAPI('', approveGroupStatusApi, params).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 3 + ''
              this.$message({
                showClose: true,
                message: '审批NG',
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
          break
        }
        case 'export':
          this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
          this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
          this.$handleAPI('', getGroupOrderListForExcelApi, this.filterInfo.query).then(
            res => {
              if (res.code === 200) {
                this.handleDownload(res.data)
              }
            }
          )
          break
        case 'orderDetail': // 编辑订单详情 跳转
          this.$router.push({ path: '../order/detail', query: { orderId: data.orderId }, replace: true })
          break
      }
    },
    handleEvent(event, data) {
      switch (event) {
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
          if (this.dialogUpload.type) {
            if (this.dialogUpload.type === 'uploadFile') {
              this.formInfo.data.imageUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            } else if (this.dialogUpload.type === 'uploadIcon') {
              this.formInfo.data.iconUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            } else if (this.dialogUpload.type === 'uploadShareImageUrl') {
              this.formInfo.data.shareImageUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
          }
          if (this.dialogUploadMarterial.type) {
            if (this.dialogUploadMarterial.type === 'uploadMarterial') {
              const self = this
              if (self.materiallist === null || self.materiallist === undefined) {
                self.materiallist = []
                data.fileList.forEach(item => {
                  self.materiallist.push(item.relativeUrl)
                })
              } else {
                data.fileList.forEach(item => {
                  self.materiallist.push(item.relativeUrl)
                })
              }
              this.formInfo.data.fileLinkList = self.materiallist
              // 关闭弹窗
              this.handleClick('closeUploadMarterial')
            }
          }
          break
        }
      }
    },
    handleDownload(list) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        var tHeader = []
        var filterVal = []
        for (var item in this.tableInfo.fieldList) {
          tHeader[item] = this.tableInfo.fieldList[item].label
          filterVal[item] = this.tableInfo.fieldList[item].value
        }
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return v[j]
          } else {
            return v[j]
          }
        })
      )
    },
    handleClose(event, tag) {
    }
  }
}
</script>
<style scoped lang="scss">
  .group-container {
    height: 800px;
    padding: 20px;

    .slot-avatar{
      height: 60px;
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
  }
</style>
