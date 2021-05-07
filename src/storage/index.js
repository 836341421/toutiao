// 浏览器本地缓存方式
export const setStorage = (key, value) => sessionStorage.setItem(key, value)
export const getStorage = key => sessionStorage.getItem(key)
export const removeStorage = key => sessionStorage.removeItem(key)
export const clearStorage = () => sessionStorage.clear()

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
