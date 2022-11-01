<template>
  <div class="tab-container">
    <el-row>
      <el-button v-if="dataPermits.includes('robotUpgrade:upgrade')" class="filter-item" type="primary" size="small" icon="el-icon-check" @click="handleClick('equipmentChange')">
        装备等级变更
      </el-button>
    </el-row>
    <br>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="装备等级调整" name="tab1">
        <span style="font-size: 16px;margin-left: 20px">选择马甲</span>
        <div class="form-merchant-container">
          <span style="font-size: 13px;margin-left: 30px;margin-right: 10px;">马甲标签</span>
          <template>
            <el-tag
              v-for="tag in tagArr"
              :key="tag"
              size="medium"
              closable
              :disable-transitions="false"
              @close="handleClose('closeTag', tag)"
            >
              {{ getTagName(tag) }}
            </el-tag>
          </template>
          <el-button class="button-new-tag" size="small" @click="handleClick('addTag')">{{ '添加标签' }}</el-button>
        </div>
        <span style="font-size: 16px;margin-left: 20px">装备等级调整</span>
        <div class="form-merchant-container">
          <el-row>
            <el-col :span="10">
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
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <page-dialog
      :title="dialogInfo.title"
      :visible.sync="dialogInfo.visible"
      :width="dialogInfo.width"
      :bt-loading="dialogInfo.btLoading"
      :bt-list="dialogInfo.btList"
      @handleClick="handleClick"
      @handleEvent="handleEvent"
    >
      <PopRobotTag :custom-query="{ diff: 1 }" @pickItem="pickRobotTag" @pickItemBatch="pickRobotTagBatch" />
    </page-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSelectByList } from '@/api/robot/tag/index'
import { robotEquipmentChange } from '@/api/robot/upgrade/index'
import PageForm from '@/components/PageForm'
import defaultImage from '@/assets/img/no-pic.jpg'
import PageDialog from '@/components/PageDialog'
import PopRobotTag from '@/components/Popup/PopRobotTag'

export default {
  components: {
    PageForm,
    PageDialog,
    PopRobotTag
  },
  data() {
    return {
      dialogFormVisible: false,
      // fetchAreaList,
      tagArr: [],
      activeName: 'tab1',
      listTypeInfo: {
        robotTagList: [],
        typeList: [
          {
            'itemName': '升级',
            'itemValue': 1
          },
          {
            'itemName': '降级',
            'itemValue': 2
          }
        ]
      },
      // 表单相关（追加、修改）
      formInfo1: {
        refresh: 1,
        ref: null,
        data: {
          carRadio: 1,
          carNum: '',
          engineRadio: 1,
          engineNum: '',
          steeringWheelRadio: 1,
          steeringWheelNum: '',
          tyreRadio: 1,
          tyreNum: ''
        },
        fieldList: [
          { label: '车辆', value: 'carRadio', type: 'customradio', list: 'typeList', key: 'itemValue', name: 'itemName' },
          { label: '', value: 'carNum', type: 'inputNumber', required: true, min: 0, max: 30 },
          { label: '引擎', value: 'engineRadio', type: 'customradio', list: 'typeList', key: 'itemValue', name: 'itemName' },
          { label: '', value: 'engineNum', type: 'inputNumber', required: true, min: 0, max: 30 },
          { label: '方向盘', value: 'steeringWheelRadio', type: 'customradio', list: 'typeList', key: 'itemValue', name: 'itemName' },
          { label: '', value: 'steeringWheelNum', type: 'inputNumber', required: true, min: 0, max: 30 },
          { label: '轮胎', value: 'tyreRadio', type: 'customradio', list: 'typeList', key: 'itemValue', name: 'itemName' },
          { label: '', value: 'tyreNum', type: 'inputNumber', required: true, min: 0, max: 30 }
        ],
        rules: {},
        labelWidth: '80px'
      },
      // 弹窗相关
      dialogInfo: {
        title: '选择标签',
        visible: false,
        type: '',
        btLoading: false,
        btList: []
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
    this.initList()
    this.getDetail()
    this.initDataPermits()
    // 验证规则
    this.initRules()
  },
  methods: {
    initList() {
      //  下拉框需要初始化加载的列表数据
      this.$handleAPI('', getSelectByList, '').then(res => {
        if (res.code === 200) {
          this.listTypeInfo.robotTagList = res.data
        }
      })
    },
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
    },
    // 初始化验证
    initRules() {
      this.formInfo1.rules = this.$initRules(this.formInfo1.fieldList)
    },
    pickRobotTag(data) {
      var flag = true
      if (this.tagArr !== null) {
        this.tagArr.forEach(element => {
          data.id += ''
          element += ''
          if (data.id === element) {
            this.$message({
              showClose: true,
              message: '该数据已添加请勿重复添加',
              type: 'error',
              duration: 3500
            })
            flag = false
          }
        })
      }
      if (flag) {
        if (data.id != null) {
          if (this.tagArr !== null) {
            this.tagArr.push(data.id)
          }
          if (this.tagArr === null) {
            this.tagArr = []
            this.tagArr.push(data.id + '')
          }
        }
        this.dialogInfo.visible = false
      }
    },
    pickRobotTagBatch(data) {
      var mag = '标签ID为 '
      var flag = true
      if (this.tagArr !== null) {
        this.tagArr.forEach(element => {
          data.forEach(robotInfo => {
            element += ''
            robotInfo.id += ''
            if (element === robotInfo.id) {
              flag = false
              mag += robotInfo.id + '   '
            }
          })
        })
      }
      if (!flag) {
        mag += '已添加，请勿重复添加'
        this.$message({
          showClose: true,
          message: mag,
          type: 'error',
          duration: 3500
        })
      }
      if (flag) {
        if (data !== null) {
          data.forEach(robotInfo => {
            if (this.tagArr !== null) {
              this.tagArr.push(robotInfo.id)
            }
            if (this.tagArr === null) {
              this.tagArr = []
              this.tagArr.push(robotInfo.id + '')
            }
          })
        }
        this.dialogInfo.visible = false
      }
    },
    getTagName(tagId) {
      var name = ' '
      try {
        this.listTypeInfo.robotTagList.forEach(element => {
          tagId = tagId + ''
          element.id = element.id + ''
          if (tagId === element.id) {
            name = element.tagName
          }
        })
      } catch (e) {
        // continue regardless of error
      }
      return name
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'addTag': {
          this.dialogInfo.visible = true
          break
        }
        case 'equipmentChange': {
          var flag = true
          this.formInfo1.ref.validate(valid => {
            if (valid) {
              if (this.tagArr.length < 1) {
                flag = false
              }
              if (flag) {
                const params = this.formInfo1.data
                params.tagList = this.tagArr.join(',')
                this.$handleAPI('', robotEquipmentChange, params).then(res => {
                  if (res.code === 200) {
                    this.$message({
                      showClose: true,
                      message: '变更成功',
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
              } else {
                this.$message({
                  showClose: true,
                  message: '马甲标签不能少于一个',
                  type: 'error',
                  duration: 3500
                })
              }
            }
          })
          break
        }
      }
    },
    // 触发事件
    handleEvent(event, data) {
      switch (event) {
        case 'changeCity': {
          break
        }
      }
    },
    handleClose(event, tag) {
      switch (event) {
        case 'closeTag': {
          this.tagArr.splice(this.tagArr.indexOf(tag), 1)
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tab-container {
    margin: 30px;
  }
  .el-tag{
    margin-right: 10px;
  }
  .form-merchant-container {
    margin: 30px
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
