import Cookies from 'js-cookie'
const FixedCacheKey = process.env.VUE_APP_ROUTER_BASE // 缓存补充Key

const TokenKey = 'X-Token'
const TokenExpiredAtKey = 'X-Token-Expired-At'
const RefreshTokenKey = 'X-Refresh-Token'
const StaffIdKey = 'X-StaffId'

export function getToken() {
  return Cookies.get(FixedCacheKey + TokenKey)
}

export function setToken(token) {
  return Cookies.set(FixedCacheKey + TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(FixedCacheKey + TokenKey)
}

export function getTokenExpiredAt() {
  return Cookies.get(FixedCacheKey + TokenExpiredAtKey)
}

export function setTokenExpiredAt(expiredAt) {
  return Cookies.set(FixedCacheKey + TokenExpiredAtKey, expiredAt)
}

export function removeTokenExpiredAt() {
  return Cookies.remove(FixedCacheKey + TokenExpiredAtKey)
}

export function getRefreshToken() {
  return Cookies.get(FixedCacheKey + RefreshTokenKey)
}

export function setRefreshToken(refreshToken) {
  return Cookies.set(FixedCacheKey + RefreshTokenKey, refreshToken)
}

export function removeRefreshToken() {
  return Cookies.remove(FixedCacheKey + RefreshTokenKey)
}

export function getStaffId() {
  return Cookies.get(FixedCacheKey + StaffIdKey)
}

export function setStaffId(staffId) {
  return Cookies.set(FixedCacheKey + StaffIdKey, staffId)
}

export function removeStaffId() {
  return Cookies.remove(FixedCacheKey + StaffIdKey)
}
