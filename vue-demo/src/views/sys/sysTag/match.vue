<template>
  <div class="tab-container">
    <el-row>
      <el-button v-if="dataPermits.includes('matchSetting:save')" class="filter-item" type="primary" size="small" icon="el-icon-check" @click="handleClick('matchSave')">
        保存修改
      </el-button>
    </el-row>
    <br>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="用户Match值设定" name="tab1">
        <div class="form-merchant-container">
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
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApi, matchSettingSave } from '@/api/sys/sysTag/match'
import PageForm from '@/components/PageForm'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageForm
  },
  data() {
    return {
      dialogFormVisible: false,
      // fetchAreaList,
      getApi,
      activeName: 'tab1',
      listTypeInfo: {
        statusList: []
      },
      // 表单相关（追加、修改）
      formInfo1: {
        refresh: 1,
        ref: null,
        data: {
          id: null, // *唯一ID
          baseRate: null, // *基础值
          tagRate: null, // *单个标签加成
          updateTime: null // 修改时间
        },
        fieldList: [
          { label: '设定id', value: 'id', type: 'tag', className: 'el-form-block-20' },
          { label: '基础值(%)', value: 'baseRate', type: 'inputNumber', className: 'el-form-block', max: 100, min: 0, required: true },
          { label: '标签加成(%)', value: 'tagRate', type: 'inputNumber', className: 'el-form-block', max: 100, min: 0, required: true }
        ],
        rules: {},
        labelWidth: '120px'
      },
      // sss
      form: {
        name: '',
        btn: 'aaaa',
        delivery: false,
        type: []
      },
      formLabelWidth: '120px'
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
    // TODO
  },
  mounted() {
    this.getDetail()
    this.initDataPermits()
    // 验证规则
    this.initRules()
  },
  methods: {
    // 初始化数据权限
    initDataPermits() {
      // 画面控制
      // this.$initDataPermits('matchSetting', this.formInfo1.data) // 条件区域操作权限
    },
    getDetail() {
      // 初始化设置 form fileds
      if (this.formInfo1.ref) {
        this.formInfo1.ref.resetFields()
      }
      // 获取详细
      this.$handleAPI('', getApi, '').then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          console.log(res)
          const data = res.data
          // 显示信息
          for (const key in res.data) {
            // 存在则赋值
            if (key in this.formInfo1.data) {
              this.formInfo1.data[key] = data[key]
            }
          }
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo1.rules = this.$initRules(this.formInfo1.fieldList)
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'matchSave': {
          var coun = this.formInfo1.data.baseRate + this.formInfo1.data.tagRate
          var flag = true
          if (coun > 100) {
            flag = false
            this.$message({
              showClose: true,
              message: '基础值加标签加成不可超过一百',
              type: 'error',
              duration: 3500
            })
          }
          if (flag) {
            var mparam = ''
            if (this.formInfo1.data.id != null) {
              mparam = {
                'id': this.formInfo1.data.id,
                'baseRate': this.formInfo1.data.baseRate,
                'tagRate': this.formInfo1.data.tagRate,
                'updateBy': this.$store.state.staff.staffId,
                'updateTime': this.formInfo1.data.updateTime
              }
            }
            if (this.formInfo1.data.id == null) {
              mparam = {
                'id': this.formInfo1.data.id,
                'baseRate': this.formInfo1.data.baseRate,
                'tagRate': this.formInfo1.data.tagRate,
                'createBy': this.$store.state.staff.staffId
              }
            }
            this.$handleAPI('', matchSettingSave, mparam).then(res => {
              if (res.code === 200) {
                this.getDetail()
              }
              this.$message({
                showClose: true,
                message: (res.code === 200) ? '操作成功' : res.message,
                type: (res.code === 200) ? 'success' : 'error',
                duration: 3500
              })
            })
          }
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'approve': {
          break
        }
        case 'changeCity': {
          break
        }
      }
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
  .form-merchant-container {
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
</style>
