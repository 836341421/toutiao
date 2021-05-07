<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ artObj.title }}</h1>

      <!-- 用户信息 -->
      <van-cell
        center
        :title="artObj.aut_name"
        :label="$timeTo(artObj.pubdate)"
      >
        <template #icon>
          <img :src="artObj.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <!-- 当前位置显示的是按钮("将要"被点的, 告诉用户点的时候要什么服务) -->
            <!-- 未关注false, 第一个按钮不显示, 显示第二个 -->
            <van-button
              v-if="artObj.is_followed"
              type="info"
              size="mini"
              @click="followedFn(false)"
              >已关注</van-button
            >
            <van-button
              v-else
              icon="plus"
              type="info"
              size="mini"
              plain
              @click="followedFn(true)"
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <!-- v-html因为文章的内容是富文本(html字符串) -->
      <div class="art-content" v-html="artObj.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          v-if="artObj.attitude && artObj.attitude !== -1"
          icon="good-job"
          type="danger"
          size="small"
          @click="attitudeFn(false)"
          >已点赞</van-button
        >
        <van-button
          v-else
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          @click="attitudeFn(true)"
          >点赞</van-button
        >
      </div>
    </div>

    <!-- 文章评论 -->
    <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad">
    <Comment :list="commentList"></Comment>
    </van-list>

    <!-- 发布评论 -->
    <div :class="commentShow ? 'art-cmt-container-1':'art-cmt-container-2'">
      <!-- 底部添加评论区域 - 1 -->
      <div class="add-cmt-box van-hairline--top" v-if="commentShow">
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div" @click="commentShow = false">发表评论</div>
        <div class="icon-box">
          <van-badge :content="totalCount > 0 ? totalCount : ''" max="99">
            <!-- content="cmtlist.length > 0 ? cmtlist.length: ''"
            :max="99" -->
            <van-icon name="comment-o" size="0.53333333rem" @click="lookComFn"/>
          </van-badge>
          <van-icon name="star-o" size="0.53333333rem" />
          <van-icon name="share-o" size="0.53333333rem" />
        </div>
      </div>

      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea placeholder="友善评论、理性发言、阳光心灵" v-focus @blur="commentShow = true"></textarea>
        <van-button type="default" disabled>发布</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  articleDetailAPI,
  followingsAPI,
  unfollowingsAPI,
  articleAttitudeAPI,
  unArticleAttitudeAPI,
  commentListAPI
} from '@/api'
import Comment from './Comment'
export default {
  data () {
    return {
      artObj: {}, // 文章详情对象
      commentList: [], // 评论数据
      commentShow: true, // 底部发布评论组件显示/隐藏
      totalCount: 0, // 当前文章评论总数量
      loading: false, // 底部加载中
      finished: false, // 是否全部加载完成
      lastId: null // 下一页的评论数据从哪一个时间开始(要发给后台的参数)
    }
  },
  async created () {
    const [, res] = await articleDetailAPI(this.$route.params.a_id) // 路由路径规则里定义的参数名
    this.artObj = res.data.data
    // 总结:
    // 前端路由传参
    // router/index.js - 路由规则path: "/detail/:a_id"
    // 上一页ArticleItem.vue -> /detail/1390789
    // 这页Article/index.vue ($route.params.a_id) 1390780取在了原地

    // 给后端传值
    // 后端要求我们也在axios的url路径上传值
    // 后端接口名: /v1_0/articles/:id  (这一块id没任何意义, 只是告诉你这里要传id值)
    // axios请求的时候: url: `/v1_0/articles/${id}`

    //   请求: 评论列表数据
    this.getCommentList()
  },
  methods: {
    lookComFn () { // 点击 - 显示评论区顶端
    // 1. 点击直接滚动过去
    //   window.scrollTo(0, document.querySelector('.article-container').offsetHeight)

      // 2. 点击滚动带动画(js动画)
      //   const dist = document.querySelector('.article-container').offsetHeight // 文章高度就是你要滚动的距离
      //   const step = dist / 10 // 步长(一次迈(滚动)出去的距离)
      //   window.scrollTo(0, step)

      //   3. 缓冲动画(先快后慢)(在上面滚动到下面)
      //   const now = window.scrollY // 已(卷起)的Y值(每次都变)
      //   const dist = document.querySelector('.article-container').offsetHeight// 文章高度就是你要滚动的距离(每次固定)
      //   const step = (dist - now) / 10 // 剩余要走的值/10(10可以随便写,但是10左右效果最好)-剩余要走的每次步长
      //   setTimeout(() => {
      //     if (step < 1) {
      //       window.scrollTo(0, dist)
      //       return
      //     }
      //     window.scrollTo(0, now + step)
      //     this.lookComFn()
      //   }, 10)
      // },
      // async getCommentList () { // 获取评论数据
      //   const [, res] = await commentListAPI({
      //     type: 'a',
      //     source: this.artObj.art_id
      //   })
      //   console.log(res)
      //   this.commentList = res.data.data.results

      // 4. 动画(下到上滚动)
      //   const now = window.scrollY // 已(卷起)的Y值(每次都变)
      //   const dist = document.querySelector('.article-container').offsetHeight// 文章高度就是你要滚动的距离(每次固定)
      //   const step = (dist - now) / 10 // 剩余要走的值/10(10可以随便写,但是10左右效果最好)-剩余要走的每次步长
      //   console.log(step)
      //   setTimeout(() => {
      //     if (Math.abs(step) < 1) { // 判断是否滚动结束
      //       window.scrollTo(0, dist) // 动画停止了,把文章高度设置为卷入值(精度对准)
      //       return
      //     }
      //     window.scrollTo(0, now + step) // 在上一次滚动的距离+本次要滚动的
      //     this.lookComFn() // 递归->为了下次再滚动一次
      //   }, 10)

      //   5.(无评论-文章足够长,看文章id:23626)
      //   (重要):window.scrollTo(),无论设置多少,不能让网页中间留白
      const now = window.scrollY
      let dist = document.querySelector('.article-container').offsetHeight
      //   文章高度-可视窗口高度(剩余可滚动距离)
      if (dist > document.documentElement.scrollHeight - window.innerHeight) {
        dist = document.documentElement.scrollHeight - window.innerHeight
      }
      const step = (dist - now) / 10
      //   if (document.querySelector('.article-container').offsetHeight < dist) {
      //     dist = document.querySelector('.article-container').offsetHeight - window.innerHeight
      //   }
      console.log(step)
      setTimeout(() => {
        if (Math.abs(step) < 1) {
          window.scrollTo(0, dist)
          return
        }
        window.scrollTo(0, now + step) // 在上一次滚动的距离+本次要滚动的
        this.lookComFn() // 递归->为了下次再滚动一次
      }, 10)
    },

    async getCommentList () { // 获取评论数据
      const [, res] = await commentListAPI({
        type: 'a',
        source: this.$route.params.a_id,
        offset: this.lastId // 如果你传入null给axios,axioshuizidonghulue当前key和value(不携带)
      })
      if (res?.data?.data?.results.length === 0) {
        // 没有更多数据
        this.finished = true
      }
      this.commentList = [...this.commentList, ...res.data.data.results]
      this.totalCount = res.data.data.total_count
      this.lastId = res.data.data.last_id // 保存"每次"的last_id
      this.loading = false // 加载了list里数据,底部加载中(暂时关闭)-保证list触底能正常再次触发load事件
    },
    async followedFn (bool) {
      // 作者: 关注/已关注 - 点击事件
      this.artObj.is_followed = bool
      if (bool === true) {
        // 要关注
        const [err] = await followingsAPI({
          target: this.artObj.aut_id
        })
        if (!err) this.$Toast({ message: '关注成功' })
      } else {
        // 取关
        const [err] = await unfollowingsAPI({
          target: this.artObj.aut_id
        })
        if (!err) this.$Toast({ message: '取消关注成功' })
      }
    },
    async attitudeFn (bool) {
      // 文章: 点赞/已点赞 - 点击事件
      this.artObj.attitude = bool
      if (bool === true) {
        // 要点赞
        const [err] = await articleAttitudeAPI({
          target: this.artObj.art_id
        })
        if (!err) this.$Toast({ message: '点赞成功' })
      } else {
        // 取消文章点赞
        const [err] = await unArticleAttitudeAPI({
          target: this.artObj.art_id
        })
        if (!err) this.$Toast({ message: '取消点赞成功' })
      }
    },
    onLoad () { // 触底加载更多
      console.log(111)
      //   请求:评论列表数据
      this.getCommentList()
    }
  },
  components: {
    Comment
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}

/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
