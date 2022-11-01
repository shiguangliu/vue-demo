<template>
  <div class="tab-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="新手引导详情" name="tab1">
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
          <template v-slot:form-jobId>
            <div class="slot-job">
              <div>
                <el-input v-model="formInfo.data.jobId" disabled />
              </div>
              <div style="padding-left: 20px">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleClick('addDetailTask')" />
              </div>
            </div>
          </template>
        </page-form>

        <div style="width: 80%;text-align:center">
          <el-button v-if="formInfo.data.status == 1" type="primary" icon="el-icon-plus" @click="handleClick('addModule')">新增引导模块</el-button>
        </div>
        <el-card v-for="(guideModule, cardIndex) in formInfo.data.modules" :key="cardIndex" class="box-card">
          <div slot="header" class="clearfix">
            <div>
              <el-button v-if="formInfo.data.status === 1" style="float: right; padding: 3px 0;color: red; font-size: 16px" type="text" @click="deleteModule(cardIndex)"><i class="el-icon-delete" /></el-button>
            </div>
            <div>
              <page-form
                :ref-obj.sync="formInfo.ref2"
                :data="guideModule"
                :field-list="formInfo.fieldList2"
                :rules="formInfo.rules2"
                :label-width="formInfo.labelWidth2"
                :list-type-info="listTypeInfo"
                :read-only="formInfo.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              />
            </div>
          </div>
          <el-button v-if="formInfo.data.status === 1" type="primary" icon="el-icon-plus" @click="addStep(cardIndex)">添加步骤</el-button>
          <div style="height:auto">
            <!-- <page-table
              :pager="false"
              :data.sync="guideModule.steps"
              :field-list="tableInfo.fieldList"
              :handle="tableInfo.handle"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            >
              <template v-slot:col-stepCode="scope">
                <el-input v-model="scope.row.stepCode" placeholder="请输入引导步骤编码" />
                <template v-if="Number(scope.row.status) === 2">
                  <el-input v-model="scope.row.stepCode" size="small" />
                </template>
                <span v-if="Number(scope.row.status) === 1">{{ scope.row.stepCode }}</span>
              </template>
              <template v-slot:col-stepName="scope">
                <el-input v-model="scope.row.stepName" placeholder="请输入引导步骤名称" />
                <template v-if="Number(scope.row.status) === 2">
                  <el-input v-model="scope.row.stepName" size="small" />
                </template>
                <span v-if="Number(scope.row.status) === 1">{{ scope.row.stepName }}</span>
              </template>
            </page-table> -->
            <el-table :data="guideModule.steps" border fit highlight-current-row style="width: 100%">
              <el-table-column min-width="40px" align="center" label="序号">
                <template v-slot="scope">
                  <span>{{ scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column min-width="200px" align="center" label="引导步骤code">
                <template v-slot="scope">
                  <template v-if="scope.row.edit">
                    <el-input :key="scope.$index + guideModule.moduleCode" v-model="scope.row.stepCode" class="edit-input" size="small" />
                  </template>
                  <span v-else>{{ scope.row.stepCode }}</span>
                </template>
              </el-table-column>
              <el-table-column min-width="280px" label="引导步骤名称">
                <template v-slot="scope">
                  <template v-if="scope.row.edit">
                    <el-input :key="scope.$index + guideModule.moduleCode" v-model="scope.row.stepName" class="edit-input" size="small" />
                  </template>
                  <span v-else>{{ scope.row.stepName }}</span>
                </template>
              </el-table-column>
              <el-table-column min-width="100px" label="引导步骤排序">
                <template v-slot="scope">
                  <template v-if="scope.row.edit">
                    <el-input :key="scope.$index + guideModule.moduleCode" v-model="scope.row.sort" class="edit-input" size="small" type="number" />
                  </template>
                  <span v-else>{{ scope.row.sort }}</span>
                </template>
              </el-table-column>
              <el-table-column min-width="100px" label="引导步骤类型">
                <template v-slot="scope">
                  <el-select v-model="scope.row.stepType" placeholder="请选择" :disabled="!scope.row.edit">
                    <el-option
                      v-for="item in listTypeInfo.stepTypeList"
                      :key="item.itemValue"
                      :label="item.itemName"
                      :value="item.itemValue"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column v-if="formInfo.data.status === 1" align="center" label="操作" width="200px">
                <template v-slot="scope">
                  <el-button
                    v-if="scope.row.edit"
                    type="success"
                    size="mini"
                    icon="el-icon-circle-check-outline"
                    @click="confirmEdit(cardIndex,scope.$index)"
                  >
                    保存
                  </el-button>
                  <el-button
                    v-if="!scope.row.edit"
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="editRow(cardIndex,scope.$index)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="deleteRow(cardIndex,scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <page-dialog
      :visible.sync="dialogTask.visible"
      :title="dialogTask.title"
      :width="dialogTask.width"
      :bt-loading="dialogTask.btLoading"
      :bt-list="dialogTask.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-table
        class="popTable"
        :refresh="tableTaskInfo.refresh"
        :init-curpage="tableTaskInfo.initCurpage"
        :data.sync="tableTaskInfo.data"
        :list-type-info="listTypeInfo"
        :field-list="tableTaskInfo.fieldList"
        :handle="tableTaskInfo.handle"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetailApi, updateDetailApi, deleteApi, updateStatusApi } from '@/api/guide/setting'
import { getTaskDetailByTaskTypeApi } from '@/api/task/task'
import { getConfigItemsListApi } from '@/api/common'
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
    return {
      activeName: 'tab1',
      readOnly: false,
      listTypeInfo: {
        statusList: [],
        guideTypeList: [],
        stepTypeList: []
      },
      // 过滤相关配置（按钮区）
      filterInfo: {
        query: {
        },
        list: [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
      },
      // 表单相关（追加、修改）
      formInfo: {
        ref: null,
        ref2: null,
        data: {
          id: '', // *唯一ID
          guideType: '',
          status: '',
          jobId: '',
          jobDes: '',
          modules: ''
        },
        fieldList: [
          { label: '新手引导ID', value: 'id', type: 'tag', className: 'el-form-block-30' },
          { label: '新手引导类型', value: 'guideType', type: 'customselect', list: 'guideTypeList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-block-40' },
          { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-block-30' },
          { label: '新手引导奖励ID', value: 'jobId', type: 'slot', required: true, className: 'el-form-block-50' },
          { label: '新手引导奖励说明', value: 'jobDes', type: 'tag', required: true, className: 'el-form-block-50' }
        ],
        fieldList2: [
          { label: '引导功能模块编码', value: 'moduleCode', type: 'input', required: true },
          { label: '引导功能模块名称', value: 'moduleName', type: 'input', required: true }
        ],
        rules: {},
        labelWidth: '140px',
        rules2: {},
        labelWidth2: '150px'
      },
      // formInfo2: {
      //   ref: null,
      //   fieldList: [
      //     { label: '引导功能模块编码', value: 'moduleCode', type: 'input', required: true },
      //     { label: '引导功能模块名称', value: 'moduleName', type: 'input', required: true }
      //   ],
      //   rules: {},
      //   labelWidth: '150px'
      // },
      tableTaskInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '明细任务ID', value: 'id' },
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
          width: '120',
          btList: [
            { label: '选择', type: 'primary', icon: 'el-icon-plus', event: 'selectdTask', show: true }
          ]
        }
      },
      dialogTask: {
        title: '选择引导任务奖励',
        visible: false,
        width: '70%',
        btLoading: false,
        btList: []
      }
      // ,
      // tableInfo: {
      //   fieldList: [
      //     { label: '步骤CODE', value: 'stepCode', type: 'slot' },
      //     { label: '步骤名称', value: 'stepName', type: 'slot' }
      //   ],
      //   handle: {
      //     fixed: 'right',
      //     label: '操作',
      //     width: '200',
      //     btList: [
      //       // { label: '编辑', type: 'success', icon: '', event: 'editStep', loading: 'statusLoading', show: true },
      //       { label: '删除', type: 'danger', icon: '', event: 'deleteStep', loading: 'statusLoading', show: true }
      //     ]
      //   }
      // }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits'
    ])
  },
  watch: {
    'formInfo.data.status'(val) {
      // 按钮权限
      this.initButtonList(this.formInfo.data.status)
    }
  },
  created() {
    this.initList()
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
      this.$initDataPermits('guideSettingDetail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
    //  下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'APP_GUIDE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.guideTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'APP_GUIDE_STEP_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.stepTypeList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
      this.formInfo.rules2 = this.$initRules(this.formInfo.fieldList2)
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      // 获取url参数
      this.formInfo.data.id = this.$route.query.id
      // 获取version详细
      const param = { 'id': this.formInfo.data.id }
      this.$handleAPI('', getDetailApi, param).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          const data = res.data
          if (data.guideType === '0' || data.guideType === 0) {
            data.guideType = ''
          }
          if (data.jobId === '0' || data.jobId === 0) {
            data.jobId = ''
          }
          data.guideType += ''
          // 显示信息
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = data[key]
            }
          }
          if (this.formInfo.data.modules !== null && this.formInfo.data.modules !== undefined && this.formInfo.data.modules !== '') {
            this.formInfo.data.modules.forEach(el => {
              if (el.steps !== null && el.steps !== undefined && el.steps !== '') {
                el.steps.forEach(st => {
                  st.edit = false
                  if (st.stepType === null) {
                    st.stepType = ''
                  } else {
                    st.stepType += ''
                  }
                })
              }
            })
          }
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
    addStep(idx) {
      var curModule = this.formInfo.data.modules[idx]
      var param = {
        guideId: curModule.id,
        moduleCode: curModule.moduleCode,
        stepCode: '',
        stepName: '',
        stepType: '1',
        sort: '',
        updateBy: this.$store.state.staff.staffId,
        createBy: this.$store.state.staff.staffId,
        edit: false
      }
      curModule.steps.push(param)
    },
    confirmEdit(midx, sidx) {
      var arr = this.formInfo.data.modules[midx].steps
      if (!this.checkStepSort(arr)) {
        return false
      }
      arr[sidx].edit = false

      // this.$message({
      //   message: '保存成功',
      //   type: 'success'
      // })
    },
    checkSteps() {
      var arr = []
      for (var k = 0; k < this.formInfo.data.modules.length; k++) {
        var steps = this.formInfo.data.modules[k].steps
        if (steps.length === 0) {
          this.$message({
            message: '引导模块中必须添加引导步骤moduleCode: ' + this.formInfo.data.modules[k].moduleCode,
            type: 'error'
          })
          return false
        }
        if (!this.checkStepSort(steps)) {
          return false
        }
        arr = arr.concat(steps)
      }
      for (var n = 0; n < arr.length; n++) {
        if (arr[n].stepCode === '' || arr[n].stepCode === null || arr[n].stepCode === undefined || arr[n].stepName === '' || arr[n].stepName === null || arr[n].stepName === undefined) {
          this.$message({
            message: '引导步骤CODE不能为空',
            type: 'error'
          })
          return false
        }
        for (var m = n + 1; m < arr.length; m++) {
          if ((arr[n].stepCode + '') === (arr[m].stepCode + '')) {
            this.$message({
              message: '引导步骤CODE重复: ' + arr[n].stepCode,
              type: 'error'
            })
            return false
          }
        }
      }
      return true
    },
    checkStepSort(steps) {
      for (var i = 0; i < steps.length; i++) {
        if (steps[i].sort === '' || steps[i].sort === null || steps[i].sort === undefined) {
          this.$message({
            message: '引导步骤排序不能为空',
            type: 'error'
          })
          return false
        }
        if (steps[i].sort <= 0) {
          this.$message({
            message: '引导步骤排序必须大于0',
            type: 'error'
          })
          return false
        }
        for (var j = i + 1; j < steps.length; j++) {
          if ((steps[i].sort + '') === (steps[j].sort + '')) {
            this.$message({
              message: '引导步骤排序重复: ' + steps[i].sort,
              type: 'error'
            })
            return false
          }
        }
      }
      return true
    },
    editRow(midx, sidx) {
      this.formInfo.data.modules[midx].steps[sidx].edit = true
    },
    deleteRow(midx, sidx) {
      this.$confirm('确定要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formInfo.data.modules[midx].steps.splice(sidx, 1)
      })
    },
    deleteModule(midx) {
      this.$confirm('确定要删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formInfo.data.modules.splice(midx, 1)
      })
    },
    checkRequiredFields() {
      var f = false
      this.formInfo.ref.validate(valid => {
        if (valid) {
          if (this.formInfo.ref2) {
            this.formInfo.ref2.validate(va => {
              f = va
            })
          } else {
            f = true
          }
        }
      })
      return f
    },
    // 按钮点击
    handleClick(event, data, index) {
      switch (event) {
        case 'save': {
          if (this.checkRequiredFields()) {
            if (this.checkSteps()) {
              this.formInfo.data.updateBy = this.$store.state.staff.staffId
              this.$handleAPI('', updateDetailApi, this.formInfo.data).then(res => {
                this.$message({
                  showClose: true,
                  message: (res.code === 200) ? '保存成功' : res.message,
                  type: (res.code === 200) ? 'success' : 'error',
                  duration: 3500
                })
              })
            }
          }
          break
        }
        case 'delete': {
          this.$confirm('确定要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              'id': this.formInfo.data.id,
              'staffId': this.$store.state.staff.staffId
            }
            this.$handleAPI('', deleteApi, params).then(res => {
              if (res.code === 200) {
                this.$message.success('删除成功')
                this.$router.push({ path: './index', replace: true })
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error',
                  duration: 3500
                })
              }
            })
          })
          break
        }
        case 'edit': {
          const param = { 'id': this.formInfo.data.id, 'status': 1, 'updateBy': this.$store.state.staff.staffId }
          this.$handleAPI('', updateStatusApi, param).then(res => {
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
          this.$handleAPI('', updateStatusApi, param).then(res => {
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
          if (!this.checkRequiredFields()) {
            return
          }
          if (this.checkSteps()) {
            var temStatus = this.formInfo.data.status
            this.formInfo.data.status = 2
            this.formInfo.data.updateBy = this.$store.state.staff.staffId
            this.$handleAPI('', updateDetailApi, this.formInfo.data).then(res => {
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
        case 'addModule': {
          var sort = 0
          this.formInfo.data.modules.forEach(m => {
            if (m.sort > sort) {
              sort = m.sort
            }
          })
          var param = {
            id: this.formInfo.data.id,
            moduleCode: '',
            moduleName: '',
            deleteFlag: 0,
            updateBy: this.$store.state.staff.staffId,
            createBy: this.$store.state.staff.staffId,
            steps: [],
            sort: sort + 1
          }
          this.formInfo.data.modules.push(param)
          break
        }
        case 'addDetailTask': {
          this.$handleAPI('', getTaskDetailByTaskTypeApi, { taskType: 3 }).then(res => {
            if (res.code === 200) {
              // if (res.data.list !== null && res.data.list.length > 0) {
              //   this.dialogTask.visible = true
              //   this.tableTaskInfo.data = res.data.list
              // }
              this.dialogTask.visible = true
              this.tableTaskInfo.data = res.data.list
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
        case 'selectdTask': {
          this.dialogTask.visible = false
          this.formInfo.data.jobId = data.id
          this.formInfo.data.jobDes = data.itemName + ' : ' + data.bonusQuantity
        }
      }
    },
    handleEvent(event, data) {
      switch (event) {
        case 'list':
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .tab-container {
    margin: 30px;
  }
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
	.slot-job {
		width: 50%;
		display: flex;
    align-items: center;
	}
  .edit-input {
    padding-right: 50px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .popTable {
    max-height: 490px !important;
    overflow: auto;
  }
  .box-card {
    width: 80%;
    margin: 15px 15px;
    border: 1px solid #13C0C5;
    font-size: 16px;
    .el-card__header {
      font-size: 16px;
    }
  }
</style>
