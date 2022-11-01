<template>
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
      :table-index="tableInfo.tableIndex"
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getLandMarkList"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      :check-box="tableInfo.checkBox"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 自定义插槽显示状态 -->
      <template v-slot:col-lng="scope">
        <span>{{ scope.row.lng + ', ' + scope.row.lat }}</span>
      </template>
    </page-table>

    <!-- 弹窗 -->
    <page-dialog
      :title="dialogInfo.title[dialogInfo.type]"
      :visible.sync="dialogInfo.type !== 'uploadFile' && dialogInfo.visible"
      :width="dialogInfo.width"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- form -->
      <page-form
        v-if="dialogInfo.type !== 'uploadFile'"
        :ref-obj.sync="formInfo.ref"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-width="formInfo.labelWidth"
        :read-only="formInfo.readOnly"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      >
        <!-- 自定义插槽-选择图片 -->
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
        <!-- 自定义插槽-选择图片 -->
        <template v-slot:form-jumpH5Id>
          <div class="slot-avatar">
            <el-button
              v-waves
              type="primary"
              size="mini"
              @click="handleClick('choiceH5Link')"
            >
              {{ '选择H5链接' }}
            </el-button>
          </div>
        </template>
      </page-form>
    </page-dialog>

    <!-- 图片上传弹窗 -->
    <page-dialog
      :title="dialogUpload.title[dialogUpload.type]"
      :visible.sync="dialogUpload.type === 'uploadFile' && dialogUpload.visible"
      :width="dialogUpload.width"
      :bt-loading="dialogUpload.btLoading"
      :bt-list="dialogUpload.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 图片上传组件 -->
      <Upload
        v-if="dialogUpload.type === 'uploadFile' && dialogUpload.visible"
        :upload-data="{targetPath: 'car-brand',autoname: '1'}"
        @handleEvent="handleEvent"
      />
    </page-dialog>

    <page-dialog
      :title="dialogPopH5.title"
      :visible.sync="dialogPopH5.visible"
      :width="dialogPopH5.width"
      :bt-loading="dialogPopH5.btLoading"
      :bt-list="dialogPopH5.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <PopH5 @pickItem="pickItem" />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLandMarkList, saveLandMark, deleteLandBatch, addLandMark, getLandInfo } from '@/api/map/pin/ad'
import { getConfigItemsListApi, cityOptionsList } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'
import Upload from '@/components/Upload'
import PopH5 from '@/components/Popup/PopH5'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageFilter,
    PageTable,
    PageDialog,
    PageForm,
    Upload,
    PopH5
  },
  data() {
    return {
      getLandMarkList,
      // checkbox 选中的列表
      checkBoxList: [],
      // 相关列表
      listTypeInfo: {
        statusList: [],
        provinceList: [],
        cityList: [],
        districtList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: '',
          landmarkName: '',
          status: ''
        },
        list: [
          { type: 'input', label: '特殊坐标点ID', value: 'id' },
          { type: 'input', label: '坐标点名称', value: 'landmarkName' },
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
        tableIndex: false,
        checkBox: true,
        data: [],
        fieldList: [
          { label: '特殊坐标点ID', value: 'id' },
          { label: '坐标点名称', value: 'landmarkName' },
          { label: '跳转链接', value: 'jumpLink' },
          { label: '坐标(经度,纬度)', value: 'lng', type: 'slot' },
          { label: '图片', value: 'imageUrl', type: 'image' },
          { label: '状态', value: 'statusName', type: 'tag' },
          { label: '创建时间', value: 'createTime', minWidth: 90 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-edit', event: 'details', show: true },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: false }
          ]
        }
      },
      temp: {
        id: undefined,
        merchantNo: '',
        merchantName: '',
        linkman: '',
        phone: '',
        cityId: '',
        createTime: ''
      },
      // 表单相关（追加、修改）
      formInfo: {
        ref: null,
        readOnly: false,
        data: {
          id: '', // *唯一ID
          landmarkName: '',
          jumpLink: '',
          jumpH5Id: '',
          imageUrl: '',
          lng: '',
          lat: '',
          provinceId: '',
          cityId: '',
          districtId: '',
          status: ''
        },
        fieldList: [
          { label: '特殊坐标点ID', value: 'id', type: 'tag', required: true, className: 'el-form-block-50' },
          { label: '坐标点名称', value: 'landmarkName', type: 'input', required: true, className: 'el-form-block-50' },
          { label: '跳转链接', value: 'jumpLink', type: 'input', required: true, className: 'el-form-block-50' },
          { label: '', value: 'jumpH5Id', type: 'slot', required: true, className: 'el-form-inline-block-30' },
          { label: '地图经度', value: 'lng', type: 'input', required: true, className: 'el-form-block-50' },
          { label: '地图纬度', value: 'lat', type: 'input', required: true, className: 'el-form-block-50' },
          { label: '图片', value: 'imageUrl', type: 'slot', className: 'el-form-block' },
          { label: '所属区域', value: 'provinceId', type: 'customselect', list: 'provinceList', key: 'areaId', name: 'areaName', event: 'changeProvince', required: true, className: 'el-form-block-50' },
          { label: '所属城市', value: 'cityId', type: 'customselect', list: 'cityList', key: 'areaId', name: 'areaName', required: true, event: 'changeCity', className: 'el-form-block-50' },
          { label: '所属区县', value: 'districtId', type: 'customselect', list: 'districtList', key: 'areaId', name: 'areaName', required: true, className: 'el-form-block-50' },
          { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-block-50' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 弹窗相关
      dialogInfo: {
        title: {
          create: '添加',
          update: '编辑'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'close', show: true },
          { label: '保存', type: 'primary', icon: '', event: 'save', show: true },
          { label: '启用', type: 'primary', icon: '', event: 'submit', show: true }
        ]
      },
      // 图片上传弹窗相关
      dialogUpload: {
        title: {
          uploadFile: '图片上传'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'closeUpload', show: true }
        ]
      },
      dialogPopH5: {
        title: '选择H5',
        visible: false,
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'dialogPopH5Close', show: true }
        ]
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
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
    this.getList()
  },
  created() {
    this.getCityList()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('mapPinAd', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('mapPinAd', this.filterInfo.list) // 条件区域操作权限
      this.$initDataPermits('mapPinAd', this.dialogInfo.btList)
    },
    // 初始化验证
    initRules() {
      // form验证
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      const params = {
        'configType': 'GENERAL_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    getCityList() {
    },
    // reset temp
    resetTemp() {
      this.temp = {
        id: undefined,
        merchantNo: '',
        merchantName: '',
        linkman: '',
        phone: '',
        cityId: '',
        createTime: ''
      }
    },
    statusButton(status) {
      if (status === 1) {
        this.formInfo.readOnly = false
        this.dialogInfo.btList = [
          { label: '关闭', type: '', icon: '', event: 'close', show: true },
          { label: '保存', type: 'primary', icon: '', event: 'save', show: true },
          { label: '启用', type: 'primary', icon: '', event: 'submit', show: true }
        ]
      }
      if (status === 2) {
        this.formInfo.readOnly = true
        this.dialogInfo.btList = [
          { label: '关闭', type: '', icon: '', event: 'close', show: true },
          { label: '编辑', type: 'primary', icon: '', event: 'edit', show: true },
          { label: '停用', type: 'danger', icon: '', event: 'stop', show: true }
        ]
      }
      if (status === 3) {
        this.formInfo.readOnly = true
        this.dialogInfo.btList = [
          { label: '关闭', type: '', icon: '', event: 'close', show: true },
          { label: '编辑', type: 'primary', icon: '', event: 'edit', show: true },
          { label: '启用', type: 'primary', icon: '', event: 'submit', show: true }
        ]
      }
    },
    // 获取点击事件
    pickItem(data) {
      if (data.id != null) {
        this.formInfo.data.jumpH5Id = data.id
        this.formInfo.data.jumpLink = data.jumpLink
      }
      this.dialogPopH5.visible = false
    },
    popupMessage(code) {
      if (code === 200) {
        this.$message({
          showClose: true,
          message: '操作成功',
          type: 'success',
          duration: 3500
        })
      } else {
        this.$message({
          showClose: true,
          message: '操作失败',
          type: 'error',
          duration: 3500
        })
      }
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
          const params = {
            'staffId': this.$store.state.staff.staffId,
            'status': 1
          }
          this.$handleAPI('', addLandMark, params).then(res => {
            if (res.code === 200) {
              this.dialogInfo.type = event
              this.dialogInfo.visible = true
              res.data.status += ''
              this.formInfo.data = res.data
            }
          })
          break
        }
        case 'delete': {
          const params = {
            'id': data.id,
            'staffId': this.$store.state.staff.staffId,
            'deleteFlag': 1
          }
          this.$handleAPI('delete', saveLandMark, params).then(res => {
            if (res.code === 200) {
              tableInfo.refresh = Math.random()
            }
          })
          break
        }
        case 'batchdelete': {
          const ids = []
          let pass = true
          try {
            this.checkBoxList.forEach(item => {
              ids.push(item.id)
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
          if (ids.length > 0) {
            const params = {
              'ids': ids,
              'staffId': this.$store.state.staff.staffId
            }
            this.$handleAPI('delete', deleteLandBatch, params).then(res => {
              if (res.code === 200) {
                this.tableInfo.refresh = Math.random()
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
          break
        }
        case 'details': {
          const params = {
            'id': data.id
          }
          this.$handleAPI('', getLandInfo, params).then(res => {
            if (res.code === 200) {
              // 省列表
              const param = { 'level': 1, 'status': 1 }
              this.$handleAPI('', cityOptionsList, param).then(res => {
                if (res.code === 200) {
                  this.listTypeInfo.provinceList = res.data
                }
              })
              this.dialogInfo.type = event
              this.dialogInfo.visible = true
              this.statusButton(res.data.status)
              res.data.status += ''
              this.formInfo.data = res.data
              // 初始化select选择框
              this.handleEvent('changeProvince', null)
              this.handleEvent('changeCity', null)
            }
          })
          break
        }
        case 'close':
          // 弹窗点击关闭
          this.dialogInfo.visible = false
          this.tableInfo.refresh = Math.random()
          break
        case 'closeUpload':
          // 图片上传弹窗点击关闭
          this.dialogUpload.visible = false
          break
        case 'uploadFile':
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        case 'choiceH5Link': {
          this.dialogPopH5.type = event
          this.dialogPopH5.visible = true
          break
        }
        case 'dialogPopH5Close': {
          this.dialogPopH5.type = event
          this.dialogPopH5.visible = false
          break
        }
        case 'save': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const params = this.formInfo.data
              params.staffId = this.$store.state.staff.staffId
              this.$handleAPI('', saveLandMark, params).then(res => {
                this.popupMessage(res.code)
              })
            }
          })
          break
        }
        case 'submit': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const params = this.formInfo.data
              params.status = 2
              params.staffId = this.$store.state.staff.staffId
              this.$handleAPI('', saveLandMark, params).then(res => {
                if (res.code === 200) {
                  this.formInfo.data.status = 2
                  this.statusButton(this.formInfo.data.status)
                }
                this.popupMessage(res.code)
              })
            }
          })
          break
        }
        case 'edit': {
          const params = {
            'id': this.formInfo.data.id,
            'staffId': this.$store.state.staff.staffId,
            'status': 1
          }
          this.$handleAPI('', saveLandMark, params).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 1
              this.statusButton(this.formInfo.data.status)
            }
            this.popupMessage(res.code)
          })
          break
        }
        case 'stop': {
          const params = {
            'id': this.formInfo.data.id,
            'staffId': this.$store.state.staff.staffId,
            'status': 3,
            'deleteFlag': 0
          }
          this.$handleAPI('', saveLandMark, params).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 3
              this.statusButton(this.formInfo.data.status)
            }
            this.popupMessage(res.code)
          })
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) {
            data.forEach(item => {
              this.$set(item, 'statusLoading', false)
              this.$set(item, 'deleteLoading', false)
              item.approveTime = this.$fn.switchTime(item.approveTime, 'YYYY-MM-DD hh:mm:ss')
            })
          }
          break
        case 'changeProvince': {
          this.listTypeInfo.cityList = []
          this.listTypeInfo.districtList = []
          if (this.formInfo.data.provinceId !== 0) {
            if (data !== null) {
              this.formInfo.data.cityId = undefined
              this.formInfo.data.districtId = undefined
            }
            const parentId = this.formInfo.data.provinceId
            const params = { 'level': 2, 'parentId': parentId }
            this.$handleAPI('', cityOptionsList, params).then(res => {
              if (res.code === 200) {
                this.listTypeInfo.cityList = res.data
              }
            })
          }
          break
        }
        case 'changeCity': {
          this.listTypeInfo.districtList = []
          if (this.formInfo.data.cityId !== 0) {
            if (data !== null) {
              this.formInfo.data.districtId = undefined
            }
            const cityId = this.formInfo.data.cityId
            const params = { 'level': 3, 'parentId': cityId }
            this.$handleAPI('', cityOptionsList, params).then(res => {
              if (res.code === 200) {
                this.listTypeInfo.districtList = res.data
              }
            })
          }
          break
        }
        case 'tableCheck': { // 选择
          this.checkBoxList = data
          break
        }
        case 'upload': { // 上传成功，绑定图片链接到id
          if (data.code === 200) {
            this.formInfo.data.imageUrl = data.fileList[0].relativeUrl
            // 关闭弹窗
            this.handleClick('closeUpload')
            return
          }
          break
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .slot-avatar{
    height: 40px;
    display: flex;
    align-items: center;
    img{
      padding-right: 10px;
    }
  }
</style>
