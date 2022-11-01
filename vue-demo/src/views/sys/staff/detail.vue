<template>
  <div class="app-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="员工基本信息" name="ud1">
        <el-card :span="12" class="box-card" style="border-color: #13C0C5;">
          <div slot="header" class="clearfix">
            <span>基础信息</span>
          </div>
          <el-row>
            <el-col :span="12">
              <page-form
                :ref-obj.sync="formInfo1.leftRef"
                :data="formInfo1.data"
                :field-list="formInfo1.leftFieldList"
                :rules="formInfo1.rules"
                :label-width="formInfo1.labelWidth"
                :list-type-info="listTypeInfo"
                :read-only="formInfo1.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              />
            </el-col>
            <el-col :span="12">
              <page-form
                :ref-obj.sync="formInfo1.rightRef"
                :data="formInfo1.data"
                :field-list="formInfo1.rightFieldList"
                :rules="formInfo1.rules"
                :label-width="formInfo1.labelWidth"
                :list-type-info="listTypeInfo"
                :read-only="formInfo1.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              >
                <template v-slot:form-avatarUrl>
                  <div class="slot-avatar">
                    <img
                      v-imgAlart
                      height="100px"
                      :src="$TH.FILE_URLS.static_url + formInfo2.data.avatarUrl"
                      :onerror="nopicture"
                    >
                    <el-button type="primary" @click="handleClick('uploadAvatar')">上传头像</el-button>
                  </div>
                </template>
                <template v-slot:form-role>
                  <div class="slot-role">
                    <template
                      v-for="roleid in formInfo1.data.userrole"
                    >
                      <el-tag
                        v-if="getRoleNm( roleid ) != ''"
                        :key="roleid"
                        closable
                        size="medium"
                        :disable-transitions="false"
                        @close="handleClose('closeRole', roleid)"
                      >
                        {{ getRoleNm( roleid ) }}
                      </el-tag>
                    </template>
                    <el-button class="button-new-tag" size="small" @click="handleClick('addrole', '')">+</el-button>
                  </div>
                </template>
              </page-form>
            </el-col>
          </el-row>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="其他补充信息" name="ud2">
        <el-card :span="12" class="box-card" style="border-color: #13C0C5;">
          <div slot="header" class="clearfix">
            <span>补充证件资料</span>
          </div>
          <el-row>
            <el-col :span="12">
              <page-form
                :ref-obj.sync="formInfo2.ref"
                :data="formInfo2.data"
                :field-list="formInfo2.leftFieldList"
                :rules="formInfo2.rules"
                :label-width="formInfo2.labelWidth"
                :list-type-info="listTypeInfo"
                :read-only="formInfo2.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              >
                <template v-slot:form-idFront>
                  <div class="slot-avatar">
                    <img
                      v-imgAlart
                      height="100px"
                      style="object-fit: cover;"
                      :src="$TH.FILE_URLS.static_url + formInfo2.data.idFront"
                      :onerror="nopicture"
                    >
                    <el-button type="primary" @click="handleClick('uploadIdFront')">上传</el-button>
                  </div>
                </template>
                <template v-slot:form-idBack>
                  <div class="slot-avatar">
                    <img
                      v-imgAlart
                      height="100px"
                      style="object-fit: cover;"
                      :src="$TH.FILE_URLS.static_url + formInfo2.data.idBack"
                      :onerror="nopicture"
                    >
                    <el-button type="primary" @click="handleClick('uploadIdBack')">上传</el-button>
                  </div>
                </template>
              </page-form>
            </el-col>
            <el-col :span="12">
              <page-form
                :ref-obj.sync="formInfo2.ref"
                :data="formInfo2.data"
                :field-list="formInfo2.rightFieldList"
                :rules="formInfo2.rules"
                :label-width="formInfo2.labelWidth"
                :list-type-info="listTypeInfo"
                :read-only="formInfo2.readOnly"
                @handleClick="handleClick"
                @handleEvent="handleEvent"
              >
                <template v-slot:form-driverLicense1>
                  <div class="slot-avatar">
                    <img
                      v-imgAlart
                      height="100px"
                      style="object-fit: cover;"
                      :src="$TH.FILE_URLS.static_url + formInfo2.data.driverLicense1"
                      :onerror="nopicture"
                    >
                    <el-button type="primary" @click="handleClick('uploadDriverLicense1')">上传</el-button>
                  </div>
                </template>
              </page-form>
            </el-col>
          </el-row>
        </el-card>
        <page-dialog
          :title="dialogUpload.title[dialogUpload.type]"
          :visible.sync="(dialogUpload.type === 'uploadAvatar' || dialogUpload.type === 'uploadIdFront' || dialogUpload.type === 'uploadIdBack' || dialogUpload.type === 'uploadDriverLicense1' || dialogUpload.type === 'uploadDriverLicense2') && dialogUpload.visible"
          :width="dialogUpload.width"
          :bt-loading="dialogUpload.btLoading"
          :bt-list="dialogUpload.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 图片上传组件 -->
          <Upload
            v-if="dialogUpload.type === 'uploadAvatar' && dialogUpload.visible"
            :upload-data="{targetPath: 'staff/' + detailStaffId + '/avatar/', autoname: '1'}"
            @handleEvent="handleEvent"
          />
          <!-- 上传正面 -->
          <Upload
            v-if="dialogUpload.type === 'uploadIdFront' && dialogUpload.visible"
            :upload-data="{targetPath: 'staff/' + detailStaffId + '/idFront/', autoname: '1'}"
            @handleEvent="handleEvent"
          />
          <!-- 上传反面 -->
          <Upload
            v-if="dialogUpload.type === 'uploadIdBack' && dialogUpload.visible"
            :upload-data="{targetPath: 'staff/' + detailStaffId + '/idBack/', autoname: '1'}"
            @handleEvent="handleEvent"
          />
          <!-- 上传正面 -->
          <Upload
            v-if="dialogUpload.type === 'uploadDriverLicense1' && dialogUpload.visible"
            :upload-data="{targetPath: 'staff/' + detailStaffId + '/driverLicense1/', autoname: '1'}"
            @handleEvent="handleEvent"
          />
          <!-- 上传反面 -->
          <Upload
            v-if="dialogUpload.type === 'uploadDriverLicense2' && dialogUpload.visible"
            :upload-data="{targetPath: 'staff/' + detailStaffId + '/driverLicense2/', autoname: '1'}"
            @handleEvent="handleEvent"
          />
        </page-dialog>
      </el-tab-pane>
    </el-tabs>
    <!-- 选择角色 -->
    <page-dialog
      :title="dialogRole.title"
      :visible.sync="dialogRole.visible"
      :width="dialogRole.width"
      :bt-loading="dialogRole.btLoading"
      :bt-list="dialogRole.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-filter
        :query.sync="filterRole.query"
        :filter-list="filterRole.list"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
      <el-table
        v-loading="listLoading"
        :data="dailogRoleList"
        border
        height="500"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleRoleListSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="角色ID"
          sortable
        >
          <template slot-scope="scope">{{ scope.row.roleId }}</template>
        </el-table-column>
        <el-table-column
          label="角色名称"
          sortable
        >
          <template slot-scope="scope">{{ scope.row.roleName }}</template>
        </el-table-column>
        <el-table-column
          label="所属子系统"
          sortable
        >
          <template slot-scope="scope">{{ scope.row.moduleName }}</template>
        </el-table-column>
      </el-table>
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi, getMerchantListApi } from '@/api/common'
import { getAreaList } from '@/api/sysarea'
import { getApi, updateApi, deleteApi, resetPwdApi } from '@/api/sysstaff'
import { getListApi } from '@/api/sysrole'
import { updateApi as updateStaffRoleApi, getListApi as getStaffRoleList } from '@/api/sysstaffrole'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import ThConsts from '@/constants' /* constant */
import defaultImage from '@/assets/img/no-pic.jpg'
import Upload from '@/components/Upload'

export default {
  components: {
    PageFilter,
    PageForm,
    PageDialog,
    Upload
  },
  data() {
    const pageThis = this
    const checkProvinceNotZero = (rule, value, callback) => {
      if (Number(pageThis.formInfo1.data.status) === 1 && Number(value) === 0) {
        callback(new Error('请选择省份'))
      } else {
        callback()
      }
    }
    const checkCityNotZero = (rule, value, callback) => {
      if (Number(pageThis.formInfo1.data.status) === 1 && Number(value) === 0) {
        callback(new Error('请选择城市'))
      } else {
        callback()
      }
    }
    const checkGender = (rule, value, callback) => {
      if (Number(pageThis.formInfo1.data.status) === 1 && Number(value) === 0) {
        callback(new Error('请选择性别'))
      } else {
        callback()
      }
    }
    const checkStaffType = (rule, value, callback) => {
      if (Number(pageThis.formInfo1.data.status) === 1 && Number(value) === 0) {
        callback(new Error('请选择员工类型'))
      } else {
        callback()
      }
    }
    const checkName = (rule, value, callback) => {
      const check = this.$validate({ label: '员工姓名', value, rules: ['notnull', 'length'], conditions: [1, 60] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkLoginName = (rule, value, callback) => {
      const check = this.$validate({ label: '登录帐号', value, rules: ['notnull', 'length'], conditions: [1, 60] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkPhone = (rule, value, callback) => {
      const check = this.$validate({ label: '电话', value, rules: ['notnull', 'phone'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // const checkEmail = (rule, value, callback) => {
    //   const check = this.$validate({ label: '邮件', value, rules: ['notnull', 'email'] })
    //   if (!check.result) {
    //     callback(new Error(check.message))
    //   } else {
    //     callback()
    //   }
    // }
    // const checkEmployeeno = (rule, value, callback) => {
    //   const check = this.$validate({ label: '工号', value, rules: ['notnull', 'length'], conditions: [1, 20] })
    //   if (!check.result) {
    //     callback(new Error(check.message))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      activeName: 'ud1',
      detailStaffId: this.$route.query.staffId || '',
      staffData: {},
      dailogRoleList: [],
      roleListSelection: null,
      listLoading: true,
      resetLoading: false,
      deleteLoading: false,
      saveLoading: false,
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
        },
        list: [
          // { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          // { type: 'button', label: '封号', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'lock', show: false },
          // { type: 'button', label: '禁用', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'close', show: false },
          // { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false },
          // { type: 'button', label: '重置密码', btType: 'warning', icon: 'el-icon-refresh', loading: 'resetLoading', event: 'resetpwd', show: false }
        ]
      },
      // 相关列表
      listTypeInfo: {
        provinceList: [],
        cityList: [],
        roleList: [], // 角色
        subsystemList: ThConsts.SUBSYSTEM, // 所属子系统列表
        staffTypeList: [],
        staffOnlineStatusList: [],
        staffStatusList: [],
        genderList: [],
        verifyFlagList: []
      },
      // 表单相关
      formInfo1: {
        ref: null,
        leftRef: null,
        rightRef: null,
        readOnly: false,
        data: {
          id: '',
          nickName: '',
          staffName: '',
          staffType: '',
          staffNo: '',
          phone: '',
          mail: '',
          birthday: '',
          gender: '',
          profile: '',
          description: '',
          tagList: '',
          securityQuestion: '',
          securityAnswer: '',
          provinceId: '',
          cityId: '',
          location: '',
          verifyFlag: '',
          lastLoginTime: '',
          latestLoginTime: '',
          onlineStatus: '',
          status: '',
          avatarUrl: '',
          userrole: [],
          deleteFlag: 0
        },
        fieldList: [],
        leftFieldList: [
          { label: '员工ID', value: 'id', type: 'tag', className: 'el-form-block' },
          { label: '员工编号', value: 'staffNo', type: 'tag', required: true, validator: checkLoginName, className: 'el-form-block' },
          { label: '昵称', value: 'nickName', type: 'input', required: true, validator: checkName, className: 'el-form-block' },
          { label: '真实姓名', value: 'staffName', type: 'input', required: true, validator: checkName, className: 'el-form-block' },
          { label: '性别', value: 'gender', type: 'customradio', key: 'itemValue', name: 'itemName', list: 'genderList', required: true, className: 'el-form-block', validator: checkGender, trigger: 'change' },
          { label: '手机号', value: 'phone', type: 'input', required: true, validator: checkPhone, className: 'el-form-block' },
          { label: '邮件', value: 'mail', type: 'input', className: 'el-form-block' },
          { label: '个性化签名', value: 'profile', type: 'input', className: 'el-form-block' },
          { label: '所属省', value: 'provinceId', type: 'customselect', list: 'provinceList', key: 'areaId', name: 'areaName', event: 'changeProvince', required: true, trigger: 'change', validator: checkProvinceNotZero, className: 'el-form-block' },
          { label: '所属市', value: 'cityId', type: 'customselect', list: 'cityList', key: 'areaId', name: 'areaName', required: true, validator: checkCityNotZero, trigger: 'change', className: 'el-form-block' },
          { label: '详细地址', value: 'location', type: 'input', className: 'el-form-block' }
        ],
        rightFieldList: [
          { label: '头像', value: 'avatarUrl', type: 'slot', className: 'el-form-block' },
          { label: '状态', value: 'status', type: 'tag', key: 'itemValue', name: 'itemName', list: 'staffStatusList', required: true, className: 'el-form-block' },
          { label: '在线状态', value: 'onlineStatus', type: 'tag', key: 'itemValue', name: 'itemName', list: 'staffOnlineStatusList', required: true, className: 'el-form-block' },
          { label: '最近登录时间', value: 'latestLoginTime', type: 'tag', className: 'el-form-block' },
          { label: '实名认证状态', value: 'verifyFlag', type: 'customradio', key: 'itemValue', name: 'itemName', list: 'verifyFlagList', required: true, className: 'el-form-block' },
          { label: '员工类型', value: 'staffType', type: 'customselect', key: 'itemValue', name: 'itemName', list: 'staffTypeList', required: true, validator: checkStaffType, trigger: 'change', className: 'el-form-block' },
          { label: '角色', value: 'role', type: 'slot', className: 'el-form-block' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      formInfo2: {
        ref: null,
        readOnly: false,
        data: {
          id: '',
          tagList: '',
          avatarUrl: '',
          idno: '',
          idFront: '',
          idBack: '',
          idValidTo: '',
          driverLicense: '',
          driverLicense1: '',
          driverLicense2: '',
          licenseValidTo: ''
        },
        fieldList: [],
        leftFieldList: [
          { label: '身份证号', value: 'idno', type: 'input', className: 'el-form-block' },
          { label: '身份证有效期', value: 'idValidTo', type: 'date', valueFormat: 'yyyy-MM-dd', className: 'el-form-block' },
          { label: '身份证正面', value: 'idFront', type: 'slot', className: 'el-form-block' },
          { label: '身份证反面', value: 'idBack', type: 'slot', className: 'el-form-block' }
        ],
        rightFieldList: [
          { label: '驾照号', value: 'driverLicense', type: 'input', className: 'el-form-block' },
          { label: '驾照有效期', value: 'licenseValidTo', type: 'date', valueFormat: 'yyyy-MM-dd', className: 'el-form-block' },
          { label: '驾照', value: 'driverLicense1', type: 'slot', className: 'el-form-block' }
        ],
        rules: {},
        labelWidth: '120px'
      },
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
      // 选择角色（检索条件）
      filterRole: {
        query: {
          roleName: '',
          moduleId: ''
        },
        list: [
          { type: 'input', label: '角色名称', value: 'roleName' },
          { type: 'select', label: '子系统', value: 'moduleId', list: 'subsystemList' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true }
        ]
      },
      // 选择销售地区
      dialogRole: {
        title: '选择角色',
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'closeDialogRole', show: true },
          { label: '选择', type: 'primary', icon: '', event: 'saveRole', saveLoading: false, show: true }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits',
      'userid'
    ]),
    nopicture() {
      return 'this.src="' + this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
    }
  },
  watch: {
    'formInfo1.data.status'(val) {
      this.initButtonList(val)
    },
    'dialogRole.visible'(val) {
      if (!val) {
        this.dialogRole.btLoading = false
        this.dialogRole.type = ''
      }
    },
    'dialogRole.type'(val) {
    }
  },
  created() {
    this.initList()
  },
  mounted() {
    // this.initList()
    // this.getUserInfo()
    this.initDataPermits()
    this.initRules()
  },
  methods: {
    initButtonList(status) {
      status = Number(status)
      console.log(status)
      if (status === 1) {
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'save', show: false },
          { type: 'button', label: '封号', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'lock', show: false },
          { type: 'button', label: '禁用', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'close', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false },
          { type: 'button', label: '重置密码', btType: 'warning', icon: 'el-icon-refresh', loading: 'resetLoading', event: 'resetpwd', show: false }
        ]
        this.formInfo1.readOnly = false
      } else if (status === 2 || status === 7) {
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'saveLoading', event: 'edit', show: false }
        ]
        this.formInfo1.readOnly = true
      } else {
        this.formInfo1.fieldList = []
        this.filterInfo.list = []
      }
      this.initDataPermits()
    },
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('staffDetail', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      this.formInfo1.rules = Object.assign(this.$initRules(this.formInfo1.leftFieldList), this.$initRules(this.formInfo1.rightFieldList))
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'STAFF_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.staffTypeList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'ONLINE_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.staffOnlineStatusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENDER_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.genderList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'STAFF_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.staffStatusList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'DELETE_FLAG' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.deleteFlagList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'VERIFY_FLAG' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.verifyFlagList = res.data
        }
      })
      this.getStaffInfo()
      // 角色
      this.getRoleList()
      // province列表
      const params = { level: 1 }
      this.$handleAPI('', getAreaList, params).then(res => {
        if (Number(res.code) === 200) {
          this.listTypeInfo.provinceList = res.data
        }
      })
    },
    getCityList(areaId) {
      const params = { parentId: areaId, level: 2 }
      this.$handleAPI('', getAreaList, params).then(res => {
        if (Number(res.code) === 200) {
          this.listTypeInfo.cityList = res.data
        }
      })
    },
    getStaffInfo() {
      // 获取员工信息
      const staffParams = { staffId: this.detailStaffId }
      this.$handleAPI('', getApi, staffParams).then(res => {
        if (Number(res.code) === 200) {
          // this.formInfo1.ref.resetFields()
          this.staffData = res.data
          this.getCityList(this.staffData.provinceId)
          this.formInfo1.data.id = res.data.id
          for (const key in res.data) {
            // 存在则赋值
            if (key in this.formInfo1.data) {
              this.formInfo1.data[key] = res.data[key] + ''
            }
            // 存在则赋值
            if (key in this.formInfo2.data) {
              this.formInfo2.data[key] = res.data[key] + ''
            }
          }
          this.formInfo1.data.provinceId = Number(this.formInfo1.data.provinceId)
          this.formInfo1.data.cityId = Number(this.formInfo1.data.cityId)
        }
      }).catch((error) => {
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          duration: 3500
        })
      })
      this.$handleAPI('', getStaffRoleList, staffParams).then(res => {
        if (Number(res.code) === 200) {
          for (const item of res.data) {
            this.formInfo1.data.userrole.push(item.roleId)
          }
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
    async handleClick(event, data, tableIndex = 0) {
      const dialogRole = this.dialogRole
      switch (event) {
        case 'save': {
          try {
            await Promise.all([
              this.formInfo1.leftRef.validate(),
              this.formInfo1.rightRef.validate()
            ])
          } catch (error) {
            this.$message.error('表单验证失败: ' + error)
            return
          }
          this.saveLoading = true
          // 组织参数
          const propsData = Object.assign(this.formInfo1.data, this.formInfo2.data)
          var pArr = []
          if (this.formInfo1.data.userrole.length > 0) {
            pArr = [updateApi(propsData), updateStaffRoleApi({ staffId: this.detailStaffId, roleIds: this.formInfo1.data.userrole })]
          } else {
            pArr = [updateApi(propsData)]
          }
          Promise.all(pArr).then(res => {
            let codeSum = 0
            for (const item of res) {
              codeSum += Number(item.code)
            }
            if (codeSum % 200 === 0) {
              this.getStaffInfo()
              this.$message.success('保存成功')
            } else {
              this.$message.error('更新失败')
            }
          }).catch(error => {
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        }
        case 'delete': {
          this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              id: this.detailStaffId,
              oldupdatetime: this.staffData.updateTime,
              updateBy: this.$store.state.staff.staffId,
              deleteFlag: 1
            }
            this.deleteLoading = true
            this.$handleAPI('', deleteApi, params).then(res => {
              this.deleteLoading = false
              if (Number(res.code) === 200) {
                this.$message.success('删除成功')
                this.$store.dispatch('tagsView/delView', this.$route)
                this.$router.push({ path: './index', query: { }, replace: true })
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
          }).catch((e) => {
          })
          break
        }
        case 'lock': {
          this.$confirm('确定要封号吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              id: this.detailStaffId,
              updateBy: this.$store.state.staff.staffId,
              status: 2
            }
            this.deleteLoading = true
            this.$handleAPI('', updateApi, params).then(res => {
              this.deleteLoading = false
              if (Number(res.code) === 200) {
                this.initList()
                this.$message.success('封号成功')
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
          }).catch((e) => {
          })
          break
        }
        case 'close': {
          this.$confirm('确定要禁用吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = {
              id: this.detailStaffId,
              updateBy: this.$store.state.staff.staffId,
              status: 7
            }
            this.deleteLoading = true
            this.$handleAPI('', updateApi, params).then(res => {
              this.deleteLoading = false
              if (Number(res.code) === 200) {
                this.initList()
                this.$message.success('禁用成功')
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
          }).catch((e) => {
          })
          break
        }
        case 'resetpwd': {
          if (this.staffData.staffNo === '') {
            this.$message({
              showClose: true,
              message: '还未保存的用户不能重置密码',
              type: 'error',
              duration: 3500
            })
          } else {
            this.$confirm('确定要重置密码吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              const params = {
                staffId: this.detailStaffId
              }
              this.resetLoading = true
              this.$handleAPI('', resetPwdApi, params).then(res => {
                this.resetLoading = false
                if (Number(res.code) === 200) {
                  this.$message.success('重置密码成功')
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
            }).catch((e) => {
            })
          }
          break
        }
        case 'addrole': {
          dialogRole.type = event
          dialogRole.visible = true
          const params = { status: 1 }
          this.listLoading = true
          this.$handleAPI('', getListApi, params).then(res => {
            if (Number(res.code) === 200) {
              this.dailogRoleList = res.data
            } else {
              this.$message.error(res.message)
            }
            this.listLoading = false
          })
          break
        }
        case 'search': {
          this.listLoading = true
          const params = { roleName: this.filterRole.query.rolename, moduleId: this.filterRole.query.moduleId, status: 1 }
          this.$handleAPI('', getListApi, params).then(res => {
            if (Number(res.code) === 200) {
              this.dailogRoleList = res.data
            } else {
              this.$message.error(res.message)
            }
            this.listLoading = false
          })
          break
        }
        case 'closeDialogRole':
          // 弹窗点击关闭
          dialogRole.visible = false
          break
        case 'saveRole':
          this.roleListSelection.forEach((v) => {
            this.formInfo1.data.userrole.push(v.roleId)
          })
          var qcarr = []
          this.formInfo1.data.userrole.forEach((item, index) => {
            qcarr.indexOf(parseInt(item)) === -1 ? qcarr.push(parseInt(item)) : ''
          })
          this.formInfo1.data.userrole = qcarr
          dialogRole.visible = false
          break
        case 'uploadAvatar': // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        case 'uploadIdFront': // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        case 'uploadIdBack': // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        case 'uploadDriverLicense1': // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        case 'uploadDriverLicense2': // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        case 'closeUpload':
          // 图片上传弹窗点击关闭
          this.dialogUpload.visible = false
          this.dialogUpload.type = ''
          break
      }
    },
    handleEvent(event, data) {
      switch (event) {
        case 'changeProvince': {
          this.formInfo1.data.cityId = ''
          this.getCityList(this.formInfo1.data.provinceId)
          break
        }
        case 'upload': {
          if (data.code !== 200) return
          if (this.dialogUpload.type === 'uploadAvatar') {
            this.formInfo2.data.avatarUrl = data.fileList[0].relativeUrl
          } else if (this.dialogUpload.type === 'uploadIdFront') {
            this.formInfo2.data.idFront = data.fileList[0].relativeUrl
          } else if (this.dialogUpload.type === 'uploadIdBack') {
            this.formInfo2.data.idBack = data.fileList[0].relativeUrl
          } else if (this.dialogUpload.type === 'uploadDriverLicense1') {
            this.formInfo2.data.driverLicense1 = data.fileList[0].relativeUrl
          } else if (this.dialogUpload.type === 'uploadDriverLicense2') {
            this.formInfo2.data.driverLicense2 = data.fileList[0].relativeUrl
          }
          // 关闭弹窗
          this.handleClick('closeUpload')
          break
        }
      }
    },
    handleClose(event, data) {
      switch (event) {
        case 'closeRole': {
          this.formInfo1.data.userrole.splice(this.formInfo1.data.userrole.indexOf(data), 1)
          break
        }
      }
    },
    getRoleNm(roleId) {
      var name = ''
      try {
        this.listTypeInfo.roleList.forEach((v) => {
          if (parseInt(roleId) === parseInt(v.roleId)) {
            name = v.moduleName + ' - ' + v.roleName
            throw Error()
          }
        })
      } catch (e) {
        // continue regardless of error
      }
      return name
    },
    getRoleList() { // 取得角色
      const params = { status: 1 }
      this.$handleAPI('', getListApi, params).then(res => {
        if (Number(res.code) === 200) {
          this.listTypeInfo.roleList = res.data
        }
      })
    },
    handleRoleListSelectionChange(val) {
      this.roleListSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .filter-item-right {
    float: right;
  }
  .filter-button {
    display: inline-flex;
    align-items: center;
    margin-bottom: 5px;
    margin-right: 5px;
  }
  .input-number input {
    text-align: right;
  }
  .slot-avatar{
    height: 100px !important;
    display: flex;
    align-items: center;
    img{
      padding-right: 10px;
    }
    .el-button {
      margin-left: 10px;
    }
  }
  .slot-role{
    display: flex;
    align-items: center;
    .el-button {
      margin-left: 10px;
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
  .input-btn {
    background: #3a8ee6;
    border-color: #3a8ee6;
    color: #FFF;
  }

</style>
