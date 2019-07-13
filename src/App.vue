<template>
  <div id="app">
    <!--
        缓存路由组件
        路由组件时动态的，默认情况下切换都会销毁重建
        如果想要在切换的时候保留状态，说白了不要销毁，则使用keep-alive缓存就可以了
    -->
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
