<template>
  <div id="app">
    <!-- 缓存路由组件 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
</style>
