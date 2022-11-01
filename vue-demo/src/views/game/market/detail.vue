<template>
  <div class="group-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="交易详情" name="tab1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
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
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>装备信息</span>
          </div>
          <page-form
            :ref-obj.sync="formInfo.ref"
            :data="formInfo.data"
            :field-list="formInfo.fieldList3"
            :rules="formInfo.rules"
            :label-width="formInfo.labelWidth"
            :list-type-info="listTypeInfo"
            :read-only="formInfo.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
          <br>
          <template>
            <el-table
              :data="adminMarketCarInfoDto"
              border
              height="118"
              tooltip-effect="dark"
              style="width: 100%;"
            >
              <el-table-column
                label="装备编号"
                width="120"
                align="center"
              >
                <template slot-scope="scope">{{ scope.row.itemNo || '-' }}</template>
              </el-table-column>
              <el-table-column
                label="装备名称"
                min-width="250"
                align="center"
              >
                <template slot-scope="scope">{{ scope.row.itemName || '-' }}</template>
              </el-table-column>
              <el-table-column
                label="装备类型"
                width="130"
                align="center"
              >
                <template slot-scope="scope">{{ scope.row.itemTypeName || '-' }}</template>
              </el-table-column>
              <el-table-column
                label="图片"
                width="150"
                align="center"
              >
                <template slot-scope="scope">
                  <img
                    v-imgAlart
                    :src="$TH.FILE_URLS.static_url + scope.row.imageThumbnailUrl"
                    style="height: 60px;"
                    :onerror="nopicture"
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="稀有度"
                width="100"
                align="center"
              >
                <template slot-scope="scope">{{ scope.row.rareType || '-' }}</template>
              </el-table-column>
              <el-table-column
                label="是否赞助"
                width="100"
                align="center"
              >
                <template slot-scope="scope">{{ scope.row.sponsorFlagName || '-' }}</template>
              </el-table-column>
              <el-table-column
                label="售卖等级"
                width="100"
                align="center"
              >
                <template slot-scope="scope">{{ scope.row.itemLevel || '-' }}</template>
              </el-table-column>
              <!-- 动力(LV. -->
              <el-table-column
                :label="powers(itemLevel)"
                width="130"
                align="center"
              >
                <template slot-scope="scope">{{ scope.row.powers || '-' }}</template>
              </el-table-column>
              <el-table-column
                :label="stable(itemLevel)"
                width="130"
                align="center"
              >
                <template slot-scope="scope">{{ scope.row.stable || '-' }}</template>
              </el-table-column>
              <el-table-column
                :label="control(itemLevel)"
                width="130"
                align="center"
              >
                <template slot-scope="scope">{{ scope.row.control || '-' }}</template>
              </el-table-column>
              <el-table-column
                :label="performance(itemLevel)"
                width="130"
                align="center"
              >
                <template slot-scope="scope">{{ scope.row.performance || '-' }}</template>
              </el-table-column>
            </el-table>
          </template>
        </el-card>
        <div>
          <el-row>
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>售卖者信息</span>
                </div>
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
            </el-col>
            <el-col :span="12">
              <el-card v-if="marketCarDetail.status == '2'" class="box-card">
                <div slot="header" class="clearfix">
                  <span>交易信息</span>
                </div>
                <page-form
                  :ref-obj.sync="formInfo.ref"
                  :data="formInfo.data"
                  :field-list="formInfo.fieldList2"
                  :rules="formInfo.rules"
                  :label-width="formInfo.labelWidth"
                  :list-type-info="listTypeInfo"
                  :read-only="formInfo.readOnly"
                  @handleClick="handleClick"
                  @handleEvent="handleEvent"
                />
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGameMarketInfo } from '@/api/game/market/detail'
import defaultImage from '@/assets/img/no-pic.jpg'
import PageForm from '@/components/PageForm'

export default {
  components: {
    PageForm
  },
  data() {
    return {
      itemLevel: '',
      activeName: 'tab1',
      marketCarDetail: [],
      adminMarketCarInfoDto: [],
      materiallist: [],
      listTypeInfo: {
        statusList: [],
        provinceList: [],
        cityList: [],
        districtList: []
      },
      formInfo: {
        ref: null,
        data: {
          userId: '' // *唯一ID
        },
        fieldList: [
          { label: '用户ID', value: 'soldUserId', type: 'tag', className: 'el-form-block' },
          { label: '用户昵称', value: 'soldUserName', type: 'tag', className: 'el-form-block' },
          { label: '手机号码', value: 'soldUserPhone', type: 'tag', className: 'el-form-block' }
        ],
        fieldList2: [
          { label: '交易订单编号', value: 'transNo', type: 'tag', className: 'el-form-block' },
          { label: '交易时间', value: 'transTime', type: 'tag' },
          { label: '买方ID', value: 'userId', type: 'tag' },
          { label: '买方用户昵称', value: 'userName', type: 'tag' },
          { label: '买方手机号码', value: 'userPhone', type: 'tag' }
        ],
        fieldList3: [
          { label: '价格', value: 'quotedPrice', type: 'tag', className: 'el-form-inline-block-30' },
          { label: '货币类型', value: 'priceTypeName', type: 'tag', className: 'el-form-inline-block-30' }
        ],
        fieldList4: [
          { label: '交易ID', value: 'id', type: 'tag', className: 'el-form-inline-block-20' },
          { label: '状态', value: 'statusName', type: 'tag', className: 'el-form-inline-block-20' },
          { label: '上架时间', value: 'releaseFrom', type: 'tag', className: 'el-form-inline-block-20' },
          { label: '下架时间', value: 'releaseTo', type: 'tag', className: 'el-form-inline-block-20' }
        ],
        rules: {},
        labelWidth: '120px'
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
      // this.$initDataPermits('userCarVerifyDetail', this.formInfo1.data) // 条件区域操作权限
    },
    getDetail() {
      // 获取url参数
      const mparam = { 'id': this.$route.query.id }
      this.$handleAPI('', getGameMarketInfo, mparam).then(res => {
        if (res.code === 200) {
          this.formInfo.data = res.data
          this.marketCarDetail = res.data
          this.itemLevel = res.data.adminMarketCarInfoDto.itemLevel
          this.adminMarketCarInfoDto = [{
            id: res.data.adminMarketCarInfoDto.id,
            itemNo: res.data.adminMarketCarInfoDto.itemNo,
            itemName: res.data.adminMarketCarInfoDto.itemName,
            itemTypeName: res.data.adminMarketCarInfoDto.itemTypeName,
            imageThumbnailUrl: res.data.adminMarketCarInfoDto.imageThumbnailUrl,
            rareType: res.data.adminMarketCarInfoDto.rareType,
            itemLevel: res.data.adminMarketCarInfoDto.itemLevel,
            performance: res.data.adminMarketCarInfoDto.performance,
            powers: res.data.adminMarketCarInfoDto.powers,
            stable: res.data.adminMarketCarInfoDto.stable,
            control: res.data.adminMarketCarInfoDto.control,
            sponsorFlagName: res.data.adminMarketCarInfoDto.sponsorFlagName
          }]
          this.formInfo.fieldList4.forEach(element => {
            if (element.value === 'releaseTo') {
              if (res.data.status === 3) {
                element.type = 'tag'
              } else {
                element.type = 'hidden'
              }
            }
          })
        }
      })
    },
    powers(val) {
      return '动力(LV.' + val + ')'
    },
    stable(val) {
      return '稳定(LV.' + val + ')'
    },
    control(val) {
      return '操控(LV.' + val + ')'
    },
    performance(val) {
      return '性能分(LV.' + val + ')'
    },
    // 初始化验证
    initRules() {
      // this.formInfo1.rules = this.$initRules(this.formInfo1.fieldList)
    },
    // 按钮点击
    handleClick(event, data) {
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'approve': {
          break
        }
        case 'changeCity': {
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
    .slot-avatar {
      height: 60px;
      display: flex;
      align-items: center;
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
