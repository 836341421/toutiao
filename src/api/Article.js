// 文章相关接口方法
import axios from '@/utils/request'

// 文章 - 详情内容
export const articleDetail = id => axios({
  url: `/v1_0/articles/${id}` // 带:意思告诉你这个路径要传入一个具体的"值", 传值的时候"不要带:"
})

// 文章 - 关注作者
export const followings = data => axios({
  url: '/v1_0/user/followings',
  method: 'POST',
  data
})

// 文章 - 取消关注 - 作者
export const unfollowings = data => axios({
  url: `/v1_0/user/followings/${data.target}`,
  method: 'DELETE'
})

// 文章 - 点赞文章
export const articleAttitude = data => axios({
  url: '/v1_0/article/likings',
  method: 'POST',
  data
})

// 文章 - 取消点赞文章
export const unArticleAttitude = data => axios({
  url: `/v1_0/article/likings/${data.target}`,
  method: 'DELETE'
})

// RestFul API 接口风格规范
// url地址相同, 请求方式不同, 让我们的接口更加的"语义化"
/*
例如:
GET     url: /api/book           - 后台返回"所有"图书信息
GET     url: /api/book?page=1    - 后台返回"第一页"图书信息
POST    url: /api/book           - 新增图书
PUT     url: /api/book/:id       - 更新图书(全部替换)
PATCH   url: /api/book/:id       - 更新图书(部分替换)
DELETE  url: /api/book/:id       - 删除图书
*/

// 文章 评论列表
export const commentList = params => axios({
  url: '/v1_0/comments',
  params
})

// 评论 - 点点赞
export const commentLike = data => axios({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data
})

// 评论 - 取消点赞
export const unCommentLike = id => axios({
  url: `/v1_0/comment/likings/${id}`,
  method: 'DELETE'
})
