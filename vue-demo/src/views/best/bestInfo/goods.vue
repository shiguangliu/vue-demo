<template>
  <div class="app-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane label="基本信息" name="base">
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
            >
              <template v-slot:form-shareImageUrl>
                <div class="slot-avatar">
                  <img
                    v-imgAlart
                    :src="$TH.FILE_URLS.static_url + formInfo.data.shareImageUrl"
                    style="height: 60px;"
                    :onerror="nopicture"
                    :fit="'cover'"
                  >
                  <el-button
                    v-waves
                    type="primary"
                    icon="el-icon-picture"
                    size="mini"
                    @click="handleClick('uploadShareImage')"
                  >
                    {{ formInfo.data.shareImageUrl ? '更换图片' : '选择图片' }}
                  </el-button>
                </div>
              </template>
            </page-form>
          </el-col>
          <el-col :span="12">
            <page-form
              :ref-obj.sync="formInfo.refZoom"
              :data="formInfo.data"
              :field-list="formInfo.fieldZoomList"
              :rules="formInfo.rulesZoom"
              :list-type-info="listTypeInfo"
              :label-width="formInfo.labelWidth"
              :read-only="formInfo.readOnly"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
          </el-col>
        </el-row>
        <el-button v-if="formInfo.data.status == 1" type="primary" icon="el-icon-plus" @click="handleClick('addCase')">新增创意</el-button>
        <el-card v-for="(caseData, cardIndex) in formInfo.data.caseList" :key="cardIndex" class="box-card">
          <div slot="header" class="clearfix">
            <span>创意{{ cardIndex + 1 }}</span>
            <el-button v-if="cardIndex>0 && formInfo.data.status === 1" style="float: right; padding: 3px 0" type="text" @click="handleClick('deleteCase', cardIndex)"><i class="el-icon-delete" /></el-button>
          </div>
          <page-form
            :ref-obj.sync="formInfo.refCase"
            :data="caseData"
            :field-list="formInfo.fieldCaseList"
            :rules="formInfo.rulesCase"
            :label-width="formInfo.labelWidth"
            :read-only="formInfo.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <!-- 自定义插槽-选择图片 -->
            <template v-slot:form-fileLink>
              <div class="slot-avatar">
                <img
                  v-imgAlart
                  :src="$TH.FILE_URLS.static_url + caseData.fileLink"
                  style="height: 60px;"
                  :onerror="nopicture"
                  :fit="'cover'"
                >
                <el-button
                  v-waves
                  type="primary"
                  icon="el-icon-picture"
                  size="mini"
                  @click="handleClick('uploadCase', cardIndex)"
                >
                  {{ caseData.fileLink ? '更换图片' : '选择图片' }}
                </el-button>
              </div>
            </template>
          </page-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="goods">
        <el-row>
          <el-col :span="12">
            <page-form
              :ref-obj.sync="formInfo.refGoods"
              :data="formInfo.data"
              :field-list="formInfo.fieldGoodsList"
              :rules="formInfo.rulesGoods"
              :list-type-info="listTypeInfo"
              :label-width="formInfo.labelWidth"
              :read-only="formInfo.readOnly"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            >
              <!-- 自定义插槽-选择图片 -->
              <template v-slot:form-goodsImageUrl>
                <el-button
                  v-waves
                  type="primary"
                  icon="el-icon-picture"
                  size="mini"
                  @click="handleClick('uploadGoods')"
                >
                  {{ '选择图片' }}
                </el-button>
                <el-row :data="formInfo.data.goodsImageUrl">
                  <el-col v-for="(item, itemIndex) in formInfo.data.goodsImageUrl" :key="item" :span="8" style="padding: 5px;">
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
                        <el-tooltip v-show="formInfo.data.status == 1" effect="dark" content="删除banner" placement="bottom">
                          <i v-if="formInfo.data.status == 1" class="el-icon-delete" style="color: #F56C6C; float:right; cursor: pointer;" @click="handleClick('deleteBanner',itemIndex)" />
                        </el-tooltip>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </template>
              <!-- 自定义插槽-选择图片 -->
              <template v-slot:form-goodsIconUrl>
                <div class="slot-avatar">
                  <img
                    v-imgAlart
                    :src="$TH.FILE_URLS.static_url + formInfo.data.goodsIconUrl"
                    style="height: 60px;"
                    :onerror="nopicture"
                    :fit="'cover'"
                  >
                  <el-button
                    v-waves
                    type="primary"
                    icon="el-icon-picture"
                    size="mini"
                    @click="handleClick('uploadIcon')"
                  >
                    {{ formInfo.data.goodsIconUrl ? '更换图片' : '选择图片' }}
                  </el-button>
                </div>
              </template>
            </page-form>
          </el-col>
          <el-col :span="12">
            <page-form
              :ref-obj.sync="formInfo.refContent"
              :data="formInfo.data"
              :field-list="formInfo.fieldContentList"
              :rules="formInfo.rulesContent"
              :list-type-info="listTypeInfo"
              :label-width="formInfo.labelWidth"
              :read-only="formInfo.readOnly"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            >
              <!-- 自定义插槽-富文本 -->
              <template v-slot:form-goodsContent>
                <Tinymce v-if="formInfo.data.status === 1 " ref="editor" v-model="formInfo.data.goodsContent" :height="400" :width="780" />
                <div v-else class="article-content" v-html="formInfo.data.goodsContent">{{ formInfo.data.goodsContent }}</div>
              </template>
            </page-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="提交信息" name="required">
        <el-transfer v-model="transferValue" :data="transferData" :titles="['字段库', '已选择字段']" />
      </el-tab-pane>
      <el-tab-pane label="申请列表" name="apply">
        <!-- 条件栏 -->
        <page-filter
          :filter-list="tableFilterInfo.list"
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
          :api="applyListApi"
          :query="tableFilterInfo.query"
          :result-set="tableInfo.resultSet"
          :field-list="tableInfo.fieldList"
          :list-type-info="listTypeInfo"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 图片上传弹窗 -->
    <page-dialog
      :title="dialogUpload.title[dialogUpload.type]"
      :visible="dialogUpload.visible"
      :width="dialogUpload.width"
      :bt-loading="dialogUpload.btLoading"
      :bt-list="dialogUpload.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 图片上传组件 -->
      <Upload
        v-if="dialogUpload.type === 'uploadCase' && dialogUpload.visible"
        :upload-data="{targetPath: 'best',autoname: '1'}"
        @handleEvent="handleEvent"
      />
      <Upload
        v-if="dialogUpload.type === 'uploadGoods' && dialogUpload.visible"
        :upload-data="{targetPath: 'goods',autoname: '1'}"
        @handleEvent="handleEvent"
      />
      <Upload
        v-if="dialogUpload.type === 'uploadIcon' && dialogUpload.visible"
        :upload-data="{targetPath: 'goodsIcon',autoname: '1'}"
        @handleEvent="handleEvent"
      />
      <Upload
        v-if="dialogUpload.type === 'uploadShareImage' && dialogUpload.visible"
        :upload-data="{targetPath: 'shareImage',autoname: '1'}"
        @handleEvent="handleEvent"
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { topApi, deleteApi, detailApi, saveApi, submitApi, editApi, offlineApi } from '@/api/best/best'
import { listApi as applyListApi, listAllApi as applyAllListApi } from '@/api/best/apply'
import { getConfigItemsListApi, getMerchantListApi, getBestTagListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import defaultImage from '@/assets/img/no-pic.jpg'
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload'

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
    const checkBestName = (rule, value, callback) => {
      const check = this.$validate({ label: '优选名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkContact = (rule, value, callback) => {
      const check = this.$validate({ label: '客服电话', value, rules: ['notnull', 'mobile'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkMaxTimes = (rule, value, callback) => {
      if (this.formInfo.data.limitType === '1') {
        const check = this.$validate({ label: '投放次数限制', value, rules: ['int', 'notnull', 'length'], conditions: [1, 11] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
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
    const checkWeight = (rule, value, callback) => {
      const check = this.$validate({ label: '权重', value, rules: ['int', 'notnull', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkHitCount = (rule, value, callback) => {
      const check = this.$validate({ label: '浏览量基础数值', value, rules: ['int', 'notnull', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkHitZoom = (rule, value, callback) => {
      const check = this.$validate({ label: '放大数值', value, rules: ['int', 'notnull', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkRepostCount = (rule, value, callback) => {
      const check = this.$validate({ label: '分享量基础数值', value, rules: ['int', 'notnull', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkRepostZoom = (rule, value, callback) => {
      const check = this.$validate({ label: '放大数值', value, rules: ['int', 'notnull', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkApplyCount = (rule, value, callback) => {
      const check = this.$validate({ label: '申请量基础数值', value, rules: ['int', 'notnull', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkApplyZoom = (rule, value, callback) => {
      const check = this.$validate({ label: '放大数值', value, rules: ['int', 'notnull', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkTitle = (rule, value, callback) => {
      const check = this.$validate({ label: '优选显示标题', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkDescription = (rule, value, callback) => {
      const check = this.$validate({ label: '优选描述', value, rules: ['notnull', 'length'], conditions: [1, 500] })
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
    const checkGoodsName = (rule, value, callback) => {
      const check = this.$validate({ label: '商品名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkGuidePriceMin = (rule, value, callback) => {
      const check = this.$validate({ label: '最低厂商指导价', value, rules: ['notnull', 'number', 'length'], conditions: [1, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkGuidePriceMax = (rule, value, callback) => {
      const check = this.$validate({ label: '最高厂商指导价', value, rules: ['notnull', 'number', 'length'], conditions: [1, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        if (parseFloat(this.formInfo.data.guidePriceMax) < parseFloat(this.formInfo.data.guidePriceMin)) {
          callback(new Error('最高厂商指导价不能低于最低厂商指导价'))
        } else {
          callback()
        }
      }
    }
    // 1-单位单价 2-仅价格  3-价格区间 4-自定义 9-无
    const checkPrice = (rule, value, callback) => {
      if (this.formInfo.data.priceStyle === '1' || this.formInfo.data.priceStyle === '2') {
        const check = this.$validate({ label: '价格', value, rules: ['notnull', 'number', 'length'], conditions: [1, 13] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const checkPriceMin = (rule, value, callback) => {
      if (this.formInfo.data.priceStyle === '3') {
        const check = this.$validate({ label: '价格区间最低', value, rules: ['notnull', 'number', 'length'], conditions: [1, 13] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const checkPriceMax = (rule, value, callback) => {
      if (this.formInfo.data.priceStyle === '3') {
        const check = this.$validate({ label: '价格区间最高', value, rules: ['notnull', 'number', 'length'], conditions: [1, 13] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          if (parseFloat(this.formInfo.data.priceMax) < parseFloat(this.formInfo.data.priceMin)) {
            callback(new Error('价格区间最高不能低于价格区间最低'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    const checkPriceText = (rule, value, callback) => {
      if (this.formInfo.data.priceStyle === '4') {
        const check = this.$validate({ label: '自定义显示价格', value, rules: ['notnull', 'length'], conditions: [1, 200] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const checkUnitName = (rule, value, callback) => {
      if (this.formInfo.data.priceStyle === '1') {
        const check = this.$validate({ label: '计量单位名称', value, rules: ['notnull', 'length'], conditions: [1, 20] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const checkGoodsTitle = (rule, value, callback) => {
      const check = this.$validate({ label: '商品显示标题', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkGoodsSubtitle = (rule, value, callback) => {
      const check = this.$validate({ label: '商品显示子标题', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkGoodsDescription = (rule, value, callback) => {
      const check = this.$validate({ label: '商品描述', value, rules: ['notnull', 'length'], conditions: [1, 500] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      applyListApi,
      applyAllListApi,
      detailApi,
      bestId: '',
      bestData: [],
      activeName: 'base',
      downloadLoading: false,
      editLoading: false,
      saveLoading: false,
      limitInput: 'input',
      // 穿梭框 - 提交信息
      transferData: [],
      transferValue: [],
      // 相关列表
      listTypeInfo: {
        merchantList: [], // 商户类型列表
        advFlagList: [],
        statusList: [],
        tagList: [],
        bestRequiredList: [],
        limitTypeList: [],
        priceStyleList: []
      },
      // 过滤相关配置
      filterInfo: {
        query: {
          bestId: this.bestId
        },
        list: []
      },
      tableFilterInfo: {
        query: {
          // bestId: this.bestId
        },
        list: [
          { type: 'button', label: '批量导出', btType: 'success', icon: 'el-icon-download', event: 'batchexport', show: true }
        ]
      },
      // 表单内容
      formInfo: {
        ref: null,
        refGoods: null,
        refCase: null,
        refZoom: null,
        refContent: null,
        readOnly: false,
        data: {
          id: '',
          statusName: '',
          bestName: '',
          objectId: '',
          merchantId: '',
          contact: '',
          status: '',
          advFlag: '',
          tagId: '',
          valid: [],
          validFrom: '',
          validTo: '',
          weight: '',
          hitCount: '',
          hitZoom: '',
          repostCount: '',
          repostZoom: '',
          applyCount: '',
          applyZoom: '',
          limitType: '',
          maxTimes: '',
          caseList: [
            {
              title: '',
              description: '',
              fileLink: '',
              sort: ''
            }
          ],
          articleTitle: '',
          articleSubtitle: '',
          articleImageUrl: '',
          articleContent: '',
          goodsName: '',
          guidePriceMin: '',
          guidePriceMax: '',
          refprice: '',
          priceStyle: '',
          price: '',
          priceMin: '',
          priceMax: '',
          priceText: '',
          unitName: '',
          goodsTitle: '',
          goodsSubtitle: '',
          goodsDescription: '',
          goodsImageUrl: [],
          goodsContent: '',
          goodsIconUrl: '',
          shareImageUrl: ''
        },
        fieldList: [
          { label: '优选ID', value: 'id', type: 'tag' },
          { label: '状态', value: 'statusName', type: 'tag' },
          { label: '优选名称', value: 'bestName', type: 'input', required: true, validator: checkBestName },
          { label: '优选标签', value: 'tagId', type: 'customselect', list: 'tagList', key: 'tagId', name: 'tagName', required: true },
          { label: '所属商户', value: 'merchantId', type: 'customselect', list: 'merchantList', key: 'id', name: 'merchantName', required: true },
          { label: '客服电话', value: 'contact', type: 'input', required: true, validator: checkContact },
          { label: '权重', value: 'weight', type: 'input', required: true, validator: checkWeight },
          { label: '性质', value: 'advFlag', type: 'customselect', list: 'advFlagList', key: 'itemValue', name: 'itemName', required: true },
          { label: '投放限制', value: 'limitType', type: 'radio', list: 'limitTypeList', required: true, event: 'changeLimit' },
          { label: '投放次数限制', value: 'maxTimes', type: 'input', validator: checkMaxTimes },
          { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changedate', required: true, className: 'el-form-block', validator: checkValidFrom },
          { label: '分享缩略图', value: 'shareImageUrl', type: 'slot', className: 'el-form-block', required: true }
        ],
        fieldZoomList: [
          { label: '浏览量基础数值', value: 'hitCount', type: 'input', required: true, validator: checkHitCount },
          { label: '放大数值', value: 'hitZoom', type: 'input', required: true, validator: checkHitZoom },
          { label: '分享量基础数值', value: 'repostCount', type: 'input', required: true, validator: checkRepostCount },
          { label: '放大数值', value: 'repostZoom', type: 'input', required: true, validator: checkRepostZoom },
          { label: '申请量基础数值', value: 'applyCount', type: 'input', required: true, validator: checkApplyCount },
          { label: '放大数值', value: 'applyZoom', type: 'input', required: true, validator: checkApplyZoom }
        ],
        fieldGoodsList: [
          { label: '商品名称', value: 'goodsName', type: 'input', required: true, className: 'el-form-block', validator: checkGoodsName },
          { label: '最低厂商指导价', value: 'guidePriceMin', type: 'input', required: true, className: 'el-form-block-30', validator: checkGuidePriceMin },
          { label: '最高厂商指导价', value: 'guidePriceMax', type: 'input', required: true, className: 'el-form-block-30', validator: checkGuidePriceMax },
          { label: '价格设定', value: 'priceStyle', type: 'radio', list: 'priceStyleList', required: true, className: 'el-form-block-80', event: 'changePriceType' },
          { label: '价格', value: 'price', type: 'input', required: true, className: 'el-form-block-30', validator: checkPrice },
          { label: '价格区间最低', value: 'priceMin', type: 'input', required: true, className: 'el-form-block-30', validator: checkPriceMin },
          { label: '价格区间最高', value: 'priceMax', type: 'input', required: true, className: 'el-form-block-30', validator: checkPriceMax },
          { label: '自定义显示价格', value: 'priceText', type: 'input', required: true, className: 'el-form-block-30', validator: checkPriceText },
          { label: '计量单位名称', value: 'unitName', type: 'input', required: true, validator: checkUnitName },
          { label: '商品显示标题', value: 'goodsTitle', type: 'input', required: true, validator: checkGoodsTitle },
          { label: '商品显示子标题', value: 'goodsSubtitle', type: 'input', required: true, className: 'el-form-block', validator: checkGoodsSubtitle },
          { label: '商品描述', value: 'goodsDescription', type: 'input', required: true, className: 'el-form-block-80', validator: checkGoodsDescription },
          { label: '一路所获缩略图', value: 'goodsIconUrl', type: 'slot', className: 'el-form-block', required: true },
          { label: '详情banner', value: 'goodsImageUrl', type: 'slot', className: 'el-form-block', required: true }
        ],
        fieldContentList: [
          { label: '图文详情', value: 'goodsContent', type: 'slot', className: 'el-form-block', required: true }
        ],
        fieldCaseList: [
          { label: '列表标题', value: 'title', type: 'input', className: 'el-form-block-100', required: true, validator: checkTitle },
          { label: '文字描述', value: 'description', type: 'input', className: 'el-form-block-100', required: true, validator: checkDescription },
          { label: '排序', value: 'sort', type: 'input', className: 'el-form-block', required: true, validator: checkSort },
          { label: '列表图片', value: 'fileLink', type: 'slot', className: 'el-form-block', required: true }
        ],
        rules: {},
        rulesGoods: {},
        rulesCase: {},
        rulesZoom: {},
        rulesContent: {},
        labelWidth: '120px'
      },
      // 表格相关
      tableInfo: {
        tableIndex: false, // 显示序号
        checkBox: false,
        refresh: 1,
        initCurpage: 1,
        data: [],
        resultSet: '', // Api返回的结果集字段名，如:res.data.userlist,则 resultSet 为：userlist
        fieldList: [
          { label: '申请编号', value: 'applyNo' },
          { label: '优选类型', value: 'goodsTypeName' },
          { label: '优选名称', value: 'bestName' },
          { label: '所属商户', value: 'merchantName' },
          { label: '申请时间', value: 'applyTimeShow', width: 150 },
          { label: '申请人姓名', value: 'applyName', width: 150 },
          { label: '联系方式', value: 'phone' },
          { label: '性别', value: 'genderName', width: 80 },
          { label: '城市', value: 'cityName', width: 80 },
          { label: '用车时间(看车)', value: 'reservedTime', width: 150 },
          { label: '备注', value: 'remarks' }
        ]
      },
      // 图片上传弹窗相关
      dialogUpload: {
        title: {
          uploadCase: '列表图片上传',
          uploadArticle: '详情banner上传',
          uploadIcon: '缩略图上传',
          uploadShareImage: '分享缩略图上传'
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
    }
  },
  created() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
    this.bestId = this.$route.query.bestId
    this.getBest()
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
      this.$initDataPermits('bestArticle', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      const formInfo = this.formInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
      formInfo.rulesGoods = this.$initRules(formInfo.fieldGoodsList)
      formInfo.rulesCase = this.$initRules(formInfo.fieldCaseList)
      formInfo.rulesZoom = this.$initRules(formInfo.fieldZoomList)
      formInfo.rulesContent = this.$initRules(formInfo.fieldContentList)
    },
    initButtonList(status) {
      // 1:编辑中 2:启用 3:不启用
      status = status + ''
      if (status === '1') {
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: true, float: 'left' },
          { type: 'button', label: '启用', btType: 'primary', icon: 'el-icon-open', loading: 'submitLoading', event: 'submit', show: true, float: 'left' },
          { type: 'button', label: '置顶', btType: 'primary', icon: 'el-icon-plus', loading: 'setopLoading', event: 'setop', show: true, float: 'left' },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: true, float: 'right' }
        ]
        this.transferData.forEach(element => {
          element.disabled = false
        })
      } else if (status === '2') {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: true, float: 'left' },
          { type: 'button', label: '停用', btType: 'primary', icon: 'el-icon-turn-off', loading: 'stopLoading', event: 'stop', show: true, float: 'left' },
          { type: 'button', label: '置顶', btType: 'primary', icon: 'el-icon-plus', loading: 'setopLoading', event: 'setop', show: true, float: 'left' },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: true, float: 'right' }
        ]
        this.transferData.forEach(element => {
          element.disabled = true
        })
      } else if (status === '3') {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: true, float: 'left' },
          { type: 'button', label: '启用', btType: 'primary', icon: 'el-icon-open', loading: 'stopLoading', event: 'submit', show: true, float: 'left' },
          { type: 'button', label: '置顶', btType: 'primary', icon: 'el-icon-plus', loading: 'setopLoading', event: 'setop', show: true, float: 'left' },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: true, float: 'right' }
        ]
        this.transferData.forEach(element => {
          element.disabled = true
        })
      } else {
        this.filterInfo.list = [
        ]
        this.transferData.forEach(element => {
          element.disabled = true
        })
      }
      this.initDataPermits()
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'BEST_ADV_FLAG' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.advFlagList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_LIMIT_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.limitTypeList = []
          res.data.forEach(element => {
            var limitType = { key: element.itemValue, name: element.itemName }
            this.listTypeInfo.limitTypeList.push(limitType)
          })
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_PRICE_STYLE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.priceStyleList = []
          res.data.forEach(element => {
            var row = { key: element.itemValue, name: element.itemName }
            this.listTypeInfo.priceStyleList.push(row)
          })
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'BEST_REQUIRED_INFO' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.bestRequiredList = res.data
          this.transferData = []
          this.listTypeInfo.bestRequiredList.forEach(element => {
            this.transferData.push({
              key: element.itemValue,
              label: element.itemName,
              disabled: this.formInfo.data.status !== 1
            })
          })
        }
      })
      this.$handleAPI('', getBestTagListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.tagList = res.data.list
        }
      })
    },
    // 获取优选
    getBest() {
      const params = { bestId: this.bestId }
      const self = this
      this.$handleAPI('', detailApi, params).then(res => {
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
      self.bestData = resData
      self.formInfo.data.id = resData.id
      self.formInfo.data.bestName = resData.bestName
      self.formInfo.data.objectId = resData.objectId
      self.formInfo.data.merchantId = resData.goods.merchantId === 0 ? '' : resData.goods.merchantId
      self.formInfo.data.contact = resData.goods.contact
      self.formInfo.data.advFlag = resData.advFlag + ''
      self.formInfo.data.tagId = resData.tagId === 0 ? '' : resData.tagId
      self.formInfo.data.validFrom = resData.validFrom == null ? '' : resData.validFrom
      self.formInfo.data.validTo = resData.validTo == null ? '' : resData.validTo
      self.formInfo.data.valid = [self.formInfo.data.validFrom, self.formInfo.data.validTo]
      self.formInfo.data.weight = resData.weight
      self.formInfo.data.hitCount = resData.hitCount
      self.formInfo.data.hitZoom = resData.hitZoom
      self.formInfo.data.repostCount = resData.repostCount
      self.formInfo.data.repostZoom = resData.repostZoom
      self.formInfo.data.applyCount = resData.applyCount
      self.formInfo.data.applyZoom = resData.applyZoom
      self.formInfo.data.shareImageUrl = resData.shareImageUrl
      self.formInfo.data.limitType = resData.limitType + ''
      self.formInfo.data.maxTimes = resData.maxTimes === 0 ? '' : resData.maxTimes
      self.formInfo.data.status = resData.status
      if (this.listTypeInfo.statusList.length > 0) {
        self.formInfo.data.statusName = this.$fn.getDataName({ dataList: this.listTypeInfo.statusList, value: 'itemValue', label: 'itemName', data: resData.status + '' })
      } else {
        this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
          if (res.code === 200) {
            this.listTypeInfo.statusList = res.data
          }
          this.formInfo.data.statusName = this.$fn.getDataName({ dataList: this.listTypeInfo.statusList, value: 'itemValue', label: 'itemName', data: this.formInfo.data.status + '' })
        })
      }
      self.formInfo.data.updateTime = resData.updateTime
      self.formInfo.data.goodsName = resData.goods.goodsName
      self.formInfo.data.guidePriceMin = resData.goods.guidePriceMin
      self.formInfo.data.guidePriceMax = resData.goods.guidePriceMax
      self.formInfo.data.refprice = resData.goods.refprice
      self.formInfo.data.priceStyle = resData.goods.priceStyle === 0 ? '' : resData.goods.priceStyle + ''
      self.formInfo.data.price = resData.goods.price
      self.formInfo.data.priceMin = resData.goods.priceMin
      self.formInfo.data.priceMax = resData.goods.priceMax
      self.formInfo.data.priceText = resData.goods.priceText
      self.formInfo.data.unitName = resData.goods.unitName
      self.formInfo.data.goodsTitle = resData.goods.title
      self.formInfo.data.goodsSubtitle = resData.goods.subtitle
      self.formInfo.data.goodsDescription = resData.goods.description
      self.formInfo.data.goodsContent = resData.goods.content
      self.formInfo.data.goodsIconUrl = resData.goods.iconUrl ? resData.goods.iconUrl : ''

      if (resData.caseList.length > 0) {
        self.formInfo.data.caseList = []
        resData.caseList.forEach(element => {
          var caseTmp = { title: element.title, description: element.description, fileLink: element.fileLink, sort: element.sort }
          self.formInfo.data.caseList.push(caseTmp)
        })
      }
      if (resData.goods.materialList.length > 0) {
        self.formInfo.data.goodsImageUrl = []
        resData.goods.materialList.forEach(element => {
          var fileLink = element.fileLink
          self.formInfo.data.goodsImageUrl.push(fileLink)
        })
      }
      var requiredInfo = resData.requiredInfo
      self.transferValue = requiredInfo === '' ? [] : requiredInfo.split(',')
      this.handleEvent('changeLimit', '')
      this.handleEvent('changePriceType', '')
    },
    // 获取列表
    getList() {
      this.tableFilterInfo.query.bestId = this.bestId
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
      const dialogUpload = this.dialogUpload
      switch (event) {
        case 'addCase': // 增加创意
          if (this.formInfo.data.caseList.length < 3) {
            var caseTmp = { title: '', description: '', fileLink: '', sort: '' }
            this.formInfo.data.caseList.push(caseTmp)
          } else {
            this.$message({
              showClose: true,
              message: '最多只能创建3个创意',
              type: 'error',
              duration: 3500
            })
          }
          break
        case 'deleteCase': // 删除创意
          this.$confirm('确定要删除这个创意吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.formInfo.data.caseList.splice(data, 1)
          })
          break
        case 'uploadGoods': // 上传图片
          dialogUpload.visible = true
          dialogUpload.type = event
          break
        case 'uploadCase': // 上传图片 创意
          dialogUpload.visible = true
          dialogUpload.type = event
          dialogUpload.num = data
          break
        case 'uploadIcon': // 上传图片 一路所获图标
          dialogUpload.visible = true
          dialogUpload.type = event
          break
        case 'uploadShareImage': // 上传图片 分享缩略图
          dialogUpload.visible = true
          dialogUpload.type = event
          break
        case 'deleteBanner': // 删除商品banner
          this.formInfo.data.goodsImageUrl.splice(data, 1)
          this.$message.success('删除成功')
          break
        case 'submit' : // 提交
        case 'save': { // 保存
          if (this.formInfo.data.status === 1) {
            var flag = true
            this.formInfo.ref.validate(valid => {
              if (!valid) {
                flag = false
              }
            })
            this.formInfo.refGoods.validate(valid => {
              if (!valid) {
                flag = false
              }
            })
            this.formInfo.refCase.validate(valid => {
              if (!valid) {
                flag = false
              }
            })
            this.formInfo.refZoom.validate(valid => {
              if (!valid) {
                flag = false
              }
            })
            this.formInfo.refContent.validate(valid => {
              if (!valid) {
                flag = false
              }
            })
            if (!flag) {
              this.$message({
                showClose: true,
                message: '请检查所有必输项目',
                type: 'error',
                duration: 3500
              })
              break
            }
          }
          if (this.transferValue.length === 0) {
            this.$message({
              showClose: true,
              message: '提交信息必须输入',
              type: 'error',
              duration: 3500
            })
            break
          }
          var confirmStr = '保存'
          if (event === 'submit') {
            confirmStr = '启用'
          }
          this.$confirm('确定要' + confirmStr + '吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.formInfo.data.status === 1) {
              var imgList = []
              this.formInfo.data.goodsImageUrl.forEach(element => {
                imgList.push(element)
              })
              var priceStyle = this.formInfo.data.priceStyle
              var price = 0
              var unitName = ''
              var priceMin = 0
              var priceMax = 0
              var priceText = ''
              if (priceStyle === '1' || priceStyle === '2') {
                price = this.formInfo.data.price
              }
              if (priceStyle === '1') {
                unitName = this.formInfo.data.unitName
              }
              if (priceStyle === '3') {
                priceMin = this.formInfo.data.priceMin
                priceMax = this.formInfo.data.priceMax
              }
              if (priceStyle === '4') {
                priceText = this.formInfo.data.priceText
              }
              const goodsData = {
                id: this.bestData.goods.id,
                goodsName: this.formInfo.data.goodsName,
                merchantId: this.formInfo.data.merchantId,
                priceStyle: priceStyle,
                price: price,
                priceMin: priceMin,
                priceMax: priceMax,
                priceText: priceText,
                unitName: unitName,
                guidePriceMin: this.formInfo.data.guidePriceMin,
                guidePriceMax: this.formInfo.data.guidePriceMax,
                imageUrl: this.formInfo.data.goodsImageUrl[0],
                title: this.formInfo.data.goodsTitle,
                subtitle: this.formInfo.data.goodsSubtitle,
                description: this.formInfo.data.goodsDescription,
                contact: this.formInfo.data.contact,
                content: this.formInfo.data.goodsContent,
                fileLinkList: imgList,
                iconUrl: this.formInfo.data.goodsIconUrl
              }
              const caseListData = []
              let caseId = 1
              this.formInfo.data.caseList.forEach(element => {
                var caseDt = {
                  bestId: this.bestId,
                  caseId: caseId,
                  title: element.title,
                  description: element.description,
                  fileLink: element.fileLink,
                  sort: element.sort
                }
                caseListData.push(caseDt)
                caseId = caseId + 1
              })
              const param = {
                oldUpdateTime: this.bestData.updateTime,
                updateBy: this.staffId,
                id: this.bestId,
                bestName: this.formInfo.data.bestName,
                objectId: this.formInfo.data.objectId,
                objectType: 1,
                advFlag: this.formInfo.data.advFlag,
                tagId: this.formInfo.data.tagId,
                validFrom: this.formInfo.data.validFrom,
                validTo: this.formInfo.data.validTo,
                weight: this.formInfo.data.weight,
                hitCount: this.formInfo.data.hitCount,
                hitZoom: this.formInfo.data.hitZoom,
                repostCount: this.formInfo.data.repostCount,
                repostZoom: this.formInfo.data.repostZoom,
                applyCount: this.formInfo.data.applyCount,
                applyZoom: this.formInfo.data.applyZoom,
                limitType: this.formInfo.data.limitType,
                maxTimes: this.formInfo.data.limitType === '1' ? this.formInfo.data.maxTimes : 0,
                requiredInfo: this.transferValue.join(','),
                shareImageUrl: this.formInfo.data.shareImageUrl,
                caseList: caseListData,
                goods: goodsData
              }
              this.$handleAPI('', saveApi, param).then(res => {
                if (res.code === 200) {
                  if (event === 'save') {
                    this.$message.success('保存成功')
                    this.arrangeData(this, res.data)
                  } else {
                    this.arrangeData(this, res.data)
                    const submitParam = {
                      userId: this.staffId,
                      bestId: res.data.id,
                      objectType: 1,
                      objectId: res.data.objectId,
                      oldUpdateTime: res.data.updateTime
                    }
                    this.$handleAPI('', submitApi, submitParam).then(submitRes => {
                      if (submitRes.code === 200) {
                        this.$message.success('启用成功')
                        this.arrangeData(this, submitRes.data)
                      } else {
                        this.$message({
                          showClose: true,
                          message: submitRes.message,
                          type: 'error',
                          duration: 3500
                        })
                      }
                    })
                  }
                } else {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error',
                    duration: 3500
                  })
                }
              })
            } else {
              const submitParam = {
                userId: this.staffId,
                bestId: this.bestId,
                objectType: 2,
                objectId: this.formInfo.data.objectId,
                oldUpdateTime: this.bestData.updateTime
              }
              this.$handleAPI('', submitApi, submitParam).then(submitRes => {
                if (submitRes.code === 200) {
                  this.$message.success('启用成功')
                  this.arrangeData(this, submitRes.data)
                } else {
                  this.$message({
                    showClose: true,
                    message: submitRes.message,
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
          break
        }
        case 'stop' : { // 停用
          this.$confirm('确定要停用吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const submitParam = {
              userId: this.staffId,
              bestId: this.bestId,
              objectType: 1,
              objectId: this.formInfo.data.objectId,
              oldUpdateTime: this.bestData.updateTime
            }
            this.$handleAPI('', offlineApi, submitParam).then(res => {
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
            const submitParam = {
              userId: this.staffId,
              bestId: this.bestId,
              objectType: 1,
              objectId: this.formInfo.data.objectId,
              oldUpdateTime: this.bestData.updateTime
            }
            this.$handleAPI('', editApi, submitParam).then(res => {
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
        case 'setop' : { // 置顶
          const self = this
          this.$confirm('确定要置顶吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var idArr = []
            idArr.push(this.bestId)
            const params = {
              'ids': idArr,
              'userId': self.staffId
            }
            this.$handleAPI('', topApi, params).then(res => {
              if (res.code === 200) {
                this.$message.success('置顶成功')
                this.getBest()
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
              message: '已取消置顶'
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
            var idArr = []
            idArr.push(this.bestId)
            const params = {
              'ids': idArr,
              'userId': self.staffId
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
        case 'batchexport': // 批量导出
          this.$handleAPI('', applyAllListApi, this.tableFilterInfo.query).then(
            res => {
              if (res.code === 200) {
                this.handleDownload(res.data.list)
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
          if (!data) return
          data.forEach(item => {
            this.$set(item, 'deleteLoading', false)
          })
          break
        case 'upload': { // 上传成功，绑定图片链接到id
          if (data.code !== 200) return
          if (this.dialogUpload.type === 'uploadCase') {
            this.formInfo.data.caseList[this.dialogUpload.num].fileLink = data.fileList[0].relativeUrl
          } else if (this.dialogUpload.type === 'uploadGoods') {
            data.fileList.forEach(element => {
              this.formInfo.data.goodsImageUrl.push(element.relativeUrl)
            })
          } else if (this.dialogUpload.type === 'uploadIcon') {
            this.formInfo.data.goodsIconUrl = data.fileList[0].relativeUrl
          } else if (this.dialogUpload.type === 'uploadShareImage') {
            this.formInfo.data.shareImageUrl = data.fileList[0].relativeUrl
          }
          // 关闭弹窗
          this.handleClick('closeUpload')
          break
        }
        case 'changeLimit': // 修改投放限制
          this.formInfo.fieldList.forEach(element => {
            if (element.value === 'maxTimes') {
              if (this.formInfo.data.limitType === '1') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
              }
            }
          })
          break
        case 'changePriceType': // 修改价格设定 1-单位单价 2-仅价格  3-价格区间 4-自定义 9-无
          var priceType = this.formInfo.data.priceStyle
          this.formInfo.fieldGoodsList.forEach(element => {
            if (element.value === 'price') {
              if (priceType === '1' || priceType === '2') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
              }
            }
            if (element.value === 'priceMin') {
              if (priceType === '3') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
              }
            }
            if (element.value === 'priceMax') {
              if (priceType === '3') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
              }
            }
            if (element.value === 'priceText') {
              if (priceType === '4') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
              }
            }
            if (element.value === 'unitName') {
              if (priceType === '1') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
              }
            }
          })
          break
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
}

.imgdiv {
  height: 100px;
  overflow: hidden;
}

.image {
  width: 100%;
  display: block;
}

.box-card {
  width: 600px;
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
</style>
