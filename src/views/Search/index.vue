<template>
  <div>
    <!-- 头部导航: -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.go(-1)"
      />
      <!-- 搜索组件 -->
      <van-search
        v-model.trim="kw"
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        v-focus
        ref="search"
      />
    </div>
    <!-- 联想菜单: -->
    <div class="sugg-list" v-if="suggestList.length > 0">
      <div class="sugg-item" v-for="(item, i) in suggestList" :key="i" v-html="lightFn(item)" @click="$router.push({path: `/search_result/${item}`})">
      </div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn"/>
        </template>
      </van-cell>
      <!-- 历史列表 -->
      <div class="history-list">
        <span class="history-item" v-for="(str, index) in history" :key="index + 'b'" @click="historyFn(str)">{{ str }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// 节流: 间隔时间 就执行一次 (降低触发的频率)
// 防抖: n秒后, 只执行一次 (如果再次触发重新计时)
// 提高性能
import { suggestListAPI } from '@/api'
import { setStorage, getStorage } from '@/storage/local'
export default {
  data () {
    return {
      kw: '', // 搜索关键字
      timer: '', // 定时器
      suggestList: [], // 联想菜单数据
      history: JSON.parse(getStorage('history')) || [] // 搜索历史
    }
  },
  methods: {
    lightFn (item) { // 关键字高亮
      const reg = new RegExp(this.kw, 'ig') // 全局匹配
      // return item.replace(reg, `<span style="color: red">${item}</span>`)
      return item.replace(reg, val => { // val是正则匹配的字符
        return `<span style="color: red">${val}</span>` // return的结果会替换掉参数1在item里匹配到的文字
      })
    },
    historyFn (str) { // 点击历史项
      this.kw = str
      this.$refs.search.querySelector('input').focus()
    },
    clearFn () { // 清空
      this.history = []
    }
  },
  watch: {
    history: {
      deep: true, // 深度侦听(history侦听变量本身的改变, 例如: history=[])
      handler () {
        // 同步覆盖本地保存
        setStorage('history', JSON.stringify(this.history))
      }
    },
    kw () {
      // 侦听关键字改变
      clearTimeout(this.timer)
      if (this.kw.length === 0) {
        this.suggestList = []
        return
      }
      this.timer = setTimeout(async () => {
        // console.log(this.kw) // 倒计时结束再执行具体逻辑代码, 如果当前函数再次输入值触发, 清掉刚才计时器, 重新来一个
        // if (this.history.indexOf(this.kw) === -1) { // 判断数组里没有的, 我们再push进去
        //   this.history.push(this.kw)
        // } // 把搜索历史存起来
        // 或者
        this.history = Array.from(new Set([...this.history, this.kw]))
        const [, res] = await suggestListAPI({ q: this.kw })
        this.suggestList = res.data.data.options
      }, 300)

      // 节流:
      // if (this.timer) return
      // this.timer = setTimeout(() => {
      //   console.log(this.kw) // 倒计时结束再执行具体逻辑代码, 如果当前函数再次输入值触发, 清掉刚才计时器, 重新发一个新的计时器
      //   this.timer = null
      // }, 900)
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
}

/*搜索建议列表样式 */
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
