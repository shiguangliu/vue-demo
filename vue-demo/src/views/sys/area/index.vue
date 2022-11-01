<template>
  <div class="app-container">
    <!-- 左侧树 -->
    <div class="left">
      <page-tree
        :expand-all="false"
        :load-type="2"
        :default-clicked="treeInfo.defaultClicked"
        :default-high-light="treeInfo.defaultHighLight"
        :default-expanded="treeInfo.defaultExpanded"
        :tree-data="treeInfo.treeData"
        :base-data.sync="treeInfo.baseData"
        :node-key="treeInfo.nodeKey"
        :lazy-info.sync="treeInfo.lazyInfo"
        :right-menu-list="treeInfo.rightMenuList"
        :tree-refresh="treeInfo.refresh"
        :refresh-level="treeInfo.refreshLevel"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
    </div>
    <div class="right">
      <page-filter
        :query.sync="filterInfo.query"
        :filter-list="filterInfo.list"
        :list-type-info="listTypeInfo"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      />
      <!-- 表格 -->
      <page-table
        :refresh="tableInfo.refresh"
        :init-curpage="tableInfo.initCurPage"
        :data.sync="tableInfo.data"
        :api="getAreaList"
        :query="filterInfo.query"
        :field-list="tableInfo.fieldList"
        :list-type-info="listTypeInfo"
        :handle="tableInfo.handle"
        :pager="tableInfo.pager"
        @handleClick="handleClick"
        @handleEvent="handleEvent"
      >
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
    <!-- 弹窗 -->
    <page-dialog
      :title="dialogInfo.title[dialogInfo.type]"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <page-form
        v-if="dialogInfo.type === 'createRoot' || dialogInfo.type === 'create' || dialogInfo.type === 'update'"
        :ref-obj.sync="formInfo.ref"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
      />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi } from '@/api/common'
import { getAreaList, createApi, updateApi, deleteApi } from '@/api/sysarea'
import PageTree from '@/components/PageTree'
import PageTable from '@/components/PageTable'
import PageFilter from '@/components/PageFilter'
import PageDialog from '@/components/PageDialog'
import PageForm from '@/components/PageForm'

export default {
  components: {
    PageTree,
    PageFilter,
    PageTable,
    PageDialog,
    PageForm
  },
  data() {
    // 校验区域ID
    const checkID = (rule, value, callback) => {
      const check = this.$validate({ label: '地区ID', value, rules: ['notnull', 'noChinese', 'length'], conditions: [1, 20] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 校验地区名称
    const checkAreaName = (rule, value, callback) => {
      const check = this.$validate({ label: '地区名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 校验排序
    const checkSort = (rule, value, callback) => {
      const check = this.$validate({ label: '排序', value, rules: ['notnull', 'noChinese', 'length'], conditions: [1, 20] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkMap = (rule, value, callback) => {
      const check = this.$validate({ label: '地图经纬度', value, rules: ['number', 'noChinese', 'length'], conditions: [1, 20] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      getAreaList,
      createApi,
      updateApi,
      deleteApi,
      // 相关列表
      listTypeInfo: {
        iconList: [],
        statusList: [], // 状态列表
        levelList: this.$TH.AREA_LEVEL
      },
      // 树相关信息
      treeInfo: {
        initTree: false, // 初始化加载
        refresh: 1, // 刷新
        nodeKey: 'areaTree', // 节点绑定字段
        defaultClicked: {}, // 默认点击 (设置为对象，保证数据能被监听到)
        defaultHighLight: '', // 默认高亮
        defaultExpanded: [], // 默认展开
        // 对树删除编辑添加时的临时存储，在树刷新后赋值这些数据的
        defaultClickedAsyc: '', // 默认点击
        defaultHighLightAsyc: '', // 默认高亮
        defaultExpandedAsyc: [], // 默认展开
        treeData: [], // 树渲染数据(非懒加载时由外部渲染)
        baseData: [], // 树的基础数据，从组件中获取到
        // 加载相关数据
        loadInfo: {
          key: 'areaId', // 节点id
          pKey: 'parentId', // 节点父级id
          label: 'areaName', // 节点名称字段
          api: getAreaList, // 获取数据的接口
          params: { data: [{ key: 'status', value: '1' }, { key: 'level', value: '1' }], type: 'query' },
          resFieldList: ['data'] // 数据所在字段
        },
        lazyInfo: [{
          key: 'areaId', // 节点id
          pKey: 'parentId', // 节点父级id
          label: 'areaName', // 节点名称字段
          api: getAreaList, // 获取数据的接口
          params: { data: [{ key: 'status', value: '1' }, { key: 'level', value: '1' }], type: 'query' },
          resFieldList: ['data'], // 数据所在字段
          leaf: false
        },
        {
          key: 'areaId', // 节点id
          pKey: 'parentId', // 节点父级id
          label: 'areaName', // 节点名称字段
          api: getAreaList, // 获取数据的接口
          params: { data: [{ key: 'status', value: '1' }, { key: 'level', value: '2' }], type: 'query' },
          resFieldList: ['data'], // 数据所在字段
          leaf: false
        },
        {
          key: 'areaId', // 节点id
          pKey: 'parentId', // 节点父级id
          label: 'areaName', // 节点名称字段
          api: getAreaList, // 获取数据的接口
          params: { data: [{ key: 'status', value: '1' }, { key: 'level', value: '3' }], type: 'query' },
          resFieldList: ['data'], // 数据所在字段
          leaf: false
        },
        {
          key: 'areaId', // 节点id
          pKey: 'parentId', // 节点父级id
          label: 'areaName', // 节点名称字段
          api: getAreaList, // 获取数据的接口
          params: { data: [{ key: 'status', value: '1' }, { key: 'level', value: '4' }], type: 'query' },
          resFieldList: ['data'], // 数据所在字段
          leaf: true
        }],
        leftClickData: {},
        rightClickData: {},
        rightMenuList: []
      },
      // 检索条件过滤相关配置
      filterInfo: {
        query: {
          areaId: '',
          areaName: '',
          status: '1',
          level: 1,
          parentId: '-1' // 所属上级区域ID
        },
        list: [
          { type: 'input', label: '地区ID', value: 'areaId' },
          { type: 'input', label: '地区名称', value: 'areaName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加省(直辖市)', btType: 'primary', icon: 'el-icon-plus', event: 'createRoot', show: true }
        ]
      },
      // 表格相关(地区信息)
      tableInfo: {
        refresh: 0,
        initTable: false,
        initCurPage: 1,
        pager: false, // 不分页（单个层级数据量不大）
        data: [],
        fieldList: [
          { label: '地区ID', value: 'areaId' },
          { label: '地区名称', value: 'areaName' },
          { label: '上级地区ID', value: 'parentId' },
          { label: '上级地区名称', value: 'parentName' },
          { label: '排序', value: 'sort' },
          { label: '省/市/区/街道', value: 'level', list: 'levelList' },
          { label: '高德精度', value: 'lng' },
          { label: '高德纬度', value: 'lat' },
          { label: '百度精度', value: 'bdLng', width: 120 },
          { label: '百度纬度', value: 'bdLat', width: 120 },
          { label: '状态', value: 'status', list: 'statusList', width: 90, key: 'itemValue', name: 'itemName' },
          { label: '更新时间', value: 'updateTime', width: 150 }
        ],
        handle: {
          fixed: 'right',
          label: '操作',
          width: '200',
          btList: [
            { tooltip: '启用', type: 'success', icon: 'el-icon-turn-off', event: 'status', loading: 'statusLoading', show: false, slot: true },
            { tooltip: '编辑', type: '', icon: 'el-icon-edit', event: 'update', show: false },
            { tooltip: '删除', type: 'danger', icon: 'el-icon-delete', event: 'delete', show: false }
          ]
        }
      },
      // 表单相关
      formInfo: {
        ref: null,
        data: {
          areaId: '', // *唯一ID
          areaName: '', // *地区名称
          parentId: '', // *父ID
          parentName: '', // *地区名称
          level: '', // *省市区: 1.省 2.市 3.区
          lng: '',
          lat: '',
          bdLng: '',
          bdLat: '',
          sort: '', // 排序
          status: '2', // *状态: 1：启用 2：不启用',
          createBy: '', // 创建人
          createTime: '', // 创建时间
          updateBy: '', // 修改人
          updateTime: '' // 修改时间
        },
        fieldList: [
          { label: '地区ID', value: 'areaId', type: 'tag', required: true, validator: checkID },
          { label: '地区名称', value: 'areaName', type: 'input', required: true, validator: checkAreaName },
          { label: '上级地区ID', value: 'parentId', type: 'tag' },
          { label: '上级地区名称', value: 'parentName', type: 'tag' },
          { label: '省/市/区', value: 'levelName', type: 'tag' },
          { label: '排序', value: 'sort', type: 'input', required: true, validator: checkSort },
          { label: '高德精度', value: 'lng', type: 'input', validator: checkMap },
          { label: '高德纬度', value: 'lat', type: 'input', validator: checkMap },
          { label: '百度精度', value: 'bdLng', type: 'input', validator: checkMap },
          { label: '百度纬度', value: 'bdLat', type: 'input', validator: checkMap },
          { label: '状态', value: 'status', type: 'customselect', list: 'statusList', key: 'itemValue', name: 'itemName', required: true }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // 弹窗相关
      dialogInfo: {
        title: {
          create: '添加地区',
          update: '编辑地区'
        },
        visible: false,
        type: '',
        btLoading: false,
        btList: [
          { label: '关闭', type: '', icon: '', event: 'close', show: true },
          { label: '保存', type: 'primary', icon: '', event: 'save', saveLoading: false, show: true }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'staffId',
      'dataPermits'
    ])
  },
  watch: {
    'dialogInfo.visible'(val) {
      const formInfo = this.formInfo
      if (!val) {
        // 表单验证初始化
        if (formInfo.ref) {
          formInfo.ref.resetFields()
        }
        this.resetForm()
        // 重置弹窗按钮loading
        this.dialogInfo.btLoading = false
        this.dialogInfo.type = ''
      }
    },
    'dialogInfo.type'(val) {
      const formInfo = this.formInfo
      switch (val) {
        case 'create':
        case 'createRoot': {
          // 新建省、市、区
          const parentId = formInfo.data.parentId // 上级地区
          const parentName = formInfo.data.parentName // 上级地区名称
          const level = formInfo.data.level || '1' // 当前层级:默认1-省
          // 表单验证初始化
          if (formInfo.ref) {
            formInfo.ref.resetFields()
          }
          this.resetForm()
          this.dialogInfo.btLoading = true
          // 默认不启用，数据输入完整后再启用
          const params = { areaId: '', parentId: parentId, level: level, status: '2' }

          this.$handleAPI('', createApi, params).then(res => {
            this.dialogInfo.btLoading = false
            if (res.stat === '0') {
              formInfo.data.areaId = res.data.areaId
              formInfo.data.parentId = parentId
              formInfo.data.parentName = parentName
              formInfo.data.level = res.data.level
              formInfo.data.levelName = this.$fn.getDataName({ dataList: this.$TH.AREA_LEVEL, value: 'key', label: 'name', data: res.data.level })
              formInfo.data.sort = res.data.sort
              formInfo.data.status = res.data.status + ''
              formInfo.data.updateTime = res.data.updateTime
            } else {
              this.dialogInfo.visible = false
              this.$message({
                showClose: true,
                message: res.error,
                type: 'error',
                duration: 3500
              })
            }
          }).catch((error) => {
            this.dialogInfo.visible = false
            this.dialogInfo.btLoading = false
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
    // 得到树组件数据，处理相关事件
    'treeInfo.baseData'(val) {
      // 得到树状数据(非lazyLoad时使用)
      // this.treeInfo.treeData = this.$fn.getTreeArr({
      //   key: 'areaId',
      //   pKey: 'parentId',
      //   data: val
      // })
      // this.initTree(val)
    }
  },
  mounted() {
    this.getList()
    this.initDataPermits()
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      const btList = this.tableInfo.handle.btList
      this.$initDataPermits('areaList', btList)
    },
    // 初始化验证
    initRules() {
      const formInfo = this.formInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
    },
    initTree(val) {
      const treeInfo = this.treeInfo
      // 操作完后，树刷新，重新设置默认项
      if (!treeInfo.initTree) {
        if (treeInfo.defaultClickedAsyc || treeInfo.defaultClickedAsyc === 0) {
          treeInfo.defaultClicked = { id: treeInfo.defaultClickedAsyc }
        }
        if (treeInfo.defaultHighLightAsyc || treeInfo.defaultHighLightAsyc === 0) {
          treeInfo.defaultHighLight = treeInfo.defaultHighLightAsyc
        }
        if (treeInfo.defaultExpandedAsyc.length > 0) {
          treeInfo.defaultExpanded = treeInfo.defaultExpandedAsyc
        }
      }
    },
    // 获取列表
    getList() {
      // config
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'ACTIVE_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      this.tableInfo.refresh = Math.random()
    },
    // 按钮点击
    handleClick(event, data) {
      const treeInfo = this.treeInfo
      const tableInfo = this.tableInfo
      const dialogInfo = this.dialogInfo
      const formInfo = this.formInfo
      const filterInfo = this.filterInfo
      switch (event) {
        case 'search': // 搜索
          // 重置分页
          tableInfo.initCurPage = Math.random()
          tableInfo.refresh = Math.random()
          // 搜索完之后要将数据对应
          treeInfo.defaultClicked = { id: filterInfo.query.parentId }
          treeInfo.defaultHighLight = filterInfo.query.parentId || null
          break
        case 'createRoot': // 创建省(直辖市)
          dialogInfo.type = event
          dialogInfo.visible = true
          break
        case 'update': // 编辑检索结果行
          this.handleRightEvent(event, data)
          break
        case 'status': { // 修改状态
          const params = {}
          data.statusLoading = true
          // 设置参数
          for (const key in data) {
            // 存在则赋值
            if (key in formInfo.data) {
              params[key] = data[key]
            }
          }
          params.status = data.status === '1' ? '1' : '2' // 启用或停用
          params.oldUpdateTime = data.updateTime
          this.$handleAPI('update', updateApi, params).then(res => {
            data.statusLoading = false
            if (Number(res.code) === 200) {
              data.status = params.status
              data.updateTime = res.data.updateTime
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
        case 'delete': { // 删除数据
          const params = { areaId: data.areaId, deleteFlag: 1 }
          this.$handleAPI('delete', deleteApi, params).then(res => {
            if (Number(res.code) === 200) {
              // 刷新树
              treeInfo.defaultClickedAsyc = data.parentId
              treeInfo.defaultHighLightAsyc = data.parentId
              treeInfo.defaultExpandedAsyc = [data.parentId]
              treeInfo.refresh = Math.random()
            }
          })
          break
        }
        case 'close': // 弹窗点击关闭
          dialogInfo.visible = false
          if (dialogInfo.type === 'create') {
            treeInfo.defaultClickedAsyc = formInfo.data.parentId
            treeInfo.defaultHighLightAsyc = formInfo.data.parentId
            treeInfo.defaultExpandedAsyc = [formInfo.data.parentId]
            // 刷新树
            treeInfo.refresh = Math.random()
          } else if (dialogInfo.type === 'update') {
            treeInfo.defaultClickedAsyc = formInfo.data.areaId
            treeInfo.defaultHighLightAsyc = formInfo.data.areaId
            treeInfo.defaultExpandedAsyc = [formInfo.data.parentId]
            // 刷新树
            treeInfo.refresh = Math.random()
          }
          break
        case 'save': { // 弹窗点击保存
          let api; let params
          const type = dialogInfo.type
          if (type === 'create' || type === 'update') {
            params = formInfo.data
          } else {
            return
          }
          formInfo.ref.validate(valid => {
            if (valid) {
              if (type === 'create') {
                api = updateApi // 新建时已经保存，故此修改为更新
                params.oldUpdateTime = params.updateTime
              } else if (type === 'update') {
                api = updateApi
                params.oldUpdateTime = params.updateTime
              } else {
                return
              }
              dialogInfo.btLoading = true
              this.$handleAPI('', api, params).then(res => {
                if (Number(res.code) === 200) {
                  dialogInfo.visible = false
                  // 设置默认项
                  if (type === 'create') {
                    treeInfo.defaultClickedAsyc = params.parentId
                    treeInfo.defaultHighLightAsyc = params.parentId
                    treeInfo.defaultExpandedAsyc = [params.parentId]
                    // 刷新树
                    treeInfo.refresh = Math.random()
                  } else if (type === 'update') {
                    treeInfo.defaultClickedAsyc = params.areaId
                    treeInfo.defaultHighLightAsyc = params.areaId
                    treeInfo.defaultExpandedAsyc = [params.parentId]
                    // 刷新树
                    treeInfo.refresh = Math.random()
                  }
                } else {
                  this.$message({
                    showClose: true,
                    message: res.error,
                    type: 'error',
                    duration: 3500
                  })
                }
                dialogInfo.btLoading = false
              }).catch(e => {
                dialogInfo.btLoading = false
              })
            }
          })
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      const treeInfo = this.treeInfo
      const tableInfo = this.tableInfo
      const filterInfo = this.filterInfo

      switch (event) {
        case 'list': // 对表格获取到的数据做处理
          if (!data) return
          data.forEach(item => {
            item.createTime = this.$fn.switchTime(item.createTime, 'YYYY-MM-DD hh:mm:ss')
            item.updateTime = this.$fn.switchTime(item.updateTime, 'YYYY-MM-DD hh:mm:ss')
          })
          break
        case 'leftClick': { // 左键点击的处理
          const obj = JSON.parse(JSON.stringify(data.data))
          treeInfo.leftClickData = obj
          // 重置分页
          tableInfo.initCurPage = Math.random()
          // 刷新列表
          tableInfo.refresh = Math.random()
          // 定义当前数据搜索范围
          // var level = (obj.level === undefined || isNaN(obj.level)) ? 0 : parseInt(obj.level)
          // filterInfo.query.level = (level + 1).toString() // 下一层级
          // filterInfo.query.parentId = obj.areaId || '-1'
          filterInfo.query.parentId = obj.areaId
          filterInfo.query.level = Number(obj.level) + 1
          break
        }
        case 'rightClick': { // 根据右键点击创建节点对应菜单
          let arr = []
          // 根节点
          if (data.node.level === 1) { // 省份
            arr = [
              { name: '添加市', type: 'create', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('areaList:create') },
              { name: '编辑', type: 'update', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('areaList:update') },
              { name: '删除', type: 'delete', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('areaList:delete') },
              { name: '刷新', type: 'refreshTree', data: null, node: null, vm: null, show: true }
            ]
          } else if (data.node.level === 2) { // 市
            arr = [
              { name: '添加区/县', type: 'create', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('areaList:create') },
              { name: '编辑', type: 'update', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('areaList:update') },
              { name: '删除', type: 'delete', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('areaList:delete') },
              { name: '刷新', type: 'refreshTree', data: null, node: null, vm: null, show: true }
            ]
          } else if (data.node.level === 3) { // 区/县
            arr = [
              { name: '添加街道/乡镇', type: 'create', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('areaList:create') },
              { name: '编辑', type: 'update', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('areaList:update') },
              { name: '删除', type: 'delete', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('areaList:delete') },
              { name: '刷新', type: 'refreshTree', data: null, node: null, vm: null, show: true }
            ]
          } else {
            arr = [
              { name: '编辑', type: 'update', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('areaList:update') },
              { name: '删除', type: 'delete', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('areaList:delete') },
              { name: '刷新', type: 'refreshTree', data: null, node: null, vm: null, show: true }
            ]
          }
          this.treeInfo.rightMenuList = arr
          treeInfo.rightClickData = JSON.parse(JSON.stringify(data.data))
          break
        }
        case 'rightEvent': // 右键菜单对应的事件处理
          this.handleRightEvent(data.type, data)
          break
      }
    },
    // 具体的右键事务处理
    handleRightEvent(type, data) {
      const nodeData = data.data || data // 兼容行编辑
      const dialogInfo = this.dialogInfo
      const formInfo = this.formInfo
      const treeInfo = this.treeInfo
      switch (type) {
        case 'refreshTree':
          // falls through 告诉ESlint不检查这一行
        case 'refresh':
          // 树刷新
          treeInfo.initTree = false
          treeInfo.refreshLevel = !data.node ? 0 : data.node.level
          treeInfo.refresh = Math.random()
          break
        case 'create': // 新建市、区
          // 设置参数
          formInfo.data.parentId = nodeData.areaId
          formInfo.data.level = (parseInt(nodeData.level) + 1).toString()
          dialogInfo.type = type
          dialogInfo.visible = true
          break
        case 'update': // 编辑地区
          console.log(data)
          dialogInfo.type = type
          dialogInfo.visible = true
          // 表单验证初始化
          if (formInfo.ref) {
            formInfo.ref.resetFields()
          }
          this.resetForm()
          this.dialogInfo.btLoading = true
          // 显示信息
          for (const key in nodeData) {
            // 存在则赋值
            if (key in formInfo.data) {
              formInfo.data[key] = nodeData[key]
            }
            formInfo.data.status = formInfo.data.status + ''
            formInfo.data.levelName = this.$fn.getDataName({ dataList: this.$TH.AREA_LEVEL, value: 'key', label: 'name', data: formInfo.data.level })
          }
          this.dialogInfo.btLoading = false
          break
        case 'delete': {
          const params = {
            areaId: nodeData.areaId,
            oldUpdateTime: nodeData.updateTime }
          this.$handleAPI(type, deleteApi, params).then(res => {
            if (res.stat === '0') {
              // 删除后，树组件默认指针指向删除元素的父级
              treeInfo.defaultClickedAsyc = nodeData.parentId
              treeInfo.defaultHighLightAsyc = nodeData.parentId
              treeInfo.defaultExpandedAsyc = [nodeData.parentId]
              // 刷新树
              treeInfo.refresh = Math.random()
            }
          })
          break
        }
      }
    },
    // 初始化表单
    resetForm() {
      this.formInfo.data = {
        areaId: '', // *唯一ID
        areaName: '', // *地区名称
        parentId: '', // *父ID
        parentName: '', // *地区名称
        level: '', // *层级: 1.省 2.市 3.区
        levelName: '', // 层级名称
        sort: '', // 排序
        lng: '',
        lat: '',
        bdLng: '',
        bdLat: '',
        status: '1', // *状态: 1：启用 2：不启用(默认为1)',
        createBy: '', // 创建人
        createTime: '', // 创建时间
        updateBy: '', // 修改人
        updateTime: '' // 修改时间
      }
    }
  }
}
</script>

<style scoped lang="scss">
.slot-avatar {
    height: 40px;
    display: flex;
    align-items: center;
    img {
      padding-right: 10px;
    }
  }
</style>
