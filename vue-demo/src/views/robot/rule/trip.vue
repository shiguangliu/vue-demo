<template>
  <div class="rule-trip-ontainer">
    <el-row>
      <el-button v-if="dataPermits.includes('robotTripRule:create')" class="filter-item" type="primary" size="small" icon="el-icon-check" @click="handleClick('addTripRule')">
        新增规则
      </el-button>
    </el-row>
    <br>
    <el-card v-for="(rankInfo, cardIndex) in tripRuleList" :key="cardIndex" class="box-card" style="margin-bottom: 30px;">
      <div slot="header" class="clearfix">
        <span style="float: left;font-size: 16px;">规则设置</span>
        <el-button v-if="dataPermits.includes('robotTripRule:delete')" v-waves size="mini" class="handle-button" style="float: right; margin-left:5px;" type="danger" icon="el-icon-delete" @click="deleteRankInfo(cardIndex,rankInfo)">删除</el-button>
        <el-button v-if="dataPermits.includes('robotTripRule:edit') & rankInfo.status == 2" v-waves size="mini" class="handle-button" style="float: right; margin-left:5px;" type="primary" icon="el-icon-edit" @click="editRankInfo(cardIndex,rankInfo)">编辑</el-button>
        <el-button v-if="dataPermits.includes('robotTripRule:save') & rankInfo.status == 1" v-waves size="mini" class="handle-button" style="float: right; margin-left:5px;" type="primary" icon="fa fa-floppy-o" @click="saveRankInfo(cardIndex,rankInfo)"> 保存</el-button>
      </div>
      <div class="form-merchant-container">
        <span style="font-size: 15px;margin-left: 95px;margin-right: 10px;">马甲标签</span>
        <template v-if="rankInfo.status==1">
          <el-tag
            v-for="tag in rankInfo.tagArr"
            :key="tag"
            size="medium"
            closable
            :disable-transitions="false"
            @close="handleClose('closeTag', tag, cardIndex)"
          >
            {{ getTagName(tag) }}
          </el-tag>
        </template>
        <template v-else>
          <el-tag
            v-for="tag in rankInfo.tagArr"
            :key="tag"
            size="medium"
            :disable-transitions="false"
            @close="handleClose('closeTag', tag, cardIndex)"
          >
            {{ getTagName(tag) }}
          </el-tag>
        </template>
        <el-button v-if="rankInfo.status=='1'" class="button-new-tag" size="small" @click="handleClick('addTag', cardIndex)"><i class="el-icon-plus" />{{ '添加标签' }}</el-button>
      </div>
      <br>
      <div class="slot-avatar" style="margin-top: 20px;">
        <page-form
          :ref-obj.sync="formInfo1.ref"
          :data="rankInfo"
          :field-list="formInfo1.fieldList"
          :rules="formInfo1.rules"
          :label-width="formInfo1.labelWidth"
          :read-only="rankInfo.readOnly"
          :list-type-info="listTypeInfo"
          @handleClick="handleClick"
          @handleEvent="handleEvent"
        />
      </div>
    </el-card>
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
import { getRobotTripRuleList, robotTripRuleInsert, robotTripRuleUpdate, robotTripRuleUpdateStatus } from '@/api/robot/rule/trip'
import { getSelectByList } from '@/api/robot/tag/index'
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
      activeName: 'tab1',
      listTypeInfo: {
        robotTagList: []
      },
      tagIndex: '',
      tagList: [],
      tripRuleList: [
        {
          id: '',
          tripCount: '',
          tripMiles: '',
          tripHours: '',
          triggerTime: '',
          tagList: '',
          status: '',
          tagArr: []
        }
      ],
      // 表单相关（追加、修改）
      formInfo1: {
        refresh: 1,
        ref: null,
        data: {
          tripMiles: null, // *唯一ID
          tripHours: null, // *基础值
          tagRate: null, // *单个标签加成
          triggerTime: null // 修改时间
        },
        fieldList: [
          { label: '单次新增累计里程(Km)', value: 'tripMiles', type: 'inputNumber', required: true, min: 0, maxlength: 11 },
          { label: '单次启程时长(h)', value: 'tripHours', type: 'inputNumber', required: true, min: 0, maxlength: 11 },
          { label: '单次新增次数(次)', value: 'tripCount', type: 'inputNumber', required: true, min: 0, maxlength: 11 },
          { label: '每日更新时间段', value: 'triggerTime', type: 'timepicker', required: true, className: 'el-form-inline-block-25' }
        ],
        rules: {},
        labelWidth: '200px'
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
      this.$handleAPI('', getRobotTripRuleList, '').then(res => {
        if (res.code === 200) {
          // form表单初始化数据
          res.data.forEach(element => {
            if (element.triggerTime !== null && element.triggerTime !== '') {
              element.triggerTime = new Date('2020-01-01 ' + element.triggerTime)
            }
          })
          this.tripRuleList = res.data
        }
      })
    },
    initList() {
    //  下拉框需要初始化加载的列表数据
      this.$handleAPI('', getSelectByList, '').then(res => {
        if (res.code === 200) {
          this.listTypeInfo.robotTagList = res.data
        }
      })
    },
    // 初始化验证
    initRules() {
      this.formInfo1.rules = this.$initRules(this.formInfo1.fieldList)
    },
    getTagName(tagId) {
      var name = ' '
      try {
        this.listTypeInfo.robotTagList.forEach(element => {
          element.id += ''
          if (tagId === element.id) {
            name = element.tagName + ' '
          }
        })
      } catch (e) {
        // continue regardless of error
      }
      return name
    },
    saveRankInfo(index, rankInfo) {
      this.formInfo1.ref.validate(valid => {
        if (valid) {
          if (this.tripRuleList[index].tagArr !== null) {
            this.tripRuleList[index].tagList = this.tripRuleList[index].tagArr.join(',')
          } else {
            this.$message({
              showClose: true,
              message: '马甲标签不能少于一个',
              type: 'error',
              duration: 3500
            })
            return
          }
          const mparam = this.tripRuleList[index]
          mparam.updateBy = this.$store.state.staff.staffId
          var dt1 = new Date(rankInfo.triggerTime)
          mparam.triggerTimeDate = this.$fn.switchTime(dt1, 'YYYY-MM-DD hh:mm:ss')
          this.$handleAPI('', robotTripRuleUpdate, mparam).then(res => {
            if (res.code === 200) {
              this.tripRuleList[index].status = res.data.status
              this.tripRuleList[index].readOnly = true
              this.$message({
                showClose: true,
                message: '保存成功',
                type: 'success',
                duration: 3500
              })
            } else {
              this.$message({
                showClose: true,
                message: '保存失败',
                type: 'error',
                duration: 3500
              })
            }
          })
        }
      })
    },
    editRankInfo(index, rankInfo) {
      const mparam = {
        'id': rankInfo.id,
        'status': 1,
        'updateBy': this.$store.state.staff.staffId
      }
      this.$handleAPI('', robotTripRuleUpdateStatus, mparam).then(res => {
        if (res.code === 200) {
          this.tripRuleList[index].status = 1
          this.tripRuleList[index].readOnly = false
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 3500
          })
        }
      })
    },
    deleteRankInfo(index, rankInfo) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const mparam = {
          'id': rankInfo.id,
          'deleteFlag': 1,
          'updateBy': this.$store.state.staff.staffId
        }
        this.$handleAPI('', robotTripRuleUpdateStatus, mparam).then(res => {
          if (res.code === 200) {
            this.tripRuleList.splice(this.tripRuleList.indexOf(rankInfo), 1)
          }
          this.$message({
            showClose: true,
            message: (res.code === 200) ? '操作成功' : res.message,
            type: (res.code === 200) ? 'success' : 'error',
            duration: 3500
          })
        })
      }).catch((e) => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    pickRobotTag(data) {
      var flag = true
      if (this.tripRuleList[this.tagIndex].tagArr !== null) {
        this.tripRuleList[this.tagIndex].tagArr.forEach(element => {
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
          if (this.tripRuleList[this.tagIndex].tagArr !== null) {
            this.tripRuleList[this.tagIndex].tagArr.push(data.id)
          }
          if (this.tripRuleList[this.tagIndex].tagArr === null) {
            this.tripRuleList[this.tagIndex].tagArr = []
            this.tripRuleList[this.tagIndex].tagArr.push(data.id + '')
          }
        }
        this.dialogInfo.visible = false
      }
    },
    pickRobotTagBatch(data) {
      var mag = '标签ID为 '
      var flag = true
      if (this.tripRuleList[this.tagIndex].tagArr !== null) {
        this.tripRuleList[this.tagIndex].tagArr.forEach(element => {
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
        if (data != null) {
          data.forEach(robotInfo => {
            if (this.tripRuleList[this.tagIndex].tagArr !== null) {
              this.tripRuleList[this.tagIndex].tagArr.push(robotInfo.id + '')
            }
            if (this.tripRuleList[this.tagIndex].tagArr === null) {
              this.tripRuleList[this.tagIndex].tagArr = []
              this.tripRuleList[this.tagIndex].tagArr.push(robotInfo.id + '')
            }
          })
        }
        this.dialogInfo.visible = false
      }
    },
    // 按钮点击
    handleClick(event, data) {
      switch (event) {
        case 'addTripRule': {
          const mparam = {
            'createBy': this.$store.state.staff.staffId
          }
          this.$handleAPI('', robotTripRuleInsert, mparam).then(res => {
            if (res.code === 200) {
              this.tripRuleList.push(res.data)
            }
          })
          break
        }
        case 'addTag': {
          this.tagIndex = data
          this.dialogInfo.visible = true
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
    },
    handleClose(event, tag, cardIndex) {
      switch (event) {
        case 'closeTag': {
          this.tripRuleList[cardIndex].tagArr.splice(this.tripRuleList[cardIndex].tagArr.indexOf(tag), 1)
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .rule-trip-ontainer {
    margin: 30px;
    .el-tag{
      margin-right: 10px;
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
  }
</style>
