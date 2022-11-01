<template>
  <div class="race-map-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="基本信息" name="tab1">
        <el-row>
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>基本信息</span>
              </div>
              <page-form
                :ref-obj.sync="formInfo.refa"
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
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>赛道参数信息</span>
              </div>
              <page-form
                :ref-obj.sync="formInfo.refb"
                :data="formInfo.data"
                :field-list="formInfo.fieldList2"
                :rules="formInfo.rulesMapParams"
                :label-width="formInfo.labelWidth"
                :list-type-info="listTypeInfo"
                :read-only="formInfo.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card">
              <page-form
                :ref-obj.sync="formInfo.refc"
                :data="formInfo.data"
                :field-list="formInfo.fieldList3"
                :rules="formInfo.rulesMapPic"
                :label-width="formInfo.labelWidth"
                :label-position="'top'"
                :list-type-info="listTypeInfo"
                :read-only="formInfo.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              >
                <template v-slot:form-mapUrl>
                  <div class="slot-avatar">
                    <img
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + formInfo.data.mapUrl"
                      style="height: 80px;"
                      :onerror="nopicture"
                    >
                    <el-button
                      v-waves
                      type="primary"
                      icon="el-icon-picture"
                      size="mini"
                      @click="handleClick('uploadMapFile')"
                    >
                      {{ formInfo.data.mapUrl ? '更换图片' : '选择图片' }}
                    </el-button>
                  </div>
                </template>
                <template v-slot:form-mapRoadUrl>
                  <div class="slot-avatar">
                    <img
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + formInfo.data.mapRoadUrl"
                      style="height: 80px;"
                      :onerror="nopicture"
                    >
                    <el-button
                      v-waves
                      type="primary"
                      icon="el-icon-picture"
                      size="mini"
                      @click="handleClick('uploadRoadFile')"
                    >
                      {{ formInfo.data.mapRoadUrl ? '更换图片' : '选择图片' }}
                    </el-button>
                  </div>
                </template>
                <template v-slot:form-mapRoadBgUrl>
                  <div class="slot-avatar">
                    <img
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + formInfo.data.mapRoadBgUrl"
                      style="height: 80px;"
                      :onerror="nopicture"
                    >
                    <el-button
                      v-waves
                      type="primary"
                      icon="el-icon-picture"
                      size="mini"
                      @click="handleClick('uploadRoadBgFile')"
                    >
                      {{ formInfo.data.mapRoadBgUrl ? '更换图片' : '选择图片' }}
                    </el-button>
                  </div>
                </template>
                <template v-slot:form-mapSmallUrl>
                  <div class="slot-avatar">
                    <img
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + formInfo.data.mapSmallUrl"
                      style="height: 80px;"
                      :onerror="nopicture"
                    >
                    <el-button
                      v-waves
                      type="primary"
                      icon="el-icon-picture"
                      size="mini"
                      @click="handleClick('uploadSmallFile')"
                    >
                      {{ formInfo.data.mapSmallUrl ? '更换图片' : '选择图片' }}
                    </el-button>
                  </div>
                </template>
              </page-form>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="路径属性" name="tab2">
        <el-row>
          <el-col :span="10">
            <div>
              <el-radio-group v-model="laneType2" @change="changeMapPath">
                <el-radio-button label="AandB">A+B车</el-radio-button>
                <el-radio-button label="A">A车</el-radio-button>
                <el-radio-button label="B">B车</el-radio-button>
              </el-radio-group>
            </div>
            <div class="svg-container-full">
              <svg
                id="full"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMinYMin meet"
                :viewBox="'0 0 ' +formInfo.data.mapWidth +' ' +formInfo.data.mapHeight"
              >
                <path v-for="(item, index) in pathDataList" :key="index" :d="item" class="svg-path" />
              </svg>
            </div>
          </el-col>
          <el-col :span="14">
            <div>
              <el-radio-group v-model="filter.appType" @change="changeFilterType">
                <el-radio-button label="1">IOS</el-radio-button>
                <el-radio-button label="2">安卓</el-radio-button>
              </el-radio-group>
              <el-radio-group v-model="filter.laneType" @change="changeFilterType">
                <el-radio-button label="A">A车</el-radio-button>
                <el-radio-button label="B">B车</el-radio-button>
              </el-radio-group>
              <el-button v-if="formInfo.data.status === 1" type="success" style="margin-left: 610px" size="mini" icon="el-icon-plus" @click="handleClick('addMapPath')">新增轨迹</el-button>
            </div>
            <br>
            <page-table
              :data.sync="tableInfo.data"
              :query="filterInfo.query"
              :field-list="tableInfo.fieldList"
              :list-type-info="listTypeInfo"
              :handle="tableInfo.handle"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!-- 图片上传弹窗 -->
    <page-dialog
      :visible.sync="dialogUpload.visible"
      :title="dialogUpload.title[dialogUpload.type]"
      :width="dialogUpload.width"
      :bt-loading="dialogUpload.btLoading"
      :bt-list="dialogUpload.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 图片上传组件 -->
      <Upload
        v-if="(dialogUpload.type === 'uploadMapFile' || dialogUpload.type === 'uploadRoadFile' ||dialogUpload.type === 'uploadSmallFile' || dialogUpload.type === 'uploadPathImage' || dialogUpload.type === 'uploadRoadBgFile') && dialogUpload.visible"
        :upload-data="{targetPath: 'race-map',autoname: '1'}"
        @handleEvent="handleEvent"
      />
    </page-dialog>
    <page-dialog
      :visible.sync="dialogPath.visible"
      :title="dialogPath.title[dialogPath.type]"
      :width="dialogPath.width"
      :bt-loading="dialogPath.btLoading"
      :bt-list="dialogPath.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <el-row>
        <el-col :span="16">
          <page-form
            :ref-obj.sync="formInfoMapPath.ref1"
            :data="formInfoMapPath.data"
            :field-list="formInfoMapPath.fieldList1"
            :rules="formInfoMapPath.rules1"
            :label-width="formInfoMapPath.labelWidth"
            :list-type-info="listTypeInfo"
            :read-only="formInfoMapPath.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
        </el-col>
        <el-col :span="8">
          <page-form
            :ref-obj.sync="formInfoMapPath.ref2"
            :data="formInfoMapPath.data"
            :field-list="formInfoMapPath.fieldList2"
            :rules="formInfoMapPath.rules2"
            :label-width="formInfoMapPath.labelWidth"
            :label-position="'top'"
            :list-type-info="listTypeInfo"
            :read-only="formInfoMapPath.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <template v-slot:form-pathUrl>
              <div class="slot-avatar">
                <el-image
                  v-imgAlart
                  :src="$TH.FILE_URLS.static_url + formInfoMapPath.data.pathUrl"
                  style="height: 80px;"
                  :onerror="nopicture"
                />
                <el-button
                  v-waves
                  type="primary"
                  icon="el-icon-picture"
                  size="mini"
                  @click="handleClick('uploadPathImage')"
                >
                  {{ formInfoMapPath.data.pathUrl ? '更换图片' : '选择图片' }}
                </el-button>
              </div>
            </template>
            <template v-slot:form-svgView>
              <div class="svg-item-view">
                <svg
                  :id="'partly'+ formInfoMapPath.data.id"
                  xmlns="http://www.w3.org/2000/svg"
                  :viewBox="'0 0 ' +formInfo.data.mapWidth +' ' +formInfo.data.mapHeight"
                  preserveAspectRatio="xMinYMin meet"
                >
                  <path ref="path" :d="formInfoMapPath.data.pathData" class="svg-path" />
                </svg>
              </div>
            </template>
          </page-form>
        </el-col>
      </el-row>
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetailApi, deleteApi, updateDetailApi, getMapDataList, updateMapDataDetail, deleteMapData } from '@/api/race/racemap'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import defaultImage from '@/assets/img/no-pic.jpg'
import PageDialog from '@/components/PageDialog'
import Upload from '@/components/Upload'
import PageTable from '@/components/PageTable'

export default {
  components: {
    PageFilter,
    PageForm,
    PageDialog,
    Upload,
    PageTable
  },
  data() {
    const checkNumber = (rule, value, callback) => {
      const check = this.$validate({ label: '', value, rules: ['notnull', 'fullNumber'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkPositiveNum = (rule, value, callback) => {
      const check = this.$validate({ label: '', value, rules: ['int', 'notnull'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      activeName: 'tab1',
      laneType2: 'AandB',
      pathDataList: [],
      filter: {
        laneType: 'A',
        appType: '1'
      },
      curTableData: [],
      listTypeInfo: {
        statusList: [],
        laneTypeList: [],
        pathTypeList: [],
        extraFlagList: [],
        appTypeList: []
      },
      // 过滤相关配置（按钮区）
      filterInfo: {
        query: {
        },
        list: [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
      },
      // 表单相关（追加、修改）
      formInfo: {
        refa: null,
        refb: null,
        refc: null,
        readOnly: false,
        data: {
          id: '', // *唯一ID
          mapName: '',
          mapUrl: '',
          mapSmallUrl: '',
          mapRoadUrl: '',
          mapRoadBgUrl: '',
          mapParam1: '',
          mapParam2: '',
          mapParam3: '',
          mapParam4: '',
          mapK: '',
          mapB: '',
          status: '1',
          mapWidth: 200,
          mapHeight: 200,
          zoomWidth: 200,
          zoomHeight: 200,
          weight: ''
        },
        fieldList: [
          { label: '赛道ID', value: 'id', type: 'tag', className: 'el-form-inline-block-50' },
          { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { label: '赛道名称', value: 'mapName', type: 'input', required: true, className: 'el-form-block-80' },
          { label: '赛道宽度', value: 'mapWidth', type: 'input', className: 'el-form-block-80', required: true, validator: checkPositiveNum },
          { label: '赛道高度', value: 'mapHeight', type: 'input', className: 'el-form-block-80', required: true, validator: checkPositiveNum },
          { label: '赛道示意小图宽度', value: 'zoomWidth', type: 'input', className: 'el-form-block-80', required: true, validator: checkPositiveNum },
          { label: '赛道示意小图高度', value: 'zoomHeight', type: 'input', className: 'el-form-block-80', required: true, validator: checkPositiveNum },
          { label: '参数K', value: 'mapK', type: 'input', required: true, validator: checkNumber, className: 'el-form-block-80' },
          { label: '参数B', value: 'mapB', type: 'input', required: true, validator: checkNumber, className: 'el-form-block-80' },
          { label: '匹配权重', value: 'weight', type: 'input', className: 'el-form-block-80', required: true, validator: checkPositiveNum }
        ],
        fieldList2: [
          { label: '直', value: 'mapParam1', type: 'input', fixtext: '%', append: 'append', required: true, validator: checkNumber, className: 'el-form-block-80' },
          { label: '弯', value: 'mapParam2', type: 'input', fixtext: '%', append: 'append', required: true, validator: checkNumber, className: 'el-form-block-80' },
          { label: '颠簸', value: 'mapParam3', type: 'input', fixtext: '%', append: 'append', required: true, validator: checkNumber, className: 'el-form-block-80' },
          { label: '翻车', value: 'mapParam4', type: 'input', fixtext: '%', append: 'append', required: true, validator: checkNumber, className: 'el-form-block-80' }
        ],
        fieldList3: [
          { label: '赛道场景大图', value: 'mapUrl', type: 'slot', required: true, className: 'el-form-block' },
          { label: '赛道场景缩略图', value: 'mapSmallUrl', type: 'slot', required: true, className: 'el-form-block' },
          { label: '赛道加载中示意图', value: 'mapRoadUrl', type: 'slot', required: true, className: 'el-form-block' },
          { label: '赛道加载中示意背景图', value: 'mapRoadBgUrl', type: 'slot', required: true, className: 'el-form-block' }
        ],
        rules: {},
        rulesMapParams: {},
        rulesMapPic: {},
        labelWidth: '180px'
      },
      formInfoMapPath: {
        ref1: null,
        ref2: null,
        readOnly: false,
        data: {
          id: '', // *唯一ID
          mapId: '',
          pathName: '',
          laneType: '',
          pathUrl: '',
          pathType: '',
          extraFlag: '2',
          pathLength: '',
          appType: '',
          sort: '',
          pathData: '',
          svgView: ''
        },
        fieldList1: [
          { label: '轨迹ID', value: 'id', type: 'tag' },
          { label: '轨迹长度', value: 'pathLength', type: 'tag' },
          { label: '轨迹名称', value: 'pathName', type: 'input', required: true },
          { label: '排序', value: 'sort', type: 'input', required: true, validator: checkNumber },
          { label: '车道分区', value: 'laneType', type: 'customselect', list: 'laneTypeList', key: 'itemValue', name: 'itemName', required: true },
          { label: '轨迹属性', value: 'pathType', type: 'customselect', list: 'pathTypeList', key: 'itemValue', name: 'itemName', required: true },
          { label: '包含异常位点', value: 'extraFlag', type: 'customselect', list: 'extraFlagList', key: 'itemValue', name: 'itemName', required: true },
          { label: '适用App类型', value: 'appType', type: 'customselect', list: 'appTypeList', key: 'itemValue', name: 'itemName', required: true },
          { label: '轨迹数据', value: 'pathData', type: 'textarea', autosize: { minRows: 10, maxRows: 20 }, required: true, blur: 'pathDataChange', className: 'el-form-block-100' }
        ],
        fieldList2: [
          { label: '轨迹示意图上传', value: 'pathUrl', type: 'slot', required: false, className: 'el-form-block' },
          { label: '轨迹数据效果图', value: 'svgView', type: 'slot', className: 'el-form-block' }
        ],
        rules1: {},
        rules2: {},
        labelWidth: '120px'
      },
      // 图片上传弹窗相关
      dialogUpload: {
        title: {
          uploadMapFile: '赛道场景大图上传',
          uploadSmallFile: '赛道场景缩略图上传',
          uploadRoadFile: '赛道加载中示意图上传',
          uploadRoadBgFile: '赛道加载中示意背景图上传',
          uploadPathImage: 'SVG图片上传'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: 'primary', icon: 'el-icon-close', event: 'closeUpload', show: true }
        ]
      },
      dialogPath: {
        title: {
          addMapPath: '新增',
          editTrack: '编辑'
        },
        visible: false,
        type: '',
        width: '1000px',
        btLoading: false,
        btList: [
          { label: '取消', type: '', icon: 'el-icon-close', event: 'cancelPath', show: true },
          { label: '确定', type: 'primary', icon: 'el-icon-check', event: 'savePath', show: true }
        ]
      },
      tableInfo: {
        data: [],
        fieldList: [
          { label: '轨迹ID', value: 'id', minWidth: 70 },
          { label: '轨迹名称', value: 'pathName' },
          { label: 'A/B', value: 'laneTypeName', minWidth: 60 },
          { label: '适用APP类型', value: 'appTypeName', minWidth: 100 },
          { label: '轨迹示意图', value: 'pathUrl', type: 'image' },
          { label: '轨迹属性', value: 'pathTypeName', minWidth: 70 },
          { label: '包含异常位点', value: 'extraFlagName', minWidth: 100 },
          { label: '长度', value: 'pathLength' },
          { label: '排序', value: 'sort', minWidth: 50 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: []
        }
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
  created() {
    this.initList()
  },
  mounted() {
    this.getDetail()
    this.initDataPermits()
    // 验证规则
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('raceMapDetail', this.filterInfo.list) // 条件区域操作权限
      this.$initDataPermits('raceMapDetail', this.tableInfo.handle.btList) // 列表数据操作权限
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'MAP_LANE_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.laneTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'MAP_PATH_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.pathTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'YES_NO' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.extraFlagList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'APP_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.appTypeList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
      this.formInfo.rulesMapParams = this.$initRules(this.formInfo.fieldList2)
      this.formInfo.rulesMapPic = this.$initRules(this.formInfo.fieldList3)
      this.formInfoMapPath.rules1 = this.$initRules(this.formInfoMapPath.fieldList1)
      this.formInfoMapPath.rules2 = this.$initRules(this.formInfoMapPath.fieldList2)
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo.refa) {
        this.formInfo.refa.resetFields()
      }
      if (this.formInfo.refb) {
        this.formInfo.refb.resetFields()
      }
      if (this.formInfo.refc) {
        this.formInfo.refc.resetFields()
      }
      // 获取url参数
      this.formInfo.data.id = this.$route.query.id
      // 获取version详细
      const param = { 'id': this.formInfo.data.id }
      this.$handleAPI('', getDetailApi, param).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          const data = res.data
          // 显示信息
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              if (data[key] === 0 || data[key] === '0') {
                data[key] = ''
              }
              this.formInfo.data[key] = data[key]
            }
          }
          this.getMapDataList(data.id)
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
        }
      })
    },
    getMapDataList(val) {
      this.$handleAPI('', getMapDataList, { 'mapId': val }).then(res => {
        if (res.code === 200) {
          this.curTableData = res.data.list
          this.changeFilterType()
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
        }
      })
    },
    changeFilterType() {
      var arr = []
      var num = 0
      this.curTableData.forEach(item => {
        if (item.laneType === this.filter.laneType) {
          arr[num] = item
          num++
        }
      })
      var arr2 = []
      var num2 = 0
      if (arr.length >= 0) {
        arr.forEach(item => {
          if (Number(item.appType) === Number(this.filter.appType)) {
            arr2[num2] = item
            num2++
          }
        })
        this.tableInfo.data = arr2
      } else {
        this.tableInfo.data = arr
      }
      this.changeMapPath()
    },
    changeMapPath() {
      this.pathDataList = []
      this.curTableData.forEach(item => {
        if (item.pathData !== null && item.pathData !== '') {
          if (Number(this.filter.appType) === Number(item.appType)) {
            if (this.laneType2 === 'A' && item.laneType === this.laneType2) {
              this.pathDataList.push(item.pathData)
            }
            if (this.laneType2 === 'B' && item.laneType === this.laneType2) {
              this.pathDataList.push(item.pathData)
            }
            if (this.laneType2 === 'AandB') {
              this.pathDataList.push(item.pathData)
            }
          }
        }
      })
    },
    svgResolve() {
      var path = this.$refs.path
      var totalLength = path.getTotalLength()
      this.formInfoMapPath.data.pathLength = totalLength
    },
    restFormMapPath() {
      if (this.formInfoMapPath.ref1) {
        this.formInfoMapPath.ref1.resetFields()
      }
      if (this.formInfoMapPath.ref2) {
        this.formInfoMapPath.ref2.resetFields()
      }
      this.formInfoMapPath.data = {
        id: '', // *唯一ID
        mapId: '',
        pathName: '',
        laneType: '',
        pathUrl: '',
        pathType: '1',
        extraFlag: '2',
        pathLength: '',
        appType: '',
        sort: '',
        pathData: '',
        svgView: ''
      }
    },
    initButtonList(status) {
      status = Number(status)
      if (status === 3) { // 停用状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '启用', btType: 'primary', icon: 'el-icon-check', loading: 'submitLoading', event: 'submit', show: false }
        ]
        this.tableInfo.handle.btList = []
      }
      if (status === 2) { // 已发布，启用状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '停用', btType: 'danger', icon: 'el-icon-close', loading: 'stopLoading', event: 'stop', show: false }
        ]
        this.tableInfo.handle.btList = []
      }
      if (status === 1) { // 编辑状态
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '启用', btType: 'primary', icon: 'el-icon-check', loading: 'submitLoading', event: 'submit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
        this.tableInfo.handle.btList = [
          { tooltip: '', label: '编辑', type: 'primary', icon: 'el-icon-view', event: 'editTrack', show: false },
          { tooltip: '', label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'deleteTrack', show: false }
        ]
      }
      this.initDataPermits()
    },
    checkRequiredField() {
      var f1 = false
      var f2 = false
      var f3 = false
      this.formInfo.refa.validate(valid => {
        f1 = valid
      })
      this.formInfo.refb.validate(valid => {
        f2 = valid
      })
      this.formInfo.refc.validate(valid => {
        f3 = valid
      })
      return f1 && f2 && f3
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'save': {
          if (this.checkRequiredField()) {
            this.formInfo.data.updateBy = this.$store.state.staff.staffId
            this.$handleAPI('', updateDetailApi, this.formInfo.data).then(res => {
              this.$message({
                showClose: true,
                message: (res.code === 200) ? '保存成功' : res.message,
                type: (res.code === 200) ? 'success' : 'error',
                duration: 3500
              })
            })
          }
          break
        }
        case 'delete': {
          this.$confirm('确定要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'id': this.formInfo.data.id,
              'staffId': this.$store.state.staff.staffId
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
          })
          break
        }
        case 'edit': {
          const param = { 'id': this.formInfo.data.id, 'status': 1, 'updateBy': this.$store.state.staff.staffId }
          this.$handleAPI('', updateDetailApi, param).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 1
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
        case 'stop': {
          const param = { 'id': this.formInfo.data.id, 'status': 3, 'updateBy': this.$store.state.staff.staffId }
          this.$handleAPI('', updateDetailApi, param).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 3
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
        case 'submit': {
          if (!this.checkRequiredField()) {
            return
          }
          const temStatus = this.formInfo.data.status
          this.formInfo.data.status = 2
          this.formInfo.data.updateBy = this.$store.state.staff.staffId
          this.$handleAPI('', updateDetailApi, this.formInfo.data).then(res => {
            this.$message({
              showClose: true,
              message: res.code === 200 ? '启用成功' : res.message,
              type: res.code === 200 ? 'success' : 'error',
              duration: 3500
            })
            if (res.code !== 200) {
              this.formInfo.data.status = temStatus
            }
          })
          break
        }
        case 'uploadMapFile': {
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        }
        case 'uploadRoadFile': {
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        }
        case 'uploadSmallFile': {
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        }
        case 'uploadPathImage': {
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        }
        case 'uploadRoadBgFile': {
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        }
        case 'closeUpload':
          // 图片上传弹窗点击关闭
          this.dialogUpload.visible = false
          // this.dialogUpload.type = ''
          break
        case 'addMapPath':
          this.dialogPath.visible = true
          this.dialogPath.type = event
          this.restFormMapPath()
          break
        case 'editTrack':
          this.restFormMapPath()
          data.pathType += ''
          data.extraFlag += ''
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfoMapPath.data) {
              if (data[key] === 0 || data[key] === '0') {
                data[key] = ''
              }
              if (key === 'appType') {
                data[key] += ''
              }
              this.formInfoMapPath.data[key] = data[key]
            }
          }
          this.dialogPath.visible = true
          this.dialogPath.type = event
          break
        case 'cancelPath':
          this.dialogPath.visible = false
          this.dialogPath.type = ''
          break
        case 'savePath':
          // 验证flag
          var pass = true
          this.formInfoMapPath.ref1.validate(valid => {
            if (!valid) {
              pass = false
            }
          })
          this.formInfoMapPath.ref2.validate(valid => {
            if (!valid) {
              pass = false
            }
          })
          if (pass) {
            this.formInfoMapPath.data.mapId = this.formInfo.data.id
            this.formInfoMapPath.data.updateBy = this.$store.state.staff.staffId
            this.$handleAPI('', updateMapDataDetail, this.formInfoMapPath.data).then(res => {
              if (res.code === 200) {
                this.dialogPath.visible = false
                this.dialogPath.type = ''
              }
              this.$message({
                showClose: true,
                message: (res.code === 200) ? '保存成功' : res.message,
                type: (res.code === 200) ? 'success' : 'error',
                duration: 3500
              })
              this.getMapDataList(this.formInfo.data.id)
            })
          }
          break
        case 'deleteTrack':
          this.$confirm('确定要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$handleAPI('', deleteMapData, { id: data.id, staffId: this.$store.state.staff.staffId }).then(res => {
              if (res.code === 200) {
                this.getMapDataList(this.formInfo.data.id)
              }
              this.$message({
                showClose: true,
                message: (res.code === 200) ? '删除成功' : res.message,
                type: (res.code === 200) ? 'success' : 'error',
                duration: 3500
              })
            })
          })
      }
    },
    handleEvent(event, data) {
      switch (event) {
        case 'upload': { // 上传成功，绑定图片链接到id
          if (this.dialogUpload.type) {
            if (this.dialogUpload.type === 'uploadMapFile') {
              this.formInfo.data.mapUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
            if (this.dialogUpload.type === 'uploadRoadFile') {
              this.formInfo.data.mapRoadUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
            if (this.dialogUpload.type === 'uploadSmallFile') {
              this.formInfo.data.mapSmallUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
            if (this.dialogUpload.type === 'uploadPathImage') {
              this.formInfoMapPath.data.pathUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
            if (this.dialogUpload.type === 'uploadRoadBgFile') {
              this.formInfo.data.mapRoadBgUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
          }
          break
        }
        case 'pathDataChange': {
          this.svgResolve()
          break
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .race-map-container {
    height: 800px;
    padding: 20px;

    .slot-avatar{
      height: 80px;
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
    /* 鼠标悬浮时 */
    .el-table--enable-row-hover .el-table__body tr:hover {
      cursor: pointer;
    }
    .svg-path {
      fill: none;
      stroke: #db1716;
      stroke-miterlimit: 10;
      stroke-width: 4px;
    }
    .svg-container-full {
      border-radius: 3px;
      width: 600px;
      float: left;
      margin-left: 10px;
      height: 900px;
      border: 1px dashed #ddd;
      margin-top: 10px;
      position: relative;
      padding: 10px;
      overflow: auto;
    }
    .svg-container-full:after {
      position: absolute;
      content: "SVG展示区域";
      line-height: 222px;
      width: 100%;
      height: 100%;
      text-align: center;
      color: #ddd;
      top: 0;
      left: 0;
    }
  }
</style>
<style lang="scss">
  .svg-path {
    fill: none;
    stroke: #db1716;
    stroke-miterlimit: 10;
    stroke-width: 4px;
  }
  .svg-item-view {
    border-radius: 3px;
    width: 300px;
    float: left;
    margin-left: 10px;
    height: 300px;
    border: 1px dashed #ddd;
    margin-top: 10px;
    position: relative;
    padding: 10px;
    overflow: auto;
  }
  .svg-item-view:after {
    position: absolute;
    content: "SVG展示区域";
    line-height: 222px;
    width: 100%;
    height: 100%;
    text-align: center;
    color: #ddd;
    top: 0;
    left: 0;
  }
</style>
