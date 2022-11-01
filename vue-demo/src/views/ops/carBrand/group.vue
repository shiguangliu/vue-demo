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
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getListApi"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 自定义插槽显示状态 -->
      <template v-slot:col-status="scope">
        <i
          :class="scope.row.status === '1' ? 'el-icon-edit' : (scope.row.status === '2' ? 'el-icon-check' : 'el-icon-close')"
          :style="{color: scope.row.status === '3' ? '#f56c6c' : '#67c23a', fontSize: '20px'}"
        />
      </template>
      <!-- 自定义插槽状态按钮 -->
      <template v-slot:bt-status="scope">
        <el-tooltip effect="light" :content="scope.data.row.status === '2' ? '停用' : '启用'" placement="top">
          <el-button
            v-if="scope.data.item.show && (!scope.data.item.ifRender || scope.data.item.ifRender(scope.data.row))"
            v-waves
            size="mini"
            class="handle-button"
            :type="scope.data.row.status === '2' ? 'danger' : 'success'"
            :icon="scope.data.item.icon"
            :disabled="scope.data.item.disabled"
            :loading="scope.data.row[scope.data.item.loading]"
            @click="handleClick(scope.data.item.event, scope.data.row)"
          />
        </el-tooltip>
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
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      >
        <!-- 自定义插槽-选择图片 -->
        <template v-slot:form-icon>
          <div class="slot-avatar">
            <img
              v-imgAlart
              :src="$TH.FILE_URLS.static_url + formInfo.data.icon"
              style="height: 30px;"
              :onerror="nopicture"
            >
            <el-button
              v-waves
              type="primary"
              icon="el-icon-picture"
              size="mini"
              @click="handleClick('uploadFile')"
            >
              {{ formInfo.data.icon ? '更换图片' : '选择图片' }}
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListApi, createApi, updateApi, deleteApi } from '@/api/merchant/group'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'
import Upload from '@/components/Upload'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageFilter,
    PageTable,
    PageDialog,
    PageForm,
    Upload
  },
  data() {
    // 检测车辆品牌组ID
    const checkID = (rule, value, callback) => {
      const check = this.$validate({ label: '车辆品牌组ID', value, rules: ['notnull', 'noChinese', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测车辆品牌组首字母
    const checkFirstLetter = (rule, value, callback) => {
      const check = this.$validate({ label: '首字母', value, rules: ['notnull', 'length'], conditions: [1, 11] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测车辆品牌组名称
    const checkGoodsBrandName = (rule, value, callback) => {
      const check = this.$validate({ label: '车辆品牌组名称', value, rules: ['notnull', 'length'], conditions: [1, 100] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测备注
    const checkRemarks = (rule, value, callback) => {
      const check = this.$validate({ label: '备注', value, rules: ['length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      getListApi,
      createApi,
      updateApi,
      deleteApi,
      // 相关列表
      listTypeInfo: {
        statusList: [] // 状态列表
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          id: '',
          groupName: null,
          firstLetter: null,
          status: ''
        },
        list: [
          { type: 'input', label: '车辆品牌组ID', value: 'id' },
          { type: 'input', label: '车辆品牌组名称', value: 'groupName' },
          { type: 'input', label: '首字母', value: 'firstLetter' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-plus', event: 'create', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '车辆品牌组ID', value: 'id', width: 100 },
          { label: '车辆品牌组名称', value: 'groupName', width: 300 },
          { label: '首字母', value: 'firstLetter', width: 90 },
          { label: '图片', value: 'icon', type: 'image', width: 200 },
          { label: '备注', value: 'remarks' },
          { label: '状态', value: 'statusName', type: 'tag', width: 90 },
          { label: '创建时间', value: 'createTime', width: 200 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '180',
          btList: [
            { label: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'detail', show: false },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', loading: 'deleteLoading', show: false }
          ]
        }
      },
      // 表单相关（追加、修改）
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          groupName: '', // *品牌名称
          firstLetter: '', // 首字母
          icon: '', // 品牌LOGO
          remarks: '', // 备注
          updateBy: '',
          status: '' // *状态: 1：编辑中(默认为1)',
        },
        fieldList: [
          { label: '车辆品牌组ID', value: 'id', type: 'tag', className: 'el-form-block', required: true, validator: checkID },
          { label: '车辆品牌组名称', value: 'groupName', type: 'input', className: 'el-form-block-100', required: true, validator: checkGoodsBrandName },
          { label: '首字母', value: 'firstLetter', type: 'input', className: 'el-form-block', required: true, validator: checkFirstLetter },
          { label: '图片', value: 'icon', type: 'slot', className: 'el-form-block-100' },
          { label: '备注', value: 'remarks', type: 'textarea', className: 'el-form-block-100', validator: checkRemarks },
          { label: '状态', value: 'status', type: 'customselect', className: 'el-form-block-30', list: 'statusList', key: 'itemValue', name: 'itemName', required: true }
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
          { label: '保存', type: 'primary', icon: '', event: 'save', saveLoading: false, show: true }
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
    'dialogInfo.visible'(val) {
      const formInfo = this.formInfo
      if (!val) {
        // 表单验证初始化
        if (formInfo.ref) {
          formInfo.ref.resetFields()
        }
        this.resetForm()
        // 重置弹窗按钮loading
        this.dialogInfo.btLoading = false
        this.dialogInfo.type = ''
      }
    },
    'dialogInfo.type'(val) {
      const formInfo = this.formInfo
      switch (val) {
        case 'create': {
          // 新建品牌
          // 表单验证初始化
          if (formInfo.ref) {
            formInfo.ref.resetFields()
          }
          this.resetForm()
          this.dialogInfo.btLoading = true
          const params = { sysUserId: this.$store.state.staff.staffId }
          this.$handleAPI('', createApi, params).then(res => {
            this.dialogInfo.btLoading = false
            if (res.code === 200) {
              formInfo.data.id = res.data.id
              formInfo.data.status = res.data.status += ''
            } else {
              this.dialogInfo.visible = false
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          }).catch((error) => {
            this.dialogInfo.visible = false
            this.dialogInfo.btLoading = false
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        }
        case 'update':

          break
      }
    },
    'dialogUpload.visible'(val) {
      if (!val) {
        // 重置弹窗按钮loading
        this.dialogUpload.btLoading = false
      }
    },
    'dialogUpload.type'(val) {
      // 图片上传
    }
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
      this.$initDataPermits('carBrandGroupList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('carBrandGroupList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      const formInfo = this.formInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      const params = {
        'configType': 'GENERAL_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          console.log(res.data)
          this.listTypeInfo.statusList = res.data
        }
      })
    },
    // 获取列表
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    // 得到placeholder的显示
    getPlaceholder(row) {
      let placeholder
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入' + row.label
      } else if (row.type === 'select' || row.type === 'time' || row.type === 'date') {
        placeholder = '请选择' + row.label
      } else {
        placeholder = row.label
      }
      return placeholder
    },
    // 按钮点击
    handleClick(event, data) {
      const tableInfo = this.tableInfo
      const dialogInfo = this.dialogInfo
      const dialogUpload = this.dialogUpload
      const formInfo = this.formInfo
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'create': // 创建
          dialogInfo.type = event
          dialogInfo.visible = true
          break
        case 'detail': // 编辑
          dialogInfo.type = event
          dialogInfo.visible = true
          // 显示信息
          data.status += ''
          for (const key in data) {
            // 存在则赋值
            if (key in formInfo.data) {
              formInfo.data[key] = data[key]
            }
          }
          break
        case 'delete': { // 删除
          data.deleteLoading = true
          // 删除选中的行
          const rowdata = {
            id: data.id,
            'updateBy': this.$store.state.staff.staffId,
            'deleteFlag': 1
          }
          this.$handleAPI('delete', deleteApi, rowdata).then(res => {
            data.deleteLoading = false
            if (res.code === 200) {
              tableInfo.refresh = Math.random()
              // 刷新列表
              this.initList()
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          }).catch((error) => {
            data.deleteLoading = false
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        }
        case 'close':
          // 弹窗点击关闭
          dialogInfo.visible = false
          break
        case 'closeUpload':
          // 图片上传弹窗点击关闭
          dialogUpload.visible = false
          break
        case 'save': { // 弹窗点击保存
          // 保存
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const params = this.formInfo.data
              params.updateBy = this.$store.state.staff.staffId
              dialogInfo.btLoading = true
              this.$handleAPI('', updateApi, params).then(res => {
                if (res.code === 200) {
                  dialogInfo.visible = false
                  this.formInfo.data.updatetime = res.data.updatetime
                  tableInfo.refresh = Math.random()
                } else if (res.code === 500) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    duration: 3500
                  })
                }
                dialogInfo.btLoading = false
              }).catch(e => {
                dialogInfo.btLoading = false
              })
            }
          })
          break
        }
        case 'uploadFile':
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
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
              item.createTime = this.$fn.switchTime(item.createTime, 'YYYY-MM-DD hh:mm:ss')
            })
          }
          break
        case 'upload': { // 上传成功，绑定图片链接到id
          if (data.code === 200) {
            const params = {
              id: this.formInfo.data.id,
              icon: data.fileList[0].relativeUrl
            }
            this.formInfo.data.icon = data.fileList[0].relativeUrl
            this.$handleAPI('', updateApi, params).then(res => {
              if (res.code === 200) {
                this.formInfo.data.updatetime = res.data.updatetime
              }
            }).catch((error) => {
              data.statusLoading = false
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
            })
            // 关闭弹窗
            this.handleClick('closeUpload')
            return
          }
          break
        }
      }
    },
    // 初始化表单
    resetForm() {
      this.formInfo.data = {
        id: '', // *唯一ID
        groupName: '', // *车辆品牌组名称
        firstLetter: '', // 首字母
        icon: '', // 品牌LOGO
        remarks: '', // 备注
        status: '' // *状态: 1：编辑中(默认为1)'
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
