// 登录相关接口
import axios from '@/utils/request'

// 登录方法
export const login = data => axios({
  url: '/v1_0/authorizations',
  method: 'POST',
  data
  /**
   * data: data(前面的data是axios固定配置项, value是形参, 同名简写)
   * data: {
   *  mobile: 13900000000,
   *  code: 246810
   * }
   * // axios为啥传data进去, axios会把data里的key+value放到请求体里 (后台这个接口从请求体提取数据)
   */
})
