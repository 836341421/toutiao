<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list">
      <!-- 评论的 Item 项 -->
      <!-- 评论都是对本文章的评论,文章id都是一样的,不要作为key,
      key的值唯一不重复的字符串或数字 -->
      <div class="cmt-item" v-for="obj in list" :key="obj.com_id">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="obj.aut_photo" alt="" class="avatar">
            <span class="uname">{{ obj.aut_name }}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon v-if="obj.is_liking" name="like" size="16" color="red" @click="loveFn(obj, false)"/>
            <van-icon v-else name="like-o" size="16" color="gray" @click="loveFn(obj, true)"/>
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">
          基于字体的图标集，可以通过 Icon 组件使用，也可以在其他组件中通过 icon 属性引用。基于字体的图标集，可以通过 Icon 组件使用，也可以在其他组件中通过 icon 属性引用。
        </div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{ $timeTo(obj.pubdate)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { commentLikeAPI, unCommentLikeAPI } from '@/api'
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    async loveFn (obj, bool) {
      obj.is_liking = bool
      if (bool === true) { // 要点赞
        const [, res] = await commentLikeAPI({
          target: obj.com_id // 评论id
        })
        console.log(res)
      } else { // 取消点赞
        const [, res] = await unCommentLikeAPI(obj.com_id)
        console.log(res)
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
</style>
