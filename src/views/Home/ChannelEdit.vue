<!-- 编辑频道-弹出层(非路由页面) -->
<template>
  <div >
    <!-- 我的频道 -->
    <div class="my-channel-box">
      <!-- 标题区域 -->
      <div class="channel-title">
        <span>我的频道</span>
        <span>{{ isShow ? '点击频道删除' : '点击进入频道'}}</span>
        <span @click="isShow = !isShow">编辑</span>
      </div>
      <!-- 我的频道列表 -->
      <van-row type="flex">
        <van-col
          span="6"
          v-for="(obj, index) in userList"
          :key="obj.id + ' '"
          @click="userChannelFn(obj, index)"
        >
          <div class="channel-item van-hairline--surround">
            {{ obj.name }}
            <!-- 删除的徽标 -->
            <van-badge
              color="transparent"
              class="cross-badge"
              v-show="isShow"
              v-if="obj.id !== 0"
            >
              <template #content>
                <van-icon
                  name="cross"
                  class="badge-icon"
                  color="#cfcfcf"
                  size="12"
                />
              </template>
            </van-badge>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 更多频道(用户未选) -->
    <div class="more-channel-box">
      <div class="channel-title">
        <span>点击添加更多频道：</span>
      </div>
      <!-- 更多频道列表 -->
      <van-row type="flex">
        <van-col span="6" v-for="obj in unSelectList" :key="obj.id" @click="addFn(obj)">
          <div class="channel-item van-hairline--surround">
            {{ obj.name }}
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
// 目标: 控制微标出现/隐藏
// 1. 用一个变量isShow来控制所有微标x出现/隐藏  (如果要是分别独立判断, 对象的属性关联)
// 2. 点击频道按钮 - 取反
// 3. 给提示文字, 分别显示不同的文字
export default {
  data () {
    return {
      isShow: false // 频道右上角小微标是否显示
    }
  },
  props: {
    userList: Array,
    allList: Array,
    value: Number
  },
  methods: {
    userChannelFn (obj, index) { // 点击"已选频道"的事件
      if (this.isShow === true && index !== 0) { // 编辑状态 - 点击是要删除 (第0个推荐频道不允许删除)
        this.userList.splice(index, 1) // userList改变, 下面的计算属性重新计算
        this.$emit('updateChannel', this.userList)
      } else { // 切换频道
        this.$emit('input', obj.id) // 把频道id传给Index.vue中active赋值-> 间接影响tabs的active设置
        this.$emit('closePop') // 让外部把弹出层关闭
      }
    },
    addFn (obj) { // 这里要把点击频道对象, 放到上面 的数组里
      this.userList.push(obj)
      this.$emit('updateChannel', this.userList)
    }
  },
  computed: {
    unSelectList () { // 未选频道数组
      // 在全部频道里, 挨个去已选频道里去查找, 如果找不到就把当前这个频道收集起来, filter遍历后, 返回你未拥有的频道
      return this.allList.filter(objA => {
        const index = this.userList.findIndex(objB => objA.id === objB.id)
        return index === -1
      })
    }
  }
}
</script>

<style scoped lang="less">
.van-popup,
.popup-container {
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.popup-container {
  display: flex;
  flex-direction: column;
}

.pop-header {
  height: 90px;
  background-color: #007bff;
  color: white;
  text-align: center;
  font-size: 14px;
  position: relative;
  .title {
    width: 100%;
    position: absolute;
    bottom: 15px;
  }
}

.pop-body {
  flex: 1;
  overflow: scroll;
  padding: 8px;
  background-color: white;
}

.my-channel-box,
.more-channel-box {
  .channel-title {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    line-height: 28px;
    padding: 0 6px;
  }
}

.channel-item {
  font-size: 12px;
  text-align: center;
  line-height: 36px;
  background-color: #fafafa;
  margin: 5px;
}

/*删除的微标 */
.cross-badge {
  position: absolute;
  right: -3px;
  top: 0;
  border: none;
}

/*提示文字 */
.small_title {
  font-size: 12px;
  color: gray;
}
</style>
