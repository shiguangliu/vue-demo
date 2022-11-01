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
      <el-tab-pane label="顶部背景详情" name="tab1">
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
          <template v-slot:form-wallUrl>
            <div class="slot-avatar">
              <img
                v-imgAlart
                :src="$TH.FILE_URLS.static_url + formInfo.data.wallUrl"
                style="height: 60px;"
                :onerror="nopicture"
              >
              <el-button
                v-waves
                type="primary"
                icon="el-icon-picture"
                size="mini"
                @click="handleClick('wall')"
              >
                {{ formInfo.data.wallUrl ? '更换图片' : '选择图片' }}
              </el-button>
            </div>
          </template>
          <template v-slot:form-roadUrl>
            <div class="slot-avatar">
              <img
                v-imgAlart
                :src="$TH.FILE_URLS.static_url + formInfo.data.roadUrl"
                style="height: 60px;"
                :onerror="nopicture"
              >
              <el-button
                v-waves
                type="primary"
                icon="el-icon-picture"
                size="mini"
                @click="handleClick('road')"
              >
                {{ formInfo.data.roadUrl ? '更换图片' : '选择图片' }}
              </el-button>
            </div>
          </template>
          <template v-slot:form-showTime>
            <el-time-picker
              v-model="formInfo.data.showTime"
              is-range
              arrow-control
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            />
          </template>
        </page-form>
        <!-- 图片上传弹窗 -->
        <page-dialog
          :title="dialogUpload.title[dialogUpload.type]"
          :visible="(dialogUpload.type === 'road' || dialogUpload.type === 'wall') && dialogUpload.visible"
          :width="dialogUpload.width"
          :bt-loading="dialogUpload.btLoading"
          :bt-list="dialogUpload.btList"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        >
          <!-- 图片上传组件 -->
          <Upload
            v-if="(dialogUpload.type === 'road' || dialogUpload.type === 'wall') && dialogUpload.visible"
            :upload-data="{targetPath: 'trip-map',autoname: '1'}"
            @handleEvent="handleEvent"
          />
        </page-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetailApi, updateDetailApi, deleteBatchApi } from '@/api/trip/tripmap'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import PageDialog from '@/components/PageDialog'
import Upload from '@/components/Upload'
import defaultImage from '@/assets/img/no-pic.jpg'
export default {
  components: {
    PageFilter,
    PageForm,
    PageDialog,
    Upload
  },
  data() {
    const checkNumber = (rule, value, callback) => {
      const check = this.$validate({ label: '', value, rules: ['notnull', 'number'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      getDetailApi,
      activeName: 'tab1',
      readOnly: false,
      listTypeInfo: {
        statusList: []
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
        data: {
          id: '', // *唯一ID
          mapName: '',
          timeFrom: '',
          timeTo: '',
          showTime: null,
          validFrom: '',
          validTo: '',
          showDate: [],
          roadUrl: '',
          wallUrl: '',
          scrollSpeed: '',
          roadSpeed: '',
          status: '',
          updateTime: '',
          updateBy: '',
          createTime: '',
          createBy: ''
        },
        fieldList: [
          { label: '顶部背景ID', value: 'id', type: 'tag', className: 'el-form-block-30' },
          { label: '顶部背景名称', value: 'mapName', type: 'input', className: 'el-form-block', required: true },
          { label: '展示日期', value: 'showDate', type: 'date', className: 'el-form-block', dateType: 'daterange', event: 'changedate', required: true },
          { label: '展示时间', value: 'showTime', type: 'slot', className: 'el-form-block', event: 'changetime', required: true },
          { label: '背景墙移动速率', value: 'scrollSpeed', type: 'input', className: 'el-form-block-30', required: true, validator: checkNumber },
          { label: '背景墙图', value: 'wallUrl', type: 'slot', className: 'el-form-block', required: true },
          { label: '道路移动速率', value: 'roadSpeed', type: 'input', className: 'el-form-block-30', required: true, validator: checkNumber },
          { label: '道路图', value: 'roadUrl', type: 'slot', className: 'el-form-block', required: true },
          { label: '状态', value: 'status', type: 'tag', className: 'el-form-block-30', list: 'statusList', key: 'itemValue', name: 'itemName', required: true }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 图片上传弹窗相关
      dialogUpload: {
        title: {
          road: '道路图片上传',
          wall: '背景图片上传'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', btType: 'primary', type: 'button', icon: 'el-icon-close', event: 'closeUpload', show: true }
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
    'formInfo.data.status'(val) {
      // 按钮权限
      this.initButtonList(this.formInfo.data.status)
    },
    'formInfo.data.showTime'(val) {
      if (val) {
        this.formInfo.data.timeFrom = this.$fn.switchTime(this.formInfo.data.showTime[0], 'hh:mm')
        this.formInfo.data.timeTo = this.$fn.switchTime(this.formInfo.data.showTime[1], 'hh:mm')
      } else {
        this.formInfo.data.timeFrom = ''
        this.formInfo.data.timeTo = ''
      }
    },
    'formInfo.data.showDate'(val) {
      if (val) {
        this.formInfo.data.validFrom = this.$fn.switchTime(this.formInfo.data.showDate[0])
        this.formInfo.data.validTo = this.$fn.switchTime(this.formInfo.data.showDate[1])
      } else {
        this.formInfo.data.validFrom = ''
        this.formInfo.data.validTo = ''
      }
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
      this.$initDataPermits('tripMapDetail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
    //  下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      // 获取url参数
      this.formInfo.data.id = this.$route.query.id
      // 获取协议详细
      const param = { 'id': this.formInfo.data.id }
      this.$handleAPI('', getDetailApi, param).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          const data = res.data
          data.status += ''
          // 显示信息
          for (const key in data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = data[key]
              if (key === 'validFrom' && data['validFrom'] !== '0000-00-00 00:00:00' && data['validFrom'] !== null) {
                this.formInfo.data.showDate = [data['validFrom'], data['validTo']]
              }
              if (key === 'timeFrom' && data['timeFrom'] !== null && data['timeFrom'] !== '') {
                var tfArr = data['timeFrom'].split(':')
                var ttArr = data['timeTo'].split(':')
                var hff = tfArr[0]
                var mff = tfArr[1]
                var htt = ttArr[0]
                var mtt = ttArr[1]
                this.formInfo.data.showTime = [new Date(2016, 9, 10, hff, mff), new Date(2016, 9, 10, htt, mtt)]
              }
              if (key === 'scrollSpeed' && data['scrollSpeed'] === 0) {
                this.formInfo.data[key] = ''
              }
              if (key === 'roadSpeed' && data['roadSpeed'] === 0) {
                this.formInfo.data[key] = ''
              }
            }
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
            var ids = []
            ids.push(this.formInfo.data.id)
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
        case 'road': {
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        }
        case 'wall': {
          // 上传图片
          this.dialogUpload.visible = true
          this.dialogUpload.type = event
          break
        }
        case 'closeUpload':
          // 图片上传弹窗点击关闭
          this.dialogUpload.visible = false
          this.dialogUpload.type = ''
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'upload': { // 上传成功，绑定图片链接到id
          if (this.dialogUpload.type) {
            if (this.dialogUpload.type === 'road') {
              this.formInfo.data.roadUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
            if (this.dialogUpload.type === 'wall') {
              this.formInfo.data.wallUrl = data.fileList[0].relativeUrl
              // 关闭弹窗
              this.handleClick('closeUpload')
            }
          }
          break
        }
      // case 'changedate': {
      //   if (data) {
      //       this.filterInfo.query.validFrom = data[0]
      //       this.filterInfo.query.validTo = data[1]
      //     } else {
      //       this.filterInfo.query.validFrom = ''
      //       this.filterInfo.query.validTo = ''
      //     }
      //   }
      }
    }
  }
}
</script>
<style lang="scss">
  .group-container {
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
