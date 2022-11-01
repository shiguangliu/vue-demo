<template>
  <div class="goods-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <!-- 条件栏 -->
    <el-tabs
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane label="基本信息" name="base">
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
        <br>
        <div class="form-item-container">
          <div style="margin-top: 10px; margin-bottom: 10px;">
            <el-button v-if="formInfo.data.status == 1" type="primary" icon="el-icon-plus" @click="selectItem()">选择商品</el-button>
          </div>
          <el-table
            :data="itemList"
            border
            height="250"
            tooltip-effect="dark"
            style="width: 100%;"
          >
            <el-table-column
              label="装备ID"
            >
              <template slot-scope="scope">{{ scope.row.itemId || '未设置' }}</template>
            </el-table-column>
            <el-table-column
              label="装备名称"
            >
              <template slot-scope="scope">{{ scope.row.itemName || '未设置' }}</template>
            </el-table-column>
            <el-table-column
              label="装备类型"
            >
              <template slot-scope="scope">{{ scope.row.itemTypeStr || '未设置' }}</template>
            </el-table-column>
            <el-table-column
              label="图片"
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
            >
              <template slot-scope="scope">{{ scope.row.rareTypeStr || '未设置' }}</template>
            </el-table-column>
            <el-table-column
              label="是否赞助"
            >
              <template slot-scope="scope">{{ scope.row.sponsorFlagStr || '未设置' }}</template>
            </el-table-column>
            <el-table-column
              label="等级"
            >
              <template slot-scope="scope">{{ scope.row.itemLevel || '未设置' }}</template>
            </el-table-column>
            <el-table-column
              label="马力"
            >
              <template slot-scope="scope">{{ scope.row.powers || '未设置' }}</template>
            </el-table-column>
            <el-table-column
              label="稳定"
            >
              <template slot-scope="scope">{{ scope.row.stable || '未设置' }}</template>
            </el-table-column>
            <el-table-column
              label="操控"
            >
              <template slot-scope="scope">{{ scope.row.control || '未设置' }}</template>
            </el-table-column>
          </el-table>
        </div>
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
      <PopGameItem :custom-query="{ diff: 1 }" @pickItem="pickItem" />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGoodsInfoApi, saveGoodsApi, approveGoodsStatusApi, deleteGoodsApi } from '@/api/sku/goods'
import { getConfigItemsListApi } from '@/api/common'
import defaultImage from '@/assets/img/no-pic.jpg'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import PopGameItem from '@/components/Popup/PopGameItem'
// import PageTable from '@/components/PageTable'

export default {
  components: {
    PageFilter,
    PageForm,
    PageDialog,
    PopGameItem
  },
  data() {
    const checkPrice = (rule, value, callback) => {
      const check = this.$validate({ label: '价格', value, rules: ['notnull', 'number', 'length'], conditions: [1, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkItem = (rule, value, callback) => {
      const check = this.$validate({ label: '装备道具', value, rules: ['notnull'], conditions: [1, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkDate = (rule, value, callback) => {
      var msg = ''
      if (value !== undefined && value.length >= 2) {
        if (value[1] !== null) {
          if (this.$fn.switchTime(value[1], 'YYYY-MM-DD') < this.$fn.switchTime(new Date(), 'YYYY-MM-DD')) {
            msg = '有效截止时间必须大于等于今天'
          }
        }
      } else {
        msg = '请输入有效时间'
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    return {
      getGoodsInfoApi,
      saveGoodsApi,
      approveGoodsStatusApi,
      deleteGoodsApi,
      getConfigItemsListApi,
      activeName: 'base',
      id: '',
      // 相关列表
      listTypeInfo: {
        priceTypeList: [], // 货币类型
        statusList: [] // 状态
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: ''
        },
        list: []
      },
      // 表单相关
      formInfo: {
        ref: null,
        refGoods: null,
        readOnly: false,
        data: {
          operatorId: '',
          id: '',
          valid: [],
          status: '',
          releaseFrom: '',
          releaseTo: '',
          priceType: '',
          price: '',
          itemId: '',
          itemFlag: '',
          itemType: ''
        },
        fieldList: [
          { label: '商品ID', value: 'id', type: 'tag', className: 'el-form-block-20' },
          { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changedate', required: true, className: 'el-form-block', validator: checkDate },
          { label: '状态', value: 'status', type: 'customselect', list: 'statusList', disabled: true, key: 'itemValue', name: 'itemName', className: 'el-form-block-20' },
          { label: '货币类型', value: 'priceType', type: 'customselect', list: 'priceTypeList', required: true, key: 'itemValue', name: 'itemName', className: 'el-form-block-20' },
          { label: '价格', value: 'price', type: 'input', required: true, validator: checkPrice, className: 'el-form-block-20' },
          { label: '道具ID', value: 'itemId', type: 'hidden', validator: checkItem },
          { label: '装备区分', value: 'itemFlag', type: 'hidden' },
          { label: '装备类型', value: 'itemType', type: 'hidden' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      itemList: [],
      dialogGameItem: {
        title: '选择装备',
        visible: false,
        btLoading: false
        // btList: [
        //   { label: '关闭', type: '', icon: '', event: 'dialogGameItem', show: true }
        // ]
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
    'formInfo.data.status'(val) {
      // 按钮权限
      this.initButtonList(this.formInfo.data.status)
    }
  },
  created() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
    this.id = this.$route.query.id
    this.getPriceTypeList()
    this.getStatusList()
    this.getDetail()
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('skuDetail', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      const formInfo = this.formInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
    },
    // 下拉框需要初始化加载的列表数据
    initList() {
      // table插件 会有created有缓存1
      this.id = this.$route.query.id
    },
    getPriceTypeList() {
      const params = { 'configType': 'GAME_ITEM_PRICE_TYPE' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.priceTypeList = res.data
        }
      })
    },
    getStatusList() {
      const params = { 'configType': 'GAME_ITEM_SKU_STATUS' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
    },
    initButtonList(status) {
      status = status + ''
      if (status === '1') {
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存修改', btType: 'primary', icon: 'el-icon-plus', event: 'saveBase', show: true, float: 'left' },
          { type: 'button', label: '提交审批', btType: 'primary', icon: 'el-icon-check', event: 'submitBase', show: true, float: 'left' },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', event: 'delete', show: true, float: 'right' }
        ]
      } else if (status === '2') {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: true, float: 'right' },
          { type: 'button', label: '审批通过', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'approveOK', show: true, float: 'left' },
          { type: 'button', label: '审批拒绝', btType: 'danger', icon: 'el-icon-close', loading: 'ngLoading', event: 'approveNG', show: true, float: 'left' }
        ]
      } else if (status === '3') {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: true, float: 'left' }
        ]
      } else if (status === '5') {
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: true, float: 'left' }
        ]
      } else {
        this.filterInfo.list = [
        ]
      }
      this.initDataPermits()
    },
    getDetail() { // 获取数据
      const params = { id: this.id }
      const self = this
      this.$handleAPI('', getGoodsInfoApi, params).then(res => {
        if (res.code === 200) {
          for (const key in res.data) {
            // 存在则赋值
            if (key in self.formInfo.data) {
              self.formInfo.data[key] = res.data[key]
              if (key === 'releaseFrom' && res.data['releaseFrom'] !== '0000-00-00 00:00:00' && res.data['releaseFrom'] !== null) {
                self.formInfo.data.valid = [res.data['releaseFrom'], res.data['releaseTo']]
              }
            }
          }
          self.formInfo.data.status = res.data.status + ''
          if (res.data.priceType === 0) {
            res.data.priceType = null
            self.formInfo.data.priceType = null
          } else {
            self.formInfo.data.priceType = res.data.priceType + ''
          }
          if (res.data.itemId != null) {
            this.itemList = [{
              itemId: res.data.itemId,
              itemName: res.data.itemName,
              itemTypeStr: res.data.itemTypeStr,
              imageThumbnailUrl: res.data.imageThumbnailUrl,
              rareTypeStr: res.data.rareTypeStr,
              sponsorFlagStr: res.data.sponsorFlagStr,
              itemLevel: res.data.itemLevel,
              powers: res.data.powers,
              stable: res.data.stable,
              control: res.data.control
            }]
            self.formInfo.data.itemId = res.data.itemId
            self.formInfo.data.itemFlag = res.data.itemFlag
            self.formInfo.data.itemType = res.data.itemType
          }
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
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'saveBase': {
          // 验证flag
          var flag = true
          var msg = '请检查所有必输项目'
          this.formInfo.ref.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          if (this.formInfo.data.itemId === null || this.formInfo.data.itemId === undefined || this.formInfo.data.itemId === 0) {
            flag = false
            msg = '商品关联装备必选'
          }
          if (flag) {
            this.formInfo.data.operatorId = this.staffId
            const params = this.formInfo.data
            this.$handleAPI('', saveGoodsApi, params).then(res => {
              if (res.code === 200) {
                this.$message({
                  showClose: true,
                  message: '保存成功',
                  type: 'successs',
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
            }).catch((error) => {
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
            })
          } else {
            this.$message({
              showClose: true,
              message: msg,
              type: 'error',
              duration: 3500
            })
          }
          break
        }
        case 'submitBase': {
          // 验证flag
          var flag1 = true
          var msg1 = '请检查所有必输项目'
          this.formInfo.ref.validate(valid => {
            if (!valid) {
              flag1 = false
            }
          })
          if (this.formInfo.data.itemId === null || this.formInfo.data.itemId === undefined) {
            flag1 = false
            msg1 = '商品关联装备必选'
          }
          if (flag1) {
            // const self = this
            this.formInfo.data.operatorId = this.staffId
            this.formInfo.data.status = 2
            const params = this.formInfo.data
            this.$handleAPI('', saveGoodsApi, params).then(res => {
              if (res.code === 200) {
                this.formInfo.data.status = 2 + ''
                this.$message({
                  showClose: true,
                  message: '提交审批成功',
                  type: 'successs',
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
            }).catch((error) => {
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
            })
          } else {
            this.$message({
              showClose: true,
              message: msg1,
              type: 'error',
              duration: 3500
            })
          }
          break
        }
        case 'delete': {
          this.$confirm('是否确认删除 ？', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {}
            const self = this
            var goodsIdarr = []
            goodsIdarr.push(this.id)
            params.goodsIds = goodsIdarr
            params.operatorId = self.staffId
            this.$handleAPI('', deleteGoodsApi, params).then(res => {
              if (res.code === 200) {
                this.formInfo.data.status = 9 + ''
                this.$message({
                  showClose: true,
                  message: '删除商品成功',
                  type: 'successs',
                  duration: 3500
                })
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
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          break
        }
        case 'edit': {
          const params = {}
          const self = this
          params.id = this.id
          params.operatorId = self.staffId
          params.operatorType = 1
          this.$handleAPI('', approveGoodsStatusApi, params).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 1 + ''
              this.$message({
                showClose: true,
                message: '编辑成功',
                type: 'successs',
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
        case 'approveOK': {
          const params = {}
          const self = this
          params.id = this.id
          params.operatorId = self.staffId
          params.operatorType = 5
          this.$handleAPI('', approveGoodsStatusApi, params).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 5 + ''
              this.$message({
                showClose: true,
                message: '审核成功',
                type: 'successs',
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
        case 'approveNG': {
          const params = {}
          const self = this
          params.id = this.id
          params.operatorId = self.staffId
          params.operatorType = 3
          this.$handleAPI('', approveGoodsStatusApi, params).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 3 + ''
              this.$message({
                showClose: true,
                message: '审批NG',
                type: 'successs',
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
      }
    },
    // open打开道具列表弹框
    selectItem() {
      this.dialogGameItem.visible = true
    },
    // 获取点击事件
    pickItem(data) {
      console.log(data)
      if (data.id != null) {
        this.itemList = [{
          itemId: data.id,
          itemName: data.itemName,
          itemTypeStr: data.itemTypeName,
          imageThumbnailUrl: data.imageThumbnailUrl,
          rareTypeStr: data.rareType + '',
          sponsorFlagStr: data.sponsorFlagName,
          itemLevel: data.itemLevel,
          powers: data.powers,
          stable: data.stable,
          control: data.control
        }]
        this.formInfo.data.itemId = data.id
        this.formInfo.data.itemFlag = data.itemFlag
        this.formInfo.data.itemType = data.itemType
      }
      this.dialogGameItem.visible = false
    },
    handleEvent(event, data) {
      switch (event) {
        case 'changedate': {
          if (this.formInfo.data.valid !== null) {
            this.formInfo.data.releaseFrom = this.$fn.switchTime(this.formInfo.data.valid[0])
            this.formInfo.data.releaseTo = this.$fn.switchTime(this.formInfo.data.valid[1])
          } else {
            this.formInfo.data.releaseFrom = ''
            this.formInfo.data.releaseTo = ''
          }
          break
        }
      }
    },
    handleClose(event, tag) {
    }
  }
}
</script>
<style scoped lang="scss">
  .goods-container {
    height: 800px;
    padding: 20px;

    .slot-avatar{
      height: 40px;
      display: flex;
      align-items: center;
      img{
        padding-right: 10px;
      }
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
  }
</style>
