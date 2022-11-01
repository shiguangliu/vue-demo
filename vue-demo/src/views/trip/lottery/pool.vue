<template>
  <div class="app-container">
    <!-- 条件栏 -->
    <page-filter
      :query.sync="poolFilterInfo.query"
      :filter-list="poolFilterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <!-- 表格 -->
    <page-table
      :table-index="tableInfo.tableIndex"
      :check-box="tableInfo.checkBox"
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getListApi"
      :query="poolFilterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <template v-slot:col-validDate="scope">
        <p v-if="scope.row.validFrom != null || scope.row.validTo != null">{{ scope.row.validFrom + '-' + scope.row.validTo }}</p>
      </template>
    </page-table>
    <!-- dialog 选择奖励类型 -->
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
        <el-col v-for="(item, index) in objTypeList" :key="index" :span="8">
          <el-button v-if="item.itemValue != 0 && item.itemValue != 12 && item.itemValue != 99" type="default" style="width: 100%;margin-bottom: 10px;" @click="clickObjType(item)">
            <div style="padding: 10px;">
              <!-- <i v-if="item.itemValue == 0" class="cardIcon el-icon-toilet-paper" /> -->
              <i v-if="item.itemValue == 10" class="cardIcon el-icon-s-ticket" />
              <i v-if="item.itemValue == 11" class="cardIcon el-icon-setting" />
              <!-- <i v-if="item.itemValue == 12" class="cardIcon el-icon-coin" /> -->
              <i v-if="item.itemValue == 13" class="cardIcon fa fa-diamond svg-icon" />
              <i v-if="item.itemValue == 14" class="cardIcon el-icon-price-tag" />
              <i v-if="item.itemValue == 15" class="cardIcon el-icon-shopping-bag-2" />
              <i v-if="item.itemValue == 16" class="cardIcon el-icon-paperclip" />
              <!-- <i v-if="item.itemValue == 99" class="cardIcon el-icon-present" /> -->
              <h3 class="icon-name">{{ item.itemName }}</h3>
            </div>
          </el-button>
        </el-col>
      </el-row>
    </page-dialog>
    <page-dialog
      ref="popupdia"
      :title="popupDialog.title"
      :visible.sync="popupDialog.visible"
      :width="popupDialog.width"
      :bt-loading="popupDialog.btLoading"
      :bt-list="popupDialog.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <PopCoupon v-if="popupDialog.visible && popupDialog.typeVal == 10" @pickItem="pickItem" />
      <PopGameItem v-if="popupDialog.visible && popupDialog.typeVal == 11" :custom-query="{ diff: 1 }" @pickItem="pickItem" />
      <PopBest v-if="popupDialog.visible && popupDialog.typeVal == 14" @pickItem="pickItem" />
      <PopGroup v-if="popupDialog.visible && popupDialog.typeVal == 15" @pickItem="pickItem" />
      <PopH5 v-if="popupDialog.visible && popupDialog.typeVal == 16" @pickItem="pickItem" />
      <PopGameItem v-if="popupDialog.visible && popupDialog.typeVal == 13" :custom-query="{ itemType: '31' }" @pickItem="pickItem" />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi, getMerchantListApi } from '@/api/common'
import { getListApi, createApi, updateApi, deleteMaxApi } from '@/api/fztriplotterypool'
// import ThConsts from '@/constants' /* constant */
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'
import defaultImage from '@/assets/img/no-pic.jpg'
import PopGameItem from '@/components/Popup/PopGameItem'
import PopH5 from '@/components/Popup/PopH5'
import PopBest from '@/components/Popup/PopBest'
import PopGroup from '@/components/Popup/PopGroup'
import PopCoupon from '@/components/Popup/PopCoupon'

export default {
  components: {
    PageFilter,
    PageTable,
    PageDialog,
    PopGameItem,
    PopH5,
    PopBest,
    PopGroup,
    PopCoupon
  },
  filters: {
    cutContent: function(value) {
      return value.slice(0, 20) + '...'
    }
  },
  data() {
    return {
      objTypeList: [],
      objTypeDialog: {
        title: '选择奖励类型',
        visible: false,
        btLoading: false,
        width: '500px',
        height: '300px'
      },
      popupDialog: {
        title: '',
        typeVal: '',
        visible: false,
        btLoading: false,
        height: '600px'
      },
      checkBoxList: [],
      getListApi,
      createApi,
      // 相关列表
      listTypeInfo: {
        objectTypeList: [],
        merchantList: [],
        statusList: [] // 状态列表
      },
      // 过滤相关配置（检索条件）
      poolFilterInfo: {
        query: {
          id: '',
          objectType: '',
          objectName: '',
          validFrom: '',
          validTo: '',
          createTimeFrom: '',
          createTimeTo: '',
          merchantId: '',
          status: '',
          validDateRange: [],
          createDateRange: []
        },
        list: [
          { type: 'input', label: '奖励ID', value: 'id' },
          { type: 'customselect', label: '奖励类型', value: 'objectType', list: 'objectTypeList', key: 'itemValue', name: 'itemName' },
          { type: 'input', label: '奖励名称', value: 'objectName' },
          { type: 'customselect', label: '所属商户', value: 'merchantId', list: 'merchantList', key: 'id', name: 'merchantName' },
          { type: 'datetimerange', label: '有效时间', dateType: 'daterange', value: 'validDateRange', event: 'pickValidDate' },
          { type: 'datetimerange', label: '创建时间', dateType: 'daterange', value: 'createDateRange', event: 'pickCreateDate' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: false },
          { type: 'button', label: '批量删除', btType: 'danger', icon: 'el-icon-delete', event: 'batchdelete', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: false, // 是否显示序号
        checkBox: true,
        data: [],
        fieldList: [
          { label: '奖励ID', value: 'id', width: 80 },
          { label: '奖励名称', value: 'objectName', width: 230 },
          { label: '所属商户', value: 'merchantName', width: 230 },
          { label: '奖励类型', value: 'objectTypeName' },
          { label: '中奖概率', value: 'weight', width: 80 },
          { label: '展示概率', value: 'weightShow', width: 90 },
          { label: '有效时间', value: 'validDate', type: 'slot', width: 260 },
          { label: '创建日期', value: 'createTime', width: 140 },
          { label: '状态', type: 'tag', value: 'statusName' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: false }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters(['theme', 'dataPermits', 'staffId']),
    nopicture() {
      return (
        'this.src="' +
        this.$TH.FILE_URLS.publicPath +
        defaultImage +
        '";this.onerror = null;'
      )
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
    this.getList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('tripLotteryList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('tripLotteryList', this.poolFilterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_LOTTERY_POOL_OBJECT_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.objectTypeList = res.data
          this.objTypeList = res.data
        }
      })
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    handleClose(done) {
      // console.log(done)
    },
    clickObjType(e) {
      // 弹出选择具体条目
      this.popupDialog.title = '选择' + e.itemName
      this.popupDialog.typeVal = e.itemValue
      this.popupDialog.visible = true
      //  0-谢谢参与 10-票券 11-装备 12-金币 13-钻石 14-优选 15-拼团 16-H5 99-其他
    },
    formatValidDate(datestr) {
      var date = new Date(Date.parse(datestr.replace('年', '-').replace('月', '-').replace('日', '')))
      var month = date.getMonth() + 1
      month = month < 10 ? '0' + month : '' + month
      var day = date.getDate()
      day = day < 10 ? '0' + day : '' + day
      var timearr = datestr.split(' ')
      var his = timearr[1] + ':00'
      // yyyy-mm-dd h:i:s
      return `${date.getFullYear()}-${month}-${day} ${his}`
    },
    pickItem(data, popType) {
      const props = {
        objectId: data.id,
        validFrom: data.validFrom !== '' && data.validFrom !== undefined ? data.validFrom : undefined,
        validTo: data.validTo !== '' && data.validTo !== undefined ? data.validTo : undefined,
        objectType: this.popupDialog.typeVal,
        staffId: this.staffId,
        merchantId: data.merchantId
      }
      // 获取objectName
      if (popType === 'PopH5') {
        props.objectName = data.title
        props.validFrom = data.validFrom
        props.validTo = data.validTo
      } else if (popType === 'PopGameItem') {
        props.objectName = data.itemName
      } else if (popType === 'PopBest') {
        props.objectName = data.bestName
        props.validFrom = data.validFrom
        props.validTo = data.validTo
      } else if (popType === 'PopGroup') {
        props.objectName = data.groupTitle
        props.validFrom = data.validFromDate
        props.validTo = data.validToDate
      } else if (popType === 'PopCoupon') {
        props.objectName = data.couponName
        props.validFrom = data.validFrom
        props.validTo = data.validTo
      }
      this.$handleAPI('', createApi, props).then(res => {
        if (Number(res.code) === 200) {
          this.$router.push({
            path: './poolDetail',
            query: { poolId: res.data.id, status: res.data.status, objectType: res.data.objectType },
            replace: true
          })
        } else {
          this.$message({
            showClose: true,
            message: res.error,
            type: 'error',
            duration: 3500
          })
        }
      }).catch(error => {
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          duration: 3500
        })
      })
    },
    // 按钮点击
    handleClick(event, data) {
      const tableInfo = this.tableInfo
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'create': {
          // dialog show
          this.objTypeDialog.visible = true
          break
        }
        case 'delete': {
          // 仅能删除编辑中
          if (data.status !== 1) {
            this.$message.error('仅能删除编辑中的奖励！')
            return false
          }
          this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            data.staffId = this.staffId
            data.deleteFlag = 1
            this.deleteLoading = true
            this.$handleAPI('', updateApi, data).then(res => {
              this.deleteLoading = false
              if (Number(res.code) === 200) {
                this.getList()
                this.$message.success(res.message)
              } else {
                this.$message.error(res.message)
              }
            }).catch((error) => {
              this.resetLoading = false
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
            })
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
        case 'batchdelete': {
          this.$confirm('确定要删除多条奖励池吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let errMsg = '剔除非编辑状态奖励，ID为：'
            const idArr = []
            this.checkBoxList.forEach(item => {
              // 仅能删除编辑中
              if (item.status === 1) {
                idArr.push(item.id)
              } else {
                errMsg += item.id + ','
              }
            })
            if (idArr.length > 0) {
              const params = {
                'tripIds': idArr,
                'staffId': this.staffId
              }
              this.$handleAPI('', deleteMaxApi, params).then(res => {
                if (res.code === 200) {
                  this.$message.success('删除成功')
                  this.getList()
                } else {
                  this.$message({
                    showClose: true,
                    message: '删除失败',
                    type: 'error',
                    duration: 3500
                  })
                }
              })
            } else {
              if (errMsg !== '剔除非编辑状态奖励，ID为：') {
                this.$message.error(errMsg)
              } else {
                this.$message({
                  showClose: true,
                  message: '请选择需要删除的数据',
                  type: 'error',
                  duration: 3500
                })
              }
            }
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          break
        }
        case 'detail': // 详情
          this.$router.push({
            path: './poolDetail',
            query: { poolId: data.id, status: data.status, objectType: data.objectType },
            replace: true
          })
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            this.$set(item, 'statusLoading', false)
            this.$set(item, 'deleteLoading', false)
            item.updatetime = this.$fn.switchTime(
              item.updatetime,
              'YYYY-MM-DD hh:mm:ss'
            )
          })
          break
        case 'tableCheck': { // 选择
          this.checkBoxList = data
          break
        }
        case 'pickValidDate': // 选择日期范围
          if (data) {
            this.poolFilterInfo.query.validFrom = data[0]
            this.poolFilterInfo.query.validTo = data[1]
          } else {
            this.poolFilterInfo.query.validFrom = ''
            this.poolFilterInfo.query.validTo = ''
          }
          break
        case 'pickCreateDate': // 选择日期范围
          if (data) {
            this.poolFilterInfo.query.createTimeFrom = data[0]
            this.poolFilterInfo.query.createTimeTo = data[1]
          } else {
            this.poolFilterInfo.query.createTimeFrom = ''
            this.poolFilterInfo.query.createTimeTo = ''
          }
          break
      }
    }
  }
}
</script>

<style scoped>
.cardIcon {
  font-size: 40px;
}
</style>
