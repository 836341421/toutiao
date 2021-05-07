import Vue from 'vue'
import { Toast as Toast2 } from 'vant'

const Toast = ({ icon = 'success', message }) => {
  Toast2({
    icon,
    message,
    duration: 1000
  }) // 一旦调用就页面出顶部通知了
  // 万一以后换了提示的组件方法, 直接换这里东西即可
  // 例如:
  /*
      import {ABC} from 'xxx'
      ABC({
          t: type,
          m: message
      })
    */
}

Vue.prototype.$Toast = Toast
