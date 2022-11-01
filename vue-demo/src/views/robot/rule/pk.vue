<template>
  <div class="tab-container">
    <el-row>
      <el-button v-if="dataPermits.includes('robotPkRule:save') && status == 1" class="filter-item" type="primary" size="small" icon="el-icon-check" @click="handleClick('ruleSave')">
        保存
      </el-button>
      <el-button v-if="dataPermits.includes('robotPkRule:edit') && status == 2" class="filter-item" type="primary" size="small" icon="el-icon-edit" @click="handleClick('ruleEdit')">
        编辑
      </el-button>
    </el-row>
    <br>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="马甲PK规则设置" name="tab1">
        <div class="form-merchant-container">
          <!-- page form 1 -->
          <h4 style="font-size: 13px;margin-bottom: 20px;">同意用户邀请条件</h4>
          <page-form
            :ref-obj.sync="formInfo.ref"
            :data="formInfo.data"
            :field-list="formInfo.fieldList"
            :rules="formInfo.rules"
            :label-width="formInfo.labelWidth"
            :read-only="formInfo.readOnly"
            :list-type-info="listTypeInfo"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
          <div style="margin-bottom: 20px;">
            <h4 style="font-size: 13px;margin-bottom: 20px;">加码装备属性加权</h4>
            <page-form
              :ref-obj.sync="formInfo1.ref"
              :data="formInfo1.data"
              :field-list="formInfo1.fieldList"
              :rules="formInfo1.rules"
              :label-width="formInfo1.labelWidth"
              :read-only="formInfo1.readOnly"
              :list-type-info="listTypeInfo"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
            <page-form
              :ref-obj.sync="formInfo2.ref"
              :data="formInfo2.data"
              :field-list="formInfo2.fieldList"
              :rules="formInfo2.rules"
              :label-width="formInfo2.labelWidth"
              :read-only="formInfo2.readOnly"
              :list-type-info="listTypeInfo"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
            <page-form
              :ref-obj.sync="formInfo3.ref"
              :data="formInfo3.data"
              :field-list="formInfo3.fieldList"
              :rules="formInfo3.rules"
              :label-width="formInfo3.labelWidth"
              :read-only="formInfo3.readOnly"
              :list-type-info="listTypeInfo"
              @handleClick="handleClick"
              @handleEvent="handleEvent"
            />
            <span style="margin-left: 24px;color: red;">说明:PK计算中装备动力值=实际装备动力值*动力加权系数</span>
          </div>
          <h4 style="font-size: 13px;margin-bottom: 20px;">翻车概率加权</h4>
          <page-form
            :ref-obj.sync="formInfo4.ref"
            :data="formInfo4.data"
            :field-list="formInfo4.fieldList"
            :rules="formInfo4.rules"
            :label-width="formInfo4.labelWidth"
            :read-only="formInfo4.readOnly"
            :list-type-info="listTypeInfo"
            @handleClick="handleClick"
            @handleEvent="handleEvent"
          />
          <span style="margin-left: 24px;color: red;">说明:Pk计算中翻车概率=实际翻车概率*翻车概率加权系数</span>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { selectRobotPkRule, updateRobotPkRule } from '@/api/robot/rule/pk'
import PageForm from '@/components/PageForm'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
    PageForm
  },
  data() {
    const checkNumber = (rule, value, callback) => {
      const check = this.$validate({ label: '', value, rules: ['notnull', 'number'] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      // fetchAreaList,
      selectRobotPkRule,
      activeName: 'tab1',
      listTypeInfo: {
        statusList: []
      },
      status: 2,
      // 表单相关（追加、修改）
      formInfo: {
        refresh: 1,
        ref: null,
        readOnly: true,
        data: {
          itemCode: 'ROBOT_PK_RULE_MATCH',
          itemName: '同意PK邀请的性能分差异值(%)',
          sort: 1,
          itemValue: null
        },
        fieldList: [
          { label: '性能分差额', value: 'itemValue', type: 'input', className: 'el-form-block-20', append: 'append', fixtext: '%', required: true, validator: checkNumber, maxlength: 200 }
        ],
        rules: {},
        labelWidth: '140px'
      },
      formInfo1: {
        refresh: 1,
        ref: null,
        readOnly: true,
        data: {
          itemCode: 'ROBOT_PK_RULE_POWER_RATE',
          itemName: '马甲动力加权系数(%)',
          sort: 2,
          itemValue: null
        },
        fieldList: [
          { label: '动力加权系数', value: 'itemValue', type: 'input', className: 'el-form-block-20', append: 'append', fixtext: '%', required: true, validator: checkNumber, maxlength: 200 }
        ],
        rules: {},
        labelWidth: '140px'
      },
      formInfo2: {
        refresh: 1,
        ref: null,
        readOnly: true,
        data: {
          itemCode: 'ROBOT_PK_RULE_STABLE_RATE',
          itemName: '马甲稳定加权系数(%)',
          sort: 3,
          itemValue: null
        },
        fieldList: [
          { label: '稳定加权系数', value: 'itemValue', type: 'input', className: 'el-form-block-20', append: 'append', fixtext: '%', required: true, validator: checkNumber, maxlength: 200 }
        ],
        rules: {},
        labelWidth: '140px'
      },
      formInfo3: {
        refresh: 1,
        ref: null,
        readOnly: true,
        data: {
          itemCode: 'ROBOT_PK_RULE_CONTROL_RATE',
          itemName: '马甲操控加权系数(%)',
          sort: 4,
          itemValue: null
        },
        fieldList: [
          { label: '操控加权系数', value: 'itemValue', type: 'input', className: 'el-form-block-20', append: 'append', fixtext: '%', required: true, validator: checkNumber, maxlength: 200 }
        ],
        rules: {},
        labelWidth: '140px'
      },
      formInfo4: {
        refresh: 1,
        ref: null,
        readOnly: true,
        data: {
          itemCode: 'ROBOT_PK_RULE_EXTRA_RATE',
          itemName: '马甲翻车概率加权系数(%)',
          sort: 5,
          itemValue: null
        },
        fieldList: [
          { label: '翻车概率加权系数', value: 'itemValue', type: 'input', className: 'el-form-block-20', append: 'append', fixtext: '%', required: true, validator: checkNumber, maxlength: 200 }
        ],
        rules: {},
        labelWidth: '140px'
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
      if (this.formInfo.ref) {
        this.formInfo.ref.resetFields()
      }
      if (this.formInfo1.ref) {
        this.formInfo1.ref.resetFields()
      }
      if (this.formInfo2.ref) {
        this.formInfo2.ref.resetFields()
      }
      if (this.formInfo3.ref) {
        this.formInfo3.ref.resetFields()
      }
      if (this.formInfo4.ref) {
        this.formInfo4.ref.resetFields()
      }
      // 获取详细
      this.$handleAPI('', selectRobotPkRule, { 'configType': 'ROBOT_PK_RULE' }).then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          res.data.forEach(element => {
            if (element.itemCode === this.formInfo.data.itemCode) {
              this.formInfo.data.itemValue = element.itemValue
            }
            if (element.itemCode === this.formInfo1.data.itemCode) {
              this.formInfo1.data.itemValue = element.itemValue
            }
            if (element.itemCode === this.formInfo2.data.itemCode) {
              this.formInfo2.data.itemValue = element.itemValue
            }
            if (element.itemCode === this.formInfo3.data.itemCode) {
              this.formInfo3.data.itemValue = element.itemValue
            }
            if (element.itemCode === this.formInfo4.data.itemCode) {
              this.formInfo4.data.itemValue = element.itemValue
            }
          })
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo.rules = this.$initRules(this.formInfo.fieldList)
      this.formInfo1.rules = this.$initRules(this.formInfo1.fieldList)
      this.formInfo2.rules = this.$initRules(this.formInfo2.fieldList)
      this.formInfo3.rules = this.$initRules(this.formInfo3.fieldList)
      this.formInfo4.rules = this.$initRules(this.formInfo4.fieldList)
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'ruleEdit': {
          this.status = 1
          this.formInfo.readOnly = false
          this.formInfo1.readOnly = false
          this.formInfo2.readOnly = false
          this.formInfo3.readOnly = false
          this.formInfo4.readOnly = false
          break
        }
        case 'ruleSave': {
          var flag = true
          this.formInfo.ref.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          this.formInfo1.ref.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          this.formInfo2.ref.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          this.formInfo3.ref.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          this.formInfo4.ref.validate(valid => {
            if (!valid) {
              flag = false
            }
          })
          if (flag) {
            var sysConfigItems = []
            sysConfigItems.push(this.formInfo.data)
            sysConfigItems.push(this.formInfo1.data)
            sysConfigItems.push(this.formInfo2.data)
            sysConfigItems.push(this.formInfo3.data)
            sysConfigItems.push(this.formInfo4.data)
            const params = { 'sysConfigItems': sysConfigItems }
            this.$handleAPI('', updateRobotPkRule, params).then(res => {
              if (res.code === 200) {
                this.status = 2
                this.formInfo.readOnly = true
                this.formInfo1.readOnly = true
                this.formInfo2.readOnly = true
                this.formInfo3.readOnly = true
                this.formInfo4.readOnly = true
                this.$message({
                  showClose: true,
                  message: '保存成功',
                  type: 'success',
                  duration: 3500
                })
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error',
                  duration: 3500
                })
              }
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
