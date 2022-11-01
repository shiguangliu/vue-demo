<template>
  <div class="tab-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="比赛模式详情" name="tab1">
        <el-row>
          <el-col :span="8">
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
          </el-col>
          <el-col :span="16">
            <page-form
              :ref-obj.sync="formInfo.contentRef"
              :data="formInfo.data"
              :field-list="formInfo.fieldList2"
              :rules="formInfo.contentRules"
              :label-width="formInfo.labelWidth"
              :list-type-info="listTypeInfo"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            >
              <template v-slot:form-content>
                <Tinymce ref="editor" v-model="formInfo.data.content" :height="300" :width="900" />
              </template>
            </page-form>
          </el-col>
          <!-- <page-form
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
            <template v-slot:form-content>
              <Tinymce ref="editor" v-model="formInfo.data.content" :height="300" :width="810" />
            </template>
          </page-form> -->
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetailApi, deleteBatchApi, updateDetailApi } from '@/api/race/racemode'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import Tinymce from '@/components/Tinymce'
export default {
  components: {
    PageFilter,
    PageForm,
    Tinymce
  },
  data() {
    const checkNumber = (rule, value, callback) => {
      const check = this.$validate({ label: '', value, rules: ['notnull', 'number', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      activeName: 'tab1',
      readOnly: false,
      listTypeInfo: {
        statusList: [],
        raceTypeList: [],
        rewardTypeList: [],
        matchRobotFlagList: []
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
        contentRef: null,
        data: {
          id: '', // *唯一ID
          raceModeName: '',
          raceType: '',
          rewardType: '',
          rewardQuantity: '',
          matchRule: '',
          status: '',
          content: '',
          loseQuantity: '',
          sort: '',
          matchMaxTime: '',
          scoreWin: '',
          scoreLose: '',
          matchRobotFlag: '',
          matchRobotTime: '',
          maxGold: ''
        },
        fieldList: [
          { label: '比赛模式ID', value: 'id', type: 'tag', className: 'el-form-block-80' },
          { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-block-60' },
          { label: '比赛模式名称', value: 'raceModeName', type: 'input', required: true, className: 'el-form-block-100' },
          { label: '比赛类型', value: 'raceType', type: 'customselect', list: 'raceTypeList', key: 'itemValue', name: 'itemName', event: 'changeRaceType', required: true, className: 'el-form-block-80' },
          { label: '奖励类型', value: 'rewardType', type: 'customselect', list: 'rewardTypeList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-block-80' },
          { label: '胜方奖励数量', value: 'rewardQuantity', type: 'input', required: true, validator: checkNumber, className: 'el-form-block-80' },
          { label: '负方扣除数量', value: 'loseQuantity', type: 'input', required: true, validator: checkNumber, className: 'el-form-block-80' },
          { label: '总性能差额', value: 'matchRule', type: 'input', fixtext: '%', append: 'append', required: true, validator: checkNumber, className: 'el-form-block-100' },
          { label: '匹配最长时间', value: 'matchMaxTime', type: 'input', fixtext: '秒', append: 'append', required: true, validator: checkNumber, className: 'el-form-block-100' },
          { label: '是否匹配马甲', value: 'matchRobotFlag', type: 'customradio', list: 'matchRobotFlagList', key: 'itemValue', name: 'itemName', event: 'changeMatchRobotFlag', required: true, className: 'el-form-block' },
          { label: '分配马甲时间', value: 'matchRobotTime', type: 'input', fixtext: '秒', append: 'append', required: true, validator: checkNumber, className: 'el-form-block-80' },
          { label: '胜方加分值', value: 'scoreWin', type: 'input', fixtext: '分', append: 'append', required: true, className: 'el-form-block-80', validator: checkNumber },
          { label: '负方扣分值', value: 'scoreLose', type: 'input', fixtext: '分', append: 'append', required: true, className: 'el-form-block-80', validator: checkNumber },
          { label: '排序', value: 'sort', type: 'input', required: true, validator: checkNumber, className: 'el-form-block-80' },
          { label: '单次可下注最大金币值', value: 'maxGold', type: 'input', required: true, className: 'el-form-block-80', validator: checkNumber }
        ],
        fieldList2: [
          { label: '比赛说明', value: 'content', type: 'slot' }
        ],
        rules: {},
        contentRules: {},
        labelWidth: '170px'
      }
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
      this.$initDataPermits('raceModeDetail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_RACE_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.raceTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'USER_RACE_REWARD_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.rewardTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'YES_NO' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.matchRobotFlagList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
      this.formInfo.contentRules = this.$initRules(this.formInfo.fieldList2)
    },
    resetForm() {
      this.formInfo.data = {
        id: '', // *唯一ID
        raceModeName: '',
        raceType: '',
        rewardType: '',
        rewardQuantity: '',
        matchRule: '',
        status: '',
        content: '',
        loseQuantity: '',
        sort: '',
        matchMaxTime: '',
        scoreWin: '',
        scoreLose: '',
        matchRobotFlag: '',
        matchRobotTime: ''
      }
    },
    getDetail() {
      const self = this
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
          // form表单初始化数据11
          const data = res.data
          data.rewardType += ''
          data.status += ''
          data.raceType += ''
          data.matchRobotFlag += ''
          this.formInfo.fieldList.forEach(element => {
            if (element.value === 'matchRobotTime') {
              if (data.matchRobotFlag === '1') {
                element.type = 'input'
                element.required = true
                element.validator = self.checkNumber
              } else {
                element.type = 'hidden'
                element.required = false
                element.validator = null
              }
            }
            if (element.value === 'scoreWin') {
              if (data.raceType === '30') {
                element.type = 'input'
                element.required = true
                element.validator = self.checkNumber
              } else {
                element.type = 'hidden'
                element.required = false
                element.validator = null
              }
            }
            if (element.value === 'scoreLose') {
              if (data.raceType === '30') {
                element.type = 'input'
                element.required = true
                element.validator = self.checkNumber
              } else {
                element.type = 'hidden'
                element.required = false
                element.validator = null
              }
            }
            if (element.value === 'maxGold') {
              if (data.raceType === '20') {
                element.type = 'input'
                element.required = true
                element.validator = self.checkNumber
              } else {
                element.type = 'hidden'
                element.required = false
                element.validator = null
              }
            }
          })
          // 显示信息
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              if (data[key] === 0 || data[key] === '0') {
                data[key] = ''
              }
              this.formInfo.data[key] = data[key]
            }
          }
          if (this.formInfo.data.raceType !== '30') {
            this.formInfo.data.scoreLose = 0
            this.formInfo.data.scoreWin = 0
          }
          if (this.formInfo.data.matchRobotFlag !== '1') {
            this.formInfo.data.matchRobotTime = 0
          }
          if (this.formInfo.data.raceType !== '20') {
            this.formInfo.data.maxGold = 0
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
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'save': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
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
          })
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
          })
          break
        }
        case 'edit': {
          const param = { 'id': this.formInfo.data.id, 'status': 1, 'updateBy': this.$store.state.staff.staffId }
          this.$handleAPI('', updateDetailApi, param).then(res => {
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
          this.$handleAPI('', updateDetailApi, param).then(res => {
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
          if (!va) {
            return
          }
          const temStatus = this.formInfo.data.status
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
          break
        }
      }
    },
    handleEvent(event, data) {
      switch (event) {
        case 'list':
          break
        case 'changeMatchRobotFlag': {
          this.formInfo.fieldList.forEach(element => {
            if (element.value === 'matchRobotTime') {
              if (this.formInfo.data.matchRobotFlag === '1') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
                this.formInfo.data.matchRobotTime = 0
              }
            }
          })
          break
        }
        case 'changeRaceType': {
          this.formInfo.fieldList.forEach(element => {
            if (element.value === 'scoreWin') {
              if (this.formInfo.data.raceType === '30') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
                this.formInfo.data.scoreWin = 0
              }
            }
            if (element.value === 'scoreLose') {
              if (this.formInfo.data.raceType === '30') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
                this.formInfo.data.scoreLose = 0
              }
            }
            if (element.value === 'maxGold') {
              if (this.formInfo.data.raceType === '20') {
                element.type = 'input'
              } else {
                element.type = 'hidden'
                this.formInfo.data.maxGold = 0
              }
            }
          })
          break
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
</style>
