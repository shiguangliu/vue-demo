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
        :api="getAllMemuList"
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
        v-if="dialogInfo.type === 'createModule'"
        :ref-obj.sync="formInfo.refModule"
        :data="formInfo.data"
        :field-list="formInfo.fieldModuleC"
        :rules="formInfo.rulesModule"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
      />
      <page-form
        v-if="dialogInfo.type === 'updateModule'"
        :ref-obj.sync="formInfo.refModule"
        :data="formInfo.data"
        :field-list="formInfo.fieldModuleE"
        :rules="formInfo.rulesModule"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
      />
      <page-form
        v-if="dialogInfo.type === 'createMenu'"
        :ref-obj.sync="formInfo.refMenu"
        :data="formInfo.data"
        :field-list="formInfo.fieldMenuC"
        :rules="formInfo.rulesMenu"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
      />
      <page-form
        v-if="dialogInfo.type === 'updateMenu'"
        :ref-obj.sync="formInfo.refMenu"
        :data="formInfo.data"
        :field-list="formInfo.fieldMenuE"
        :rules="formInfo.rulesMenu"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
      />
      <page-form
        v-if="dialogInfo.type === 'createPage'"
        :ref-obj.sync="formInfo.refPage"
        :data="formInfo.data"
        :field-list="formInfo.fieldPageC"
        :rules="formInfo.rulesPage"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
      >
        <template v-slot:form-pageButtonArray>
          <div class="slot-pageButton">
            <template
              v-for="(pageButton, index) in formInfo.data.pageButtonArray"
            >
              <el-popover
                :key="index"
                ref="popoverPB"
                placement="top"
                width="400"
                @show="handleClick('showPageButton', index)"
              >
                <page-form
                  :ref-obj.sync="formInfo.refPageButton"
                  :data="formInfo.data"
                  :field-list="formInfo.fieldpageButton"
                  :rules="formInfo.rulesPageButton"
                  :label-width="formInfo.labelWidth"
                  :list-type-info="listTypeInfo"
                />
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="handleClick('closePageButton', index)">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleClick('savePageButton', index)">确定</el-button>
                </div>
                <el-tag
                  v-if="pageButton.buttonId != ''"
                  :key="pageButton.buttonId"
                  slot="reference"
                  closable
                  size="medium"
                  :disable-transitions="false"
                  @close="handleClose('delPageButton', pageButton)"
                >
                  {{ pageButton.buttonId + ' - ' + pageButton.buttonName }}
                </el-tag>
              </el-popover>
            </template>
            <el-popover
              ref="popoverP"
              placement="top"
              width="400"
              @show="handleClick('showPageButton')"
            >
              <page-form
                :ref-obj.sync="formInfo.refPageButton"
                :data="formInfo.data"
                :field-list="formInfo.fieldpageButton"
                :rules="formInfo.rulesPageButton"
                :label-width="formInfo.labelWidth"
                :list-type-info="listTypeInfo"
              />
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="handleClick('closePageButtonPlus')">取消</el-button>
                <el-button type="primary" size="mini" @click="handleClick('savePageButtonPlus')">确定</el-button>
              </div>
              <el-button slot="reference" class="button-new-tag" size="small">+</el-button>
            </el-popover>
          </div>
        </template>
      </page-form>
      <page-form
        v-if="dialogInfo.type === 'updatePage'"
        :ref-obj.sync="formInfo.refPage"
        :data="formInfo.data"
        :field-list="formInfo.fieldPageE"
        :rules="formInfo.rulesPage"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
      >
        <template v-slot:form-pageButtonArray>
          <div class="slot-pageButton">
            <template
              v-for="(pageButton, index) in formInfo.data.pageButtonArray"
            >
              <el-popover
                :key="index"
                ref="popoverPB"
                placement="top"
                width="400"
                @show="handleClick('showPageButton', index)"
              >
                <page-form
                  :ref-obj.sync="formInfo.refPageButton"
                  :data="formInfo.data"
                  :field-list="formInfo.fieldpageButton"
                  :rules="formInfo.rulesPageButton"
                  :label-width="formInfo.labelWidth"
                  :list-type-info="listTypeInfo"
                />
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="handleClick('closePageButton', index)">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleClick('savePageButton', index)">确定</el-button>
                </div>
                <el-tag
                  v-if="pageButton.buttonId != ''"
                  :key="pageButton.buttonId"
                  slot="reference"
                  closable
                  size="medium"
                  :disable-transitions="false"
                  @close="handleClose('delPageButton', pageButton)"
                >
                  {{ pageButton.buttonId + ' - ' + pageButton.buttonName }}
                </el-tag>
              </el-popover>
            </template>
            <el-popover
              ref="popoverP"
              placement="top"
              width="400"
              @show="handleClick('showPageButton')"
            >
              <page-form
                :ref-obj.sync="formInfo.refPageButton"
                :data="formInfo.data"
                :field-list="formInfo.fieldpageButton"
                :rules="formInfo.rulesPageButton"
                :label-width="formInfo.labelWidth"
                :list-type-info="listTypeInfo"
              />
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="handleClick('closePageButtonPlus')">取消</el-button>
                <el-button type="primary" size="mini" @click="handleClick('savePageButtonPlus')">确定</el-button>
              </div>
              <el-button slot="reference" class="button-new-tag" size="small">+</el-button>
            </el-popover>
          </div>
        </template>
      </page-form>
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi } from '@/api/common'
import { getModuleList, getSysMenuList, getSysPageList, getAllMemuList, addModuleInfo, deleteModuleInfo, editModuleInfo,
  getModuleInfo, addMenuInfo, deleteMenuInfo, editMenuInfo, getMenuInfo, addPageInfo, deletePageInfo, editPageInfo, getPageInfo } from '@/api/sysmenu'
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
    // 校验ID
    const checkID = (rule, value, callback) => {
      const check = this.$validate({ label: 'ID', value, rules: ['notnull', 'noChinese', 'length'], conditions: [1, 20] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    // 校验名称
    const checkName = (rule, value, callback) => {
      const check = this.$validate({ label: '名称', value, rules: ['notnull', 'length'], conditions: [1, 200] })
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
    return {
      getSysMenuList,
      getSysPageList,
      getAllMemuList,
      getModuleInfo,
      addModuleInfo,
      deleteModuleInfo,
      editModuleInfo,
      getMenuInfo,
      addMenuInfo,
      deleteMenuInfo,
      editMenuInfo,
      addPageInfo,
      deletePageInfo,
      editPageInfo,
      getPageInfo,
      elPopover: '',
      // 相关列表
      listTypeInfo: {
        iconList: [],
        statusList: [], // 状态列表
        menuFlagList: [],
        componentList: []
      },
      // 树相关信息
      treeInfo: {
        initTree: false, // 初始化加载
        refresh: 1, // 刷新
        nodeKey: 'menuTree', // 节点绑定字段
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
        lazyInfo: [{
          key: 'menuId', // 节点id
          pKey: 'parentId', // 节点父级id
          label: 'menuName', // 节点名称字段
          api: getModuleList, // 获取数据的接口 模块
          params: { data: [{ key: 'status', value: '1' }], type: 'query' },
          resFieldList: ['data'], // 数据所在字段
          leaf: false
        },
        {
          key: 'menuId', // 节点id
          pKey: 'parentId', // 节点父级id
          label: 'menuName', // 节点名称字段
          api: getSysMenuList, // 获取数据的接口 菜单
          params: { data: [{ key: 'status', value: '1' }, { key: 'level', value: '1' }], type: 'query' },
          resFieldList: ['data'], // 数据所在字段
          leaf: false
        },
        {
          key: 'menuId', // 节点id
          pKey: 'parentId', // 节点父级id
          label: 'menuName', // 节点名称字段
          api: getSysMenuList, // 获取数据的接口 子菜单
          params: { data: [{ key: 'status', value: '1' }, { key: 'level', value: '2' }], type: 'query' },
          resFieldList: ['data'], // 数据所在字段
          leaf: false
        },
        {
          key: 'menuId', // 节点id
          pKey: 'parentId', // 节点父级id
          label: 'menuName', // 节点名称字段
          api: getSysPageList, // 获取数据的接口
          params: { data: [{ key: 'status', value: '1' }], type: 'query' },
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
          { type: 'input', label: '菜单ID', value: 'menuId' },
          { type: 'input', label: '菜单名称', value: 'menuName' },
          { type: 'customselect', label: '状态', value: 'status', list: 'statusList', key: 'itemValue', name: 'itemName' },
          { type: 'button', label: '搜索', btType: 'primary', icon: 'el-icon-search', event: 'search', show: true },
          { type: 'button', label: '添加模块', btType: 'primary', icon: 'el-icon-plus', event: 'createModule', show: true }
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
          { label: '菜单ID', value: 'menuId', width: 85 },
          { label: '菜单名称', value: 'menuName' },
          { label: '上级菜单ID', value: 'parentId', width: 85 },
          { label: '上级菜单名称', value: 'parentName' },
          { label: '所属模块ID', value: 'moduleId', width: 85 },
          { label: '所属模块名称', value: 'moduleName', width: 100 },
          { label: '排序', value: 'sort', width: 50 },
          { label: '模块/一级菜单/二级菜单/页面', value: 'levelName' },
          { label: '状态', value: 'statusName', width: 60 },
          { label: '更新时间', value: 'updateTime', width: 140 }
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
        refModule: null,
        refMenu: null,
        refPage: null,
        refPageButton: null,
        data: {
          moduleId: '',
          moduleName: '',
          icon: '',
          sort: '', // 排序
          status: '1', // *状态: 1：启用 2：不启用',
          menuId: '',
          menuName: '',
          routeName: '',
          routePath: '',
          parentId: '',
          parentName: '',
          level: '',
          parentLevel: '',
          pageId: '',
          pageName: '',
          pageButtonList: '',
          pageButtonArray: [],
          menuFlag: '',
          menuPageSort: '',
          component: '',
          buttonId: '',
          buttonName: '',
          createBy: '', // 创建人
          createTime: '', // 创建时间
          updateBy: '', // 修改人
          updateTime: '' // 修改时间
        },
        fieldModuleC: [
          { label: '模块ID', value: 'moduleId', type: 'input', required: true, validator: checkID },
          { label: '模块名称', value: 'moduleName', type: 'input', required: true, validator: checkName },
          { label: '模块图标', value: 'icon', type: 'input' },
          { label: '排序', value: 'sort', type: 'input', required: true, validator: checkSort },
          { label: '状态', value: 'status', type: 'customselect', list: 'statusList', key: 'itemValue', name: 'itemName', required: true }
        ],
        fieldModuleE: [
          { label: '模块ID', value: 'moduleId', type: 'tag', required: true, validator: checkID },
          { label: '模块名称', value: 'moduleName', type: 'input', required: true, validator: checkName },
          { label: '模块图标', value: 'icon', type: 'input' },
          { label: '排序', value: 'sort', type: 'input', required: true, validator: checkSort },
          { label: '状态', value: 'status', type: 'customselect', list: 'statusList', key: 'itemValue', name: 'itemName', required: true }
        ],
        fieldMenuC: [
          { label: '菜单ID', value: 'menuId', type: 'input', required: true, validator: checkID },
          { label: '菜单名称', value: 'menuName', type: 'input', required: true, validator: checkName },
          { label: '菜单路由名称', value: 'routeName', type: 'input', required: true },
          { label: '菜单路由URL', value: 'routePath', type: 'input', required: true },
          { label: '模块名称', value: 'moduleName', type: 'tag' },
          { label: '上级菜单名称', value: 'parentName', type: 'tag' },
          { label: '节点图标', value: 'icon', type: 'input' },
          { label: '排序', value: 'sort', type: 'input', required: true, validator: checkSort },
          { label: '状态', value: 'status', type: 'customselect', list: 'statusList', key: 'itemValue', name: 'itemName', required: true }
        ],
        fieldMenuE: [
          { label: '菜单ID', value: 'menuId', type: 'tag', required: true, validator: checkID },
          { label: '菜单名称', value: 'menuName', type: 'input', required: true, validator: checkName },
          { label: '菜单路由名称', value: 'routeName', type: 'input', required: true },
          { label: '菜单路由URL', value: 'routePath', type: 'input', required: true },
          { label: '模块名称', value: 'moduleName', type: 'tag' },
          { label: '上级菜单名称', value: 'parentName', type: 'tag' },
          { label: '节点图标', value: 'icon', type: 'input' },
          { label: '排序', value: 'sort', type: 'input', required: true, validator: checkSort },
          { label: '状态', value: 'status', type: 'customselect', list: 'statusList', key: 'itemValue', name: 'itemName', required: true }
        ],
        fieldPageC: [
          { label: '页面ID', value: 'pageId', type: 'input', required: true, validator: checkID },
          { label: '页面名称', value: 'pageName', type: 'input', required: true, validator: checkName },
          { label: '页面路由名称', value: 'routeName', type: 'input', required: true },
          { label: '页面路由URL', value: 'routePath', type: 'input', required: true, className: 'el-form-block-100' },
          { label: '页面按钮列表', value: 'pageButtonArray', type: 'slot', className: 'el-form-block-100' },
          { label: '页面对应组件', value: 'component', type: 'customselect', list: 'componentList', key: 'itemValue', name: 'itemName', required: true },
          { label: '菜单显示标志', value: 'menuFlag', type: 'customselect', list: 'menuFlagList', key: 'itemValue', name: 'itemName', required: true },
          { label: '排序', value: 'sort', type: 'input', required: true, validator: checkSort },
          { label: '菜单显示排序', value: 'menuPageSort', type: 'input', required: true, validator: checkSort },
          { label: '上级菜单名称', value: 'menuName', type: 'tag' },
          { label: '状态', value: 'status', type: 'customselect', list: 'statusList', key: 'itemValue', name: 'itemName', required: true }
        ],
        fieldPageE: [
          { label: '页面ID', value: 'pageId', type: 'tag', required: true, validator: checkID },
          { label: '页面名称', value: 'pageName', type: 'input', required: true, validator: checkName },
          { label: '页面路由名称', value: 'routeName', type: 'input', required: true },
          { label: '页面路由URL', value: 'routePath', type: 'input', required: true, className: 'el-form-block-100' },
          { label: '页面按钮列表', value: 'pageButtonArray', type: 'slot', className: 'el-form-block-100' },
          { label: '页面对应组件', value: 'component', type: 'customselect', list: 'componentList', key: 'itemValue', name: 'itemName', required: true },
          { label: '菜单显示标志', value: 'menuFlag', type: 'customselect', list: 'menuFlagList', key: 'itemValue', name: 'itemName', required: true },
          { label: '排序', value: 'sort', type: 'input', required: true, validator: checkSort },
          { label: '菜单显示排序', value: 'menuPageSort', type: 'input', required: true, validator: checkSort },
          { label: '上级菜单名称', value: 'menuName', type: 'tag' },
          { label: '状态', value: 'status', type: 'customselect', list: 'statusList', key: 'itemValue', name: 'itemName', required: true }
        ],
        fieldpageButton: [
          { label: '按钮ID', value: 'buttonId', type: 'input', required: true, validator: checkID, className: 'el-form-block-100' },
          { label: '按钮名称', value: 'buttonName', type: 'input', required: true, validator: checkName, className: 'el-form-block-100' }
        ],
        rules: {},
        rulesModule: {},
        rulesMenu: {},
        rulesPage: {},
        rulesPageButton: {},
        labelWidth: '120px'
      },
      // 弹窗相关
      dialogInfo: {
        title: {
          createModule: '添加模块',
          updateModule: '编辑模块',
          createMenu: '添加菜单',
          updateMenu: '编辑菜单',
          createPage: '添加页面',
          updatePage: '编辑页面'
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
        if (formInfo.refModule) {
          formInfo.refModule.resetFields()
        }
        if (formInfo.refMenu) {
          formInfo.refMenu.resetFields()
        }
        if (formInfo.refPage) {
          formInfo.refPage.resetFields()
        }
        if (formInfo.refPageButton) {
          formInfo.refPageButton.resetFields()
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
        case 'createModule':
          // 表单验证初始化
          if (formInfo.refModule) {
            formInfo.refModule.resetFields()
          }
          this.resetForm()
          break
      }
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
      this.$initDataPermits('sysMenuList', btList)
    },
    // 初始化验证
    initRules() {
      const formInfo = this.formInfo
      formInfo.rulesModule = this.$initRules(formInfo.fieldModuleC)
      formInfo.rulesMenu = this.$initRules(formInfo.fieldMenuC)
      formInfo.rulesPage = this.$initRules(formInfo.fieldPageC)
      formInfo.rulesPageButton = this.$initRules(formInfo.fieldpageButton)
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
      // menuFlagList
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'MENU_FLAG' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.menuFlagList = res.data
        }
      })
      // componentList: []
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'PAGE_COMPONENT_TYPE' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.componentList = res.data
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
        case 'createModule': // 创建模块
          dialogInfo.type = event
          dialogInfo.visible = true
          break
        case 'update': // 编辑检索结果行
          if (data.level === 1) {
            this.handleRightEvent('updateModule', data)
          } else if (data.level === 4) {
            this.handleRightEvent('updatePage', data)
          } else {
            this.handleRightEvent('updateMenu', data)
          }
          break
        case 'status': { // 修改状态
          let api
          const params = {}
          data.statusLoading = true
          if (data.level === 1) {
            api = editModuleInfo
            params.moduleId = data.menuId
          } else if (data.level === 4) {
            api = editPageInfo
            params.pageId = data.menuId
            params.menuId = data.parentId
          } else {
            api = editMenuInfo
            params.menuId = data.menuId
          }
          params.status = data.status === 1 ? '2' : '1' // 启用或停用
          params.updateBy = this.staffId
          this.$handleAPI('update', api, params).then(res => {
            data.statusLoading = false
            if (res.code === 200) {
              tableInfo.refresh = Math.random()
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 3500
              })
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
          if (data.level === 1) {
            this.handleRightEvent('deleteModule', data)
          } else if (data.level === 4) {
            this.handleRightEvent('deletePage', data)
          } else {
            this.handleRightEvent('deleteMenu', data)
          }
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
            treeInfo.defaultClickedAsyc = formInfo.data.menuId
            treeInfo.defaultHighLightAsyc = formInfo.data.menuId
            treeInfo.defaultExpandedAsyc = [formInfo.data.parentId]
            // 刷新树
            treeInfo.refresh = Math.random()
          }
          break
        case 'save': { // 弹窗点击保存
          let api; let params
          const type = dialogInfo.type
          if (type === 'createModule' || type === 'updateModule') { // 模块
            params = formInfo.data
            if (type === 'createModule') { // 新增
              api = addModuleInfo
              params.createBy = this.staffId
              params.updateBy = this.staffId
            } else { // 修改
              api = editModuleInfo
              params.updateBy = this.staffId
            }
            formInfo.refModule.validate(valid => {
              if (valid) {
                dialogInfo.btLoading = true
                this.$handleAPI('', api, params).then(res => {
                  if (Number(res.code) === 200) {
                    dialogInfo.visible = false
                    // 设置默认项
                    if (type === 'createModule') {
                      treeInfo.defaultClickedAsyc = params.parentId
                      treeInfo.defaultHighLightAsyc = params.parentId
                      treeInfo.defaultExpandedAsyc = [params.parentId]
                    } else if (type === 'updateModule') {
                      treeInfo.defaultClickedAsyc = params.moduleId
                      treeInfo.defaultHighLightAsyc = params.moduleId
                      treeInfo.defaultExpandedAsyc = [params.parentId]
                    }
                    // 刷新树
                    treeInfo.refresh = Math.random()
                    tableInfo.refresh = Math.random()
                  } else {
                    this.$message({
                      showClose: true,
                      message: res.message,
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
          }
          if (type === 'createMenu' || type === 'updateMenu') { // 菜单
            params = formInfo.data
            if (type === 'createMenu') { // 新增
              api = addMenuInfo
              params.createBy = this.staffId
              params.updateBy = this.staffId
            } else { // 修改
              api = editMenuInfo
              params.updateBy = this.staffId
            }
            formInfo.refMenu.validate(valid => {
              if (valid) {
                dialogInfo.btLoading = true
                this.$handleAPI('', api, params).then(res => {
                  if (Number(res.code) === 200) {
                    dialogInfo.visible = false
                    // 设置默认项
                    if (type === 'createMenu') {
                      treeInfo.defaultClickedAsyc = params.parentId === null ? params.moduleId : params.parentId
                      treeInfo.defaultHighLightAsyc = params.parentId === null ? params.moduleId : params.parentId
                      treeInfo.defaultExpandedAsyc = [params.parentId === null ? params.moduleId : params.parentId]
                    } else if (type === 'updateMenu') {
                      treeInfo.defaultClickedAsyc = params.menuId
                      treeInfo.defaultHighLightAsyc = params.menuId
                      treeInfo.defaultExpandedAsyc = [params.parentId === null ? params.moduleId : params.parentId]
                    }
                    treeInfo.refreshLevel = params.level + 1
                    // 刷新树
                    treeInfo.refresh = Math.random()
                    tableInfo.refresh = Math.random()
                  } else {
                    this.$message({
                      showClose: true,
                      message: res.message,
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
          }
          if (type === 'createPage' || type === 'updatePage') { // 页面
            params = formInfo.data
            if (type === 'createPage') { // 新增
              api = addPageInfo
              params.createBy = this.staffId
              params.updateBy = this.staffId
            } else { // 修改
              api = editPageInfo
              params.updateBy = this.staffId
            }
            params.pageButtonList = JSON.stringify(params.pageButtonArray)
            formInfo.refPage.validate(valid => {
              if (valid) {
                dialogInfo.btLoading = true
                this.$handleAPI('', api, params).then(res => {
                  if (Number(res.code) === 200) {
                    dialogInfo.visible = false
                    // 设置默认项
                    if (type === 'createPage') {
                      treeInfo.defaultClickedAsyc = params.menuId
                      treeInfo.defaultHighLightAsyc = params.menuId
                      treeInfo.defaultExpandedAsyc = [params.menuId]
                    } else if (type === 'updatePage') {
                      treeInfo.defaultClickedAsyc = params.pageId
                      treeInfo.defaultHighLightAsyc = params.pageId
                      treeInfo.defaultExpandedAsyc = [params.menuId]
                    }
                    treeInfo.refreshLevel = params.level + 2
                    // 刷新树
                    treeInfo.refresh = Math.random()
                    tableInfo.refresh = Math.random()
                  } else {
                    this.$message({
                      showClose: true,
                      message: res.message,
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
          }
          break
        }
        case 'showPageButton':
          // 表单验证初始化
          if (formInfo.refPageButton) {
            formInfo.refPageButton.resetFields()
          }
          if (data !== undefined) {
            formInfo.data.buttonId = formInfo.data.pageButtonArray[data].buttonId
            formInfo.data.buttonName = formInfo.data.pageButtonArray[data].buttonName
          } else {
            formInfo.data.buttonId = ''
            formInfo.data.buttonName = ''
          }
          break
        case 'savePageButton':
          formInfo.refPageButton.validate(valid => {
            if (valid) {
              formInfo.data.pageButtonArray[data].buttonId = formInfo.data.buttonId
              formInfo.data.pageButtonArray[data].buttonName = formInfo.data.buttonName
              this.$refs.popoverPB[data].doClose()
            }
          })
          break
        case 'closePageButton':
          this.$refs.popoverPB[data].doClose()
          break
        case 'savePageButtonPlus':
          formInfo.refPageButton.validate(valid => {
            if (valid) {
              formInfo.data.pageButtonArray.push({ buttonId: formInfo.data.buttonId, buttonName: formInfo.data.buttonName })
              this.$refs.popoverP.doClose()
            }
          })
          break
        case 'closePageButtonPlus':
          this.$refs.popoverP.doClose()
          break
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
          filterInfo.query.parentId = obj.menuId
          filterInfo.query.level = Number(obj.level)
          break
        }
        case 'rightClick': { // 根据右键点击创建节点对应菜单
          let arr = []
          // 根节点
          if (data.data.level === 1) { // 模块
            arr = [
              { name: '添加一级菜单', type: 'createMenu', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('sysMenuList:create') },
              { name: '编辑', type: 'updateModule', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('sysMenuList:update') },
              { name: '删除', type: 'deleteModule', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('sysMenuList:delete') },
              { name: '刷新', type: 'refreshTree', data: data.data, node: data.node, vm: null, show: true }
            ]
          } else if (data.data.level === 2) { // 一级菜单
            arr = [
              { name: '添加二级菜单', type: 'createMenu', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('sysMenuList:create') },
              { name: '添加页面', type: 'createPage', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('sysMenuList:create') },
              { name: '编辑', type: 'updateMenu', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('sysMenuList:update') },
              { name: '删除', type: 'deleteMenu', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('sysMenuList:delete') },
              { name: '刷新', type: 'refreshTree', data: data.data, node: data.node, vm: null, show: true }
            ]
          } else if (data.data.level === 3) { // 二级菜单
            arr = [
              { name: '添加页面', type: 'createPage', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('sysMenuList:create') },
              { name: '编辑', type: 'updateMenu', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('sysMenuList:update') },
              { name: '删除', type: 'deleteMenu', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('sysMenuList:delete') },
              { name: '刷新', type: 'refreshTree', data: data.data, node: data.node, vm: null, show: true }
            ]
          } else {
            arr = [
              { name: '编辑', type: 'updatePage', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('sysMenuList:update') },
              { name: '删除', type: 'deletePage', data: data.data, node: data.node, vm: data.vm, show: this.dataPermits.includes('sysMenuList:delete') },
              { name: '刷新', type: 'refreshTree', data: data.data, node: data.node, vm: null, show: true }
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
    // 具体的右键事务处理 未处理
    handleRightEvent(type, data) {
      const nodeData = data.data || data // 兼容行编辑
      const dialogInfo = this.dialogInfo
      const formInfo = this.formInfo
      const treeInfo = this.treeInfo
      const tableInfo = this.tableInfo
      switch (type) {
        case 'refreshTree':
          // falls through 告诉ESlint不检查这一行
        case 'refresh':
          // 树刷新
          treeInfo.initTree = false
          treeInfo.refreshLevel = !data.node ? 1 : data.node.level
          treeInfo.refresh = Math.random()
          break
        case 'updateModule': // 编辑模块
          dialogInfo.type = type
          dialogInfo.visible = true
          // 表单验证初始化
          if (formInfo.refModule) {
            formInfo.refModule.resetFields()
          }
          this.resetForm()
          this.dialogInfo.btLoading = true
          // 显示信息
          this.$handleAPI('', getModuleInfo, { moduleId: nodeData.menuId }).then(res => {
            this.dialogInfo.btLoading = false
            for (const key in res.data) {
              // 存在则赋值
              if (key in formInfo.data) {
                formInfo.data[key] = res.data[key]
              }
            }
            formInfo.data.status = formInfo.data.status + ''
          })
          break
        case 'deleteModule': // 删除模块
          this.$handleAPI('', deleteModuleInfo, { moduleId: nodeData.menuId }).then(res => {
            if (res.code === 200) {
              // 删除后，树组件默认指针指向删除元素的父级
              treeInfo.defaultClickedAsyc = nodeData.parentId
              treeInfo.defaultHighLightAsyc = nodeData.parentId
              treeInfo.defaultExpandedAsyc = [nodeData.parentId]
              // 刷新树
              treeInfo.refresh = Math.random()
              tableInfo.refresh = Math.random()
            }
          })
          break
        case 'createMenu': // 增加菜单
          dialogInfo.type = type
          dialogInfo.visible = true
          // 表单验证初始化
          if (formInfo.refMenu) {
            formInfo.refMenu.resetFields()
          }
          this.resetForm()
          formInfo.data.moduleId = nodeData.moduleId === null ? nodeData.menuId : nodeData.moduleId
          formInfo.data.moduleName = nodeData.moduleName === null ? nodeData.menuName : nodeData.moduleName
          formInfo.data.parentId = nodeData.menuId
          formInfo.data.parentName = nodeData.menuName
          formInfo.data.level = nodeData.level
          break
        case 'updateMenu': // 编辑菜单
          dialogInfo.type = type
          dialogInfo.visible = true
          // 表单验证初始化
          if (formInfo.refModule) {
            formInfo.refModule.resetFields()
          }
          this.resetForm()
          this.dialogInfo.btLoading = true
          // 显示信息
          this.$handleAPI('', getMenuInfo, { menuId: nodeData.menuId }).then(res => {
            this.dialogInfo.btLoading = false
            for (const key in res.data) {
              // 存在则赋值
              if (key in formInfo.data) {
                formInfo.data[key] = res.data[key]
              }
            }
            formInfo.data.status = formInfo.data.status + ''
          })
          break
        case 'deleteMenu': // 删除菜单
          this.$handleAPI('', deleteMenuInfo, { menuId: nodeData.menuId }).then(res => {
            if (res.code === 200) {
              // 删除后，树组件默认指针指向删除元素的父级
              treeInfo.defaultClickedAsyc = nodeData.parentId
              treeInfo.defaultHighLightAsyc = nodeData.parentId
              treeInfo.defaultExpandedAsyc = [nodeData.parentId]
              treeInfo.refreshLevel = nodeData.level
              // 刷新树
              treeInfo.refresh = Math.random()
              tableInfo.refresh = Math.random()
            }
          })
          break
        case 'createPage': // 增加页面
          dialogInfo.type = type
          dialogInfo.visible = true
          // 表单验证初始化
          if (formInfo.refPage) {
            formInfo.refPage.resetFields()
          }
          this.resetForm()
          formInfo.data.menuId = nodeData.menuId
          formInfo.data.menuName = nodeData.menuName
          formInfo.data.level = nodeData.level - 1
          break
        case 'updatePage': // 编辑页面
          dialogInfo.type = type
          dialogInfo.visible = true
          // 表单验证初始化
          if (formInfo.refPage) {
            formInfo.refPage.resetFields()
          }
          this.resetForm()
          this.dialogInfo.btLoading = true
          // 显示信息
          this.$handleAPI('', getPageInfo, { pageId: nodeData.menuId, menuId: nodeData.parentId }).then(res => {
            this.dialogInfo.btLoading = false
            for (const key in res.data) {
              // 存在则赋值
              if (key in formInfo.data) {
                formInfo.data[key] = res.data[key]
              }
            }
            formInfo.data.status = formInfo.data.status + ''
            formInfo.data.menuFlag = formInfo.data.menuFlag + ''
            formInfo.data.component = formInfo.data.component + ''
            formInfo.data.pageButtonArray = JSON.parse(formInfo.data.pageButtonList)
          })
          break
        case 'deletePage': // 删除页面
          this.$handleAPI('', deletePageInfo, { pageId: nodeData.menuId, menuId: nodeData.parentId }).then(res => {
            if (res.code === 200) {
              // 删除后，树组件默认指针指向删除元素的父级
              treeInfo.defaultClickedAsyc = nodeData.parentId
              treeInfo.defaultHighLightAsyc = nodeData.parentId
              treeInfo.defaultExpandedAsyc = [nodeData.parentId]
              treeInfo.refreshLevel = nodeData.parentLevel + 1
              // 刷新树
              treeInfo.refresh = Math.random()
              tableInfo.refresh = Math.random()
            }
          })
          break
      }
    },
    handleClose(event, data) {
      switch (event) {
        case 'delPageButton': {
          this.formInfo.data.pageButtonArray.splice(this.formInfo.data.pageButtonArray.indexOf(data), 1)
          break
        }
      }
    },
    // 初始化表单 未处理
    resetForm() {
      this.formInfo.data = {
        moduleId: '',
        moduleName: '',
        icon: '',
        sort: '', // 排序
        status: '1', // *状态: 1：启用 2：不启用',
        menuId: '',
        menuName: '',
        routeName: '',
        routePath: '',
        parentId: '',
        parentName: '',
        level: '',
        parentLevel: '',
        pageId: '',
        pageName: '',
        menuFlag: '',
        pageButtonList: '',
        pageButtonArray: [],
        menuPageSort: '',
        component: '',
        buttonId: '',
        buttonName: '',
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
  .slot-pageButton {
    span + span {
      margin-left: 10px;
    }
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
