<template>
  <div class="recharge-container">
    <div class="tab-container">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <el-row>
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>充值订单详情</span>
                </div>
                <!-- form -->
                <page-form
                  :ref-obj.sync="formInfo.ref"
                  :data="formInfo.data"
                  :field-list="formInfo.fieldList1"
                  :rules="formInfo.rules"
                  :label-width="formInfo.labelWidth"
                  :list-type-info="listTypeInfo"
                  @handleClick="handleClick"
                  @handleEvent="handleEvent"
                />
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>商品信息</span>
                </div>
                <!-- form -->
                <page-form
                  :ref-obj.sync="formInfo.ref"
                  :data="formInfo.data"
                  :field-list="formInfo.fieldList2"
                  :rules="formInfo.rules"
                  :label-width="formInfo.labelWidth"
                  :list-type-info="listTypeInfo"
                  @handleClick="handleClick"
                  @handleEvent="handleEvent"
                />
              </el-card>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>支付信息</span>
                </div>
                <!-- form -->
                <page-form
                  :ref-obj.sync="formInfo.ref"
                  :data="formInfo.data"
                  :field-list="formInfo.fieldList3"
                  :rules="formInfo.rules"
                  :label-width="formInfo.labelWidth"
                  :list-type-info="listTypeInfo"
                  @handleClick="handleClick"
                  @handleEvent="handleEvent"
                />
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>用户信息</span>
                </div>
                <!-- form -->
                <page-form
                  :ref-obj.sync="formInfo.ref"
                  :data="formInfo.data"
                  :field-list="formInfo.fieldList4"
                  :rules="formInfo.rules"
                  :label-width="formInfo.labelWidth"
                  :list-type-info="listTypeInfo"
                  @handleClick="handleClick"
                  @handleEvent="handleEvent"
                />
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getRechargeInfoApi } from '@/api/sku/recharge'
import PageForm from '@/components/PageForm'

export default {
  components: {
    PageForm
  },
  data() {
    // todo 更新必填
    return {
      listLoading: true,
      activeName: 'first',
      getRechargeInfoApi,
      // 相关列表
      listTypeInfo: {
      },
      // 表单相关（显示）
      formInfo: {
        refresh: 1,
        ref: null,
        data: {
          transNo: '',
          transTime: '',
          statusStr: '',
          appTypeStr: '',
          skuId: '',
          itemName: '',
          priceText: '',
          quantityText: '',
          amount: '',
          payTime: '',
          cancelTime: '',
          payTypeStr: '',
          userId: '',
          userNickName: '',
          userPhone: '',
          userSexStr: ''
        },
        fieldList1: [
          { label: '订单编号', value: 'transNo', type: 'input', disabled: true },
          { label: '下单时间', value: 'transTime', type: 'input', disabled: true },
          { label: '订单状态', value: 'statusStr', type: 'input', disabled: true },
          { label: 'IOS/安卓', value: 'appTypeStr', type: 'input', disabled: true }
        ],
        fieldList2: [
          { label: '游戏币id', value: 'skuId', type: 'input', disabled: true },
          { label: '商品名称', value: 'itemName', type: 'input', disabled: true },
          { label: '售价', value: 'priceText', type: 'input', disabled: true },
          { label: '获得', value: 'quantityText', type: 'input', disabled: true }
        ],
        fieldList3: [
          { label: '支付金额', value: 'amount', type: 'input', disabled: true },
          { label: '支付成功时间', value: 'payTime', type: 'input', show: false },
          { label: '支付失败时间', value: 'cancelTime', type: 'input', show: false },
          { label: '支付方式', value: 'payTypeStr', type: 'input', disabled: true }
        ],
        fieldList4: [
          { label: '用户ID', value: 'userId', type: 'input', disabled: true },
          { label: '用户昵称', value: 'userNickName', type: 'input', disabled: true },
          { label: '用户手机号', value: 'userPhone', type: 'input', disabled: true },
          { label: '用户性别', value: 'userSexStr', type: 'input', disabled: true }
        ],
        rules: {},
        labelWidth: '120px'
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits',
      'staffId'
    ])
  },
  created() {
    this.id = this.$route.query.id
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
    this.getDetail()
  },
  methods: {
    initList() {
    },
    initDataPermits() {
    },
    getDetail() { // 获取数据
      const params = { id: this.id }
      const self = this
      this.$handleAPI('', getRechargeInfoApi, params).then(res => {
        if (res.code === 200) {
          for (const key in res.data) {
            // 存在则赋值
            if (key in self.formInfo.data) {
              self.formInfo.data[key] = res.data[key]
            }
          }
          this.formInfo.fieldList3.forEach(element => {
            if (this.formInfo.data.payTime !== null) {
              if (element.value === 'payTime') {
                element.show = true
              }
            }
            if (this.formInfo.data.cancelTime !== null) {
              if (element.value === 'cancelTime') {
                element.show = true
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
      }).catch((error) => {
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          duration: 3500
        })
      })
    },
    // 初始化验证
    initRules() {
    },
    // 按钮点击
    handleClick(event, data) {
    },
    handleEvent(event, data) {
    }
  }
}
</script>

<style scoped lang="scss">
  .recharge-container {
    padding: 0px;
    margin: 20px;

    .tab-container {
      margin: 0 10px;
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
    .bg-purple {
      background: #d3dce6;
    }
    .grid-content {
      border-radius: 4px;
      min-height: 36px;
      display: block;
      background: #d3dce6;
    }
  }
</style>
