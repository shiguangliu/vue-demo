<template>
  <div class="order-container">
    <!-- 详细信息tab -->
    <el-tabs
      v-model="activeName"
      type="border-card"
      style="margin-top: 10px;"
    >
      <el-tab-pane id="order-basic-info" label="拼团订单信息" name="detail0">
        <el-row
          v-for="(basicRow, rowIndex) in orderBasicData"
          :key="rowIndex"
          style="padding: 10px 0; display: flex;"
        >
          <el-card
            v-for="(item, cardIndex) in basicRow"
            :key="cardIndex"
            class="box-card"
          >
            <div slot="header" class="clearfix">
              <span>{{ item.title }}</span>
              <el-button
                v-if="item.click === 'ship' && orderInfo.deliveryFlag === 1"
                style="float: right; padding: 3px 0; color: #fff;"
                type="text"
                @click="handleClick(item.click + 'Update', {})"
              >修改配送信息</el-button>
            </div>
            <table class="card-table" style="color: rgb(103, 106, 108);">
              <tbody v-for="(tableCol, tableIndex) in item.tableData" :key="tableIndex">
                <tr>
                  <td class="card-table-content text" style="width: 30%;">{{ tableCol.text }}</td>
                  <td class="card-table-content value" style="width: 70%; font-weight: bold;">{{ tableCol.value }}</td>
                </tr>
              </tbody>
            </table>
          </el-card>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!-- 配送信息修改 -->
    <page-dialog
      :title="dialogShipInfo.title"
      :visible.sync="dialogShipInfo.visible"
      :width="dialogShipInfo.width"
      :bt-loading="dialogShipInfo.btLoading"
      :bt-list="dialogShipInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-form
        :ref-obj.sync="formInfoShipInfo.ref"
        :data="formInfoShipInfo.data"
        :field-list="formInfoShipInfo.fieldList"
        :rules="formInfoShipInfo.rules"
        :label-width="formInfoShipInfo.labelWidth"
        :list-type-info="listTypeInfo"
        :read-only="formInfoShipInfo.readOnly"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGroupOrderInfoApi, updateGroupOrderApi } from '@/api/group/groupOrder'
// import { MessageBox } from 'element-ui'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageForm,
    PageDialog
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      const check = this.$validate({ label: '手机号', value, rules: ['phone', 'notnull'], conditions: [] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测邮编
    const checkZipcode = (rule, value, callback) => {
      const check = this.$validate({ label: '邮编', value, rules: ['fixedNum', 'notnull'], conditions: [6] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测地址长度
    const checkAddress = (rule, value, callback) => {
      const check = this.$validate({ label: '地址', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      getGroupOrderInfoApi,
      updateGroupOrderApi,
      activeName: 'detail0',
      orderInfo: {}, // 订单主信息
      // 相关列表
      listTypeInfo: {
      },
      // 过滤相关配置（按钮）
      filterInfo: {
      },
      orderBasicData: [
        // 第1行2个card
        [
          // 第1行第1个card
          {
            title: '订单信息',
            tableData: [
              { label: 'orderNo', text: '订单编号：', value: '' },
              { label: 'orderTime', text: '下单时间：', value: '' },
              { label: 'orderStatusText', text: '订单状态：', value: '' }
            ]
          },
          // 第1行第2个card
          {
            title: '拼团信息',
            tableData: [
              { label: 'groupId', text: '拼团id：', value: '' },
              { label: 'groupTitle', text: '拼团名称：', value: '' },
              { label: 'merchantName', text: '所属商户：', value: '' },
              { label: 'groupStatusText', text: '拼团状态：', value: '' },
              { label: 'validDate', text: '有效时间：', value: '' },
              { label: 'InsertTime', text: '报名时间：', value: '' },
              { label: 'doneTime', text: '拼团成功时间：', value: '' },
              { label: 'joinAmount', text: '报名时价格：', value: '' },
              { label: 'totalAmount', text: '最终价格：', value: '' }
            ]
          },
          // 第1行3个card
          {
            title: '收货信息',
            click: 'ship',
            tableData: [
              { label: 'shiptoName', text: '收货人：', value: '' },
              { label: 'shiptoPhone', text: '收货人手机：', value: '' },
              { label: 'shiptoZipcode', text: '邮编：', value: '' },
              { label: 'shiptoLocation', text: '所在省市区：', value: '' },
              { label: 'shiptoAddress', text: '详细地址：', value: '' },
              { label: 'shiptoRemarks', text: '备注：', value: '' }
            ]
          }
        ],
        // 第2行2个card
        [
          // 第2行第1个card
          {
            title: '支付信息',
            tableData: [
              { label: 'payTime', text: '支付成功时间：', value: '' },
              { label: 'payTypeText', text: '支付方式：', value: '' },
              { label: 'amount', text: '支付金额：', value: '', type: 'money' }
            ]
          },
          // 第2行第2个card
          {
            title: '用户信息',
            tableData: [
              { label: 'userId', text: '用户id：', value: '' },
              { label: 'nickName', text: '用户昵称：', value: '' },
              { label: 'phone', text: '手机号：', value: '' },
              { label: 'genderText', text: '性别：', value: '' }
            ]
          }
        ]
      ],
      // 表单相关（追加、修改）
      dialogShipInfo: {
        title: '修改收货信息',
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'closedialogShipInfo', show: true },
          { label: '保存', type: 'primary', icon: '', event: 'save', saveLoading: false, show: false }
        ]
      },
      formInfoShipInfo: {
        ref: null,
        readOnly: false,
        data: {
          orderId: '',
          shiptoName: '',
          shiptoPhone: '',
          shiptoZipcode: '',
          shiptoLocation: '',
          shiptoAddress: '',
          shiptoRemarks: '',
          oprateorId: this.staffId
        },
        fieldList: [
          { label: '订单ID', value: 'orderId', type: 'tag' },
          { label: '收货人', value: 'shiptoName', type: 'input', className: 'el-form-block', required: true },
          { label: '收货人手机', value: 'shiptoPhone', type: 'input', className: 'el-form-block', required: true, validator: checkPhone },
          { label: '邮编', value: 'shiptoZipcode', type: 'input', className: 'el-form-block', required: true, validator: checkZipcode },
          { label: '所在省市区', value: 'shiptoLocation', type: 'input', className: 'el-form-block', required: true, validator: checkAddress },
          { label: '详细地址', value: 'shiptoAddress', type: 'input', className: 'el-form-block', required: true, validator: checkAddress },
          { label: '备注', value: 'shiptoRemarks', type: 'input', className: 'el-form-block' }
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
    ]),
    nopicture() {
      return 'this.src="' + this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
    }
  },
  watch: {
    'dialogShipInfo.visible'(val) {
      if (!val) {
        this.dialogShipInfo.btLoading = false
        this.dialogShipInfo.type = ''
      }
    }
  },
  created() {
    this.orderId = this.$route.query.orderId
  },
  mounted() {
    this.getDetail()
    this.formInfoShipInfo.rules = this.$initRules(this.formInfoShipInfo.fieldList)
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('groupOrderDetail', this.dialogShipInfo.btList) // 条件区域操作权限
    },
    // 获取订单详情
    getDetail() {
      const params = { 'orderId': this.orderId }
      this.$handleAPI('', getGroupOrderInfoApi, params).then(res => {
        if (res.code === 200) {
          this.orderInfo = res.data
          this.orderBasicData.forEach(function(row, i, rowArr) {
            row.forEach(function(card, j, cardArr) {
              card.tableData.forEach(function(item, j, itemArr) {
                item.value = res.data[item.label] === '0000-00-00 00:00:00' ? '' : res.data[item.label]
              })
            })
          })

          this.initDataPermits()
        }
      })
    },
    // 按钮点击
    handleClick(event, data) {
      const dialogShipInfo = this.dialogShipInfo
      switch (event) {
        case 'shipUpdate': // 调起收货信息修改，打开dialog
          // 弹出dialogShipInfo
          this.resetShipInfo()
          this.formInfoShipInfo.data.orderId = this.orderId
          this.formInfoShipInfo.data.shiptoName = this.orderInfo.shiptoName
          this.formInfoShipInfo.data.shiptoPhone = this.orderInfo.shiptoPhone
          this.formInfoShipInfo.data.shiptoZipcode = this.orderInfo.shiptoZipcode
          this.formInfoShipInfo.data.shiptoLocation = this.orderInfo.shiptoLocation
          this.formInfoShipInfo.data.shiptoAddress = this.orderInfo.shiptoAddress
          this.formInfoShipInfo.data.shiptoRemarks = this.orderInfo.shiptoRemarks
          this.formInfoShipInfo.data.shiptophone = this.orderInfo.shiptophone
          this.formInfoShipInfo.data.oprateorId = this.staffId
          dialogShipInfo.visible = true
          this.formInfoShipInfo.rules = this.$initRules(this.formInfoShipInfo.fieldList)
          break
        case 'closedialogShipInfo':
          // 弹窗点击关闭
          dialogShipInfo.visible = false
          break
        case 'save': { // 保存发货信息修改
          this.formInfoShipInfo.ref.validate(valid => {
            if (valid) {
              dialogShipInfo.btLoading = true
              this.$handleAPI('', updateGroupOrderApi, this.formInfoShipInfo.data).then(res => {
                if (res.code === 200) {
                  dialogShipInfo.btLoading = false
                  dialogShipInfo.visible = false
                  this.$message.success('修改收货信息成功')
                  this.getDetail()
                } else {
                  dialogShipInfo.btLoading = false
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'error',
                    duration: 3500
                  })
                }
              }).catch((error) => {
                dialogShipInfo.btLoading = false
                this.$message({
                  showClose: true,
                  message: error,
                  type: 'error',
                  duration: 3500
                })
              })
            }
          })
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {},
    resetShipInfo() {
      this.formInfoShipInfo.data = {
        orderId: '',
        shiptoName: '',
        shiptoPhone: '',
        shiptoZipcode: '',
        shiptoLocation: '',
        shiptoAddress: '',
        shiptoRemarks: '',
        oprateorId: this.staffId
      }
    }
  }
}
</script>

<style scoped lang="scss">
.order-container {
    padding: 0px;
    margin: 20px;

    // 所有tab页
  .el-tabs {
    .el-tab-pane {
      height: 700px;
      margin: 5px 10px;
      padding: 5px 0;
      overflow-y: auto;
      color: rgb(144, 147, 153);
      font-size: 14px;
    }
  }

  // 订单基本信息 tab
  #order-detail-info, #card-detail,
  #time-line, #remarks {
    border-top: 1px solid #e7e7e7;
  }

  .box-card {
    width: 435px;
    margin: 0 15px;
    border: 1px solid #13C0C5;
    font-size: 14px;
    // card模板在header外面套的壳，要刷掉自带的样式
    .el-card__header {
      padding: 12px 20px;
      background-color: #13C0C5;
      border-bottom: 1px solid #13C0C5;
      /* .clearfix {
        color: #ffffff;
      } */
    }
    .el-card__body {
      padding: 15px;
    }
    table.card-table {
      width: 400px;
      border: 1px solid #e7e7e7;
      border-collapse: collapse;

      tbody {
        tr {
          width: 100%;
          td {
            width: 100%;
            border: 1px solid #e7e7e7;
          }
        }
      }

      border-spacing: 0px;
      .card-table-content {
        padding: 8px;
      }
      .card-table-content.text {
        text-align: right;
      }
    }
  }
}

</style>
