// 权限模块 - 设置路由守卫
import router from './index'
import store from '@/store'
router.beforeEach((to, from, next) => {
  // 目标: 如果有登录状态, 就禁止去登录页
  if (store.state.token && to.path === '/login') {
    next(false) // 禁止跳转
  } else {
    next()
  }
})

// 目标: 重新打开标签页, 为什么能去登录页
// 总结:
// url相同http://localhost:8080
// sessionStorage - 在不同标签页(不共享)
// localStorage - 不同标签页(共享)
// 新开标签页, 相当于重新执行一遍代码, vuex里token变量在本地sessionStorage没有取到值, 就导致if判断失效

// 临界值:
// 1. 已经登录 - token正确 - 去login  (v)
// 2. 未登录   - 无token   - 去login  (v)
// 3. 已经登录 - token过期 - 去login
// 删除vuex和本地的token -> 再跳转路由
