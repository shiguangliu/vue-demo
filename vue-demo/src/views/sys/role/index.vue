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
      :pager="false"
      :refresh="tableInfo.refresh"
      :init-curpage="tableInfo.initCurpage"
      :data.sync="tableInfo.data"
      :api="getListApi"
      :query="filterInfo.query"
      :field-list="tableInfo.fieldList"
      :list-type-info="listTypeInfo"
      :handle="tableInfo.handle"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <!-- 自定义插槽显示状态 -->
      <template v-slot:col-icon="scope">
        <i :class="scope.row.icon" />
      </template>
      <template v-slot:col-status="scope">
        <i
          :class="Number(scope.row.status) === 0 ? 'el-icon-edit' : (Number(scope.row.status) === 2 ? 'el-icon-close' : 'el-icon-check')"
          :style="{color: scope.row.status === 2 ? '#f56c6c' : '#67c23a', fontSize: '20px'}"
        />
      </template>
      <!-- 自定义插槽状态按钮 -->
      <template v-slot:bt-status="scope">
        <el-tooltip effect="light" :content="Number(scope.data.row.status) === 1 ? '停用' : '启用'" placement="top">
          <el-button
            v-if="scope.data.item.show && (!scope.data.item.ifRender || scope.data.item.ifRender(scope.data.row))"
            v-waves
            size="mini"
            class="handle-button"
            :type="Number(scope.data.row.status) === 1 ? 'danger' : 'success'"
            :icon="scope.data.item.icon"
            :disabled="scope.data.item.disabled"
            :loading="scope.data.row[scope.data.item.loading]"
            @click="handleClick(scope.data.item.event, scope.data.row)"
          />
        </el-tooltip>
      </template>
    </page-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi } from '@/api/common'
import { getListApi, createApi, updateApi, deleteApi } from '@/api/sysrole'
import ThConsts from '@/constants' /* constant */
import PageFilter from '@/components/PageFilter'
import PageTable from '@/components/PageTable'

export default {
  components: {
    PageFilter,
    PageTable
  },
  data() {
    return {
      getListApi,
      createApi,
      updateApi,
      deleteApi,
      // 相关列表
      listTypeInfo: {
        statusList: [], // 状态列表
        subsystemList: ThConsts.SUBSYSTEM // 所属子系统列表
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
          roleid: '',
          rolename: '',
          systemid: '',
          status: ''
        },
        list: [
          { type: 'input', label: '角色ID', value: 'roleId' },
          { type: 'input', label: '角色名称', value: 'roleName' },
          { type: 'select', label: '所属子系统', value: 'moduleId', list: 'subsystemList' },
          { type: 'customselect', label: '状态', key: 'itemValue', name: 'itemName', value: 'status', list: 'statusList' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加', btType: '', icon: 'el-icon-plus', event: 'create', show: true }
        ]
      },
      // 表格相关（检索结果）
      tableInfo: {
        tableIndex: true, // 显示序号
        refresh: 1,
        initCurpage: 1,
        data: [],
        fieldList: [
          { label: '角色ID', value: 'roleId' },
          { label: '角色名称', value: 'roleName' },
          { label: '角色Icon', value: 'icon', type: 'slot' },
          { label: '所属子系统', value: 'moduleName', width: 90 },
          { label: '排序', value: 'sort' },
          { label: '状态', value: 'statusName', width: 90 },
          { label: '更新时间', value: 'updatetime', width: 250 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '150',
          btList: [
            { label: '启用', type: 'success', icon: 'el-icon-turn-off', event: 'status', loading: 'statusLoading', show: false, slot: true },
            { label: '编辑', type: 'primary', icon: 'el-icon-edit', event: 'detail', show: false },
            { label: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', loading: 'deleteLoading', show: false }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits'
    ])
  },
  watch: {
  },
  created() {
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
      this.$initDataPermits('roleList', this.tableInfo.handle.btList) // 列表数据操作权限
      this.$initDataPermits('roleList', this.filterInfo.list) // 条件区域操作权限
    },
    // 初始化验证
    initRules() {
    },
    initList() {
      // 下拉框需要初始化加载的列表数据
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'ACTIVE_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })

      // // 获取子系统
      // this.$handleAPI('', getModuleList, {}).then(res => {
      //   this.filterInfo.createLoading = false
      //   if (Number(res.code) === 200) {
      //     for (const item of res.data) {
      //       const mProps = { key: item.moduleId, name: item.moduleName }
      //       this.listTypeInfo.subsystemList.push(mProps)
      //     }
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       message: res.message,
      //       type: 'error',
      //       duration: 3500
      //     })
      //   }
      // }).catch((error) => {
      //   this.filterInfo.createLoading = false
      //   this.$message({
      //     showClose: true,
      //     message: error,
      //     type: 'error',
      //     duration: 3500
      //   })
      // })
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
        case 'create': { // 创建
          // 新建角色后跳转画面
          this.filterInfo.createLoading = true
          const rowdata = { roleName: '暂未设置', moduleId: 0 }
          this.$handleAPI('', createApi, rowdata).then(res => {
            this.filterInfo.createLoading = false
            if (Number(res.code) === 200) {
              rowdata.roleid = res.data.roleId
              this.tableInfo.data.unshift(rowdata)
              this.$router.push({ path: './detail', query: { roleId: res.data.roleId }, replace: true })
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
            }
          }).catch((error) => {
            this.filterInfo.createLoading = false
            this.$message({
              showClose: true,
              message: error,
              type: 'error',
              duration: 3500
            })
          })
          break
        }
        case 'detail': // 编辑
          // 跳转到详情画面
          this.$router.push({ path: './detail', query: { roleId: data.roleId }, replace: true })
          break
        case 'status': { // 修改状态
          data.statusLoading = true
          // 设置参数
          const params = data
          params.status = params.status !== 1 ? 1 : 2 // 启用或停用
          params.oldupdatetime = params.updatetime
          this.$handleAPI('update', updateApi, params).then(res => {
            data.statusLoading = false
            if (Number(res.code) === 200) {
              data.status = params.status
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
          break
        }
        case 'delete': { // 删除
          data.deleteLoading = true
          // 删除选中的行
          data.deleteFlag = 1
          // const rowdata = { roleid: data.roleid, oldupdatetime: data.updatetime, deleteflg: 1 }
          this.$handleAPI(event, deleteApi, data).then(res => {
            data.deleteLoading = false
            if (Number(res.code) === 200) {
              tableInfo.refresh = Math.random()
              // 刷新列表
              this.initList()
            }
          }).catch((error) => {
            data.deleteLoading = false
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
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            this.$set(item, 'statusLoading', false)
            this.$set(item, 'deleteLoading', false)
            item.updatetime = this.$fn.switchTime(item.updatetime, 'YYYY-MM-DD hh:mm:ss')
          })
          break
      }
    }
  }
}
</script>

<style lang="scss">
</style>
