<template>
  <div id="app">
    <div class="box"></div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.box {
  width: 375px;
  height: 200px;
  background-color: #f40e;
}
</style>
