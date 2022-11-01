<template>
  <div class="tab-container">
    <el-row>
      <el-col v-show="formInfo1.data.status === 1" :span="24" align="left">
        <el-button v-if="dataPermits.includes('userDetail:lock')" class="filter-item" type="primary" size="small" icon="el-icon-check" @click="handleClick('ststusLock')">
          封号
        </el-button>
        <el-button v-if="dataPermits.includes('userDetail:close')" class="filter-item" type="danger" size="small" icon="el-icon-delete" @click="handleClick('ststusClose')">
          禁用
        </el-button>
        <el-button v-if="dataPermits.includes('userDetail:deleteRobot')" class="filter-item" type="danger" size="small" icon="el-icon-delete" @click="handleClick('deleteRobot')">
          删除
        </el-button>
      </el-col>
    </el-row>
    <br>
    <el-tabs v-model="activeName" type="border-card" @tab-click="userEquipmentList">
      <el-tab-pane label="用户基本信息" name="tab1">
        <el-row>
          <el-col :span="6">
            <user-card
              :user="userInfo"
            />
          </el-col>
          <el-col :span="18" style="padding-left: 10px">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>动态</span>
              </div>
              <el-col :span="12">
                <div>
                  <!-- page form 1 -->
                  <page-form
                    :ref-obj.sync="formInfo1.ref"
                    :data="formInfo1.data"
                    :field-list="formInfo1.fieldList"
                    :rules="formInfo1.rules"
                    :label-width="formInfo1.labelWidth"
                    :list-type-info="listTypeInfo"
                    @handleClick="handleClick"
                    @handleEvent="handleEvent"
                  />
                </div>
              </el-col>
              <el-col :span="12">
                <div>
                  <!-- page form 1 -->
                  <page-form
                    :ref-obj.sync="formInfo1.ref"
                    :data="formInfo1.data"
                    :field-list="formInfo1.fieldList2"
                    :rules="formInfo1.rules"
                    :label-width="formInfo1.labelWidth"
                    :list-type-info="listTypeInfo"
                    @handleClick="handleClick"
                    @handleEvent="handleEvent"
                  />
                </div>
              </el-col>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>车辆认证</span>
              </div>
              <!-- 表格 -->
              <page-table
                :refresh="tableInfo2.refresh"
                :init-curpage="tableInfo2.initCurpage"
                :data.sync="tableInfo2.data"
                :api="getUserManageCarList"
                :query="filterInfo.query"
                :field-list="tableInfo2.fieldList"
                :list-type-info="listTypeInfo"
                :handle="tableInfo2.handle"
                :pager="false"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              />
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>地址信息</span>
              </div>
              <!-- 表格 -->
              <page-table
                :refresh="tableInfo3.refresh"
                :init-curpage="tableInfo3.initCurpage"
                :data.sync="tableInfo3.data"
                :api="getUserAddressList"
                :query="filterInfo.query"
                :field-list="tableInfo3.fieldList"
                :list-type-info="listTypeInfo"
                :handle="tableInfo3.handle"
                :pager="false"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              >
                <template v-slot:col-defaultFlagName="scope">
                  <p v-if="scope.row.defaultFlag == 1">{{ scope.row.defaultFlagName }}</p>
                  <p v-if="scope.row.defaultFlag == 0">{{ '-' }}</p>
                </template>
                <template v-slot:col-address="scope">
                  <p>{{ scope.row.provinceName + scope.row.cityName + scope.row.districtName + scope.row.townName + scope.row.address }}</p>
                </template>
              </page-table>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="装备信息" name="tab2">
        <div style="padding-bottom: 30px;padding-left: 20px;">
          <h1 style="font-size: 14px;">{{ '当前装备' }}</h1>
          <br>
          <p style="font-size: 14px;ß">装备总性能分: <span style="padding-left: 10px;">{{ sumPerformance }}</span></p>
        </div>
        <template>
          <h1 style="margin-bottom: 0px;font-size: 14px;padding-left: 20px;">{{ '装备列表' }}</h1>
          <div class="app-container">
            <!-- 条件栏 -->
            <page-filter
              :query.sync="filterInfo.query"
              :filter-list="filterInfo.list"
              :list-type-info="listTypeInfo"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
            <!-- 表格 -->
            <page-table
              :refresh="tableInfo.refresh"
              :init-curpage="tableInfo.initCurpage"
              :data.sync="tableInfo.data"
              :api="getEquipmentList"
              :query="filterInfo.query"
              :field-list="tableInfo.fieldList"
              :list-type-info="listTypeInfo"
              :handle="tableInfo.handle"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            >
              <template v-slot:col-grade="scope">
                <p>{{ scope.row.itemLevel + '/' + scope.row.maxLevel }}</p>
              </template>
              <template v-slot:col-fullValue="scope">
                <p>{{ '¥' + scope.row.maxValue }}</p>
              </template>
              <template v-slot:col-statusName="scope">
                <p v-if="scope.row.loadFlag == 2">{{ scope.row.loadFlagName }}</p>
                <p v-if="scope.row.loadFlag == 1 && scope.row.status == 1">{{ scope.row.loadFlagName }}</p>
                <p v-if="scope.row.loadFlag == 1 && scope.row.status != 1">{{ scope.row.statusName }}</p>
              </template>
            </page-table>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="启程及奖励信息" name="tab3">
        <div style="padding-bottom: 30px;padding-left: 25px;">
          <h1 style="font-size: 14px;">{{ '统计信息' }}</h1>
          <br>
          <el-col :span="6">
            <p style="font-size: 14px;">累计里程: <span style="padding-left: 10px;">{{ formInfo1.data.tripMiles }}</span></p>
          </el-col>
          <el-col :span="6">
            <p style="font-size: 14px;">累计时长: <span style="padding-left: 10px;">{{ formInfo1.data.tripHours + 'h' }}</span></p>
          </el-col>
          <el-col :span="6">
            <p style="font-size: 14px;">累计次数: <span style="padding-left: 10px;">{{ formInfo1.data.tripCount }}</span></p>
          </el-col>
        </div>
        <template>
          <h1 style="margin-bottom: 0px;font-size: 14px;padding-left: 25px;">{{ '行程与奖励列表' }}</h1>
          <div class="form-merchant-container">
            <el-table
              ref="refSpecTable"
              v-loading="bonusListLoading"
              :data.sync="tripData"
              :highlight-current-row="true"
              border
              height="500"
              tooltip-effect="dark"
              style="width: 100%"
              row-key="id"
              @expand-change="expandChange"
            >
              <el-table-column type="expand" label="" prop="">
                <template slot-scope="props">
                  <el-table :data.sync="props.row.bonusList" stripe>
                    <el-table-column label="奖励ID" prop="bonusItemId" align="center" />
                    <el-table-column label="奖励名称" prop="bonusName" align="center" />
                    <el-table-column label="奖励类型" prop="bonusTypeName" align="center" />
                    <el-table-column label="奖励数量" prop="bonusQuantity" align="center" />
                    <el-table-column label="中奖/未中奖提示" prop="statusName" align="center" />
                    <el-table-column label="翻牌状态" prop="drawFlagName" align="center" />
                    <el-table-column label="领取状态" prop="hitFlagName" align="center" />
                    <el-table-column label="领取时间" prop="hitTime" align="center" />
                    <el-table-column label="有效时间" prop="expiredAt" align="center" />
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column prop="id" label="启程ID" width="75px" align="center" />
              <el-table-column prop="distance" label="行驶距离" align="center" width="80px" />
              <el-table-column prop="tripTime" label="行驶时长" align="center" width="140px" />
              <el-table-column prop="speedMax" label="最快速度" align="center" width="100px" />
              <el-table-column prop="speed" label="平均速度" align="center" width="100px" />
              <el-table-column prop="startTime" label="开始时间" align="center" />
              <el-table-column prop="endTime" label="结束时间" align="center" />
              <el-table-column prop="statusName" label="启程状态" align="center" width="80px" />
              <el-table-column prop="modeName" label="出行标签" align="center" width="80px" />
              <el-table-column prop="bonusGet" label="领取/获得奖励" align="center" width="100px" />
              <el-table-column prop="tripGold" label="里程产生金币数" align="center" width="105px" />
              <el-table-column prop="adGold" label="广告奖励金币数" align="center" width="105px" />
              <el-table-column prop="drawStatus" label="奖励状态" width="80px" align="center" />
            </el-table>
            <el-pagination
              :current-page="currentPage"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[1, 10, 20, 50]"
              :page-size="pageSize"
              :total="totalCount"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </template>
      </el-tab-pane>
      <!-- <el-tab-pane label="票券信息" name="tab4">
        <div class="form-merchant-container">
        </div>
      </el-tab-pane> -->
      <el-tab-pane label="交易记录信息" name="tab5">
        <template>
          <h1 style="margin-bottom: 0px;font-size: 14px;padding-left: 20px;">{{ '交易记录列表' }}</h1>
          <div class="app-container">
            <!-- 条件栏 -->
            <page-filter
              :query.sync="filterInfo4.query"
              :filter-list="filterInfo4.list"
              :list-type-info="listTypeInfo"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
            <!-- 表格 -->
            <page-table
              :refresh="tableInfo4.refresh"
              :init-curpage="tableInfo4.initCurpage"
              :data.sync="tableInfo4.data"
              :api="getUserTransOrderList"
              :query="filterInfo4.query"
              :field-list="tableInfo4.fieldList"
              :list-type-info="listTypeInfo"
              :handle="tableInfo4.handle"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            >
              <template v-slot:col-amount="scope">
                <p v-if="(scope.row.transType == 11 || scope.row.transType == 12 || scope.row.transType == 13) && scope.row.userId == userInfo.id">{{ '-' + scope.row.amount }}</p>
                <p v-if="(((scope.row.transType == 11 || scope.row.transType == 12) && scope.row.soldUserId == userInfo.id) || (scope.row.transType == 14 && scope.row.soldUserId == userInfo.id))">{{ '+' + scope.row.amount }}</p>
                <!-- <p v-if="scope.row.transType == 13 && scope.row.userId == userInfo.id">{{ '-' + scope.row.amount }}</p>
                <p v-if="(scope.row.transType == 11 || scope.row.transType == 12) && scope.row.soldUserId == userInfo.id">{{ '+' + scope.row.amount }}</p>
                <p v-if="(scope.row.transType == 11 || scope.row.transType == 12) && scope.row.userId == userInfo.id">{{ '-' + scope.row.amount }}</p>
                <p v-if="scope.row.transType == 14 && scope.row.soldUserId == userInfo.id">{{ '+' + scope.row.amount }}</p> -->
              </template>
              <template v-slot:col-transTypeName="scope">
                <p v-if="(scope.row.transType == 11 || scope.row.transType == 12) && scope.row.userId == userInfo.id">{{ '装备购买' }}</p>
                <p v-if="(((scope.row.transType == 11 || scope.row.transType == 12) && scope.row.soldUserId == userInfo.id) || (scope.row.transType == 14 && scope.row.soldUserId == userInfo.id))">{{ '装备出售' }}</p>
                <p v-if="scope.row.transType == 13 && scope.row.userId == userInfo.id">{{ '充值' }}</p>
              </template>
            </page-table>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane label="路赛记录信息" name="tab6">
        <div class="form-merchant-container">
          <template>
            <div class="app-container">
              <!-- 条件栏 -->
              <page-filter
                :query.sync="filterInfo5.query"
                :filter-list="filterInfo5.list"
                :list-type-info="listTypeInfo"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              />
              <!-- 表格 -->
              <page-table
                :refresh="tableInfo5.refresh"
                :init-curpage="tableInfo5.initCurpage"
                :data.sync="tableInfo5.data"
                :api="getUserRaceList"
                :query="filterInfo5.query"
                :field-list="tableInfo5.fieldList"
                :list-type-info="listTypeInfo"
                :handle="tableInfo5.handle"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              />
            </div>
          </template>
        </div>
      </el-tab-pane>
      <el-tab-pane label="账户余额" name="tab7">
        <div style="padding-bottom: 30px;padding-left: 20px;">
          <h1 style="font-size: 14px;">{{ '账户总览' }}</h1>
          <br>
          <el-col :span="4">
            <p style="font-size: 14px;">金币余额: <span style="padding-left: 10px;">{{ userAccount.gold }}</span></p>
          </el-col>
          <el-col :span="4">
            <p style="font-size: 14px;">金币锁定: <span style="padding-left: 10px;">{{ userAccount.goldLock }}</span></p>
          </el-col>
          <el-col :span="4">
            <p style="font-size: 14px;">金币可用: <span style="padding-left: 10px;">{{ userAccount.gold - userAccount.goldLock }}</span></p>
          </el-col>
          <el-col :span="4">
            <p style="font-size: 14px;">钻石余额: <span style="padding-left: 10px;">{{ userAccount.diamond }}</span></p>
          </el-col>
          <el-col :span="4">
            <p style="font-size: 14px;">钻石锁定: <span style="padding-left: 10px;">{{ userAccount.diamondLock }}</span></p>
          </el-col>
          <el-col :span="4">
            <p style="font-size: 14px;">钻石可用: <span style="padding-left: 10px;">{{ userAccount.diamond - userAccount.diamondLock }}</span></p>
          </el-col>
        </div>
        <template>
          <h1 style="margin-bottom: 0px;font-size: 14px;padding-left: 20px;">{{ '账户变动记录' }}</h1>
          <div class="app-container">
            <!-- 条件栏 -->
            <page-filter
              :query.sync="filterInfo7.query"
              :filter-list="filterInfo7.list"
              :list-type-info="listTypeInfo"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
            <!-- 表格 -->
            <page-table
              :refresh="tableInfo7.refresh"
              :init-curpage="tableInfo7.initCurpage"
              :data.sync="tableInfo7.data"
              :api="getUserAccountChangeRecord"
              :query="filterInfo7.query"
              :field-list="tableInfo7.fieldList"
              :list-type-info="listTypeInfo"
              :handle="tableInfo7.handle"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApi, updateApi, getEquipmentList, getUserAccountManage, getUserAddressList, getUserManageCarList, getSumPerformance, getUserAccountChangeRecord, getUserTransOrderList, getUserRaceList, userDelete } from '@/api/user/info/detail'
import { getConfigItemsListApi } from '@/api/common'
import ThConsts from '@/constants' /* constant */
import PageForm from '@/components/PageForm'
import PageFilter from '@/components/PageFilter'
import defaultImage from '@/assets/img/no-pic.jpg'
import PageTable from '@/components/PageTable'
import UserCard from './components/UserCard'
import { getListApi, getBonusApi } from '@/api/trip/triphistory'

export default {
  components: {
    PageForm,
    PageTable,
    PageFilter,
    UserCard
  },
  data() {
    return {
      // fetchAreaList,
      getApi,
      getListApi,
      updateApi,
      getEquipmentList,
      getUserTransOrderList,
      getUserRaceList,
      getUserAccountChangeRecord,
      getUserAddressList,
      getUserManageCarList,
      activeName: 'tab1',
      tripData: [],
      bonusListLoading: false,
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      materiallist: [],
      listTypeInfo: {
        equipmentStatusList: [],
        equipmentList: [],
        rareTypeList: [],
        transTypeList: [],
        priceTypeList: [
          {
            'itemValue': 2,
            'itemName': '金币'
          },
          {
            'itemValue': 3,
            'itemName': '钻石'
          }
        ],
        tableInfo4PriceTypeList: [],
        tableInfo4TransTypeList: [],
        tableInfo4TransPlatList: [],
        tableInfo4StatusList: [],
        tableInfo5StatusList: [],
        raceTypeList: [],
        playerResultList: []
      },
      sumPerformance: '',
      userAccount: '',
      userInfo: {
        id: '', // id
        avatarUrl: '', // 用户头像
        nickName: '', // 用户昵称
        userName: '', // 用户真实姓名
        genderName: '', // 用户性别
        gender: '',
        birthday: '', // 用户生日
        phone: '', // 用户手机号码
        mail: '', // 用户邮箱
        registerTime: '', // *创建时间
        location: '', // 用户所在地
        profile: '', // 用户个性化签名
        description: '', // 用户个人介绍
        tagList: '', // 用户兴趣爱好标签
        statusName: '' // 用户状态
      },
      // 表单相关（追加、修改）
      formInfo1: {
        ref: null,
        data: {
          id: '', // *唯一ID
          userTypeName: '', // *用户类型
          userType: '', // *用户类型
          vipNo: '', // *会员编号
          registerTime: '',
          vipLevel: '', // *会员等级
          passwordFlagName: '', // *密码设定
          provinceName: '', // *所属省份
          cityName: '', // *所属城市
          avatarUrl: '', // *头像
          carLicenseUrl: '', // *行驶证照片
          carVerifyFlagName: '', // *车辆认证状态
          idno: '', // *身份证号
          idFront: '', // *身份证正面照
          idBack: '', // *身份证反面照
          idValidTo: '', // *身份证有效期
          driverLicense: '', // *驾照号
          driverLicense1: '', // *驾照正面照
          driverLicense2: '', // *驾照副页照
          licenseValidTo: '', // *驾照有效期
          verifyFlagName: '', // *实名认证状态
          firstLoginFlagName: '', // *是否首次登录
          latestLoginTime: '', // *最近登录时间
          notifyFlagName: '', // *消息通知
          status: '',
          statusName: '',
          geoFlagName: '', // *地图定位
          allowFollowedName: '', // *允许添加好友
          allowPkName: '', // *允许接收挑战
          onlineStatusName: '', // *在线状态
          createTime: '', // *创建时间
          updateTime: '', // 更新时间
          tripCount: '',
          tripMiles: '',
          tripHours: '',
          sourceName: '',
          deviceName: ''
        },
        fieldList: [
          { label: '在线状态', value: 'onlineStatusName', type: 'tag', className: 'el-form-block-80' },
          { label: '最近登录时间', value: 'latestLoginTime', type: 'tag', className: 'el-form-block-80' },
          { label: '登陆设备名称', value: 'deviceName', type: 'tag', className: 'el-form-block-80' },
          { label: '是否首次登录', value: 'firstLoginFlagName', type: 'tag', className: 'el-form-block-80' },
          { label: '状态', value: 'statusName', type: 'tag', className: 'el-form-block-80' },
          { label: '注册时间', value: 'registerTime', type: 'tag', className: 'el-form-block-80' }
        ],
        fieldList2: [
          { label: '消息通知', value: 'notifyFlagName', type: 'tag', className: 'el-form-block-80' },
          { label: '地图定位', value: 'geoFlagName', type: 'tag', className: 'el-form-block-80' },
          { label: '允许添加好友', value: 'allowFollowedName', type: 'tag', className: 'el-form-block-80' },
          { label: '允许接收挑战', value: 'allowPkName', type: 'tag', className: 'el-form-block-80' },
          { label: '密码设定', value: 'passwordFlagName', type: 'tag', className: 'el-form-block-80' },
          { label: '注册来源', value: 'sourceName', type: 'tag', className: 'el-form-block-80' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      tableInfo2: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '车辆品牌', value: 'brandName', minWidth: 60 },
          { label: '系列', value: 'seriesName', minWidth: 90 },
          { label: '车牌号', value: 'plateNo', minWidth: 50 },
          { label: '认证状态', value: 'statusName', minWidth: 50 },
          { label: '默认车辆', value: 'defaultName', minWidth: 50 },
          { label: '驾驶证照片', type: 'image', value: 'driverLicense1', minWidth: 50 },
          { label: '行驶证照片', type: 'image', value: 'carLicenseUrl', minWidth: 70 }
        ]
      },
      tableInfo3: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '收货人', value: 'userName', minWidth: 40 },
          { label: '手机号码', value: 'phone', minWidth: 60 },
          { label: '地址详情', value: 'address', type: 'slot' },
          { label: '默认地址', value: 'defaultFlagName', type: 'slot', minWidth: 30 }
        ]
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          userId: null,
          itemId: null,
          itemName: null,
          itemType: null,
          rareType: null,
          status: null
        },
        list: [
          { type: 'input', label: '装备ID', value: 'itemId' },
          { type: 'input', label: '名称', value: 'itemName' },
          { type: 'customselect', label: '装备类型', value: 'itemType', list: 'equipmentList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '稀有度', value: 'rareType', list: 'rareTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'equipmentStatusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true }
        ]
      },
      // 表单相关（追加、修改）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '装备ID', value: 'itemId', minWidth: 60 },
          { label: '名称', value: 'itemName', minWidth: 70 },
          { label: '装备类型', value: 'itemTypeName', minWidth: 50 },
          { label: '图片', value: 'imageThumbnailUrl', type: 'image', minWidth: 50 },
          { label: '稀有度', value: 'rareType', minWidth: 50 },
          { label: '等级', value: 'grade', type: 'slot', minWidth: 70 },
          { label: '动力', value: 'powers', minWidth: 70 },
          { label: '稳定性', value: 'stable', minWidth: 70 },
          { label: '操控', value: 'control', minWidth: 70 },
          { label: '性能分', value: 'performance', minWidth: 70 },
          { label: '满级价值', value: 'fullValue', type: 'slot', minWidth: 70 },
          { label: '是否赞助', value: 'sponsorFlagName', minWidth: 70 },
          { label: '获得时间', value: 'buyTime', minWidth: 110 },
          { label: '获得渠道', value: 'sourceTypeName', minWidth: 70 },
          { label: '状态', value: 'statusName', type: 'slot', minWidth: 50 }
        ]
      },
      // 过滤相关配置（检索条件）
      filterInfo7: {
        query: {
          userId: null,
          refdocId: null,
          transType: null,
          priceType: null,
          validFrom: null,
          validTo: null,
          valid: []
        },
        list: [
          { type: 'input', label: '交易编号', value: 'refdocId' },
          { type: 'customselect', label: '交易类型', value: 'transType', list: 'transTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '货币类型', value: 'priceType', list: 'priceTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '交易时间', dateType: 'daterange', value: 'valid', event: 'pickDate' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search7', show: true }
        ]
      },
      // 表单相关（追加、修改）
      tableInfo7: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '交易ID', value: 'id', minWidth: 60 },
          { label: '交易类型', value: 'transTypeName', minWidth: 70 },
          { label: '货币类型', value: 'priceTypeName', minWidth: 50 },
          { label: '数量', value: 'number', minWidth: 50 },
          { label: '交易前数量', value: 'beforeTrading', minWidth: 50 },
          { label: '交易后数量', value: 'balance', minWidth: 70 },
          { label: '交易时间', value: 'transTime', minWidth: 70 },
          { label: '交易编号', value: 'refdocId', minWidth: 60 },
          { label: '相关凭证号', value: 'refdocno', minWidth: 60 },
          { label: '备注', value: 'remarks', minWidth: 60 }
        ]
      },
      // 过滤相关配置（检索条件）
      filterInfo4: {
        query: {
          userId: null,
          transNo: null,
          transPlat: null,
          transType: null,
          priceType: null,
          status: null
        },
        list: [
          { type: 'input', label: '编号', value: 'transNo' },
          { type: 'customselect', label: '交易类型', value: 'transType', list: 'tableInfo4TransTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '渠道', value: 'transPlat', list: 'tableInfo4TransPlatList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '货币类型', value: 'priceType', list: 'tableInfo4PriceTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'tableInfo4StatusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search4', show: true }
        ]
      },
      // 表单相关（追加、修改）
      tableInfo4: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '编号', value: 'transNo', minWidth: 60 },
          { label: '交易类型', value: 'transTypeName', type: 'slot', minWidth: 70 },
          { label: '渠道', value: 'transPlatName', minWidth: 50 },
          { label: '商品名称', value: 'itemName', minWidth: 80 },
          { label: '数量', value: 'quantity', minWidth: 40 },
          { label: '货币类型', value: 'priceTypeName', minWidth: 50 },
          { label: '金额', value: 'amount', type: 'slot', minWidth: 50 },
          { label: '交易时间', value: 'transTime', minWidth: 70 },
          { label: 'IOS/安卓', value: 'appTypeName', minWidth: 60 },
          { label: '交易状态', value: 'statusName', minWidth: 60 }
        ]
      },
      // 过滤相关配置（检索条件）
      filterInfo5: {
        query: {
          id: null,
          userId: null,
          raceType: null,
          playerResult: null,
          valid: [],
          startTime: null,
          endTime: null,
          status: null
        },
        list: [
          { type: 'input', label: '路赛ID', value: 'id' },
          { type: 'customselect', label: '比赛类型', value: 'raceType', list: 'raceTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '比赛结果', value: 'playerResult', list: 'playerResultList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '比赛时间', dateType: 'daterange', value: 'valid', event: 'raceDate' },
          { type: 'customselect', label: '状态', value: 'status', list: 'tableInfo5StatusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search5', show: true }
        ]
      },
      // 表单相关（追加、修改）
      tableInfo5: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '路赛ID', value: 'id', minWidth: 60 },
          { label: '比赛类型', value: 'raceTypeName' },
          { label: '官方联赛名称', value: 'cupTitle' },
          { label: '比赛地图名称', value: 'mapName' },
          { label: '用户1名称', value: 'player1UserName' },
          { label: '用户1比赛结果', value: 'player1ResultName' },
          { label: '用户2名称', value: 'player2UserName' },
          { label: '用户2比赛结果', value: 'player2ResultName' },
          { label: '比赛开始时间', value: 'startTime', width: 150 },
          { label: '比赛结束时间', value: 'endTime', width: 150 },
          { label: '状态', value: 'statusName', type: 'tag', minWidth: 70 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '100',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'tableInfo5Detail', show: true }
          ]
        }
      },
      userlist: [],
      merchantuserlist: [],
      userListSelection: null,
      dialogFormVisible: false,
      listLoading: false,
      listQuery: {
        id: 0,
        usernm: undefined,
        userphone: undefined,
        employeeno: undefined,
        usertype: undefined,
        hasuser: 0
      },
      temp: {
        userid: undefined,
        employeeno: '',
        usernm: '',
        usertype: '',
        isvalid: ''
      },
      isvalidOptions: ThConsts.ISVALID,
      usertypeOptions: ThConsts.STORE_USERTYPE,
      thUsertypeOptions: ThConsts.TH_USERTYPE,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建&设置角色'
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
    // TODO
  },
  created() {
    this.listQuery.id = this.$route.query.id
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
      // 画面控制
    },
    tripGetList() {
      const mparam = {
        'pageNum': this.currentPage,
        'pageSize': this.pageSize,
        'userId': this.userInfo.id
      }
      this.$handleAPI('', getListApi, mparam).then(res => {
        if (res.code === 200) {
          this.totalCount = res.data.total
          this.tripData = res.data.list
          this.tripData.forEach(item => {
            item.bonusGet = item.drawTimes + '/' + item.lotteryTimes
            item.tripTime = item.tripDays + '天' + item.tripHours + '小时' + item.tripMinutes + '分钟' + item.tripSeconds + '秒'
            item.speed = item.speed + '公里/小时'
            item.speedMax = item.speedMax + '公里/小时'
            item.distance = item.distance + '公里'
          })
        }
      })
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo1.ref) {
        this.formInfo1.ref.resetFields()
      }
      // 获取url参数
      this.formInfo1.data.id = this.$route.query.id
      // 获取用户信息详细
      const mparam = { 'id': this.formInfo1.data.id }
      this.$handleAPI('', getApi, mparam).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          const data = res.data
          this.userInfo = res.data
          // 显示信息
          for (const key in res.data) {
            // 存在则赋值
            if (key in this.formInfo1.data) {
              this.formInfo1.data[key] = data[key]
            }
          }
          // 初始化select选择框
          this.handleEvent('changeProvince', null)
          this.handleEvent('changeCity', null)
        }
      })
      const params = {
        'configType': 'USER_EQUIPMENT_FILTER_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.equipmentStatusList = res.data
        }
      })
      const rareTypeParams = {
        'configType': 'GAME_ITEM_RARE_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, rareTypeParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.rareTypeList = res.data
        }
      })
      const equipmentParam = {
        'configType': 'GAME_ITEM_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, equipmentParam).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.equipmentList = res.data
        }
      })
      var paramsUserId = { 'userId': this.formInfo1.data.id }
      this.$handleAPI('', getUserManageCarList, paramsUserId).then(res => {
        if (res.code === 200) {
          this.tableInfo2.data = res.data
        }
      })
      this.$handleAPI('', getUserAddressList, paramsUserId).then(res => {
        if (res.code === 200) {
          this.tableInfo3.data = res.data
        }
      })
    },
    expandChange(row, expanded) {
      // if (expandedRows.length > 1) {
      //   expandedRows.shift()
      // }
      var flag = false
      expanded.forEach(el => {
        if (el.id === row.id) {
          flag = true
        }
      })
      if (flag) { // 说明是展开，请求二级表格数据
        this.$handleAPI('', getBonusApi, { 'tripId': row.id }).then(res => {
          if (res.code === 200) {
            row.bonusList = res.data.list
          }
        })
      }
    },
    // 初始化验证
    initRules() {
      this.formInfo1.rules = this.$initRules(this.formInfo1.fieldList)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.tripGetList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.tripGetList()
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'ststusLock': {
          const props = {
            'id': this.formInfo1.data.id,
            'status': 2,
            'updateTime': this.formInfo1.data.updateTime,
            'createBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', updateApi, props).then(res => {
            if (res.code === 200) {
              this.getDetail()
            }
            this.$message({
              showClose: true,
              message: (res.code === 200) ? '操作完成' : res.message,
              type: (res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          })
          break
        }
        case 'ststusClose': {
          const props = {
            'id': this.formInfo1.data.id,
            'status': 7,
            'updateTime': this.formInfo1.data.updateTime,
            'createBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', updateApi, props).then(res => {
            if (res.code === 200) {
              this.getDetail()
            }
            this.$message({
              showClose: true,
              message: (res.code === 200) ? '操作完成' : res.message,
              type: (res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          })
          break
        }
        case 'deleteRobot': {
          var pass = true
          if (this.formInfo1.data.userType !== 9) {
            this.$message({
              showClose: true,
              message: '该用户不为机器人马甲,不能删除',
              type: 'error',
              duration: 3500
            })
            pass = false
          }
          if (pass) {
            const params = {
              'updateBy': this.$store.state.staff.staffId,
              'id': this.formInfo1.data.id
            }
            this.$handleAPI('delete', userDelete, params).then(res => {
              if (res.code === 200) {
                this.$store.dispatch('tagsView/delView', this.$route).then(() => {
                  this.$router.push({ path: './index', replace: true })
                })
              }
            })
          }
          break
        }
        case 'search': // 搜索
          // 重置分页
          this.tableInfo.initCurpage = 1 // 重新回第1页
          this.tableInfo.refresh = Math.random()
          break
        case 'search7': // 搜索
          // 重置分页
          this.tableInfo7.initCurpage = 1 // 重新回第1页
          this.tableInfo7.refresh = Math.random()
          break
        case 'search4': // 搜索
          // 重置分页
          this.tableInfo4.initCurpage = 1 // 重新回第1页
          this.tableInfo4.refresh = Math.random()
          break
        case 'search5': // 搜索
          // 重置分页
          this.tableInfo5.initCurpage = 1 // 重新回第1页
          this.tableInfo5.refresh = Math.random()
          break
        case 'tableInfo5Detail': {
          this.$router.push({ path: '../../race/history/detail', query: { id: data.id }, replace: true })
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'pickDate': {
          if (data) {
            this.filterInfo7.query.validFrom = data[0]
            this.filterInfo7.query.validTo = data[1]
          } else {
            this.filterInfo7.query.validFrom = ''
            this.filterInfo7.query.validTo = ''
          }
          break
        }
        case 'raceDate': {
          if (data) {
            this.filterInfo5.query.startTime = data[0]
            this.filterInfo5.query.endTime = data[1]
          } else {
            this.filterInfo5.query.startTime = ''
            this.filterInfo5.query.endTime = ''
          }
          break
        }
      }
    },
    userEquipmentList(tab, event) {
      switch (tab.name) {
        case 'tab2': { // 查询装备信息
          const performanceParams = {
            'userId': this.formInfo1.data.id
          }
          this.$handleAPI('', getSumPerformance, performanceParams).then(res => {
            if (res.code === 200) {
              this.sumPerformance = res.data
              if (this.sumPerformance === null) {
                this.sumPerformance = '0'
              }
            }
          })
          this.filterInfo.query.userId = this.formInfo1.data.id
          this.tableInfo.refresh = Math.random()
          break
        }
        case 'tab7': { // 查询账户信息
          const transParams = {
            'configType': 'USER_ACCOUNT_TRANS_TYPE'
          }
          this.$handleAPI('', getConfigItemsListApi, transParams).then(res => {
            if (res.code === 200) {
              this.listTypeInfo.transTypeList = res.data
            }
          })
          const params = {
            'userId': this.formInfo1.data.id
          }
          this.$handleAPI('', getUserAccountManage, params).then(res => {
            if (res.code === 200) {
              this.userAccount = res.data
              if (this.userAccount.gold === null) {
                this.userAccount.gold = '0'
              }
              if (this.userAccount.diamond === null) {
                this.userAccount.diamond = '0'
              }
              if (this.userAccount.goldLock === null) {
                this.userAccount.goldLock = '0'
              }
              if (this.userAccount.diamondLock === null) {
                this.userAccount.diamondLock = '0'
              }
            }
          })
          this.filterInfo7.query.userId = this.formInfo1.data.id
          this.tableInfo7.refresh = Math.random()
          break
        }
        case 'tab5': { // 查询装备信息
          const priceTypeParams = {
            'configType': 'GAME_ITEM_PRICE_TYPE'
          }
          this.$handleAPI('', getConfigItemsListApi, priceTypeParams).then(res => {
            if (res.code === 200) {
              this.listTypeInfo.tableInfo4PriceTypeList = res.data
            }
          })
          const transTypeParams = {
            'configType': 'USER_TRANS_SEARCH_TYPE'
          }
          this.$handleAPI('', getConfigItemsListApi, transTypeParams).then(res => {
            if (res.code === 200) {
              this.listTypeInfo.tableInfo4TransTypeList = res.data
            }
          })
          const transPlatParams = {
            'configType': 'USER_TRANS_PLAT'
          }
          this.$handleAPI('', getConfigItemsListApi, transPlatParams).then(res => {
            if (res.code === 200) {
              this.listTypeInfo.tableInfo4TransPlatList = res.data
            }
          })
          const statusParams = {
            'configType': 'USER_TRANS_ORDER_STATUS'
          }
          this.$handleAPI('', getConfigItemsListApi, statusParams).then(res => {
            if (res.code === 200) {
              this.listTypeInfo.tableInfo4StatusList = res.data
            }
          })
          this.filterInfo4.query.userId = this.formInfo1.data.id
          this.tableInfo4.refresh = Math.random()
          break
        }
        case 'tab3': {
          this.tripGetList()
          if (this.formInfo1.data.tripCount === null) {
            this.formInfo1.data.tripCount = '0'
          }
          if (this.formInfo1.data.tripHours === null) {
            this.formInfo1.data.tripHours = '0'
          }
          if (this.formInfo1.data.tripMiles === null) {
            this.formInfo1.data.tripMiles = '0'
          }
          break
        }
        case 'tab6': {
          const raceTypeParams = {
            'configType': 'USER_RACE_TYPE'
          }
          this.$handleAPI('', getConfigItemsListApi, raceTypeParams).then(res => {
            if (res.code === 200) {
              this.listTypeInfo.raceTypeList = res.data
            }
          })
          const playerResultParams = {
            'configType': 'USER_RACE_RESULT'
          }
          this.$handleAPI('', getConfigItemsListApi, playerResultParams).then(res => {
            if (res.code === 200) {
              this.listTypeInfo.playerResultList = res.data
            }
          })
          const statusParams = {
            'configType': 'USER_RACE_STATUS'
          }
          this.$handleAPI('', getConfigItemsListApi, statusParams).then(res => {
            if (res.code === 200) {
              var arr = []
              res.data.forEach(item => {
                if (item.itemValue !== '1' && item.itemValue !== '2') {
                  arr.push(item)
                }
              })
              this.listTypeInfo.tableInfo5StatusList = arr
            }
          })
          this.filterInfo5.query.userId = this.formInfo1.data.id
          this.tableInfo5.refresh = Math.random()
          break
        }
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getUserList()
    },
    resetTemp() {
      this.temp = {
        userid: undefined,
        employeeno: '',
        usernm: '',
        usertype: '',
        isvalid: ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .tab-container {
    margin: 30px;
  }
  .form-merchant-container {
    margin: 30px;
  }
  .image {
    width: 100%;
    display: block;
  }
  .imgdiv {
    height: 100px;
    overflow: hidden;
  }
</style>
