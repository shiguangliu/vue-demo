<template>
  <div id="baseMapParentDiv" v-loading.fullscreen.lock="fullScreenLoading" class="template-container" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
    <page-filter
      :list-type-info="listTypeInfo"
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <div id="baseMap" class="baseMap" :style="'width: 100%;height:' + cHeight + 'px;'" />
    <el-row align="center" style="width:98%;height:50px;position: absolute;top: 100px;z-index: 999;">
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="5">
        <el-input
          id="pickerInput"
          v-model="keyword"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
        />
      </el-col>
      <el-col :span="3">&nbsp;</el-col>
      <el-col :span="8">
        <el-radio-group v-model="radio1" @change="changeUserType">
          <el-radio-button label="全部" />
          <el-radio-button label="用户" value="1" />
          <el-radio-button label="马甲" value="9" />
          <el-radio-button label="陪玩" value="8" />
          <el-radio-button label="特殊" value="99" />
        </el-radio-group>
      </el-col>
      <el-col :span="3">&nbsp;</el-col>
      <el-col :span="3">
        <p>
          <!-- <el-button type="warning">缩放比例：{{ zoomNow }}</el-button> -->
          <el-input-number v-model="zoomNow" size="mini" :min="4" :max="30" :step="2" @change="handleZoomChange" />
        </p>
        <p style="margin-top: 5px;">
          <el-button type="info">总坐标数量：{{ radio1 === '全部' ? geoTotal : (radio1 === '用户' ? userTotal : (radio1 === '马甲' ? robotTotal : (radio1 === '陪玩' ? manualTotal : (radio1 === '特殊' ? landmarkTotal : 0)))) }}</el-button>
        </p>
        <!-- <p style="margin-top: 5px;"><el-button type="info">当前定位数量：{{ geoTotalNow }}</el-button></p> -->
      </el-col>
      <el-col :span="1" align="left">
        <i class="el-icon-full-screen" style="font-size: 25px;" :title="'缩放级别' + zoomApiBegin + '可点全屏展示'" @click="handleFullScreen()" />
      </el-col>
    </el-row>
    <!-- 选择坐马甲/特殊坐标点 -->
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
        <el-col :span="12">
          <el-button type="default" style="width: 100%;margin-bottom: 10px;" @click="clickObjType('robot')">
            <div style="padding: 10px;">
              <i class="cardIcon fa fa-android svg-icon" />
              <h3 class="icon-name">马甲坐标点</h3>
            </div>
          </el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="default" style="width: 100%;margin-bottom: 10px;" @click="clickObjType('landmark')">
            <div style="padding: 10px;">
              <i class="cardIcon fa fa-ravelry svg-icon" />
              <h3 class="icon-name">特殊坐标点</h3>
            </div>
          </el-button>
        </el-col>
      </el-row>
    </page-dialog>
    <!-- 设置半径/设置特殊坐标点 -->
    <page-dialog
      ref="popupdia"
      :title="popupDialog.title"
      :visible.sync="popupDialog.visible"
      :width="popupDialog.width"
      :bt-loading="popupDialog.btLoading"
      :bt-list="popupDialog.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
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
        <!-- 自定义插槽显示状态 -->
        <template v-slot:form-imageUrl>
          <div class="slot-imageUrl">
            <img
              v-imgAlart
              height="100px"
              width="100px"
              style="object-fit: cover;"
              :src="$TH.FILE_URLS.static_url + formInfo.data.imageUrl"
              :onerror="nopicture"
            >
            <el-button type="primary" @click="handleClick('uploadImage')">上传图片</el-button>
          </div>
        </template>
      </page-form>
    </page-dialog>
    <page-dialog
      :title="dialogUpload.title[dialogUpload.type]"
      :visible.sync="dialogUpload.type === 'uploadImage' && dialogUpload.visible"
      :width="dialogUpload.width"
      :bt-loading="dialogUpload.btLoading"
      :bt-list="dialogUpload.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 图片上传组件 -->
      <Upload
        v-if="dialogUpload.type === 'uploadImage' && dialogUpload.visible"
        :upload-data="{targetPath: 'landmarkgeo/' + 'map' + '/', autoname: '1'}"
        @handleEvent="handleEvent"
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Consts from '@/constants'
import VueAMap from 'vue-amap'
import { lazyAMapApiLoaderInstance } from 'vue-amap'
import defaultImage from '@/assets/img/no-pic.jpg'
import PageFilter from '@/components/PageFilter'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'
import Upload from '@/components/Upload'
import { getAreaList, getApi as getAreaApi } from '@/api/sysarea'
import { batchAddRobotApi } from '@/api/fzrobotgeo'
import { createLandMarkApi } from '@/api/fzlandmarkgeo'
import { listGeoApi, listGeoDetailApi, updateGeoApi } from '@/api/usergeo'

// 初始化
VueAMap.initAMapApiLoader({
  key: Consts.AMAP_KEY,
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.DistrictSearch'],
  uiVersion: '1.1.1', // ui库版本，不配置不加载,
  v: '2.0'
})
export default {
  components: {
    PageFilter,
    PageDialog,
    PageForm,
    Upload
  },
  data() {
    const checkNumber = (rule, value, callback) => {
      const check = this.$validate({ label: '数量、半径', value, rules: ['realint', 'notnull', 'length'], conditions: [1, 100] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkLng = (rule, value, callback) => {
      const check = this.$validate({ label: '经度', value, rules: ['lon', 'notnull', 'length'], conditions: [1, 20] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkLat = (rule, value, callback) => {
      const check = this.$validate({ label: '纬度', value, rules: ['lat', 'notnull', 'length'], conditions: [1, 20] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      fullscreen: false,
      map: '',
      geoTotal: 0,
      userTotal: 0,
      robotTotal: 0,
      landmarkTotal: 0,
      manualTotal: 0,
      geoTotalNow: 0,
      allPointsData: [],
      allMarkerData: [],
      contextMenu: undefined,
      contextMenuPositon: undefined, // 右键菜单位置
      contextMenuMarker: undefined,
      contextMenuObj: undefined,
      contextCityCode: 0,
      district: '',
      citycode: '',
      polygons: [],
      zoomNow: undefined,
      zoomApiBegin: 12,
      mapZoom: 4.5,
      districtExplorer: undefined, // districtExplorer实例
      currentAreaNode: null, // 当前聚焦的区域
      lngLatList: [], // 要聚合的点列表
      groupedPointsCache: {},
      mapColors: [
        '#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00',
        '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707',
        '#651067', '#329262', '#5574a6', '#3b3eac'
      ], // 随机颜色
      pointSimplifierIns: undefined, // DistrictExplorer+海量点
      pointSimplifierInsForDistrictCluster: undefined, // DistrictCluster+海量点
      tipMarkerContent: undefined, // 鼠标悬浮提示内容
      districtCluster: undefined, // 聚合图层
      markerDataNow: [], // 自定义展示的标记数据组
      clusterMarkerClickLevel: undefined, // 聚合数量点击
      clusterMarkerClickAdcode: undefined, // 聚合点击城市码
      cityCodeArrByLngLat: [],
      fullScreenLoading: false,
      // 相关列表
      listTypeInfo: {
        provinceList: [],
        cityList: [],
        distList: [],
        streetList: []
      },
      // 检索条件
      filterInfo: {
        query: {
          provinceId: '',
          cityId: '',
          distId: '',
          streetId: ''
        },
        list: [
          { label: '选择属省', value: 'provinceId', type: 'customselect', list: 'provinceList', key: 'areaId', name: 'areaName', event: 'changeProvince', trigger: 'change', className: 'el-form-block' },
          { label: '选择城市', value: 'cityId', type: 'customselect', list: 'cityList', key: 'areaId', name: 'areaName', event: 'changeCity', trigger: 'change', className: 'el-form-block' },
          { label: '选择地区', value: 'distId', type: 'customselect', list: 'distList', key: 'areaId', name: 'areaName', event: 'changeDist', trigger: 'change', className: 'el-form-block' },
          { label: '选择地区', value: 'streetId', type: 'customselect', list: 'streetList', key: 'areaId', name: 'areaName', event: 'changeStreet', trigger: 'change', className: 'el-form-block' }
          // { id: 'amapKeyword', type: 'input', label: '关键字', value: 'amapKeyword' },
          // { type: 'button', label: '新增坐标点', btType: 'primary', icon: 'el-icon-plus', loading: 'okLoading', event: 'addMarker', show: true },
          // { type: 'button', label: '测试随机新增坐标点', btType: 'primary', icon: 'el-icon-edit', loading: 'okLoading', event: 'moveMarker', show: true }
        ]
      },
      cHeight: '',
      cWidth: '',
      markerArr: [],
      keyword: '',
      radioGroupData: { '全部': 0, '用户': 1, '陪玩': 8, '马甲': 9, '特殊': 99 },
      radio1: '全部',
      objTypeDialog: {
        title: '选择奖励类型',
        visible: false,
        btLoading: false,
        width: '500px',
        height: '300px'
      },
      popupDialog: {
        title: '',
        typeVal: '',
        visible: false,
        btLoading: false,
        height: '600px',
        btList: [
          { label: '取消', type: 'info', icon: 'el-icon-close', event: 'cancelSetGeo', show: true },
          { label: '确定', type: 'primary', icon: 'el-icon-check', event: 'confirmSetGeo', show: true }
        ]
      },
      // 表单相关（显示）
      formInfo: {
        ref: null,
        data: {
          total: 0,
          radius: 0,
          id: '',
          landmarkName: '',
          jumpLink: '',
          lng: '',
          lat: '',
          imageUrl: ''
        },
        fieldList: [],
        robotFieldList: [
          { label: '坐标点数量', value: 'total', type: 'input', append: 'append', fixtext: '个', required: true, validator: checkNumber, className: 'el-form-block-60' },
          { label: '设定半径', value: 'radius', type: 'input', append: 'append', fixtext: 'KM', required: true, validator: checkNumber, className: 'el-form-block-60' }
        ],
        landmarkFieldList: [
          { label: '特殊坐标点ID', value: 'id', type: 'tag', className: 'el-form-block-20' },
          { label: '坐标点名称', value: 'landmarkName', type: 'input', required: true, className: 'el-form-block-60' },
          { label: '跳转链接', value: 'jumpLink', type: 'input', className: 'el-form-block-60' },
          { label: '坐标点lng', value: 'lng', type: 'input', required: true, validator: checkLng, className: 'el-form-inline-block-50' },
          { label: '坐标点lat', value: 'lat', type: 'input', required: true, validator: checkLat, className: 'el-form-inline-block-50' },
          { label: '图片', value: 'imageUrl', type: 'slot', className: 'el-form-block-20' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      dialogUpload: {
        title: {
          uploadImage: '上传图片'
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
  mounted() {
    const pageThis = this
    this.initList()
    this.initRules()
    this.cHeight = document.documentElement.clientHeight - 200
    this.cWidth = document.documentElement.clientWidth
    lazyAMapApiLoaderInstance.load().then(() => {
      pageThis.initMap('baseMap', pageThis)
    })
  },
  methods: {
    handleZoomChange(e) {
      this.map.setZoom(e)
    },
    handleFullScreen() {
      if (this.zoomNow < this.zoomApiBegin) {
        this.$message.error('当前地图缩放级别不适合全屏，最小级别' + this.zoomApiBegin)
        return
      }
      // let element = document.documentElement; // 设置后就是我们平时的整个页面全屏效果
      const element = document.getElementById('baseMap') // 设置后就是的容器全屏
      if (this.fullscreen) {
        // 如果已经全屏了就退出全屏
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        this.fullscreen = false
      } else {
        // 如果不是全屏就变成全屏
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      // this.fullscreen = !this.fullscreen
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    initList() {
      const params = { level: 1 }
      this.$handleAPI('', getAreaList, params).then(res => {
        if (Number(res.code) === 200) {
          this.listTypeInfo.provinceList = res.data
        }
      })
      // 数据源获取
      this.fullScreenLoading = true
      // this.initAllData()
    },
    initAllData(pageThis) {
      // 初始化数据展示在地图 loading
      pageThis.fullScreenLoading = true
      this.$handleAPI('', listGeoApi, {}).then(res => {
        if (Number(res.code) === 200) {
          pageThis.geoTotal = res.data.geoTotal
          pageThis.userTotal = res.data.userTotal
          pageThis.robotTotal = res.data.robotTotal
          pageThis.landmarkTotal = res.data.landmarkTotal
          pageThis.manualTotal = res.data.manualTotal
          pageThis.geoTotalNow = res.data.geoTotal
          pageThis.allPointsData = res.data.geoList
          // 聚合点示例
          pageThis.districtCluster.setData(res.data.geoList)
          pageThis.pointSimplifierInsForDistrictCluster.setData(res.data.geoList)
          // 行政区分组示例
          // var lngLats = []
          // for (var i = 0, len = lines.length; i < len; i++) {
          //   if (!lines[i]) {
          //     continue
          //   }
          //   var parts = lines[i].split(',')
          //   lngLats.push([parseFloat(parts[0]), parseFloat(parts[1])])
          // }
          // pageThis.lngLatList = lngLats
          // pageThis.groupedPointsCache['100000'] = lngLats
          // 加载全国
          // pageThis.switch2AreaNode(100000)
          // 上海
          // pageThis.switch2AreaNode(310101)
          pageThis.fullScreenLoading = false
        }
      }).catch(function(error) {
        console.log(error)
      })
    },
    getCityList(areaId) {
      const params = { parentId: areaId, level: 2 }
      this.$handleAPI('', getAreaList, params).then(res => {
        if (Number(res.code) === 200) {
          this.listTypeInfo.cityList = res.data
        }
      })
    },
    getDistList(areaId) {
      const params = { parentId: areaId, level: 3 }
      this.$handleAPI('', getAreaList, params).then(res => {
        if (Number(res.code) === 200) {
          this.listTypeInfo.distList = res.data
        }
      })
    },
    getStreetList(areaId) {
      const params = { parentId: areaId, level: 4 }
      this.$handleAPI('', getAreaList, params).then(res => {
        if (Number(res.code) === 200) {
          this.listTypeInfo.streetList = res.data
        }
      })
    },
    clickObjType(e) {
      // 弹出选择具体条目
      if (e === 'robot') {
        this.popupDialog.title = '设置半径'
        this.popupDialog.typeVal = 'robot'
        this.formInfo.fieldList = this.formInfo.robotFieldList
      } else if (e === 'landmark') {
        this.popupDialog.title = '设置特殊坐标点'
        this.popupDialog.typeVal = 'landmark'
        this.formInfo.fieldList = this.formInfo.landmarkFieldList
        this.formInfo.data.lng = this.contextMenuPositon.lng
        this.formInfo.data.lat = this.contextMenuPositon.lat
      }
      this.initRules()
      this.popupDialog.visible = true
    },
    changeUserType(e) {
      console.log(this.radioGroupData[e])
      if (this.zoomNow >= this.zoomApiBegin) {
        for (const item of this.allMarkerData) {
          item.hide()
          if (Number(this.radioGroupData[e]) === 0 || item.getExtData().gt === Number(this.radioGroupData[e])) {
            item.show()
          }
        }
      }
    },
    handleClick(event, data) {
      switch (event) {
        case 'addMarker': {
          this.objTypeDialog.visible = true
          break
        }
        case 'moveMarker': {
          // console.log(this.allPointsData, this.allPointsData.indexOf(''))
          this.allPointsData.splice(this.allPointsData.indexOf(''), 1)
          this.allPointsData.push('121.464882,31.18795')
          this.allPointsData.push('121.453033,31.182249')
          // 聚合点示例
          this.districtCluster.setData(this.allPointsData)
          this.pointSimplifierInsForDistrictCluster.setData(this.allPointsData)
          break
        }
        case 'cancelSetGeo': {
          this.popupDialog.visible = false
          break
        }
        case 'confirmSetGeo': {
          const pageThis = this
          if (this.popupDialog.typeVal === 'robot') {
            // form验证
            if (this.formInfo.data.total === 0 || this.formInfo.data.radius === 0) {
              this.$message.error('坐标点数量或半径设置不合理')
              return false
            }
            this.formInfo.ref.validate(valid => {
              if (valid) {
                // 添加中心点
                var marker = new AMap.Marker({
                  title: '中心点',
                  map: this.map,
                  position: this.contextMenuPositon // 基点位置
                })
                this.initMarkerEvent(this, marker, 'rightclick')

                // 地图参数容器大小、坐标转换等
                // var mapSize = this.map.getSize()
                // var mapWidthPx = mapSize.width
                // var mapHeightPx = mapSize.height
                var pxPerM = 1 / this.map.getResolution()
                var radius = this.formInfo.data.radius * 1000
                // var movePx = pxPerM * radius
                // console.log(mapWidthPx, mapHeightPx, pxPerM, radius, movePx)
                var centerPx = this.map.lngLatToContainer([this.contextMenuPositon.lng, this.contextMenuPositon.lat])
                var centerXPx = centerPx.x
                var centerYPx = centerPx.y
                // 随机点marker
                const lnglatArr = []
                const lnglats = []
                for (let i = 1; i <= this.formInfo.data.total; i++) {
                  const diffRan = this.getRanNum()
                  const rMovePx = pxPerM * (diffRan.diffX * radius)
                  const rMovePy = pxPerM * (diffRan.diffY * radius)
                  const rPixelObj = { x: centerXPx + rMovePx, y: centerYPx + rMovePy }
                  const rLngLat = this.map.containerToLngLat(new AMap.Pixel(rPixelObj.x, rPixelObj.y))
                  lnglats.push(rLngLat)
                  const newItem = {
                    lng: rLngLat.lng,
                    lat: rLngLat.lat
                  }
                  lnglatArr.push(newItem)
                }
                console.log(pageThis.contextMenuPositon.lng, pageThis.contextMenuPositon.lat)
                // API 省市区获取
                if (lnglatArr.length > 0) {
                  // 分段取得地理编码 一批20
                  pageThis.fullScreenLoading = true
                  const size = 20
                  const parts = Math.ceil(lnglatArr.length / size)
                  const result = []
                  for (let x = 0; x < Math.ceil(lnglats.length / size); x++) {
                    const start = x * size
                    const end = start + size
                    result.push(lnglats.slice(start, end))
                  }
                  const resultArr = []
                  for (let x2 = 0; x2 < Math.ceil(lnglatArr.length / size); x2++) {
                    const start = x2 * size
                    const end = start + size
                    resultArr.push(lnglatArr.slice(start, end))
                  }
                  // 逆向地理编码
                  AMap.plugin('AMap.Geocoder', function() {
                    const geocoder = new AMap.Geocoder({
                      city: '全国'
                    })
                    const taskList = []
                    for (let y = 0; y < result.length; y++) {
                      const asyncTask = (y) => {
                        return new Promise((resolve) => {
                          geocoder.getAddress(result[y], function(status, result) {
                            if (status === 'complete' && result.info === 'OK' && result.regeocodes) {
                              for (let z = 0; z < resultArr[y].length; z++) {
                                const arr = pageThis.getPartCityCode(result.regeocodes[z].addressComponent.adcode)
                                resultArr[y][z].provinceId = arr[0]
                                resultArr[y][z].cityId = arr[1]
                                resultArr[y][z].districtId = arr[2]
                              }
                            }
                            resolve(status)
                          })
                        })
                      }
                      taskList.push(asyncTask(y))
                    }
                    Promise.all(taskList).then(res => {
                      if (res.length === parts) {
                        const params = { staffId: pageThis.staffId, mapType: 2, robotGeoList: resultArr.flat() }
                        pageThis.$handleAPI('', batchAddRobotApi, params).then(res => {
                          if (Number(res.code) === 200) {
                            // marker标记
                            lnglatArr.filter((item) => {
                              new AMap.Marker({
                                map: pageThis.map,
                                position: [item.lng, item.lat]
                              })
                            })
                            // 覆盖物Circle
                            const circleH = new AMap.Circle({
                              zIndex: 999,
                              map: pageThis.map,
                              center: new AMap.LngLat(pageThis.contextMenuPositon.lng, pageThis.contextMenuPositon.lat), // 圆心位置
                              radius: pageThis.formInfo.data.radius * 1000, // 半径:m
                              strokeColor: '#F33233', // 线颜色
                              strokeOpacity: 1, // 线透明度
                              strokeWeight: 3, // 线粗细度
                              fillColor: '#66CDD1', // 填充颜色
                              fillOpacity: 0.45 // 填充透明度
                            })
                            pageThis.map.add(circleH)
                            pageThis.objTypeDialog.visible = false
                            pageThis.popupDialog.visible = false
                          }
                          pageThis.fullScreenLoading = false
                        }).catch((error) => {
                          pageThis.$message({
                            showClose: true,
                            message: error,
                            type: 'error',
                            duration: 3500
                          })
                        })
                      }
                    })
                  })
                }
              }
            })
          } else if (this.popupDialog.typeVal === 'landmark') {
            this.formInfo.ref.validate(valid => {
              if (valid) {
                // 地理编码转换
                const codeArr = this.getPartCityCode(this.contextCityCode)
                const params = {
                  staffId: this.staffId,
                  mapType: 2,
                  landmarkName: this.formInfo.data.landmarkName,
                  lng: this.formInfo.data.lng,
                  lat: this.formInfo.data.lat,
                  imageUrl: this.formInfo.data.imageUrl,
                  jumpLink: this.formInfo.data.jumpLink,
                  provinceId: codeArr[0],
                  cityId: codeArr[1],
                  districtId: codeArr[2],
                  status: 1
                }
                this.$handleAPI('', createLandMarkApi, params).then(res => {
                  if (Number(res.code) === 200) {
                    const iconContent = '<img style="width: 35px;height: 35px;border: 3px solid #13C0C5;border-radius: 50%;" src="' + this.$TH.FILE_URLS.static_url + this.formInfo.data.imageUrl + '" />'
                    // 将 Icon 实例添加到 marker 上:
                    new AMap.Marker({
                      map: this.map,
                      position: [this.formInfo.data.lng, this.formInfo.data.lat],
                      content: iconContent,
                      // icon: icon,
                      title: this.formInfo.data.landmarkName,
                      label: this.formInfo.data.landmarkName,
                      extData: { id: res.data.id, gt: 99, oldLng: this.formInfo.data.lng, oldLat: this.formInfo.data.lat }
                    })
                    this.objTypeDialog.visible = false
                    this.popupDialog.visible = false
                    // this.formInfo.ref.resetFields()
                  }
                }).catch((error) => {
                  this.$message({
                    showClose: true,
                    message: error,
                    type: 'error',
                    duration: 3500
                  })
                })

                this.objTypeDialog.visible = false
                this.popupDialog.visible = false
              }
            })
          }
          break
        }
        case 'uploadImage': // 上传图片
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
    getRanNum() {
      const ranNum = Math.random()
      const rXNum = ranNum > 0.5 ? ranNum : -ranNum
      let rYNum = Math.sqrt(1 - Math.pow(rXNum, 2))
      const rand2 = Math.random()
      rYNum = rand2 > 0.5 ? -rYNum : rYNum
      const rand3 = Math.random()
      const minRYNum = rand3 * rYNum
      return { diffX: rXNum, diffY: minRYNum }
    },
    handleEvent(event, data) {
      switch (event) {
        case 'changeProvince': {
          this.filterInfo.query.cityId = ''
          this.listTypeInfo.cityList = []
          this.getCityList(this.filterInfo.query.provinceId)
          if (Number(this.filterInfo.query.provinceId) === 0) {
            this.switch2AreaNode(100000)
          } else {
            this.switch2AreaNode(this.filterInfo.query.provinceId + '0000')
          }
          // this.$handleAPI('', getAreaApi, { areaId: this.filterInfo.query.provinceId }).then(res => {
          //   if (res.code === 200) {
          //     this.searchObj(this, res.data)
          //   }
          // })
          break
        }
        case 'changeCity': {
          this.filterInfo.query.distId = ''
          this.listTypeInfo.distList = []
          this.getDistList(this.filterInfo.query.cityId)
          this.switch2AreaNode(this.filterInfo.query.cityId + '00')
          // this.$handleAPI('', getAreaApi, { areaId: this.filterInfo.query.cityId }).then(res => {
          //   if (res.code === 200) {
          //     this.searchObj(this, res.data)
          //   }
          // })
          break
        }
        case 'changeDist': {
          this.filterInfo.query.streetId = ''
          this.filterInfo.query.streetList = []
          this.getStreetList(this.filterInfo.query.distId)
          // this.initMarkers(this)
          // this.$handleAPI('', getAreaApi, { areaId: this.filterInfo.query.distId }).then(res => {
          //   if (res.code === 200) {
          //     this.searchObj(this, res.data)
          //   }
          // })
          break
        }
        case 'changeStreet': {
          this.$handleAPI('', getAreaApi, { areaId: this.filterInfo.query.streetId }).then(res => {
            if (res.code === 200) {
              // this.searchObj(this, res.data)
            }
          })
          break
        }
        case 'upload': {
          if (data.code !== 200) return
          if (this.dialogUpload.type === 'uploadImage') {
            this.formInfo.data.imageUrl = data.fileList[0].relativeUrl
          }
          // 关闭弹窗
          this.handleClick('closeUpload')
          break
        }
      }
    },
    // 操作某类覆盖物
    handleAllOverlays(type, needClose = false) {
      const pageThis = this
      // 获取当 marker 类型的覆盖物
      var overlays = pageThis.map.getAllOverlays(type)
      if (needClose === true) {
        pageThis.map.remove(overlays)
      }
    },
    getPartCityCode(code) {
      // 截取字符串2/4/6
      let provinceId
      let cityId
      let districtId
      if (code.length >= 2) {
        provinceId = code.substring(0, 2)
      }
      if (code.length >= 4) {
        cityId = code.substring(0, 4)
      }
      if (code.length >= 6) {
        districtId = code.substring(0, 6)
      }
      return [provinceId, cityId, districtId]
    },
    initMap(initName, pageThis) {
      // 取大概中心的坐标点初始化center，默认上海
      // var centerLng = 121.5273285
      // var centerLat = 31.25515044
      // 中国
      var centerLng = 116.30946
      var centerLat = 39.937629
      // 地图初始化
      pageThis.map = new AMap.Map(initName, {
        center: new AMap.LngLat(centerLng, centerLat),
        zoom: pageThis.mapZoom,
        resizeEnable: true
      })
      // 组件初始化：行政区分组+海量点展示组件
      AMapUI.load(['ui/geo/DistrictExplorer', 'ui/misc/PointSimplifier', 'lib/$'], function(DistrictExplorer, PointSimplifier, $) {
        // 创建一个实例
        pageThis.districtExplorer = window.districtExplorer = new DistrictExplorer({
          map: pageThis.map,
          eventSupport: true, // 打开事件支持
          preload: [100000] // 预加载全国
        })
        pageThis.initPointSimplifierIns(PointSimplifier)
      })
      // 组件初始化：加载区划聚合+海量点展示组件
      AMapUI.load(['ui/geo/DistrictCluster', 'ui/misc/PointSimplifier', 'lib/$'], function(DistrictCluster, PointSimplifier, $) {
        // 创建一个实例
        pageThis.districtCluster = window.districtCluster = new DistrictCluster({
          zIndex: -1,
          map: pageThis.map, // 所属的地图实例
          bubble: true,
          getPosition: function(item) {
            if (!item) {
              return null
            }
            return [parseFloat(item.lng), parseFloat(item.lat)]
          }
          // TODO基础样式设置无效
          // featureStyle: {
          //   fillStyle: 'red', // 填充色
          //   lineWidth: 1, // 描边线宽
          //   strokeStyle: 'red', // 描边色
          //   // 鼠标Hover后的样式
          //   hoverOptions: {
          //     fillStyle: 'black'
          //   }
          // },
        })
        pageThis.initAllData(pageThis)
        pageThis.initPointSimplifierInsForDistrictCluster(PointSimplifier)
        pageThis.initDistrictClusterEvents()
      })
      // 地图控制器
      pageThis.map.addControl(new AMap.Scale())

      // 地图测量标尺
      // pageThis.map.plugin(['AMap.RangingTool'], function() {
      //   var ruler = new AMap.RangingTool(pageThis.map)
      //   ruler.turnOn()
      // })
      // console.log(pageThis.map.getResolution(), pageThis.map.getSize(), pageThis.map.getScale())
      pageThis.initMapEvents()

      // poipicker
      pageThis.initPoiPicker(pageThis)

      // 下属行政区查询
      // pageThis.initDistrictSearch(pageThis)
      // markers
      // pageThis.initMarkers(pageThis)
      // 地图自适应
      // pageThis.map.setFitView(null, false, [150, 60, 100, 60])
    },
    initMapContextMenu() {
      const pageThis = this
      // 创建右键菜单
      pageThis.contextMenu = new AMap.ContextMenu()
      // 菜单1添加Marker标记
      pageThis.contextMenu.addItem('添加坐标点', function(e) {
        pageThis.objTypeDialog.visible = true
        pageThis.contextMenu.close()
      }, 0)
    },
    initMapContextMenuForMarker() {
      const pageThis = this
      // 创建右键菜单
      pageThis.contextMenu = new AMap.ContextMenu()
      // 菜单3
      pageThis.contextMenu.addItem('开始拖拽坐标点', function(e) {
        // 处理删除逻辑, 马甲和特殊点可以拖拽
        pageThis.contextMenuMarker.setDraggable(true)
        pageThis.contextMenu.close()
      }, 1)
      // 菜单2
      pageThis.contextMenu.addItem('删除坐标点', function() {
        // 关闭菜单
        pageThis.contextMenu.close()
        const extData = pageThis.contextMenuMarker.getExtData()
        // 处理删除逻辑
        const delParam = {
          id: extData.id,
          deleteFlag: 1,
          userType: extData.gt,
          oldLng: extData.oldLng,
          oldLat: extData.oldLat
        }
        pageThis.$handleAPI('', updateGeoApi, delParam).then(res => {
          if (Number(res.code) === 200) {
            pageThis.map.remove(pageThis.contextMenuMarker)
          }
        }).catch(function(error) {
          console.log(error)
        })
      }, 2)
    },
    initPointSimplifierInsForDistrictCluster(PointSimplifier) {
      const pageThis = this
      const groupStyleMap = {
        '1': {
          pointStyle: {
            content: PointSimplifier.Render.Canvas.getImageContent(
              'https://webapi.amap.com/ui/1.1/ui/misc/PointSimplifier/examples/imgs/bike.png',
              function onload() {
                pageThis.pointSimplifierInsForDistrictCluster.renderLater()
              },
              function onerror() {
                alert('图片加载失败！')
              }
            ),
            width: 15,
            height: 15,
            offset: ['-50%', '-50%'],
            fillStyle: null
          }
        },
        '8': {
          pointStyle: {
            content: PointSimplifier.Render.Canvas.getImageContent(
              'https://webapi.amap.com/ui/1.1/ui/misc/PointSimplifier/examples/imgs/people.png',
              function onload() {
                pageThis.pointSimplifierInsForDistrictCluster.renderLater()
              },
              function onerror() {
                alert('图片加载失败！')
              }
            ),
            width: 15,
            height: 15,
            offset: ['-50%', '-50%'],
            fillStyle: null
          }
        },
        '9': {
          pointStyle: {
            content: PointSimplifier.Render.Canvas.getImageContent(
              'https://webapi.amap.com/ui/1.1/ui/misc/PointSimplifier/examples/imgs/truck.png',
              function onload() {
                pageThis.pointSimplifierInsForDistrictCluster.renderLater()
              },
              function onerror() {
                alert('图片加载失败！')
              }
            ),
            width: 15,
            height: 15,
            offset: ['-50%', '-50%'],
            fillStyle: null
          }
        },
        '99': {
          pointStyle: {
            content: PointSimplifier.Render.Canvas.getImageContent(
              'https://webapi.amap.com/ui/1.1/ui/misc/PointSimplifier/examples/imgs/taxi.png',
              function onload() {
                pageThis.pointSimplifierInsForDistrictCluster.renderLater()
              },
              function onerror() {
                alert('图片加载失败！')
              }
            ),
            width: 15,
            height: 15,
            offset: ['-50%', '-50%'],
            fillStyle: null
          }
        }
      }
      pageThis.pointSimplifierInsForDistrictCluster = new PointSimplifier({
        map: pageThis.map, // 所属的地图实例
        autoSetFitView: false, // 禁止自动更新地图视野
        zIndex: 110,
        getPosition: function(item) {
          if (!item) {
            return null
          }
          return [parseFloat(item.lng), parseFloat(item.lat)]
        },
        getHoverTitle: function(item, idx) {
          return item.lng + ',' + item.lat
        },
        renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
        renderOptions: {
          featureEventSupport: true,
          clusterMarkerEventSupport: true,
          // 标注信息Marker上需要监听的事件
          clusterMarkerEventNames: ['click', 'rightclick', 'mouseover', 'mouseout'],
          // 点的样式
          pointStyle: {
            width: 5,
            height: 5,
            fillStyle: 'rgba(30, 180, 185, 0.38)'
          },
          // 鼠标hover时的title信息
          hoverTitleStyle: {
            position: 'top'
          },
          getGroupId: function(item, idx) {
            return item.gt
          },
          groupStyleOptions: function(gt) {
            return groupStyleMap[gt]
          }
        }
      })
    },
    initMapEvents() {
      const pageThis = this
      pageThis.map.on('click', function(e) {
        if (pageThis.contextMenu !== undefined) {
          pageThis.contextMenu.close()
        }
      })
      // 地图绑定鼠标右击事件——弹出右键菜单
      pageThis.map.on('rightclick', function(e) {
        pageThis.contextMenuObj = e
        pageThis.contextMenuPositon = e.lnglat
        pageThis.initMapContextMenu()
        pageThis.contextMenu.open(pageThis.map, e.lnglat)
        // 点击事件城市编码
        AMap.plugin('AMap.Geocoder', function() {
          const geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: '全国'
          })
          // 使用geocoder做地理/逆地理编码
          geocoder.getAddress(e.lnglat, function(status, result) {
            if (status === 'complete' && result.regeocode) {
              pageThis.contextCityCode = result.regeocode.addressComponent.adcode
            }
          })
        })
      })
      // 缩放事件
      pageThis.map.on('zoomend', function() {
        pageThis.zoomNow = pageThis.map.getZoom()
        // // 当前地图中心点+半径
        if (pageThis.zoomNow >= pageThis.zoomApiBegin) {
          pageThis.initCenterRadiusMarkerData()
        } else {
          // 清除marker
          pageThis.allMarkerData.filter(item => { pageThis.map.remove(item) })
          pageThis.markerDataNow.filter(item => { item.markers.filter(markerItem => { markerItem.hide() }) })
        }
      })
      // 拖拽事件
      pageThis.map.on('dragend', function() {
        pageThis.zoomNow = pageThis.map.getZoom()
        // // 当前地图中心点+半径
        if (pageThis.zoomNow >= pageThis.zoomApiBegin) {
          pageThis.initCenterRadiusMarkerData()
        } else {
          // 清除marker
          pageThis.allMarkerData.filter(item => { pageThis.map.remove(item) })
          pageThis.markerDataNow.filter(item => { item.markers.filter(markerItem => { markerItem.hide() }) })
        }
      })
    },
    initCenterRadiusMarkerData() {
      const pageThis = this
      pageThis.zoomNow = pageThis.map.getZoom()
      // 当前地图中心点+半径
      var mapSize = pageThis.map.getSize()
      var mapWidthPx = mapSize.width
      var mapHeightPx = mapSize.height
      var meterPerPx = pageThis.map.getResolution()
      // 最大半径
      const containerRadius = mapWidthPx > mapHeightPx ? meterPerPx * mapWidthPx / 2 : meterPerPx * mapHeightPx / 2
      const centerNow = pageThis.map.getCenter()
      console.log('initCenterRadiusMarkerData', centerNow.lng, centerNow.lat, containerRadius)
      // pageThis.fullScreenLoading = true
      const geoParam = { lng: centerNow.lng, lat: centerNow.lat, radius: containerRadius }
      pageThis.$handleAPI('', listGeoDetailApi, geoParam).then(res => {
        if (Number(res.code) === 200) {
          pageThis.geoTotalNow = res.data.total
          // 重置：清除marker
          pageThis.allMarkerData.filter(item => { pageThis.map.remove(item) })
          pageThis.allMarkerData = []
          for (const item of res.data.geoDetailList) {
            let iconContent = ''
            if (item.gt === 1) {
              iconContent = '<img style="width: 35px;height: 35px;border: 3px solid #2bcc59;border-radius: 50%;" src="' + pageThis.$TH.FILE_URLS.static_url + item.imageUrl + '" />'
            } else if (item.gt === 8) {
              iconContent = '<img style="width: 35px;height: 35px;border: 3px solid #e61624;border-radius: 50%;" src="' + pageThis.$TH.FILE_URLS.static_url + item.imageUrl + '" />'
            } else if (item.gt === 9) {
              iconContent = '<img style="width: 35px;height: 35px;border: 3px solid #795cc3;border-radius: 50%;" src="' + pageThis.$TH.FILE_URLS.static_url + item.imageUrl + '" />'
            } else if (item.gt === 99) {
              iconContent = '<img style="width: 35px;height: 35px;border: 3px solid #44bee4;border-radius: 50%;" src="' + pageThis.$TH.FILE_URLS.static_url + item.imageUrl + '" />'
            }
            const marker = new AMap.Marker({
              position: [item.lng, item.lat],
              content: iconContent,
              // icon: icon,
              title: item.markName,
              label: item.markName,
              autoRotation: true,
              map: pageThis.map,
              offset: new AMap.Pixel(-10, -10),
              extData: { id: item.id, gt: item.gt, oldLng: item.lng, oldLat: item.lat }
            })
            pageThis.allMarkerData.push(marker)
            // 初始化marker事件
            if (item.gt === 9 || item.gt === 99) {
              pageThis.initMarkerEvent(pageThis, marker, 'rightclick')
              pageThis.initMarkerEvent(pageThis, marker, 'dragend')
            }
          }
          // 遍历
          for (const item of pageThis.allMarkerData) {
            item.hide()
            if (Number(pageThis.radioGroupData[pageThis.radio1]) === 0 || item.getExtData().gt === Number(pageThis.radioGroupData[pageThis.radio1])) {
              item.show()
            }
          }
          // pageThis.fullScreenLoading = false
        } else {
          pageThis.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
          // pageThis.fullScreenLoading = false
        }
      }).catch(function(error) {
        console.log(error)
      })
    },
    initDistrictClusterEvents() {
      const pageThis = this
      // 经纬度点击事件 featureClick featureMouseover featureMouseout
      pageThis.districtCluster.on('featureClick', function(e, feature) {
        // console.log(e, feature)
      })
      // 悬浮城市码点击事件clusterMarkerClick clusterMarkerRightclick clusterMarkerMouseover clusterMarkerMouseout
      pageThis.districtCluster.on('clusterMarkerClick', function(e, record) {
        // 全局记录点击adcode
        pageThis.clusterMarkerClickLevel = record.feature.properties.level
        pageThis.clusterMarkerClickAdcode = record.adcode
        // const districtPoints = record.dataItems
        // district级别
        // console.log(record.feature.properties.level)
        if (record.feature.properties.level === 'district') {
          // TODO
        }
      })
    },
    refreshMap() {
      const pageThis = this
      // 获取 pointStyle
      var pointStyle = pageThis.pointSimplifierInsForDistrictCluster.getRenderOptions().pointStyle
      // 根据当前zoom调整点的尺寸
      pointStyle.width = pointStyle.height = 2 * Math.pow(1.2, pageThis.map.getZoom() - 3)
    },
    // 事件绑定
    // 解绑事件
    zoomOff() {
      this.map.off('zoomend', function() {})
    },
    initDistrictExplorerEvents() {
      const pageThis = this
      // 鼠标hover提示内容
      var tipMarker = new AMap.Marker({
        content: '<p class="tipMarker top"></p>',
        offset: new AMap.Pixel(0, 0),
        bubble: true
      })

      // 监听feature的hover事件
      pageThis.districtExplorer.on('featureMouseout featureMouseover', function(e, feature) {
        pageThis.toggleHoverFeature(tipMarker, feature, e.type === 'featureMouseover', e.originalEvent ? e.originalEvent.lnglat : null)
      })

      // 监听鼠标在feature上滑动
      pageThis.districtExplorer.on('featureMousemove', function(e, feature) {
        // 更新提示位置
        tipMarker.setPosition(e.originalEvent.lnglat)
      })
      // feature被点击
      pageThis.districtExplorer.on('featureClick', function(e, feature) {
        var props = feature.properties
        // 如果存在子节点
        if (props.childrenNum > 0) {
          // 切换聚焦区域
          pageThis.switch2AreaNode(props.adcode)
        }
      })

      // 外部区域被点击
      pageThis.districtExplorer.on('outsideClick', function(e) {
        pageThis.districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {
          console.log(error)
          if (routeFeatures && routeFeatures.length > 1) {
            // 切换到省级区域
            pageThis.switch2AreaNode(routeFeatures[1].properties.adcode)
          } else {
            // 切换到全国
            pageThis.switch2AreaNode(100000)
          }
        }, {
          levelLimit: 2
        })
      })
    },
    initPointSimplifierIns(PointSimplifier) {
      const pageThis = this
      var colors = pageThis.mapColors
      // 这里创建一个海量点组件
      var questionContent = PointSimplifier.Render.Canvas.getImageContent(
        'https://webapi.amap.com/ui/1.1/ui/geo/DistrictExplorer/examples/imgs/question.png',
        function onload() {
          pageThis.pointSimplifierIns.renderLater()
        },
        function onerror() {
          alert('图片加载失败！')
        }
      )
      pageThis.pointSimplifierIns = new PointSimplifier({
        zIndex: 109,
        autoSetFitView: false,
        map: pageThis.map, // 所属的地图实例
        getPosition: function(item) {
          if (!item) {
            return null
          }
          return item.pos
        },
        getHoverTitle: function(item, idx) {
          if (item.gid === -1) {
            return '区域外'
          } else {
            // return idx + ': ' + parseFloat(item.pos[0]) + ',' + parseFloat(item.pos[1])
          }
        },
        // 使用GroupStyleRender
        renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
        renderOptions: {
          // 点的样式
          pointStyle: {
            fillStyle: 'red',
            width: 5,
            height: 5
          },
          getGroupId: function(item) {
            return item.gid
          },
          groupStyleOptions: function(gid) {
            // 未知区域
            if (gid === -1) {
              return {
                pointStyle: {
                  content: questionContent,
                  fillStyle: null,
                  strokeStyle: null,
                  lineWidth: 2,
                  width: 16,
                  height: 16
                }
              }
            }
            return {
              pointStyle: {
                fillStyle: colors[gid % colors.length],
                // strokeStyle: 'rgba(255,255,255,0.3)',
                lineWidth: 1
              }
            }
          }
        }
      })
    },
    // 根据Hover状态设置相关样式
    toggleHoverFeature(tipMarker, feature, isHover, position) {
      // console.log(tipMarker, feature, isHover, position)
      const pageThis = this
      tipMarker.setMap(isHover ? pageThis.map : null)
      if (!feature) {
        return
      }
      var props = feature.properties
      if (isHover) {
        var points = pageThis.groupedPointsCache[props.adcode] || []
        // 更新提示内容
        tipMarker.setContent('<p class="tipMarker top" style="border-radius: 5px;background: #f7f7f7;border: 2px dashed #13C0C4;">' + props.adcode + ': ' + props.name + '(' + points.length + ')</p>')
        // 更新位置
        tipMarker.setPosition(position || props.center)
      }
      // $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').toggleClass('hover', isHover)
      // 更新相关多边形的样式
      var polys = pageThis.districtExplorer.findFeaturePolygonsByAdcode(props.adcode)
      for (var i = 0, len = polys.length; i < len; i++) {
        polys[i].setOptions({
          fillOpacity: isHover ? 0.5 : 0.2
        })
      }
    },
    // 切换区域
    switch2AreaNode(adcode, callback) {
      const pageThis = this
      if (pageThis.currentAreaNode && ('' + pageThis.currentAreaNode.getAdcode() === '' + adcode)) {
        return
      }
      pageThis.loadAreaNode(adcode, function(error, areaNode) {
        if (error) {
          if (callback) {
            callback(error)
          }
          return
        }
        pageThis.currentAreaNode = window.currentAreaNode = areaNode
        // 设置当前使用的定位用节点
        pageThis.districtExplorer.setAreaNodesForLocating([pageThis.currentAreaNode])
        pageThis.refreshAreaNode(areaNode)
        if (callback) {
          callback(null, areaNode)
        }
      })
    },
    // 加载区域
    loadAreaNode(adcode, callback) {
      const pageThis = this
      pageThis.districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
        if (error) {
          if (callback) {
            callback(error)
          }
          return
        }
        var points = pageThis.getGroupedPoints(adcode)
        // if (adcode.indexOf('0000') != -1 || adcode.indexOf('00') != -1) {
        //   // no
        // } else {
        // }

        // 当前子区域聚合
        var groups = areaNode.groupByPosition(points, function(item) {
          return item
        })

        pageThis.saveGroupedPoints(areaNode, groups)

        pageThis.renderGroupedPoints(groups)
        if (callback) {
          callback(null, areaNode)
        }
      })
    },
    // 切换区域后刷新显示内容
    refreshAreaNode(areaNode) {
      this.districtExplorer.setHoverFeature(null)
      this.renderAreaPolygons(areaNode)
    },
    // 获取聚合结果
    getGroupedPoints(adcode) {
      return this.groupedPointsCache[adcode] || this.lngLatList
    },
    // 保留中间聚合结果
    saveGroupedPoints(areaNode, groups) {
      for (var i = 0, len = groups.length; i < len; i++) {
        var subFeature = groups[i].subFeature // 所属子区域
        if (!subFeature) {
          this.groupedPointsCache['-out-' + areaNode.getAdcode()] = groups[i].points
          continue
        }
        this.groupedPointsCache[subFeature.properties.adcode] = groups[i].points
      }
    },
    renderGroupedPoints(groups) {
      var pointsData = []
      for (var i = 0, len = groups.length; i < len; i++) {
        var gid = groups[i].subFeatureIndex
        for (var j = 0, jlen = groups[i].points.length; j < jlen; j++) {
          pointsData.push({
            gid: gid,
            pos: groups[i].points[j]
          })
        }
      }
      this.pointSimplifierIns.setData(pointsData)
    },
    // 绘制某个区域的边界
    renderAreaPolygons(areaNode) {
      const pageThis = this
      // 更新地图视野
      pageThis.map.setBounds(areaNode.getBounds(), null, null, true)
      // 清除已有的绘制内容
      pageThis.districtExplorer.clearFeaturePolygons()
      // 绘制子区域
      pageThis.districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
        // var fillColor = pageThis.mapColors[i % pageThis.mapColors.length]
        // var strokeColor = pageThis.mapColors[pageThis.mapColors.length - 1 - i % pageThis.mapColors.length]
        var fillColor = 'transparent'
        var strokeColor = 'transparent'
        return {
          cursor: 'default',
          bubble: true,
          strokeColor: strokeColor, // 线颜色
          strokeOpacity: 1, // 线透明度
          strokeWeight: 1, // 线宽
          fillColor: fillColor, // 填充色
          fillOpacity: 0.05 // 填充透明度
        }
      })
      // 绘制父区域
      pageThis.districtExplorer.renderParentFeature(areaNode, {
        cursor: 'default',
        bubble: true,
        strokeColor: 'black', // 线颜色
        strokeOpacity: 1, // 线透明度
        strokeWeight: 1, // 线宽
        fillColor: null, // 填充色
        fillOpacity: 0.35 // 填充透明度
      })
    },
    // DistrictSearch
    initDistrictSearch(pageThis) {
      AMap.plugin('AMap.DistrictSearch', function() {
        pageThis.district = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，country表示国家
          // level: 'country',
          //  显示下级行政区级数，1表示返回下一级行政区
          subdistrict: 1,
          showbiz: false
        })

        // 搜索所有省/直辖市信息
        pageThis.district.search('中国', function(status, result) {
          // 查询成功时，result即为对应的行政区信息
          if (status === 'complete') {
            pageThis.getData(pageThis, result.districtList[0])
          }
        })
      })
    },
    // PoiPicker
    initPoiPicker(pageThis) {
      AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {
        var poiPicker = new PoiPicker({
          input: 'pickerInput'
        })
        // 初始化poiPicker
        window.poiPicker = poiPicker
        const poiMarker = new AMap.Marker()
        var infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -20)
        })
        // 选取了某个POI
        poiPicker.on('poiPicked', function(poiResult) {
          var source = poiResult.source
          var poi = poiResult.item
          var info = {
            source: source,
            id: poi.id,
            name: poi.name,
            location: poi.location.toString(),
            address: poi.address
          }
          poiMarker.setMap(pageThis.map)
          poiMarker.setPosition(poi.location)
          infoWindow.setMap(pageThis.map)
          infoWindow.setPosition(poi.location)
          infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>')
          infoWindow.open(pageThis.map, poi.location)
          pageThis.map.setCenter(poi.location)
          pageThis.map.setZoom(pageThis.zoomNow + Math.random())
          // pageThis.initMarkerEvent(pageThis, marker, 'rightclick')
        })
        poiPicker.onCityReady(function() {
          // poiPicker.suggest('旅游')
        })
      })
    },
    initMarkers(pageThis) {
      // TODO 根据code检索markers
      // pageThis.map.add(marker)
      AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
        // 标记
        for (const item of this.markerArr) {
          let marker
          if (item.icon !== '' && item.icon !== undefined) {
            let iconContent = ''
            if (item.type === 1) {
              iconContent = '<img style="width: 35px;height: 35px;border: 3px solid #2bcc59;border-radius: 50%;" src="' + item.icon + '" />'
            } else if (item.type === 2) {
              iconContent = '<img style="width: 35px;height: 35px;border: 3px solid #e61624;border-radius: 50%;" src="' + item.icon + '" />'
            } else if (item.type === 3) {
              iconContent = '<img style="width: 35px;height: 35px;border: 3px solid #795cc3;border-radius: 50%;" src="' + item.icon + '" />'
            } else if (item.type === 4) {
              iconContent = '<img style="width: 35px;height: 35px;border: 3px solid #44bee4;border-radius: 50%;" src="' + item.icon + '" />'
            }
            // 自定义标记
            marker = new AMap.Marker({
              position: [item.lng, item.lat],
              content: iconContent,
              // icon: item.icon,
              title: item.label,
              label: item.title,
              autoRotation: true,
              map: pageThis.map, // 设置是否可以拖拽
              draggable: true
              // offset: new AMap.Pixel(10, -10),
              // autoRotation: true,
              // angle: -45
            })
          } else {
            // 默认标记
            marker = new SimpleMarker({
              iconLabel: {
                innerHTML: '<i>' + item.label + '</i>', // 设置文字内容
                style: {
                  color: '#13C0C5' // 设置文字颜色
                }
              },
              iconTheme: 'fresh',
              iconStyle: 'beige',
              map: pageThis.map,
              position: [item.lng, item.lat],
              // 设置是否可以拖拽
              draggable: true
              // animation: 'AMAP_ANIMATION_DROP'
            })
          }
          // marker事件
          pageThis.initMarkerEvent(pageThis, marker, 'rightclick')
          pageThis.initMarkerEvent(pageThis, marker, 'dragend')
        }
      })
    },
    initMarkerEvent(pageThis, marker, event) {
      switch (event) {
        case 'rightclick':
          // 绑定鼠标右击事件——弹出右键菜单
          marker.on('rightclick', function(e) {
            pageThis.contextMenuMarker = e.target
            pageThis.initMapContextMenuForMarker()
            pageThis.contextMenu.open(pageThis.map, e.lnglat)
          })
          break
        case 'dragend':
          // 拖动事件
          marker.on('dragend', function(e) {
            marker.setDraggable(false)
            const newPos = marker.getPosition()
            const extData = marker.getExtData()
            pageThis.contextMenu.close()
            // 调用更新geo接口
            const moveParam = {
              id: extData.id,
              userType: extData.gt,
              oldLng: extData.oldLng,
              oldLat: extData.oldLat,
              newLng: newPos.lng,
              newLat: newPos.lat
            }
            pageThis.$handleAPI('', updateGeoApi, moveParam).then(res => {
              if (Number(res.code) === 200) {
                pageThis.fullScreenLoading = false
              }
            }).catch(function(error) {
              console.log(error)
            })
          })
          break
        default:
          break
      }
    },
    getData(pageThis, data, level) {
      var bounds = data.boundaries
      if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
          var polygon = new AMap.Polygon({
            map: pageThis.map,
            strokeWeight: 2,
            strokeColor: '#13C0C5',
            fillColor: '#80d8ff',
            fillOpacity: 0.1,
            path: bounds[i],
            bubble: true
          })
          pageThis.polygons.push(polygon)
        }
        // TODO 调用马甲接口，初始化markers
        pageThis.map.setFitView() // 地图自适应
      }
    },
    searchObj(pageThis, obj) {
      // 清除地图上所有覆盖物
      for (var i = 0, l = pageThis.polygons.length; i < l; i++) {
        pageThis.polygons[i].setMap(null)
      }
      var levelArr = ['country', 'province', 'city', 'district', 'biz_area']
      // var keyword = obj.areaName // 关键字
      var adcode
      if (obj.level === 1) {
        adcode = obj.areaId + '0000'
      } else if (obj.level === 2) {
        adcode = obj.areaId + '00'
      } else {
        adcode = obj.areaId + ''
      }
      pageThis.district.setLevel(levelArr[obj.level]) // 行政区级别
      pageThis.district.setExtensions('all')
      // 行政区查询
      // 按照adcode进行查询可以保证数据返回的唯一性
      pageThis.district.search(adcode, function(status, result) {
        if (status === 'complete') {
          pageThis.getData(pageThis, result.districtList[0], levelArr[obj.level])
        }
      })
    },
    changeEditable() {
      this.polyline.editable = !this.polyline.editable
    },
    showPopMap() {
      this.popVisable = true
    },
    hidePopMap() {
      this.popVisable = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .template-container {
    padding: 0px;
    margin: 20px;
  }
  #baseMap {
    margin: 0 auto;
    border: 5px solid lightsteelblue;
    border-radius: 5px;
  }
  .cardIcon {
    font-size: 40px;
  }
</style>
<style lang="scss">
.amap-ui-district-cluster-container {
  opacity: 0.25 !important;
}
.amap-ui-district-cluster-marker {
  border: 1px solid #13C0C5 !important;
}
.amap-ui-district-cluster-marker span {
  height: 20px !important;
}
.amap-ui-district-cluster-marker.level_province .amap-ui-district-cluster-marker-body  {
  background-color: #13C0C5 !important;
}
.amap-ui-district-cluster-marker-body {
  border-radius: 0 3px 3px 0 !important;
}
</style>
