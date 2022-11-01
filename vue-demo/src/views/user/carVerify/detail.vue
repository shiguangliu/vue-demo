<template>
  <div class="tab-container">
    <el-row>
      <el-col v-show="formInfo1.data.status === 1" :span="24" align="left">
        <el-button v-if="dataPermits.includes('userCarVerifyDetail:approveOK')" class="filter-item" type="primary" size="small" icon="el-icon-check" @click="handleClick('authenticationOK')">
          审批通过
        </el-button>
        <el-button v-if="dataPermits.includes('userCarVerifyDetail:approveNG')" class="filter-item" type="danger" size="small" icon="el-icon-close" @click="handleClick('authenticationNG')">
          审批拒绝
        </el-button>
      </el-col>
    </el-row>
    <br>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="车辆认证信息" name="tab1">
        <div class="form-merchant-container">
          <!-- page form 1 -->
          <page-form
            :ref-obj.sync="formInfo1.ref"
            :data="formInfo1.data"
            :field-list="formInfo1.fieldList"
            :rules="formInfo1.rules"
            :label-width="formInfo1.labelWidth"
            :list-type-info="listTypeInfo"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          >
            <!-- 自定义插槽-选择图片 -->
            <template v-slot:form-carLicenseUrl>
              <div class="slot-avatar">
                <img
                  v-imgAlart
                  :fit="'cover'"
                  :src="$TH.FILE_URLS.static_url + formInfo1.data.carLicenseUrl"
                  style="height: 60px;"
                  :onerror="nopicture"
                >
              </div>
            </template>
            <template v-slot:form-driverLicense1>
              <div class="slot-avatar">
                <img
                  v-imgAlart
                  :fit="'cover'"
                  :src="$TH.FILE_URLS.static_url + formInfo1.data.driverLicense1"
                  style="height: 60px;"
                  :onerror="nopicture"
                >
              </div>
            </template>
            <template v-slot:form-driverLicense2>
              <div class="slot-avatar">
                <img
                  v-imgAlart
                  :src="$TH.FILE_URLS.static_url + formInfo1.data.driverLicense2"
                  style="height: 50px; width: 50px;"
                  :onerror="nopicture"
                >
              </div>
            </template>
          </page-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="审核理由" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="请填写理由" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleClick(form.btn)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApi, updateAuthentication } from '@/api/user/carVerify/index'
import PageForm from '@/components/PageForm'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageForm
  },
  data() {
    return {
      dialogFormVisible: false,
      // fetchAreaList,
      getApi,
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
        refresh: 1,
        ref: null,
        data: {
          id: '', // *唯一ID
          userName: '', // *用户名称
          brandName: '', // *车辆品牌
          seriesName: '', // *车辆系列
          plateNo: '', // 车牌号
          carLicenseUrl: '', // 车辆行驶证照片
          driverLicense1: '', // 驾照正面照
          driverLicense2: '', // 驾照副页照
          approveTime: '', // 审批时间
          approveName: '', // 审批人
          approveReason: '', // 审批理由
          defaultName: '', // 默认车辆
          statusName: '', // 状态
          status: ''
        },
        fieldList: [
          { label: '认证ID', value: 'id', type: 'tag', disabled: true, className: 'el-form-block-20' },
          { label: '用户名称', value: 'userName', type: 'tag', disabled: true, className: 'el-form-block-20' },
          { label: '车辆品牌', value: 'brandName', type: 'tag', disabled: true, className: 'el-form-block-20' },
          { label: '车辆系列', value: 'seriesName', type: 'tag', disabled: true, className: 'el-form-block-20' },
          { label: '车牌号', value: 'plateNo', type: 'tag', disabled: true, className: 'el-form-block-20' },
          { label: '车辆行驶证照片', value: 'carLicenseUrl', type: 'slot', className: 'el-form-block' },
          { label: '驾照正面照', value: 'driverLicense1', type: 'slot', className: 'el-form-block' },
          { label: '审批时间', value: 'approveTime', type: 'tag', disabled: true, className: 'el-form-block-30' },
          { label: '审批人', value: 'approveName', type: 'tag', disabled: true, className: 'el-form-block-20' },
          { label: '审批理由', value: 'approveReason', type: 'tag', disabled: true, className: 'el-form-block-50' },
          { label: '默认车辆', value: 'defaultName', type: 'tag', disabled: true, className: 'el-form-block-20' },
          { label: '状态', value: 'statusName', type: 'tag', disabled: true, className: 'el-form-block-20' }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // sss
      form: {
        name: '',
        btn: 'aaaa',
        delivery: false,
        type: []
      },
      formLabelWidth: '120px'
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
      // this.$initDataPermits('userCarVerifyDetail', this.formInfo1.data) // 条件区域操作权限
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo1.ref) {
        this.formInfo1.ref.resetFields()
      }
      // 获取url参数
      this.formInfo1.data.id = this.$route.query.id
      // 获取认证详细
      const mparam = { 'id': this.formInfo1.data.id }
      this.$handleAPI('', getApi, mparam).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          console.log(res)
          const data = res.data
          // 显示信息
          for (const key in res.data) {
            // 存在则赋值
            if (key in this.formInfo1.data) {
              this.formInfo1.data[key] = data[key]
            }
          }
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo1.rules = this.$initRules(this.formInfo1.fieldList)
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'approveOK': {
          const mparam = {
            'id': this.formInfo1.data.id,
            'status': 2,
            'approveBy': this.$store.state.staff.staffId,
            'approveReason': this.form.name
          }
          this.$handleAPI('', updateAuthentication, mparam).then(res => {
            if (res.code === 200) {
              this.dialogFormVisible = false
              this.getDetail()
            }
            this.$message({
              showClose: true,
              message: (res.code === 200) ? '操作成功' : res.message,
              type: (res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          })
          break
        }
        case 'approveNG': {
          const mparam = {
            'id': this.formInfo1.data.id,
            'status': 3,
            'approveBy': this.$store.state.staff.staffId,
            'approveReason': this.form.name
          }
          this.$handleAPI('', updateAuthentication, mparam).then(res => {
            if (res.code === 200) {
              this.dialogFormVisible = false
              this.getDetail()
            }
            this.$message({
              showClose: true,
              message: (res.code === 200) ? '操作成功' : res.message,
              type: (res.code === 200) ? 'success' : 'error',
              duration: 3500
            })
          })
          break
        }
        case 'authenticationOK': {
          this.dialogFormVisible = true
          this.form.btn = 'approveOK'
          break
        }
        case 'authenticationNG': {
          this.dialogFormVisible = true
          this.form.btn = 'approveNG'
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'approve': {
          break
        }
        case 'changeCity': {
          break
        }
      }
    }
  }
}
</script>

<style scoped>
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
