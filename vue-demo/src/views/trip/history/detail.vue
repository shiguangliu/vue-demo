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
      <el-tab-pane label="启程记录详情" name="tab1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户信息</span>
          </div>
          <!-- <el-row>
            <el-col :span="12">

            </el-col>
          </el-row> -->
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
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span> 启程基本信息</span>
          </div>
          <el-row>
            <el-col :span="12">
              <page-form
                :ref-obj.sync="formInfo.ref"
                :data="formInfo.data"
                :field-list="formInfo.fieldList21"
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
                :ref-obj.sync="formInfo.ref"
                :data="formInfo.data"
                :field-list="formInfo.fieldList22"
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
          <div slot="header" class="clearfix">
            <span>位置轨迹信息</span>
          </div>
          <el-row>
            <el-col :span="12">
              <page-form
                :ref-obj.sync="formInfo.ref"
                :data="formInfo.data"
                :field-list="formInfo.fieldList33"
                :rules="formInfo.rules"
                :label-width="formInfo.labelWidth"
                :list-type-info="listTypeInfo"
                :read-only="formInfo.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              />
            </el-col>
            <el-col :span="12">
              <span>轨迹图:</span>
              <AmapTrack v-if="mapVisable" :path-data="pathArr" :marker-data="markerArr" :map-width="500" :map-height="250" />
            </el-col>
          </el-row>
        </el-card>
        <el-card class="box-card" style="min-height:300px">
          <div slot="header" class="clearfix">
            <span>奖励信息</span>
          </div>
          <page-form
            :ref-obj.sync="formInfo.ref"
            :data="formInfo.data"
            :field-list="formInfo.fieldList4"
            :rules="formInfo.rules"
            :label-width="formInfo.labelWidth"
            :list-type-info="listTypeInfo"
            :read-only="formInfo.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
          <page-table
            :data.sync="tableInfo.data"
            :pager="false"
            :auto-fit="false"
            :refresh="tableInfo.refresh"
            :init-curpage="tableInfo.initCurpage"
            :field-list="tableInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="tableInfo.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetailApi, getBonusApi, getTripTrackApi } from '@/api/trip/triphistory'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageTable from '@/components/PageTable'
import defaultImage from '@/assets/img/no-pic.jpg'
import AmapTrack from '@/components/AmapTrack'
export default {
  components: {
    PageFilter,
    PageForm,
    PageTable,
    AmapTrack
  },
  data() {
    return {
      getDetailApi,
      mapVisable: false,
      activeName: 'tab1',
      listTypeInfo: {
        bonusStatusList: [], // 奖励状态待领取，已领取，过期
        tripStatusList: [], // 启程是否结束
        drawStatusList: [], // 中奖未中奖
        bonusItemTypeList: [],
        drawFlagList: [], // 是否翻牌
        genderList: []
      },
      pathArr: [],
      markerArr: [],
      // 过滤相关配置（按钮区）
      filterInfo: {
        query: {
        },
        list: [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-back', event: 'back', show: false }
        ]
      },
      // 表单相关用户基本信息
      formInfo: {
        ref: null,
        readOnly: true,
        data: {
          id: '', // *唯一ID
          userId: '',
          userGender: '',
          userPhone: '',
          searchKeywords: '', // 用户昵称
          mapType: '',
          navigateFlag: '', // 导航模式(1-仅启程  2-启程&导航)
          tripFromLng: '',
          tripFromLat: '',
          tripFromLocation: '',
          tripToLng: '',
          tripToLat: '',
          tripToLocation: '',
          teamId: '',
          tripModeId: '',
          equipmentScores: '',
          startTime: '',
          startLng: '',
          startLat: '',
          tripDays: '',
          tripHours: '',
          tripMinutes: '',
          tripSeconds: '',
          distance: '',
          speed: '',
          speedMax: '',
          trackTime: '',
          endLng: '',
          endLat: '',
          endTime: '',
          lotteryTimes: '',
          drawTimes: '',
          tripGold: '',
          adGold: '',
          status: '',
          modeName: '',
          startDistance: '',
          endDistance: '',
          startCoord: '',
          endCoord: ''
        },
        fieldList: [
          { label: '用户ID', value: 'userId', type: 'tag', className: 'el-form-inline-block-20' },
          { label: '性别', value: 'userGender', type: 'tag', list: 'genderList', key: 'itemValue', name: 'itemName', className: 'el-form-inline-block-20' },
          { label: '手机号', value: 'userPhone', type: 'tag', className: 'el-form-inline-block-20' }
        ],
        fieldList21: [
          { label: '启程ID', value: 'id', type: 'tag', className: 'el-form-block-50' },
          { label: '启程状态', value: 'status', type: 'tag', list: 'tripStatusList', key: 'itemValue', name: 'itemName', className: 'el-form-block-50' },
          { label: '启程开始时间', value: 'startTime', type: 'tag', className: 'el-form-block-50' },
          { label: '启程结束时间', value: 'endTime', type: 'tag', className: 'el-form-block-50' },
          { label: '出行标签', value: 'modeName', type: 'tag', className: 'el-form-block-50' }
        ],
        fieldList22: [
          { label: '行驶距离', value: 'distance', type: 'tag', fixtext: '公里', append: 'append', className: 'el-form-block-50' },
          { label: '行驶时长', value: 'tripTime', type: 'tag', className: 'el-form-block-50' },
          { label: '平均速度', value: 'speed', type: 'tag', fixtext: '公里/小时', append: 'append', className: 'el-form-block-50' },
          { label: '最快速度', value: 'speedMax', type: 'tag', fixtext: '公里/小时', append: 'append', className: 'el-form-block-50' },
          { label: '开始时当日行程', value: 'startDistance', type: 'tag', fixtext: '公里', append: 'append', className: 'el-form-block-50' },
          { label: '结束时当日行程', value: 'endDistance', type: 'tag', fixtext: '公里', append: 'append', className: 'el-form-block-50' }
        ],
        fieldList33: [
          { label: '起点坐标', value: 'startCoord', type: 'tag', className: 'el-form-block-60' },
          { label: '起点位置', value: 'tripFromLocation', type: 'tag', className: 'el-form-block-80' },
          { label: '终点坐标', value: 'endCoord', type: 'tag', className: 'el-form-block-60' },
          { label: '终点位置', value: 'tripToLocation', type: 'tag', className: 'el-form-block-80' }
        ],
        fieldList4: [
          { label: '获得翻牌次数', value: 'lotteryTimes', type: 'tag', className: 'el-form-inline-block-20' },
          { label: '已翻牌次数', value: 'drawTimes', type: 'tag', className: 'el-form-inline-block-20' },
          { label: '里程产生金币数', value: 'tripGold', type: 'tag', className: 'el-form-inline-block-20' },
          { label: '广告产生金币数', value: 'adGold', type: 'tag', className: 'el-form-inline-block-20' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '收获记录ID', value: 'id' },
          { label: '奖励ID', value: 'bonusItemId' },
          { label: '奖励名称', value: 'bonusName' },
          { label: '奖励类型', value: 'bonusTypeName' },
          { label: '奖励数量', value: 'bonusQuantity' },
          { label: '抽奖广告关联ID', value: 'advObjectId' },
          { label: '广告类型', value: 'advTypeName' },
          { label: '广告对象名称', value: 'advName' },
          { label: '中奖/未中奖提示', value: 'statusName' },
          { label: '翻牌状态', value: 'drawFlagName' },
          { label: '领取状态', value: 'hitFlagName' },
          { label: '领取时间', value: 'hitTime' },
          { label: '有效时间', value: 'expiredAt' }
        ]
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
      this.$initDataPermits('tripHistoryDetail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
      //  下拉框需要初始化加载的列表数据
      const statusParams = {
        'configType': 'USER_TRIP_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, statusParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.tripStatusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_HIT_FLAG' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.bonusStatusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_DRAW_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.drawStatusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.bonusItemTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_DRAW_FLAG' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.drawFlagList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENDER_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.genderList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      // 获取url参数
      const id = this.$route.query.id
      // 获取协议详细
      const param = { 'id': id }
      this.$handleAPI('', getDetailApi, param).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          const data = res.data
          data.userGender += ''
          data.status += ''
          // 显示信息
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = data[key]
            }
            if (key === 'tripDays') {
              this.formInfo.data.tripTime = data.tripDays + '天' + data.tripHours + '小时' + data.tripMinutes + '分钟' + data.tripSeconds + '秒'
            }
            if (key === 'startLng') {
              this.formInfo.data.startCoord = data.startLng + ' : ' + data.startLat
            }
            if (key === 'endLng') {
              this.formInfo.data.endCoord = data.endLng + ' : ' + data.endLat
            }
          }
          // console.log(this.formInfo.data)
          if (data.status === '2') { // 启程结束
            this.getBonusList(data.id)
          }
          this.getTripTrack(data.id)
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
    getBonusList(id) {
      this.$handleAPI('', getBonusApi, { 'tripId': id }).then(res => {
        if (res.code === 200) {
          this.tableInfo.data = res.data.list
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
    getTripTrack(id) {
      this.$handleAPI('', getTripTrackApi, { 'id': id }).then(res => {
        if (res.code === 200) {
          this.pathArr = res.data.trackList
          this.mapVisable = true
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
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'back':
          console.log(event)
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (data) {
            console.log(data)
          }
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped >
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

