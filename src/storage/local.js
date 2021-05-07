// 浏览器本地缓存方式
export const setStorage = (key, value) => localStorage.setItem(key, value)
export const getStorage = key => localStorage.getItem(key)
export const removeStorage = key => localStorage.removeItem(key)
export const clearStorage = () => localStorage.clear()

export default {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage
}

// 外面可以自选使用方式
// import Obj from '@/storage"
// Obj.setStorage('key', "值")

// import {setStorage} from '@/storage'
// setStorage('key', '值')
