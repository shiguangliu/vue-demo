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
      :check-box="tableInfo.checkBox"
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="listApi"
      :query="filterInfo.query"
      :result-set="tableInfo.resultSet"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    />
    <page-dialog
      :title="dialogCreate.title"
      :visible.sync="dialogCreate.visible"
      :width="dialogCreate.width"
      :bt-loading="dialogCreate.btLoading"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <el-row>
        <el-col :span="24" class="diaglog-title">请选择新增类型</el-col>
      </el-row>
      <el-row class="btnView">
        <el-col :span="12">
          <el-button @click="handleClick('createForType' ,1)"><i class="el-icon-goods" /><br><div class="text">商品类</div></el-button>
        </el-col>
        <el-col :span="12">
          <el-button @click="handleClick('createForType', 2)"><i class="el-icon-document" /><br><div class="text">文章类</div></el-button>
        </el-col>
      </el-row>
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listApi, topApi, deleteApi, createBestApi, rptListApi } from '@/api/best/best'
import { getConfigItemsListApi, getMerchantListApi, getBestTagListApi } from '@/api/common'
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'
import PageDialog from '@/components/PageDialog'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageFilter,
    PageTable,
    PageDialog
  },
  data() {
    return {
      listApi,
      deleteApi,
      topApi,
      createBestApi,
      downloadLoading: false,
      // checkbox 选中的列表
      checkBoxList: [],
      // 相关列表
      listTypeInfo: {
        merchantList: [], // 商户类型列表
        advFlagList: [],
        statusList: [],
        tagList: []
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          bestName: '',
          goodsType: '',
          merchantId: '',
          validDateRange: [],
          validFrom: '',
          validTo: '',
          phone: '',
          cityId: ''
        },
        list: [
          { type: 'customselect', label: '优选标签', value: 'tagId', list: 'tagList', key: 'tagId', name: 'tagName' },
          { type: 'input', label: '优选名称', value: 'bestName' },
          { type: 'customselect', label: '所属商户', value: 'merchantId', list: 'merchantList', key: 'id', name: 'merchantName' },
          { type: 'customselect', label: '性质', value: 'advFlag', list: 'advFlagList', key: 'itemValue', name: 'itemName' },
          { type: 'datetimerange', label: '有效时间', dateType: 'daterange', value: 'validDateRange', event: 'pickDate' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '导出', btType: 'primary', icon: 'el-icon-download', event: 'export', show: false },
          { type: 'button', label: '新建', btType: 'success', icon: 'el-icon-plus', event: 'create', show: false },
          { type: 'button', label: '删除', btType: 'danger', icon: 'el-icon-delete', event: 'delete', show: false },
          { type: 'button', label: '置顶', btType: 'primary', icon: 'el-icon-top', event: 'setop', show: false }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        tableIndex: false, // 显示序号
        checkBox: true,
        refresh: 1,
        initCurpage: 1,
        data: [],
        resultSet: '', // Api返回的结果集字段名，如:res.data.userlist,则 resultSet 为：userlist
        fieldList: [
          // 价格 投放限制 权重 状态
          { label: '优选ID', value: 'id' },
          { label: '优选标签', value: 'tagName' },
          { label: '优选名称', value: 'bestName' },
          { label: '详情banner', value: 'imageUrl', type: 'image' },
          { label: '所属商户', value: 'merchantName' },
          { label: '有效时间', value: 'validFromTo', width: 300 },
          { label: '类型', value: 'objectTypeName' },
          { label: '性质', value: 'advFlagName' },
          { label: '价格', value: 'priceShow' },
          { label: '投放限制', value: 'alreadyMaxTimes' },
          { label: '权重', value: 'weight', width: 80 },
          { label: '状态', value: 'statusName', width: 80 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: [
            { tooltip: '删除', label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', loading: 'deleteLoading', show: false },
            { tooltip: '详情', label: '详情', type: 'primary', icon: 'el-icon-view', event: 'detail', show: false }
          ]
        }
      },
      // 新建优选
      dialogCreate: {
        title: '温馨提示',
        visible: false,
        type: '',
        btLoading: false,
        width: '400px',
        btList: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits',
      'staffId'
    ]),
    nopicture() {
      return (
        'this.src="' +
        this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
      )
    }
  },
  watch: {
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
      this.$initDataPermits('bestList', this.filterInfo.list) // 条件区域操作权限
      this.$initDataPermits('bestList', this.tableInfo.handle.btList) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getMerchantListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.merchantList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'BEST_ADV_FLAG' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.advFlagList = res.data
        }
      })
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.$handleAPI('', getBestTagListApi, {}).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.tagList = res.data.list
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
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurpage = 1 // 重新回第1页
          tableInfo.refresh = Math.random()
          break
        case 'create': // 新建
          this.dialogCreate.visible = true
          break
        case 'createForType': {
          const self = this
          const objectType = data
          const params = {
            'objectType': objectType,
            'userId': self.staffId
          }
          console.log(params)
          this.$handleAPI('', createBestApi, params).then(res => {
            if (res.code === 200) {
              this.$message.success('新建成功')
              this.dialogCreate.visible = false
              if (objectType === 1) {
                this.$router.push({ path: './goods', query: { bestId: res.data }, replace: true })
              } else {
                this.$router.push({ path: './article', query: { bestId: res.data }, replace: true })
              }
            } else {
              this.$message({
                showClose: true,
                message: '新建失败',
                type: 'error',
                duration: 3500
              })
            }
          })
          break
        }
        case 'detail': // 明细
          if (data.objectType === 1) {
            this.$router.push({ path: './goods', query: { bestId: data.id }, replace: true })
          } else {
            this.$router.push({ path: './article', query: { bestId: data.id }, replace: true })
          }
          break
        case 'setop' : { // 置顶
          const self = this
          this.$confirm('确定要置顶选中的优选吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var idArr = []
            self.checkBoxList.forEach(item => {
              idArr.push(item.id)
            })
            if (idArr.length > 0) {
              const params = {
                'ids': idArr,
                'userId': self.staffId
              }
              this.$handleAPI('', topApi, params).then(res => {
                if (res.code === 200) {
                  this.$message.success('置顶成功')
                } else {
                  this.$message({
                    showClose: true,
                    message: '置顶失败',
                    type: 'error',
                    duration: 3500
                  })
                }
              })
            } else {
              this.$message({
                showClose: true,
                message: '请选择需要置顶的数据',
                type: 'error',
                duration: 3500
              })
            }
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消置顶'
            })
          })
          break
        }
        case 'delete': { // 删除
          const self = this
          this.$confirm('确定要删除该优选？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var idArr = []
            if (data) {
              idArr.push(data.id)
              data.deleteLoading = true
            } else {
              self.checkBoxList.forEach(item => {
                idArr.push(item.id)
              })
            }
            if (idArr.length > 0) {
              const params = {
                'ids': idArr,
                'userId': self.staffId
              }
              this.$handleAPI('', deleteApi, params).then(res => {
                if (res.code === 200) {
                  this.$message.success('删除成功')
                  this.getList()
                } else {
                  this.$message({
                    showClose: true,
                    message: '删除失败',
                    type: 'error',
                    duration: 3500
                  })
                  if (data) {
                    data.deleteLoading = false
                  }
                }
              })
            } else {
              this.$message({
                showClose: true,
                message: '请选择需要删除的数据',
                type: 'error',
                duration: 3500
              })
            }
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          if (data) {
            data.deleteLoading = false
          }
          break
        }
        case 'export': // 导出
          this.filterInfo.query.pageNum = this.filterInfo.query.pageNum || 1
          this.filterInfo.query.pageSize = this.filterInfo.query.pageSize || 20
          this.$handleAPI('', rptListApi, this.filterInfo.query).then(res => {
            if (res.code === 200) {
              this.handleDownload(res.data.list)
            }
          })
          break
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'pickDate': // 选择日期范围
          if (data) {
            this.filterInfo.query.validFrom = this.$fn.switchTime(data[0])
            this.filterInfo.query.validTo = this.$fn.switchTime(data[1])
          } else {
            this.filterInfo.query.validFrom = ''
            this.filterInfo.query.validTo = ''
          }
          break
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            this.$set(item, 'deleteLoading', false)
          })
          break
        case 'tableCheck': { // 选择
          this.checkBoxList = data
          break
        }
      }
    },
    handleDownload(list) {
      import('@/vendor/Export2ExcelImage').then(excel => {
        const column = [
          { title: '优选ID', key: 'id', type: 'text' },
          { title: '优选标签', key: 'tagName', type: 'text' },
          { title: '优选名称', key: 'bestName', type: 'text' },
          { title: '详情Banner', key: 'imageUrl', type: 'image', width: 100, height: 100 },
          { title: '所属商户', key: 'merchantName', type: 'text' },
          { title: '有效时间', key: 'validFromTo', type: 'text' },
          { title: '类型', key: 'objectTypeName', type: 'text' },
          { title: '性质', key: 'advFlagName', type: 'text' },
          { title: '价格', key: 'priceShow', type: 'text' },
          { title: '投放限制', key: 'alreadyMaxTimes', type: 'text' },
          { title: '权重', key: 'weight', type: 'text' },
          { title: '状态', key: 'statusName', type: 'text' },
          { title: '浏览量基础数值', key: 'hitCount', type: 'text' },
          { title: '浏览量放大数值', key: 'hitZoom', type: 'text' },
          { title: '实际浏览量', key: 'hitActual', type: 'text' },
          { title: '分享量基础数值', key: 'repostCount', type: 'text' },
          { title: '分享量放大数值', key: 'repostZoom', type: 'text' },
          { title: '实际分享量', key: 'repostActual', type: 'text' }
        ]
        for (var index in list) {
          if (list[index]['imageUrl'] !== '') {
            list[index]['imageUrl'] = this.$TH.FILE_URLS.static_url + list[index]['imageUrl']
          }
        }
        excel.export_table_to_excel_image(column, list, '优选一览')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.diaglog-title {
  text-align: center;
  color: green;
  font-size: 16px;
  font-weight: bold;
}
.btnView {
  margin-top: 30px;
  margin-bottom: 20px;
  .el-col-12 {
    text-align: center;
    .el-button {
      width: 120px;
      height: 120px;
      font-size: 60px;
      .text {
        margin-top: 10px;
        font-size: 20px;
      }
    }
  }
}
</style>
