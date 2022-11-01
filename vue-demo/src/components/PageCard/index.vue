<template>
  <el-card
    class="page-card"
    :class="className"
  >
    <div
      slot="header"
      class="clearfix"
    >
      <span class="title" :style="`color: ${theme}`">{{ title }}</span>
      <i
        :title="title"
        class="el-icon-info"
        style="float: right; padding: 3px 0; color: rgb(150, 150, 150)"
      />
    </div>
    <ul class="info">
      <li
        v-for="(item, index) in fieldList"
        :key="index"
        class="item"
      >
        <span
          class="label"
          :style="`width: ${lableWidth}; text-align: ${textAligin};`"
        >{{ item.label }}</span>
        <span class="value">{{ $fn.getDataName({dataList: listTypeInfo[item.list], value: 'key', label: 'name', data: data[item.value]}) || '-' }}</span>
      </li>
    </ul>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    className: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    textAligin: {
      type: String,
      default: 'left'
    },
    lableWidth: {
      type: String,
      default: '100px'
    },
    data: {
      type: Object,
      default: null
    },
    fieldList: {
      type: Array,
      default: null
    },
    listTypeInfo: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'theme'
    ])
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/mixin.scss';
  .page-card{
    .title{
      font-size: 16px;
    }
    .info{
      .item{
        padding: 7px;
        .label, .value{
          display: inline-block;
        }
        .label{
          font-size: 13px;
          color: rgb(150, 150, 150);
        }
        .value{
          padding-left: 10px;
          color: rgb(100, 100, 100);
        }
      }
    }
  }
</style>
