<template>
  <div class="app-container">
    <page-table
      :table-index="tableInfo.tableIndex"
      :check-box="tableInfo.checkBox"
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getConfigItemsListApi"
      :query="filterInfo.query"
      :result-set="tableInfo.resultSet"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <template v-slot:col-itemName="scope">
        <el-input v-model="scope.row.itemName" placeholder="请输入类型名称" />
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi, updateConfigItemsListApi } from '@/api/common'
import PageTable from '@/components/PageTable'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageTable
  },
  data() {
    return {
      getConfigItemsListApi,
      // 相关列表
      listTypeInfo: {
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          configType: 'GAME_ITEM_TYPE'
        },
        list: [
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        tableIndex: false, // 显示序号
        refresh: 1,
        initCurpage: 1,
        data: [],
        resultSet: '', // Api返回的结果集字段名，如:res.data.userlist,则 resultSet 为：userlist
        fieldList: [
          { label: '类型CODE', value: 'itemCode' },
          { label: '类型值', value: 'itemValue' },
          { label: '类型名称', value: 'itemName', type: 'slot' },
          { label: '排序', value: 'sort' }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: [
            { tooltip: '保存', label: '保存', type: 'primary', icon: 'el-icon-check', event: 'save', show: false }
          ]
        }
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
      this.$initDataPermits('gameItemType', this.tableInfo.handle.btList) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
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
        case 'save': { // 保存
          if (data.itemName === null || data.itemName === '') {
            this.$message({
              message: '请输入类型名称',
              type: 'error',
              duration: 3500
            })
            break
          }
          this.$confirm('确定要保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const params = data
            params.configType = 'GAME_ITEM_TYPE'
            this.$handleAPI('', updateConfigItemsListApi, params).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.getList()
              }
            })
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消保存'
            })
          })
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            // this.$set(item, 'deleteLoading', false)
          })
          break
      }
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
