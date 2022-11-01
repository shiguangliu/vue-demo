<template>
  <div class="racehistory-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="路赛记录详情" name="tab1">

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>比赛信息</span>
          </div>
          <div>
            <el-table :data="data.raceHistoryDto" border class="page-table">
              <el-table-column prop="id" label="比赛ID" align="center" />
              <el-table-column prop="raceTypeName" label="比赛类型" align="center" />
              <el-table-column prop="mapName" label="比赛地图名称" align="center" />
              <el-table-column prop="startTime" label="比赛开始时间" align="center" />
              <el-table-column prop="endTime" label="比赛结束时间" align="center" />
              <el-table-column prop="raceTime" label="比赛时长/s" align="center" />
              <el-table-column prop="raceSourceName" label="比赛来源" align="center" />
              <el-table-column prop="statusName" label="状态" align="center" />
            </el-table>
          </div>
        </el-card>
        <!-- <el-row>
          <el-col>
          </el-col>
        </el-row> -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>比赛详情</span>
          </div>
          <el-col :span="12">
            <user-card
              :user="data.player1Detail"
            />
          </el-col>
          <el-col :span="12" style="padding-left: 10px">
            <user-card
              :user="data.player2Detail"
            />
          </el-col>
        </el-card>
        <el-row>
          <el-col :span="12">
            <el-card>
              <div slot="header" class="clearfix">
                <span>装备性能总分: {{ performance1 }}</span>
                <br>
                <br>
                <div>
                  <el-row>
                    <el-col :span="3">
                      <span>属性分合计:</span>
                    </el-col>
                    <el-col :span="3">
                      <span>动力: {{ powers1 }}</span>
                    </el-col>
                    <el-col :span="3">
                      <span>稳定: {{ stable1 }}</span>
                    </el-col>
                    <el-col :span="3">
                      <span>操控: {{ control1 }}</span>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <el-card v-for="(equip) in data.player1Detail.raceEquipmentDtos" :key="equip.id" class="box-card">
                <el-col :span="8">
                  <el-image
                    v-imgAlart
                    :src="$TH.FILE_URLS.static_url + equip.imageUrl"
                    :onerror="nopicture"
                    :fit="'contain'"
                    class="slot-avatar"
                  />
                </el-col>
                <el-col :span="10" style="padding-left: 40px">
                  <div>
                    <b> {{ equip.itemBrandName }} </b>
                    <span class="equip-font"> {{ equip.rareType }}级</span>
                    <span class="equip-font"> LV{{ equip.itemLevel }}</span>
                  </div>
                  <div style="padding-top: 15px">
                    <span>{{ equip.itemSeriesName }}</span>
                  </div>
                  <div style="padding-top: 15px">
                    <span> 类型:{{ equip.itemTypeName }}</span>
                  </div>
                  <div style="padding-top: 15px">
                    <span> 动力: {{ equip.powers }}</span>
                    <span style="padding-left: 40px"> 稳定: {{ equip.stable }}</span>
                    <span style="padding-left: 40px"> 操控: {{ equip.control }}</span>
                  </div>
                </el-col>
                <el-col :span="6" style="padding-left: 50px">
                  <div>
                    <span> 性能分: {{ equip.performance }}</span>
                  </div>
                </el-col>
              </el-card>
            </el-card>
          </el-col>
          <el-col :span="12" style="padding-left: 10px">
            <el-card>
              <div slot="header" class="clearfix">
                <span>装备性能总分: {{ performance2 }}</span>
                <br>
                <br>
                <div>
                  <el-row>
                    <el-col :span="3">
                      <span>属性分合计:</span>
                    </el-col>
                    <el-col :span="3">
                      <span>动力: {{ powers2 }}</span>
                    </el-col>
                    <el-col :span="3">
                      <span>稳定: {{ stable2 }}</span>
                    </el-col>
                    <el-col :span="3">
                      <span>操控: {{ control2 }}</span>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <el-card v-for="(equip) in data.player2Detail.raceEquipmentDtos" :key="equip.id" class="box-card">
                <el-col :span="8">
                  <el-image
                    v-imgAlart
                    :src="$TH.FILE_URLS.static_url + equip.imageUrl"
                    :onerror="nopicture"
                    :fit="'contain'"
                    class="slot-avatar"
                  />
                </el-col>
                <el-col :span="10" style="padding-left: 40px">
                  <div>
                    <b> {{ equip.itemBrandName }} </b>
                    <span class="equip-font"> {{ equip.rareType }}级</span>
                    <span class="equip-font"> LV{{ equip.itemLevel }}</span>
                  </div>
                  <div style="padding-top: 15px">
                    <span>{{ equip.itemSeriesName }}</span>
                  </div>
                  <div style="padding-top: 15px">
                    <span> 类型:{{ equip.itemTypeName }}</span>
                  </div>
                  <div style="padding-top: 15px">
                    <span> 动力: {{ equip.powers }}</span>
                    <span style="padding-left: 40px"> 稳定: {{ equip.stable }}</span>
                    <span style="padding-left: 40px"> 操控: {{ equip.control }}</span>
                  </div>
                </el-col>
                <el-col :span="6" style="padding-left: 50px">
                  <div>
                    <span> 性能分: {{ equip.performance }}</span>
                  </div>
                </el-col>
              </el-card>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-card>
              <div slot="header" class="clearfix">
                <span>下注信息</span>
              </div>
              <el-card v-for="(bet) in data.player1Detail.raceBetsDtos" :key="bet.id" class="box-card">
                <el-row>
                  <div>
                    <div class="card-panel-icon-wrapper">
                      <el-image
                        v-imgAlart
                        :src="$TH.FILE_URLS.static_url + bet.imageThumbnailUrl"
                        style="height: 30px;width: 40px"
                        class="card-panel-icon"
                      />
                    </div>
                    <div class="card-panel-description">
                      <div class="card-panel-text">
                        {{ bet.itemTypeName }} :
                        <span v-if="bet.itemType !==30 && bet.itemType !==31"> {{ bet.itemName }} </span>
                        <span class="card-panel-num"> +{{ bet.betQuantity }} </span>
                      </div>
                    </div>
                  </div>
                </el-row>
                <el-row style="padding-top: 10px">
                  <div v-if="bet.itemType !==30 && bet.itemType !== 31">
                    <el-col :span="8">
                      <el-image
                        v-imgAlart
                        :src="$TH.FILE_URLS.static_url + bet.imageUrl"
                        :onerror="nopicture"
                        :fit="'contain'"
                        class="slot-avatar"
                      />
                    </el-col>
                    <el-col :span="10" style="padding-left: 40px">
                      <div>
                        <b> {{ bet.itemBrandName }} </b>
                        <span class="equip-font"> {{ bet.rareType }}级</span>
                        <span class="equip-font"> LV{{ bet.itemLevel }}</span>
                      </div>
                      <div style="padding-top: 15px">
                        <span>{{ bet.itemSeriesName }}</span>
                      </div>
                      <div style="padding-top: 15px">
                        <span> 类型:{{ bet.itemTypeName }}</span>
                      </div>
                      <div style="padding-top: 15px">
                        <span> 动力: {{ bet.powers }}</span>
                        <span style="padding-left: 40px"> 稳定: {{ bet.stable }}</span>
                        <span style="padding-left: 40px"> 操控: {{ bet.control }}</span>
                      </div>
                    </el-col>
                    <el-col :span="6" style="padding-left: 50px">
                      <div>
                        <span> 性能分: {{ bet.performance }}</span>
                      </div>
                    </el-col>
                  </div>
                </el-row>
              </el-card>
            </el-card>
          </el-col>
          <el-col :span="12" style="padding-left: 10px">
            <el-card>
              <div slot="header" class="clearfix">
                <span>下注信息</span>
              </div>
              <el-card v-for="(bet) in data.player2Detail.raceBetsDtos" :key="bet.id" class="box-card">
                <el-row>
                  <div>
                    <div class="card-panel-icon-wrapper">
                      <el-image
                        v-imgAlart
                        :src="$TH.FILE_URLS.static_url + bet.imageThumbnailUrl"
                        style="height: 30px;width: 40px"
                        class="card-panel-icon"
                      />
                    </div>
                    <div class="card-panel-description">
                      <div class="card-panel-text">
                        {{ bet.itemTypeName }} :
                        <span v-if="bet.itemType !==30 && bet.itemType !==31"> {{ bet.itemName }} </span>
                        <span class="card-panel-num"> +{{ bet.betQuantity }} </span>
                      </div>
                    </div>
                  </div>
                </el-row>
                <el-row style="padding-top: 10px">
                  <div v-if="bet.itemType !==30 && bet.itemType !== 31">
                    <el-col :span="8">
                      <el-image
                        v-imgAlart
                        :src="$TH.FILE_URLS.static_url + bet.imageUrl"
                        :onerror="nopicture"
                        :fit="'contain'"
                        class="slot-avatar"
                      />
                    </el-col>
                    <el-col :span="10" style="padding-left: 40px">
                      <div>
                        <b> {{ bet.itemBrandName }} </b>
                        <span class="equip-font"> {{ bet.rareType }}级</span>
                        <span class="equip-font"> LV{{ bet.itemLevel }}</span>
                      </div>
                      <div style="padding-top: 15px">
                        <span>{{ bet.itemSeriesName }}</span>
                      </div>
                      <div style="padding-top: 15px">
                        <span> 类型:{{ bet.itemTypeName }}</span>
                      </div>
                      <div style="padding-top: 15px">
                        <span> 动力: {{ bet.powers }}</span>
                        <span style="padding-left: 40px"> 稳定: {{ bet.stable }}</span>
                        <span style="padding-left: 40px"> 操控: {{ bet.control }}</span>
                      </div>
                    </el-col>
                    <el-col :span="6" style="padding-left: 50px">
                      <div>
                        <span> 性能分: {{ bet.performance }}</span>
                      </div>
                    </el-col>
                  </div>
                </el-row>
              </el-card>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getRaceHistoryDetail } from '@/api/race/racehistory'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import UserCard from './components/UserCard'
import defaultImage from '@/assets/img/no-pic.jpg'
export default {
  components: {
    PageFilter,
    UserCard
  },
  data() {
    return {
      activeName: 'tab1',
      data: {
        raceHistoryDto: [],
        player1Detail: {
          raceEquipmentDtos: []
        },
        player2Detail: {
          raceEquipmentDtos: []
        }
      }, // 所有数据
      performance1: 0,
      performance2: 0,
      stable1: 0,
      stable2: 0,
      control1: 0,
      control2: 0,
      powers1: 0,
      powers2: 0,
      listTypeInfo: {
        userTypeList: []
      },
      // 过滤相关配置（按钮区）
      filterInfo: {
        query: {
        },
        list: [
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
      return (
        'this.src="' +
        this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
      )
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
      this.$initDataPermits('raceHistoryDetail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_USER_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.userTypeList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      // this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    getDetail() {
      // 初始化设置 form fileds
      // if (this.formInfo.ref) {
      //   this.formInfo.ref.resetFields()
      // }
      // 获取url参数
      // this.formInfo.data.id = this.$route.query.id
      // 获取version详细
      const param = { 'id': this.$route.query.id }
      this.$handleAPI('', getRaceHistoryDetail, param).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          const data = res.data
          var arr = []
          var raceTime = (new Date(data.raceHistoryDto.endTime) - new Date(data.raceHistoryDto.startTime)) / 1000
          data.raceHistoryDto.raceTime = raceTime
          arr.push(data.raceHistoryDto)
          this.data.raceHistoryDto = arr
          data.player1Detail.raceEquipmentDtos.forEach(item => {
            this.performance1 += item.performance
            this.powers1 += item.powers
            this.control1 += item.control
            this.stable1 += item.stable
          })
          data.player2Detail.raceEquipmentDtos.forEach(item => {
            this.performance2 += item.performance
            this.powers2 += item.powers
            this.control2 += item.control
            this.stable2 += item.stable
          })
          this.listTypeInfo.userTypeList.forEach(item => {
            if (Number(item.itemValue) === Number(data.player1Detail.userType)) {
              data.player1Detail.userTypeName = item.itemName
            }
            if (Number(item.itemValue) === Number(data.player2Detail.userType)) {
              data.player2Detail.userTypeName = item.itemName
            }
          })
          data.player1Detail.playerResult = data.raceHistoryDto.player1Result
          data.player2Detail.playerResult = data.raceHistoryDto.player2Result
          if (Number(data.raceHistoryDto.status) === 4) {
            data.player1Detail.playerResult = 3 // 终止比赛
            data.player2Detail.playerResult = 3
          }
          if (Number(data.raceHistoryDto.raceType) === 30) {
            data.player1Detail.raceResultDtos.push({
              itemTypeName: '积分',
              rewardQuantity: data.raceHistoryDto.player1Result > 1 ? ~data.raceHistoryDto.scoreLose : data.raceHistoryDto.scoreWin
            })
            data.player2Detail.raceResultDtos.push({
              itemTypeName: '积分',
              rewardQuantity: data.raceHistoryDto.player2Result > 1 ? ~data.raceHistoryDto.scoreLose : data.raceHistoryDto.scoreWin
            })
          }
          this.data.player1Detail = data.player1Detail
          this.data.player2Detail = data.player2Detail
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
    initButtonList(status) {
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'list':
          break
      }
    },
    handleEvent(event, data) {
      switch (event) {
        case 'list':
          break
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .racehistory-container {
    height: 800px;
    padding: 20px;

    .slot-avatar{
      height: 110px;
      display: flex;
      align-items: center;
      img{
        padding-right: 10px;
      }
    }
    .equip-font {
      font-size: 10;
      color: rgb(0, 110, 255);
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
    .card-panel-icon-wrapper {
      float: left;
      margin: 2px 0 0 0px;
      padding: 2px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: left;
      font-weight: bold;
      // margin: 10px;
      margin-left: 1px;
      margin-top: 15px;

      .card-panel-text {
        // line-height: 20px;
        color: rgba(3, 3, 3, 0.45);
        font-size: 12px;
        margin-bottom: 3px;
      }

      .card-panel-num {
        font-size: 12px;
        color: #d13535
      }
    }
  }
</style>

