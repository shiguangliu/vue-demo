<template>
  <div class="tab-container">
    <el-row>
      <el-col v-show="formInfo1.data.status === '1' || formInfo1.data.status === '3'" :span="24" align="left">
        <el-button v-if="dataPermits.includes('merchantDetail:submit')" class="filter-item" type="primary" size="small" icon="el-icon-check" @click="handleClick('submit')">
          提交
        </el-button>
      </el-col>
      <el-col v-show="formInfo1.data.status === '5'" :span="24" align="left">
        <el-button v-if="dataPermits.includes('merchantDetail:edit')" class="filter-item" type="primary" size="small" icon="el-icon-edit" @click="handleClick('edit')">
          编辑
        </el-button>
      </el-col>
      <el-col v-show="formInfo1.data.status === '2'" :span="24" align="left">
        <el-button v-if="dataPermits.includes('merchantDetail:edit')" class="filter-item" type="primary" size="small" icon="el-icon-edit" @click="handleClick('edit')">
          编辑
        </el-button>
        <el-button v-if="dataPermits.includes('merchantDetail:approveOK')" class="filter-item" type="primary" size="small" icon="el-icon-check" @click="handleClick('approve')">
          审批通过
        </el-button>
        <el-button v-if="dataPermits.includes('merchantDetail:approveNG')" class="filter-item" type="danger" size="small" icon="el-icon-delete" @click="handleClick('reject')">
          审批拒绝
        </el-button>
      </el-col>
    </el-row>
    <br>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="商户基本信息" name="tab1">
        <el-row>
          <el-col :span="12">
            <page-form
              :ref-obj.sync="formInfo1.ref"
              :data="formInfo1.data"
              :field-list="formInfo1.fieldList"
              :rules="formInfo1.rules"
              :read-only="formInfo1.readOnly"
              :label-width="formInfo1.labelWidth"
              :list-type-info="listTypeInfo"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            >
              <!-- 自定义插槽-选择图片 -->
              <template v-slot:form-bannerUrl>
                <div class="slot-avatar">
                  <img
                    v-imgAlart
                    :fit="'cover'"
                    :src="$TH.FILE_URLS.static_url + formInfo1.data.bannerUrl"
                    style="height: 60px;"
                    :onerror="nopicture"
                  >
                  <el-button
                    v-show="formInfo1.data.status === '1' || formInfo1.data.status === '3'"
                    v-waves
                    type="primary"
                    icon="el-icon-picture"
                    size="mini"
                    @click="handleClick('uploadFileBannerUrl')"
                  >
                    {{ formInfo1.data.bannerUrl ? '更换图片' : '选择图片' }}
                  </el-button>
                </div>
              </template>
              <template v-slot:form-logoUrl>
                <div class="slot-avatar">
                  <img
                    v-imgAlart
                    :fit="'cover'"
                    :src="$TH.FILE_URLS.static_url + formInfo1.data.logoUrl"
                    style="height: 60px;"
                    :onerror="nopicture"
                  >
                  <el-button
                    v-show="formInfo1.data.status === '1' || formInfo1.data.status === '3'"
                    v-waves
                    type="primary"
                    icon="el-icon-picture"
                    size="mini"
                    @click="handleClick('uploadFileLogoUrl')"
                  >
                    {{ formInfo1.data.logoUrl ? '更换图片' : '选择图片' }}
                  </el-button>
                </div>
              </template>
            </page-form>
          </el-col>
          <el-col :span="12">
            <page-form
              :ref-obj.sync="formInfo1.fieldList2Ref"
              :data="formInfo1.data"
              :field-list="formInfo1.fieldList2"
              :rules="formInfo1.fieldList2Rules"
              :read-only="formInfo1.readOnly"
              :label-width="formInfo1.labelWidth"
              :list-type-info="listTypeInfo"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
          </el-col>
        </el-row>
        <div class="form-merchant-container">
          <page-dialog
            :title="dialogUpload.title[dialogUpload.type]"
            :visible.sync="dialogUpload.type === 'uploadFileBannerUrl' && dialogUpload.visible"
            :width="dialogUpload.width"
            :bt-loading="dialogUpload.btLoading"
            :bt-list="dialogUpload.btList"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <!-- 图片上传组件 -->
            <Upload
              v-if="dialogUpload.type === 'uploadFileBannerUrl' && dialogUpload.visible"
              :upload-data="{targetPath: 'sys-tag',autoname: '1'}"
              @handleEvent="handleEvent"
            />
          </page-dialog>
          <page-dialog
            :title="dialogUpload.title[dialogUpload.type]"
            :visible.sync="dialogUpload.type === 'uploadFileLogoUrl' && dialogUpload.visible"
            :width="dialogUpload.width"
            :bt-loading="dialogUpload.btLoading"
            :bt-list="dialogUpload.btList"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <!-- 图片上传组件 -->
            <Upload
              v-if="dialogUpload.type === 'uploadFileLogoUrl' && dialogUpload.visible"
              :upload-data="{targetPath: 'sys-tag',autoname: '1'}"
              @handleEvent="handleEvent"
            />
          </page-dialog>
          <!-- button -->
          <el-row v-show="formInfo1.data.status === '1' || formInfo1.data.status === '3'">
            <el-col :span="24" align="right">
              <el-button v-if="dataPermits.includes('merchantDetail:save')" type="primary" size="small" @click="handleClick('saveForm1')">
                保存修改
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="结算开票信息" name="tab2">
        <div class="form-merchant-container">
          <!-- page form 2 -->
          <page-form
            :ref-obj.sync="formInfo2.ref"
            :data="formInfo2.data"
            :field-list="formInfo2.fieldList"
            :rules="formInfo2.rules"
            :label-width="formInfo2.labelWidth"
            :read-only="formInfo2.readOnly"
            :list-type-info="listTypeInfo"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
          <!-- button -->
          <el-row v-show="formInfo1.data.status === '1' || formInfo1.data.status === '3'">
            <el-col :span="24" align="right">
              <el-button v-if="dataPermits.includes('merchantDetail:save')" type="primary" size="small" @click="handleClick('saveForm2')">
                保存修改
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="资质认证材料" name="tab3">
        <div class="form-merchant-container">
          <!-- button -->
          <el-row v-show="formInfo1.data.status === '1' || formInfo1.data.status === '3'">
            <el-col :span="24" align="right">
              <el-button v-if="dataPermits.includes('merchantDetail:save')" type="primary" size="medium" @click="handleClick('uploadFile')">
                上传资料
              </el-button>
            </el-col>
          </el-row>
          <br>
          <el-row
            :data="materiallist"
          >
            <el-col v-for="(item) in materiallist" :key="item.id" :span="3" style="padding: 5px;">
              <el-card :body-style="{ padding: '0px'}">
                <div class="imgdiv">
                  <img
                    v-imgAlart
                    :src="$TH.FILE_URLS.static_url + item.fileLink"
                    class="image"
                    :onerror="nopicture"
                  >
                </div>
                <div style="margin: 14px;">
                  <span>{{ item.filename }}</span>
                  <el-tooltip v-show="formInfo1.data.status === '1' || formInfo1.data.status === '3'" effect="dark" content="删除资料" placement="bottom">
                    <i v-if="dataPermits.includes('merchantDetail:delete')" class="el-icon-delete" style="color: #F56C6C; float:right; cursor: pointer;" @click="handleClick('deleteMaterial',item)" />
                  </el-tooltip>
                  <!-- <el-button type="danger" class="el-icon-delete" size="mini" @click="handleClick('deleteMaterial',item)" style="float:right;"> 删除</el-button> -->
                </div>
              </el-card>
            </el-col>
          </el-row>
          <!-- <img
            :src="$TH.FILE_URLS.static_url + formInfo1.data.iconurl"
            style="height: 30px;"
            :onerror="nopicture"
          > -->
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
              :upload-data="{targetPath: 'merchant/' + formInfo1.data.id, autoname: '1'}"
              @handleEvent="handleEvent"
            />
          </page-dialog>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { fetchAreaList } from '@/api/system/area'
import {
  getApi, updateApi, fetchMerchantUserList,
  updateMerchantUser, deleteMerchantUser, getMaterialList, insertMaterial, deleteMaterial
} from '@/api/merchant/merchant'
import { getConfigItemsListApi, cityOptionsList } from '@/api/common'
// import { updateUser } from '@/api/user'
import ThConsts from '@/constants' /* constant */
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import Upload from '@/components/Upload'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageForm,
    PageDialog,
    Upload
  },
  data() {
    // 检测phone
    const checkPhone = (rule, value, callback) => {
      var msg = ''
      if (value !== undefined && value !== null && value !== '') {
        const check = this.$validate({ label: '联系手机', value, rules: ['phone'], conditions: [] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      } else {
        msg = '请输入手机号码'
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    const checkTelePhone = (rule, value, callback) => {
      const check = this.$validate({ label: '联系手机', value, rules: ['phone'], conditions: [] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测email
    const checkEmail = (rule, value, callback) => {
      const check = this.$validate({ label: '联系邮箱', value, rules: ['email'], conditions: [] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 检测证件号
    const checkIdno = (rule, value, callback) => {
      var msg = ''
      if (value !== undefined && value !== null && value !== '') {
        const check = this.$validate({ label: '证件号', value, rules: ['idno'], conditions: [] })
        if (!check.result) {
          callback(new Error(check.message))
        } else {
          callback()
        }
      } else {
        msg = '请输入证件号码'
      }
      if (msg === '') {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
    // 检测邮编
    const checkZipcode = (rule, value, callback) => {
      const check = this.$validate({ label: '邮编', value, rules: ['notnull', 'number', 'length'], conditions: [6, 6] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      // fetchAreaList,
      getApi,
      updateApi,
      activeName: 'tab1',
      materiallist: [],
      listTypeInfo: {
        statusList: [],
        provinceList: [],
        cityList: [],
        districtList: []
      },
      // 表单相关（追加、修改）
      formInfo1: {
        ref: null,
        fieldList2Ref: null,
        readOnly: true,
        data: {
          id: '', // *唯一ID
          merchantNo: '', // *商户编号
          merchantName: '', // *商户全称
          shortName: '', // *商户简称
          linkman: '', // 联系人
          phone: '', // 联系手机
          provinceId: undefined, // *所属区域(省市)ID
          cityId: undefined, // *所属城市ID
          districtId: undefined, // *所属区县ID
          legalPerson: '', // 公司法人
          legalPersonIdno: '', // 公司法人证件号
          corpRegdate: '', // 公司注册日期
          address: '', // 注册地址
          telno: '', // 注册电话
          email: '', // email
          portalUrl: '', // 企业门户网站
          status: '', // *状态: 1：编辑中(默认为1)
          // TODO 开通权限
          deleteFlag: '0', // *删除标志
          updateBy: '',
          description: '',
          bannerUrl: '',
          logoUrl: '',
          approveBy: '',
          applyBy: '',
          updateTime: '' // 更新时间
          // updateuserid: '' // *当前用户ID'
        },
        fieldList: [
          { label: '商户ID', value: 'id', type: 'tag', required: true, disabled: true, className: 'el-form-block-30' },
          { label: '商户编码', value: 'merchantNo', type: 'tag', required: true, disabled: true, className: 'el-form-block-50' },
          { label: '商户全称', value: 'merchantName', type: 'input', required: true, maxlength: 200, className: 'el-form-block-80' },
          { label: '商户简称', value: 'shortName', type: 'input', required: true, maxlength: 100, className: 'el-form-block-50' },
          { label: '商户简介', value: 'description', type: 'textarea', required: true, maxlength: 200, className: 'el-form-block-80' },
          { label: '所属省份', value: 'provinceId', type: 'customselect', list: 'provinceList', key: 'areaId', name: 'areaName', event: 'changeProvince', required: true, className: 'el-form-block-50' },
          { label: '所属城市', value: 'cityId', type: 'customselect', list: 'cityList', key: 'areaId', name: 'areaName', event: 'changeCity', required: true, className: 'el-form-block-50' },
          { label: '所属区县', value: 'districtId', type: 'customselect', list: 'districtList', key: 'areaId', name: 'areaName', required: true, className: 'el-form-block-50' },
          { label: '商户banner图片', value: 'bannerUrl', type: 'slot', className: 'el-form-block' },
          { label: 'Logo图标', value: 'logoUrl', type: 'slot', className: 'el-form-block' }
        ],
        fieldList2: [
          { label: '联系人', value: 'linkman', type: 'input', required: true, className: 'el-form-block-50' },
          { label: '联系手机', value: 'phone', type: 'input', required: true, validator: checkPhone, className: 'el-form-block-50' },
          { label: '法人', value: 'legalPerson', type: 'input', required: true, maxlength: 50, className: 'el-form-block-50' },
          { label: '法人证件号', value: 'legalPersonIdno', type: 'input', required: true, validator: checkIdno, className: 'el-form-block-50' },
          { label: '商户详细地址', value: 'address', type: 'input', required: true, maxlength: 200, className: 'el-form-block-80' },
          { label: '注册日期', value: 'corpRegdate', type: 'date', required: true, className: 'el-form-block-50' },
          { label: '注册电话', value: 'telno', type: 'input', required: false, validator: checkTelePhone, className: 'el-form-block-50' },
          { label: '邮箱', value: 'email', type: 'input', required: false, validator: checkEmail, className: 'el-form-block-50' },
          { label: '企业官网', value: 'portalUrl', type: 'input', required: false, maxlength: 256, className: 'el-form-block-50' },
          // TODO 开通权限
          { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', required: true, className: 'el-form-block-30' }
        ],
        rules: {},
        fieldList2Rules: {},
        labelWidth: '120px'
      },
      // 表单相关（追加、修改）
      formInfo2: {
        ref: null,
        readOnly: true,
        data: {
          id: '',
          creditCode: '', // 企业统一信用代码
          taxno: '', // 企业税号
          bank: '', // 企业银行名称
          account: '', // 企业银行账号
          invoiceReceiver: '', // *发票接收人
          invoicePhone: '', // *发票接收人手机号
          invoiceZipCode: '', // *发票寄送邮编
          invoiceAddress: '', // *发票寄送地址
          // adminuserid: '', // *管理员用户ID(平台会员)
          status: '', // *状态: 1：编辑中(默认为1)
          deleteFlag: '0' // *删除标志
          // updateuserid: '' // *当前用户ID'
        },
        fieldList: [
          { label: '统一信用代码', value: 'creditCode', type: 'input', required: true, maxlength: 30, className: 'el-form-block-30' },
          { label: '企业税号', value: 'taxno', type: 'input', required: true, maxlength: 100, className: 'el-form-block-30' },
          { label: '发票开户银行', value: 'bank', type: 'input', required: true, maxlength: 200, className: 'el-form-block-30' },
          { label: '发票银行账号', value: 'account', type: 'input', required: true, maxlength: 100, className: 'el-form-block-30' },
          { label: '发票接收人', value: 'invoiceReceiver', type: 'input', required: true, maxlength: 100, className: 'el-form-block-20' },
          { label: '发票接收人手机', value: 'invoicePhone', type: 'input', required: true, validator: checkPhone, className: 'el-form-block-20' },
          { label: '发票寄送地址', value: 'invoiceAddress', type: 'input', required: true, maxlength: 200, className: 'el-form-block-40' },
          { label: '发票寄送邮编', value: 'invoiceZipCode', type: 'input', required: true, validator: checkZipcode, className: 'el-form-block-20' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 表单相关（追加、修改）
      // formInfo4: {
      //   ref: null,
      //   data: {
      //     adminuserid: '', // *管理员账号ID
      //     adminloginname: '', // *管理员账号
      //     adminusernm: '', // *管理员真实姓名
      //     // adminpwd: '', // *密码
      //     // confirmpwd: '', // *确认密码
      //     adminphone: '', // 联系手机
      //     adminemail: '', // *email
      //     deleteFlag: '0', // *删除标志
      //     adminuptime: '' // 更新时间
      //     // updateuserid: '' // *当前用户ID',
      //   },
      //   fieldList: [
      //     { label: '管理员ID', value: 'adminuserid', type: 'input', required: false, disabled: true },
      //     { label: '管理员账号', value: 'adminloginname', type: 'input', required: true },
      //     { label: '管理员真实姓名', value: 'adminusernm', type: 'input', required: true },
      //     { label: '联系手机', value: 'adminphone', type: 'input', required: true, validator: checkPhone },
      //     { label: '邮箱', value: 'adminemail', type: 'input', required: false, validator: checkEmail }
      //   ],
      //   rules: {},
      //   labelWidth: '120px'
      // },
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

      userlist: [],
      merchantuserlist: [],
      userListSelection: null,
      merchantUserListSelection: null,
      dialogFormVisible: false,
      listLoading: false,
      listQuery: {
        id: 0,
        usernm: undefined,
        userphone: undefined,
        employeeno: undefined,
        usertype: undefined,
        hasuser: 0
      },
      temp: {
        userid: undefined,
        employeeno: '',
        usernm: '',
        usertype: '',
        isvalid: ''
      },
      isvalidOptions: ThConsts.ISVALID,
      usertypeOptions: ThConsts.STORE_USERTYPE,
      thUsertypeOptions: ThConsts.TH_USERTYPE,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建&设置角色'
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
    // TODO
  },
  created() {
    this.listQuery.id = this.$route.query.id
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
      // 画面控制
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo1.ref) {
        this.formInfo1.ref.resetFields()
      }
      if (this.formInfo2.ref) {
        this.formInfo2.ref.resetFields()
      }
      // 下拉框需要初始化加载的列表数据
      const params = {
        'configType': 'APPROVE_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          console.log(res.data)
          this.listTypeInfo.statusList = res.data
        }
      })
      // 省列表
      const param = { 'level': 1, 'status': 1 }
      this.$handleAPI('', cityOptionsList, param).then(res => {
        if (res.code === 200) {
          console.log(res.data)
          this.listTypeInfo.provinceList = res.data
        }
      })
      // 获取url参数
      this.formInfo1.data.id = this.$route.query.id
      // 获取merchant详细
      const mparam = { 'id': this.formInfo1.data.id }
      this.$handleAPI('', getApi, mparam).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          console.log(res.data)
          const data = res.data
          if (data.provinceId === 0) {
            data.provinceId = ''
          }
          if (data.cityId === 0) {
            data.cityId = ''
          }
          if (data.districtId === 0) {
            data.districtId = ''
          }
          data.status += ''
          if (data.status === '1' || data.status === '3') {
            this.formInfo1.readOnly = false
            this.formInfo2.readOnly = false
          }
          // 显示信息
          for (const key in res.data) {
            // 存在则赋值
            if (key in this.formInfo1.data) {
              this.formInfo1.data[key] = data[key]
            }
            // 存在则赋值
            if (key in this.formInfo2.data) {
              this.formInfo2.data[key] = data[key]
            }
          }
          // 初始化select选择框
          this.handleEvent('changeProvince', null)
          this.handleEvent('changeCity', null)
        }
      })
      const paramsImg = {
        'merchantId': this.$route.query.id
      }
      this.$handleAPI('', getMaterialList, paramsImg).then(res => {
        if (res.code === 200) {
          console.log(res)
          // 初始化材料列表
          this.materiallist = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo1.rules = this.$initRules(this.formInfo1.fieldList)
      this.formInfo1.fieldList2Rules = this.$initRules(this.formInfo1.fieldList2)
      this.formInfo2.rules = this.$initRules(this.formInfo2.fieldList)
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'submit': {
          // 验证flag
          var flag = true
          this.formInfo1.ref.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          this.formInfo2.ref.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          if (flag === true) {
            // 合并form对象
            const merchantData = Object.assign({}, this.formInfo1.data, this.formInfo2.data)
            merchantData.status = '2'
            merchantData.updateBy = this.$store.state.staff.staffId
            merchantData.applyBy = this.$store.state.staff.staffId
            this.$handleAPI('', updateApi, merchantData).then(res => {
              if (res.code === 200) {
                this.formInfo1.data.status = '2'
                this.formInfo2.data.status = '2'
                this.formInfo1.readOnly = true
                this.formInfo2.readOnly = true
              }
              this.$message({
                showClose: true,
                message: (res.code === 200) ? '已提交' : res.message,
                type: (res.code === 200) ? 'success' : 'error',
                duration: 3500
              })
            })
          } else {
            this.$message({
              showClose: true,
              message: '请检查所有必输项目',
              type: 'error',
              duration: 3500
            })
          }
          break
        }
        case 'edit': {
          const props = { 'id': this.formInfo1.data.id, 'status': 1 }
          this.$handleAPI('', updateApi, props).then(res => {
            if (res.code === 200) {
              this.formInfo1.data.status = '1'
              this.formInfo1.readOnly = false
              this.formInfo2.readOnly = false
            }
            this.$message({
              showClose: true,
              message: (res.code === 200) ? '已可编辑' : res.message,
              type: (res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          })
          break
        }
        case 'approve': {
          const props = {
            'id': this.formInfo1.data.id,
            'status': 5,
            'approveBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', updateApi, props).then(res => {
            if (res.code === 200) {
              this.formInfo1.data.status = '5'
            }
            this.$message({
              showClose: true,
              message: (res.code === 200) ? '已通过' : res.message,
              type: (res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          })
          break
        }
        case 'reject': {
          const props = {
            'id': this.formInfo1.data.id,
            'status': 3,
            'approveBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', updateApi, props).then(res => {
            if (res.code === 200) {
              this.formInfo1.data.status = '3'
              this.formInfo1.readOnly = false
              this.formInfo2.readOnly = false
            }
            this.$message({
              showClose: true,
              message: (res.code === 200) ? '已驳回' : res.message,
              type: (res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          })
          break
        }
        case 'saveForm1': {
          var falg = false
          var flagTwo = false
          this.formInfo1.ref.validate(valid => {
            if (valid) {
              falg = true
            }
          })
          this.formInfo1.fieldList2Ref.validate(valid => {
            if (valid) {
              flagTwo = true
            }
          })
          if (falg && flagTwo) {
            this.formInfo1.data.oldupdatetime = this.formInfo1.data.updatetime
            this.$handleAPI('', updateApi, this.formInfo1.data).then(res => {
              this.$message({
                showClose: true,
                message: (res.code === 200) ? '保存成功' : res.message,
                type: (res.code === 200) ? 'success' : 'error',
                duration: 3500
              })
            })
          }
          break
        }
        case 'saveForm2': {
          this.formInfo2.ref.validate(valid => {
            if (valid) {
              this.formInfo2.data.id = this.formInfo1.data.id
              this.$handleAPI('', updateApi, this.formInfo2.data).then(res => {
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
        case 'uploadFile':
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        case 'uploadFileBannerUrl':
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        case 'uploadFileLogoUrl':
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        case 'closeUpload':
          // 图片上传弹窗点击关闭
          this.dialogUpload.visible = false
          break
        // }
        case 'deleteMaterial': {
          console.log(data)
          const params = {
            id: data.id
          }
          this.$handleAPI('delete', deleteMaterial, params).then(res => {
            if (res.code === 200) {
              // 数组剔除当前seqid
              const index = this.materiallist.indexOf(data)
              this.materiallist.splice(index, 1)
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
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'changeProvince': {
          this.listTypeInfo.cityList = []
          this.listTypeInfo.districtList = []
          if (this.formInfo1.data.provinceId !== 0) {
            if (data !== null) {
              this.formInfo1.data.cityId = undefined
              this.formInfo1.data.districtId = undefined
            }
            const parentId = this.formInfo1.data.provinceId
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
          if (this.formInfo1.data.cityId !== 0) {
            if (data !== null) {
              this.formInfo1.data.districtId = undefined
            }
            const cityId = this.formInfo1.data.cityId
            const params = { 'level': 3, 'parentId': cityId }
            this.$handleAPI('', cityOptionsList, params).then(res => {
              if (res.code === 200) {
                this.listTypeInfo.districtList = res.data
              }
            })
          }
          break
        }
        case 'upload': { // 上传成功，绑定图片链接到id
          console.log(this.dialogUpload)
          if (this.dialogUpload.type === 'uploadFile') {
            if (data.code === 200) {
              const temp = data.fileList
              console.log(temp)
              temp.forEach(item => {
                const params = {
                  'merchantId': this.$route.query.id,
                  'fileLink': item.relativeUrl,
                  'materialType': 99,
                  'fileType': 1,
                  'createBy': this.$store.state.staff.staffId
                }
                this.$handleAPI('', insertMaterial, params).then(res => {
                  if (res.code === 200) {
                    // 异步合并数组文件文件列表
                    // 遍历temp push
                    this.materiallist.push(res.data)
                  }
                }).catch((error) => {
                  this.$message({
                    showClose: true,
                    message: error,
                    type: 'error',
                    duration: 3500
                  })
                })
              })
            }
          }
          if (this.dialogUpload.type === 'uploadFileBannerUrl') {
            if (data.code === 200) {
              const temp = data.fileList
              temp.forEach(item => {
                const params = {
                  'id': this.formInfo1.data.id,
                  'bannerUrl': item.relativeUrl,
                  'createBy': this.$store.state.staff.staffId
                }
                this.$handleAPI('', updateApi, params).then(res => {
                  if (res.code === 200) {
                    this.formInfo1.data.bannerUrl = item.relativeUrl
                  }
                }).catch((error) => {
                  this.$message({
                    showClose: true,
                    message: error,
                    type: 'error',
                    duration: 3500
                  })
                })
              })
            }
          }
          if (this.dialogUpload.type === 'uploadFileLogoUrl') {
            if (data.code === 200) {
              const temp = data.fileList
              temp.forEach(item => {
                const params = {
                  'id': this.formInfo1.data.id,
                  'logoUrl': item.relativeUrl,
                  'createBy': this.$store.state.staff.staffId
                }
                this.$handleAPI('', updateApi, params).then(res => {
                  if (res.code === 200) {
                    this.formInfo1.data.logoUrl = item.relativeUrl
                  }
                }).catch((error) => {
                  this.$message({
                    showClose: true,
                    message: error,
                    type: 'error',
                    duration: 3500
                  })
                })
              })
            }
          }
          // 关闭弹窗
          this.handleClick('closeUpload')
          break
        }
      }
    },

    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getUserList()
    },
    resetTemp() {
      this.temp = {
        userid: undefined,
        employeeno: '',
        usernm: '',
        usertype: '',
        isvalid: ''
      }
    },
    getUserList() {
      this.listLoading = true
      // console.log(this.listQuery)
      fetchMerchantUserList(this.listQuery).then(res => {
        this.userlist = res.data.userlist
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleMaxDelete() {
      this.$confirm('确定要批量删除员工？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var stat = '0'
        this.merchantUserListSelection.forEach((v) => {
          v.id = this.formInfo1.data.id
          deleteMerchantUser(v).then(response => {
            stat = response.stat
            if (response.stat === '0') {
              const index = this.merchantuserlist.indexOf(v)
              this.merchantuserlist.splice(index, 1)
            } else {
              this.$message({
                showClose: true,
                message: response.message,
                type: 'error',
                duration: 3500
              })
            }
          })
          if (stat === '0') {
            this.$message.success('删除成功')
          }
        })
      }).catch(() => {
        // reject(error)
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleMerchantUserListSelectionChange(val) {
      this.merchantUserListSelection = val
    },
    handleRowUpdate(row, flag = false) {
      row.id = this.formInfo1.data.id
      if (flag === 'update') {
        console.log(row)
        updateMerchantUser(row).then(response => {
          if (response.stat === '0') {
            this.$message.success('更新成功')
          } else {
            this.$message({
              showClose: true,
              message: response.message,
              type: 'error',
              duration: 3500
            })
          }
        })
      } else if (flag === 'delete') {
        this.$confirm('确定要删除员工【ID：' + row.userid + '】 ？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMerchantUser(row).then(response => {
            if (response.stat === '0') {
              const index = this.merchantuserlist.indexOf(row)
              this.merchantuserlist.splice(index, 1)
              this.$message.success('删除成功')
            } else {
              this.$message({
                showClose: true,
                message: response.message,
                type: 'error',
                duration: 3500
              })
            }
          })
        }).catch(() => {
          // reject(error)
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    handleFilter() {
      this.getUserList()
    },
    handleUserListSelectionChange(val) {
      this.userListSelection = val
      console.log(this.userListSelection)
    },
    createData() {
      var allSetList = []
      var maxseqid = 0
      if (this.merchantuserlist.length > 0) {
        maxseqid = this.merchantuserlist[this.merchantuserlist.length - 1].seqid
      }
      this.userListSelection.forEach((v) => {
        maxseqid = Number(maxseqid) + 1
        v.seqid = maxseqid
        v.isvalid = '1'
        v.usertype = v.usertype + ''
      })
      if (this.merchantuserlist.length > 0) {
        allSetList = allSetList.concat(this.merchantuserlist, this.userListSelection)
      } else {
        allSetList = allSetList.concat(this.userListSelection)
      }

      const upuserlistdata = {
        'id': this.formInfo1.data.id,
        'userlist': allSetList
      }
      updateApi(upuserlistdata).then(response => {
        if (response.stat === '0') {
          this.dialogFormVisible = false
          this.merchantuserlist = allSetList
          this.$message.success('添加成功')
        }
      })
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
  .slot-avatar {
    height: 60px;
    display: flex;
    align-items: center;
    img {
      padding-right: 10px;
    }
  }
</style>
