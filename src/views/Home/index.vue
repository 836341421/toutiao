<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar fixed>
      <template #left>
        <!-- <van-image class="logo" :src="require('../../assets/toutiao_logo.png')" /> -->
        <img class="logo" src="../../assets/toutiao_logo.png" alt="" />
      </template>
      <template #right>
        <van-icon name="search" color="white" size="0.48rem" @click="$router.push({name: 'Search'})"/>
      </template>
    </van-nav-bar>
    <!-- Tab导航 -->
    <div class="tabs_content">
      <!-- https://www.runoob.com/try/try.php?filename=trycss_position_sticky 粘性布局 -->
      <van-tabs v-model="active"  sticky offset-top="1.22666667rem">
        <van-tab
          v-for="obj in userList"
          :key="obj.id"
          :title="obj.name"
          :name="obj.id"
        >
          <!-- 文章列表内容区域(点击tab导航, 切换的是这个地方的标签在下面) -->
          <!-- (重要): 每个tab导航对应自己的ArticleList(每次循环都是独立的) -->
          <van-pull-refresh
            v-model="isLoading"
            @refresh="onRefresh"
            loading-text=" "
          >
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              offset="10"
            >
              <ArticleList
                :list="articleList"
                @removeA="removeFn"
              ></ArticleList>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
    <!-- +号频道管理 -->
    <van-icon name="plus" size="0.37333333rem" class="moreChannels" @click="show = true"/>
    <!-- 弹出层组件 -->
    <!-- close-on-click-overlay 是否在点击遮罩层后关闭（false 不关闭）(点击空白的地方不关闭) -->
    <van-popup v-model="show" :close-on-click-overlay="false">
      <!-- 弹出层上要显示的内容 -->
      <div class="popup-container">
        <!-- 弹出层的头部区域 -->
        <van-nav-bar title="频道管理">
          <template #right>
            <!-- 右上角x按钮-点击关闭弹出层 -->
            <van-icon
              name="cross"
              size="0.37333333rem"
              color="white"
              @click="closeFn"
            />
          </template>
        </van-nav-bar>

        <!-- 弹出层的主体区域 -->
        <div class="pop-body">
          <ChannelEdit v-model="active" :userList="userList" :allList="allList" @updateChannel="updateChannleFn"
          ref="channel"
          @closePop="show = false"
          ></ChannelEdit>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  userChannelAPI,
  allChannelAPI,
  updateChannelAPI,
  getArticleListAPI,
  dislikeArticleAPI,
  reportsAPI
} from '@/api'
import ArticleList from './components/ArticleList'
import ChannelEdit from './ChannelEdit' // 频道编辑组件
import { Toast } from 'vant'
export default {
  data () {
    return {
      active: 0, // tabs导航选中高亮的频道ID
      userList: [], // 用户已选的频道数组
      allList: [], // 所有频道数据
      articleList: [], // 文章数据
      selChannelId: 0, // 选中频道id (默认是0推荐频道)
      isLoading: false, // 下拉里-加载中
      loading: false, // 上拉 (底部) -加载中状态
      finished: false, // 控制是否还有更多数据
      page: 1, // 控制当前要第几页的数据
      show: false // 控制弹出层(编辑频道)是否出现
    }
  },
  watch: {
    active () { // 侦听频道id改变, 重新请求频道下属的文章数据
      this.selChannelId = this.active
      this.articleList = []
      this.page = 1
    }
  },
  async created () {
    const [, res] = await userChannelAPI()
    console.log(res)
    this.userList = res.data.data.channels

    // 获取所有频道数据
    const [, res2] = await allChannelAPI()
    console.log(res2)
    this.allList = res2.data.data.channels
  },
  methods: {
    async getArticleList () {
      // 获取文章列表数据
      const [, articleRes] = await getArticleListAPI({
        channel_id: this.selChannelId,
        timestamp: new Date().getTime().toString(),
        // timestamp: 1556789000001,
        with_top: 1,
        page: this.page
      })
      // 判断无更多数据
      // ?. ES6新出的访问属性的方式: 如果data是undefined 就不会继续往下.了
      if (articleRes.data.data?.results.length === 0) {
        this.finished = true // 底部提示用户没有更多数据了
        return // 阻止代码继续向下
      }
      // articleRes.data.data.results.forEach(obj => this.articleList.push(obj)) // 新页面的数据我们要push到当前数组末尾
      this.articleList = [...this.articleList, ...articleRes.data.data.results]
      console.log(this.articleList)
      // 在这里才是网络请求真正回来了
      // 下拉时, vant组件内会把这个变量改为true, 加载中出现了
      this.isLoading = false // 数据请求成功/失败, 都把下拉-加载中关闭
      this.loading = false // (底部加载更多改成false, 如果不改, 触底就不会再触发onload了)
      Toast.clear() // 关闭轻提示
    },
    // tabFn (nameVal) {
    //   // 切换频道点击事件
    //   // 重要: vant组件-内部得支持事件我们才能使用
    //   // 原因: 因为你@click绑定在了组件身上, 而非实际的标签, 网页上点击的都是实际的标签
    //   // 如果组件内部实现了click你才能用@click绑定 - Tabs组件在van-tabs身上才支持点击事件
    //   this.selChannelId = nameVal // 把选中的频道id保存起来
    //   this.articleList = [] // 清空频道数组里数据, 重新请求
    //   this.page = 1
    //   this.getArticleList()
    // },
    onRefresh () {
      // 下拉刷新
      this.isLoading = false // 加载中圈圈看不见(换成自己轻提示-Toast)
      this.articleList = [] // 清空频道数组里数据, 重新请求
      this.page = 1
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0 // 轻提示窗口 - 不关闭 (在请求完成关闭)
      })
      this.getArticleList()
    },
    onLoad () {
      // 上拉加载更多(list组件触底自动触发, 并且自动loading改为true, 让底部加载中出现)
      this.getArticleList()
      this.page++
    },
    async removeFn (art_id, type) {
      // 删除文章
      const index = this.articleList.findIndex((obj) => obj.art_id === art_id) // 找到文章id匹配的元素下标
      this.articleList.splice(index, 1)

      if (type === undefined) {
        // 无值就是不感兴趣
        // 不感兴趣
        await dislikeArticleAPI({
          target: art_id
        })
      } else {
        // type有值就是举报
        await reportsAPI({
          target: art_id,
          type: type
        })
      }
      // 数据删除后少了一个, 解决方案:
      // 方案1: 找后台在这个接口返回一个后补数据 (性能高)
      // 方案2: 获取当前列表数据(从1页, 重新拿数据)
      this.page = 1
      this.articleList = []
      this.getArticleList()
    },
    async updateChannleFn (userChannleList) {
      // 目标: 手动修改发给后台的参数
      // 注意: 让这个数组和里面的数组脱离关系
      // 因为我要修改数组里的字段, 内部引用关系也会跟着变
      let arr = JSON.parse(JSON.stringify(userChannleList)) // (深拷贝)arr和userChannelList以及内部数组无任何瓜葛
      arr = arr.map((obj, index) => {
        // obj默认{id: xx, name: xx}
        delete obj.name // 删除obj对象里name字段和值
        obj.seq = index
        return obj
      })
      arr.splice(0, 1)
      await updateChannelAPI({ // 把准备好的频道数据, 发给后台保存起来
        channels: arr
      })
    },
    closeFn () { // 弹出层右上角关闭事件
      this.show = false
      this.$refs.channel.isShow = false // 把ChannelEdit内的变量设置回初始化状态
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  }
  // 目标: 上拉加载更多
  // 1. 集成van-list组件(注册-使用-定义变量)
  // 2. 思路: 后台传page参数-告诉后台我要第几页的数据 (准备data里page:1)
  // 3. onLoad执行(list组件触底了自动执行), this.page++页码+1, 再调用请求方法(拿到下一页的数据)
  // 4. 把新的数据放到当前数组的末尾处(页面更新更多) - (切记:不要忘了给loading: false) - 让下次触底正常触发
  // 细节:
  // 1. 没有更多数据, 判断数组长度为0, list提示没有更多数据(finished: true)
  // 2. 加载更多以后, 下拉刷新, 页码一定要改为1

  // 目标: 图片懒加载
  // 延迟加载, 提高性能(只显示页面上的见的这一屏数据)
  // 图片懒加载: 在图片出现在网页可视区域时, 再去加载图片地址显示图片
  // 原理:
  // 1. 先不给img的src属性赋值, 保存在另一个属性上
  // 2. 滚出去的+屏幕高度 大于 图片距离顶部值, 给当前img设置src
  // 使用:
  // vant组件库 v-lazy替代src属性

  // 目标: 点击+出现编辑频道的遮罩增
  // 1. 先准备弹出层van-popup(根据文档指示使用)
  // 2. 点击+, 设置van-popup的v-model为true (遮罩层)出现
  // 3. 自定义van-popup内的自定义内容(头部导航, 下面内容区域) - 内容区域封装了一个组件ChannelEdit.vue (注册使用)
  // 4. 调整弹出层内容宽度和高度为100%
}
</script>

<style scoped lang="less">
.tabs_content {
  padding-top: 46px;
}
.logo {
  width: 115px;
  height: 37px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}

// 弹出层容器宽度高度铺满屏幕
/*频道编辑弹出层 */
.van-popup{
  width: 100%;
  height: 100%;
}
// .edit_wrap {
//   width: 100%;
//   height: 100%;
// }
</style>
