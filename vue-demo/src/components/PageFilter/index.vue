<template>
  <div
    class="page-filter"
    :class="className"
  >
    <el-row
      v-for="(itemrow, indexrow) in configList"
      :key="indexrow"
    >
      <el-col
        v-for="(item, index) in itemrow"
        :key="index"
        class="filter-item"
        :span="rowItemSpan"
      >
        <el-col :span="6"><label v-if="item.type !== 'button'" class="filter-label">{{ item.label }}</label></el-col>
        <el-col v-if="item.type !== 'button'" :span="16">
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 'input'"
            v-model="searchQuery[item.value]"
            :class="`filter-${item.type}`"
            :type="item.type"
            :disabled="item.disabled"
            :clearable="item.clearable === false ? item.clearable : true"
            :placeholder="getPlaceholder(item)"
            @focus="handleEvent(item.event)"
          >
            <template v-if="item.append === 'append'" slot="append">
              {{ item.fixtext }}
            </template>
          </el-input>
          <!-- 选择框 -->
          <el-select
            v-if="item.type === 'select'"
            v-model="searchQuery[item.value]"
            :class="`filter-${item.type}`"
            :disabled="item.disabled"
            :clearable="item.clearable === false ? item.clearable : true"
            :filterable="item.filterable === false ? item.filterable : true"
            :placeholder="getPlaceholder(item)"
            @change="handleEvent(item.event)"
          >
            <el-option
              v-for="(childItem, childIndex) in listTypeInfo[item.list]"
              :key="childIndex"
              :label="childItem.name"
              :value="childItem.key"
            />
          </el-select>
          <!-- 自定义选择框 -->
          <el-select
            v-if="item.type === 'customselect'"
            v-model="searchQuery[item.value]"
            :class="`filter-${item.type}`"
            :disabled="item.disabled"
            :clearable="item.clearable === false ? item.clearable : true"
            :filterable="item.filterable === false ? item.filterable : true"
            :placeholder="getPlaceholder(item)"
            @change="handleEvent(item.event)"
          >
            <el-option
              v-for="childItem in listTypeInfo[item.list]"
              :key="childItem[item.key]"
              :label="childItem[item.name]"
              :value="childItem[item.key]"
            />
          </el-select>
          <!-- 时间选择框 -->
          <el-time-select
            v-if="item.type === 'time'"
            v-model="searchQuery[item.value]"
            :class="`filter-${item.type}`"
            :picker-options="item.TimePickerOptions"
            :clearable="item.clearable === false ? item.clearable : true"
            :disabled="item.disabled"
            :placeholder="getPlaceholder(item)"
          />
          <!-- 日期选择框 -->
          <el-date-picker
            v-if="item.type === 'date'"
            v-model="searchQuery[item.value]"
            :class="`filter-${item.type}`"
            :picker-options="item.datePickerOptions || datePickerOptions"
            :type="item.dateType"
            :value-format="item.valueFormat || 'yyyy-MM-dd'"
            :clearable="item.clearable === false ? item.clearable : true"
            :disabled="item.disabled"
            :placeholder="getPlaceholder(item)"
            @focus="handleEvent(item.event)"
          />
          <!-- 日期范围选择框 -->
          <el-date-picker
            v-if="item.type === 'datetimerange'"
            v-model="searchQuery[item.value]"
            :class="`filter-${item.type}`"
            :picker-options="item.TimePickerOptions || pickerOptions"
            :type="item.dateType"
            :value-format="item.valueFormat || 'yyyy-MM-dd'"
            :clearable="item.clearable === false ? item.clearable : true"
            :disabled="item.disabled"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="handleEvent(item.event, searchQuery[item.value])"
          />
          <!-- 时间范围选择框 -->
          <el-time-picker
            v-if="item.type === 'timerange'"
            v-model="searchQuery[item.value]"
            is-range
            :class="`filter-${item.type}`"
            :picker-options="item.TimePickerOptions"
            :clearable="item.clearable"
            :disabled="item.disabled"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="handleEvent(item.event, data[item.value])"
          />
        </el-col>
      </el-col>
    </el-row>
    <el-row v-if="((leftButtonList.length || 0) > 0 || (rightButtonList.length || 0) > 0 )">
      <div class="filter-item-left">
        <div
          v-for="(item, index) in leftButtonList"
          :key="index"
          class="filter-item"
        >
          <!-- 按钮 -->
          <el-button
            v-if="item.type === 'button'"
            v-waves
            :class="`filter-${item.type}`"
            :type="item.btType"
            :icon="item.icon"
            @click="handleClick(item.event)"
          >
            {{ item.label }}
          </el-button>
        </div>
      </div>
      <div class="filter-item-right">
        <div
          v-for="(item, index) in rightButtonList"
          :key="index"
          class="filter-item"
        >
          <!-- 按钮 -->
          <el-button
            v-if="item.type === 'button'"
            v-waves
            :class="`filter-${item.type}`"
            :type="item.btType"
            :icon="item.icon"
            @click="handleClick(item.event)"
          >
            {{ item.label }}
          </el-button>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'PageFilter',
  props: {
    // 自定义类名
    className: {
      type: String,
      default: ''
    },
    // 相关列表
    listTypeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 过滤器列表
    filterList: {
      type: Array,
      default: null
    },
    // 每行检索条件数
    rowItemCount: {
      type: Number,
      default: 4
    },
    // 参数
    query: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 条件区按钮
      configList: [],
      // 左边按钮区按钮
      leftButtonList: [],
      // 右边按钮区按钮
      rightButtonList: [],
      // 时间相关设置
      datePickerOptions: {
        disabledDate(time) {
          // 大于当前的时间都不能选 (+十分钟让点击此刻的时候可以选择到当前时间)
          // return time.getTime() > +new Date() + 1000 * 600 * 1
        }
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      flag: 'inner', // 内 inner  外outside
      searchQuery: {}
    }
  },
  computed: {
    rowItemSpan() { // 每列占栅格数
      let itemSpan = 6
      if (this.rowItemCount === 2) {
        itemSpan = 12
      } else if (this.rowItemCount === 3) {
        itemSpan = 8
      } else if (this.rowItemCount === 4) {
        itemSpan = 6
      }
      return itemSpan
    }
  },
  watch: {
    searchQuery: {
      handler: function(val) {
        // 传入参数修改，不派发
        if (this.flag === 'outside') {
          this.flag = 'inner'
          return
        }
        // 修改传入进来的参数
        this.$emit('update:query', { ...this.query, ...val })
      },
      deep: true // 深度监听
    },
    query(val) {
      this.flag = 'outside' // 标识为传入参数修改
      this.searchQuery = val
    },
    filterList(val) {
      // 刷新按钮列表变更
      this.getConfigList()
    }
  },
  created() {
  },
  mounted() {
    this.initParams()
  },
  methods: {
    initParams() {
      const obj = {}
      for (const key in this.query) {
        if (this.query[key]) {
          obj[key] = this.query[key]
        }
      }
      this.searchQuery = obj
      // 刷新按钮列表变更
      this.getConfigList()
    },
    // 获取列表
    getConfigList() {
      const filteritems = this.filterList.filter(item => (!item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show)) && ((!item.hasOwnProperty('type') || item.type !== 'button')))
      const configList = []
      let configrowitems = [] // 每行4组条件项
      const itemCount = this.rowItemCount <= 0 ? 4 : this.rowItemCount
      for (let i = 0; i < filteritems.length; i++) {
        configrowitems.push(filteritems[i])
        if ((i + 1) % itemCount === 0 || (i + 1) === filteritems.length) {
          configList.push(configrowitems)
          configrowitems = []
        }
      }

      // 按钮区按钮整理
      // 获取左边按钮区按钮列表
      this.leftButtonList = this.filterList.filter(item => !item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show) && (item.hasOwnProperty('type') && item.type === 'button' && (item.hasOwnProperty('float')) && item.float === 'left'))
      // 获取右边按钮区按钮列表
      this.rightButtonList = this.filterList.filter(item => !item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show) && (item.hasOwnProperty('type') && item.type === 'button' && (!item.hasOwnProperty('float')) || item.float === 'right'))
      this.configList = configList
    },
    // 得到placeholder的显示
    getPlaceholder(row) {
      let placeholder
      if (row.type === 'input' || row.type === 'textarea') {
        placeholder = '请输入' + row.label
      } else if (row.type === 'select' || row.type === 'time' || row.type === 'date') {
        placeholder = '请选择' + row.label
      } else {
        placeholder = row.label
      }
      return placeholder
    },
    // 绑定的相关事件
    handleEvent(event, data) {
      this.$emit('handleEvent', event, data)
    },
    // 派发按钮点击事件
    handleClick(event, data) {
      this.$emit('handleClick', event, data)
    }
  }
}
</script>

<style lang="scss" scoped>
// 自定义过滤相关
.page-filter {
  padding-bottom: 15px;
  .filter-item {
    display: inline-flex;
    align-items: center;
    margin-bottom: 5px;
  }
  .filter-label{
    padding-right: 5px;
    font-size: 14px;
    color: #606266;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .filter-input, .filter-time, .filter-date, .filter-select{
    width: 100%;
  }
  .filter-datetimerange{
    min-width: 200px;
    width: 100%;
  }
  .filter-customselect{
    min-width: 200px;
  }
  .filter-item-right {
    float: right;
  }
  .filter-item-left {
    float: left;
  }
  .filter-button {
    display: inline-flex;
    align-items: center;
    margin-bottom: 5px;
    margin-right: 5px;
  }
}
</style>
