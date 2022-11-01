import Cookies from 'js-cookie'
const FixedCacheKey = process.env.VUE_APP_ROUTER_BASE // 缓存补充Key

/**
 * 对cookie操作
 */
export function setCookie(key, value, params, type) {
  if (!key) return
  key = FixedCacheKey + key
  if (type === 'JSON') {
    value = JSON.stringify(value)
  }
  Cookies.set(key, value, params)
}
export function getCookie(key, type) {
  key = FixedCacheKey + key
  if (!Cookies.get(key)) {
    return
  }
  if (type === 'JSON') {
    return JSON.parse(Cookies.get(key))
  } else {
    return Cookies.get(key)
  }
}
export function removeCookie(key) {
  key = FixedCacheKey + key
  return Cookies.remove(key)
}

/**
 * 对sessionStorage操作
 */
export const setSessionStorage = (key, value, type) => {
  if (!key) return
  key = FixedCacheKey + key
  if (type === 'JSON') {
    value = JSON.stringify(value)
  }
  sessionStorage.setItem(key, value)
}

export const getSessionStorage = (key, type) => {
  key = FixedCacheKey + key
  if (!sessionStorage.getItem(key)) {
    return
  }
  if (type === 'JSON') {
    return JSON.parse(sessionStorage.getItem(key))
  } else {
    return sessionStorage.getItem(key)
  }
}

export const removeSessionStorage = key => {
  key = FixedCacheKey + key
  if (!key) return
  sessionStorage.removeItem(key)
}

/**
 * 对localStorage操作
 */
export const setLocalStorage = (key, value, type) => {
  if (!key) return
  key = FixedCacheKey + key
  if (type === 'JSON') {
    value = JSON.stringify(value)
  }
  localStorage.setItem(key, value)
}
export const getLocalStorage = (key, type) => {
  key = FixedCacheKey + key
  if (!localStorage.getItem(key)) {
    return
  }
  if (type === 'JSON') {
    return JSON.parse(localStorage.getItem(key))
  } else {
    return localStorage.getItem(key)
  }
}
export const removeLocalStorage = key => {
  if (!key) return
  key = FixedCacheKey + key
  localStorage.removeItem(key)
}
