<template>
  <div class="template-container ruleDetail">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="规则详情" name="tab1">
        <el-button v-if="dataPermits.includes('tripBonusRule:edit') && disableFlag && bonusDisableFlag && discountDisableFlag" type="primary" icon="el-icon-edit" @click="handleClick('edit')">编辑</el-button>
        <el-button v-if="dataPermits.includes('tripBonusRule:save') && (!bonusDisableFlag || !discountDisableFlag)" type="primary" icon="el-icon-check" @click="handleClick('save')">保存</el-button>
        <el-card class="box-card" style="margin-top: 20px;border-color: #13C0C5;">
          <div slot="header" class="clearfix">
            <span>启程收益计算</span>
            <el-button type="primary" icon="el-icon-plus" :disabled="disableFlag && bonusDisableFlag" style="float: right;" @click="handleClick('addBonusRule')">添加收益</el-button>
          </div>
          <!-- table -->
          <el-form ref="bonusRuleForm" :model="bonusRuleForm" style="margin: 0 auto;">
            <el-table
              align="center"
              :data="bonusRuleForm.list"
              stripe
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="50"
              />
              <el-table-column
                prop="tripFrom"
                label="当日累计启程区间From"
                width="200px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'list.' + scope.$index + '.tripFrom'"
                    :rules="{ required: true, trigger: 'blur', message: '区间必须为数字值' }"
                  >
                    <el-input v-model="scope.row.tripFrom" type="number" :disabled="bonusDisableFlag">
                      <template slot="append">KM</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="tripTo"
                label="当日累计启程区间To"
                width="200px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'list.' + scope.$index + '.tripTo'"
                    :rules="{ required: true, trigger: 'blur', message: '区间必须为数字值' }"
                  >
                    <el-input v-model="scope.row.tripTo" type="number" :disabled="bonusDisableFlag">
                      <template slot="append">KM</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column width="200px;">&nbsp;</el-table-column>
              <el-table-column
                prop="tripGold"
                label="每公里产生金币数"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'list.' + scope.$index + '.tripGold'"
                    :rules="{ required: true, trigger: 'blur', message: '金币必须为数字值' }"
                  >
                    <el-input v-model="scope.row.tripGold" type="number" step="0.01" class="tripInput" :disabled="bonusDisableFlag">
                      <template slot="append">个</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="adGold"
                label="每公里广告产生金币数"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'list.' + scope.$index + '.adGold'"
                    :rules="{ required: true, trigger: 'blur', message: '金币必须为数字值' }"
                  >
                    <el-input v-model="scope.row.adGold" type="number" step="0.01" class="tripInput" :disabled="bonusDisableFlag">
                      <template slot="append">个</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column width="100px">
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-delete" :disabled="bonusDisableFlag" @click="handleClick('deleteBonusRuleItem', scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px;border-color: #13C0C5;">
          <div slot="header" class="clearfix">
            <span>超速收益折扣</span>
            <el-button type="primary" icon="el-icon-plus" :disabled="disableFlag && discountDisableFlag" style="float: right;" @click="handleClick('addBonusDiscountRule')">添加折扣</el-button>
          </div>
          <el-form ref="bonusDiscountRuleForm" :model="bonusDiscountRuleForm" style="margin: 0 auto;">
            <el-table
              align="center"
              :data="bonusDiscountRuleForm.list"
              stripe
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="50"
              />
              <el-table-column
                prop="speedFrom"
                label="超速区间From"
                width="200px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'list.' + scope.$index + '.speedFrom'"
                    :rules="{ required: true, trigger: 'blur', message: '区间必须为数字值' }"
                  >
                    <el-input v-model="scope.row.speedFrom" type="number" :disabled="discountDisableFlag">
                      <template slot="append">km/h</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="speedTo"
                label="超速区间To"
                width="200px"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'list.' + scope.$index + '.speedTo'"
                    :rules="{ required: true, trigger: 'blur', message: '区间必须为数字值' }"
                  >
                    <el-input v-model="scope.row.speedTo" type="number" :disabled="discountDisableFlag">
                      <template slot="append">km/h</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column width="200px;">&nbsp;</el-table-column>
              <el-table-column
                prop="tripDiscount"
                label="里程收益折扣"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'list.' + scope.$index + '.tripDiscount'"
                    :rules="{ required: true, trigger: 'blur', message: '折扣必须为数字值' }"
                  >
                    <el-input v-model="scope.row.tripDiscount" type="number" class="tripInput" :disabled="discountDisableFlag">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="adDiscount"
                label="广告收益折扣"
              >
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'list.' + scope.$index + '.adDiscount'"
                    :rules="{ required: true, trigger: 'blur', message: '折扣必须为数字值' }"
                  >
                    <el-input v-model="scope.row.adDiscount" type="number" class="tripInput" :disabled="discountDisableFlag">
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column width="100px">
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-delete" :disabled="discountDisableFlag" @click="handleClick('deleteBonusDiscountRuleItem', scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getBonusRuleListApi, getBonusDiscountRuleListApi, createBonusRuleApi, createBonusDiscountRuleApi, updateBonusRuleApi, updateBonusDiscountRuleApi } from '@/api/fztripbonusrule'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  components: {
  },
  data() {
    return {
      activeName: 'tab1',
      bonusRuleForm: {
        list: [
          { tripFrom: '', tripTo: '', adGold: '', tripGold: '' }
        ]
      },
      bonusDisableFlag: true,
      bonusDiscountRuleForm: {
        list: [
          { speedFrom: '', speedTo: '', adDiscount: '', tripDiscount: '' }
        ]
      },
      discountDisableFlag: true,
      disableFlag: true,
      bonusRuleList: [],
      bonusDiscountRuleList: []
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits',
      'staffId'
    ]),
    nopicture() {
      return 'this.src="' + this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
    }
  },
  created() {
  },
  mounted() {
    this.initList()
  },
  methods: {
    initList() {
      this.initBonusRuleList()
      this.initBonusDiscountRuleList()
    },
    initBonusRuleList() {
      this.$handleAPI('', getBonusRuleListApi, {}).then(res => {
        if (Number(res.code) === 200) {
          this.bonusRuleList = res.data
          this.bonusRuleForm.list = res.data
        }
      }).catch((error) => {
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          duration: 3500
        })
      })
    },
    initBonusDiscountRuleList() {
      this.$handleAPI('', getBonusDiscountRuleListApi, {}).then(res => {
        if (Number(res.code) === 200) {
          this.bonusDiscountRuleList = res.data
          this.bonusDiscountRuleForm.list = res.data
        }
      }).catch((error) => {
        this.$message({
          showClose: true,
          message: error,
          type: 'error',
          duration: 3500
        })
      })
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'edit': // 搜索
          this.disableFlag = false
          this.bonusDisableFlag = false
          this.discountDisableFlag = false
          break
        case 'addBonusRule': {
          // list加一条空数据
          const newLine = { tripFrom: 0, tripTo: 0, tripGold: 0, adGold: 0, createBy: this.staffId, updateBy: this.staffId }
          if (JSON.stringify(this.bonusRuleList).indexOf(JSON.stringify(newLine)) !== -1) {
            this.$message({
              showClose: true,
              message: '请勿重复添加',
              type: 'error',
              duration: 3500
            })
            return
          }
          this.bonusRuleList.push(newLine)
          break
        }
        case 'deleteBonusRuleItem': {
          // 删除单条目数据
          this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (data.id === undefined) {
              const index = this.bonusRuleList.indexOf(data)
              this.bonusRuleList.splice(index, 1)
            } else {
              // api
              const props = { id: data.id, deleteFlag: 1, updateBy: this.staffId }
              this.$handleAPI('', updateBonusRuleApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.initBonusRuleList()
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
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
          break
        }
        case 'addBonusDiscountRule': {
          // list加一条空数据
          const newLine = { speedFrom: 0, speedTo: 0, tripDiscount: 0, adDiscount: 0, createBy: this.staffId, updateBy: this.staffId }
          if (JSON.stringify(this.bonusDiscountRuleList).indexOf(JSON.stringify(newLine)) !== -1) {
            this.$message({
              showClose: true,
              message: '请勿重复添加',
              type: 'error',
              duration: 3500
            })
            return
          }
          this.bonusDiscountRuleList.push(newLine)
          break
        }
        case 'deleteBonusDiscountRuleItem': {
          // 删除单条目数据
          this.$confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (data.id === undefined) {
              const index = this.bonusDiscountRuleList.indexOf(data)
              this.bonusDiscountRuleList.splice(index, 1)
            } else {
              // api
              const props = { id: data.id, deleteFlag: 1, updateBy: this.staffId }
              this.$handleAPI('', updateBonusDiscountRuleApi, props).then(res => {
                if (Number(res.code) === 200) {
                  this.initBonusDiscountRuleList()
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
          }).catch((e) => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
          break
        }
        case 'save': {
          var errStr = ''
          // api
          this.$refs['bonusRuleForm'].validate((valid) => {
            if (valid) {
              // 规则里程校验: 0~5 6~10
              var tripFromMin = 0
              var tripToMin = 0
              for (const item of this.bonusRuleForm.list) {
                if (Number(item.tripFrom) >= Number(item.tripTo)) {
                  errStr += '收益计算规则' + item.tripFrom + '~' + item.tripTo + '区间值不合理 '
                  this.$message.error(errStr)
                  return
                }
                if (tripToMin !== 0) {
                  if ((Number(item.tripFrom) >= tripFromMin && Number(item.tripFrom) <= tripToMin) || (Number(item.tripTo) >= tripFromMin && Number(item.tripTo) <= tripToMin)) {
                    errStr += '收益计算规则' + item.tripFrom + '~' + item.tripTo + '区间值不合理 '
                    this.$message.error(errStr)
                    return
                  }
                }
                tripFromMin = Number(item.tripFrom)
                tripToMin = Number(item.tripTo)
              }
              var pArr = []
              for (const item of this.bonusRuleForm.list) {
                if (item.id === undefined) {
                  // 新增
                  pArr.push(createBonusRuleApi(item))
                } else {
                  // 编辑
                  pArr.push(updateBonusRuleApi(item))
                }
              }
              if (pArr.length === 0) return
              let codeSum = 0
              Promise.all(pArr).then(res => {
                for (const item of res) {
                  codeSum += Number(item.code)
                }
                if (codeSum % 200 === 0) {
                  this.$message.success('设置收益计算规则成功')
                  this.disableFlag = true
                  this.bonusDisableFlag = true
                } else {
                  this.$message.error('设置收益计算规则失败')
                  this.disableFlag = false
                  this.bonusDisableFlag = false
                }
                // this.initBonusRuleList()
              }).catch(error => {
                this.$message({
                  showClose: true,
                  message: error,
                  type: 'error',
                  duration: 3500
                })
              })
            } else {
              this.$message.error('表单验证失败！')
              return false
            }
          })
          this.$refs['bonusDiscountRuleForm'].validate((valid) => {
            if (valid) {
              var speedFromMin = 0
              var speedToMin = 0
              for (const item of this.bonusDiscountRuleForm.list) {
                if (Number(item.speedFrom) >= Number(item.speedTo)) {
                  errStr += '超速收益折扣' + item.speedFrom + '~' + item.speedTo + '区间值不合理'
                  this.$message.error(errStr)
                  return
                }
                if (speedToMin !== 0) {
                  if ((Number(item.speedFrom) >= speedFromMin && Number(item.speedFrom) <= speedToMin) || (Number(item.speedTo) >= speedFromMin && Number(item.speedTo) <= speedToMin)) {
                    errStr += '超速收益折扣' + item.speedFrom + '~' + item.speedTo + '区间值不合理'
                    this.$message.error(errStr)
                    return
                  }
                }
                speedFromMin = Number(item.speedFrom)
                speedToMin = Number(item.speedTo)
              }
              var dArr = []
              for (const item of this.bonusDiscountRuleForm.list) {
                if (item.id === undefined) {
                  // 新增
                  dArr.push(createBonusDiscountRuleApi(item))
                } else {
                  // 编辑
                  dArr.push(updateBonusDiscountRuleApi(item))
                }
              }
              if (dArr.length === 0) return
              Promise.all(dArr).then(res => {
                let codeSum = 0
                for (const item of res) {
                  codeSum += Number(item.code)
                }
                if (codeSum % 200 === 0) {
                  this.$message.success('设置超速收益折扣规则成功')
                  this.disableFlag = true
                  this.discountDisableFlag = true
                } else {
                  this.$message.error('设置超速收益折扣规则失败')
                  this.disableFlag = false
                  this.discountDisableFlag = false
                }
                // this.initBonusDiscountRuleList()
              }).catch(error => {
                this.$message({
                  showClose: true,
                  message: error,
                  type: 'error',
                  duration: 3500
                })
              })
            } else {
              this.$message.error('表单验证失败！')
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
  .el-form-item--mini.el-form-item {
    margin-bottom: 0px !important;
  }
  .el-form-item__error {
    position: relative;
  }
  .el-table {
    height: auto;
  }
  .el-input-group__append {
    padding: 0 15px !important;
  }
</style>
<style lang="scss">
  .ruleDetail {
    .el-form-item__error {
      position: relative;
    }
    .tripInput {
      width: 70%;
    }
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
  }
</style>
