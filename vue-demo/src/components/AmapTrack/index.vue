<template>
  <div>
    <div class="baseMapDiv">
      <el-button class="enlargeBtn" type="success" icon="el-icon-search" @click="showPopMap">放大</el-button>
      <div id="baseMap" class="baseMap" :style="'width: 100%;height:' + mapHeight + 'px;'" />
    </div>
    <div v-show="popVisable" class="mapOverlay">
      <el-row style="margin-top: 20vh;">
        <el-col :span="3">&nbsp;</el-col>
        <el-col :span="18">
          <div id="popMap" class="popMap" :style="'width: 100%;height:' + cHeight + 'px;'" />
          <el-button type="default" circle icon="el-icon-close" :style="'position: absolute;top: 0px;z-index: 999;right:' + cWidth/8 + 'px;'" @click="hidePopMap" />
        </el-col>
        <el-col :span="3">&nbsp;</el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Consts from '@/constants'
import VueAMap from 'vue-amap'
import { lazyAMapApiLoaderInstance } from 'vue-amap'
// 初始化
VueAMap.initAMapApiLoader({
  key: Consts.AMAP_KEY,
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  uiVersion: '1.0', // ui库版本，不配置不加载,
  v: '1.4.4'
})
export default {
  name: 'AmapTrack',
  props: {
    // 轨迹数据
    pathData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // marker数据
    markerData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // width
    mapWidth: {
      type: Number,
      default: 800
    },
    // height
    mapHeight: {
      type: Number,
      default: 500
    },
    // 缩放比例
    mapZoom: {
      type: Number,
      default: 12
    }
  },
  data() {
    return {
      cHeight: '',
      cWidth: '',
      popVisable: false,
      polyline: '',
      lineArr: [],
      markerArr: [
        // { label: 'TEST', icon: 'https://webapi.amap.com/images/car.png', lng: 121.471337, lat: 31.232708 },
        // { label: 'TEST', lng: 121.472444, lat: 31.227322 }
      ]
    }
  },
  mounted() {
    this.cHeight = document.documentElement.clientHeight - 300
    this.cWidth = document.documentElement.clientWidth

    this.lineArr = this.pathData
    this.markerArr = this.markerData

    // promise
    lazyAMapApiLoaderInstance.load().then(() => {
      this.initMap('baseMap')
    })
    // 弹窗地图
    lazyAMapApiLoaderInstance.load().then(() => {
      this.initMap('popMap')
    })
  },
  methods: {
    initMap(initName) {
      // 取大概中心的坐标点初始化center，默认上海
      var centerObj
      var centerLng = 121.5273285
      var centerLat = 31.25515044
      if (this.lineArr.length > 0) {
        centerObj = this.lineArr.length > 2 ? this.lineArr[Math.ceil(this.lineArr.length / 2)] : this.lineArr[0]
        centerLng = centerObj[0]
        centerLat = centerObj[1]
      }
      const map = new AMap.Map(initName, {
        center: new AMap.LngLat(centerLng, centerLat),
        zoom: this.mapZoom
      })
      AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
        if (this.lineArr.length > 0 && this.markerArr.length === 0) {
          const start = this.lineArr[0]
          new SimpleMarker({
            iconLabel: {
              innerHTML: '<i>Go</i>', // 设置文字内容
              style: {
                color: '#13C0C5' // 设置文字颜色
              }
            },
            iconTheme: 'fresh',
            iconStyle: 'lightblue',
            map: map,
            position: [start[0] || start.lng, start[1] || start.lat],
            animation: 'AMAP_ANIMATION_DROP'
          })
        }
        // 标记
        for (const item of this.markerArr) {
          if (item.icon !== '' && item.icon !== undefined) {
            // 自定义标记
            new AMap.Marker({
              position: [item.lng, item.lat],
              icon: item.icon,
              iconLabel: item.label,
              autoRotation: true,
              map: map
              // offset: new AMap.Pixel(10, -10),
              // autoRotation: true,
              // angle: -45
            })
          } else {
            // 默认标记
            new SimpleMarker({
              iconLabel: item.label,
              iconStyle: 'pink',
              map: map,
              position: [item.lng, item.lat],
              animation: 'AMAP_ANIMATION_DROP'
            })
          }
        }
        // 绘制轨迹路线
        this.polyline = new AMap.Polyline({
          map: map,
          // 替换坐标数据
          path: this.lineArr,
          showDir: true,
          strokeColor: '#13C0C5', // 线颜色
          strokeOpacity: 1, // 线透明度
          strokeWeight: 5, // 线宽
          strokeStyle: 'solid', // 线样式
          events: {
            click(e) {
              alert('click polyline')
            },
            end: (e) => {
              const newPath = e.target.getPath().map(point => [point.lng, point.lat])
              console.log(newPath)
            }
          },
          editable: false
        })
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
  #baseMap {
    margin: 0 auto;
  }
  .enlargeBtn {
    position: absolute;
    top: 30px;
    z-index: 999;
    right: 15px;
  }
  .mapOverlay {
    z-index: 9999;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
  }
  .baseMapDiv {
    border: 10px solid #f5f7fa;
    border-radius: 10px;
  }
  #popMap {
    margin: 0 auto;
    border: 10px solid lightsteelblue;
    border-radius: 10px;
  }
</style>
