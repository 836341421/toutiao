import Vue from 'vue'
Vue.directive('focus', {
  inserted (el) {
    if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
      el.focus()
    } else {
      // console.log(el) // vant组件van-search组件内div根标签
      // console.log(el.querySelector('input')) // 拿到内部原生input标签
      // 解决方案: 自己往里获取input
      el.querySelector('input').focus()
    }
  }
})
