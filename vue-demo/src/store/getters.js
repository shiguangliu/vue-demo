const getters = {
  // App模块
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  fullScreen: state => state.app.fullScreen,
  theme: state => state.settings.theme,
  // tags模块
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  // 员工模块
  token: state => state.staff.token,
  refreshToken: state => state.staff.refreshToken,
  staffId: state => state.staff.staffId,
  staffNo: state => state.staff.staffNo,
  avatar: state => state.staff.avatar,
  name: state => state.staff.name,
  phone: state => state.staff.phone,
  gender: state => state.staff.gender,
  mail: state => state.staff.mail,
  description: state => state.staff.description,
  roles: state => state.staff.roles,
  roleInfoList: state => state.staff.roleInfoList,
  staffType: state => state.staff.staffType,
  staffTypeName: state => state.staff.staffTypeName,
  currentSystemId: state => state.staff.currentSystemId,
  subSystemList: state => state.staff.subSystemList,
  subSystemInfoList: state => state.staff.subSystemInfoList,
  merchantList: state => state.staff.merchantList, // 商户ID列表
  merchantInfoList: state => state.staff.merchantInfoList, // 商户信息列表
  // 权限模块
  menu: state => state.permission.menu,
  dataPermits: state => state.permission.dataPermits,
  wsImOnline: state => state.ws.imOnline, // IM服务是否在线：1-在线 0-不在线
  // 日志
  errorLogs: state => state.errorLog.logs
}
export default getters
