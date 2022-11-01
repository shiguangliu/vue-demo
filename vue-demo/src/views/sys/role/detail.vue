<template>
  <div class="role-container">
    <el-row>
      <el-col :span="12" align="left">
        <el-button v-if="dataPermits.includes('roleDetail:save')" class="filter-item" type="primary" size="small" icon="el-icon-check" @click="handleClick('save')">
          保存
        </el-button>
      </el-col>
    </el-row>
    <br>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="角色基本信息" name="tab1">
        <div class="role-detail-container">
          <!-- page form 1 -->
          <page-form
            :ref-obj.sync="formInfo1.ref"
            :data="formInfo1.data"
            :field-list="formInfo1.fieldList"
            :rules="formInfo1.rules"
            :label-width="formInfo1.labelWidth"
            :list-type-info="listTypeInfo"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
          <el-divider />
          <!-- tree -->
          <el-tree
            :data="sysMenuList"
            show-checkbox
            node-key="id"
            :default-expanded-keys="expandRights"
            :default-checked-keys="haveRights"
            :props="defaultProps"
            :render-content="renderContent"
            :expand-on-click-node="false"
            render-after-expand
            @check="handleCheck"
            @node-expand="handleNodeExpand"
            @node-collapse="handleNodeCollapse"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi } from '@/api/common'
import { getApi, updateApi, getMenuListApi, updateAllRoleRightApi } from '@/api/sysrole'
import ThConsts from '@/constants' /* constant */
import PageForm from '@/components/PageForm'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageForm
  },
  data() {
    // 检测number
    const checkNumber = (rule, value, callback) => {
      const check = this.$validate({ label: '所属系统', value, rules: ['notnull'], conditions: [] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [],
      activeName: 'tab1',
      listLoading: true,
      sysMenuList: [],
      sysRoleButtonRight: [],
      haveRights: [],
      expandRights: [],
      sysRoleRights: [],
      getApi,
      updateApi,
      listTypeInfo: {
        statusList: [],
        systemList: ThConsts.SUBSYSTEM
      },
      // 表单相关（追加、修改）
      formInfo1: {
        ref: null,
        data: {
          roleId: this.$route.query.roleId || '', // *唯一ID
          roleName: '', // *角色全称
          icon: '',
          moduleId: '', // *系统id
          moduleName: '', // 系统名称
          sort: '', // 排序
          status: '', // *状态
          statusnm: '', // *状态
          deleteFlag: 0, // *删除标志
          updatetime: '', // 更新时间
          updateuserid: '' // *当前用户ID'
        },
        fieldList: [
          { label: '角色ID', value: 'roleId', type: 'input', required: true, disabled: true, className: 'el-form-inline-block-20' },
          { label: '角色名称', value: 'roleName', type: 'input', required: true, className: 'el-form-inline-block-30' },
          { label: '角色排序', value: 'sort', type: 'input', required: true, className: 'el-form-inline-block-20' },
          { label: '角色图标', value: 'icon', type: 'input', className: 'el-form-inline-block-20' },
          { label: '所属系统', value: 'moduleId', type: 'select', list: 'systemList', event: 'changeSystem', required: true, validator: checkNumber, className: 'el-form-inline-block-20' },
          { label: '状态', value: 'status', type: 'customselect', list: 'statusList', required: true, key: 'itemValue', name: 'itemName', className: 'el-form-inline-block-20' }
        ],
        rules: {},
        labelWidth: '120px'
      }
    }
  },
  computed: {
    ...mapGetters([
      'staffId',
      'theme',
      'dataPermits'
    ]),
    nopicture() {
      return 'this.src="' + this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
    }
  },
  mounted() {
    this.initList()
    this.initDataPermits()
    // 验证规则
    this.initRules()
  },
  methods: {
    renderContent(h, { node, data, store }) {
      if (data.buttonId) {
        return (
          <span class='custom-tree-node buttonSpan'>
            <el-tag type='success'>{ node.label }</el-tag>
          </span>)
      } else {
        return (
          <span class='custom-tree-node'>
            <span>{node.label}</span>
          </span>
        )
      }
    },
    handleNodeClick(e) {
      console.log(e)
      this.tableData = []
      this.tableData.push(e)
    },
    handleCheck(e, checkedObj) {
      setTimeout(() => {
        this.changeCss()
      }, 100)
      this.haveRights = JSON.parse(JSON.stringify(checkedObj.checkedKeys))
      this.handleSysRoleRights()
    },
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
    },
    handleNodeExpand(e) {
      // console.log('expand', e)
      setTimeout(() => {
        this.changeCss()
      }, 100)
    },
    handleNodeCollapse(e) {
      // console.log('collpase', e)
    },
    changeCss() {
      var levelName = document.getElementsByClassName('buttonSpan') // levelname是上面的最底层节点的名字
      for (var i = 0; i < levelName.length; i++) {
        // cssFloat 兼容 ie6-8  styleFloat 兼容ie9及标准浏览器
        levelName[i].parentNode.style.cssFloat = 'left' // 最底层的节点，包括多选框和名字都让他左浮动
        levelName[i].parentNode.style.styleFloat = 'left'
      }
    },
    // 初始化数据权限
    initDataPermits() {
      // 画面控制
    },
    initList() {
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'ACTIVE_STATUS' }).then(res => {
        if (res.code === 200) {
          this.listTypeInfo.statusList = res.data
        }
      })
      // 初始化设置 form fileds
      if (this.formInfo1.ref) {
        this.formInfo1.ref.resetFields()
      }
      // 获取role详细
      const param = { roleId: this.formInfo1.data.roleId }
      this.$handleAPI('', getApi, param).then(res => {
        if (Number(res.code) === 200) {
          // form表单初始化数据
          const data = res.data
          for (const key in res.data) {
            if (key in this.formInfo1.data) {
              this.formInfo1.data[key] = data[key] + ''
            }
          }
          // 所有菜单列表
          this.listLoading = true
          const params = { roleId: this.formInfo1.data.roleId, moduleId: this.formInfo1.data.moduleId }
          this.$handleAPI('', getMenuListApi, params).then(allres => {
            if (Number(allres.code) === 200) {
              this.handleSysMenuList(allres.data)
            }
            this.listLoading = false
          })
        }
        this.initRules()
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo1.rules = this.$initRules(this.formInfo1.fieldList)
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'save': {
          if (Number(this.formInfo1.data.roleId) === 999) {
            this.$message.error('超级管理员不支持修改')
            return
          }
          this.handleSysRoleRights()
          this.formInfo1.ref.validate(valid => {
            if (valid) {
              const data = {
                id: this.formInfo1.data.roleId,
                roleId: this.formInfo1.data.roleId,
                roleName: this.formInfo1.data.roleName,
                moduleId: this.formInfo1.data.moduleId,
                sort: this.formInfo1.data.sort,
                status: Number(this.formInfo1.data.roleId) === 999 ? 1 : this.formInfo1.data.status,
                icon: this.formInfo1.data.icon
              }
              this.$handleAPI('', updateApi, data).then(res => {
                if (Number(res.code) === 200) {
                  const fProps = { staffId: this.staffId, roleId: this.formInfo1.data.roleId, rights: this.sysRoleRights }
                  this.$handleAPI('', updateAllRoleRightApi, fProps).then(res2 => {
                    if (Number(res2.code) === 200) {
                      this.initList()
                      this.$message({
                        showClose: true,
                        message: (Number(res.code) === 200) ? '保存成功' : res.message,
                        type: (Number(res.code) === 200) ? 'success' : 'error',
                        duration: 2000
                      })
                    }
                  })
                }
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
        case 'changeSystem': {
          this.listLoading = true
          const params = { roleId: this.formInfo1.data.roleId, moduleId: this.formInfo1.data.moduleId }
          this.$handleAPI('', getMenuListApi, params).then(res => {
            if (Number(res.code) === 200) {
              this.handleSysMenuList(res.data)
            }
            this.listLoading = false
          })
          break
        }
      }
    },
    handleSysMenuList(data) {
      const haveRights = []
      for (const menuItem of data) {
        menuItem.id = menuItem.menuId + ''
        menuItem.label = menuItem.menuName
        for (const pageItem of menuItem.pageList) {
          pageItem.id = pageItem.pageId + ''
          pageItem.label = pageItem.pageName
          // button权限 + page权限
          for (const haveButtonItem of pageItem.haveButtons) {
            haveRights.push(haveButtonItem)
          }
          for (const buttonItem of pageItem.pageButtonList) {
            buttonItem.id = menuItem.menuId + ':' + pageItem.pageId + ':' + buttonItem.buttonId
            buttonItem.label = buttonItem.buttonName
          }
          pageItem.children = pageItem.pageButtonList
        }
        menuItem.children = menuItem.pageList
        if (menuItem.subList.length > 0) {
          for (const subItem of menuItem.subList) {
            subItem.id = subItem.menuId + ''
            subItem.label = subItem.menuName
            for (const pageItem of subItem.pageList) {
              pageItem.id = pageItem.pageId + ''
              pageItem.label = pageItem.pageName
              // button权限
              for (const haveButtonItem of pageItem.haveButtons) {
                haveRights.push(haveButtonItem)
              }
              for (const buttonItem of pageItem.pageButtonList) {
                buttonItem.id = subItem.menuId + ':' + pageItem.pageId + ':' + buttonItem.buttonId
                buttonItem.label = buttonItem.buttonName
              }
              pageItem.children = pageItem.pageButtonList
            }
            subItem.children = subItem.pageList
          }
          menuItem.children = menuItem.pageList.concat(menuItem.subList)
        }
      }
      this.expandRights = JSON.parse(JSON.stringify(haveRights))
      this.expandRights.push('all')
      const newData = [{ id: 'all', label: '-- 全选所有权限 --', children: data }]
      this.sysMenuList = JSON.parse(JSON.stringify(newData))
      this.haveRights = JSON.parse(JSON.stringify(haveRights))
      setTimeout(() => {
        this.changeCss()
      }, 100)
    },
    handleSysRoleRights() {
      // 处理sysroleright列表数据
      const newRoleRights = []
      const buttonList = {}
      for (const item of this.haveRights) {
        const right = { roleId: this.formInfo1.data.roleId }
        const buttonArr = item.split(':')
        if (buttonArr.length === 1) {
          // 截取字符串出menuId
          if (buttonArr[0].length > 5) {
            right.menuId = buttonArr[0].substring(0, 5)
            right.pageId = buttonArr[0]
            right.pageRight = 1
            buttonList[right.pageId] = []
          }
        } else {
          // menu + page + buttonid
          right.menuId = buttonArr[0]
          right.pageId = buttonArr[1]
          right.pageRight = 1
          if (buttonList[right.pageId]) {
            buttonList[right.pageId].push(buttonArr[2])
          } else {
            buttonList[right.pageId] = []
            buttonList[right.pageId].push(buttonArr[2])
          }
        }
        if (right.menuId && right.pageId) {
          if (newRoleRights.length === 0) {
            newRoleRights.push(right)
          } else {
            if (JSON.stringify(newRoleRights).indexOf(JSON.stringify(right)) !== -1) {
              // TODO 存在
            } else {
              newRoleRights.push(right)
            }
          }
        }
      }
      for (const item of newRoleRights) {
        item.pageButtonList = JSON.stringify(buttonList[item.pageId])
      }
      this.sysRoleRights = newRoleRights
    }
  }
}
</script>

<style scoped lang="scss">
  .role-container {
    margin: 30px;

    .role-detail-container {
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
  }
</style>
<style lang="scss">
.role-container {
  .el-tree-node {
    span {
      font-size: 16px !important;
    }
    .el-tag {
      font-size: 14px !important;
    }
  }
}
</style>
