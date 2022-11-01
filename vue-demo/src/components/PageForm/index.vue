<template>
  <el-form
    ref="form"
    class="page-form"
    :class="className"
    :model="data"
    :rules="rules"
    :disabled="readOnly"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :validate-on-rule-change="false"
  >
    <el-form-item
      v-for="(item, index) in getConfigList()"
      v-show="(item.type === 'hidden' ? false : true)"
      :key="index"
      :prop="item.value"
      :label="item.label"
      :class="item.className"
    >
      <!-- solt -->
      <template v-if="item.type === 'slot'">
        <slot :name="'form-' + item.value" />
      </template>
      <!-- 普通输入框 -->
      <el-input
        v-if="item.type === 'input' || item.type === 'password'"
        v-model="data[item.value]"
        :type="item.type"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        :maxlength="item.maxlength"
        :minlength="item.minlength"
        clearable
        @focus="handleEvent(item.event)"
      >
        <template v-if="item.append === 'append'" slot="append">
          {{ item.fixtext }}
        </template>
        <template v-if="item.append === 'prepend'" slot="prepend">
          {{ item.fixtext }}
        </template>
      </el-input>
      <!-- 普通隐藏输入框 -->
      <el-input
        v-if="item.type === 'hidden'"
        v-model="data[item.value]"
        :type="item.type"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
      />
      <!-- 复合输入框 -->
      <el-input
        v-if="item.type === 'prepend' || item.type === 'append'"
        v-model="data[item.value]"
        :type="text"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
      >
        <template slot="{{ item.type }}">
          {{ item.fixtext }}
        </template>
      </el-input>
      <!-- 文本输入框 -->
      <el-input
        v-if="item.type === 'textarea'"
        v-model.trim="data[item.value]"
        :type="item.type"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        :autosize="item.autosize || {minRows: 2, maxRows: 10}"
        :show-word-limit="item.showLimit"
        :maxlength="item.maxlength"
        :minlength="item.minlength"
        @focus="handleEvent(item.event)"
        @blur="handleEvent(item.blur)"
      />
      <!-- 计数器 -->
      <el-input-number
        v-if="item.type === 'inputNumber'"
        v-model="data[item.value]"
        size="small"
        :min="item.min"
        :max="item.max"
        @change="handleEvent(item.event)"
      />
      <!-- 选择框 -->
      <el-select
        v-if="item.type === 'select'"
        v-model="data[item.value]"
        :disabled="item.disabled"
        :clearable="item.clearable"
        :filterable="item.filterable"
        :placeholder="getPlaceholder(item)"
        @change="handleEvent(item.event, data[item.value])"
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
        v-model="data[item.value]"
        :disabled="item.disabled"
        :clearable="item.clearable"
        :filterable="item.filterable"
        :placeholder="getPlaceholder(item)"
        @change="handleEvent(item.event, data[item.value], data)"
      >
        <el-option
          v-for="childItem in listTypeInfo[item.list]"
          :key="childItem[item.key]"
          :label="childItem[item.name]"
          :value="childItem[item.key]"
        />
      </el-select>
      <!-- 日期选择框 -->
      <el-date-picker
        v-if="item.type === 'date'"
        v-model="data[item.value]"
        :type="item.dateType"
        :value-format="item.valueFormat"
        :picker-options="item.TimePickerOptions"
        :clearable="item.clearable"
        :disabled="item.disabled"
        :placeholder="getPlaceholder(item)"
        @focus="handleEvent(item.event)"
      />
      <!-- 日期范围选择框 -->
      <el-date-picker
        v-if="item.type === 'datetimerange'"
        v-model="data[item.value]"
        :type="item.dateType"
        :picker-options="item.beforeAfterFlag === 'after' ? timePickerOptionsAfter : timePickerOptionsBefore"
        :clearable="item.clearable"
        :disabled="item.disabled"
        :default-time="item.defaultTime || []"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="handleEvent(item.event, data[item.value])"
      />
      <!-- 时间选择框 -->
      <el-time-picker
        v-if="item.type === 'timepicker'"
        v-model="data[item.value]"
        :picker-options="item.TimePickerOptions"
        :clearable="item.clearable"
        :disabled="item.disabled"
        placeholder="选择时间"
        @change="handleEvent(item.event, data[item.value])"
      />
      <!-- 时间范围选择框 -->
      <el-time-picker
        v-if="item.type === 'timerange'"
        v-model="data[item.value]"
        is-range
        :picker-options="item.TimePickerOptions"
        :clearable="item.clearable"
        :disabled="item.disabled"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="handleEvent(item.event, data[item.value])"
      />
      <!-- 单选项框组 -->
      <el-radio-group
        v-if="item.type === 'radio'"
        v-model="data[item.value]"
        :disabled="item.disabled"
        :filterable="item.filterable"
        @change="handleEvent(item.event, data[item.value])"
      >
        <el-radio
          v-for="childItem in listTypeInfo[item.list]"
          :key="childItem.key"
          :label="childItem.key"
        >{{ childItem.name }}
        </el-radio>
      </el-radio-group>
      <!-- 单选项框组 -->
      <el-radio-group
        v-if="item.type === 'customradio'"
        v-model="data[item.value]"
        :disabled="item.disabled"
        :filterable="item.filterable"
        @change="handleEvent(item.event, data[item.value])"
      >
        <el-radio
          v-for="childItem in listTypeInfo[item.list]"
          :key="childItem[item.key]"
          :label="childItem[item.key]"
        >{{ childItem[item.name] }}
        </el-radio>
      </el-radio-group>
      <!-- 多选框组 -->
      <el-checkbox-group
        v-if="item.type === 'checkbox'"
        v-model="data[item.value]"
        @change="handleEvent(item.event, data[item.value])"
      >
        <el-checkbox
          v-for="childItem in listTypeInfo[item.list]"
          :key="childItem.key"
          :label="childItem.key"
          :disabled="item.disabled"
        >{{ childItem.name }}
        </el-checkbox>
      </el-checkbox-group>
      <!-- 评分展示框 -->
      <el-rate
        v-if="item.type === 'rate'"
        v-model="data[item.value]"
        :disabled="item.disabled"
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
        @focus="handleEvent(item.event)"
      />
      <!-- 信息展示框 -->
      <el-tag v-if="item.type === 'tag'" effect="plain" size="medium">
        {{ $fn.getDataName({dataList: listTypeInfo[item.list], value: item.key || 'key', label: item.name || 'name', data: data[item.value]}) || '-' }}
        <template v-if="item.fixtext">
          {{ item.fixtext }}
        </template>
      </el-tag>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'PageForm',
  props: {
    // 自定义类名
    className: {
      type: String,
      default: ''
    },
    // 刷新
    refresh: {
      type: Number,
      default: 0
    },
    // Form只读属性
    readOnly: {
      type: Boolean,
      default: false
    },
    // 表单数据
    data: {
      type: Object,
      default: null
    },
    // 相关字段
    fieldList: {
      type: Array,
      default: null
    },
    // 验证规则
    rules: {
      type: Object,
      default: null
    },
    // 相关的列表
    listTypeInfo: {
      type: Object,
      default: null
    },
    // label宽度
    labelWidth: {
      type: String,
      default: '120px'
    },
    // label位置
    labelPosition: {
      type: String,
      default: 'right'
    },
    refObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      timePickerOptionsBefore: {
        shortcuts: [
          { text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          { text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          { text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      timePickerOptionsAfter: {
        shortcuts: [
          { text: '后一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          { text: '后一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          { text: '后三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  watch: {
    data: {
      handler: function(val) {
        // 将form实例返回到父级
        this.$emit('update:refObj', this.$refs.form)
      },
      deep: true // 深度监听
    },
    fieldList(val) {
      // 刷新按钮列表变更
      this.fieldList = val
      this.getConfigList()
    },
    refresh() { // 侦听字段列
      this.getConfigList()
    }
  },
  mounted() {
    // 将form实例返回到父级
    this.$emit('update:refObj', this.$refs.form)
  },
  methods: {
    // 获取字段列表
    getConfigList() {
      return this.fieldList.filter(item => !item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show))
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
    handleEvent(event, data, formData) {
      this.$emit('handleEvent', event, data, formData)
    },
    // 派发按钮点击事件
    handleClick(event, data) {
      this.$emit('handleClick', event, data)
    }
  }
}
</script>

<style lang="scss" scoped>
// 自定义form相关
.page-form{
  .el-form-item{
    display: inline-block;
    // float: left;
    width: 48%;
    .el-form-item__content{
      .el-input, .el-select, .el-textarea{
        width: 100%;
      }
      .el-tag{
        width: 100%;
        background-color: #FAFAFA; // #F5F7FA
        border: 1px solid #dfe6ec;
        color: #303133;
      }
      .el-input-number{
        .el-input{
          width: inherit;
        }
      }
      .el-date-editor--datetimerange.el-input__inner {
        width:350px;
      }
      .el-date-editor--timerange.el-input__inner {
        width:350px;
      }
    }
  }
  .el-form-block{
    display: block;
    width: 48%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-block-20{
    display: block;
    width: 20%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-block-30{
    display: block;
    width: 30%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-block-40{
    display: block;
    width: 40%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-block-50{
    display: block;
    width: 50%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-block-60{
    display: block;
    width: 60%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-block-70{
    display: block;
    width: 70%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-block-80{
    display: block;
    width: 80%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-block-90{
    display: block;
    width: 90%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-block-100{
    display: block;
    width: 96%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-inline-block{
    display: inline-block;
    width: 48%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-inline-block-20{
    display: inline-block;
    width: 20%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-inline-block-25{
    display: inline-block;
    width: 25%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-inline-block-30{
    display: inline-block;
    width: 30%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-inline-block-40{
    display: inline-block;
    width: 40%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-inline-block-50{
    display: inline-block;
    width: 50%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-inline-block-60{
    display: inline-block;
    width: 60%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-inline-block-70{
    display: inline-block;
    width: 70%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-inline-block-80{
    display: inline-block;
    width: 80%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-inline-block-90{
    display: inline-block;
    width: 90%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-inline-block-100{
    display: inline-block;
    width: 96%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
  .el-form-group{
    border-radius: 4px;
    background:#a1e6e8;
    display: block;
    width: 150px;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
}
.page-form-block{
  .el-form-item{
    display: block;
    .el-form-item__content{
      .el-input, .el-select, .el-textarea{
        width: inherit;
      }
      .el-tag{
        width: 100%;
      }
      .el-input-number{
        .el-input{
          width: inherit;
        }
      }
    }
  }
  .el-form-block{
    display: block;
    width: 100%;
    .el-form-item__content{
      .el-textarea{
        width: 100%;
      }
    }
  }
}
</style>
