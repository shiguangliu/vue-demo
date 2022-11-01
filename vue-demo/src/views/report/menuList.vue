<template>
  <div class="app-container menuListPage">
    <div class="bg-all">
      <el-row :gutter="20" align="center">
        <el-col v-for="btnInfo in menuList" :key="btnInfo.key" :xs="12" :sm="12" :lg="8">
          <el-button v-if="dataPermits.includes(btnInfo.key)" class="grid-content" :style="'background:' + randomColor()" style="margin-bottom: 20px;" @click="handleClick(btnInfo.link)">
            <p>{{ btnInfo.name }}</p>
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  data() {
    return {
      menuList: [
        { key: 'reportAdvCouponList:export', name: '01-票券领取券码人数统计', link: './adv/couponList' },
        { key: 'reportAdvBonusList:export', name: '02-霸屏红包领取人数及领取金币统计', link: './adv/bonusList' },
        { key: 'reportCurrencyAccountSummary:export', name: '03-用户账户总览统计', link: './currency/accountSummary' },
        { key: 'reportCurrencyTransWithPlat:export', name: '04-平台间货币流通总览', link: './currency/transWithPlat' },
        { key: 'reportCurrencyTransWithUsers:export', name: '05-用户间货币流通总览', link: './currency/transWithUsers' },
        { key: 'reportCurrencyTransWithRobot:export', name: '06-与马甲&陪玩间货币流通总览', link: './currency/transWithRobot' },
        { key: 'reportEquipmentUserHold:export', name: '07-用户车库装备数据统计', link: './equipment/userHold' },
        { key: 'reportEquipmentUserHoldRate:export', name: '08-用户车库装备占有率', link: './equipment/userHoldRate' },
        { key: 'reportMarketTransList:export', name: '09-交易所出售、购买数据统计', link: './market/transList' },
        { key: 'reportMallTransList:export', name: '10-商城(车辆,配件)销售统计', link: './mall/transList' },
        { key: 'reportPkRegularSummary:export', name: '11-常规路赛总览', link: './pk/regularSummary' },
        { key: 'reportPkCrazySummary:export', name: '12-疯狂路赛总览', link: 'pk/crazySummary' },
        { key: 'reportPkMapSummary:export', name: '13-地图使用情况', link: './pk/mapSummary' },
        { key: 'reportPkCupSummary:export', name: '14-官方联赛转化情况', link: './pk/cupSummary' },
        { key: 'reportTripSummary:export', name: '15-启程使用情况', link: './trip/tripSummary' },
        { key: 'reportTripAwardList:export', name: '16-启程奖励情况', link: './trip/awardList' },
        { key: 'reportInviteList:export', name: '17-邀请注册明细', link: './invite/inviteList' },
        { key: 'reportInviteTopList:export', name: '18-邀请注册排行榜', link: './invite/topList' },
        { key: 'reportLotteryBonusList:export', name: '19-转盘奖励情况', link: './lottery/bonusList' },
        { key: 'reportUserLifeCycle:export', name: '20-用户成长周期数据', link: './user/lifeCycle' }
      ],
      colorList: [
        '#d4647d', '#c7ca29', '#8579d1', '#e2944e', '#2a1a30', '#348aa9', '#d1ca95', '#b0a1bf', '#6f7188',
        '#1e8ade', '#61b14a', '#cb5544', '#915eb5', '#95426c', '#31c0db', '#a77160', '#c36668', '#15481d',
        '#eb926c', '#c39451', '#d1ad74', '#73673c', '#efc507', '#1e3670', '#5b7a9a', '#298ea4', '#a16e50',
        '#7f5dcd', '#ae142a', '#b56845'
      ]
    }
  },
  computed: {
    ...mapGetters([
      'staffId',
      'theme',
      'dataPermits'
    ]),
    nopicture() {
      return 'this.src="' + this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
    }
  },
  mounted() {
  },
  methods: {
    randomColor() {
      return this.colorList[Math.floor((Math.random() * this.colorList.length))]
    },
    handleClick(link) {
      this.$router.push({
        path: link,
        query: {},
        replace: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.menuListPage {
  .bg-all {
    width: 60%;
    margin-top: 80px;
    margin-left: auto;
    margin-right: auto;
    background: rgb(245, 242, 242);
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
  }
  .el-button  {
    border: transparent;
    // width: 100% !important;
  }
  .grid-content {
    width: 240px;
    p {
      text-align: left;
      line-height: 20px;
      font-weight: 500;
      font-size: 13px;
      color: white;
    }
  }
}
</style>
