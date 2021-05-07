import Vue from 'vue'
import App from './App.vue'
import router from './router' // 路由
import store from './store' // vuex
import 'amfe-flexible' // flexible(根据网页宽 - 自动修改html的font-size, 让所有rem适配)
import './VantComponent.js' // 注册全局Vant组件
import '@/router/permission.js' // 让路由权限代码执行
import '@/directives' // 全局指令
import '@/utils' // 全局工具方法
import '@/ui/Toast' // 全局轻提示

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
