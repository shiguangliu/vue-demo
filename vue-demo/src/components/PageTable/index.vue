<template>
  <div
    class="page-table"
    :class="className"
  >
    <!-- 显示表格 -->
    <el-table
      ref="table"
      v-loading="listInfo.loading"
      :max-height="listInfo.tableHeight || undefined"
      :data="data"
      :class="'' + (autoFit?'page-table-fit':'')"
      border
      :show-summary="showSummary"
      :summary-method="getSummaries"
      stripe
      style="width:100%"
      @sort-change="handleSortChange"
      @select-all="handleSelectionChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="checkBox"
        :key="'selection'"
        type="selection"
        width="55"
      />
      <el-table-column
        v-if="tableIndex"
        :key="'index'"
        align="center"
        label="序号"
        :width="fieldList.length === 0 ? '' : 80"
        fixed
      >
        <template v-slot="scope">
          <span>{{ scope.$index + 1 + (listInfo.query.page - 1) * listInfo.query.size }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in fieldList.filter(item => !item.hidden)"
        :key="index"
        :prop="item.value"
        :label="item.label"
        :fixed="item.fixed"
        :align="item.align ? item.align : 'center'"
        :width="item.width"
        :min-width="item.minWidth || '100px'"
        :sortable="item.sort"
      >
        <el-table-column
          v-for="(cItem, cIndex) in item.labelList"
          :key="cIndex"
          :label="cItem.label"
          :align="cItem.align ? cItem.align : 'center'"
          :prop="cItem.value"
        />
        <template v-slot="scope">
          <!-- solt 自定义列-->
          <template v-if="item.type === 'slot'">
            <slot
              :name="'col-' + item.value"
              :row="scope.row"
            />
          </template>
          <!-- 嵌套表格 -->
          <template v-else-if="item.children">
            <el-table-column
              v-for="(childItem, childIndex) in item.children"
              :key="childIndex"
              :prop="childItem.value"
              :label="childItem.label"
              align="center"
              :width="item.width"
              :min-width="item.minWidth || '85px'"
            />
          </template>
          <!-- 标签 -->
          <el-tag v-else-if="item.type === 'tag'">
            {{ scope.row[item.value] }}
          </el-tag>
          <!-- 图片 -->
          <img
            v-else-if="item.type === 'image' && scope.row[item.value]"
            v-imgAlart
            height="30px"
            :src="$TH.FILE_URLS.static_url + scope.row[item.value]"
            :onerror="nopicture"
          >
          <!-- 其他 -->
          <span v-else>
            {{ $fn.getDataName({dataList: listTypeInfo[item.list], value: item.key || 'key', label: item.name || 'name', data: scope.row[item.value]}) || '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="handle"
        :key="'handle'"
        :fixed="handle.fixed"
        align="center"
        :label="handle.label"
        :width="handle.width"
      >
        <template v-slot="scope">
          <template v-for="(item, index) in handle.btList">
            <!-- 自定义操作类型 -->
            <slot
              v-if="item.slot"
              :name="'bt-' + item.event"
              :data="{item, row: scope.row}"
            />
            <!-- 操作按钮 -->
            <el-tooltip :key="index" effect="light" :disabled="(((item.label || '')===''?(item.tooltip || ''):'')===''?true:false)" :content="((item.label || '')===''?(item.tooltip || ''):'')" placement="top">
              <el-button
                v-if="!item.slot && item.show && (!item.ifRender || item.ifRender(scope.row))"
                :key="index"
                v-waves
                size="mini"
                class="handle-button"
                :type="item.type"
                :icon="item.icon"
                :disabled="item.disabled"
                :loading="scope.row[item.loading]"
                @click="handleClick(item.event, scope.row, scope.$index)"
              >
                {{ item.label }}
              </el-button>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <template v-if="pager">
      <div
        v-show="!listInfo.loading"
        class="pagination-container"
      >
        <el-pagination
          :current-page.sync="listInfo.query.page"
          :page-sizes="listInfo.pageSizes"
          :page-size="listInfo.query.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listInfo.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import defaultImage from '@/assets/img/no-pic.jpg'
import { setLocalStorage, getLocalStorage } from '@/common/js/storage'
import globalFn from '@/common/js/utils'
export default {
  name: 'PageTable',
  props: {
    // 自定义类名
    className: {
      type: String,
      default: ''
    },
    // 是否显示合记行
    showSummary: {
      type: Boolean,
      default: false
    },
    // 表格字段配置
    summaryFieldList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 刷新
    refresh: {
      type: Number,
      default: 0
    },
    // 是否自动调整table高度
    autoFit: {
      type: Boolean,
      default: true
    },
    // 获取数据的接口
    api: {
      type: Function,
      default: null
    },
    // 是否显示序号
    tableIndex: {
      type: Boolean,
      default: false
    },
    // 是否有选择框
    checkBox: {
      type: Boolean,
      default: false
    },
    // 选中列表
    checkedList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 类型列表
    listTypeInfo: {
      type: Object,
      default: null
    },
    // 表格字段配置
    fieldList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 操作栏配置
    handle: {
      type: Object,
      default: null
    },
    // 是否分页
    pager: {
      type: Boolean,
      default: true
    },
    // 重置当前页
    initCurpage: {
      type: Number,
      default: 0
    },
    // 查询条件
    query: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 列表数据
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    // API返回结果集字段名数据
    resultSet: {
      type: String,
      default: 'list'
    },
    // 监听高度
    listenHeight: {
      type: Boolean,
      default: true
    },
    cacheParams: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 列表相关
      listInfo: {
        tableHeight: 0, // 表格最大高度
        total: 0, // 总条数
        loading: false, // 加载动画
        pageSizes: [5, 10, 20, 50, 100], // 分页数量列表
        query: { // 查询条件
          page: 1, // 当前页
          size: 20 // 每页条数
        }
      },
      summaryData: {}
    }
  },
  computed: {
    ...mapGetters([
      'fullScreen'
    ]),
    nopicture() {
      return 'this.src="' + this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
    }
  },
  watch: {
    initCurpage() {
      this.listInfo.query.page = 1
    },
    refresh() {
      if (!this.api) return
      this.getList(this.api)
    },
    fullScreen() {
      if (this.listenHeight) {
        // 得到表格的高度
        this.listInfo.tableHeight = this.getTableHeight()
      }
    }
  },
  mounted() {
    if (this.listenHeight) {
      // 得到表格的高度
      this.listInfo.tableHeight = this.getTableHeight()
      // 监听页面大小改变
      window.addEventListener('resize', () => {
        // 得到表格的高度
        this.listInfo.tableHeight = this.getTableHeight()
      })
    }
  },
  created() {
    // 缓存检索条件
    if (this.cacheParams) {
      const queryCached = getLocalStorage('QUERY(' + this.$route.path + ')', 'JSON')
      if (queryCached && queryCached !== undefined && queryCached !== null) {
        for (const key in queryCached) {
          if (queryCached[key] || queryCached[key] === 0) {
            this.query[key] = queryCached[key]
          }
          if (key === 'page') {
            this.listInfo.query.page = queryCached[key]
          }
          if (key === 'size') {
            this.listInfo.query.size = queryCached[key]
          }
        }
      }
    }
  },
  methods: {
    // 合计方法
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      // 自定义合计统计
      if (JSON.stringify(this.summaryFieldList).indexOf('colIndex') !== -1) {
        sums[0] = '合计'
        for (const item of this.summaryFieldList) {
          sums[item.colIndex] = this.summaryData[item.colName]
        }
        return sums
      }
      // 自定义列叠加项
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value)) && (JSON.stringify(this.summaryFieldList).indexOf(column.property) !== -1)) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    // 处理参数
    handleParams() {
      const params = {}
      for (const key in this.query) {
        params[key] = this.query[key]
      }
      // 如果不需要分页，则无分页相关参数
      if (this.pager) {
        params['pageNum'] = this.listInfo.query.page
        params['pageSize'] = this.listInfo.query.size
      }
      if (this.cacheParams) setLocalStorage('QUERY(' + this.$route.path + ')', params, 'JSON')
      return params
    },
    // 得到数据
    getList(api) {
      if (!this.api) return
      this.listInfo.loading = true
      const resultSet = this.resultSet
      return new Promise((resolve, reject) => {
        // 每次调用接口时都自动绑定最新的数据
        api(this.handleParams()).then(res => {
          this.listInfo.loading = false
          if (!res) return
          if (res.code === '200' || res.code === 200) {
            this.summaryData = res.data
            const singleData = []
            if (typeof (res.data) === 'object' && !Array.isArray(res.data)) {
              singleData.push(res.data)
            }
            // 使外面可以访问到表格数据
            const arr = Array.isArray(res.data[resultSet]) ? res.data[resultSet] : (Array.isArray(res.data) ? res.data : (res.data.list === undefined ? singleData : res.data.list))
            this.$emit('update:data', arr)
            if (this.pager) {
              if (res.data.total) {
                this.listInfo.total = parseInt(res.data.total.toString())
              } else {
                // 按不分页处理
                this.listInfo.total = (arr ? arr.length : 0)
              }
            }
            // 设置当前选中项
            this.checkedList.forEach(selected => {
              const row = arr.find(item => {
                return item.id === selected
              })
              this.$nextTick(() => {
                if (!row) return
                this.$refs.table.toggleRowSelection(row, true)
              })
            })
            this.$nextTick(() => {
              this.$refs.table.doLayout() // 解决表格错位
            })
            resolve(res)
            this.$emit('handleEvent', 'list', arr)
          } else {
            if (res.message && res.message !== '') {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
            resolve(res)
          }
        }).catch((error) => {
          const message = error.response ? globalFn.requestError(error.response.status) : '请求超时'
          this.$message({
            showClose: true,
            message: message,
            type: 'error',
            duration: 3 * 1000
          })
          this.listInfo.loading = false
        })
      })
    },
    handleSizeChange(val) {
      const query = this.listInfo.query
      query.size = val // 每页条数
      query.page = 1 // 每页条数切换，重置当前页
      this.getList(this.api)
    },
    handleCurrentChange(val) {
      this.listInfo.query.page = val // 当前页
      this.getList(this.api)
    },
    // 派发按钮点击事件
    handleClick(event, data, rowIndex) {
      this.$emit('handleClick', event, data, rowIndex)
    },
    // 选中数据
    handleSelectionChange(rows) {
      this.$emit('handleEvent', 'tableCheck', rows)
    },
    // 表格字段排序Change: data:{column, prop, order}
    handleSortChange(data) {
      this.$emit('handleEvent', 'tableSort', data)
    },
    // 根据页面的头部, 功能框, 分页组件等高度，计算出table的高度
    getTableHeight() {
      // 当表格存在的时候才执行操作
      if (document.getElementsByClassName('page-table-fit').length === 0) {
        return
      }
      const boxH = document.body.clientHeight
      const navH = document.getElementsByClassName('navbar-container')[0] ? document.getElementsByClassName('navbar-container')[0].clientHeight : 0
      const tagH = document.getElementsByClassName('tags-view-container')[0] ? document.getElementsByClassName('tags-view-container')[0].clientHeight : 0
      const searchH = document.getElementsByClassName('page-filter')[0] ? document.getElementsByClassName('page-filter')[0].clientHeight : 0
      const pagerH = document.getElementsByClassName('pagination-container')[0] || { clientHeight: 0 }
      const bottomH = pagerH.clientHeight ? pagerH.clientHeight + 40 : pagerH.clientHeight - 35
      const tab = document.getElementsByClassName('page-table-fit')[0] || { offsetTop: 0 }
      const tabOffT = tab.offsetTop

      // 表格的高度 = 视口高度 - 表格到头部导航的距离 - 头部导航的高度137 - 分页组件的高度100 - 分页组件
      document.getElementsByClassName('page-table-fit')[0].style.height = (boxH - tabOffT - navH - tagH - searchH - bottomH + 250) + 'px'
      // console.log('表格最大高度为:' + (boxH - navH - tagH - searchH - bottomH))
      return (boxH - navH - tagH - searchH - bottomH)
    }
  }
}
</script>

<style lang="scss" scoped>
// 自定义表格相关
.page-table{
  .pagination-container{
    padding: 15px 0;
  }
}
</style>
