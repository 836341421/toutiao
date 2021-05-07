import axios from '@/utils/request' // 网络请求库

// 接口请求 - 方法

// 获取-用户-已选频道
// 如果不携带token-返回默认的频道
// 如果有token并携带-返回此用于的频道数据
export const userChannel = () => axios({
  url: '/v1_0/user/channels'
})

// 获取-所有频道
export const allChannel = () => axios({
  url: '/v1_0/channels'
})

// 更新-用户已选频道
export const updateChannel = data => axios({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data
})

// 获取-首页-文章列表
export const getArticleList = params => axios({
  url: '/v1_1/articles',
  params // url?后面
})

// 文章-不感兴趣
export const dislike = data => axios({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data
})

// 文章-举报
export const reports = data => axios({
  url: '/v1_0/article/reports',
  method: 'POST',
  data
})
