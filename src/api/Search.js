import axios from '@/utils/request'

// 获取 - 搜索联想菜单
export const suggestList = params => axios({
  url: '/v1_0/suggestion',
  params
})

// 获取 - 搜索结果列表
export const searchResult = params => axios({
  url: '/v1_0/search',
  params
})
