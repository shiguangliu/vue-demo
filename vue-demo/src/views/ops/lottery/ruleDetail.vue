<template>
  <div class="template-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="转盘券设置" name="tab1">
        <el-button v-if="dataPermits.includes('lotteryRule:edit') && disableFlag === true" type="primary" icon="el-icon-edit" @click="handleClick('edit')">编辑</el-button>
        <el-button v-if="dataPermits.includes('lotteryRule:save') && disableFlag === false" type="primary" icon="el-icon-check" @click="handleClick('save')">保存</el-button>
        <!-- el-form -->
        <el-divider />
        <el-form ref="ruleForm" :rules="rules" :model="lotteryRuleForm" style="margin: 0 auto;">
          <el-form-item
            prop="param1"
            label="转盘券发放数量"
            label-width="150px"
          >
            <el-input v-model="lotteryRuleForm.param1" :disabled="disableFlag" style="max-width: 220px" />
          </el-form-item>
          <el-form-item
            prop="param2"
            label="每次抽奖消耗数量"
            label-width="150px"
          >
            <el-input v-model="lotteryRuleForm.param2" :disabled="disableFlag" style="max-width: 220px" />
          </el-form-item>
          <el-form-item
            prop="param3"
            label="每日重置时间"
            label-width="150px"
          >
            <el-time-picker
              v-model="lotteryRuleForm.param3"
              :picker-options="{selectableRange: '00:00:00 - 23:59:59'}"
              placeholder="每日重置时间"
              :disabled="true"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getConfigItemsListApi, updateConfigItemsListApi } from '@/api/common'

export default {
  data() {
    const checkNumber = (rule, value, callback) => {
      const check = this.$validate({ label: '发放数量、消耗数量', value, rules: ['int', 'notnull', 'length'], conditions: [1, 1000] })
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    return {
      activeName: 'tab1',
      disableFlag: true,
      lotteryRuleForm: {
        param1: '',
        param2: '',
        param3: ''
      },
      configItemData: [
        { configId: 112, seqId: 1, configType: 'GAME_LOTTERY_SETTING', itemCode: 'GAME_LOTTERY_SETTING_DAILY_TIMES', itemValue: '', itemName: '', sort: '' },
        { configId: 112, seqId: 2, configType: 'GAME_LOTTERY_SETTING', itemCode: 'GAME_LOTTERY_SETTING_DRAW_COST', itemValue: '', itemName: '', sort: '' },
        { configId: 112, seqId: 3, configType: 'GAME_LOTTERY_SETTING', itemCode: 'GAME_LOTTERY_SETTING_RESET_AT', itemValue: '', itemName: '', sort: '' }
      ],
      rules: {
        param1: [{ validator: checkNumber, trigger: 'blur', required: true }],
        param2: [{ validator: checkNumber, trigger: 'blur', required: true }],
        param3: [{ trigger: 'blur', required: true }]
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
  watch: {
  },
  created() {
  },
  mounted() {
    this.initList()
  },
  methods: {
    initList() {
      this.$handleAPI('', getConfigItemsListApi, { 'configType': 'GAME_LOTTERY_SETTING' }).then(res => {
        if (res.code === 200) {
          let param3 = '00:00:00' // 重置时间默认：0点
          res.data.forEach(item => {
            if (item.itemCode === 'GAME_LOTTERY_SETTING_DAILY_TIMES') {
              this.lotteryRuleForm.param1 = item.itemValue
              this.configItemData[0].itemCode = item.itemCode
              this.configItemData[0].itemValue = item.itemValue
              this.configItemData[0].itemName = item.itemName
              this.configItemData[0].sort = item.sort
            }
            if (item.itemCode === 'GAME_LOTTERY_SETTING_DRAW_COST') {
              this.lotteryRuleForm.param2 = item.itemValue
              this.configItemData[1].itemCode = item.itemCode
              this.configItemData[1].itemValue = item.itemValue
              this.configItemData[1].itemName = item.itemName
              this.configItemData[1].sort = item.sort
            }
            if (item.itemCode === 'GAME_LOTTERY_SETTING_RESET_AT') {
              param3 = item.itemValue || '00:00:00'
              this.configItemData[2].itemCode = item.itemCode
              this.configItemData[2].itemValue = item.itemValue || '00:00:00'
              this.configItemData[2].itemName = item.itemName
              this.configItemData[2].sort = item.sort
            }
          })
          const timeArr = param3.split(':')
          this.lotteryRuleForm.param3 = new Date(2020, 12, 25, timeArr[0], timeArr[1], timeArr[2])
        }
      })
    },
    handleClick(event, data) {
      switch (event) {
        case 'edit': // 搜索
          this.disableFlag = false
          break
        case 'save': {
          // 状态不可读 校验规则
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              const newDate = this.lotteryRuleForm.param3
              var newHour = newDate.getHours()
              var newMinutes = newDate.getMinutes()
              var newSeconds = newDate.getSeconds()
              newHour = newHour < 10 ? '0' + newHour : newHour
              newMinutes = newMinutes < 10 ? '0' + newMinutes : newMinutes
              newSeconds = newSeconds < 10 ? '0' + newSeconds : newSeconds
              this.configItemData[0].itemValue = this.lotteryRuleForm.param1
              this.configItemData[1].itemValue = this.lotteryRuleForm.param2
              this.configItemData[2].itemValue = newHour + ':' + newMinutes + ':' + newSeconds
              // api
              var pArr = []
              for (const item of this.configItemData) {
                pArr.push(updateConfigItemsListApi(item))
              }
              if (pArr.length === 0) return
              let codeSum = 0
              Promise.all(pArr).then(res => {
                console.log(res)
                for (const item of res) {
                  codeSum += Number(item.code)
                }
                if (codeSum % 200 === 0) {
                  this.$message.success('设置成功')
                  this.disableFlag = true
                } else {
                  this.$message.error('设置失败')
                  this.disableFlag = false
                }
              }).catch(error => {
                this.$message({
                  showClose: true,
                  message: error,
                  type: 'error',
                  duration: 3500
                })
              })
            } else {
              this.$message.error('数据验证失败！')
              return false
            }
          })
          break
        }
      }
    }
  }
}
</script>

<style scoped>
  .template-container {
    padding: 0px;
    margin: 20px;
  }
  .image {
    width: 100%;
    display: block;
  }
</style>
