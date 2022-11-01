<template>
  <div class="app-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="装备基本信息" name="tab1">
        <el-card class="box-card">
          <el-row>
            <el-col :span="16">
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
            <el-col :span="8">
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
                <template v-slot:form-itemLogoUrl>
                  <div class="slot-avatar el-form-image">
                    <img
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + formInfo.data.itemLogoUrl"
                      style="height: 60px;"
                      :onerror="nopicture"
                      :fit="'cover'"
                    >
                    <el-button
                      v-waves
                      type="primary"
                      icon="el-icon-picture"
                      size="mini"
                      @click="handleClick('uploadLogo')"
                    >
                      {{ formInfo.data.itemLogoUrl ? '更换图片' : '选择图片' }}
                    </el-button>
                  </div>
                </template>
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
                <template v-slot:form-imageTripUrl>
                  <div class="slot-avatar el-form-image">
                    <img
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + formInfo.data.imageTripUrl"
                      style="height: 60px;"
                      :onerror="nopicture"
                      :fit="'cover'"
                    >
                    <el-button
                      v-waves
                      type="primary"
                      icon="el-icon-picture"
                      size="mini"
                      @click="handleClick('uploadTrip')"
                    >
                      {{ formInfo.data.imageTripUrl ? '更换图片' : '选择图片' }}
                    </el-button>
                  </div>
                </template>
                <template v-slot:form-imageMapUrl>
                  <div class="slot-avatar el-form-image'">
                    <img
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + formInfo.data.imageMapUrl"
                      style="height: 60px;"
                      :onerror="nopicture"
                      :fit="'cover'"
                    >
                    <el-button
                      v-waves
                      type="primary"
                      icon="el-icon-picture"
                      size="mini"
                      @click="handleClick('uploadMap')"
                    >
                      {{ formInfo.data.imageMapUrl ? '更换图片' : '选择图片' }}
                    </el-button>
                  </div>
                </template>
              </page-form>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>属性信息</span>
          </div>
          <template>
            <el-button v-if="formInfo.data.status == 1" type="primary" icon="el-icon-upload2" @click="handleClick('download')">下载模版</el-button>
            <el-button v-if="formInfo.data.status == 1" type="primary" icon="el-icon-upload2" @click="handleClick('upload')">导入</el-button>
            <el-table :data="gameUpgradeRuleList" border style="width: 80%; margin-top:10px;">
              <el-table-column prop="itemLevel" label="等级" min-width="80" align="center" />
              <el-table-column prop="upgradeCost" label="本级升级至下级所需金币" min-width="180" align="center" />
              <el-table-column prop="" label="升至本级所需金币" min-width="150" align="center">
                <template slot-scope="scope">{{ calSumCost(scope.$index) }}</template>
              </el-table-column>
              <el-table-column prop="price" label="售卖金币价格" min-width="120" align="center" />
              <el-table-column prop="performance" label="性能分" align="center" />
              <el-table-column prop="powers" label="动力" align="center" />
              <el-table-column prop="stable" label="稳定性" align="center" />
              <el-table-column prop="control" label="操控" align="center" />
            </el-table>
          </template>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <br>
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
      <!-- 图片上传组件 -->
      <Upload
        v-if="dialogUpload.type === 'uploadLogo' && dialogUpload.visible"
        :upload-data="{targetPath: 'gameItemLogo',autoname: '1'}"
        @handleEvent="handleEvent"
      />
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
      <Upload
        v-if="dialogUpload.type === 'uploadTrip' && dialogUpload.visible"
        :upload-data="{targetPath: 'gameItemTrip',autoname: '1'}"
        @handleEvent="handleEvent"
      />
      <Upload
        v-if="dialogUpload.type === 'uploadMap' && dialogUpload.visible"
        :upload-data="{targetPath: 'gameItemMap',autoname: '1'}"
        @handleEvent="handleEvent"
      />
    </page-dialog>
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="uploadRuleExcel">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApi, updateApi, deleteApi } from '@/api/game/item'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import defaultImage from '@/assets/img/no-pic.jpg'
import Upload from '@/components/Upload'
import XLSX from 'xlsx'

export default {
  components: {
    PageFilter,
    PageDialog,
    PageForm,
    Upload
  },
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    const checkItemName = (rule, value, callback) => {
      const check = this.$validate({ label: '装备名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkItemBrandName = (rule, value, callback) => {
      const check = this.$validate({ label: '装备品牌名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkItemSeriesName = (rule, value, callback) => {
      const check = this.$validate({ label: '装备系列名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkDescription = (rule, value, callback) => {
      const check = this.$validate({ label: '装备介绍', value, rules: ['length'], conditions: [1, 50] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkItemLevel = (rule, value, callback) => {
      const check = this.$validate({ label: '装备等级', value, rules: ['int', 'notnull', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkMaxLevel = (rule, value, callback) => {
      const check = this.$validate({ label: '装备最大等级', value, rules: ['int', 'notnull', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkMaxValue = (rule, value, callback) => {
      const check = this.$validate({ label: '装备满级价值', value, rules: ['notnull', 'number', 'length'], conditions: [0, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }

    const checkPowers = (rule, value, callback) => {
      const check = this.$validate({ label: '动力', value, rules: ['notnull', 'number', 'length'], conditions: [0, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkStable = (rule, value, callback) => {
      const check = this.$validate({ label: '稳定性', value, rules: ['notnull', 'number', 'length'], conditions: [0, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkControl = (rule, value, callback) => {
      const check = this.$validate({ label: '操控', value, rules: ['notnull', 'number', 'length'], conditions: [0, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkPrice = (rule, value, callback) => {
      const check = this.$validate({ label: '购买价格', value, rules: ['notnull', 'number', 'length'], conditions: [0, 13] })
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
    const checkSort = (rule, value, callback) => {
      const check = this.$validate({ label: '排序', value, rules: ['int', 'notnull', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkImageTripUrl = (rule, value, callback) => {
      if (this.formInfo.data.itemType === '10') {
        const check = this.$validate({ label: '启程顶部用大图', value, rules: ['notnull'] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const checkImageMapUrl = (rule, value, callback) => {
      if (this.formInfo.data.itemType === '10') {
        const check = this.$validate({ label: '游戏地图用大图', value, rules: ['notnull'] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      itemId: '',
      itemDate: [],
      activeName: 'tab1',
      // 相关列表
      listTypeInfo: {
        itemTypeList: [],
        rareTypeList: [],
        sponsorFlagList: [],
        priceTypeList: [],
        statusList: []
      },
      // 过滤相关配置
      filterInfo: {
        query: {
          id: this.itemId
        },
        list: []
      },
      gameUpgradeRuleList: [],
      merchantId: '',
      downloadUrl: '',
      // 表单内容
      formInfo: {
        ref: null,
        imageRef: null,
        readOnly: false,
        data: {
          id: '',
          status: '',
          itemType: '',
          itemName: '',
          itemBrandName: '',
          itemSeriesName: '',
          description: '',
          rareType: '',
          itemLevel: '',
          maxLevel: '',
          maxValue: '',
          performance: '',
          powers: '',
          stable: '',
          control: '',
          priceType: '',
          price: '',
          unitName: '',
          sponsorFlag: '',
          sort: '',
          itemLogoUrl: '',
          imageThumbnailUrl: '',
          imageUrl: '',
          imageTripUrl: '',
          imageMapUrl: ''
        },
        fieldList: [
          { label: '装备ID', value: 'id', type: 'tag' },
          { label: '状态', value: 'status', type: 'customselect', list: 'statusList', key: 'itemValue', name: 'itemName', disabled: true },
          { label: '装备名称', value: 'itemName', type: 'input', required: true, validator: checkItemName },
          { label: '装备类型', value: 'itemType', type: 'customselect', list: 'itemTypeList', key: 'itemValue', name: 'itemName', required: true, event: 'changeItemType' },
          { label: '装备品牌名称', value: 'itemBrandName', type: 'input', required: true, validator: checkItemBrandName },
          { label: '装备系列名称', value: 'itemSeriesName', type: 'input', required: true, validator: checkItemSeriesName },
          { label: '装备介绍', value: 'description', type: 'input', className: 'el-form-block-100', validator: checkDescription },
          { label: '装备稀有度', value: 'rareType', type: 'customselect', list: 'rareTypeList', key: 'itemValue', name: 'itemName', required: true },
          { label: '装备等级', value: 'itemLevel', type: 'input', required: true, validator: checkItemLevel },
          { label: '装备最大等级', value: 'maxLevel', type: 'input', required: true, validator: checkMaxLevel },
          { label: '装备满级价值', value: 'maxValue', type: 'input', required: true, validator: checkMaxValue },
          { label: '动力', value: 'powers', type: 'input', required: true, validator: checkPowers },
          { label: '稳定性', value: 'stable', type: 'input', required: true, validator: checkStable },
          { label: '操控', value: 'control', type: 'input', required: true, validator: checkControl },
          { label: '性能分', value: 'performance', type: 'input', required: true, disabled: true },
          { label: '价格类型', value: 'priceType', type: 'customselect', list: 'priceTypeList', key: 'itemValue', name: 'itemName', required: true },
          { label: '价格', value: 'price', type: 'input', required: true, validator: checkPrice },
          { label: '计量单位名称', value: 'unitName', type: 'input', required: true, validator: checkUnitName },
          { label: '是否赞助', value: 'sponsorFlag', type: 'customselect', list: 'sponsorFlagList', key: 'itemValue', name: 'itemName', required: true },
          { label: '排序', value: 'sort', type: 'input', required: true, validator: checkSort }
        ],
        imageFieldList: [
          { label: '装备品牌logo', value: 'itemLogoUrl', type: 'slot', required: false, className: 'el-form-block' },
          { label: '缩略图片', value: 'imageThumbnailUrl', type: 'slot', required: true, className: 'el-form-block' },
          { label: '装备大图', value: 'imageUrl', type: 'slot', required: true, className: 'el-form-block' },
          { label: '游戏及启程地图用俯视图', value: 'imageMapUrl', type: 'slot', required: true, validator: checkImageMapUrl, className: 'el-form-block' },
          { label: '启程顶部用大图', value: 'imageTripUrl', type: 'slot', required: true, validator: checkImageTripUrl, className: 'el-form-block' }
        ],
        rules: {},
        imageRules: {},
        labelWidth: '180px'
      },
      // 图片上传弹窗相关
      dialogUpload: {
        title: {
          uploadLogo: '商品品牌logo上传',
          uploadThumbnail: '缩略图片上传',
          uploadImage: '大图上传',
          uploadTrip: '启程顶部用大图上传',
          uploadMap: '游戏地图用大图上传'
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
      return (
        'this.src="' +
        this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
      )
    }
  },
  watch: {
    'formInfo.data.status'(val) {
      // 按钮权限
      this.initButtonList(this.formInfo.data.status)
    },
    'formInfo.data.powers'(val) {
      this.handleEvent('changePerformance')
    },
    'formInfo.data.stable'(val) {
      this.handleEvent('changePerformance')
    },
    'formInfo.data.control'(val) {
      this.handleEvent('changePerformance')
    }
  },
  created() {
    this.itemId = this.$route.query.id
    this.getItem()
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('gameItemDetail', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      const formInfo = this.formInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
      formInfo.imageRules = this.$initRules(formInfo.imageFieldList)
    },
    initButtonList(status) {
      // 1:编辑中 2:启用 3:不启用
      status = status + ''
      if (status === '1') {
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false, float: 'left' },
          { type: 'button', label: '启用', btType: 'primary', icon: 'el-icon-open', loading: 'submitLoading', event: 'submit', show: false, float: 'left' },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', loading: 'exportLoading', event: 'export', show: false, float: 'left' },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false, float: 'right' }
        ]
      } else if (status === '2') {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false, float: 'left' },
          { type: 'button', label: '停用', btType: 'primary', icon: 'el-icon-turn-off', loading: 'stopLoading', event: 'stop', show: false, float: 'left' },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', loading: 'exportLoading', event: 'export', show: false, float: 'left' },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false, float: 'right' }
        ]
      } else if (status === '3') {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false, float: 'left' },
          { type: 'button', label: '启用', btType: 'primary', icon: 'el-icon-open', loading: 'stopLoading', event: 'submit', show: false, float: 'left' },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', loading: 'exportLoading', event: 'export', show: false, float: 'left' },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false, float: 'right' }
        ]
      } else {
        this.filterInfo.list = [
        ]
      }
      this.initDataPermits()
    },
    initList() {
      const self = this
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_TYPE' }).then(res => {
        if (res.code === 200) {
          var itemTypeList = res.data
          for (var item of itemTypeList) {
            if (item.itemValue < 30) {
              self.listTypeInfo.itemTypeList.push(item)
            }
          }
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_PRICE_TYPE' }).then(res => {
        if (res.code === 200) {
          var priceTypeList = res.data
          for (var item of priceTypeList) {
            if (item.itemValue > 1) {
              self.listTypeInfo.priceTypeList.push(item)
            }
          }
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_RARE_TYPE' }).then(res => {
        if (res.code === 200) {
          self.listTypeInfo.rareTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'YES_NO' }).then(res => {
        if (res.code === 200) {
          self.listTypeInfo.sponsorFlagList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          self.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_SYSTEM_DATA' }).then(res => {
        if (res.code === 200) {
          var dataList = res.data
          for (var item of dataList) {
            if (item.itemCode === 'PLAT_SYSTEM_DATA_MERCHANT_ID') {
              self.merchantId = item.itemValue // 平台默认商户
              break
            }
          }
        }
      })
      // 模版下载地址
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_DATA_TEMPLATE' }).then(res => {
        if (res.code === 200) {
          var dataList = res.data
          for (var item of dataList) {
            if (item.itemCode === 'PLAT_DATA_TEMPLATE_GAME_ITEM_RULE') {
              self.downloadUrl = item.itemValue // 模版下载地址
              break
            }
          }
        }
      })
    },
    // 获取道具
    getItem() {
      const params = { id: this.itemId }
      const self = this
      this.$handleAPI('', getApi, params).then(res => {
        if (res.code === 200) {
          this.arrangeData(self, res.data)
        } else {
          this.$message({
            showClose: true,
            message: res.error,
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
    // 整理返回的数据
    arrangeData(self, resData) {
      self.itemDate = resData
      self.gameUpgradeRuleList = resData.gameUpgradeRuleList
      for (const key in resData) {
        // 存在则赋值
        if (key in self.formInfo.data) {
          self.formInfo.data[key] = resData[key]
        }
      }
      self.formInfo.data.itemType = self.formInfo.data.itemType === 0 ? '' : self.formInfo.data.itemType + ''
      self.formInfo.data.sponsorFlag = self.formInfo.data.sponsorFlag === 0 ? '' : self.formInfo.data.sponsorFlag + ''
      self.formInfo.data.priceType = self.formInfo.data.priceType === 0 ? '' : self.formInfo.data.priceType + ''
      self.formInfo.data.status += ''
      this.handleEvent('changeItemType', '')
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
      const dialogUpload = this.dialogUpload
      const self = this
      switch (event) {
        case 'uploadLogo': // 上传图片 商品品牌logo
          dialogUpload.visible = true
          dialogUpload.type = event
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
        case 'uploadTrip': // 上传图片 启程顶部用大图URL
          dialogUpload.visible = true
          dialogUpload.type = event
          dialogUpload.num = data
          break
        case 'uploadMap': // 上传图片 游戏地图用大图URL
          dialogUpload.visible = true
          dialogUpload.type = event
          dialogUpload.num = data
          break
        case 'submit' : // 提交
        case 'save': { // 保存
          if (this.gameUpgradeRuleList.length === 0) {
            this.$message({
              type: 'error',
              message: '请上传装备属性信息'
            })
            break
          }
          var maxLevle = Math.max.apply(Math, this.gameUpgradeRuleList.map(function(o) { return o.itemLevel })) // 最大等级
          if (maxLevle + '' !== this.formInfo.data.maxLevel + '') {
            this.$message({
              type: 'error',
              message: '装备属性信息中最高等级和装备最大等级不符'
            })
            break
          }
          var minLevle = Math.min.apply(Math, this.gameUpgradeRuleList.map(function(o) { return o.itemLevel })) // 最低等级
          if (minLevle + '' !== this.formInfo.data.itemLevel + '') {
            this.$message({
              type: 'error',
              message: '装备属性信息中最低等级和装备等级不符'
            })
            break
          }
          var levelCount = maxLevle - minLevle + 1
          if (levelCount + '' !== this.gameUpgradeRuleList.length + '') {
            this.$message({
              type: 'error',
              message: '装备属性信息中存在过多或过少数据'
            })
            break
          }
          for (var x = 0; x < this.gameUpgradeRuleList.length; x++) {
            for (var y = 0; y < this.gameUpgradeRuleList.length; y++) {
              if (this.gameUpgradeRuleList[x].itemLevel === this.gameUpgradeRuleList[y].itemLevel && x !== y) {
                this.$message({
                  type: 'error',
                  message: '装备属性信息中存在相同等级的数据'
                })
                return
              }
            }
          }
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
                  params.itemFlag = this.formInfo.data.itemType.slice(0, 1)
                  if (this.formInfo.data.itemType !== '10') {
                    this.formInfo.data.imageTripUrl = ''
                    this.formInfo.data.imageMapUrl = ''
                  }
                  params.merchantId = this.merchantId
                  params.updateBy = this.staffId
                  params.updateTime = this.itemDate.updateTime
                  params.gameUpgradeRuleList = self.gameUpgradeRuleList
                  this.$handleAPI('', updateApi, params).then(res => {
                    if (res.code === 200) {
                      this.$message.success(confirmStr + '成功')
                      this.arrangeData(this, res.data)
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
        case 'stop' : { // 停用
          this.$confirm('确定要停用吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'id': self.itemId,
              'status': 3,
              'updateTime': self.itemDate.updateTime,
              'updateBy': self.staffId
            }
            this.$handleAPI('', updateApi, params).then(res => {
              if (res.code === 200) {
                this.$message.success('停用成功')
                this.arrangeData(this, res.data)
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
              message: '已取消停用'
            })
          })
          break
        }
        case 'edit' : { // 编辑
          this.$confirm('确定要编辑吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'id': self.itemId,
              'status': 1,
              'updateTime': self.itemDate.updateTime,
              'updateBy': self.staffId
            }
            this.$handleAPI('', updateApi, params).then(res => {
              if (res.code === 200) {
                this.$message.success('编辑成功')
                this.arrangeData(this, res.data)
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
        case 'closeUpload':
          // 图片上传弹窗点击关闭
          dialogUpload.visible = false
          dialogUpload.type = ''
          break
        case 'delete': { // 删除
          const self = this
          this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'id': self.itemId,
              'updateTime': self.itemDate.updateTime,
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
        case 'upload': // 导入
          this.$refs['excel-upload-input'].click()
          break
        case 'download': // 导出
          window.open(this.downloadUrl, '_blank')
          break
        case 'export': // 导出
          this.handleDownload()
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'upload': { // 上传成功，绑定图片链接到id
          if (data.code !== 200) return
          if (this.dialogUpload.type === 'uploadLogo') {
            this.formInfo.data.itemLogoUrl = data.fileList[0].relativeUrl
          } else if (this.dialogUpload.type === 'uploadThumbnail') {
            this.formInfo.data.imageThumbnailUrl = data.fileList[0].relativeUrl
          } else if (this.dialogUpload.type === 'uploadImage') {
            this.formInfo.data.imageUrl = data.fileList[0].relativeUrl
          } else if (this.dialogUpload.type === 'uploadTrip') {
            this.formInfo.data.imageTripUrl = data.fileList[0].relativeUrl
          } else if (this.dialogUpload.type === 'uploadMap') {
            this.formInfo.data.imageMapUrl = data.fileList[0].relativeUrl
          }
          // 关闭弹窗
          this.handleClick('closeUpload')
          break
        }
        case 'changeItemType': // 修改道具类型
          this.formInfo.imageFieldList.forEach(element => {
            if (element.value === 'imageTripUrl') {
              if (this.formInfo.data.itemType === '10') {
                element.type = 'slot'
              } else {
                element.type = 'hidden'
              }
            }
            if (element.value === 'imageMapUrl') {
              if (this.formInfo.data.itemType === '10') {
                element.type = 'slot'
              } else {
                element.type = 'hidden'
              }
            }
          })
          break
        case 'changePerformance':
          this.formInfo.data.performance = parseFloat(this.formInfo.data.powers) + parseFloat(this.formInfo.data.stable) + parseFloat(this.formInfo.data.control)
          if (isNaN(this.formInfo.data.performance)) {
            this.formInfo.data.performance = 0
          }
      }
    },
    // 规则行显示 升至本级所需金币 用
    calSumCost(index) {
      let sum = 0
      for (let i = 1; i < parseInt(index) + 1; i++) {
        sum = sum + parseInt(this.gameUpgradeRuleList[i - 1].upgradeCost)
      }
      return sum
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
      // this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          // const header = this.getHeaderRow(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          // this.generateData({ header, results })
          // this.loading = false
          resolve()
          const ruleList = []
          results.forEach(element => {
            const rule = {}
            let columnNum = 0
            rule['itemId'] = this.itemId
            rule['priceType'] = 2
            for (var p in element) {
              if (columnNum === 0) {
                rule['itemLevel'] = element[p]
              } else if (columnNum === 1) {
                rule['upgradeCost'] = element[p]
              } else if (columnNum === 2) {
                rule['price'] = element[p]
              } else if (columnNum === 3) {
                rule['powers'] = element[p]
              } else if (columnNum === 4) {
                rule['stable'] = element[p]
              } else if (columnNum === 5) {
                rule['control'] = element[p]
              }
              columnNum = columnNum + 1
            }
            rule['performance'] = rule['powers'] + rule['stable'] + rule['control']
            ruleList.push(rule)
          })
          this.gameUpgradeRuleList = ruleList
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    handleDownload() {
      // 组织sheet
      var tHeader1 = ['装备ID', '装备名称', '装备品牌名称', '装备介绍', '装备类型', '装备系列名称', '装备大图', '缩略图片', '装备品牌Logo', '稀有度', '等级', '马力', '稳定', '操控', '性能分', '装备最大等级', '满级价值', '价格类型', '价格', '计量单位名称', '是否赞助', '排序', '状态']
      var filterVal1 = ['id', 'itemName', 'itemBrandName', 'description', 'itemTypeStr', 'itemSeriesName', 'imageUrlStr', 'imageThumbnailUrlStr', 'itemLogoUrlStr', 'rareTypeStr', 'itemLevel', 'powers', 'stable', 'control', 'performance', 'maxLevel', 'maxValue', 'priceTypeStr', 'price', 'unitName', 'sponsorFlagStr', 'sort', 'statusStr']
      var list = []
      this.formInfo.data.rareTypeStr = this.$fn.getDataName({ dataList: this.listTypeInfo.rareTypeList, value: 'itemValue', label: 'itemName', data: this.formInfo.data.rareType })
      this.formInfo.data.itemTypeStr = this.$fn.getDataName({ dataList: this.listTypeInfo.itemTypeList, value: 'itemValue', label: 'itemName', data: this.formInfo.data.itemType })
      this.formInfo.data.priceTypeStr = this.$fn.getDataName({ dataList: this.listTypeInfo.priceTypeList, value: 'itemValue', label: 'itemName', data: this.formInfo.data.priceType })
      this.formInfo.data.sponsorFlagStr = this.$fn.getDataName({ dataList: this.listTypeInfo.sponsorFlagList, value: 'itemValue', label: 'itemName', data: this.formInfo.data.sponsorFlag })
      this.formInfo.data.statusStr = this.$fn.getDataName({ dataList: this.listTypeInfo.statusList, value: 'itemValue', label: 'itemName', data: this.formInfo.data.status })
      if (this.formInfo.data.imageUrl !== '') {
        this.formInfo.data.imageUrlStr = this.$TH.FILE_URLS.static_url + this.formInfo.data.imageUrl
      }
      if (this.formInfo.data.imageThumbnailUrl !== '') {
        this.formInfo.data.imageThumbnailUrlStr = this.$TH.FILE_URLS.static_url + this.formInfo.data.imageThumbnailUrl
      }
      if (this.formInfo.data.itemLogoUrl !== '') {
        this.formInfo.data.itemLogoUrlStr = this.$TH.FILE_URLS.static_url + this.formInfo.data.itemLogoUrl
      }
      list.push(this.formInfo.data)
      const detailData = this.formatJson(filterVal1, list)
      // 组织sheet
      var tHeader2 = ['等级', '本级升级至下级所需金币', '升至本级所需金币', '售卖金币价格', '性能分', '动力', '稳定性', '操控']
      var filterVal2 = ['itemLevel', 'upgradeCost', 'cost', 'price', 'performance', 'powers', 'stable', 'control']
      for (var itemIndex in this.gameUpgradeRuleList) {
        this.gameUpgradeRuleList[itemIndex]['cost'] = this.calSumCost(itemIndex)
      }
      const totalData = this.formatJson(filterVal2, this.gameUpgradeRuleList)
      const result = []
      result.push({
        sheetTitle: '装备基本信息', th: tHeader1, data: detailData
      })
      result.push({
        sheetTitle: '属性信息', th: tHeader2, data: totalData
      })
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel_multisheet(result, '装备详情-' + this.itemId)
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
    }
  }
}
</script>

<style scoped lang="scss">
.app-container {
  .slot-avatar{
    height: 40px;
    display: flex;
    align-items: center;
    img{
      padding-right: 10px;
    }
  }

  .excel-upload-input{
    display: none;
    z-index: -9999;
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

  .el-form-image {
    margin-bottom: 15px;
  }
}
</style>
