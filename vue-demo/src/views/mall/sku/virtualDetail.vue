<template>
  <div class="virtual-container">
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
      <el-tab-pane label="游戏币管理详情" name="base">
        <el-card class="box-card">
          <el-row>
            <el-col :span="12">
              <page-form
                :ref-obj.sync="formInfo.ref1"
                :data="formInfo.data"
                :field-list="formInfo.fieldList1"
                :rules="formInfo.rules1"
                :label-width="formInfo.labelWidth"
                :list-type-info="listTypeInfo"
                :read-only="formInfo.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              />
            </el-col>
            <el-col :span="12">
              <page-form
                :ref-obj.sync="formInfo.ref2"
                :data="formInfo.data"
                :field-list="formInfo.fieldList2"
                :rules="formInfo.rules2"
                :label-width="formInfo.labelWidth"
                :list-type-info="listTypeInfo"
                :read-only="formInfo.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              >
                <!-- 自定义插槽-选择商品图片 -->
                <template v-slot:form-imageUrl>
                  <div class="slot-avatar">
                    <img
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + formInfo.data.imageUrl"
                      style="height: 60px;"
                      :onerror="nopicture"
                    >
                    <el-button
                      v-waves
                      type="primary"
                      icon="el-icon-picture"
                      size="mini"
                      @click="handleClick('uploadFile')"
                    >
                      {{ formInfo.data.imageUrl ? '更换图片' : '选择图片' }}
                    </el-button>
                  </div>
                </template>
                <!-- 自定义插槽-选择单个游戏币图片 -->
                <template v-slot:form-baseImageUrl>
                  <div class="slot-avatar">
                    <img
                      v-imgAlart
                      :src="$TH.FILE_URLS.static_url + formInfo.data.baseImageUrl"
                      style="height: 60px;"
                      :onerror="nopicture"
                    >
                    <el-button
                      v-waves
                      type="primary"
                      icon="el-icon-picture"
                      size="mini"
                      @click="handleClick('uploadIcon')"
                    >
                      {{ formInfo.data.baseImageUrl ? '更换图片' : '选择图片' }}
                    </el-button>
                  </div>
                </template>
              </page-form>
            </el-col>
          </el-row>
        </el-card>
        <br>
        <!-- 图片上传弹窗 -->
        <page-dialog
          :title="dialogUpload.title[dialogUpload.type]"
          :visible="dialogUpload.visible"
          :width="dialogUpload.width"
          :bt-loading="dialogUpload.btLoading"
          :bt-list="dialogUpload.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 图片上传组件 -->
          <Upload
            v-if="dialogUpload.visible"
            :upload-data="{targetPath: 'virtual',autoname: '1'}"
            @handleEvent="handleEvent"
          />
        </page-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getVirtualInfoApi, saveVirtualApi, approveVirtualStatusApi, deleteVirtualApi } from '@/api/sku/virtual'
import { getConfigItemsListApi } from '@/api/common'
import defaultImage from '@/assets/img/no-pic.jpg'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import Upload from '@/components/Upload'

export default {
  components: {
    PageFilter,
    PageForm,
    PageDialog,
    Upload
  },
  data() {
    const checkName = (rule, value, callback) => {
      const check = this.$validate({ label: '商品名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkIosSkuNo = (rule, value, callback) => {
      var appType = this.formInfo.data.appType
      var itemType = this.formInfo.data.itemType + ''
      if (appType === '1' && itemType === '31') {
        // 如果是IOS
        const check = this.$validate({ label: 'AppStore编号', value, rules: ['notnull', 'length'], conditions: [1, 200] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      } else {
        const check = this.$validate({ label: 'AppStore编号', value, rules: ['length'], conditions: [1, 200] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      }
    }
    const checkPrice = (rule, value, callback) => {
      const check = this.$validate({ label: '售价', value, rules: ['notnull', 'number', 'length'], conditions: [1, 13] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkQuantity = (rule, value, callback) => {
      const check = this.$validate({ label: '获得数量', value, rules: ['notnull', 'int', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkSort = (rule, value, callback) => {
      const check = this.$validate({ label: '排序', value, rules: ['notnull', 'int', 'length'], conditions: [1, 11] })
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
      getVirtualInfoApi,
      saveVirtualApi,
      approveVirtualStatusApi,
      deleteVirtualApi,
      getConfigItemsListApi,
      activeName: 'base',
      id: '',
      // 相关列表
      listTypeInfo: {
        itemTypeList: [], // 装备类型（只取30、31）
        appTypeList: [], // 平台
        iosSkuNoList: [], // AppStore编号
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
        ref1: null,
        ref2: null,
        readOnly: false,
        data: {
          operatorId: '',
          id: '',
          status: '',
          valid: [],
          releaseFrom: '',
          releaseTo: '',
          priceType: '',
          price: '',
          quantity: '',
          sort: '',
          appType: '',
          iosSkuNo: '',
          itemId: '',
          itemName: '',
          imageUrl: '',
          baseImageUrl: '',
          itemType: ''
        },
        fieldList1: [
          { label: '商品ID', value: 'id', type: 'tag', className: 'el-form-block-50' },
          { label: '商品名称', value: 'itemName', type: 'input', disabled: true, required: true, validator: checkName, className: 'el-form-block-50' },
          { label: '商品类型', value: 'itemType', type: 'customselect', disabled: true, list: 'itemTypeList', required: true, key: 'itemValue', name: 'itemName', className: 'el-form-block-50' },
          { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changedate', required: true, className: 'el-form-block', validator: checkDate },
          { label: '支付方式', value: 'priceType', type: 'customselect', list: 'priceTypeList', required: true, key: 'itemValue', name: 'itemName', className: 'el-form-block-50' },
          { label: '售价', value: 'price', type: 'input', required: true, validator: checkPrice, className: 'el-form-block-50' },
          { label: '获得数量', value: 'quantity', type: 'input', required: true, validator: checkQuantity, className: 'el-form-block-50' },
          { label: '排序', value: 'sort', type: 'input', required: true, validator: checkSort, className: 'el-form-block-50' },
          { label: '状态', value: 'status', type: 'customselect', list: 'statusList', disabled: true, key: 'itemValue', name: 'itemName', className: 'el-form-block-50' },
          { label: '道具ID', value: 'itemId', type: 'hidden' }
        ],
        fieldList2: [
          { label: '上架平台区分', value: 'appType', type: 'customselect', list: 'appTypeList', required: true, key: 'itemValue', name: 'itemName', className: 'el-form-block-60', event: 'changeAppType' },
          { label: 'AppStore编号', value: 'iosSkuNo', type: 'customselect', list: 'iosSkuNoList', validator: checkIosSkuNo, key: 'itemValue', name: 'itemName', className: 'el-form-block-60' },
          { label: '商品图片', value: 'imageUrl', type: 'slot', className: 'el-form-block', required: true },
          { label: '游戏币图片', value: 'baseImageUrl', type: 'slot', className: 'el-form-block', required: true }
        ],
        rules1: {},
        rules2: {},
        labelWidth: '150px'
      },
      // 图片上传弹窗相关
      dialogUpload: {
        title: {
          uploadFile: '商品图片上传',
          uploadIcon: '游戏币图片上传'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'closeUpload', show: true }
        ]
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
    this.initList()
  },
  mounted() {
    this.getDetail()
    this.initDataPermits()
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('skuVirtualDetail', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      const formInfo = this.formInfo
      formInfo.rules1 = this.$initRules(formInfo.fieldList1)
      formInfo.rules2 = this.$initRules(formInfo.fieldList2)
    },
    // 下拉框需要初始化加载的列表数据
    initList() {
      // table插件 会有created有缓存1
      this.id = this.$route.query.id
      this.getItemTypeList()
      this.getAppTypeList()
      this.getIosSkuNoList()
      this.getPriceTypeList()
      this.getStatusList()
    },
    getItemTypeList() {
      const params = { 'configType': 'GAME_ITEM_TYPE' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.itemTypeList = []
          for (const item of res.data) {
            // 只取金币、钻石
            if ((item.itemValue + '') === '30' || (item.itemValue + '') === '31') {
              this.listTypeInfo.itemTypeList.push(item)
            }
          }
        }
      })
    },
    getAppTypeList() {
      const params = { 'configType': 'APP_TYPE' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.appTypeList = res.data
        }
      })
    },
    getIosSkuNoList() {
      const params = { 'configType': 'PLAT_APP_STORE_SKU' }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.iosSkuNoList = res.data
        }
      })
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
    // 检查商品类型只能是金币和钻石
    checkOthers() {
      const itemType = this.formInfo.data.itemType
      if (itemType === '30' || itemType === '31') {
        // 正常
      } else {
        return '商品类型请选择金币或钻石'
      }
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
      this.$handleAPI('', getVirtualInfoApi, params).then(res => {
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
          if (res.data.priceType === 0) {
            res.data.priceType = null
            self.formInfo.data.priceType = null
          } else {
            self.formInfo.data.priceType = res.data.priceType + ''
          }
          if (res.data.appType === 0) {
            res.data.appType = null
            self.formInfo.data.appType = null
          } else {
            self.formInfo.data.appType = res.data.appType + ''
          }
          self.formInfo.data.status = res.data.status + ''
          self.formInfo.data.itemType = res.data.itemType + ''
          this.handleEvent('changeAppType', '')
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
        case 'uploadFile': {
          // 上传商品图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        }
        case 'uploadIcon': {
          // 上传游戏币图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        }
        case 'closeUpload':
          // 图片上传弹窗点击关闭
          this.dialogUpload.visible = false
          this.dialogUpload.type = ''
          break
        case 'saveBase': {
          // 验证flag
          var flag = true
          var msg = '请检查所有必输项目'
          this.formInfo.ref1.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          this.formInfo.ref2.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          if (this.checkOthers() != null) {
            flag = false
            msg = this.checkOthers()
          }
          if (flag) {
            this.formInfo.data.operatorId = this.staffId
            const params = this.formInfo.data
            this.$handleAPI('', saveVirtualApi, params).then(res => {
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
          this.formInfo.ref1.validate(valid => {
            if (!valid) {
              flag1 = false
            }
          })
          this.formInfo.ref2.validate(valid => {
            if (!valid) {
              flag1 = false
            }
          })
          if (this.checkOthers() != null) {
            flag1 = false
            msg1 = this.checkOthers()
          }
          if (flag1) {
            // const self = this
            this.formInfo.data.operatorId = this.staffId
            this.formInfo.data.status = 2
            const params = this.formInfo.data
            this.$handleAPI('', saveVirtualApi, params).then(res => {
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
            var virtualIdarr = []
            virtualIdarr.push(this.id)
            params.virtualIds = virtualIdarr
            params.operatorId = self.staffId
            this.$handleAPI('', deleteVirtualApi, params).then(res => {
              if (res.code === 200) {
                this.formInfo.data.status = 9 + ''
                this.$message({
                  showClose: true,
                  message: '删除商品成功',
                  type: 'successs',
                  duration: 3500
                })
                this.$store.dispatch('tagsView/delView', this.$route).then(() => {
                  this.$router.push({ path: './virtual', replace: true })
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
          this.$handleAPI('', approveVirtualStatusApi, params).then(res => {
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
          this.$handleAPI('', approveVirtualStatusApi, params).then(res => {
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
          this.$handleAPI('', approveVirtualStatusApi, params).then(res => {
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
    handleEvent(event, data) {
      switch (event) {
        case 'changeAppType': // 修改道具类型
          this.formInfo.fieldList2.forEach(element => {
            if (element.value === 'iosSkuNo') {
              // ios平台，钻石，必须输入appstore上架sku编号
              if (this.formInfo.data.appType === '1' && this.formInfo.data.itemType === '31') {
                element.type = 'customselect'
              } else {
                element.type = 'hidden'
              }
            }
          })
          break
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
        case 'upload': { // 上传成功，绑定图片链接到id
          if (this.dialogUpload.type) {
            if (this.dialogUpload.type === 'uploadFile') {
              this.formInfo.data.imageUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
            if (this.dialogUpload.type === 'uploadIcon') {
              this.formInfo.data.baseImageUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
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
  .virtual-container {
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
