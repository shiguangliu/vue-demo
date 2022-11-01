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
      <el-tab-pane label="基本信息" name="tab1">
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
            <el-col :span="12">
              <page-form
                :ref-obj.sync="formInfo2.ref"
                :data="formInfo2.data"
                :field-list="formInfo2.fieldList"
                :rules="formInfo2.rules"
                :label-width="formInfo2.labelWidth"
                :list-type-info="listTypeInfo"
                :read-only="formInfo2.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              >
                <template v-slot:form-fileLink>
                  <div class="slot-video">
                    <video
                      :src="$TH.FILE_URLS.static_url + formInfo2.data.fileLink"
                      controls="controls"
                    />
                    <br>
                    <el-button
                      v-if="formInfo.data.status=='1'"
                      v-waves
                      type="primary"
                      icon="el-icon-picture"
                      size="mini"
                      @click="handleClick('uploadVideo')"
                    >
                      {{ '选择视频' }}
                    </el-button>
                  </div>
                </template>
              </page-form>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>关联H5设置</span>
          </div>
          <template>
            <div>
              <el-button
                v-if="formInfo.data.status=='1'"
                v-waves
                type="primary"
                icon="el-icon-plus"
                size="mini"
                :disabled="H5List.length > 0"
                @click="handleClick('relationH5')"
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
                label="操作"
                align="center"
                width="150"
              >
                <el-button
                  v-if="formInfo.data.status=='1'"
                  v-waves
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="handleClick('daleteH5')"
                >
                  {{ '删除' }}
                </el-button>
              </el-table-column>
            </el-table>
          </template>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>投放人群限定</span>
          </div>
          <page-form
            :ref-obj.sync="formInfo1.ref"
            :data="formInfo1.data"
            :field-list="formInfo1.fieldList"
            :rules="formInfo1.rules"
            :label-width="formInfo1.labelWidth"
            :list-type-info="listTypeInfo"
            :read-only="formInfo1.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <!-- 自定义插槽显示状态 -->
            <template v-slot:form-itemList>
              <div class="slot-avatar">
                <template v-if="formInfo.data.status=='1'">
                  <el-tag
                    v-for="tag in formInfo1.data.itemArr"
                    :key="tag"
                    size="medium"
                    closable
                    :disable-transitions="false"
                    @close="handleClose('closecity', tag)"
                  >
                    {{ getGameItem(tag) }}
                  </el-tag>
                </template>
                <template v-else>
                  <el-tag
                    v-for="tag in formInfo1.data.itemArr"
                    :key="tag"
                    size="medium"
                    :disable-transitions="false"
                    @close="handleClose('closecity', tag)"
                  >
                    {{ getGameItem(tag) }}
                  </el-tag>
                </template>
                <el-button v-if="formInfo.data.status=='1'" class="button-new-tag" size="small" @click="handleClick('addcity', '')">+</el-button>
              </div>
            </template>
            <!-- 自定义插槽显示状态 -->
            <template v-slot:form-areaList>
              <div class="slot-avatar">
                <template v-if="formInfo.data.status=='1'">
                  <el-tag
                    v-for="tag in formInfo1.data.areaArr"
                    :key="tag"
                    size="medium"
                    closable
                    :disable-transitions="false"
                    @close="handleClose('closeArea', tag)"
                  >
                    {{ getArea(tag) }}
                  </el-tag>
                </template>
                <template v-else>
                  <el-tag
                    v-for="tag in formInfo1.data.areaArr"
                    :key="tag"
                    size="medium"
                    :disable-transitions="false"
                    @close="handleClose('closeArea', tag)"
                  >
                    {{ getArea(tag) }}
                  </el-tag>
                </template>
                <el-button v-if="formInfo.data.status=='1'" class="button-new-tag" size="small" @click="handleClick('addArea', '')">+</el-button>
              </div>
            </template>
            <!-- 自定义插槽显示状态 -->
            <template v-slot:form-hobbyList>
              <div class="slot-avatar">
                <template v-if="formInfo.data.status=='1'">
                  <el-tag
                    v-for="tag in formInfo1.data.tagArr"
                    :key="tag"
                    size="medium"
                    closable
                    :disable-transitions="false"
                    @close="handleClose('closeTag', tag)"
                  >
                    {{ getTag(tag) }}
                  </el-tag>
                </template>
                <template v-else>
                  <el-tag
                    v-for="tag in formInfo1.data.tagArr"
                    :key="tag"
                    size="medium"
                    :disable-transitions="false"
                    @close="handleClose('closeTag', tag)"
                  >
                    {{ getTag(tag) }}
                  </el-tag>
                </template>
                <el-button v-if="formInfo.data.status=='1'" class="button-new-tag" size="small" @click="handleClick('addTag', '')">+</el-button>
              </div>
            </template>
            <!-- 自定义插槽显示状态 -->
            <template v-slot:form-brandList>
              <div class="slot-avatar">
                <template v-if="formInfo.data.status=='1'">
                  <el-tag
                    v-for="tag in formInfo1.data.brandArr"
                    :key="tag"
                    size="medium"
                    closable
                    :disable-transitions="false"
                    @close="handleClose('closeBrand', tag)"
                  >
                    {{ getBrand(tag) }}
                  </el-tag>
                </template>
                <template v-else>
                  <el-tag
                    v-for="tag in formInfo1.data.brandArr"
                    :key="tag"
                    size="medium"
                    :disable-transitions="false"
                    @close="handleClose('closeBrand', tag)"
                  >
                    {{ getBrand(tag) }}
                  </el-tag>
                </template>
                <el-button v-if="formInfo.data.status=='1'" class="button-new-tag" size="small" @click="handleClick('addBread', '')">+</el-button>
              </div>
            </template>
          </page-form>
        </el-card>
        <!-- 图片上传弹窗 -->
        <page-dialog
          :title="dialogUpload.title[dialogUpload.type]"
          :visible="dialogUpload.type === 'uploadVideo' && dialogUpload.visible"
          :width="dialogUpload.width"
          :bt-loading="dialogUpload.btLoading"
          :bt-list="dialogUpload.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 图片上传组件 -->
          <Upload
            v-if="dialogUpload.type === 'uploadVideo' && dialogUpload.visible"
            :upload-data="{targetPath: 'ad-h5',autoname: '1'}"
            :upload-type="'file'"
            @handleEvent="handleEvent"
          />
        </page-dialog>
        <page-dialog
          :title="dialogGameItem.title"
          :visible.sync="dialogGameItem.visible"
          :width="dialogGameItem.width"
          :bt-loading="dialogGameItem.btLoading"
          :bt-list="dialogGameItem.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <PopGameItem :custom-query="{ diff: 1 }" @pickItem="pickItem" />
        </page-dialog>
        <page-dialog
          :title="dialogArea.title"
          :visible.sync="dialogArea.visible"
          :width="dialogArea.width"
          :bt-loading="dialogArea.btLoading"
          :bt-list="dialogArea.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <PopArea :custom-query="{ diff: 1 }" @pickItem="pickArea" />
        </page-dialog>
        <page-dialog
          :title="dialogBrand.title"
          :visible.sync="dialogBrand.visible"
          :width="dialogBrand.width"
          :bt-loading="dialogBrand.btLoading"
          :bt-list="dialogBrand.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <PopBrand :custom-query="{ diff: 1 }" @pickItem="pickBrand" />
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
          <PopH5 v-if="dialogH5.visible" :custom-query="{ diff: 1, validFrom: formInfo.data.validFrom, validTo: formInfo.data.validTo }" @pickItem="pickH5" />
        </page-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInfoApi, updateStatusApi, updateApi } from '@/api/ad/pop/detail'
import { daleteApi } from '@/api/ad/pop/index'
import { getConfigItemsListApi, getMerchantListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import Upload from '@/components/Upload'
import defaultImage from '@/assets/img/no-pic.jpg'
import PopGameItem from '@/components/Popup/PopGameItem'
import PopArea from '@/components/Popup/PopArea'
import PopBrand from '@/components/Popup/PopBrand'
import PopH5 from '@/components/Popup/PopH5'

export default {
  components: {
    PageFilter,
    PageForm,
    PageDialog,
    Upload,
    PopGameItem,
    PopArea,
    PopBrand,
    PopH5
  },
  data() {
    const checkValiddate = (rule, value, callback) => {
      var msg = ''
      if (value !== undefined && value !== null) {
        if (value.length >= 2) {
          if (value[1] !== null) {
            if (this.$fn.switchTime(value[1], 'YYYY-MM-DD') < this.$fn.switchTime(value[0], 'YYYY-MM-DD')) {
              msg = '有效截止时间必须大于等于今天'
            }
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
    const checkMaxTimes = (rule, value, callback) => {
      const check = this.$validate({ label: '限制数值', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
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
    const checkDuration = (rule, value, callback) => {
      if (value === '') {
        this.formInfo.data.duration = 0
      } else {
        const check = this.$validate({ label: '跳过时长', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      }
    }
    const checkValidTime = (rule, value, callback) => {
      var msg = ''
      if (value !== undefined && value !== null) {
        if (value.length >= 2) {
          if (value[1] !== null) {
            if (this.$fn.switchTime(value[1], 'hh:mm') <= this.$fn.switchTime(value[0], 'hh:mm')) {
              msg = '展示时段结束时间分钟数必须大于开始时间分钟数'
            }
          }
        }
      } else {
        msg = '请输入有效时段'
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    return {
      getInfoApi,
      activeName: 'tab1',
      readOnly: false,
      listTypeInfo: {
        merchantList: [],
        statusList: [],
        limitTypeList: [],
        limitGenderList: [],
        gameItemList: [],
        areaList: [],
        tagList: [],
        brandList: []
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
          title: '',
          merchantId: '',
          validFrom: '',
          validTo: '',
          valid: [],
          validTime: [new Date(), new Date()],
          timeFrom: '',
          timeTo: '',
          limitType: '',
          maxTimes: '',
          status: '',
          duration: '',
          adSort: '',
          jumpH5Id: '',
          jumpType: ''
        },
        fieldList: [
          { label: '闪屏广告ID', value: 'id', type: 'tag' },
          { label: '闪屏广告名称', value: 'title', type: 'input', required: true, className: 'el-form-block', maxlength: 200 },
          { label: '所属商户', value: 'merchantId', type: 'customselect', list: 'merchantList', key: 'id', name: 'merchantName', required: true },
          { label: '展示日期', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changedate', required: true, className: 'el-form-block', validator: checkValiddate },
          { label: '展示时段', value: 'validTime', type: 'timerange', event: 'changeTime', required: true, className: 'el-form-block', validator: checkValidTime },
          { label: '跳过时长', value: 'duration', type: 'input', className: 'el-form-block', validator: checkDuration },
          { label: '排序', value: 'adSort', type: 'input', className: 'el-form-block', validator: checkAdSort },
          { label: '投放限制', value: 'limitType', type: 'customradio', list: 'limitTypeList', key: 'itemValue', name: 'itemName', event: 'changeLimitType' },
          { label: '限制数值', value: 'maxTimes', type: 'input', validator: checkMaxTimes },
          { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', className: 'el-form-block' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 表单相关（追加、修改）
      formInfo1: {
        ref: null,
        data: {
          limitGender: '', // *唯一ID
          itemList: '',
          itemArr: [],
          areaFromList: '',
          areaArr: [],
          tagFromList: '',
          tagArr: [],
          brandFromlist: '',
          brandArr: []
        },
        fieldList: [
          { label: '性别', value: 'limitGender', type: 'customradio', list: 'limitGenderList', key: 'itemValue', name: 'itemName', required: true },
          { label: '地域', value: 'areaList', type: 'slot', className: 'el-form-block' },
          { label: '兴趣标签', value: 'hobbyList', type: 'slot', className: 'el-form-block' },
          { label: '虚拟装备', value: 'itemList', type: 'slot', className: 'el-form-block' },
          { label: '车辆品牌', value: 'brandList', type: 'slot', className: 'el-form-block' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      formInfo2: {
        ref: null,
        data: {
          fileLink: '', // *唯一ID
          fileType: ''
        },
        fieldList: [
          { label: '动效上传', value: 'fileLink', type: 'slot', className: 'el-form-block', required: true }
        ],
        rules: {},
        labelWidth: '120px'
      },
      H5List: [],
      dialogH5: {
        title: '选择H5',
        visible: false,
        btLoading: false
      },
      // 选择装备
      dialogGameItem: {
        title: '选择装备',
        visible: false,
        btLoading: false
      },
      dialogArea: {
        title: '选择地区',
        visible: false,
        btLoading: false
      },
      dialogTag: {
        title: '选择兴趣爱好',
        visible: false,
        btLoading: false
      },
      dialogBrand: {
        title: '选择兴趣爱好',
        visible: false,
        btLoading: false
      },
      // 图片上传弹窗相关
      dialogUpload: {
        title: {
          uploadVideo: '动效上传'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', btType: 'primary', type: 'button', icon: 'el-icon-close', event: 'closeUpload', show: true }
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
      this.$initDataPermits('adFlashDetail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
    //  下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_SKU_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_LIMIT_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.limitTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENDER_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.limitGenderList = res.data
          var params = {
            'itemCode': 'GENDER_TYPE_MALE',
            'itemValue': '0',
            'itemName': '不限'
          }
          this.listTypeInfo.limitGenderList.push(params)
        }
      })
      this.$handleAPI('', getMerchantListApi, '').then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    getGameItem(areaid) {
      var name = ' '
      try {
        var city = this.listTypeInfo.gameItemList.find((item) => item.itemId === areaid) // 只能放回满足条件的第一个元素
        if (city) {
          name = city.gameItemName + ' '
        }
      } catch (e) {
        // continue regardless of error
      }
      return name
    },
    getArea(areaid) {
      var name = ' '
      try {
        var area = this.listTypeInfo.areaList.find((item) => item.areaId === areaid) // 只能放回满足条件的第一个元素
        if (area) {
          name = area.areaName + ' '
        }
      } catch (e) {
        // continue regardless of error
      }
      return name
    },
    getTag(areaid) {
      var name = ' '
      try {
        var tag = this.listTypeInfo.tagList.find((item) => item.tagId === areaid) // 只能放回满足条件的第一个元素
        if (tag) {
          name = tag.tagName + ' '
        }
      } catch (e) {
        // continue regardless of error
      }
      return name
    },
    getBrand(areaid) {
      var name = ' '
      try {
        var brand = this.listTypeInfo.brandList.find((item) => item.id === areaid) // 只能放回满足条件的第一个元素
        if (brand) {
          name = brand.brandName + ' '
        }
      } catch (e) {
        // continue regardless of error
      }
      return name
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      // 获取url参数
      this.formInfo.data.id = this.$route.query.id
      // 获取协议详细
      const param = { 'id': this.formInfo.data.id }
      this.$handleAPI('', getInfoApi, param).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          const data = res.data
          data.status += ''
          data.issueType += ''
          data.limitType += ''
          data.limitGender += ''
          if (data.duration === null) {
            data.duration = '0'
          }
          this.listTypeInfo.gameItemList = res.data.gameItemList
          this.listTypeInfo.areaList = res.data.sysAreaDtoList
          this.listTypeInfo.tagList = res.data.sysTagResultDtoList
          this.listTypeInfo.brandList = res.data.adminFzCarBrandDtoList
          // 显示信息
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = data[key]
              if (key === 'merchantId' && data[key] === 0) {
                this.formInfo.data[key] = ''
              }
              if (key === 'validFrom' && data['validFrom'] !== '0000-00-00 00:00:00' && data['validFrom'] !== null) {
                this.formInfo.data.valid = [data['validFrom'], data['validTo']]
              }
              if (key === 'timeFrom' && data['timeFrom'] !== '' && data['timeFrom'] !== null) {
                var timeFrom = new Date('2020-01-01 ' + data['timeFrom'])
                var timeTo = new Date('2020-01-01 ' + data['timeTo'])
                this.formInfo.data.validTime = [timeFrom, timeTo]
              }
            }
            if (key in this.formInfo1.data) {
              this.formInfo1.data[key] = data[key]
            }
            if (key in this.formInfo2.data) {
              this.formInfo2.data[key] = data[key]
            }
          }
          this.formInfo.fieldList.forEach(element => {
            if (element.value === 'maxTimes') {
              if (this.formInfo.data.limitType === '1') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
                this.formInfo.data.maxTimes = 0
              }
            }
          })
          this.formInfo1.data.itemList = res.data.itemIds
          if (this.formInfo1.data.itemList === '') {
            this.formInfo1.data.itemArr = []
          } else {
            this.formInfo1.data.itemArr = res.data.itemIds
          }
          this.formInfo1.data.areaFromList = res.data.limitAreaIds
          if (this.formInfo1.data.areaFromList === '') {
            this.formInfo1.data.areaArr = []
          } else {
            this.formInfo1.data.areaArr = res.data.limitAreaIds
          }
          this.formInfo1.data.tagFromList = res.data.limitTagIds
          if (this.formInfo1.data.tagFromList === '') {
            this.formInfo1.data.tagArr = []
          } else {
            this.formInfo1.data.tagArr = res.data.limitTagIds
          }
          this.formInfo1.data.brandFromList = res.data.limitCarBrandIds
          if (this.formInfo1.data.brandFromList === '') {
            this.formInfo1.data.brandArr = []
          } else {
            this.formInfo1.data.brandArr = res.data.limitCarBrandIds
          }
          if (res.data.fzH5Dto !== null) {
            this.formInfo.data.jumpH5Id = res.data.fzH5Dto.id
            this.formInfo.data.jumpType = 1
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
    },
    initButtonList(status) {
      status = Number(status)
      if (status === 6) { // 已下架状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false }
        ]
      }
      if (status === 5) { // 已上架状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '下架', btType: 'danger', icon: 'el-icon-bottom', loading: 'deleteLoading', event: 'stop', show: false }
        ]
      }
      if (status === 3) { // 审批NG状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
      }
      if (status === 2) { // 已保存，审核中状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '审核通过', btType: 'primary', icon: 'el-icon-top', loading: 'submitLoading', event: 'approveOK', show: false },
          { type: 'button', label: '审核不通过', btType: 'danger', icon: 'el-icon-close', loading: 'stopLoading', event: 'approveNG', show: false }
        ]
      }
      if (status === 1) { // 编辑状态
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '提交审批', btType: 'primary', icon: 'el-icon-check', loading: 'submitLoading', event: 'submit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
      }
      this.initDataPermits()
    },
    // 获取点击事件
    pickItem(data) {
      var flag = true
      if (this.formInfo1.data.itemArr !== null) {
        this.formInfo1.data.itemArr.forEach(element => {
          if (data.id === element) {
            this.$message({
              showClose: true,
              message: '该数据已添加请勿重复添加',
              type: 'error',
              duration: 3500
            })
            flag = false
          }
        })
      }
      console.log(data)
      if (flag) {
        if (data.id != null) {
          const gameItem = {
            'id': '',
            'itemId': data.id,
            'gameItemName': data.itemName
          }
          if (this.listTypeInfo.gameItemList === null) {
            this.listTypeInfo.gameItemList = []
          }
          // 往虚拟装备处塞数据
          this.listTypeInfo.gameItemList.push(gameItem)
          if (this.formInfo1.data.itemArr === null) {
            this.formInfo1.data.itemArr = []
          }
          this.formInfo1.data.itemArr.push(data.id)
        }
        this.dialogGameItem.visible = false
      }
    },
    pickArea(data) {
      var flag = true
      if (this.formInfo1.data.areaArr !== null) {
        this.formInfo1.data.areaArr.forEach(element => {
          if (data.areaId === element) {
            this.$message({
              showClose: true,
              message: '该数据已添加请勿重复添加',
              type: 'error',
              duration: 3500
            })
            flag = false
          }
        })
      }
      console.log(data)
      if (flag) {
        if (data.areaId != null) {
          const areaItem = {
            'areaId': data.areaId,
            'areaName': data.areaName
          }
          // 往地区处塞数据
          if (this.listTypeInfo.areaList === null) {
            this.listTypeInfo.areaList = []
          }
          this.listTypeInfo.areaList.push(areaItem)
          if (this.formInfo1.data.areaArr === null) {
            this.formInfo1.data.areaArr = []
          }
          this.formInfo1.data.areaArr.push(data.areaId)
        }
        this.dialogArea.visible = false
      }
    },
    pickTag(data) {
      var flag = true
      if (this.formInfo1.data.tagArr !== null) {
        this.formInfo1.data.tagArr.forEach(element => {
          if (data.tagId === element) {
            this.$message({
              showClose: true,
              message: '该数据已添加请勿重复添加',
              type: 'error',
              duration: 3500
            })
            flag = false
          }
        })
      }
      console.log(data)
      if (flag) {
        if (data.tagId != null) {
          const tagItem = {
            'tagId': data.tagId,
            'tagName': data.tagName
          }
          // 往标签处塞数据
          if (this.listTypeInfo.tagList === null) {
            this.listTypeInfo.tagList = []
          }
          this.listTypeInfo.tagList.push(tagItem)
          if (this.formInfo1.data.tagArr === null) {
            this.formInfo1.data.tagArr = []
          }
          this.formInfo1.data.tagArr.push(data.tagId)
        }
        this.dialogTag.visible = false
      }
    },
    pickBrand(data) {
      var flag = true
      if (this.formInfo1.data.brandArr !== null) {
        this.formInfo1.data.brandArr.forEach(element => {
          if (data.id === element) {
            this.$message({
              showClose: true,
              message: '该数据已添加请勿重复添加',
              type: 'error',
              duration: 3500
            })
            flag = false
          }
        })
      }
      console.log(data)
      if (flag) {
        if (data.id != null) {
          const brandItem = {
            'id': data.id,
            'brandName': data.brandName
          }
          // 往标签处塞数据
          if (this.listTypeInfo.brandList === null) {
            this.listTypeInfo.brandList = []
          }
          this.listTypeInfo.brandList.push(brandItem)
          if (this.formInfo1.data.brandArr === null) {
            this.formInfo1.data.brandArr = []
          }
          this.formInfo1.data.brandArr.push(data.id)
        }
        this.dialogBrand.visible = false
      }
    },
    pickH5(data) {
      if (data.id != null) {
        this.formInfo.data.jumpH5Id = data.id
        this.formInfo.data.jumpType = 1
        this.H5List = [{
          id: data.id,
          title: data.title,
          imageUrl: data.imageUrl,
          jumpLink: data.jumpLink,
          merchantName: data.merchantName,
          validHour: data.validFrom + '~' + data.validTo + ''
        }]
      }
      this.dialogH5.visible = false
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'addcity': {
          this.dialogGameItem.visible = true
          break
        }
        case 'addArea': {
          this.dialogArea.visible = true
          break
        }
        case 'addTag': {
          this.dialogTag.visible = true
          break
        }
        case 'addBread': {
          this.dialogBrand.visible = true
          break
        }
        case 'save': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              // 验证数值与发放金币
              var falg = true
              var msg = ''
              if (this.formInfo.data.limitType === '1') {
                if (this.formInfo.data.maxTimes < 1) {
                  msg = '投放次数限制不能少于1'
                  falg = false
                }
              }
              if (falg) {
                this.formInfo.data.status = '1'
                const merchantData = Object.assign({}, this.formInfo.data, this.formInfo1.data, this.formInfo2.data)
                console.log(merchantData)
                this.$handleAPI('', updateApi, merchantData).then(res => {
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
              } else {
                this.$message({
                  showClose: true,
                  message: msg,
                  type: 'error',
                  duration: 3500
                })
              }
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
        case 'submit': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              // 验证数值与发放金币
              var falg = true
              var msg = ''
              if (this.formInfo.data.limitType === '1') {
                if (this.formInfo.data.maxTimes < 1) {
                  msg = '投放次数限制不能少于1'
                  falg = false
                }
              }
              if (falg) {
                this.formInfo.data.status = '2'
                const merchantData = Object.assign({}, this.formInfo.data, this.formInfo1.data, this.formInfo2.data)
                this.$handleAPI('', updateApi, merchantData).then(res => {
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
              } else {
                this.$message({
                  showClose: true,
                  message: msg,
                  type: 'error',
                  duration: 3500
                })
              }
            }
          })
          break
        }
        case 'uploadVideo': {
          // 上传动效
          this.dialogUpload.title.uploadVideo = '动效上传'
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        }
        case 'relationH5': {
          this.dialogH5.visible = true
          break
        }
        case 'daleteH5': {
          this.H5List = []
          this.formInfo.data.jumpH5Id = '0'
          this.formInfo.data.jumpType = '0'
          break
        }
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
        case 'handleInputConfirm': {
          const inputValue = this.inputValue
          if (inputValue) {
            this.formInfo.data.tagArr.push(inputValue)
            this.formInfo.data.taglist = this.formInfo.data.tagArr.join(',')
          }
          this.inputVisible = false
          this.inputValue = ''
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
        case 'changeTime': {
          if (this.formInfo.data.validTime !== null) {
            this.formInfo.data.timeFrom = this.$fn.switchTime(this.formInfo.data.validTime[0], 'hh:mm')
            this.formInfo.data.timeTo = this.$fn.switchTime(this.formInfo.data.validTime[1], 'hh:mm')
          } else {
            this.formInfo.data.timeFrom = ''
            this.formInfo.data.timeTo = ''
          }
          break
        }
        case 'upload': { // 上传成功，绑定图片链接到id
          if (this.dialogUpload.type) {
            if (this.dialogUpload.type === 'uploadVideo') {
              this.formInfo2.data.fileLink = data.fileList[0].relativeUrl
              this.formInfo2.data.fileType = data.fileList[0].fileType
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
          }
          break
        }
        case 'changeLimitType': {
          this.formInfo.fieldList.forEach(element => {
            if (element.value === 'maxTimes') {
              if (this.formInfo.data.limitType === '1') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
                this.formInfo.data.maxTimes = 0
              }
            }
          })
          break
        }
      }
    },
    handleClose(event, tag) {
      switch (event) {
        case 'closecity': {
          this.formInfo1.data.itemArr.splice(this.formInfo1.data.itemArr.indexOf(tag), 1)
          this.formInfo1.data.itemlist = this.formInfo1.data.itemArr.join(',')
          break
        }
        case 'closeArea': {
          this.formInfo1.data.areaArr.splice(this.formInfo1.data.areaArr.indexOf(tag), 1)
          this.formInfo1.data.areaFromlist = this.formInfo1.data.areaArr.join(',')
          break
        }
        case 'closeTag': {
          this.formInfo1.data.tagArr.splice(this.formInfo1.data.tagArr.indexOf(tag), 1)
          this.formInfo1.data.tagFromlist = this.formInfo1.data.tagArr.join(',')
          break
        }
        case 'closeBrand': {
          this.formInfo1.data.brandArr.splice(this.formInfo1.data.brandArr.indexOf(tag), 1)
          this.formInfo1.data.brandFromlist = this.formInfo1.data.brandArr.join(',')
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
      height: 40px;
      display: flex;
      align-items: center;
      img{
        padding-right: 10px;
      };
      .el-tag{
        margin-right: 5px;
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
