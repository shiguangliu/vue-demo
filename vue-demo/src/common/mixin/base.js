import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'dataPermits'
    ])
  },
  methods: {
    // 初始化数据权限
    _initDataPermits(code, list) {
      for (const item of list) {
        if (this.dataPermits.includes(`${code}:${item.event}`)) {
          item.show = true
        }
      }
    }
  }
}
