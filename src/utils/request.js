import axios1 from 'axios'
import store from '@/store' // 当前不是vue组件, this也不是组件对象访问不了$store, 所以单独把store对象请过来
import to from '@/utils/awaitTo' // 把to函数请过来-让它包装住axios请求, 把结果处理成数组再返回到业务页面中
import Notify from '@/ui/Notify'
import router from '@/router'
import { removeStorage } from '@/storage'
// axios.defaults.baseURL = 'http://toutiao-app.itheima.net'
// axios.defaults.baseURL = 'http://api-toutiao-web.itheima.net/app'
// export default axios // 让外面使用带基地址的axios方法

// import jsonBig from 'json-bigint'
var JSONbigString = require('json-bigint')({ storeAsString: true })
const axios = axios1.create({
  baseURL: 'http://toutiao-app.itheima.net',
  // 对axios接收响应数据-手动转换处理
  transformResponse: [function (data) { // data是后台返回的JSON字符串
    // 对 data 进行任意转换处理
    // 不用JSON.parse因为它处理不了大数
    // jsonBig.parse来转换JSON字符串, 遇到大数会转成BigNumber类型
    // JS默认只能支持16位的数字精度..
    // 目标: 它默认把大数转成BigNumber{art_id: BigNumber}
    // 大数以字符串的形式放在数据对象里{art_id: "1390000212312312312521"}
    // 204响应(DELETE删除成功的相应状态码, 当data里无数据, 我不用JSON转换)
    if (data.length !== 0) {
      return JSONbigString.parse(data)
    } else {
      return data
    }
  }]
})

// 目标: 无登录, 也可以看首页
// 判断有token才携带token(拿某个用户的首页频道数据)
// 必须让后台配合
// 反例: 如果后台要求你频道必须传token, 必须登录后才能看首页
// 正例: 你不传token, 后台默认给你返回7个频道, 免登陆看首页

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  if (store.state.token) {
    // 统一添加了Authorization头-携带身份标识
    config.headers.Authorization = 'Bearer ' + store.state.token
  }
  // console.log(config)
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) { // response就是响应对象就是res (成功响应 2xx状态 3xx状态进这里)
  // 对响应数据做点什么
  return response
}, function (error) { // 4xx或5xx状态
  if (error?.response?.status === 401) { // 无权限 - 处理
    Notify({ type: 'danger', message: 'token过期-请重新登录' })
    // token已经过期-本地和vuex里的都清空
    removeStorage('token')
    store.commit('clearToken')
    // store.commit('模块名/mutations名字')

    setTimeout(() => {
      router.push({
        name: 'Login'
      })
    }, 1000) // 给用户500毫米反应
  }
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 问题: 如果以后换网络请求库, ajax的$.ajax()
// 配置项: url, type, data
// 解决: 中间加一层函数, 自己处理外面传进来了的值
// 函数形参 - 对象的解构赋值, 一个个值接到变量上
export default ({ url, method = 'GET', data = {}, headers = {}, params = {} }) => {
  const PromiseA = axios({
    url,
    method,
    data,
    headers,
    params
  })
  return to(PromiseA) // 开整-网络请求
  // 假如替换了请求库
  //   return new Promise((resolve, reject) => {
  //     // 如果有params写js原生代码, 把params对象里的值, 拼接到url后面去
  //     $.ajax({
  //       url,
  //       type: method,
  //       data,
  //       headers,
  //       success (res) {
  //         resolve(res)
  //       },
  //       error (err) {
  //         reject(err)
  //       }
  //     })
  //   })
}
