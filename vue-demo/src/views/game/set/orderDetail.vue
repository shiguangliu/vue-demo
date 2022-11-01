<template>
  <div class="template-container transSetDetailPage">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="特惠礼包购买订单详情" name="tab1">
        <el-card class="box-card" style="border-color: #13C0C5;">
          <div slot="header" class="clearfix">
            <span>订单信息</span>
          </div>
          <page-form
            :ref-obj.sync="orderFormInfo.ref"
            :data="orderFormInfo.data"
            :field-list="orderFormInfo.fieldList"
            :rules="orderFormInfo.rules"
            :label-width="orderFormInfo.labelWidth"
            :list-type-info="listTypeInfo"
            :read-only="orderFormInfo.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
        </el-card>
        <el-row>
          <el-col :span="12">
            <el-card class="box-card" style="margin-top: 20px;border-color: #13C0C5;margin-right: 5px;">
              <div slot="header" class="clearfix">
                <span>用户信息</span>
              </div>
              <page-form
                :ref-obj.sync="userFormInfo.ref"
                :data="userFormInfo.data"
                :field-list="userFormInfo.fieldList"
                :rules="userFormInfo.rules"
                :label-width="userFormInfo.labelWidth"
                :list-type-info="listTypeInfo"
                :read-only="userFormInfo.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              />
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card" style="margin-top: 20px;border-color: #13C0C5;margin-left: 5px;">
              <div slot="header" class="clearfix">
                <span>支付信息列表</span>
              </div>
              <page-table
                :auto-fit="false"
                :refresh="payTableInfo.refresh"
                :init-curpage="payTableInfo.initCurPage"
                :data.sync="payTableInfo.data"
                :api="getTransSetPayListApi"
                :query="payTableInfo.query"
                :field-list="payTableInfo.fieldList"
                :list-type-info="listTypeInfo"
                :handle="payTableInfo.handle"
                :pager="payTableInfo.pager"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              />
            </el-card>
          </el-col>
        </el-row>
        <el-card class="box-card" style="margin-top: 20px;border-color: #13C0C5;">
          <div slot="header" class="clearfix">
            <span>商品信息 & 特惠礼包详情</span>
          </div>
          <page-form
            :ref-obj.sync="gameSetFormInfo.ref"
            :data="gameSetFormInfo.data"
            :field-list="gameSetFormInfo.fieldList"
            :rules="gameSetFormInfo.rules"
            :label-width="gameSetFormInfo.labelWidth"
            :list-type-info="listTypeInfo"
            :read-only="gameSetFormInfo.readOnly"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <template v-slot:form-price>
              <el-input v-model="gameSetFormInfo.data.price" readonly="readonly" style="color: #303133;">
                <template slot="append">{{ gameSetFormInfo.data.unitName }}</template>
              </el-input>
            </template>
            <template v-slot:form-setValue>
              <el-input v-model="gameSetFormInfo.data.setValue" readonly="readonly">
                <template slot="append">{{ gameSetFormInfo.data.unitName }}</template>
              </el-input>
            </template>
          </page-form>
          <br>
          <page-table
            :refresh="detailTableInfo.refresh"
            :init-curpage="detailTableInfo.initCurPage"
            :data.sync="detailTableInfo.data"
            :api="getTransSetDetailListApi"
            :query="detailTableInfo.query"
            :field-list="detailTableInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="detailTableInfo.handle"
            :pager="detailTableInfo.pager"
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
// import { getConfigItemsListApi } from '@/api/common'
import { getTransSetApi, getTransSetDetailListApi, getTransSetPayListApi } from '@/api/fztransset'
// import PageFilter from '@/components/PageFilter'
// import PageDialog from '@/components/PageDialog'
import PageTable from '@/components/PageTable'
import PageForm from '@/components/PageForm'
// import PopGameItem from '@/components/Popup/PopGameItem'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageForm,
    PageTable
  },
  data() {
    return {
      activeName: 'tab1',
      getTransSetApi,
      getTransSetDetailListApi,
      getTransSetPayListApi,
      transId: this.$route.query.transId || '',
      // 相关列表
      listTypeInfo: {
      },
      // 表单相关（显示）
      orderFormInfo: {
        readOnly: true,
        ref: null,
        data: {
          transId: this.$route.query.transId || '',
          transNo: '',
          createTime: '',
          statusName: '',
          appTypeName: '',
          payTime: ''
        },
        fieldList: [
          { label: '订单编号', value: 'transNo', type: 'tag', className: 'el-form-inline-block-30' },
          { label: '下单时间', value: 'createTime', type: 'tag', className: 'el-form-inline-block-30' },
          { label: '订单状态', value: 'statusName', type: 'tag', className: 'el-form-inline-block-30' },
          { label: 'APP来源', value: 'appTypeName', type: 'tag', className: 'el-form-inline-block-30' },
          { label: '支付成功时间', value: 'payTypeName', type: 'tag', className: 'el-form-inline-block-30' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      userFormInfo: {
        readOnly: true,
        ref: null,
        data: {
          userId: '',
          userNickName: '',
          userPhone: '',
          genderName: ''
        },
        fieldList: [
          { label: '用户ID', value: 'userId', type: 'tag', className: 'el-form-inline-block-50' },
          { label: '用户昵称', value: 'userNickName', type: 'tag', className: 'el-form-inline-block-50' },
          { label: '手机号码', value: 'userPhone', type: 'tag', className: 'el-form-inline-block-50' },
          { label: '性别', value: 'genderName', type: 'tag', className: 'el-form-inline-block-50' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      gameSetFormInfo: {
        readOnly: true,
        ref: null,
        data: {
          gameSetId: '',
          setName: '',
          priceTypeName: '',
          price: '',
          setValue: '',
          unitName: ''
        },
        fieldList: [
          { label: '特惠礼包ID', value: 'gameSetId', type: 'tag', className: 'el-form-inline-block-30' },
          { label: '特惠礼包名称', value: 'setName', type: 'tag', className: 'el-form-inline-block-50' },
          { label: '货币类型', value: 'priceTypeName', type: 'tag', className: 'el-form-inline-block-30' },
          { label: '特惠礼包价格', value: 'price', type: 'slot', className: 'el-form-inline-block-30' },
          { label: '特惠礼包价值', value: 'setValue', type: 'slot', className: 'el-form-inline-block-30' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      payTableInfo: {
        refresh: 1,
        initCurPage: 1,
        pager: false, // 不分页（单个层级数据量不大）
        tableIndex: false,
        data: [],
        fieldList: [
          { label: '序号', value: 'seq' },
          { label: '支付金额', value: 'amount' },
          { label: '支付方式', value: 'payTypeName' }
        ],
        query: { transId: this.$route.query.transId }
      },
      detailTableInfo: {
        refresh: 1,
        initCurPage: 1,
        pager: false, // 不分页（单个层级数据量不大）
        tableIndex: false,
        data: [],
        fieldList: [
          { label: '商品ID', value: 'skuId' },
          { label: '商品名称', value: 'itemName' },
          { label: '装备类型', value: 'itemTypeName' },
          { label: '图片', value: 'imageUrl', type: 'image' },
          { label: '稀有度', value: 'rareType' },
          { label: '是否赞助', value: 'sponsorFlagName' },
          { label: '货币类型', value: 'priceTypeName' },
          { label: '价格', value: 'itemPrice' },
          { label: '数量', value: 'skuQuantity' }
        ],
        query: { transId: this.$route.query.transId }
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
    this.initList()
  },
  methods: {
    initList() {
      const self = this
      // 获取详情
      const params = { id: this.$route.query.transId }
      this.$handleAPI('', getTransSetApi, params).then(res => {
        if (Number(res.code) === 200) {
          for (const key in res.data) {
            if (key in this.orderFormInfo.data) {
              this.orderFormInfo.data[key] = res.data[key]
            }
            if (key in this.userFormInfo.data) {
              this.userFormInfo.data[key] = res.data[key]
            }
            if (key in this.gameSetFormInfo.data) {
              this.gameSetFormInfo.data[key] = res.data[key]
            }
          }
          self.payTableInfo.query = { transId: res.data.id }
          self.detailTableInfo.query = { transId: res.data.id }
          self.payTableInfo.refresh = Math.random()
          self.detailTableInfo.refresh = Math.random()
        }
      }).catch((error) => {
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          duration: 3500
        })
      })
    },
    initDataPermits() {
      // TODO添加按钮的权限
    },
    // 按钮点击
    handleClick(event, data) {
      // TODO
    },
    // 触发事件
    handleEvent(event, data) {
      // TODO
    }
  }
}
</script>

<style scoped>
  .cardIcon {
    font-size: 40px;
  }
  .template-container {
    padding: 0px;
    margin: 20px;
  }
  .image {
    width: 100%;
    display: block;
  }

</style>
<style lang="scss">
.transSetDetailPage {
  .is-disabled {
    .el-input__inner, .el-input-group__append {
      color: #303133 !important;
    }
  }
}
</style>
