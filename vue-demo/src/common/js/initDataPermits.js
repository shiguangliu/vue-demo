import store from '@/store'

export default (code, list) => {
  let changed = false
  for (const item of list) {
    if (store.getters.dataPermits.includes(`${code}:${item.event}`)) {
      item.show = true
      changed = true
    }
  }
  // refresh
  if (changed) {
    list = list.sort()
  }
}
