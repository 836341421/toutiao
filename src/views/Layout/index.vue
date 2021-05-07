<template>
  <div>
    <div class="main">
        <!-- 二级路由显示区域 -->
        <router-view></router-view>
    </div>
    <!-- TabBar底部导航 -->
    <van-tabbar route>
      <van-tabbar-item icon="home-o" to="/layout/home">首页</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/layout/my">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.main{
  padding-bottom: 50px;
}
</style>
