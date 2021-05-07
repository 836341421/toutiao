<template>
  <div class="cell_wrap" @click="$router.push(`/detail/${artObj.art_id}`)">
    <!-- 一条文章 -->
    <van-cell>
      <!-- 标题 -->
      <template #title>
        <div class="title-box">
          <span>{{ artObj.title }}</span>
          <!-- 单图 -->
          <img
            v-if="artObj.cover.type === 1"
            v-lazy="artObj.cover.images[0]"
            alt=""
            class="thumb"
          />
        </div>
        <!-- 三图 -->
        <div v-if="artObj.cover.type > 1" class="thumb-box">
          <img
            class="thumb"
            v-lazy="str"
            v-for="(str, index) in artObj.cover.images"
            :key="index"
          />
        </div>
      </template>
      <template #label>
        <div class="label-box">
          <span
            >{{ artObj.aut_name }} &nbsp;&nbsp;&nbsp;
            {{ artObj.comm_count }}评论 &nbsp;&nbsp;&nbsp;
            {{ $timeTo(artObj.pubdate) }}
          </span>
          <van-icon v-show="closeShow" name="cross" @click.stop="show = true" />
        </div>
      </template>
    </van-cell>
    <!-- 文章的底部反馈面板
      这个组件文件复制走直接就带反馈面板
      get-container="body" - 设置弹出层, 挂载到哪里 (body上以后可以挡住整个list组件-你也触碰不到了)
      遮罩层
     -->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      @select="onSelect"
      cancel-text="取消"
      get-container="body"
    />

    <!-- 静态(html+css) + 数据铺设 + js动态交互效果(前) + 接入后台 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      actions: [],
      oneActions: [
        { name: '不感兴趣' },
        { name: '反馈垃圾内容' },
        { name: '拉黑作者' }
      ]
    }
  },
  props: {
    artObj: Object,
    closeShow: {
      type: Boolean,
      default: true // 默认出现
    } // 控制x是否显示
  },
  created () {
    this.actions = this.oneActions // 默认一套反馈面板数据
  },
  methods: {
    onSelect (action) {
      // 反馈面板 - 选择事件
      // 参数1: 绑定的数据对象{name: '不感兴趣'}
      // 参数2: 索引
      if (action.name === '反馈垃圾内容') {
        // 切换数据源/显示隐藏另外一套actionsSheet
        this.actions = [
          {
            value: -1,
            name: '返回'
          },
          {
            value: 0,
            name: '其它问题'
          },
          {
            value: 1,
            name: '标题夸张'
          },
          {
            value: 2,
            name: '低俗色情'
          },
          {
            value: 3,
            name: '错别字多'
          },
          {
            value: 4,
            name: '旧闻重复'
          },
          {
            value: 6,
            name: '内容不实'
          },
          {
            value: 8,
            name: '侵权'
          },
          {
            value: 5,
            name: '广告软文'
          },
          {
            value: 7,
            name: '涉嫌违法犯罪'
          }
        ]
      } else if (action.name === '返回') {
        this.actions = this.oneActions
      } else { // 其他选项都是删除文章
        // 删除文章
        this.$emit('removeArt', this.artObj.art_id, action.value) // action.value举报类型0-8的某个数字
      }
    }
  }
}
</script>

<style scoped lang="less">
/* .cell_wrap /deep/ .van-icon-cross{
    display: flex;
    align-items: flex-end;
    padding-bottom: 2px;
} */

/* 方式2: 自定义cell的标题和label */
.title-box {
  // 标题样式
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.label-box {
  // label描述样式
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.thumb {
  // 矩形黄金比例：0.618
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
