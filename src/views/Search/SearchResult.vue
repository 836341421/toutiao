<template>
  <div class="search-result-container">
    <!-- 点击实现后退效果 -->
    <van-nav-bar
      title="搜索结果"
      left-arrow
      @click-left="$router.go(-1)"
      fixed
    />
    <!-- 搜索结果类表 -->
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="10"
      >
        <ArticleItem
          v-for="item in list"
          :key="item.art_id"
          :artObj="item"
          :closeShow="false"
        ></ArticleItem>
      </van-list>
    </div>
  </div>
</template>

<script>
import { searchResultAPI } from '@/api'
import ArticleItem from '@/components/ArticleItem'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [], // 搜索结果数组
      loading: false, // 控制底部加载中状态
      finished: false, // 是否全部 - 加载完成
      page: 1 // 当前第几页数据
    }
  },
  methods: {
    onLoad () {
      // 加载更多方法
      // 问题: onLoad在当前组件页面, 第一次显示时, 会不会执行一次?
      // 原因: list内没有数据, 撑不开list, list没有高度, 底部现在就出现在屏幕上, loading还是false, 所以list内部判定你到底了, 触发一次onload方法
      // 解决: 不用created了, 直接在onLoad里请求第一次第一页的数据
      this.getList()
      this.page++ // 为下一次做准备
    },
    async getList () {
      // 获取搜索结果数据
      // 提取, url上路径中关键字
      const [, res] = await searchResultAPI({
        q: this.$route.params.kw,
        page: this.page
      })
      console.log(res)
      if (res.data?.data?.results?.length === 0) {
        this.finished = true // 全部加载完毕(无更多数据了) - list也不会再触发onload了
        return
      }
      this.list = [...this.list, ...res.data.data.results]
      this.loading = false // 底部加载中关闭, 自动监测到底, 再次触发onload, 小于300临界值, 再次触发onLoad
    }
  },
  components: {
    ArticleItem
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
