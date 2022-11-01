<template>
  <div class="group-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      :list-type-info="listTypeInfo"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="任务详情" name="tab1">
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
        <template>
          <div v-if="formInfo.data.status === 1">
            <el-button
              v-waves
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleClick('create')"
            >
              {{ '新增任务' }}
            </el-button>
          </div>
        </template>
        <div>
          <page-table
            :data.sync="tableInfo.data"
            :pager="false"
            :auto-fit="false"
            :field-list="tableInfo.fieldList"
            :list-type-info="listTypeInfo"
            :handle="formInfo.data.status === 1 ? tableInfo.handle : null"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
        </div>
        <!-- <el-table
          :data="tableInfo.data"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="actionTypeName"
            label="活动类型"
            width="180">
          </el-table-column>
          <el-table-column
            prop="taskName"
            label="任务名称">
          </el-table-column>
        </el-table> -->
      </el-tab-pane>
    </el-tabs>
    <!-- 弹窗 -->
    <page-dialog
      :visible.sync="dialogInfo.visible"
      :title="dialogInfo.title[dialogInfo.type]"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- form "-->
      <page-form
        :ref-obj.sync="formDetailInfo.ref"
        :data="formDetailInfo.data"
        :field-list="formDetailInfo.fieldList"
        :rules="formDetailInfo.rules"
        :label-width="formDetailInfo.labelWidth"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
      <div class="slot-avatar">
        <el-button
          v-waves
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleClick('addBonus')"
        >
          {{ '添加奖励' }}
        </el-button>
      </div>
      <el-table :data="tableData" border>
        <el-table-column prop="bonusType" label="奖励类别" align="center" />
        <el-table-column prop="itemName" label="奖励名称" align="center" />
        <el-table-column prop="bonusQuantity" label="奖励数量" align="center" />
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="small" @click="deleteBonusItem(scope.$index, tableData)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </page-dialog>
    <page-dialog
      :title="dialogGameItem.title"
      :visible.sync="dialogGameItem.visible"
      :width="dialogGameItem.width"
      :bt-loading="dialogGameItem.btLoading"
      :bt-list="dialogGameItem.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- <PopGameItem @pickItem="pickItem" /> -->
      <PopGameItem v-if="dialogGameItem.visible && dialogGameItem.typeVal == 11" :custom-query="{ diff: 1 }" @pickItem="pickItem" />
      <PopGameItem v-if="dialogGameItem.visible && dialogGameItem.typeVal == 12" :custom-query="{ diff: undefined, itemType: '30' }" @pickItem="pickItem" />
      <PopGameItem v-if="dialogGameItem.visible && dialogGameItem.typeVal == 13" :custom-query="{ diff: undefined, itemType: '31' }" @pickItem="pickItem" />
    </page-dialog>

    <page-dialog
      :width="dialogGoldAndDiamond.width"
      :visible="dialogGoldAndDiamond.visible"
      :title="dialogGoldAndDiamond.title"
      :bt-loading="dialogGoldAndDiamond.btLoading"
      :bt-list="dialogGoldAndDiamond.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >

      <div class="slot-avatar1" align="center">
        <el-row>
          <el-image
            v-imgAlart
            style="width:50px"
            :src="$TH.FILE_URLS.static_url + tempBonus.itemLogUrl"
          />
        </el-row>
        <el-row>
          <el-input
            v-model="inputBonusCount"
            style="width:50%"
            placeholder="请输入数量"
            type="number"
          />
        </el-row>
      </div>
    </page-dialog>
    <!--装备信息显示 -->
    <page-dialog
      :visible="dialogGEquipment.visible"
      :title="dialogGEquipment.title"
      :bt-loading="dialogGEquipment.btLoading"
      :bt-list="dialogGEquipment.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-form
        :ref-obj.sync="formEquipmentInfo.ref"
        :data="formEquipmentInfo.data"
        :field-list="formEquipmentInfo.fieldList"
        :rules="formEquipmentInfo.rules"
        :label-width="formEquipmentInfo.labelWidth"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      >
        <template v-slot:form-imageThumbnailUrl>
          <div class="slot-avatar">
            <img
              v-imgAlart
              :src="$TH.FILE_URLS.static_url + formEquipmentInfo.data.imageThumbnailUrl"
              style="height: 60px;"
              :onerror="nopicture"
            >
          </div>
        </template>
      </page-form>
    </page-dialog>
    <!-- 选择新增奖励类型 -->
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
        <el-col v-for="(item, index) in objectTypeList" :key="index" :span="8">
          <el-button v-if="item.itemValue === 11 || item.itemValue === 12 || item.itemValue === 13" type="default" style="width: 100%;margin-bottom: 10px;" @click="clickObjType(item)">
            <div style="padding: 10px;">
              <i v-if="item.itemValue === 11" class="cardIcon el-icon-setting" />
              <i v-if="item.itemValue === 12" class="cardIcon el-icon-coin" />
              <i v-if="item.itemValue === 13" class="cardIcon fa fa-diamond svg-icon" />
              <h3 class="icon-name">{{ item.itemName }}</h3>
            </div>
          </el-button>
        </el-col>
      </el-row>
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetailListApi, getTaskApi, deleteBatchApi, deleteDetailApi, updateDetailTaskApi, updateTaskApi, deleteTaskBonusApi } from '@/api/task/task'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import PageTable from '@/components/PageTable'
import PopGameItem from '@/components/Popup/PopGameItem'
import defaultImage from '@/assets/img/no-pic.jpg'
export default {
  components: {
    PageFilter,
    PageForm,
    PageDialog,
    PageTable,
    PopGameItem
  },
  data() {
    const checkQuantity = (rule, value, callback) => {
      const check = this.$validate({ label: '', value, rules: ['notnull', 'int', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkValiddate = (rule, value, callback) => {
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
      getDetailListApi,
      activeName: 'tab1',
      readOnly: false,
      inputBonusCount: '',
      objectTypeList: [],
      listTypeInfo: {
        taskTypeList: [],
        statusList: [],
        actionTypeList: [],
        bonusItemTypeList: []
      },
      // 过滤相关配置（按钮区）
      filterInfo: {
        query: {
          id: ''
        },
        list: [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
      },
      // 表单相关（追加、修改）
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          taskType: '',
          validFrom: '',
          validTo: '',
          valid: [],
          updateBy: '',
          status: ''
        },
        fieldList: [
          { label: '任务ID', value: 'id', type: 'tag', className: 'el-form-block-30' },
          { label: '任务类型', value: 'taskType', type: 'customselect', list: 'taskTypeList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-block-30' },
          { label: '有效时间', value: 'valid', type: 'datetimerange', dateType: 'datetimerange', beforeAfterFlag: 'after', event: 'changedate', required: true, className: 'el-form-block-30', validator: checkValiddate },
          { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-block-30' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 任务明细表单相关（追加、修改）
      formDetailInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          taskId: '',
          taskName: '',
          actionType: '',
          taskGoal: '',
          updateBy: '',
          sort: '',
          bonusType: '',
          bonusQuantity: '',
          itemName: '',
          bonusItemId: ''
        },
        fieldList: [
          { label: '任务名称', value: 'taskName', type: 'input', required: true },
          { label: '任务活动类型', value: 'actionType', type: 'customselect', list: 'actionTypeList', key: 'itemValue', name: 'itemName', required: true },
          { label: '完成条件次数', value: 'taskGoal', type: 'input', required: true, validator: checkQuantity },
          { label: '任务排序', value: 'sort', type: 'input', required: true, validator: checkQuantity }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 任务明细表单相关（追加、修改）
      formEquipmentInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          imageThumbnailUrl: '',
          itemName: '',
          itemType: '',
          rareType: '',
          sort: '',
          bonusQuantity: ''
        },
        fieldList: [
          { label: '缩略图', value: 'imageThumbnailUrl', type: 'slot' },
          { label: '奖励名称', value: 'itemName', type: 'tag' },
          { label: '装备类型', value: 'itemType', type: 'tag', list: 'bonusItemTypeList', key: 'itemValue', name: 'itemName' },
          { label: '稀有度', value: 'rareType', type: 'tag' },
          { label: '任务排序', value: 'sort', type: 'tag' },
          { label: '奖励数量', value: 'bonusQuantity', type: 'input', required: true, validator: checkQuantity }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '明细任务ID', value: 'id', width: 90 },
          { label: '任务名称', value: 'taskName' },
          { label: '任务活动类型', value: 'actionTypeName', type: 'tag' },
          { label: '达标次数', value: 'taskGoal', width: 90 },
          { label: '任务排序', value: 'sort', width: 90 },
          { label: '奖励类型', value: 'bonusTypeName', type: 'tag', width: 90 },
          { label: '奖励名称', value: 'itemName' },
          { label: '奖励数量', value: 'bonusQuantity', width: 90 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { tooltip: '详情', label: '详情', type: 'primary', icon: 'el-icon-edit', event: 'detail', show: false },
            { tooltip: '删除', label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'detaildelete', show: false }
          ]
        }
      },
      // 弹窗相关
      dialogInfo: {
        title: {
          create: '新增任务',
          detail: '详情'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'close', show: true },
          { label: '保存', type: 'primary', icon: '', event: 'detailsave', saveLoading: false, show: true }
        ]
      },
      dialogGameItem: {
        title: '选择装备',
        visible: false,
        typeVal: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'dialogGameItemClose', show: true }
        ]
      },
      dialogGoldAndDiamond: {
        title: '添加奖励',
        visible: false,
        btLoading: false,
        width: '400px',
        btList: [
          { label: '取消', type: '', icon: '', event: 'gdCancel', show: true },
          { label: '确定', type: '', icon: '', event: 'gdAdd', show: true }
        ]
      },
      dialogGEquipment: {
        title: '添加奖励',
        visible: false,
        btLoading: false,
        btList: [
          { label: '取消', type: '', icon: '', event: 'equipmentCancel', show: true },
          { label: '确定', type: '', icon: '', event: 'equipmentAdd', show: true }
        ]
      },
      tempBonus: {
        itemId: '',
        itemName: '',
        itemType: '',
        itemTypeName: '',
        itemLogUrl: ''
      },
      tableData: [],
      objTypeDialog: {
        title: '选择奖励类型',
        visible: false,
        btLoading: false,
        width: '500px',
        height: '300px'
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
    'formInfo.data.status'(val) {
      // 按钮权限
      this.initButtonList(this.formInfo.data.status)
    },
    'dialogInfo.visible'(val) {
      const formDetailInfo = this.formDetailInfo
      if (!val) {
        // 表单验证初始化
        if (formDetailInfo.ref) {
          formDetailInfo.ref.resetFields()
        }
        // 重置弹窗按钮loading
        // this.resetFields()
        this.dialogInfo.btLoading = false
        this.dialogInfo.type = ''
      }
    }
  },
  created() {
    this.initList()
    // this.initObjectType()
  },
  mounted() {
    this.getDetail()
    this.initDataPermits()
    // 验证规则
    this.initRules()
    this.initObjectType()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('taskDetail', this.filterInfo.list) // 条件区域操作权限
      this.$initDataPermits('taskDetail', this.tableInfo.handle.btList) // 列表数据操作权限
    },
    initList() {
    //  下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_TASK_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.taskTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_TASK_ACTION_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.actionTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_ITEM_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.bonusItemTypeList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
      this.formDetailInfo.rules = this.$initRules(this.formDetailInfo.fieldList)
      this.formEquipmentInfo.rules = this.$initRules(this.formEquipmentInfo.fieldList)
    },
    initObjectType() {
      var arr = []
      const p = {
        itemValue: 11,
        itemName: '装备'
      }
      const p2 = {
        itemValue: 12,
        itemName: '金币'
      }
      const p3 = {
        itemValue: 13,
        itemName: '钻石'
      }
      arr.push(p)
      arr.push(p2)
      arr.push(p3)
      this.objectTypeList = arr
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      if (this.formDetailInfo.ref) {
        this.formDetailInfo.ref.resetFields()
      }
      if (this.formEquipmentInfo.ref) {
        this.formEquipmentInfo.ref.resetFields()
      }
      // 获取url参数
      this.formInfo.data.id = this.$route.query.id
      this.tableData = []
      // 获取协议详细
      const param = { 'id': this.formInfo.data.id }
      this.$handleAPI('', getTaskApi, param).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          const data = res.data
          // data.status += ''
          data.taskType += ''
          if (data.taskType === '0') {
            data.taskType = ''
          }
          // 显示信息
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = data[key]
              if (key === 'validFrom' && data['validFrom'] !== '0000-00-00 00:00:00' && data['validFrom'] !== null) {
                this.formInfo.data.valid = [data['validFrom'], data['validTo']]
              }
            }
          }
          this.getDetailTaskList()
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
        }
      })
    },
    getDetailTaskList() {
      const param = { 'id': this.formInfo.data.id }
      this.$handleAPI('', getDetailListApi, param).then(res => {
        if (res.code === 200) {
          this.tableInfo.data = res.data.list
        }
      })
      // this.filterInfo.query.id = this.formInfo.data.id
      // this.tableInfo.refresh = Math.random()
    },
    // 获取点击事件
    pickItem(data) {
      this.objTypeDialog.visible = false
      this.tempBonus.itemId = data.id
      this.tempBonus.itemType = data.itemType
      this.tempBonus.itemName = data.itemName
      this.tempBonus.itemTypeName = data.itemTypeName
      // 30金币 31 钻石
      if (data.itemType === 30 || data.itemType === 31) {
        this.tempBonus.itemLogUrl = data.imageThumbnailUrl
        this.dialogGoldAndDiamond.visible = true
      } else {
        this.dialogGEquipment.visible = true
        for (const key in data) {
          // 存在则赋值
          if (key in this.formEquipmentInfo.data) {
            this.formEquipmentInfo.data[key] = data[key]
          }
        }
      }
    },
    resetFormDetailInfo() {
      this.formDetailInfo.data = {
        id: '',
        taskId: this.formInfo.data.id,
        taskName: '',
        actionType: '',
        taskGoal: '',
        updateBy: '',
        sort: '',
        bonusType: '',
        bonusQuantity: '',
        itemName: '',
        bonusItemId: ''
      }
    },
    initButtonList(status) {
      status = Number(status)
      if (status === 3) { // 停用状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '启用', btType: 'primary', icon: 'el-icon-check', loading: 'submitLoading', event: 'submit', show: false }
        ]
      }
      if (status === 2) { // 已发布，启用状态
        this.formInfo.readOnly = true
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'editLoading', event: 'edit', show: false },
          { type: 'button', label: '停用', btType: 'danger', icon: 'el-icon-close', loading: 'stopLoading', event: 'stop', show: false }
        ]
      }
      if (status === 1) { // 编辑状态
        this.formInfo.readOnly = false
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '启用', btType: 'primary', icon: 'el-icon-check', loading: 'submitLoading', event: 'submit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
      }
      this.initDataPermits()
    },
    clickObjType(e) {
      // 弹出选择具体条目
      this.dialogGameItem.title = '选择' + e.itemName
      this.dialogGameItem.typeVal = e.itemValue
      this.dialogGameItem.visible = true
      // 创建 11-装备 12-金币 13-钻石
    },
    saveDetail() {
      this.formInfo.ref.validate(valid => {
        if (valid) {
          this.formInfo.data.updateBy = this.$store.state.staff.staffId
          this.$handleAPI('', updateTaskApi, this.formInfo.data).then(res => {
            this.$message({
              showClose: true,
              message: (res.code === 200) ? '保存成功' : res.message,
              type: (res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
            if (res.code === 200) {
              return true
            }
          })
        }
      })
      return false
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'save': {
          this.saveDetail()
          break
        }
        case 'delete': {
          this.$confirm('确定要删除任务？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var ids = []
            ids.push(this.formInfo.data.id)
            if (ids.length > 0) {
              const params = {
                'ids': ids,
                'staffId': this.$store.state.staff.staffId
              }
              this.$handleAPI('', deleteBatchApi, params).then(res => {
                if (res.code === 200) {
                  this.$message.success('删除成功')
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
            }
          })
          break
        }
        case 'edit': {
          const param = { 'id': this.formInfo.data.id, 'status': 1, 'updateBy': this.$store.state.staff.staffId }
          this.$handleAPI('', updateTaskApi, param).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 1
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          })
          break
        }
        case 'stop': {
          const param = { 'id': this.formInfo.data.id, 'status': 3, 'updateBy': this.$store.state.staff.staffId }
          this.$handleAPI('', updateTaskApi, param).then(res => {
            if (res.code === 200) {
              this.formInfo.data.status = 3
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          })
          break
        }
        case 'submit': {
          var va = false
          this.formInfo.ref.validate(valid => {
            va = valid
          })
          if (va) {
            const temStatus = this.formInfo.data.status
            this.formInfo.data.status = 2
            this.formInfo.data.updateBy = this.$store.state.staff.staffId
            this.$handleAPI('', updateTaskApi, this.formInfo.data).then(res => {
              this.$message({
                showClose: true,
                message: res.code === 200 ? '启用成功' : res.message,
                type: res.code === 200 ? 'success' : 'error',
                duration: 3500
              })
              if (res.code !== 200) {
                this.formInfo.data.status = temStatus
              }
            })
          }
          break
        }
        case 'create': // 创建明细
          if (this.formInfo.data.status === 1) {
            this.dialogInfo.type = event
            this.dialogInfo.visible = true
            this.tempBonus = {}
            this.tableData = []
            this.resetFormDetailInfo()
          }
          break
        case 'close':
          // 弹窗点击关闭
          this.dialogInfo.visible = false
          break
        case 'detailsave':
          var self = this
          self.formDetailInfo.ref.validate(valid => {
            if (valid) {
              self.formDetailInfo.data.updateBy = this.$store.state.staff.staffId
              this.$handleAPI('', updateDetailTaskApi, self.formDetailInfo.data).then(res => {
                if (res.code === 200) {
                  this.$message({
                    showClose: true,
                    message: '保存成功',
                    type: 'success',
                    duration: 3500
                  })
                  this.getDetailTaskList()
                  this.dialogInfo.type = event
                  this.dialogInfo.visible = false
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
        case 'detaildelete':
          this.$confirm('确定要删除任务？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = { id: data.id, 'staffId': this.$store.state.staff.staffId }
            this.$handleAPI('', deleteDetailApi, params).then(res => {
              if (res.code === 200) {
                this.$message({
                  showClose: true,
                  message: '删除成功',
                  type: 'success',
                  duration: 3500
                })
                this.getDetailTaskList()
              } else {
                this.$message({
                  showClose: true,
                  message: '删除失败',
                  type: 'error',
                  duration: 3500
                })
              }
            })
          })
          break
        case 'detail': {
          this.dialogInfo.type = event
          this.dialogInfo.visible = true
          this.tableData = []
          this.resetFormDetailInfo()
          data.actionType += ''
          for (const key in data) {
            // 存在则赋值
            if (key in this.formDetailInfo.data) {
              this.formDetailInfo.data[key] = data[key]
              if (key === 'actionType' && (data[key] === 0 || data[key] === '0')) {
                this.formDetailInfo.data[key] = ''
              }
              if (key === 'taskGoal' && (data[key] === 0 || data[key] === '0')) {
                this.formDetailInfo.data[key] = ''
              }
              if (key === 'sort' && (data[key] === 0 || data[key] === '0')) {
                this.formDetailInfo.data[key] = ''
              }
            }
          }
          if (data.bonusType !== '' && data.bonusType !== 0) {
            const bonusTypeName = this.$fn.getDataName({ dataList: this.listTypeInfo.bonusItemTypeList, value: 'itemValue', label: 'itemName', data: data.bonusType + '' })
            var bonus = []
            bonus.push({
              bonusType: bonusTypeName,
              bonusQuantity: data.bonusQuantity,
              itemName: data.itemName

            })
            this.tableData = bonus
          }
          break
        }
        case 'addBonus': {
          // this.dialogGameItem.type = event
          // this.dialogGameItem.visible = true
          this.objTypeDialog.visible = true
          break
        }
        case 'dialogGameItemClose': {
          this.dialogGameItem.type = event
          this.dialogGameItem.visible = false
          break
        }
        case 'gdCancel': {
          this.dialogGoldAndDiamond.visible = false
          break
        }
        case 'gdAdd': {
          this.inputBonusCount = Number(this.inputBonusCount)
          if (this.inputBonusCount <= 0) {
            this.$message({
              showClose: true,
              message: '数量必须大于0',
              type: 'error',
              duration: 3500
            })
          } else {
            this.dialogGoldAndDiamond.visible = false
            this.dialogGameItem.type = event
            this.dialogGameItem.visible = false

            var bonus2 = []
            bonus2.push({
              bonusType: this.tempBonus.itemTypeName,
              bonusQuantity: this.inputBonusCount,
              itemName: this.tempBonus.itemName

            })
            this.tableData = bonus2
            this.formDetailInfo.data.bonusItemId = this.tempBonus.itemId
            this.formDetailInfo.data.bonusType = this.tempBonus.itemType
            this.formDetailInfo.data.itemName = this.tempBonus.itemName
            this.formDetailInfo.data.bonusQuantity = this.inputBonusCount
            this.inputBonusCount = ''
          }
          break
        }
        case 'equipmentCancel': {
          this.dialogGEquipment.visible = false
          break
        }
        case 'equipmentAdd': {
          var flag = false
          this.formEquipmentInfo.ref.validate(valid => {
            if (!valid) {
              flag = true
            }
          })
          if (!flag) {
            this.dialogGEquipment.visible = false
            this.dialogGameItem.type = event
            this.dialogGameItem.visible = false
            this.formDetailInfo.data.bonusItemId = this.tempBonus.itemId
            this.formDetailInfo.data.bonusType = this.tempBonus.itemType
            this.formDetailInfo.data.itemName = this.tempBonus.itemName
            this.formDetailInfo.data.bonusQuantity = this.formEquipmentInfo.data.bonusQuantity
            var bonus3 = []
            bonus3.push({
              bonusType: this.tempBonus.itemTypeName,
              bonusQuantity: this.formEquipmentInfo.data.bonusQuantity,
              itemName: this.tempBonus.itemName
            })
            this.tableData = bonus3
            this.formEquipmentInfo.data.bonusQuantity = ''
          }
          break
        }
      }
    },
    deleteBonusItem(index, rows) {
      if (this.formDetailInfo.data.bonusItemId !== '' && this.formDetailInfo.data.bonusItemId !== 0) {
        this.$confirm('确定要删除任务奖励？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = { id: this.formDetailInfo.data.id, 'staffId': this.$store.state.staff.staffId }
          this.$handleAPI('', deleteTaskBonusApi, params).then(res => {
            if (res.code === 200) {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success',
                duration: 3500
              })
              this.getDetailTaskList()
              this.dialogInfo.visible = false
              this.dialogInfo.type = 'close'

              rows.splice(index, 1)
              this.formDetailInfo.data.bonusTypeName = ''
              this.formDetailInfo.data.bonusQuantity = 0
              this.formDetailInfo.data.bonusItemId = 0
              this.formDetailInfo.data.bonusType = 0
              this.formDetailInfo.data.itemName = ''
            } else {
              this.$message({
                showClose: true,
                message: '删除失败',
                type: 'error',
                duration: 3500
              })
            }
          })
        })
      } else {
        rows.splice(index, 1)
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'changedate': {
          if (this.formInfo.data.valid !== null) {
            this.formInfo.data.validFrom = this.$fn.switchTime(this.formInfo.data.valid[0])
            this.formInfo.data.validTo = this.$fn.switchTime(this.formInfo.data.valid[1])
          } else {
            this.formInfo.data.validFrom = ''
            this.formInfo.data.validTo = ''
          }
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

    .slot-avatar{
      width: 200px;
      height: 40px;
      // display: flex;
      align-items: right;
    }
    .slot-avatar1{
      width: 60px;
      height: 40px;
      display: flex;
      align-items: center;
    }
    .image {
      width: 100%;
      display: block;
      align-items: center;
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
  .cardIcon {
    font-size: 40px;
  }
</style>
