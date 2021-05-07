// dayjs专门处理时间日期的
import Vue from 'vue'
// 1. 下载
// 2. 引入注册插件, 语言包
// 3. 分析文档 - 尝试使用
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // import plugin
import 'dayjs/locale/zh-cn' // import locale

dayjs.extend(relativeTime) // use plugin
dayjs.locale('zh-cn') // use locale - 返回中文结果

// 封装工具方法
// 获取目标时间xxxx之前
Vue.prototype.$timeTo = (dateStr) => dayjs().to(dayjs(dateStr))
