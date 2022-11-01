<template>
  <div class="block">
    <el-timeline>
      <!-- <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item> -->
      <el-timeline-item
        v-for="(item,index) of timeline"
        :key="index"
        :timestamp="item.logintime + ' 由IP：' + item.ip + ' 登录系统'"
        placement="top"
      />
    </el-timeline>
  </div>
</template>

<script>
export default {
  props: {
    timeline: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      // timeline: [
      //   {
      //     timestamp: '2019/4/20',
      //     title: 'Update Github template',
      //     content: 'PanJiaChen committed 2019/4/20 20:46'
      //   },
      //   {
      //     timestamp: '2019/4/21',
      //     title: 'Update Github template',
      //     content: 'PanJiaChen committed 2019/4/21 20:46'
      //   },
      //   {
      //     timestamp: '2019/4/22',
      //     title: 'Build Template',
      //     content: 'PanJiaChen committed 2019/4/22 20:46'
      //   },
      //   {
      //     timestamp: '2019/4/23',
      //     title: 'Release New Version',
      //     content: 'PanJiaChen committed 2019/4/23 20:46'
      //   }
      // ]
    }
  }
}
</script>
