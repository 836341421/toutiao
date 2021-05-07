// 统一出口对外导出使用
import { login } from './Login' // 引了Login的请求方法
import { userChannel, allChannel, updateChannel, getArticleList, dislike, reports } from './Home'
import { suggestList, searchResult } from './Search'
import { articleDetail, followings, unfollowings, articleAttitude, unArticleAttitude, commentList, commentLike, unCommentLike } from './Article'

export const loginAPI = login // loginAPI变量里装的是一个函数(内部带着axios请求方法)
export const userChannelAPI = userChannel // 获取 - 用户已选频道
export const allChannelAPI = allChannel // 获取 - 所有频道
export const updateChannelAPI = updateChannel // 更新 - 用户选择频道
export const getArticleListAPI = getArticleList // 获取 - 文章列表
export const dislikeArticleAPI = dislike // 反馈 - 不感兴趣文章
export const reportsAPI = reports // 反馈 - 举报文章
export const suggestListAPI = suggestList // 搜索 - 联想菜单
export const searchResultAPI = searchResult // 搜索 - 结果列表
export const articleDetailAPI = articleDetail // 文章 - 详情获取
export const followingsAPI = followings // 文章 - 作者 - 关注
export const unfollowingsAPI = unfollowings // 文章 - 作者 - 取消关注
export const articleAttitudeAPI = articleAttitude // 文章 - 点赞
export const unArticleAttitudeAPI = unArticleAttitude // 文章 - 取消点赞
export const commentListAPI = commentList // 文章 - 评论列表
export const commentLikeAPI = commentLike // 文章 - 点赞
export const unCommentLikeAPI = unCommentLike // 文章 - 取消点赞
