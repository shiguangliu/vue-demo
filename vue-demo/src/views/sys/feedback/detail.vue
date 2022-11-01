<template>
  <div class="tab-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="意见反馈详情" name="tab1">
        <page-form
          :ref-obj.sync="formInfo.ref"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :rules="formInfo.rules"
          :label-width="formInfo.labelWidth"
          :list-type-info="listTypeInfo"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
        <el-row>
          <el-col v-for="(item) in formInfo.data.materiallist" :key="item.id" :span="3" style="padding: 5px;">
            <el-card :body-style="{ padding: '0px'}">
              <div class="imgdiv">
                <img
                  v-imgAlart
                  :src="$TH.FILE_URLS.static_url + item.fileLink"
                  class="image"
                  :onerror="nopicture"
                >
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetailApi, deleteApi, replyApi } from '@/api/system/feedback'
import { getConfigItemsListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
import defaultImage from '@/assets/img/no-pic.jpg'
export default {
  components: {
    PageFilter,
    PageForm
  },
  data() {
    return {
      deleteApi,
      getDetailApi,
      replyApi,
      activeName: 'tab1',
      listTypeInfo: {
        statusList: [], // 状态列表
        sourceList: [], // ios or 安卓
        feedbackTypeList: [],
        sceneList: []
      },
      // 过滤相关配置（按钮区）
      filterInfo: {
        query: {
        },
        list: [
          { type: 'button', label: '提交回复', btType: 'primary', icon: 'el-icon-check', loading: 'saveLoading', event: 'submit', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-close', loading: 'deleteLoading', event: 'delete', show: false }
        ]
      },
      // 表单相关（追加、修改）
      formInfo: {
        ref: null,
        data: {
          id: '', // *唯一ID
          scene: '', // *场景
          source: '', // *投诉建议来源
          feedbackType: '', // *反馈类型
          submitBy: '', // 提交人
          submitByName: '', // 提交人
          reproachTo: '', // 责备对象
          reproachToName: '',
          reproachRoom: '', // *责备聊天室
          phone: '', // *电话
          content: '', // *投诉建议内容
          replyBy: '', // 回复人
          replyByName: '',
          replyContent: '', // 回复内容
          replyTime: '', // 回复日期
          attachment1: '', // 附件1
          attachment2: '', // 附件1
          attachment3: '', // 附件1
          status: '', // 状态
          deleteFlag: '', // 删除标志
          updateTime: '', // 更新时间
          updateBy: '', // 更新用户id
          createTime: '', // 创建时间
          createBy: '', // 新建用户id
          materiallist: []
        },
        fieldList: [
          { label: 'ID', value: 'id', type: 'tag', className: 'el-form-block-30' },
          { label: '反馈类型', value: 'feedbackType', type: 'tag', list: 'feedbackTypeList', key: 'itemValue', name: 'itemName', required: true },
          { label: '场景', value: 'scene', type: 'tag', list: 'sceneList', key: 'itemValue', name: 'itemName' },
          { label: '投诉建议来源', value: 'source', type: 'tag', list: 'sourceList', key: 'itemValue', name: 'itemName', required: true },
          { label: '责备对象', value: 'reproachToName', type: 'tag', required: false },
          { label: '提交人ID', value: 'submitBy', type: 'tag', className: 'el-form-block-40' },
          { label: '提交人', value: 'submitByName', type: 'tag', className: 'el-form-block-40' },
          { label: '电话', value: 'phone', type: 'tag', className: 'el-form-block-40', required: true },
          { label: '反馈日期', value: 'createTime', type: 'tag', className: 'el-form-block-40' },
          { label: '状态', value: 'status', type: 'tag', className: 'el-form-block-30', list: 'statusList', key: 'itemValue', name: 'itemName', required: true },
          { label: '投诉建议内容', value: 'content', type: 'textarea', className: 'el-form-block-80', disabled: true, autosize: { minRows: 6, maxRows: 10 }},
          { label: '回复内容', value: 'replyContent', type: 'textarea', className: 'el-form-block-80', required: false, autosize: { minRows: 6, maxRows: 10 }},
          { label: '回复人', value: 'replyByName', type: 'tag', className: 'el-form-block-40', required: false },
          { label: '回复日期', value: 'replyTime', type: 'tag', className: 'el-form-block-40', required: false }
        ],
        rules: {},
        labelWidth: '120px'
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
    this.getDetail()
    this.initDataPermits()
    // 验证规则
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('appVerDetail', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
    // 下拉框需要初始化加载的列表数据
      const params = {
        'configType': 'PROCESS_STATUS'
      }
      this.$handleAPI('', getConfigItemsListApi, params).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      const appTypeParams = {
        'configType': 'APP_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, appTypeParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.sourceList = res.data
        }
      })
      const fParams = {
        'configType': 'PLAT_FEEDBACK_TYPE'
      }
      this.$handleAPI('', getConfigItemsListApi, fParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.feedbackTypeList = res.data
        }
      })
      const sceneParams = {
        'configType': 'APP_SCENE'
      }
      this.$handleAPI('', getConfigItemsListApi, sceneParams).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.sceneList = res.data
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
      this.formInfo.data.id = this.$route.query.id
      this.formInfo.data.submitByName = this.$route.query.submitByName
      // 获取feedback详细
      const param = { 'id': this.formInfo.data.id }
      const self = this
      this.$handleAPI('', getDetailApi, param).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          // console.log(res)
          const data = res.data
          data.source += ''
          data.status += ''
          data.feedbackType += ''
          data.scene += ''
          self.formInfo.data.materiallist = []
          // 显示信息
          for (const key in res.data) {
            if (data[key] === 0 || data[key] === '0') {
              data[key] = ''
            }
            if (key in self.formInfo.data) {
              self.formInfo.data[key] = data[key]
              if (key === 'attachment1' && data[key] !== null && data[key] !== '') {
                self.formInfo.data.materiallist.push({
                  id: 1,
                  fileLink: data[key]
                })
              }
              if (key === 'attachment2' && data[key] !== null && data[key] !== '') {
                self.formInfo.data.materiallist.push({
                  id: 2,
                  fileLink: data[key]
                })
              }
              if (key === 'attachment3' && data[key] !== null && data[key] !== '') {
                self.formInfo.data.materiallist.push({
                  id: 3,
                  fileLink: data[key]
                })
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
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'submit': {
          const inputdto = { id: this.formInfo.data.id, replyBy: this.$store.state.staff.staffId, replyContent: this.formInfo.data.replyContent, status: 3 }
          this.formInfo.data.replyBy = this.$store.state.staff.staffId
          this.$handleAPI('', replyApi, inputdto).then(res => {
            if (res.code === 200) {
              this.getDetail()
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
        case 'delete': {
          this.$confirm('确定要删除？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const param = { 'id': this.formInfo.data.id, 'staffId': this.$store.state.staff.staffId }
            this.$handleAPI('', deleteApi, param).then(res => {
              if (res.code === 200) {
                this.$router.push({ path: './index' })
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
      }
    },
    // 触发事件
    handleEvent(event, data) {
      // switch (event) {
      //   case 'changeCity': {
      //     break
      //   }
      // }
    }
  }
}
</script>
<style scoped>
  .tab-container {
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
