<template>
  <div class="cup-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card" @tab-click="userEquipmentList">
      <el-tab-pane label="官方联赛详情" name="tab1">
        <el-row>
          <el-col :span="12">
            <page-form
              :ref-obj.sync="formInfo.ref1"
              :data="formInfo.data"
              :field-list="formInfo.fieldList"
              :rules="formInfo.rules"
              :label-width="formInfo.labelWidth"
              :list-type-info="listTypeInfo"
              :read-only="formInfo.readOnly"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            >
              <template v-slot:form-announceTime>
                <el-date-picker
                  v-model="formInfo.data.announceTime"
                  type="datetime"
                  placeholder="选择结果公布时间"
                />
              </template>
            </page-form>
          </el-col>
          <el-col :span="12">
            <page-form
              :ref-obj.sync="formInfo.ref2"
              :data="formInfo.data"
              :field-list="formInfo.fieldList2"
              :rules="formInfo.rules"
              :label-width="formInfo.labelWidth"
              :list-type-info="listTypeInfo"
              :read-only="formInfo.readOnly"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="名次及奖励设置" name="tab2" style="min-height:200px">
        <div style="margin-left:450px">
          <el-button v-if="formInfo.data.status == 1" type="primary" icon="el-icon-plus" @click="handleClick('addRankInfo')">新增名次奖项</el-button>
          <el-button v-if="formInfo.data.status == 1" type="primary" icon="el-icon-check" @click="handleClick('saveRankInfo')">保存名次奖项</el-button>
        </div>
        <el-card v-for="(rankInfo, cardIndex) in formInfo.rankList" :key="cardIndex" class="box-card">
          <div slot="header" class="clearfix">
            <el-button v-if="formInfo.data.status === 1" style="float: right; padding: 3px 0" type="text" @click="deleteRankInfo(cardIndex,rankInfo)"><i class="el-icon-delete" /></el-button>
          </div>
          <page-form
            :ref-obj.sync="formInfo.refRankInfo"
            :data="rankInfo"
            :field-list="formInfo.fieldRankList"
            :rules="formInfo.rulesRaceRank"
            :label-width="formInfo.labelWidth"
            :list-type-info="listTypeInfo"
            :read-only="formInfo.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
          <div style="height:40px">
            <el-button v-if="formInfo.data.status == 1" type="primary" icon="el-icon-plus" @click="addReward(cardIndex)">添加奖励</el-button>
          </div>
          <div>
            <el-table :data="rankInfo.prizes" border class="page-table">
              <el-table-column prop="rewardTypeName" label="奖励类型" align="center" />
              <el-table-column prop="itemId" label="装备ID" align="center" />
              <el-table-column prop="itemTypeName" label="装备类型" align="center" />
              <el-table-column prop="itemName" label="装备名称" align="center" />
              <el-table-column label="缩略图" align="center">
                <template slot-scope="scope">
                  <img
                    v-if="scope.row.rewardType != 9"
                    v-imgAlart
                    :src="$TH.FILE_URLS.static_url + scope.row.imageThumbnailUrl"
                    style="height: 40px;"
                    :onerror="nopicture"
                  >
                  <span v-if="scope.row.rewardType == 9"><i class="cardIcon fa fa-jpy" /></span>
                </template>
              </el-table-column>
              <el-table-column prop="rewardQuantity" label="奖励数量" align="center" />
              <el-table-column
                fixed="right"
                label="操作"
                width="100"
              >
                <template slot-scope="scope">
                  <el-button v-if="formInfo.data.status === 1" type="danger" size="mini" @click="deleteReward(scope.$index, rankInfo)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="报名用户信息" name="tab3">
        <!-- 条件栏 -->
        <page-filter
          :query.sync="filterInfo2.query"
          :filter-list="filterInfo2.list"
          :list-type-info="listTypeInfo"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
        <!-- 表格 -->
        <page-table
          :refresh="tableInfo2.refresh"
          :table-index="tableInfo2.tableIndex"
          :init-curpage="tableInfo2.initCurpage"
          :data.sync="tableInfo2.data"
          :api="getCupJoinsList"
          :query="filterInfo2.query"
          :field-list="tableInfo2.fieldList"
          :list-type-info="listTypeInfo"
          :handle="tableInfo2.handle"
          :check-box="tableInfo2.checkBox"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <template v-slot:col-scoreRank="scope">
            <p v-if="scope.row.scoreRank != 99999999">{{ scope.row.scoreRank }}</p>
            <p v-if="scope.row.scoreRank == 99999999">{{ '-' }}</p>
          </template>
          <template v-slot:col-status="scope">
            <p v-if="scope.row.status == 0">{{ '待支付' }}</p>
            <p v-if="scope.row.status == 1">{{ '支付成功' }}</p>
            <p v-if="scope.row.status == 2">{{ '退出联赛' }}</p>
          </template>
          <!-- 自定义插槽状态按钮 -->
          <template v-slot:bt-modifyScore="scope">
            <el-button
              v-if="scope.data.item.show && (!scope.data.item.ifRender || scope.data.item.ifRender(scope.data.row))"
              v-waves
              size="mini"
              class="handle-button"
              :type="'primary'"
              :icon="scope.data.item.icon"
              :disabled="scope.data.row.userType === 1? true : false"
              :loading="scope.data.row[scope.data.item.loading]"
              @click="handleClick(scope.data.item.event, scope.data.row)"
            >
              {{ scope.data.item.label }}
            </el-button>
          </template>
        </page-table>
      </el-tab-pane>
      <el-tab-pane label="用户比赛详情" name="tab4">
        <!-- 条件栏 -->
        <page-filter
          :query.sync="filterInfo3.query"
          :filter-list="filterInfo3.list"
          :list-type-info="listTypeInfo"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
        <!-- 表格 -->
        <page-table
          :refresh="tableInfo3.refresh"
          :table-index="tableInfo3.tableIndex"
          :init-curpage="tableInfo3.initCurpage"
          :data.sync="tableInfo3.data"
          :api="getRaceUserList"
          :query="filterInfo3.query"
          :field-list="tableInfo3.fieldList"
          :list-type-info="listTypeInfo"
          :handle="tableInfo3.handle"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <template v-slot:col-id="scope">
            <el-link type="primary" @click="competitionDetails(scope.row)">{{ scope.row.id }}</el-link>
          </template>
          <template v-slot:col-getGoldCoin="scope">
            <p v-if="scope.row.goldCoin == 0">{{ '-' }}</p>
            <p v-if="scope.row.goldCoin > 0">{{ '+' + scope.row.goldCoin }}</p>
            <p v-if="scope.row.goldCoin < 0">{{ scope.row.goldCoin }}</p>
          </template>
          <template v-slot:col-scoreWin="scope">
            <p v-if="scope.row.playerResult == 1">{{ '+' + scope.row.scoreWin }}</p>
            <p v-if="scope.row.playerResult == 2">{{ scope.row.scoreLose * -1 }}</p>
          </template>
        </page-table>
      </el-tab-pane>
    </el-tabs>
    <page-dialog
      :title="dialogGameItem.title"
      :visible.sync="dialogGameItem.visible"
      :width="dialogGameItem.width"
      :bt-loading="dialogGameItem.btLoading"
      :bt-list="dialogGameItem.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <PopGameItem @pickItem="pickItem" />
    </page-dialog>
    <page-dialog
      :width="dialogAdd.width"
      :visible.sync="dialogAdd.visible"
      :title="dialogAdd.title[dialogAdd.type]"
      :bt-loading="dialogAdd.btLoading"
      :bt-list="dialogAdd.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <div class="slot-avatar1">
        <el-row v-if="dialogAdd.type!='money'">
          装备的ID:
          <el-input
            v-model="curItemId"
            style="width:50%"
            type="tag"
            disabled
          />
        </el-row>
        <el-row v-if="dialogAdd.type!='money'">
          装备名称:
          <el-input
            v-model="curItemName"
            style="width:50%;margin-top:10px"
            type="tag"
            disabled
          />
        </el-row>
        <el-row>
          <span v-if="dialogAdd.type=='money'">金额(元):</span>
          <span v-else>添加数量:</span>
          <el-input
            v-model="inputCount"
            style="width:50%;margin-top:10px"
            placeholder="请输入数量"
            type="number"
          />
        </el-row>
      </div>
    </page-dialog>
    <page-dialog
      :width="dialogRewardDetails.width"
      :visible.sync="dialogRewardDetails.visible"
      :title="dialogRewardDetails.title[dialogRewardDetails.type]"
      :bt-loading="dialogRewardDetails.btLoading"
      :bt-list="dialogRewardDetails.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <el-table
        :data="rewardDetailsList"
        border
        tooltip-effect="dark"
        style="width: 100%;height: 100%"
      >
        <el-table-column label="奖励类型" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.rewardTypeName || '-' }}</template>
        </el-table-column>
        <el-table-column label="装备ID" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.itemId || '-' }}</template>
        </el-table-column>
        <el-table-column label="装备类型" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.rewardType ==9?'-':scope.row.itemTypeName }}</template>
        </el-table-column>
        <el-table-column label="装备名称" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.rewardType ==9?'-':scope.row.itemName }}</template>
        </el-table-column>
        <el-table-column label="奖励数量" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.rewardType ==9?'-':scope.row.rewardQuantity }}</template>
        </el-table-column>
        <el-table-column label="奖励金额" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.rewardType == 9?scope.row.rewardQuantity:'-' }}</template>
        </el-table-column>
        <el-table-column label="奖励状态" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.statusName || '-' }}</template>
        </el-table-column>
        <el-table-column label="发放时间" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.status ==0?'-':scope.row.updateTime }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status ==0"
              v-waves
              type="primary"
              size="mini"
              @click="handleClick('confirmDistribution',scope.row)"
            >
              {{ '确认发放' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </page-dialog>
    <!-- 添加奖励 -->
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
        <el-col v-for="(item, index) in objectTypeList" :key="index" :span="6">
          <el-button type="default" style="width: 100%;margin-bottom: 10px;" @click="clickObjType(item)">
            <div style="padding: 10px;">
              <i v-if="item.itemValue == 1" class="cardIcon el-icon-coin" />
              <i v-if="item.itemValue == 2" class="cardIcon fa fa-diamond" />
              <i v-if="item.itemValue == 3" class="cardIcon el-icon-setting" />
              <i v-if="item.itemValue == 9" class="cardIcon fa fa-jpy" />
              <h3 class="icon-name">{{ item.itemName }}</h3>
            </div>
          </el-button>
        </el-col>
      </el-row>
    </page-dialog>
    <page-dialog
      :title="popupDialog.title"
      :visible.sync="popupDialog.visible"
      :width="popupDialog.width"
      :bt-loading="popupDialog.btLoading"
      :bt-list="popupDialog.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <PopGameItem v-if="popupDialog.visible && popupDialog.typeVal == 1" :custom-query="{ diff: undefined, itemType: '30'}" @pickItem="pickItem" />
      <PopGameItem v-if="popupDialog.visible && popupDialog.typeVal == 2" :custom-query="{ diff: undefined, itemType: '31' }" @pickItem="pickItem" />
      <PopGameItem v-if="popupDialog.visible && popupDialog.typeVal == 3" :custom-query="{ diff: 1}" @pickItem="pickItem" />
    </page-dialog>
    <page-dialog
      :title="dialogInfo.title"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- form -->
      <page-form
        :ref-obj.sync="formInfo2.ref"
        :data="formInfo2.data"
        :field-list="formInfo2.fieldList"
        :rules="formInfo2.rules"
        :label-width="formInfo2.labelWidth"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
    </page-dialog>
    <page-dialog
      :title="insertRobot.title"
      :visible.sync="insertRobot.visible"
      :width="insertRobot.width"
      :bt-loading="insertRobot.btLoading"
      :bt-list="insertRobot.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <div style="margin-bottom: 20px">
        <h2>{{ '设置马甲数量及条件' }}</h2>
      </div>
      <br>
      <!-- form -->
      <page-form
        :ref-obj.sync="formInfoRobot.ref"
        :data="formInfoRobot.data"
        :field-list="formInfoRobot.fieldList"
        :rules="formInfoRobot.rules"
        :label-width="formInfoRobot.labelWidth"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
    </page-dialog>
    <page-dialog
      :title="updateUserScore.title"
      :visible.sync="updateUserScore.visible"
      :width="updateUserScore.width"
      :bt-loading="updateUserScore.btLoading"
      :bt-list="updateUserScore.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-form
        :ref-obj.sync="formInfoUserScore.ref"
        :data="formInfoUserScore.data"
        :field-list="formInfoUserScore.fieldList"
        :rules="formInfoUserScore.rules"
        :label-width="formInfoUserScore.labelWidth"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetailApi, updateDetailApi, deleteApi, getRankInfoApi, updateRankInfoApi, getCupJoinsList, exportCupJoinsList, getRaceUserList, getRaceRewardList, raceRewardConfirmDistribution, getRaceRewardUserDetails, raceCupJoinsInsertRobot, raceCupJoinsDelRobot, raceCupRobotUpdateScore, raceCupRobotResultsRelease, copyApi, editDetailApi } from '@/api/race/racecup'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import PopGameItem from '@/components/Popup/PopGameItem'
import PageTable from '@/components/PageTable'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageFilter,
    PageForm,
    PageDialog,
    PopGameItem,
    PageTable
  },
  data() {
    const checkNumber = (rule, value, callback) => {
      const check = this.$validate({ label: '', value, rules: ['notnull', 'number'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        if (value <= 0) {
          callback(new Error('必须大于0'))
        } else {
          callback()
        }
      }
    }
    const checkValidDate = (rule, value, callback) => {
      var msg = ''
      if (value === null || value === '') {
        msg = '请选择联赛时间!'
      }
      if (value !== null && value.length !== 0) {
        var dt1 = new Date(value[0])
        var dt2 = new Date(value[1])
        var dt8 = new Date()
        if (dt1 < dt8) {
          msg = '联赛开始时间必须大于当前时间!'
        }
        if (this.formInfo.data.announceTime !== null && this.formInfo.data.announceTime !== '') {
          var dt4 = new Date(this.formInfo.data.announceTime)
          if (dt2 > dt4) {
            msg = '联赛结束时间必须小于联赛结果公布时间'
          }
        }
        if (this.formInfo.data.deadLine !== null && this.formInfo.data.deadLine !== '') {
          var dt3 = new Date(this.formInfo.data.deadLine)
          if (dt1 < dt3) {
            msg = '联赛开始时间必须大于报名截止时间!'
          }
        }
        if (this.formInfo.data.releaseTo !== null && this.formInfo.data.releaseTo !== '') {
          var dt5 = new Date(this.formInfo.data.releaseTo)
          if (dt2 > dt5) {
            msg = '联赛结束时间必须小于上架结束时间!'
          }
        }
        if (this.formInfo.data.releaseFrom !== null && this.formInfo.data.releaseFrom !== '') {
          var dt6 = new Date(this.formInfo.data.releaseFrom)
          if (dt1 < dt6) {
            msg = '联赛开始时间必须大于上架开始时间!'
          }
        }
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    const checkAnnounceTimeDate = (rule, value, callback) => {
      var msg = ''
      if (value === null || value === '') {
        msg = '请选择联赛结果公布时间'
      }
      if (value !== null && value !== '') {
        var dt1 = new Date(value)
        var dt8 = new Date()
        if (dt1 < dt8) {
          msg = '联赛结果公布时间必须大于当前时间!'
        }
        if (this.formInfo.data.validTo !== null && this.formInfo.data.validTo !== '') {
          var dt2 = new Date(this.formInfo.data.validTo)
          if (dt1 < dt2) {
            msg = '联赛结果公布时间必须大于联赛结束日期'
          }
        }
        if (this.formInfo.data.releaseTo !== null && this.formInfo.data.releaseTo !== '') {
          var dt3 = new Date(this.formInfo.data.releaseTo)
          if (dt1 > dt3) {
            msg = '联赛结果公布时间必须小于上架结束日期'
          }
        }
        if (this.formInfo.data.releaseFrom !== null && this.formInfo.data.releaseFrom !== '') {
          var dt4 = new Date(this.formInfo.data.releaseFrom)
          if (dt1 < dt4) {
            msg = '联赛结果公布时间必须大于上架开始日期'
          }
        }
        if (this.formInfo.data.deadLine !== null && this.formInfo.data.deadLine !== '') {
          var dt5 = new Date(this.formInfo.data.releaseFrom)
          if (dt1 < dt5) {
            msg = '联赛结果公布时间必须大于报名截止日期'
          }
        }
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    const checkEnrollDate = (rule, value, callback) => {
      var msg = ''
      if (value === null || value === '') {
        msg = '请选择报名日期!'
      }
      if (value !== null && value.length !== 0) {
        var dt1 = new Date(value[0])
        var dt2 = new Date(value[1])
        var dt8 = new Date()
        if (dt1 < dt8) {
          msg = '报名开始时间必须大于当前时间!'
        }
        if (this.formInfo.data.validFrom !== null && this.formInfo.data.validFrom !== '') {
          var dt3 = new Date(this.formInfo.data.validFrom)
          if (dt2 > dt3) {
            msg = '报名结束时间必须小于联赛开始时间!'
          }
        }
        if (this.formInfo.data.releaseTo !== null && this.formInfo.data.releaseTo !== '') {
          var dt4 = new Date(this.formInfo.data.releaseTo)
          if (dt2 > dt4) {
            msg = '报名结束时间必须小于上架结束时间!'
          }
        }
        if (this.formInfo.data.releaseFrom !== null && this.formInfo.data.releaseFrom !== '') {
          var dt5 = new Date(this.formInfo.data.releaseFrom)
          if (dt1 < dt5) {
            msg = '报名开始时间必须大于上架开始时间!'
          }
        }
        if (this.formInfo.data.announceTime !== null && this.formInfo.data.announceTime !== '') {
          var dt6 = new Date(this.formInfo.data.announceTime)
          if (dt2 > dt6) {
            msg = '报名截止时间必须小于结果公布时间!'
          }
        }
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    const checkReleaseDate = (rule, value, callback) => {
      var msg = ''
      if (value === null || value === '') {
        msg = '请选择上架时间!'
      }
      if (value !== null && value.length !== 0) {
        var dt1 = new Date(value[0])
        var dt2 = new Date(value[1])
        var dt8 = new Date()
        if (dt1 < dt8) {
          msg = '上架开始时间必须大于当前时间!'
        }
        if (this.formInfo.data.announceTime !== null && this.formInfo.data.announceTime !== '') {
          var dt3 = new Date(this.formInfo.data.announceTime)
          if (dt2 < dt3) {
            msg = '上架结束时间必须大于联赛结果公布时间!'
          }
          if (dt1 > dt3) {
            msg = '上架开始时间必须小于联赛结果公布时间!'
          }
        }
        if (this.formInfo.data.validTo !== null && this.formInfo.data.validTo !== '') {
          var dt4 = new Date(this.formInfo.data.validTo)
          if (dt2 < dt4) {
            msg = '上架结束时间必须大于联赛结束时间!'
          }
        }
        if (this.formInfo.data.validFrom !== null && this.formInfo.data.validFrom !== '') {
          var dt5 = new Date(this.formInfo.data.validFrom)
          if (dt1 > dt5) {
            msg = '上架开始时间必须小于联赛开始时间!'
          }
        }
        if (this.formInfo.data.enrollFrom !== null && this.formInfo.data.enrollFrom !== '') {
          var dt6 = new Date(this.formInfo.data.enrollFrom)
          if (dt1 > dt6) {
            msg = '上架开始时间必须小于报名开始时间!'
          }
        }
        if (this.formInfo.data.deadLine !== null && this.formInfo.data.deadLine !== '') {
          var dt7 = new Date(this.formInfo.data.deadLine)
          if (dt2 < dt7) {
            msg = '上架结束时间必须大于报名结束时间!'
          }
        }
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    const checkRobotNumber = (rule, value, callback) => {
      const check = this.$validate({ label: '马甲数量', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkPerformanceFrom = (rule, value, callback) => {
      const check = this.$validate({ label: '装备起始性能分', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkPerformanceTo = (rule, value, callback) => {
      const check = this.$validate({ label: '装备截止性能分', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkUpdScore = (rule, value, callback) => {
      const check = this.$validate({ label: '修改后积分', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkUpRaceTotal = (rule, value, callback) => {
      const check = this.$validate({ label: '修改后局数', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      activeName: 'tab1',
      downloadLoading: false,
      // checkbox 选中的列表
      checkBoxList: [],
      readOnly: false,
      inputCount: 1,
      objectTypeList: [],
      objTypeDialog: {
        title: '选择奖励类型',
        visible: false,
        btLoading: false,
        width: '800px',
        height: '300px'
      },
      curIndex: 0,
      curItemId: 0,
      curItemName: '',
      getCupJoinsList,
      getRaceUserList,
      rewardDetailsList: [],
      listTypeInfo: {
        statusList: [],
        cupStatusList: [],
        payTypeList: [],
        robotUserTypeList: [],
        robotUserStatusList: [
          {
            'itemValue': '0',
            'itemName': '待支付'
          },
          {
            'itemValue': '1',
            'itemName': '支付成功'
          },
          {
            'itemValue': '2',
            'itemName': '退出联赛'
          }
        ],
        sortTypeList: []
      },
      isNeedSaveRankInfo: false,
      // 过滤相关配置（按钮区）
      filterInfo: {
        query: {
        },
        list: [
          // { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          // { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
      },
      // 表单相关（追加、修改）
      formInfo: {
        ref1: null,
        ref2: null,
        refRankInfo: null,
        data: {
          id: '', // *唯一ID
          phaseNo: '',
          cupTitle: '',
          description: '',
          validFrom: '',
          validTo: '',
          valid: [],
          enrollFrom: '',
          deadLine: '',
          enroll: [],
          applyLimit: '',
          applyTotal: '',
          applyFee: '',
          payType: '',
          scoreWin: '',
          scoreLose: '',
          rankLimit: '',
          applyTime: '',
          applyBy: '',
          approveTime: '',
          approveBy: '',
          approveReason: '',
          releaseFrom: '',
          releaseTo: '',
          release: [],
          cupStatus: '',
          status: '',
          announceFlag: '',
          announceTime: '',
          approveByName: '',
          applyByName: ''
        },
        rankList: [
          // {
          //   cupId: '',
          //   raceRank: '',
          //   raceRankName: '',
          //   sortFrom: '',
          //   sortTo: '',
          //   sortType: '',
          //   prizes: [
          //     {
          //       id: '',
          //       rewardType: '',
          //       rewardTypeName: '',
          //       rewardQuantity: '',
          //       itemId: '',
          //       itemType: '',
          //       itemTypeName: '',
          //       imageThumbnailUrl: ''
          //     }
          //   ]
          // }
        ],
        fieldList: [
          { label: '官方联赛ID', value: 'id', type: 'tag' },
          { label: '联赛期数', value: 'phaseNo', type: 'tag', fixtext: '期', append: 'append' },
          { label: '联赛名称', value: 'cupTitle', type: 'input', required: true },
          { label: '联赛状态', value: 'cupStatus', type: 'tag', list: 'cupStatusList', key: 'itemValue', name: 'itemName', required: true },
          { label: '报名日期', value: 'enroll', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changeEnroll', required: true, className: 'el-form-block-100', validator: checkEnrollDate },
          { label: '联赛日期', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changeValid', required: true, className: 'el-form-block-100', validator: checkValidDate },
          { label: '上架时间', value: 'release', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changeRelease', required: true, className: 'el-form-block-100', validator: checkReleaseDate },
          { label: '结果公布时间', value: 'announceTime', type: 'slot', required: true, validator: checkAnnounceTimeDate },
          { label: '结果公布标志', value: 'announceFlagName', type: 'tag' },
          { label: '已报名人数', value: 'applyTotal', type: 'tag', fixtext: '人', append: 'append' },
          { label: '报名人数限制', value: 'applyLimit', type: 'input', fixtext: '人', append: 'append', required: true, validator: checkNumber },
          { label: '报名付款方式', value: 'payType', type: 'customselect', list: 'payTypeList', key: 'itemValue', name: 'itemName', required: true },
          { label: '报名费', value: 'applyFee', type: 'input', required: true, validator: checkNumber },
          { label: '胜方加分值', value: 'scoreWin', type: 'input', fixtext: '分', append: 'append', required: true, validator: checkNumber },
          { label: '负方扣分值', value: 'scoreLose', type: 'input', fixtext: '分', append: 'append', required: true, validator: checkNumber },
          { label: '设立名次', value: 'rankLimit', type: 'input', fixtext: '名', append: 'append', required: true, validator: checkNumber },
          { label: '联赛介绍', value: 'description', type: 'textarea', autosize: { minRows: 5, maxRows: 10 }, required: true, className: 'el-form-block-100' }
        ],
        fieldList2: [
          { label: '发布状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-block-30' },
          { label: '提交审批人', value: 'applyByName', type: 'tag' },
          { label: '提交审批时间', value: 'applyTime', type: 'tag' },
          { label: '审批用户', value: 'approveByName', type: 'tag' },
          { label: '审批时间', value: 'approveTime', type: 'tag' },
          { label: '审批理由', value: 'approveReason', type: 'textarea', autosize: { minRows: 5, maxRows: 10 }, required: true, className: 'el-form-block-100' }
        ],
        fieldRankList: [
          { label: '奖项名次', value: 'raceRank', type: 'tag', required: true, validator: checkNumber },
          { label: '奖项描述', value: 'raceRankName', type: 'input', required: true, event: 'changeOther' },
          { label: '起始排名', value: 'sortFrom', type: 'input', required: true, validator: checkNumber, event: 'changeOther' },
          { label: '排名类型', value: 'sortType', type: 'customselect', list: 'sortTypeList', key: 'itemValue', name: 'itemName', required: true, event: 'changeSortType' },
          { label: '结束排名', value: 'sortTo', type: 'input', required: true, validator: checkNumber, event: 'changeOther' }
        ],
        rules: {},
        rulesRaceRank: {},
        labelWidth: '120px'
      },
      // 过滤相关配置（检索条件）
      filterInfo2: {
        query: {
          cupId: '',
          userId: '',
          phone: '',
          valid: [],
          validFrom: '',
          validTo: '',
          userType: '',
          rankingFrom: '',
          rankingTo: '',
          sort: '',
          status: '',
          performanceFrom: '',
          performanceTo: ''
        },
        list: [
          { type: 'input', label: '用户ID', value: 'userId' },
          { type: 'input', label: '手机号码', value: 'phone' },
          { type: 'datetimerange', label: '报名时间', dateType: 'daterange', value: 'valid', event: 'robotDate' },
          { type: 'customselect', label: '用户类型', value: 'userType', list: 'robotUserTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'input', label: '起始排名', value: 'rankingFrom' },
          { type: 'input', label: '截止排名', value: 'rankingTo' },
          { type: 'input', label: '起始性能分', value: 'performanceFrom' },
          { type: 'input', label: '截止性能分', value: 'performanceTo' },
          { type: 'customselect', label: '报名支付类型', value: 'status', list: 'robotUserStatusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'robotSearch', show: true },
          { type: 'button', label: '添加马甲', btType: 'primary', icon: 'el-icon-plus', event: 'addRobot', show: false },
          { type: 'button', label: '删除马甲', btType: 'danger', icon: 'el-icon-delete', event: 'removeRobot', show: false },
          { type: 'button', label: '结果发布', btType: 'danger', icon: 'el-icon-success', event: 'announceResult', show: false },
          { type: 'button', label: '导出报名用户信息', btType: 'primary', icon: 'el-icon-download', event: 'exportJoins', show: false }
        ]
      },
      tableInfo2: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: true,
        checkBox: true,
        data: [],
        fieldList: [
          { label: '用户ID', value: 'userId', minWidth: 70 },
          { label: '用户类型', value: 'userTypeName', minWidth: 70 },
          { label: '手机号码', value: 'phone', width: 110 },
          { label: '用户昵称', value: 'nickName' },
          { label: '性别', value: 'genderName', minWidth: 60 },
          { label: '装备总性能分', value: 'performance', minWidth: 60 },
          { label: '报名时间', value: 'joinTime', width: 140 },
          { label: '比赛场次', value: 'raceTotal', minWidth: 60 },
          { label: '胜局', value: 'raceWin', minWidth: 40 },
          { label: '负局', value: 'raceLose', minWidth: 40 },
          { label: '总积分', value: 'score', width: 60, type: 'tag' },
          { label: '排名', value: 'scoreRank', type: 'slot', minWidth: 60, sort: 'custom' },
          { label: '奖项名次', value: 'raceRank', minWidth: 40 },
          { label: '支付情况', value: 'status', type: 'slot', minWidth: 70 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '320',
          btList: [
            { label: '报名详情', type: 'primary', event: 'signUpDetails', show: true },
            { label: '查看奖励', type: 'primary', event: 'viewRewards', show: true },
            { label: '比赛详情', type: 'primary', event: 'matchDetail', show: true },
            { label: '修改积分', type: 'success', icon: '', event: 'modifyScore', loading: 'statusLoading', show: false, slot: true }
          ]
        }
      },
      formInfo2: {
        ref: null,
        data: {
          id: '', // *唯一ID
          payType: '',
          applFee: '',
          payTypeName: '',
          orderNo: '',
          status: '',
          statusName: '',
          paymentMethodName: '',
          payTime: ''
        },
        fieldList: [
          { label: '订单ID', value: 'id', type: 'tag', className: 'el-form-block-80' },
          { label: '报名付款方式', value: 'payTypeName', type: 'tag', className: 'el-form-block-80' },
          { label: '金额(元)', value: 'applyFee', type: 'tag', className: 'el-form-block-80' },
          { label: '支付方式', value: 'paymentMethodName', type: 'tag', className: 'el-form-block-80' },
          { label: '订单编号', value: 'orderNo', type: 'tag', className: 'el-form-block-80' },
          { label: '下单时间', value: 'payTime', type: 'tag', className: 'el-form-block-80' },
          { label: '支付状态', value: 'statusName', type: 'tag', className: 'el-form-block-80' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 弹窗相关
      dialogInfo: {
        title: '报名详情',
        visible: false,
        type: '',
        width: '500px',
        btLoading: false,
        btList: []
      },
      filterInfo3: {
        query: {
          cupId: '',
          userId: '',
          nickName: '',
          phone: ''
        },
        list: [
          { type: 'input', label: '用户ID', value: 'userId', disabled: true },
          { type: 'input', label: '用户昵称', value: 'nickName', disabled: true },
          { type: 'input', label: '手机号码', value: 'phone', disabled: true }
        ]
      },
      tableInfo3: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: true,
        data: [],
        fieldList: [
          { label: '比赛ID', value: 'id', type: 'slot', minWidth: 60 },
          { label: '对手ID', value: 'userId' },
          { label: '对手类型', value: 'userTypeName' },
          { label: '手机号码', value: 'phone' },
          { label: '对手昵称', value: 'nickName', minWidth: 70 },
          { label: '装备总性能分', value: 'performance', minWidth: 70 },
          { label: '比赛地图名称', value: 'mapName', minWidth: 100 },
          { label: '比赛开始时间', value: 'startTime', minWidth: 100 },
          { label: '比赛结束时间', value: 'endTime', minWidth: 100 },
          { label: '比赛结果', value: 'playerResultName', width: 100 },
          { label: '金币', value: 'getGoldCoin', type: 'slot', minWidth: 70 },
          { label: '积分', value: 'scoreWin', type: 'slot', minWidth: 70 }
        ]
      },
      formInfoRobot: {
        ref: null,
        data: {
          cupId: '', // *唯一ID
          number: '',
          performanceFrom: '',
          performanceTo: ''
        },
        fieldList: [
          { label: '马甲数量', value: 'number', type: 'input', required: true, className: 'el-form-block-60', validator: checkRobotNumber },
          { label: '装备起始性能分', value: 'performanceFrom', type: 'input', className: 'el-form-block-60', required: true, validator: checkPerformanceFrom },
          { label: '装备截止性能分', value: 'performanceTo', type: 'input', className: 'el-form-block-60', required: true, validator: checkPerformanceTo }
        ],
        rules: {},
        labelWidth: '120px'
      },
      insertRobot: {
        title: '添加马甲',
        visible: false,
        btLoading: false,
        width: '600px',
        btList: [
          { label: '关闭', type: '', icon: '', event: 'robotClose', show: true },
          { label: '确定', type: 'primary', icon: '', event: 'insertRobot', show: true }
        ]
      },
      formInfoUserScore: {
        ref: null,
        data: {
          id: '',
          userId: '',
          nickName: '',
          phone: '',
          userTypeName: '',
          score: '',
          updScore: '',
          raceWin: '',
          updRaceWin: '',
          raceLose: '',
          updRaceLose: ''
        },
        fieldList: [
          { label: '用户ID', value: 'userId', type: 'tag', className: 'el-form-inline-block-50' },
          { label: '用户类型', value: 'userTypeName', type: 'tag', className: 'el-form-inline-block-50' },
          { label: '用户昵称', value: 'nickName', type: 'tag', className: 'el-form-inline-block-50' },
          { label: '用户手机号', value: 'phone', type: 'tag', className: 'el-form-inline-block-50' },
          { label: '原积分', value: 'score', type: 'tag', className: 'el-form-inline-block-50' },
          { label: '修改后积分', value: 'updScore', type: 'input', className: 'el-form-inline-block-50', required: true, validator: checkUpdScore },
          { label: '原胜局数', value: 'raceWin', type: 'tag', className: 'el-form-inline-block-50' },
          { label: '修改后胜局', value: 'updRaceWin', type: 'input', className: 'el-form-inline-block-50', required: true, validator: checkUpRaceTotal },
          { label: '原负局数', value: 'raceLose', type: 'tag', className: 'el-form-inline-block-50' },
          { label: '修改后负局', value: 'updRaceLose', type: 'input', className: 'el-form-inline-block-50', required: true, validator: checkUpRaceTotal }
        ],
        rules: {},
        labelWidth: '100px'
      },
      updateUserScore: {
        title: '修改积分',
        visible: false,
        btLoading: false,
        width: '600px',
        btList: [
          { label: '关闭', type: '', icon: '', event: 'userScoreClose', show: true },
          { label: '确定', type: 'primary', icon: '', event: 'updateUserScore', show: true }
        ]
      },
      dialogGameItem: {
        title: '选择装备',
        visible: false,
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'dialogGameItemClose', show: true }
        ]
      },
      dialogAdd: {
        title: { gold: '添加金币', equip: '添加装备', diamond: '添加钻石', money: '现金奖励' },
        visible: false,
        btLoading: false,
        type: '',
        width: '400px',
        btList: [
          { label: '取消', type: '', icon: '', event: 'cancellDialogAdd', show: true },
          { label: '确定', type: 'primary', icon: '', event: 'addDialogAdd', show: true }
        ]
      },
      popupDialog: {
        title: '',
        typeVal: '',
        visible: false,
        btLoading: false,
        height: '600px'
      },
      dialogRewardDetails: {
        title: '奖励详情',
        visible: false,
        btLoading: false,
        type: '',
        width: '1031px'
      },
      tempBonus: {
        itemId: '',
        itemType: '',
        itemTypeName: '',
        itemName: '',
        imageThumbnailUrl: ''
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
      this.$initDataPermits('raceCupDetail', this.filterInfo.list) // 条件区域操作权限
      this.$initDataPermits('raceCupDetail', this.filterInfo2.list) // 条件区域操作权限
      this.$initDataPermits('raceCupDetail', this.tableInfo2.handle.btList) // 条件区域操作权限
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_RACE_CUP_PUB_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_RACE_CUP_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.cupStatusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_PRICE_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.payTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_RACE_CUP_REWARD_TYPE' }).then(res => {
        if (res.code === 200) {
          this.objectTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_USER_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.robotUserTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_RACE_CUP_RANK_SORT_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.sortTypeList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
      this.formInfo.rulesRaceRank = this.$initRules(this.formInfo.fieldRankList)
      this.formInfoRobot.rules = this.$initRules(this.formInfoRobot.fieldList)
      this.formInfoUserScore.rules = this.$initRules(this.formInfoUserScore.fieldList)
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo.ref1) {
        this.formInfo.ref1.resetFields()
      }
      // 获取url参数
      this.formInfo.data.id = this.$route.query.id
      // 获取version详细
      const param = { 'id': this.formInfo.data.id }
      this.$handleAPI('', getDetailApi, param).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          const data = res.data
          data.cupStatus += ''
          data.payType += ''
          // 显示信息
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              if (data[key] === 0 || data[key] === '0') {
                data[key] = ''
              }
              if (data.cupStatus === '') {
                data.cupStatus = '0'
              }
              if (data.announceFlag === '') {
                data.announceFlag = '0'
              }
              this.formInfo.data[key] = data[key]
              if (key === 'validFrom' && data['validFrom'] !== '0000-00-00 00:00:00' && data['validFrom'] !== null) {
                this.formInfo.data.valid = [data['validFrom'], data['validTo']]
              }
              if (key === 'enrollFrom' && data['enrollFrom'] !== '0000-00-00 00:00:00' && data['enrollFrom'] !== null) {
                this.formInfo.data.enroll = [data['enrollFrom'], data['deadLine']]
              }
              if (key === 'releaseFrom' && data['releaseFrom'] !== '0000-00-00 00:00:00' && data['releaseFrom'] !== null) {
                this.formInfo.data.release = [data['releaseFrom'], data['releaseTo']]
              }
            }
          }
          this.getRankInfo(data.id)
          this.filterInfo3.query.cupId = ''
          this.filterInfo3.query.userId = ''
          this.filterInfo3.query.nickName = ''
          this.filterInfo3.query.phone = ''
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
    getRankInfo(id) {
      this.$handleAPI('', getRankInfoApi, { 'id': id }).then(res => {
        if (res.code === 200) {
          res.data.list.forEach(item => {
            // if (item.prizes !== null && item.prizes.length > 0 && item.prizes[0].rewardType === null) {
            //   item.prizes = []
            // }
            item.sortType += ''
            item.prizes.forEach(p => {
              if (Number(p.rewardType) === 9) {
                p.itemId = ''
              }
            })
          })
          this.formInfo.rankList = res.data.list
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
      status = Number(status)
      if (status === 6) { // 已下架状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '复制', btType: 'primary', icon: 'el-icon-check', loading: 'editLoading', event: 'copy', show: false },
          { type: 'button', label: '导出奖项设定', btType: 'primary', icon: 'el-icon-download', loading: 'downloading', event: 'exportRank', show: false }
        ]
        if (Number(this.formInfo.data.cupStatus) === 0) {
          const p = { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false }
          this.filterInfo.list.push(p)
        }
      }
      if (status === 7) { // 作废状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '导出奖项设定', btType: 'primary', icon: 'el-icon-download', loading: 'downloading', event: 'exportRank', show: false }
        ]
      }
      if (status === 5) { // 已上架状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '下架', btType: 'danger', icon: 'el-icon-bottom', loading: 'deleteLoading', event: 'stop', show: false },
          { type: 'button', label: '作废', btType: 'danger', icon: 'el-icon-close', loading: 'stopLoading', event: 'close', show: false },
          { type: 'button', label: '复制', btType: 'primary', icon: 'el-icon-check', loading: 'editLoading', event: 'copy', show: false },
          { type: 'button', label: '导出奖项设定', btType: 'primary', icon: 'el-icon-download', loading: 'downloading', event: 'exportRank', show: false }
        ]
      }
      if (status === 3) { // 审批NG状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false },
          { type: 'button', label: '作废', btType: 'danger', icon: 'el-icon-close', loading: 'stopLoading', event: 'close', show: false },
          { type: 'button', label: '复制', btType: 'primary', icon: 'el-icon-check', loading: 'editLoading', event: 'copy', show: false },
          { type: 'button', label: '导出奖项设定', btType: 'primary', icon: 'el-icon-download', loading: 'downloading', event: 'exportRank', show: false }
        ]
      }
      if (status === 2) { // 已保存，审核中状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '审核通过', btType: 'primary', icon: 'el-icon-top', loading: 'submitLoading', event: 'approveOK', show: false },
          { type: 'button', label: '审核不通过', btType: 'danger', icon: 'el-icon-close', loading: 'stopLoading', event: 'approveNG', show: false },
          { type: 'button', label: '作废', btType: 'danger', icon: 'el-icon-close', loading: 'stopLoading', event: 'close', show: false },
          { type: 'button', label: '复制', btType: 'primary', icon: 'el-icon-check', loading: 'editLoading', event: 'copy', show: false },
          { type: 'button', label: '导出奖项设定', btType: 'primary', icon: 'el-icon-download', loading: 'downloading', event: 'exportRank', show: false }
        ]
      }
      if (status === 1) { // 编辑状态
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '提交审批', btType: 'primary', icon: 'el-icon-check', loading: 'submitLoading', event: 'submit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false },
          { type: 'button', label: '复制', btType: 'primary', icon: 'el-icon-check', loading: 'editLoading', event: 'copy', show: false },
          { type: 'button', label: '导出奖项设定', btType: 'primary', icon: 'el-icon-download', loading: 'downloading', event: 'exportRank', show: false }
        ]
      }
      this.initDataPermits()
    },
    pickItem(data) {
      var prizes = this.formInfo.rankList[this.curIndex].prizes
      var flag = false
      if (prizes.length > 0) {
        prizes.forEach(item => {
          if (Number(item.itemId) === Number(data.id)) {
            this.$message({
              showClose: true,
              message: '同一奖励级别中,奖项不可重复',
              type: 'error',
              duration: 3500
            })
            flag = true
          }
        })
      }
      if (flag) {
        return
      }
      this.curItemId = data.id
      this.curItemName = data.itemName
      this.tempBonus.itemId = data.id
      this.tempBonus.itemType = data.itemType
      this.tempBonus.imageThumbnailUrl = data.imageThumbnailUrl
      this.tempBonus.itemTypeName = data.itemTypeName
      this.tempBonus.itemName = data.itemName
      this.dialogAdd.visible = true
      if (data.itemType === 30) { // 金币
        this.dialogAdd.type = 'gold'
      }
      if (data.itemType !== 30 && data.itemType !== 31) { // 装备
        this.dialogAdd.type = 'equip'
      }
      if (data.itemType === 31) { // 钻石
        this.dialogAdd.type = 'diamond'
      }
    },
    addReward(index) {
      if (this.formInfo.rankList[index].prizes.length >= 5) {
        this.$message({
          showClose: true,
          message: '最多添加5个奖励',
          type: 'info',
          duration: 3500
        })
        return
      }
      this.curIndex = index
      this.objTypeDialog.visible = true
      this.isNeedSaveRankInfo = true
      // this.curIndex = index
      // this.dialogGameItem.visible = true
    },
    deleteReward(index, rankInfo) {
      this.$confirm('确定要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rankInfo.prizes.splice(index, 1)
        this.isNeedSaveRankInfo = true
      })
      // var reward = rankInfo.prizes[index]
      // if (reward.id !== null && reward.id !== undefined) {
      //   this.$confirm('确定要删除？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.$handleAPI('', deleteRankPrizeApi, { id: reward.id, staffId: this.$store.state.staff.staffId }).then(res => {
      //       if (res.code === 200) {
      //         rankInfo.prizes.splice(index, 1)
      //       }
      //       this.$message({
      //         showClose: true,
      //         message: (res.code === 200) ? '删除成功' : res.message,
      //         type: (res.code === 200) ? 'success' : 'error',
      //         duration: 3500
      //       })
      //     })
      //   })
      // }
    },
    deleteRankInfo(index, rankInfo) {
      // this.$confirm('确定要删除？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.formInfo.rankList.splice(index, 1)
      //   const params = {
      //     'cupId': rankInfo.cupId,
      //     'raceRank': rankInfo.raceRank,
      //     'staffId': this.$store.state.staff.staffId
      //   }
      //   this.$handleAPI('', deleteRankApi, params).then(res => {
      //     if (res.code === 200) {
      //       this.$message({
      //         showClose: true,
      //         message: (res.code === 200) ? '删除成功' : res.message,
      //         type: (res.code === 200) ? 'success' : 'error',
      //         duration: 3500
      //       })
      //     }
      //   })
      // })
      this.$confirm('确定要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formInfo.rankList.splice(index, 1)
        for (var i = 0; i < this.formInfo.rankList.length; i++) {
          this.formInfo.rankList[i].raceRank = i + 1
        }
        this.isNeedSaveRankInfo = true
      })
    },
    competitionDetails(data) {
      this.$router.push({ path: '../history/detail', query: { id: data.id }, replace: true })
    },
    clickObjType(e) {
      if (e.itemValue !== '9') {
        const props = {
          objectType: Number(e.itemValue)
        }
        // 弹出选择具体条目
        this.popupDialog.title = '选择' + e.itemName
        this.popupDialog.typeVal = e.itemValue
        this.popupDialog.visible = true
        this.itemProps = props
        // 创建 11-装备 12-金币 13-钻石
      } else {
        this.tempBonus.itemType = 9
        this.dialogAdd.type = 'money'
        this.dialogAdd.visible = true
      }
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'robotSearch': {
          // 重置分页
          this.tableInfo2.initCurpage = 1 // 重新回第1页
          this.tableInfo2.refresh = Math.random()
          break
        }
        case 'save': {
          this.formInfo.ref1.validate(valid => {
            if (valid) {
              this.formInfo.data.updateBy = this.$store.state.staff.staffId
              this.formInfo.data.announceTime = this.$fn.switchTime(this.formInfo.data.announceTime)
              this.$handleAPI('', updateDetailApi, this.formInfo.data).then(res => {
                this.$message({
                  showClose: true,
                  message: (res.code === 200) ? '保存成功' : res.message,
                  type: (res.code === 200) ? 'success' : 'error',
                  duration: 3500
                })
              })
            }
          })
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
          this.$handleAPI('', editDetailApi, param).then(res => {
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
        case 'approveNG': {
          const dt1 = new Date()
          const approveTime = this.$fn.switchTime(dt1)
          const param = { 'id': this.formInfo.data.id, 'status': 3, 'approveBy': this.$store.state.staff.staffId, 'approveTime': approveTime }
          this.$handleAPI('', updateDetailApi, param).then(res => {
            if (res.code === 200) {
              this.getDetail()
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
        case 'approveOK': {
          var flag = true
          var dt1 = new Date()
          var dt2 = new Date(this.formInfo.data.enrollFrom)
          if (dt2 < dt1) {
            flag = false
          }
          if (flag) {
            const dt1 = new Date()
            const approveTime = this.$fn.switchTime(dt1)
            const param = { 'id': this.formInfo.data.id, 'status': 5, 'approveBy': this.$store.state.staff.staffId, 'approveTime': approveTime }
            this.$handleAPI('', updateDetailApi, param).then(res => {
              if (res.code === 200) {
                this.getDetail()
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
            this.$message({
              showClose: true,
              message: '报名开始时间不可小于当前时间',
              type: 'error',
              duration: 3500
            })
          }
          break
        }
        case 'submit': {
          if (this.isNeedSaveRankInfo) {
            this.$message({
              showClose: true,
              message: '请先保存名次及奖励信息',
              type: 'error',
              duration: 3500
            })
            return
          }
          this.formInfo.ref1.validate(valid => {
            if (valid) {
              const state = this.formInfo.data.status
              const param = this.formInfo.data
              param.announceTime = this.$fn.switchTime(param.announceTime)
              param.status = 2
              param.applyBy = this.$store.state.staff.staffId
              const dt1 = new Date()
              param.applyTime = this.$fn.switchTime(dt1)
              this.$handleAPI('', updateDetailApi, param).then(res => {
                if (res.code === 200) {
                  this.getDetail()
                } else {
                  this.formInfo.data.status = state
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error',
                    duration: 3500
                  })
                }
              })
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
          this.$handleAPI('', updateDetailApi, param).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 6
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
        case 'copy': {
          this.$handleAPI('', copyApi, { oldId: this.formInfo.data.id, staffId: this.$store.state.staff.staffId }).then(res => {
            if (res.code === 200) {
              this.$router.push({ path: './detail', query: { id: res.data }, replace: true })
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
        case 'close': {
          const param = {
            'id': this.formInfo.data.id,
            'status': 7,
            'updateBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', updateDetailApi, param).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 7
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
        case 'addRankInfo': // 增加race_rank
          var raceRank = this.formInfo.rankList.length > 0 ? this.formInfo.rankList[this.formInfo.rankList.length - 1].raceRank + 1 : 1
          // var sortFrom = this.formInfo.rankList.length > 0 ? this.formInfo.rankList[this.formInfo.rankList.length - 1].sortTo + 1 : 1
          var rankTmp = { cupId: this.formInfo.data.id, raceRank: raceRank, raceRankName: '', sortFrom: 1, sortTo: '', prizes: [] }
          this.formInfo.rankList.push(rankTmp)
          this.isNeedSaveRankInfo = true
          break
        case 'saveRankInfo':
          this.formInfo.refRankInfo.validate(valid => {
            if (valid) {
              for (var i = 0; i < this.formInfo.rankList.length; i++) {
                var curStart = Number(this.formInfo.rankList[i].sortFrom)
                var curEnd = Number(this.formInfo.rankList[i].sortTo)
                if (curStart <= 0) {
                  this.$message({
                    showClose: true,
                    message: '起始排名必须大于零!',
                    type: 'error',
                    duration: 3500
                  })
                  return
                }
                if (Number(this.formInfo.rankList[i].sortType) === 2) { // 按照名次范围
                  if (curEnd <= curStart) {
                    this.$message({
                      showClose: true,
                      message: '排名类型为按照名次范围时起始排名必须小于结束排名!',
                      type: 'error',
                      duration: 3500
                    })
                    return
                  }
                }
                if (Number(this.formInfo.rankList[i].sortType) === 1) { // 按照名次
                  if (curEnd !== curStart) {
                    this.$message({
                      showClose: true,
                      message: '排名类型为按照名次时起始排名必须等于结束排名!',
                      type: 'error',
                      duration: 3500
                    })
                    return
                  }
                }
                if (Number(this.formInfo.rankList[i].sortType) === 3) { // 无上限
                  if (curEnd !== 2147483647) {
                    this.$message({
                      showClose: true,
                      message: '排名类型为无上限时结束排名为2147483647!',
                      type: 'error',
                      duration: 3500
                    })
                    return
                  }
                }
                if (i !== 0) {
                  var lastEnd = Number((this.formInfo.rankList[i - 1].sortTo)) + 1
                  if (curStart !== lastEnd) {
                    this.$message({
                      showClose: true,
                      message: '排名区间必须连续',
                      type: 'error',
                      duration: 3500
                    })
                    return
                  }
                  var curRaceRank = Number(this.formInfo.rankList[i].raceRank)
                  var lastRaceRank = Number(this.formInfo.rankList[i - 1].raceRank)
                  if (curRaceRank !== lastRaceRank + 1) {
                    this.$message({
                      showClose: true,
                      message: '奖项名次必须连续',
                      type: 'error',
                      duration: 3500
                    })
                    return
                  }
                }
              }
              this.$handleAPI('', updateRankInfoApi, { 'rankList': this.formInfo.rankList, 'staffId': this.$store.state.staff.staffId, 'cupId': this.formInfo.data.id }).then(res => {
                if (res.code === 200) {
                  this.isNeedSaveRankInfo = false
                }
                this.$message({
                  showClose: true,
                  message: (res.code === 200) ? '保存成功' : res.message,
                  type: (res.code === 200) ? 'success' : 'error',
                  duration: 3500
                })
              })
            }
          })
          break
        case 'cancellDialogAdd':
          this.dialogAdd.visible = false
          this.inputCount = 1
          break
        case 'addDialogAdd':
          if (this.inputCount <= 0) {
            this.$message({
              showClose: true,
              message: '输入值必须是正值',
              type: 'error',
              duration: 3500
            })
            return
          }
          this.popupDialog.visible = false
          this.objTypeDialog.visible = false
          this.dialogAdd.visible = false
          this.dialogGameItem.visible = false
          var rewardType = ''
          var rewardTypeName = ''
          if (this.tempBonus.itemType === 30) {
            rewardType = 1
            rewardTypeName = '金币'
          }
          if (this.tempBonus.itemType === 31) {
            rewardType = 2
            rewardTypeName = '钻石'
          }
          if (this.tempBonus.itemType === 9) {
            rewardType = 9
            rewardTypeName = '现金'
          }
          if (this.tempBonus.itemType !== 30 && this.tempBonus.itemType !== 31 && this.tempBonus.itemType !== 9) {
            rewardType = 3
            rewardTypeName = '装备'
          }
          var reward = {
            'itemId': this.tempBonus.itemId,
            'itemType': this.tempBonus.itemType,
            'itemTypeName': this.tempBonus.itemTypeName,
            'itemName': this.tempBonus.itemName,
            'rewardType': rewardType,
            'imageThumbnailUrl': this.tempBonus.imageThumbnailUrl,
            'rewardTypeName': rewardTypeName,
            'rewardQuantity': this.inputCount
          }
          this.formInfo.rankList[this.curIndex].prizes.push(reward)
          this.inputCount = 1
          this.tempBonus = []
          break
        case 'matchDetail': {
          this.filterInfo3.query.cupId = data.cupId
          this.filterInfo3.query.userId = data.userId
          this.filterInfo3.query.nickName = data.nickName
          this.filterInfo3.query.phone = data.phone
          this.activeName = 'tab4'
          this.tableInfo3.refresh = Math.random()
          break
        }
        case 'signUpDetails': {
          const param = {
            'id': data.id
          }
          this.$handleAPI('', getRaceRewardUserDetails, param).then(res => {
            if (res.code === 200) {
              this.formInfo2.data = res.data
              if (this.formInfo2.data.status === '0' || this.formInfo2.data.status === 0) {
                this.formInfo2.data.statusName = '待支付'
              }
              if (this.formInfo2.data.status !== '0' && this.formInfo2.data.status !== 0) {
                this.formInfo2.data.statusName = '支付成功'
              }
              if (this.formInfo2.data.payType === 1) {
                this.formInfo2.data.orderNo = this.formInfo2.data.id + '_' + this.formInfo2.data.cupId + '_' + this.formInfo2.data.payVer
              }
              this.formInfo2.fieldList.forEach(element => {
                if (element.value === 'paymentMethodName') {
                  if (this.formInfo2.data.payType === 1) {
                    element.type = 'tag'
                  } else {
                    element.type = 'hidden'
                  }
                }
                if (element.value === 'orderNo') {
                  if (this.formInfo2.data.payType === 1) {
                    element.type = 'tag'
                  } else {
                    element.type = 'hidden'
                  }
                }
                if (element.value === 'applyFee') {
                  if (this.formInfo2.data.payType === 1) {
                    element.type = 'tag'
                    element.label = '金额(元)'
                  } else {
                    element.type = 'hidden'
                    element.label = '数量'
                  }
                }
                if (element.value === 'payTime') {
                  if (this.formInfo2.data.payType === 1) {
                    element.label = '下单时间'
                  } else {
                    element.label = '支付时间'
                  }
                }
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
          this.dialogInfo.visible = true
          break
        }
        case 'viewRewards': {
          const param = {
            'cupId': this.formInfo.data.id,
            'userId': data.userId
          }
          this.raceReward(param)
          this.dialogRewardDetails.type = event
          this.dialogRewardDetails.visible = true
          break
        }
        case 'confirmDistribution': {
          const param = {
            'id': data.id,
            'status': 1,
            'updateBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', raceRewardConfirmDistribution, param).then(res => {
            if (res.code === 200) {
              this.rewardDetailsList = []
              const params = {
                'cupId': this.formInfo.data.id,
                'userId': data.playerId
              }
              this.raceReward(params)
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
        case 'addRobot': {
          var addRobotFlag = true
          if (this.formInfo.data.cupStatus !== '1' && this.formInfo.data.status !== '5') {
            addRobotFlag = false
            this.$message({
              showClose: true,
              message: '只有联赛在报名中并且已上架的条件下才可添加马甲',
              type: 'error',
              duration: 3500
            })
          }
          if (addRobotFlag) {
            this.insertRobot.type = event
            this.insertRobot.visible = true
          }
          break
        }
        case 'removeRobot': {
          var removeRobotFlag = true
          if (this.formInfo.data.cupStatus !== '1' && this.formInfo.data.status !== '5') {
            removeRobotFlag = false
            this.$message({
              showClose: true,
              message: '只有联赛在报名中并且已上架的条件下才可删除马甲',
              type: 'error',
              duration: 3500
            })
          }
          if (removeRobotFlag) {
            var userIds = []
            let pass = true
            try {
              this.checkBoxList.forEach(item => {
                userIds.push(item.userId)
              })
            } catch (error) {
              this.$message({
                showClose: true,
                message: error.message,
                type: 'error',
                duration: 3500
              })
              pass = false
            }
            // 校验不通过，则返回
            if (!pass) {
              return
            }
            if (userIds.length > 0) {
              const params = {
                'userIds': userIds.join(','),
                'cupId': this.filterInfo2.query.cupId
              }
              this.$handleAPI('delete', raceCupJoinsDelRobot, params).then(res => {
                if (res.code === 200) {
                  this.tableInfo2.refresh = Math.random()
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
              this.$message({
                showClose: true,
                message: '请选择需要操作的数据',
                type: 'error',
                duration: 3500
              })
            }
          }
          break
        }
        case 'robotClose': {
          this.insertRobot.visible = false
          break
        }
        case 'insertRobot': {
          var flags = true
          if (Number(this.formInfoRobot.data.number) < 1) {
            flags = false
            this.$message({
              showClose: true,
              message: '马甲数量必须大于等于1',
              type: 'error',
              duration: 3500
            })
          }
          if (Number(this.formInfoRobot.data.performanceFrom) < 1 || Number(this.formInfoRobot.data.performanceTo) < 1) {
            flags = false
            this.$message({
              showClose: true,
              message: '马甲装备性能分范围不能小于1',
              type: 'error',
              duration: 3500
            })
          }
          if (Number(this.formInfoRobot.data.performanceFrom) > Number(this.formInfoRobot.data.performanceTo)) {
            flags = false
            this.$message({
              showClose: true,
              message: '装备截止性能分必须大于等于装备起始性能分',
              type: 'error',
              duration: 3500
            })
          }
          if (flags) {
            // 验证必填项
            this.formInfoRobot.ref.validate(valid => {
              if (valid) {
                this.formInfoRobot.data.cupId = this.filterInfo2.query.cupId
                const params = this.formInfoRobot.data
                this.$handleAPI('', raceCupJoinsInsertRobot, params).then(res => {
                  if (res.code === 200) {
                    this.formInfoRobot.data.number = ''
                    this.formInfoRobot.data.performanceFrom = ''
                    this.formInfoRobot.data.performanceTo = ''
                    this.insertRobot.visible = false
                    this.tableInfo2.refresh = Math.random()
                  }
                  this.$message({
                    showClose: true,
                    message: (res.code === 200) ? '成功添加' + res.data + '条马甲' : res.message,
                    type: (res.code === 200) ? 'success' : 'error',
                    duration: 3500
                  })
                })
              }
            })
          }
          break
        }
        case 'announceResult': {
          var cupStatusFalg = true
          if (this.formInfo.data.cupStatus !== '5' || this.formInfo.data.announceFlag === 1) {
            cupStatusFalg = false
            this.$message({
              showClose: true,
              message: '比赛未结束或者结果已发布',
              type: 'error',
              duration: 3500
            })
          }
          if (cupStatusFalg) {
            this.$confirm('确定发布此结果？确认结果后将不可修改？', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              const cupStatusParams = {
                'cupId': this.formInfo.data.id,
                'updateBy': this.$store.state.staff.staffId
              }
              this.$handleAPI('', raceCupRobotResultsRelease, cupStatusParams).then(res => {
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
            })
          }
          break
        }
        case 'modifyScore': {
          var modifyScoreFalg = true
          if (this.formInfo.data.cupStatus !== '5' || this.formInfo.data.announceFlag === 1) {
            modifyScoreFalg = false
            this.$message({
              showClose: true,
              message: '比赛未结束或者结果已发布,不可修改积分',
              type: 'error',
              duration: 3500
            })
          }
          if (modifyScoreFalg) {
            this.updateUserScore.type = event
            this.updateUserScore.visible = true

            for (const key in data) {
              // 存在则赋值
              if (key in this.formInfoUserScore.data) {
                this.formInfoUserScore.data[key] = data[key]
                if (key === 'score') {
                  this.formInfoUserScore.data.updScore = data['score']
                }
                if (key === 'raceWin') {
                  this.formInfoUserScore.data.updRaceWin = data['raceWin']
                }
                if (key === 'raceLose') {
                  this.formInfoUserScore.data.updRaceLose = data['raceLose']
                }
              }
            }
          }
          break
        }
        case 'updateUserScore': {
          // 验证必填项
          this.formInfoUserScore.ref.validate(valid => {
            if (valid) {
              const scoreParams = {
                'id': this.formInfoUserScore.data.id,
                'updScore': this.formInfoUserScore.data.updScore,
                'updRaceWin': this.formInfoUserScore.data.updRaceWin,
                'updRaceLose': this.formInfoUserScore.data.updRaceLose
              }
              this.$handleAPI('', raceCupRobotUpdateScore, scoreParams).then(res => {
                if (res.code === 200) {
                  this.updateUserScore.visible = false
                  this.tableInfo2.refresh = Math.random()
                }
                this.$message({
                  showClose: true,
                  message: (res.code === 200) ? '修改成功' : res.message,
                  type: (res.code === 200) ? 'success' : 'error',
                  duration: 3500
                })
              })
            }
          })
          break
        }
        case 'userScoreClose': {
          this.updateUserScore.visible = false
          break
        }
        case 'exportRank': {
          this.handleDownload()
          break
        }
        case 'exportJoins': {
          this.handleDownloadJoins()
          break
        }
      }
    },
    handleDownloadJoins() {
      this.filterInfo2.query.pageNum = this.filterInfo2.query.pageNum || 1
      this.filterInfo2.query.pageSize = this.filterInfo2.query.pageSize || 20
      this.$handleAPI('', exportCupJoinsList, this.filterInfo2.query).then(res => {
        if (res.code === 200) {
          res.data.list.forEach(el => {
            if (el.status === '0' || el.status === 0) {
              el.statusName = '待支付'
            }
            if (el.status !== '0' && el.status !== 0) {
              el.statusName = '支付成功'
            }
            if (el.raceCupPayType === 1) {
              el.orderNo = el.id + '_' + el.cupId + '_' + el.payVer
            } else {
              el.orderNo = '-'
            }
            if (el.scoreRank === 99999999) {
              el.scoreRank = '-'
            }
            this.listTypeInfo.payTypeList.forEach(it => {
              if (Number(it.itemValue) === el.raceCupPayType) {
                el.raceCupPayTypeName = it.itemName
              }
            })
          })
          this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const column = [
              { title: '序号', key: 'id', type: 'text', width: 100 },
              { title: '用户ID', key: 'userId', type: 'text', width: 100 },
              { title: '用户类型', key: 'userTypeName', type: 'text', width: 100 },
              { title: '手机号码', key: 'phone', type: 'text', width: 100 },
              { title: '用户昵称', key: 'nickName', type: 'text', width: 100 },
              { title: '性别', key: 'genderName', type: 'text', width: 100 },
              { title: '装备性能总分', key: 'performance', type: 'text', width: 100 },
              { title: '报名时间', key: 'joinTime', type: 'text', width: 100 },
              { title: '比赛场次', key: 'raceTotal', type: 'text', width: 100 },
              { title: '胜局', key: 'raceWin', type: 'text', width: 100 },
              { title: '负局', key: 'raceLose', type: 'text', width: 100 },
              { title: '总积分', key: 'score', type: 'text', width: 100 },
              { title: '排名', key: 'scoreRank', type: 'text', width: 100 },
              { title: '奖项名次', key: 'raceRank', type: 'text', width: 100 },
              { title: '支付情况', key: 'statusName', type: 'text', width: 100 },
              { title: '报名支付订单ID', key: 'orderNo', type: 'text', width: 100 },
              { title: '报名付款方式', key: 'raceCupPayTypeName', type: 'text', width: 100 },
              { title: '支付时间', key: 'payTime', type: 'text', width: 100 }
            ]
            const tHeader = []
            const filterVal = []
            for (const index in column) {
              const item = column[index]
              tHeader[index] = item.title
              filterVal[index] = item.key
            }
            const data = this.formatJson(filterVal, res.data.list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '官方联赛-报名用户信息',
              autoWidth: this.autoWidth,
              bookType: this.bookType
            })
            this.downloadLoading = false
            // excel.export_table_to_excel_image(column, res.data.list, '官方联赛-报名用户信息')
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
    raceReward(param) {
      this.$handleAPI('', getRaceRewardList, param).then(res => {
        if (res.code === 200) {
          this.rewardDetailsList = res.data
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
    // 触发事件
    handleEvent(event, data, formData) {
      switch (event) {
        case 'robotDate': {
          if (data) {
            this.filterInfo2.query.validFrom = data[0]
            this.filterInfo2.query.validTo = data[1]
          } else {
            this.filterInfo2.query.validFrom = ''
            this.filterInfo2.query.validTo = ''
          }
          break
        }
        case 'changeValid':
          if (this.formInfo.data.valid !== null) {
            this.formInfo.data.validFrom = this.$fn.switchTime(this.formInfo.data.valid[0])
            this.formInfo.data.validTo = this.$fn.switchTime(this.formInfo.data.valid[1])
          } else {
            this.formInfo.data.validFrom = ''
            this.formInfo.data.validTo = ''
          }
          break
        case 'changeRelease':
          if (this.formInfo.data.release !== null) {
            this.formInfo.data.releaseFrom = this.$fn.switchTime(this.formInfo.data.release[0])
            this.formInfo.data.releaseTo = this.$fn.switchTime(this.formInfo.data.release[1])
          } else {
            this.formInfo.data.releaseFrom = ''
            this.formInfo.data.releaseTo = ''
          }
          break
        case 'changeEnroll':
          if (this.formInfo.data.enroll !== null) {
            this.formInfo.data.enrollFrom = this.$fn.switchTime(this.formInfo.data.enroll[0])
            this.formInfo.data.deadLine = this.$fn.switchTime(this.formInfo.data.enroll[1])
            // 当联赛日期为空时，把报名截止日期赋值给联赛开始日期
            if (this.formInfo.data.validFrom === null) {
              this.formInfo.data.validFrom = this.formInfo.data.deadLine
              this.formInfo.data.valid = [this.formInfo.data.deadLine, '0000-00-00 00:00:00']
            }
            // 当上架时间为空时，把报名开始日期赋值给上架开始时间
            if (this.formInfo.data.releaseFrom === null) {
              this.formInfo.data.releaseFrom = this.formInfo.data.enrollFrom
              this.formInfo.data.release = [this.formInfo.data.enrollFrom, '0000-00-00 00:00:00']
            }
          } else {
            this.formInfo.data.enrollFrom = ''
            this.formInfo.data.deadLine = ''
          }
          break
        case 'tableCheck': { // 选择
          this.checkBoxList = data
          break
        }
        case 'tableSort': {
          this.tableInfo2.initCurpage = 1
          var fieldName = data.column.property // 排序字段名
          var sortingType = data.column.order // 排序顺序 descending or ascending
          if (fieldName === 'scoreRank') {
            if (sortingType === 'descending') {
              this.filterInfo2.query.sort = 1
            } else {
              this.filterInfo2.query.sort = ''
            }
          }
          this.tableInfo2.refresh = Math.random()
          break
        }
        case 'changeSortType': {
          if (Number(formData.sortType) === 3) { // 无限次
            formData.sortTo = 2147483647
          }
          if (Number(formData.sortType) === 1) { // 按照名次
            formData.sortTo = formData.sortFrom
          }
          if (Number(formData.sortType) === 2) { // 按照名次范围
            formData.sortTo = Number(formData.sortFrom) + 1
          }
          this.isNeedSaveRankInfo = true
          break
        }
        case 'changeOther': {
          this.isNeedSaveRankInfo = true
          break
        }
      }
    },
    handleDownload() {
      import('@/vendor/Export2ExcelImage').then(excel => {
        const column = [
          { title: '奖励名次', key: 'raceRank', type: 'text', width: 100 },
          { title: '奖励描述', key: 'raceRankName', type: 'text', width: 100 },
          { title: '排名类型', key: 'sortTypeName', type: 'text', width: 100 },
          { title: '起始排名', key: 'sortFrom', type: 'text', width: 100 },
          { title: '结束排名', key: 'sortTo', type: 'text', width: 100 },
          { title: '奖励序号', key: 'sort', type: 'text', width: 100 },
          { title: '奖励类型', key: 'rewardTypeName', type: 'text', width: 100 },
          { title: '装备ID', key: 'itemId', type: 'text', width: 100 },
          { title: '装备类型', key: 'itemTypeName', type: 'text', width: 100 },
          { title: '装备名称', key: 'itemName', type: 'text', width: 100 },
          { title: '装备缩略图', key: 'imageThumbnailUrl', type: 'image', width: 100 },
          { title: '奖励数量', key: 'rewardQuantity', type: 'text', width: 100 }
        ]
        var list = []
        this.formInfo.rankList.forEach(el => {
          for (const va in el.prizes) {
            let sortTypeName = ''
            this.listTypeInfo.sortTypeList.forEach(st => {
              if (st.itemValue === el.sortType) {
                sortTypeName = st.itemName
              }
            })
            const p = {
              raceRank: el.raceRank,
              raceRankName: el.raceRankName,
              sortTypeName: sortTypeName,
              sortFrom: el.sortFrom,
              sortTo: el.sortTo,
              sort: el.sort
            }
            const it = el.prizes[va]
            p.sort = (va + 1)
            p.itemId = it.itemId
            p.itemTypeName = (it.itemTypeName === undefined || it.itemTypeName === null) ? '' : it.itemTypeName
            p.itemName = (it.itemName === undefined || it.itemName === null) ? '' : it.itemName
            p.imageThumbnailUrl = (it.imageThumbnailUrl === undefined || it.imageThumbnailUrl === null) ? '' : it.imageThumbnailUrl
            p.rewardQuantity = it.rewardQuantity
            p.rewardTypeName = it.rewardTypeName
            list.push(p)
          }
        })
        for (var index in list) {
          if (list[index]['imageThumbnailUrl'] !== '') {
            list[index]['imageThumbnailUrl'] = this.$TH.FILE_URLS.static_url + list[index]['imageThumbnailUrl']
          }
        }
        excel.export_table_to_excel_image(column, list, '官方联赛详情-名次奖励设置')
      })
    },
    userEquipmentList(tab, event) {
      switch (tab.name) {
        case 'tab3': { // 查询报名用户信息
          this.filterInfo2.query.cupId = this.formInfo.data.id
          this.tableInfo2.refresh = Math.random()
          break
        }
        case 'tab4': { // 用户比赛详情
          if (this.filterInfo3.query.cupId !== null && this.filterInfo3.query.cupId !== '') {
            this.tableInfo3.refresh = Math.random()
          }
          break
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped >
  .cardIcon {
    font-size: 40px;
  }
  .cup-container {
    height: 800px;
    padding: 20px;

    .slot-avatar{
      display: flex;
      margin: 0 auto;
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
    .slot-avatar1{
      width: 60px;
      height: 40px;
      display: flex;
      align-items: center;
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
      width: 80%;
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
