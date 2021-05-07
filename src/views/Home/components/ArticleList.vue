<template>
  <div>
      <!-- 文章列表页面 -->
      <ArticleItem v-for="obj in list" :key="obj.art_id" :artObj="obj" @removeArt="removeFn"></ArticleItem>
  </div>
</template>

<script>
import ArticleItem from '@/components/ArticleItem'
export default {
  props: {
    list: Array
  },
  components: {
    ArticleItem
  },
  methods: {
    removeFn (art_id, type) { // 删除文章
      this.$emit('removeA', art_id, type) // 传给index.vue里removeA事件中
    }
  }
}
</script>

<style>

</style>
