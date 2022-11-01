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
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="敏感词库" name="tab1">
        <page-form
          :ref-obj.sync="formInfo.ref"
          :data="formInfo.data"
          :field-list="formInfo.fieldList"
          :read-only="formInfo.readOnly"
          :rules="formInfo.rules"
          :label-width="formInfo.labelWidth"
          :list-type-info="listTypeInfo"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi } from '@/api/common'
import { getListApi, getApi, updateApi } from '@/api/syssensitivewords'
import PageFilter from '@/components/PageFilter'
import PageForm from '@/components/PageForm'
export default {
  components: {
    PageFilter,
    PageForm
  },
  data() {
    return {
      getApi,
      getListApi,
      updateApi,
      id: this.$route.query.sid || '',
      activeName: 'tab1',
      content: '',
      // 相关列表
      listTypeInfo: {
        statusList: [] // 状态列表
      },
      // 过滤相关配置（检索条件）
      filterInfo: {
        query: {
        },
        list: [
          { type: 'button', label: '保存', btType: 'primary', icon: 'el-icon-check', loading: 'okLoading', event: 'save', show: true }
        ]
      },
      // 表单相关（追加、修改）
      formInfo: {
        ref: null,
        data: {
          id: '',
          content: '', // *富文本
          status: '', // *状态
          deleteFlag: 0 // *删除标志
        },
        fieldList: [
          { label: 'ID', value: 'id', type: 'tag', className: 'el-form-block-20' },
          { label: '内容', value: 'content', type: 'textarea', className: 'el-form-block-100', autosize: { minRows: 10, maxRows: 20 }},
          { label: '状态', value: 'status', type: 'customselect', list: 'statusList', key: 'itemValue', name: 'itemName', className: 'el-form-block-20' }
        ],
        rules: {},
        labelWidth: '120px'
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits',
      'staffId'
    ])
  },
  mounted() {
    this.initList()
    // this.initRules()
  },
  methods: {
    initList() {
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GENERAL_STATUS' }).then(itemRes => {
        if (itemRes.code === 200) {
          this.listTypeInfo.statusList = itemRes.data
        }
      })
      // 获取敏感词
      this.$handleAPI('', getApi, { id: this.id }).then(res => {
        if (Number(res.code) === 200) {
          // form表单初始化数据
          const data = res.data
          for (const key in data) {
            if (key in this.formInfo.data) {
              this.formInfo.data[key] = data[key]
            }
          }
          this.formInfo.data.status += ''
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'save': {
          this.formInfo.ref.validate(valid => {
            if (valid) {
              const data = {
                id: this.formInfo.data.id,
                content: this.formInfo.data.content,
                status: this.formInfo.data.status,
                updateBy: this.staffId
              }
              this.$handleAPI('', updateApi, data).then(res => {
                if (Number(res.code) === 200) {
                  this.initList()
                }
                this.$message({
                  showClose: true,
                  message: (Number(res.code) === 200) ? '保存成功' : res.message,
                  type: (Number(res.code) === 200) ? 'success' : 'error',
                  duration: 3500
                })
              })
            }
          })
          break
        }
      }
    },
    handleEvent() {
      // TODO
    }
  }
}
</script>
