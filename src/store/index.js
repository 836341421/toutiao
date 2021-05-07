import Vue from 'vue'
import Vuex from 'vuex'
import { setStorage, getStorage } from '@/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    refresh_token: getStorage('refresh_token'), // 网页刷新, vuex变量回归初始化
    token: getStorage('token') // 初始化的时候就从本地取token值
  },
  mutations: {
    setRefreshToken (state, refresh_token) {
      state.refresh_token = refresh_token
      setStorage('refresh_token', refresh_token) // 顺带往本地存一份
    },
    setToken (state, token) {
      state.token = token
      setStorage('token', token)
    },
    clearToken (state) {
      state.token = ''
    }
  },
  actions: {
  },
  modules: {
  }
})
