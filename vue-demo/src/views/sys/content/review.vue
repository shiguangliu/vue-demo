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
      :table-index="tableInfo.tableIndex"
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getCommentListApi"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <template v-slot:col-status="scope">
        <el-tag>{{ getApproveStatusName(scope.row.status) }}</el-tag>
      </template>
      <template v-slot:col-comment="scope">
        <p>{{ scope.row.comment | cutContent }}</p>
      </template>
      <template v-slot:col-stars="scope">
        <el-rate
          v-if="scope.row.stars > 0"
          v-model="scope.row.stars"
          show-score
          disabled
          text-color="#ff9900"
        />
      </template>
      <template v-slot:col-commentType="scope">
        <p>{{ scope.row.commentType | getCommentTypeStatusName }}</p>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi } from '@/api/common'
import { getCommentListApi, createCommentApi } from '@/api/contentreview'
import ThConsts from '@/constants' /* constant */
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageFilter,
    PageTable
  },
  filters: {
    getCommentTypeStatusName: function(value) {
      for (const item of ThConsts.COMMENT_TYPE) {
        if (item.key === value) {
          return item.name
        }
      }
      return '未设置'
    },
    cutContent: function(value) {
      return value.slice(0, 50) + (value.length > 30 ? '...' : '')
    }
  },
  data() {
    return {
      getCommentListApi,
      createCommentApi,
      // 相关列表
      listTypeInfo: {
        statusList: [], // 状态列表
        commentTypeList: ThConsts.COMMENT_TYPE // 评论类型
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          commentType: 11,
          commentTimeFrom: '',
          commentTimeTo: '',
          status: '',
          id: '',
          title: '',
          nickName: '',
          phone: '',
          comment: '',
          createDateRange: []
        },
        list: [
          { type: 'select', label: '评论类型', value: 'commentType', list: 'commentTypeList', event: 'change', clearable: false },
          { type: 'datetimerange', label: '创建时间', dateType: 'daterange', value: 'createDateRange', event: 'pickCreateDate' },
          // { type: 'date', label: '起始日期', valueFormat: 'yyyy-MM-dd H:i:s', value: 'commentTimeFrom' },
          // { type: 'date', label: '截止日期', valueFormat: 'yyyy-MM-dd H:i:s', value: 'commentTimeTo' },
          { type: 'customselect', label: '审核状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'input', label: '评论内容', value: 'comment' },
          // { type: 'input', label: '文章标题', value: 'title' },
          { type: 'input', label: '关键字昵称', value: 'nickName' },
          { type: 'input', label: '关键字手机', value: 'phone' },
          // { type: 'input', label: '订单编号', value: 'id' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true }
          // { type: 'button', label: '添加', btType: 'primary', icon: 'el-icon-edit', event: 'create', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        refresh: 1,
        initCurpage: 1,
        tableIndex: true, // 是否显示序号
        data: [],
        fieldList: [],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '120',
          btList: [
            { label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false }
          ]
        },
        articleFieldList: [
          { label: '评论ID', value: 'id', width: 80 },
          { label: '评论类型', value: 'commentType', type: 'slot', width: 80 },
          { label: '评论时间', value: 'commentTime', width: 135 },
          { label: '用户昵称', value: 'commentByName' },
          { label: '手机号', value: 'phone' },
          { label: '评论内容', value: 'comment', type: 'slot' },
          { label: '文章ID', value: 'articleId', width: 80 },
          { label: '文章标题', value: 'title' },
          { label: '状态', value: 'status', type: 'slot', width: 80 }
        ],
        orderFieldList: [
          { label: '评论ID', value: 'id', width: 80 },
          { label: '评论类型', value: 'commentType', type: 'slot', width: 80 },
          { label: '评论时间', value: 'commentTime', width: 135 },
          { label: '用户昵称', value: 'commentByName' },
          { label: '手机号', value: 'phone' },
          { label: '评论内容', value: 'comment', type: 'slot' },
          { label: '评价星数', value: 'stars', type: 'slot', width: 150 },
          { label: '订单ID', value: 'orderId', width: 80 },
          { label: '订单编号', value: 'orderNo', width: 180 },
          { label: '下单时间', value: 'orderTime', width: 140 },
          { label: '状态', value: 'status', type: 'slot', width: 80 }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['theme', 'dataPermits']),
    nopicture() {
      return (
        'this.src="' +
        this.$TH.FILE_URLS.publicPath +
        defaultImage +
        '";this.onerror = null;'
      )
    }
  },
  watch: {
  },
  mounted() {
    this.initList()
    this.initDataPermits()
  },
  methods: {
    getApproveStatusName: function(value) {
      for (const item of this.listTypeInfo.statusList) {
        if (Number(item.itemValue) === value) {
          return item.itemName
        }
      }
      return '未设置'
    },
    // 初始化数据权限
    initDataPermits() {
      this.$initDataPermits('contentReview', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('contentReview', this.filterInfo.list) // 条件区域操作权限
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PLAT_COMMENT_APPROVE_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      // this.$handleAPI('', getConfigItemsListApi, { 'configType': 'COMENT_TYPE' }).then(res => {
      //   if (res.code === 200) {
      //     this.listTypeInfo.commentTypeList = res.data
      //   }
      // })
      this.changeTableFieldList(this.filterInfo.query.commentType)
      // 获取列表
      this.tableInfo.refresh = Math.random()
    },
    changeTableFieldList(val) {
      if (Number(val) === 10) {
        this.tableInfo.fieldList = this.tableInfo.orderFieldList
      } else if (Number(val) === 11) {
        this.tableInfo.fieldList = this.tableInfo.articleFieldList
      } else {
        this.tableInfo.fieldList = this.tableInfo.articleFieldList
      }
    },
    // 得到placeholder的显示
    getPlaceholder(row) {
      let placeholder
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入' + row.label
      } else if (
        row.type === 'select' ||
        row.type === 'time' ||
        row.type === 'date'
      ) {
        placeholder = '请选择' + row.label
      } else {
        placeholder = row.label
      }
      return placeholder
    },
    // 按钮点击
    handleClick(event, data) {
      const tableInfo = this.tableInfo
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'create': {
          this.$handleAPI('', createCommentApi, { commentType: this.filterInfo.query.commentType })
            .then(res => {
              if (Number(res.code) === 200) {
                this.$router.push({
                  path: './detail',
                  query: { commentId: res.data.id, commentType: this.filterInfo.query.commentType, status: res.data.status },
                  replace: true
                })
              } else {
                this.$message({
                  showClose: true,
                  message: res.error,
                  type: 'error',
                  duration: 3500
                })
              }
            })
            .catch(error => {
              this.$message({
                showClose: true,
                message: error,
                type: 'error',
                duration: 3500
              })
            })
          break
        }
        case 'detail': // 详情
          this.$router.push({
            path: './detail',
            query: { commentType: this.filterInfo.query.commentType, commentId: data.id, status: data.status },
            replace: true
          })
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'change':
          // 赋值类型table字段
          this.changeTableFieldList(this.filterInfo.query.commentType)
          this.tableInfo.refresh = Math.random()
          break
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            this.$set(item, 'statusLoading', false)
            this.$set(item, 'deleteLoading', false)
            item.updatetime = this.$fn.switchTime(
              item.updatetime,
              'YYYY-MM-DD hh:mm:ss'
            )
          })
          break
        case 'pickCreateDate': // 选择日期范围
          if (data) {
            this.filterInfo.query.commentTimeFrom = data[0]
            this.filterInfo.query.commentTimeTo = data[1]
          } else {
            this.filterInfo.query.commentTimeFrom = ''
            this.filterInfo.query.commentTimeTo = ''
          }
          break
      }
    },
    // 初始化表单
    resetForm() {
      this.formInfo.data = {
        channelid: '', // *唯一ID
        channelname: '', // *频道名称
        applytoscene: '', // *场景名称
        sort: 0, // 排序
        status: '1', // *状态: 1：编辑中(默认为1)'
        updatetime: '' // 更新时间
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.slot-avatar {
  height: 40px;
  display: flex;
  align-items: center;
  img {
    padding-right: 10px;
  }
}
</style>
