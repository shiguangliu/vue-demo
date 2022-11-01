<template>
  <div class="template-container">
    <page-filter
      :query.sync="filterInfo.query"
      :filter-list="filterInfo.list"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="评论详情" name="tab1">
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
        <!-- TODO -->
        </page-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi } from '@/api/common'
import { getCommentApi, updateCommentApi, updateCommentApi as commentApproveApi, updateCommentApi as commentUpdateApi } from '@/api/contentreview'
import defaultImage from '@/assets/img/no-pic.jpg'
import ThConsts from '@/constants' /* constant */
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'

export default {
  components: {
    PageFilter,
    PageForm
  },
  data() {
    const checkStars = (rule, value, callback) => {
      value = Number(value)
      const check = this.$validate({ label: '评价星数', value, rules: ['number'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        if (value > 5 || value < 0) {
          callback(new Error('请输入0-5之间的数字'))
        } else {
          callback()
        }
      }
    }
    return {
      activeName: 'tab1',
      getCommentApi,
      commentApproveApi,
      commentId: this.$route.query.commentId || 0,
      commentType: this.$route.query.commentType || 0,
      status: this.$route.query.status || 0,
      oldupdatetime: '',
      updateuserid: '',
      okLoading: true,
      ngLoading: true,
      // 相关列表
      listTypeInfo: {
        statusList: [],
        commentTypeList: ThConsts.COMMENT_TYPE // 评论类型
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
        },
        list: []
      },
      // 表单相关（显示）
      formInfo: {
        ref: null,
        data: {
          id: this.$route.query.commentId || '',
          commentType: this.$route.query.commentType || 0,
          commentTime: '',
          parentId: '',
          articleId: '',
          title: '',
          orderId: '',
          orderNo: '',
          commentBy: '',
          comment: '',
          stars: 0,
          firstFlag: '1',
          status: 0,
          searchKeywords: '',
          commentByName: '',
          phone: ''
        },
        fieldList: [],
        rules: {},
        labelWidth: '120px'
      },
      // 文章查看
      articleFieldList: [
        { label: '评论ID', value: 'id', type: 'tag', className: 'el-form-block' },
        { label: '评论类型', value: 'commentType', type: 'tag', list: 'commentTypeList', className: 'el-form-block' },
        { label: '文章ID', value: 'articleId', type: 'tag', className: 'el-form-block' },
        { label: '文章标题', value: 'title', type: 'tag', className: 'el-form-block' },
        { label: '用户ID', value: 'commentBy', type: 'tag', className: 'el-form-block' },
        { label: '用户昵称', value: 'commentByName', type: 'tag', className: 'el-form-block' },
        { label: '用户手机', value: 'phone', type: 'tag', className: 'el-form-block' },
        { label: '评论时间', value: 'commentTime', type: 'tag', className: 'el-form-block' },
        { label: '评价内容', value: 'comment', type: 'textarea', className: 'el-form-block', disabled: true, autosize: { minRows: 6, maxRows: 6 }, maxlength: 100, showLimit: true },
        { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName', className: 'el-form-block' }
      ],
      // 文章编辑
      articleFieldEdit: [
        { label: '评论ID', value: 'id', type: 'tag', className: 'el-form-block' },
        { label: '评论类型', value: 'commentType', type: 'tag', list: 'commentTypeList', className: 'el-form-block' },
        { label: '文章ID', value: 'articleId', type: 'tag', className: 'el-form-block' },
        { label: '文章标题', value: 'title', type: 'tag', className: 'el-form-block' },
        { label: '用户ID', value: 'commentBy', type: 'tag', className: 'el-form-block' },
        { label: '用户昵称', value: 'commentByName', type: 'tag', className: 'el-form-block' },
        { label: '用户手机', value: 'phone', type: 'tag', className: 'el-form-block' },
        { label: '评论时间', value: 'commentTime', type: 'tag', className: 'el-form-block' },
        { label: '评价内容', value: 'comment', type: 'textarea', className: 'el-form-block', autosize: { minRows: 6, maxRows: 6 }, maxlength: 100, showLimit: true },
        { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName' }
      ],
      // 优选查看
      bestFieldList: [
        { label: '评论ID', value: 'id', type: 'tag', className: 'el-form-block' },
        { label: '评论类型', value: 'commentType', type: 'tag', list: 'commentTypeList', className: 'el-form-block' },
        { label: '订单ID', value: 'orderId', type: 'tag', className: 'el-form-block' },
        { label: '订单编号', value: 'orderNo', type: 'tag', className: 'el-form-block' },
        { label: '用户ID', value: 'commentBy', type: 'tag', className: 'el-form-block' },
        { label: '用户昵称', value: 'commentByName', type: 'tag', className: 'el-form-block' },
        { label: '用户手机', value: 'phone', type: 'tag', className: 'el-form-block' },
        { label: '评论时间', value: 'commentTime', type: 'tag', className: 'el-form-block' },
        { label: '评价内容', value: 'comment', type: 'textarea', className: 'el-form-block', autosize: { minRows: 6, maxRows: 6 }, maxlength: 100, disabled: true },
        { label: '星数', value: 'stars', type: 'rate', required: true, validator: checkStars, disabled: true, className: 'el-form-block' },
        { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName' }
      ],
      // 优先编辑
      bestFieldEdit: [
        { label: '评论ID', value: 'id', type: 'tag', className: 'el-form-block' },
        { label: '评论类型', value: 'commentType', type: 'tag', list: 'commentTypeList', className: 'el-form-block' },
        { label: '订单ID', value: 'orderId', type: 'tag', className: 'el-form-block' },
        { label: '订单编号', value: 'orderNo', type: 'tag', className: 'el-form-block' },
        { label: '用户ID', value: 'commentBy', type: 'tag', className: 'el-form-block' },
        { label: '用户昵称', value: 'commentByName', type: 'tag', className: 'el-form-block' },
        { label: '用户手机', value: 'phone', type: 'tag', className: 'el-form-block' },
        { label: '评论时间', value: 'commentTime', type: 'tag', className: 'el-form-block' },
        { label: '评价内容', value: 'comment', type: 'textarea', className: 'el-form-block', autosize: { minRows: 6, maxRows: 6 }, maxlength: 100, showLimit: true },
        { label: '星数', value: 'stars', type: 'rate', required: true, validator: checkStars, className: 'el-form-block' },
        { label: '状态', value: 'status', type: 'tag', list: 'statusList', key: 'itemValue', name: 'itemName' }
      ]
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
      this.initButtonList(val)
    }
  },
  created() {
    this.getContent()
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    this.initRules()
  },
  methods: {
    initButtonList(status) {
      status = Number(status)
      // 1：审核中 2-发布 3-审核NG
      if (status === 0) {
        this.filterInfo.list = [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'save', show: false },
          { type: 'button', label: '提交', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'submit', show: false },
          { type: 'button', label: '审核通过', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'approveOK', show: false },
          { type: 'button', label: '审核不通过', btType: 'danger', icon: 'el-icon-close', loading: 'ngLoading', event: 'approveNG', show: false }
        ]
      } else if (status === 1) {
        this.filterInfo.list = [
          { type: 'button', label: '审核通过', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'approveOK', show: false },
          { type: 'button', label: '审核不通过', btType: 'danger', icon: 'el-icon-close', loading: 'ngLoading', event: 'approveNG', show: false }
        ]
      } else if (status === 2 || status === 3) {
        this.filterInfo.list = [
          { type: 'button', label: '编辑', btType: 'primary', icon: 'el-icon-edit', loading: 'saveLoading', event: 'edit', show: false }
        ]
      } else {
        this.filterInfo.list = []
      }
      this.initDataPermits()
    },
    initDataPermits() {
      this.$initDataPermits('contentReviewDetail', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    initList() {
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_COMMENT_APPROVE_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.commentType = Number(this.commentType)
      if (Number(this.status) === 0) { // 0-编辑中 允许修改
        this.formInfo.fieldList = this.commentType === 11 ? this.articleFieldEdit : this.bestFieldEdit
      } else {
        this.formInfo.fieldList = this.commentType === 11 ? this.articleFieldList : this.bestFieldList
      }
    },
    getContent() {
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      // 表单验证初始化
      const params = { commentId: this.commentId, commentType: this.commentType }
      this.$handleAPI('', getCommentApi, params).then(res => {
        if (Number(res.code) === 200) {
          for (const key in res.data) {
            // 存在则赋值
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = res.data[key]
            }
          }
          this.formInfo.data.commentType = this.commentType
          this.status = res.data.status
          this.initButtonList(res.data.status)
        }
      }).catch((error) => {
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          duration: 3500
        })
      })
      this.listLoading = true
    },
    // 按钮点击
    handleClick(event, data) {
      this.commentType = Number(this.commentType)
      switch (event) {
        case 'edit': {
          this.formInfo.data.status = 0
          this.formInfo.fieldList = this.commentType === 11 ? this.articleFieldEdit : this.bestFieldEdit
          break
        }
        case 'save': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const props = {
                id: this.commentId,
                commentType: this.commentType,
                status: 0,
                comment: this.formInfo.data.comment,
                searchKeywords: this.formInfo.data.searchKeywords,
                stars: this.formInfo.data.stars
              }
              this.$handleAPI('', updateCommentApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.status = 0
                  this.getContent()
                  this.formInfo.fieldList = this.commentType === 11 ? this.articleFieldEdit : this.bestFieldEdit
                }
                this.$message({
                  showClose: true,
                  message: '保存成功',
                  type: 'success',
                  duration: 3500
                })
              }).catch((error) => {
                this.$message({
                  showClose: true,
                  message: error,
                  type: 'error',
                  duration: 3500
                })
              })
            }
          })
          break
        }
        case 'submit': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const props = {
                id: this.commentId,
                commentType: this.commentType,
                status: 1,
                comment: this.formInfo.data.comment,
                searchKeywords: this.formInfo.data.searchKeywords,
                stars: this.formInfo.data.stars
              }
              this.$handleAPI('', updateCommentApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.status = 1
                  this.getContent()
                  this.formInfo.fieldList = this.commentType === 11 ? this.articleFieldList : this.bestFieldList
                }
                this.$message({
                  showClose: true,
                  message: '提交成功',
                  type: 'success',
                  duration: 3500
                })
              }).catch((error) => {
                this.$message({
                  showClose: true,
                  message: error,
                  type: 'error',
                  duration: 3500
                })
              })
            }
          })
          break
        }
        case 'approveOK': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const params = {
                id: this.commentId,
                commentType: this.commentType,
                status: 2
              }
              this.$handleAPI('', updateCommentApi, params).then(res => {
                if (Number(res.code) === 200) {
                  this.status = 2
                  this.getContent()
                }
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'success',
                  duration: 3500
                })
              }).catch((error) => {
                this.$message({
                  showClose: true,
                  message: error,
                  type: 'error',
                  duration: 3500
                })
              })
            }
          })
          break
        }
        case 'approveNG': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const params = {
                id: this.commentId,
                commentType: this.commentType,
                status: 3
              }
              this.$handleAPI('', updateCommentApi, params).then(res => {
                if (Number(res.code) === 200) {
                  this.status = 3
                  this.getContent()
                }
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'success',
                  duration: 3500
                })
              }).catch((error) => {
                this.$message({
                  showClose: true,
                  message: error,
                  type: 'error',
                  duration: 3500
                })
              })
            }
          })
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'upload': { // 上传成功，绑定图片链接到id
          if (data.stat !== '0') return
          if (this.dialogUpload.type === 'uploadComments') {
            this.imagelist.push(data.fileList[0].filelink)
            var params = { updateuserid: this.userid, commentid: this.commentid, oldupdatetime: this.formInfo.data.updatetime, operation: 'upload' }
            if (this.imagelist.length === 1) {
              params.attachment1 = this.imagelist[0]
            } else if (this.imagelist.length === 2) {
              params.attachment2 = this.imagelist[1]
            } else if (this.imagelist.length === 3) {
              params.attachment3 = this.imagelist[2]
            } else if (this.imagelist.length === 4) {
              params.attachment4 = this.imagelist[3]
            } else {
              return
            }

            this.$handleAPI('update', commentUpdateApi, params).then(res => {
              if (res.stat === '0') {
                this.getContent()
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
          }
          // 关闭弹窗
          this.handleClick('closeUpload')
          break
        }
      }
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
    }

  }
}
</script>

<style scoped>
  .template-container {
    padding: 0px;
    margin: 20px;
  }
    .image {
    width: 100%;
    display: block;
  }

</style>
