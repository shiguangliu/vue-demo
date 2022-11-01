<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="新增马甲" name="tab1">
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
          <template v-slot:form-manTotal>
            <div style="width:50%; display:inline-block">
              <el-input
                v-model="formInfo.data.manTotal"
                :placeholder="getPlaceholder(formInfo.fieldList[4])"
                @change="changeMan()"
              >
                <template slot="append">%</template>
              </el-input>
            </div>
            <div style="width:30%; display:inline-block; margin-left:5%">
              {{ '实际:' + formInfo.data.manTotalText + '人' }}
            </div>
          </template>
          <template v-slot:form-womanTotal>
            <div style="width:50%; display:inline-block">
              <el-input
                v-model="formInfo.data.womanTotal"
                :placeholder="getPlaceholder(formInfo.fieldList[6])"
                @change="changeWoman()"
              >
                <template slot="append">%</template>
              </el-input>
            </div>
            <div style="width:30%; display:inline-block; margin-left:5%">
              {{ '实际:' + formInfo.data.womanTotalText + '人' }}
            </div>
          </template>
          <template v-slot:form-robotAvatarIds>
            <el-button type="primary" @click="handleClick('selectAvatar')">{{ formInfo.data.robotAvatarIds.length > 0 ? '修改' : '选择头像' }}</el-button>
          </template>
          <template v-slot:form-robotCarList>
            <el-button type="primary" @click="handleClick('selectCar')">{{ formInfo.data.robotCarList.length > 0 ? '修改' : '选择认证车辆' }}</el-button>
          </template>
          <template v-slot:form-robotUserTagList>
            <el-button type="primary" @click="handleClick('selectUserTag')">{{ formInfo.data.robotUserTagList.length > 0 ? '修改' : '选择标签' }}</el-button>
          </template>
          <template v-slot:form-robotGameList>
            <el-button type="primary" @click="handleClick('selectGame')">{{ formInfo.data.robotGameList.length > 0 ? '修改' : '选择装备' }}</el-button>
          </template>
          <template v-slot:form-robotProfileList>
            <el-button type="primary" @click="handleClick('selectProfile')">{{ formInfo.data.robotProfileList.length > 0 ? '修改' : '选择签名' }}</el-button>
          </template>
          <template v-slot:form-robotGeoList>
            <el-button type="primary" @click="handleClick('selectGeo')">{{ formInfo.data.robotGeoList.length > 0 ? '修改' : '选择位置' }}</el-button>
          </template>
          <template v-slot:form-robotTagList>
            <el-button type="primary" @click="handleClick('selectTag')">{{ formInfo.data.robotTagList.length > 0 ? '修改' : '选择标签' }}</el-button>
          </template>
        </page-form>
        <page-filter
          :query.sync="filterInfo.query"
          :filter-list="filterInfo.list"
          :list-type-info="listTypeInfo"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 选择马甲头像 -->
    <page-dialog
      v-if="dialogAvatar.visible"
      :visible.sync="dialogAvatar.visible"
      :title="dialogAvatar.title"
      :width="dialogAvatar.width"
      :bt-loading="dialogAvatar.btLoading"
      :bt-list="dialogAvatar.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <div class="header-all">
        <b>马甲头像库</b>
        <el-checkbox v-model="allSelected" style="padding-left: 15px" @change="handleAllSelect">全选</el-checkbox>
      </div>
      <el-row :gutter="5">
        <el-col v-for="(avatar,index) in avatarList" :key="avatar.id" :xs="12" :sm="12" :lg="3">
          <el-card class="box-card-avatar" :body-style="{ padding: '5px' }">
            <div>
              <el-checkbox v-model="selectAvatar[index].checked" @change="handleClick('selectdAvatar', index)">选择</el-checkbox>
            </div>
            <div>
              <el-image
                v-imgAlart
                :src="$TH.FILE_URLS.static_url + avatar.avatarUrl"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </page-dialog>
    <!-- 选择认证车辆 -->
    <page-dialog
      v-if="dialogCar.visible"
      :visible.sync="dialogCar.visible"
      :title="dialogCar.title"
      :width="dialogCar.width"
      :bt-loading="dialogCar.btLoading"
      :bt-list="dialogCar.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-filter
        :query.sync="filterCarInfo.query"
        :filter-list="filterCarInfo.list"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
      <el-row>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已选中的认证车辆</span>
            </div>
            <div style="overflow:hidden;">
              <template v-for="car in formInfo.data.robotCarList">
                <el-tag
                  :key="car.id"
                  closable
                  size="medium"
                  :disable-transitions="false"
                  @close="handleClick('delCar', car)"
                >
                  {{ car.seriesName }}
                </el-tag>
              </template>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18">
          <page-table
            class="popTable"
            :table-index="tableCarInfo.tableIndex"
            :check-box="tableCarInfo.checkBox"
            :refresh="tableCarInfo.refresh"
            :init-curpage="tableCarInfo.initCurpage"
            :data.sync="tableCarInfo.data"
            :api="getCarSeriesList"
            :query="filterCarInfo.query"
            :field-list="tableCarInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="tableCarInfo.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
        </el-col>
      </el-row>
    </page-dialog>
    <!-- 选择兴趣爱好标签 -->
    <page-dialog
      v-if="dialogUserTag.visible"
      :visible.sync="dialogUserTag.visible"
      :title="dialogUserTag.title"
      :width="dialogUserTag.width"
      :bt-loading="dialogUserTag.btLoading"
      :bt-list="dialogUserTag.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-filter
        :query.sync="filterUserTagInfo.query"
        :filter-list="filterUserTagInfo.list"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
      <el-row>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已选中的兴趣爱好标签</span>
            </div>
            <div style="overflow:hidden;">
              <template v-for="usertag in formInfo.data.robotUserTagList">
                <el-tag
                  :key="usertag.tagId"
                  closable
                  size="medium"
                  :disable-transitions="false"
                  @close="handleClick('delUserTag', usertag)"
                >
                  {{ usertag.tagName }}
                </el-tag>
              </template>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18">
          <page-table
            class="popTable"
            :table-index="tableUserTagInfo.tableIndex"
            :check-box="tableUserTagInfo.checkBox"
            :refresh="tableUserTagInfo.refresh"
            :init-curpage="tableUserTagInfo.initCurpage"
            :data.sync="tableUserTagInfo.data"
            :api="getUserHobbyTagList"
            :query="filterUserTagInfo.query"
            :field-list="tableUserTagInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="tableUserTagInfo.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
        </el-col>
      </el-row>
    </page-dialog>
    <!-- 选择虚拟装备 -->
    <page-dialog
      v-if="dialogGame.visible"
      :visible.sync="dialogGame.visible"
      :title="dialogGame.title"
      :width="dialogGame.width"
      :bt-loading="dialogGame.btLoading"
      :bt-list="dialogGame.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-filter
        :query.sync="filterGameInfo.query"
        :filter-list="filterGameInfo.list"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
      <el-row>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已选中的虚拟装备</span>
            </div>
            <div style="overflow:hidden;">
              <template v-for="game in formInfo.data.robotGameList">
                <el-tag
                  :key="game.id"
                  closable
                  size="medium"
                  :disable-transitions="false"
                  @close="handleClick('delGame', game)"
                >
                  {{ game.itemName }}
                </el-tag>
              </template>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18">
          <page-table
            class="popTable"
            :table-index="tableGameInfo.tableIndex"
            :check-box="tableGameInfo.checkBox"
            :refresh="tableGameInfo.refresh"
            :init-curpage="tableGameInfo.initCurpage"
            :data.sync="tableGameInfo.data"
            :api="getGameItemListApi"
            :query="filterGameInfo.query"
            :field-list="tableGameInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="tableGameInfo.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
        </el-col>
      </el-row>
    </page-dialog>
    <!-- 选择签名 -->
    <page-dialog
      v-if="dialogProfile.visible"
      :visible.sync="dialogProfile.visible"
      :title="dialogProfile.title"
      :width="dialogProfile.width"
      :bt-loading="dialogProfile.btLoading"
      :bt-list="dialogProfile.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-filter
        :query.sync="filterProfileInfo.query"
        :filter-list="filterProfileInfo.list"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
      <el-row>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已选中的签名</span>
            </div>
            <div style="overflow:hidden;">
              <template v-for="profile in formInfo.data.robotProfileList">
                <el-tag
                  :key="profile.id"
                  closable
                  size="medium"
                  :disable-transitions="false"
                  @close="handleClick('delProfile', profile)"
                >
                  {{ profile.profile }}
                </el-tag>
              </template>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18">
          <page-table
            class="popTable"
            :table-index="tableProfileInfo.tableIndex"
            :check-box="tableProfileInfo.checkBox"
            :refresh="tableProfileInfo.refresh"
            :init-curpage="tableProfileInfo.initCurpage"
            :data.sync="tableProfileInfo.data"
            :api="getProfileList"
            :query="filterProfileInfo.query"
            :field-list="tableProfileInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="tableProfileInfo.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
        </el-col>
      </el-row>
    </page-dialog>
    <!-- 选择位置 -->
    <page-dialog
      v-if="dialogGeo.visible"
      :visible.sync="dialogGeo.visible"
      :title="dialogGeo.title"
      :width="dialogGeo.width"
      :bt-loading="dialogGeo.btLoading"
      :bt-list="dialogGeo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-filter
        :query.sync="filterGeoInfo.query"
        :filter-list="filterGeoInfo.list"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
      <el-row>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已选中的位置</span>
            </div>
            <div style="overflow:hidden;">
              <template v-for="geo in formInfo.data.robotGeoList">
                <el-tag
                  :key="geo.areaId"
                  closable
                  size="medium"
                  :disable-transitions="false"
                  @close="handleClick('delGeo', geo)"
                >
                  {{ geo.areaName }}
                </el-tag>
              </template>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18">
          <page-table
            class="popTable"
            :table-index="tableGeoInfo.tableIndex"
            :check-box="tableGeoInfo.checkBox"
            :refresh="tableGeoInfo.refresh"
            :init-curpage="tableGeoInfo.initCurpage"
            :data.sync="tableGeoInfo.data"
            :api="getAreaSelectByList"
            :query="filterGeoInfo.query"
            :field-list="tableGeoInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="tableGeoInfo.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
        </el-col>
      </el-row>
    </page-dialog>
    <!-- 选择标签 -->
    <page-dialog
      v-if="dialogTag.visible"
      :visible.sync="dialogTag.visible"
      :title="dialogTag.title"
      :width="dialogTag.width"
      :bt-loading="dialogTag.btLoading"
      :bt-list="dialogTag.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-filter
        :query.sync="filterTagInfo.query"
        :filter-list="filterTagInfo.list"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
      <el-row>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>已选中的标签</span>
            </div>
            <div style="overflow:hidden;">
              <template v-for="tag in formInfo.data.robotTagList">
                <el-tag
                  :key="tag.id"
                  closable
                  size="medium"
                  :disable-transitions="false"
                  @close="handleClick('delTag', tag)"
                >
                  {{ tag.tagName }}
                </el-tag>
              </template>
            </div>
          </el-card>
        </el-col>
        <el-col :span="18">
          <page-table
            class="popTable"
            :table-index="tableTagInfo.tableIndex"
            :check-box="tableTagInfo.checkBox"
            :refresh="tableTagInfo.refresh"
            :init-curpage="tableTagInfo.initCurpage"
            :data.sync="tableTagInfo.data"
            :api="getRobotTagList"
            :query="filterTagInfo.query"
            :field-list="tableTagInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="tableTagInfo.handle"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
        </el-col>
      </el-row>
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi, getBrandGroupApi, getBrandNameListApi, cityOptionsList } from '@/api/common'
import { getUserHobbyTagList } from '@/api/best/tag'
import { getGameItemListApi } from '@/api/popup'
import { getListApi as getCarSeriesList } from '@/api/merchant/carSeries'
import { getListApi as getProfileList } from '@/api/robot/profile'
import { getRobotTagList } from '@/api/robot/tag/index'
import { getAreaSelectByList } from '@/api/sysarea'
import { getListApi } from '@/api/robot/avatar'
import { createRobotApi } from '@/api/robot/create'
import defaultImage from '@/assets/img/no-pic.jpg'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import PageTable from '@/components/PageTable'

export default {
  components: {
    PageFilter,
    PageForm,
    PageDialog,
    PageTable
  },
  data() {
    const checkTotal = (rule, value, callback) => {
      const check = this.$validate({ label: '生成马甲数量', value, rules: ['notnull', 'length', 'int'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkTripMiles = (rule, value, callback) => {
      const check = this.$validate({ label: '累计里程', value, rules: ['notnull', 'length', 'number'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkTripHours = (rule, value, callback) => {
      const check = this.$validate({ label: '累计时长', value, rules: ['notnull', 'length', 'number'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkManTotal = (rule, value, callback) => {
      const check = this.$validate({ label: '男性占比', value, rules: ['notnull', 'length', 'number'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkWomanTotal = (rule, value, callback) => {
      const check = this.$validate({ label: '女性占比', value, rules: ['notnull', 'length', 'number'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkRaceNormalCount = (rule, value, callback) => {
      const check = this.$validate({ label: '累计次数', value, rules: ['notnull', 'length', 'int'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      getUserHobbyTagList,
      getGameItemListApi,
      getCarSeriesList,
      getProfileList,
      getAreaSelectByList,
      getRobotTagList,
      getListApi,
      activeName: 'tab1',
      avatarList: [],
      selectAvatar: [],
      allSelected: false,
      // 相关列表
      listTypeInfo: {
        itemTypeList: [],
        rareTypeList: [],
        carBrandNameList: [], // 车辆品牌
        brandGroupList: [], // 车辆品牌组
        provinceIdOptionsList: [],
        cityOptionsList: []
      },
      filterInfo: {
        query: {
        },
        list: [
          { type: 'button', label: '生成马甲', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false, float: 'right' }
        ]
      },
      // 表单内容
      formInfo: {
        ref: null,
        readOnly: false,
        data: {
          total: '',
          tripMiles: '',
          manTotal: '',
          tripHours: '',
          womanTotal: '',
          raceNormalCount: '',
          womanTotalText: 0,
          manTotalText: 0,
          // robotAvatarList: [],
          robotAvatarIds: [],
          robotCarList: [],
          robotCarIds: [],
          robotUserTagList: [],
          robotUserTagIds: [],
          robotGameList: [],
          robotGameIds: [],
          robotProfileList: [],
          robotProfileIds: [],
          robotGeoList: [],
          robotGeoIds: [],
          robotTagList: [],
          robotTagIds: []
        },
        fieldList: [
          { label: '生成马甲数量', value: 'total', type: 'input', required: true, validator: checkTotal, className: 'el-form-inline-block-30' },
          { label: '', value: '', type: '', className: 'el-form-inline-block-20' },
          { label: '累计里程', value: 'tripMiles', type: 'input', required: true, validator: checkTripMiles, fixtext: 'KM', append: 'append', className: 'el-form-inline-block-25' },
          { label: '', value: '', type: '', className: 'el-form-inline-block-20' },
          { label: '男性占比', value: 'manTotal', type: 'slot', required: true, validator: checkManTotal, fixtext: '%', append: 'append', className: 'el-form-inline-block-50' },
          { label: '累计时长', value: 'tripHours', type: 'input', required: true, validator: checkTripHours, fixtext: 'h', append: 'append', className: 'el-form-inline-block-25' },
          { label: '女性占比', value: 'womanTotal', type: 'slot', required: true, validator: checkWomanTotal, fixtext: '%', append: 'append', className: 'el-form-inline-block-50' },
          { label: '累计次数', value: 'raceNormalCount', type: 'input', required: true, validator: checkRaceNormalCount, className: 'el-form-inline-block-25' },
          { label: '马甲头像', value: 'robotAvatarIds', type: 'slot', required: true, className: 'el-form-inline-block-50' },
          { label: '认证车辆', value: 'robotCarList', type: 'slot', required: true, className: 'el-form-inline-block-50' },
          { label: '兴趣爱好标签', value: 'robotUserTagList', type: 'slot', required: true, className: 'el-form-inline-block-50' },
          { label: '虚拟装备', value: 'robotGameList', type: 'slot', required: true, className: 'el-form-inline-block-50' },
          { label: '个性签名', value: 'robotProfileList', type: 'slot', required: true, className: 'el-form-inline-block-50' },
          { label: '位置信息', value: 'robotGeoList', type: 'slot', required: true, className: 'el-form-inline-block-50' },
          { label: '马甲标签', value: 'robotTagList', type: 'slot', required: true, className: 'el-form-inline-block-50' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 选择马甲头像
      dialogAvatar: {
        title: '选择马甲头像',
        visible: false,
        width: '70%',
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', btType: 'primary', type: 'button', icon: 'el-icon-close', event: 'closeDialogAvatar', show: true }
        ]
      },
      // 选择认证车辆
      dialogCar: {
        title: '选择认证车辆',
        visible: false,
        width: '75%',
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', btType: 'primary', type: 'button', icon: 'el-icon-close', event: 'closeDialogCar', show: true }
        ]
      },
      filterCarInfo: {
        query: {
          id: '',
          seriesName: null,
          firstLetter: null,
          groupId: '',
          brandId: '',
          status: 2
        },
        list: [
          { type: 'input', label: '车辆系列ID', value: 'id' },
          { type: 'input', label: '车辆系列名称', value: 'seriesName' },
          { type: 'customselect', label: '所属品牌组', value: 'groupId', list: 'brandGroupList', key: 'id', name: 'groupName', event: 'changegroupId' },
          { type: 'customselect', label: '所属品牌', value: 'brandId', list: 'carBrandNameList', key: 'id', name: 'brandName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchCar', show: true }
        ]
      },
      tableCarInfo: {
        refresh: 1,
        tableIndex: false, // 是否显示序号
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '车辆系列ID', value: 'id', width: 60 },
          { label: '车辆系列名称', value: 'seriesName' },
          { label: '图片', value: 'icon', type: 'image' },
          { label: '所属品牌组', value: 'carGroupName' },
          { label: '所属品牌', value: 'brandName' },
          { label: '创建时间', value: 'createTime' },
          { label: '状态', value: 'itemName', type: 'tag' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '120',
          btList: [
            { label: '选择', type: 'primary', icon: 'el-icon-plus', event: 'selectdCar', show: true }
          ]
        }
      },
      // 选择兴趣爱好标签
      dialogUserTag: {
        title: '选择兴趣爱好标签',
        visible: false,
        width: '70%',
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', btType: 'primary', type: 'button', icon: 'el-icon-close', event: 'closeDialogUserTag', show: true }
        ]
      },
      filterUserTagInfo: {
        query: {
          tagId: null,
          tagName: null
        },
        list: [
          { type: 'input', label: '标签ID', value: 'tagId' },
          { type: 'input', label: '标签名称', value: 'tagName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchUserTag', show: true }
        ]
      },
      tableUserTagInfo: {
        tableIndex: false, // 显示序号
        checkBox: false,
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '兴趣爱好标签ID', value: 'tagId', width: '120' },
          { label: '兴趣爱好标签名称', value: 'tagName' },
          { label: '标签图片', value: 'imageUrl', type: 'image' },
          { label: '排序', value: 'sort', width: '100' },
          { label: '创建时间', value: 'createTime', width: '200' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '180',
          btList: [
            { label: '选择', type: 'primary', icon: 'el-icon-plus', event: 'selectdUserTag', show: true }
          ]
        }
      },
      // 选择虚拟装备
      dialogGame: {
        title: '选择虚拟装备',
        visible: false,
        width: '70%',
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', btType: 'primary', type: 'button', icon: 'el-icon-close', event: 'closeDialogGame', show: true }
        ]
      },
      filterGameInfo: {
        query: {
          itemType: '',
          rareType: '',
          id: '',
          keywords: '',
          status: 2,
          diff: 1
        },
        list: [
          { type: 'customselect', label: '装备类型', value: 'itemType', list: 'itemTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'customselect', label: '稀有度', value: 'rareType', list: 'rareTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'input', label: '关键词', value: 'keywords' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchGame', show: true }
        ]
      },
      tableGameInfo: {
        refresh: 1,
        tableIndex: false, // 是否显示序号
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '装备ID', value: 'id', width: 80 },
          { label: '装备类型', value: 'itemTypeName' },
          { label: '稀有度', value: 'rareTypeName' },
          { label: '装备名称', value: 'itemName' },
          { label: '缩略图', value: 'imageThumbnailUrl', type: 'image', width: 100 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '120',
          btList: [
            { label: '选择', type: 'primary', icon: 'el-icon-plus', event: 'selectdGame', show: true }
          ]
        }
      },
      // 选择签名
      dialogProfile: {
        title: '选择签名',
        visible: false,
        width: '70%',
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', btType: 'primary', type: 'button', icon: 'el-icon-close', event: 'closeDialogProfile', show: true }
        ]
      },
      filterProfileInfo: {
        query: {
          id: ''
        },
        list: [
          { type: 'input', label: '签名ID', value: 'id' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchProfile', show: true }
        ]
      },
      tableProfileInfo: {
        refresh: 1,
        tableIndex: false, // 是否显示序号
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '签名ID', value: 'id', width: 120 },
          { label: '签名内容', value: 'profile' },
          { label: '创建时间', value: 'createTime', width: 150 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '120',
          btList: [
            { label: '选择', type: 'primary', icon: 'el-icon-plus', event: 'selectdProfile', show: true }
          ]
        }
      },
      // 选择位置
      dialogGeo: {
        title: '选择位置',
        visible: false,
        width: '70%',
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', btType: 'primary', type: 'button', icon: 'el-icon-close', event: 'closeDialogGeo', show: true }
        ]
      },
      filterGeoInfo: {
        query: {
          areaName: '',
          level: 3,
          provinceId: '',
          cityId: ''
        },
        list: [
          { type: 'input', label: '城市名称', value: 'areaName' },
          { type: 'customselect', label: '所属省级  ', value: 'provinceId', list: 'provinceIdOptionsList', key: 'areaId', name: 'areaName', event: 'changeProvinceId' },
          { type: 'customselect', label: '所属城市', value: 'cityId', list: 'cityOptionsList', key: 'areaId', name: 'areaName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchGeo', show: true }
        ]
      },
      tableGeoInfo: {
        refresh: 1,
        tableIndex: false, // 是否显示序号
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '地区ID', value: 'areaId' },
          { label: '地区名称', value: 'areaName' },
          { label: '城市ID', value: 'parentId' },
          { label: '城市名称', value: 'parentName' },
          { label: '省ID', value: 'topId' },
          { label: '省名称', value: 'topName' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '120',
          btList: [
            { label: '选择', type: 'primary', icon: 'el-icon-plus', event: 'selectdGeo', show: true }
          ]
        }
      },
      // 选择标签
      dialogTag: {
        title: '选择标签',
        visible: false,
        width: '70%',
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', btType: 'primary', type: 'button', icon: 'el-icon-close', event: 'closeDialogTag', show: true }
        ]
      },
      filterTagInfo: {
        query: {
          id: '',
          tagName: null
        },
        list: [
          { type: 'input', label: '标签ID', value: 'id' },
          { type: 'input', label: '标签名称', value: 'tagName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'searchTag', show: true }
        ]
      },
      tableTagInfo: {
        refresh: 1,
        tableIndex: false, // 是否显示序号
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '标签ID', value: 'id', width: 90 },
          { label: '标签名称', value: 'tagName', width: 300 },
          { label: '标签说明', value: 'tagDesc' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '120',
          btList: [
            { label: '选择', type: 'primary', icon: 'el-icon-plus', event: 'selectdTag', show: true }
          ]
        }
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
    'formInfo.data.total'(val) {
      // 刷新人数
      this.refreshTotal()
    },
    'formInfo.data.robotAvatarIds'(val) {
      console.log(this.formInfo.data.robotAvatarIds)
    }
  },
  created() {
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('robotCreate', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      const formInfo = this.formInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
    },
    initList() {
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_TYPE' }).then(res => {
        if (res.code === 200) {
          var itemTypeList = res.data
          for (var item of itemTypeList) {
            if (item.itemValue < 30) {
              this.listTypeInfo.itemTypeList.push(item)
            }
          }
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_RARE_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.rareTypeList = res.data
        }
      })
      this.$handleAPI('', getBrandGroupApi, '').then(res => {
        if (res.code === 200) {
          this.listTypeInfo.brandGroupList = res.data
        }
      })
      const param = { 'level': 1, 'status': 1 }
      this.$handleAPI('', cityOptionsList, param).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.provinceIdOptionsList = res.data
        }
      })
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
      const tableUserTagInfo = this.tableUserTagInfo
      switch (event) {
        case 'create': // 生成马甲
          // 判断装备里是否有选择车辆
          var isHaveCar = false
          this.formInfo.data.robotGameList.forEach(function(item) {
            if (item.itemType === 10) {
              isHaveCar = true
            }
          })
          if (!isHaveCar) {
            this.$message({
              showClose: true,
              message: '虚拟装备必须选择至少一个车辆类装备',
              type: 'error',
              duration: 3500
            })
          }
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const param = { 'tripMiles': this.formInfo.data.tripMiles, 'tripHours': this.formInfo.data.tripHours, 'manTotal': this.formInfo.data.manTotalText,
                'womanTotal': this.formInfo.data.womanTotalText, 'tripCount': this.formInfo.data.raceNormalCount, 'robotAvatarIds': this.formInfo.data.robotAvatarIds,
                'robotCarIds': this.formInfo.data.robotCarIds, 'robotUserTagIds': this.formInfo.data.robotUserTagIds, 'robotGameIds': this.formInfo.data.robotGameIds,
                'robotProfileIds': this.formInfo.data.robotProfileIds, 'robotGeoIds': this.formInfo.data.robotGeoIds, 'robotTagIds': this.formInfo.data.robotTagIds }
              this.$handleAPI('', createRobotApi, param).then(res => {
                if (res.code === 200) {
                  this.$message({
                    showClose: true,
                    message: '创建成功',
                    type: 'success',
                    duration: 3500
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
            }
          })
          break
        // 选择马甲头像
        case 'selectAvatar':
          this.dialogAvatar.visible = true
          this.$nextTick(() => {
            this.$handleAPI('', getListApi, '').then(res => {
              if (res.code === 200) {
                this.avatarList = res.data.listAvatars
                this.avatarList.forEach(item => {
                  if (this.formInfo.data.robotCarIds.indexOf(item.id) === -1) {
                    this.selectAvatar.push({ id: item.id, checked: false })
                  } else {
                    this.selectAvatar.push({ id: item.id, checked: true })
                  }
                })
              }
            })
          })
          break
        case 'closeDialogAvatar':
          this.dialogAvatar.visible = false
          break
        case 'selectdAvatar':
          if (this.selectAvatar[data].checked) {
            // 选中
            this.formInfo.data.robotAvatarIds.push(this.selectAvatar[data].id)
          } else {
            // 取消选中
            this.formInfo.data.robotAvatarIds.splice(this.formInfo.data.robotAvatarIds.indexOf(this.selectAvatar[data].id), 1)
          }
          break
        // 选择虚拟装备
        case 'selectCar':
          this.dialogCar.visible = true
          this.$nextTick(() => {
            this.tableCarInfo.refresh = Math.random()
          })
          break
        case 'closeDialogCar':
          this.dialogCar.visible = false
          break
        case 'searchCar':
          this.tableCarInfo.initCurpage = 1 // 重新回第1页
          this.tableCarInfo.refresh = Math.random()
          break
        case 'selectdCar':
          if (this.formInfo.data.robotCarIds.indexOf(data.id) === -1) {
            this.formInfo.data.robotCarList.push(data)
            this.formInfo.data.robotCarIds.push(data.id)
          }
          break
        case 'delCar':
          this.formInfo.data.robotCarList.splice(this.formInfo.data.robotCarList.indexOf(data), 1)
          this.formInfo.data.robotCarIds.splice(this.formInfo.data.robotCarIds.indexOf(data.id), 1)
          break
        // 选择兴趣爱好标签
        case 'selectUserTag':
          this.dialogUserTag.visible = true
          this.$nextTick(() => {
            tableUserTagInfo.refresh = Math.random()
          })
          break
        case 'closeDialogUserTag':
          this.dialogUserTag.visible = false
          break
        case 'searchUserTag':
          this.tableUserTagInfo.initCurpage = 1 // 重新回第1页
          this.tableUserTagInfo.refresh = Math.random()
          break
        case 'selectdUserTag':
          if (this.formInfo.data.robotUserTagIds.indexOf(data.tagId) === -1) {
            this.formInfo.data.robotUserTagList.push(data)
            this.formInfo.data.robotUserTagIds.push(data.tagId)
          }
          break
        case 'delUserTag':
          this.formInfo.data.robotUserTagList.splice(this.formInfo.data.robotUserTagList.indexOf(data), 1)
          this.formInfo.data.robotUserTagIds.splice(this.formInfo.data.robotUserTagIds.indexOf(data.tagId), 1)
          break
        // 选择虚拟装备
        case 'selectGame':
          this.dialogGame.visible = true
          this.$nextTick(() => {
            this.tableGameInfo.refresh = Math.random()
          })
          break
        case 'closeDialogGame':
          this.dialogGame.visible = false
          break
        case 'searchGame':
          this.tableGameInfo.initCurpage = 1 // 重新回第1页
          this.tableGameInfo.refresh = Math.random()
          break
        case 'selectdGame':
          if (this.formInfo.data.robotGameIds.indexOf(data.id) === -1) {
            this.formInfo.data.robotGameList.push(data)
            this.formInfo.data.robotGameIds.push(data.id)
          }
          break
        case 'delGame':
          this.formInfo.data.robotGameList.splice(this.formInfo.data.robotGameList.indexOf(data), 1)
          this.formInfo.data.robotGameIds.splice(this.formInfo.data.robotGameIds.indexOf(data.id), 1)
          break
        // 选择签名
        case 'selectProfile':
          this.dialogProfile.visible = true
          this.$nextTick(() => {
            this.tableProfileInfo.refresh = Math.random()
          })
          break
        case 'closeDialogProfile':
          this.dialogProfile.visible = false
          break
        case 'searchProfile':
          this.tableProfileInfo.initCurpage = 1 // 重新回第1页
          this.tableProfileInfo.refresh = Math.random()
          break
        case 'selectdProfile':
          if (this.formInfo.data.robotProfileIds.indexOf(data.id) === -1) {
            this.formInfo.data.robotProfileList.push(data)
            this.formInfo.data.robotProfileIds.push(data.id)
          }
          break
        case 'delProfile':
          this.formInfo.data.robotProfileList.splice(this.formInfo.data.robotProfileList.indexOf(data), 1)
          this.formInfo.data.robotProfileIds.splice(this.formInfo.data.robotProfileIds.indexOf(data.id), 1)
          break
        // 位置信息
        case 'selectGeo':
          this.dialogGeo.visible = true
          this.$nextTick(() => {
            this.filterGeoInfo.query.status = ''
            this.tableGeoInfo.refresh = Math.random()
          })
          break
        case 'closeDialogGeo':
          this.dialogGeo.visible = false
          break
        case 'searchGeo':
          this.tableGeoInfo.initCurpage = 1 // 重新回第1页
          this.tableGeoInfo.refresh = Math.random()
          break
        case 'selectdGeo':
          if (this.formInfo.data.robotGeoIds.indexOf(data.areaId) === -1) {
            this.formInfo.data.robotGeoList.push(data)
            this.formInfo.data.robotGeoIds.push(data.areaId)
          }
          break
        case 'delGeo':
          this.formInfo.data.robotGeoList.splice(this.formInfo.data.robotGeoList.indexOf(data), 1)
          this.formInfo.data.robotGeoIds.splice(this.formInfo.data.robotGeoIds.indexOf(data.areaId), 1)
          break
        // 选择标签
        case 'selectTag':
          this.dialogTag.visible = true
          this.$nextTick(() => {
            this.tableTagInfo.refresh = Math.random()
          })
          break
        case 'closeDialogTag':
          this.dialogTag.visible = false
          break
        case 'searchTag':
          this.tableTagInfo.initCurpage = 1 // 重新回第1页
          this.tableTagInfo.refresh = Math.random()
          break
        case 'selectdTag':
          if (this.formInfo.data.robotTagIds.indexOf(data.id) === -1) {
            this.formInfo.data.robotTagList.push(data)
            this.formInfo.data.robotTagIds.push(data.id)
          }
          break
        case 'delTag':
          this.formInfo.data.robotTagList.splice(this.formInfo.data.robotTagList.indexOf(data), 1)
          this.formInfo.data.robotTagIds.splice(this.formInfo.data.robotTagIds.indexOf(data.id), 1)
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'changegroupId': // 对选择车辆品牌组时做选择
          this.filterCarInfo.query.brandId = null
          this.listTypeInfo.carBrandNameList = null
          if (this.filterCarInfo.query.groupId != null && this.filterCarInfo.query.groupId !== '') {
            const params = {
              'groupId': this.filterCarInfo.query.groupId
            }
            this.$handleAPI('', getBrandNameListApi, params).then(res => {
              if (res.code === 200) {
                this.listTypeInfo.carBrandNameList = res.data
              }
            })
          }
          break
        case 'changeProvinceId': // 对两级联动做处理
          this.filterGeoInfo.cityOptionsList = null
          this.filterGeoInfo.query.cityId = null
          if (this.filterGeoInfo.query.provinceId != null) {
            const params = {
              parentId: this.filterGeoInfo.query.provinceId,
              level: 2,
              status: 1
            }
            this.$handleAPI('', cityOptionsList, params).then(res => {
              if (res.code === 200) {
                this.listTypeInfo.cityOptionsList = res.data
              }
            })
          }
          break
      }
    },
    handleAllSelect() {
      if (this.allSelected) {
        this.selectAvatar.forEach(item => {
          item.checked = true
          this.formInfo.data.robotAvatarIds.push(item.id)
        })
      } else {
        this.selectAvatar.forEach(item => {
          item.checked = false
        })
        this.formInfo.data.robotAvatarIds = []
      }
    },
    changeMan() {
      var regPos = /^[0-9]*\.?[0-9]*$/
      if (this.formInfo.data.manTotal !== '' && regPos.test(this.formInfo.data.manTotal)) {
        this.formInfo.data.womanTotal = this.accSub(100, this.formInfo.data.manTotal)
        this.refreshTotal()
      }
    },
    changeWoman() {
      var regPos = /^[0-9]*\.?[0-9]*$/
      if (this.formInfo.data.womanTotal !== '' && regPos.test(this.formInfo.data.womanTotal)) {
        this.formInfo.data.manTotal = this.accSub(100, this.formInfo.data.womanTotal)
        this.refreshTotal()
      }
    },
    // 刷新人数
    refreshTotal() {
      var regPos = /^[0-9]*\.?[0-9]*$/
      var regInt = /^[+]{0,1}(\d+)$/
      if (regInt.test(this.formInfo.data.total) && regPos.test(this.formInfo.data.manTotal) && regPos.test(this.formInfo.data.womanTotal)) {
        if (this.formInfo.data.manTotal !== '') {
          this.formInfo.data.womanTotal = this.accSub(100, this.formInfo.data.manTotal)
        }
        if (this.formInfo.data.womanTotal !== '') {
          this.formInfo.data.manTotal = this.accSub(100, this.formInfo.data.womanTotal)
        }
        if (this.formInfo.data.total !== '' && (this.formInfo.data.manTotal !== '' || this.formInfo.data.womanTotal !== '')) {
          this.formInfo.data.womanTotalText = Math.round(this.formInfo.data.total * this.formInfo.data.womanTotal / 100)
          this.formInfo.data.manTotalText = this.formInfo.data.total - this.formInfo.data.womanTotalText
        }
      }
    },
    accSub(arg1, arg2) {
      var r1, r2, m, n
      try {
        r1 = arg1.toString().split('.')[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split('.')[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2))
      n = (r1 >= r2) ? r1 : r2
      return ((arg1 * m - arg2 * m) / m).toFixed(n)
    }
  }
}
</script>

<style scoped lang="scss">
.popTable {
  max-height: 490px !important;
  overflow: auto;
}
.box-card {
  width: 98%;
  height: 490px !important;
}
.el-tag {
  margin-right: 10px;
  margin-bottom: 6px;
}
.header-all {
  padding-right: 14px;
  align-items: center;
  font-size: 14px;
}
.box-card-avatar {
  width: 90%;
  margin: 5px 5px;
  border: 1px solid #13C0C5;
  font-size: 16px;
  .el-card__header .el-button {
    font-size: 16px;
  }
}
</style>
